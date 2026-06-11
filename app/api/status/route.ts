// GET /api/status
// Returns project status data for the authenticated client.
// Auth: httpOnly cookie `uw_status` with HMAC token.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/status/token";
import {
  fetchStatusFromTrello,
  getCached,
} from "@/lib/status/trelloCache";

export async function GET() {
  // 1. Verify auth cookie
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = await verifyToken(raw);
  if (!payload) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { cardId } = payload;

  // 2. Try cache first
  const cached = getCached(cardId);
  if (cached && !cached.stale) {
    return NextResponse.json(cached);
  }

  // 3. Fetch from Trello
  const fresh = await fetchStatusFromTrello(cardId);

  if (fresh) {
    return NextResponse.json(fresh);
  }

  // 4. Trello unavailable — return stale cache or 503
  if (cached) {
    return NextResponse.json({ ...cached, stale: true });
  }

  return NextResponse.json({ error: "unavailable" }, { status: 503 });
}
