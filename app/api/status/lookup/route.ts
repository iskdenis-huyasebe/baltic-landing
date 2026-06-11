// POST /api/status/lookup
// Принимает { clientRef: "UW-XXXXXX" }, ищет карточку в Trello,
// при успехе выставляет httpOnly cookie и возвращает { ok: true }.

import { NextResponse } from "next/server";
import { signToken, COOKIE_NAME, COOKIE_TTL_MS } from "@/lib/status/token";
import { checkRateLimit } from "@/lib/status/rateLimit";

function getIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function findTrelloCard(clientRef: string): Promise<string | null> {
  const key = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;
  const boardId = process.env.TRELLO_BOARD_ID;
  if (!key || !token || !boardId) return null;

  // Search cards on the board that contain the clientRef in their description
  const url = `https://api.trello.com/1/search?query=${encodeURIComponent(`CLIENT: ${clientRef}`)}&idBoards=${boardId}&modelTypes=cards&card_fields=id,desc,name&key=${key}&token=${token}`;

  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return null;
    const data = await res.json();
    const cards: Array<{ id: string; desc: string }> = data.cards ?? [];
    // Find card whose description contains the exact client ref
    const match = cards.find((c) =>
      c.desc.includes(`CLIENT: ${clientRef}`)
    );
    return match?.id ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const ip = getIP(req);

  // Rate limit: 5 attempts per 10 minutes per IP
  if (!checkRateLimit(`lookup:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "rateLimited" }, { status: 429 });
  }

  let clientRef: string;
  try {
    const body = await req.json();
    clientRef = (body.clientRef ?? "").toString().trim().toUpperCase();
  } catch {
    return NextResponse.json({ error: "invalidInput" }, { status: 400 });
  }

  if (!/^UW-[A-Z0-9]{6}$/.test(clientRef)) {
    return NextResponse.json({ error: "notFound" }, { status: 404 });
  }

  const cardId = await findTrelloCard(clientRef);
  if (!cardId) {
    return NextResponse.json({ error: "notFound" }, { status: 404 });
  }

  // Issue auth token
  const exp = Date.now() + COOKIE_TTL_MS;
  const tokenStr = await signToken({ cardId, clientRef, exp });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, tokenStr, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(COOKIE_TTL_MS / 1000),
  });

  return response;
}
