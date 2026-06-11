// lib/status/trelloCache.ts
// In-memory 60-second cache for Trello card data per cardId.

import { parsePlanFromDesc, getStageFromListId, PlanId } from "./plans";

export interface StatusData {
  clientRef: string;
  projectName: string;
  plan: PlanId;
  stage: number;          // 0 = accepted, 1..N = stages, N+1 = done
  waitingFor: string[];   // wait:texts | wait:photos | wait:approve | wait:domain
  links: {
    design: string | null;
    preview: string | null;
    live: string | null;
  };
  revisions: { used: number; total: number } | null;
  /** Subtasks per stage index (1-based). Key = stage idx, value = array of {name, done} */
  subtasks: Record<number, Array<{ name: string; done: boolean }>>;
  /** ISO string of last Trello activity */
  updatedAt: string;
  /** Due date ISO string (used as launch date for support countdown) */
  dueDate: string | null;
  stale?: boolean;
}

interface CacheEntry {
  data: StatusData;
  fetchedAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

export function getCached(cardId: string): StatusData | null {
  const entry = cache.get(cardId);
  if (!entry) return null;
  const age = Date.now() - entry.fetchedAt;
  if (age > CACHE_TTL_MS * 5) {
    cache.delete(cardId);
    return null;
  }
  return { ...entry.data, stale: age > CACHE_TTL_MS };
}

export function setCache(cardId: string, data: StatusData) {
  cache.set(cardId, { data, fetchedAt: Date.now() });
}

function extractClientRef(desc: string): string {
  const m = desc.match(/CLIENT:\s*(UW-[A-Z0-9]{6})/);
  return m?.[1] ?? "";
}

function extractProjectName(cardName: string): string {
  // Card names like "Tomas — AutoPro Vilnius — Setup €200"
  // Take first two parts
  const parts = cardName.split("—").map((p) => p.trim());
  if (parts.length >= 2) return `${parts[0]} · ${parts[1]}`;
  return cardName;
}

function parseLinks(attachments: Array<{ name: string; url?: string; isUpload?: boolean }>) {
  let design: string | null = null;
  let preview: string | null = null;
  let live: string | null = null;

  // Iterate all, keep last by date (Trello returns attachments in creation order)
  for (const att of attachments) {
    if (!att.url) continue;
    const n = att.name.toLowerCase();
    if (n.startsWith("design:")) design = att.url;
    else if (n.startsWith("preview:")) preview = att.url;
    else if (n.startsWith("live:")) live = att.url;
  }
  return { design, preview, live };
}

function parseWaitLabels(labels: Array<{ name: string }>): string[] {
  const result: string[] = [];
  for (const l of labels) {
    const name = l.name.toLowerCase();
    if (name === "wait:texts") result.push("texts");
    else if (name === "wait:photos") result.push("photos");
    else if (name === "wait:approve") result.push("approve");
    else if (name === "wait:domain") result.push("domain");
  }
  return result;
}

function parseRevisions(
  checklists: Array<{ name: string; checkItems: Array<{ state: string }> }>
): { used: number; total: number } | null {
  const rev = checklists.find((c) => c.name === "Revisions");
  if (!rev) return null;
  const total = rev.checkItems.length;
  const used = rev.checkItems.filter((i) => i.state === "complete").length;
  return { used, total };
}

function parseSubtasks(
  checklists: Array<{ name: string; checkItems: Array<{ name: string; state: string }> }>
): Record<number, Array<{ name: string; done: boolean }>> {
  const result: Record<number, Array<{ name: string; done: boolean }>> = {};
  for (const cl of checklists) {
    // Match "Day 1", "Day 2", etc.
    const m = cl.name.match(/^Day\s+(\d+)$/i);
    if (!m) continue;
    const idx = parseInt(m[1], 10);
    result[idx] = cl.checkItems.map((i) => ({
      name: i.name,
      done: i.state === "complete",
    }));
  }
  return result;
}

export async function fetchStatusFromTrello(
  cardId: string
): Promise<StatusData | null> {
  const key = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;
  if (!key || !token) return null;

  const fields = "name,desc,idList,labels,attachments,due,dateLastActivity";
  const url =
    `https://api.trello.com/1/cards/${cardId}` +
    `?fields=${fields}&checklists=all&key=${key}&token=${token}`;

  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return null;
    const card = await res.json();

    const desc: string = card.desc ?? "";
    const plan = parsePlanFromDesc(desc);
    const stage = getStageFromListId(card.idList, plan);
    const clientRef = extractClientRef(desc);
    const projectName = extractProjectName(card.name);
    const waitingFor = parseWaitLabels(card.labels ?? []);
    const links = parseLinks(card.attachments ?? []);
    const revisions = parseRevisions(card.checklists ?? []);
    const subtasks = parseSubtasks(card.checklists ?? []);

    const data: StatusData = {
      clientRef,
      projectName,
      plan,
      stage,
      waitingFor,
      links,
      revisions,
      subtasks,
      updatedAt: card.dateLastActivity ?? new Date().toISOString(),
      dueDate: card.due ?? null,
    };

    setCache(cardId, data);
    return data;
  } catch {
    return null;
  }
}
