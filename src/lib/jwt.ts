import { sign, verify } from "hono/jwt";
import { setCookie } from "hono/cookie";
import type { Context } from "hono";
import { config } from "../config";

interface TokenPayload {
  sub: string;
  role: string;
  exp: number;
}

export async function signToken(userId: string, role: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + config.jwtExpiryDays * 24 * 60 * 60;
  return sign({ sub: userId, role, exp }, config.jwtSecret);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const payload = await verify(token, config.jwtSecret, "HS256");
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

const DAY = 24 * 60 * 60;

/** Write the session cookie (persistent, survives browser restarts). */
export async function setSessionCookie(c: Context, userId: string, role: string): Promise<void> {
  setCookie(c, config.cookieName, await signToken(userId, role), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: config.jwtExpiryDays * DAY,
    path: "/",
  });
}

/** Sliding session: reissue the cookie at most once a day while the user is active. */
export async function renewSessionIfStale(c: Context, payload: TokenPayload): Promise<void> {
  const issuedAt = payload.exp - config.jwtExpiryDays * DAY;
  if (Math.floor(Date.now() / 1000) - issuedAt > DAY) {
    await setSessionCookie(c, payload.sub, payload.role);
  }
}
