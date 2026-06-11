// POST /api/status/approve
// Client clicked "✓ Looks good, continue".
// Creates [CLIENT] ✅ comment in Trello + Telegram notification to owner.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/status/token";

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

async function notifyTelegram(clientRef: string, cardId: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const text = `✅ <b>Клиент ${esc(clientRef)} подтвердил этап</b>\n📋 https://trello.com/c/${cardId}`;
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

export async function POST() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const payload = await verifyToken(raw);
  if (!payload) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { cardId, clientRef } = payload;
  const comment = `[CLIENT] ✅ Подтвердил этап`;

  const ok = await addTrelloComment(cardId, comment);
  if (!ok) {
    return NextResponse.json({ error: "trelloError" }, { status: 502 });
  }

  notifyTelegram(clientRef, cardId);
  return NextResponse.json({ ok: true });
}
