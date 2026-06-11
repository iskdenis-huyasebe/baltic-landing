// lib/status/token.ts
// HMAC-based httpOnly cookie token for status page auth.
// Token payload: { cardId, clientRef, exp }

const ALG = "SHA-256";
const SEP = ".";

function getSecret(): string {
  const s = process.env.STATUS_TOKEN_SECRET;
  if (!s) throw new Error("STATUS_TOKEN_SECRET is not set");
  return s;
}

async function hmac(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: ALG },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Buffer.from(sig).toString("base64url");
}

export interface TokenPayload {
  cardId: string;
  clientRef: string;
  exp: number;
}

/** Create signed token string: base64url(payload) + "." + hmac */
export async function signToken(payload: TokenPayload): Promise<string> {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = await hmac(getSecret(), body);
  return `${body}${SEP}${sig}`;
}

/** Verify and decode token. Returns null if invalid or expired. */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const idx = token.lastIndexOf(SEP);
    if (idx < 0) return null;
    const body = token.slice(0, idx);
    const sig = token.slice(idx + 1);
    const expected = await hmac(getSecret(), body);
    if (sig !== expected) return null;
    const payload: TokenPayload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8")
    );
    if (!payload.cardId || !payload.clientRef || !payload.exp) return null;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export const COOKIE_NAME = "uw_status";
export const COOKIE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
