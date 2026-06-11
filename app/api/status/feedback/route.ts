// POST /api/status/feedback
// multipart/form-data: topic, message, file_0..file_4
// → [CLIENT] 💬 comment in Trello + attachments + Telegram notification

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/status/token";
import { checkRateLimit } from "@/lib/status/rateLimit";

const ALLOWED_TOPICS = ["Dizains", "Teksti", "Kaut kas nestrādā", "Cits",
  "Дизайн", "Тексты", "Что-то не работает", "Другое",
  "Design", "Texts", "Something is broken", "Other",
  "Dizainas", "Tekstai", "Kažkas neveikia", "Kita",
  "Disain", "Tekstid", "Midagi ei tööta", "Muu"];

// Magic bytes for image type validation
const IMAGE_MAGIC: Array<[Uint8Array, string]> = [
  [new Uint8Array([0xff, 0xd8, 0xff]), "image/jpeg"],
  [new Uint8Array([0x89, 0x50, 0x4e, 0x47]), "image/png"],
  [new Uint8Array([0x52, 0x49, 0x46, 0x46]), "image/webp"], // RIFF....WEBP
];

async function validateImageFile(file: File): Promise<boolean> {
  if (file.size > 10 * 1024 * 1024) return false;
  const buf = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buf);
  for (const [magic] of IMAGE_MAGIC) {
    if (magic.every((b, i) => bytes[i] === b)) return true;
  }
  return false;
}

function esc(s: string): string {
  return s.replace(/[<>&"']/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#039;" }[c] ?? c)
  );
}

async function addTrelloComment(cardId: string, text: string) {
  const key = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;
  if (!key || !token) return false;

  const res = await fetch(
    `https://api.trello.com/1/cards/${cardId}/actions/comments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, key, token }),
    }
  );
  return res.ok;
}

async function attachFileToTrello(cardId: string, file: File, name: string) {
  const key = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;
  if (!key || !token) return;

  const form = new FormData();
  form.append("key", key);
  form.append("token", token);
  form.append("name", name);
  form.append("file", file, file.name);

  await fetch(`https://api.trello.com/1/cards/${cardId}/attachments`, {
    method: "POST",
    body: form,
  }).catch(() => {});
}

async function notifyTelegram(
  clientRef: string,
  cardId: string,
  topic: string,
  message: string
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const preview = message.slice(0, 200) + (message.length > 200 ? "…" : "");
  const text =
    `💬 <b>Замечание от ${esc(clientRef)} (${esc(topic)})</b>\n` +
    `${esc(preview)}\n\n` +
    `📋 https://trello.com/c/${cardId}`;

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  }).catch(() => {});
}

export async function POST(req: Request) {
  // Auth
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const payload = await verifyToken(raw);
  if (!payload) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { cardId, clientRef } = payload;

  // Rate limit: 3 per hour per cardId
  if (!checkRateLimit(`feedback:${cardId}`, 3, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "rateLimited" }, { status: 429 });
  }

  // Parse form
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "invalidInput" }, { status: 400 });
  }

  const topic = (formData.get("topic") ?? "").toString().trim();
  const message = (formData.get("message") ?? "").toString().trim();

  // Validate
  if (!ALLOWED_TOPICS.includes(topic)) {
    return NextResponse.json({ error: "invalidTopic" }, { status: 400 });
  }
  if (message.length < 10 || message.length > 2000) {
    return NextResponse.json({ error: "invalidMessage" }, { status: 400 });
  }

  // Collect and validate files
  const files: Array<{ file: File; idx: number }> = [];
  for (let i = 0; i < 5; i++) {
    const f = formData.get(`file_${i}`);
    if (!(f instanceof File)) continue;
    const valid = await validateImageFile(f);
    if (!valid) continue;
    files.push({ file: f, idx: i });
  }

  // Build Trello comment
  const comment = `[CLIENT] 💬 ${topic}\n${message}`;

  // Post comment — fail loudly if Trello is down
  const commentOk = await addTrelloComment(cardId, comment);
  if (!commentOk) {
    return NextResponse.json({ error: "trelloError" }, { status: 502 });
  }

  // Attach files (best-effort — don't fail the request if attachments fail)
  for (const { file, idx } of files) {
    const safeName = `client-screen-${idx + 1}.${file.name.split(".").pop()?.toLowerCase() ?? "jpg"}`;
    await attachFileToTrello(cardId, file, safeName);
  }

  // Notify owner
  notifyTelegram(clientRef, cardId, topic, message);

  return NextResponse.json({ ok: true });
}
