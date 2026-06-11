// Temporary debug endpoint — DELETE after fixing
import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;
  const boardId = process.env.TRELLO_BOARD_ID;

  if (!key || !token || !boardId) {
    return NextResponse.json({ error: "missing env vars", key: !!key, token: !!token, boardId: !!boardId });
  }

  try {
    const url = `https://api.trello.com/1/boards/${boardId}/cards?fields=id,desc,name&key=${key}&token=${token}`;
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    return NextResponse.json({ status: res.status, boardId, cardCount: Array.isArray(data) ? data.length : "not array", first2: Array.isArray(data) ? data.slice(0, 2).map((c: {id: string; name: string; desc: string}) => ({ id: c.id, name: c.name, descStart: c.desc?.substring(0, 80) })) : data });
  } catch (e) {
    return NextResponse.json({ error: String(e) });
  }
}
