import { sign, verify } from "hono/jwt";
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
