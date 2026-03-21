import bcrypt from "bcryptjs";

export async function hashPassword(plain: string): Promise<string> {
  if (typeof globalThis.Bun !== "undefined") {
    return Bun.password.hash(plain, "bcrypt");
  }
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (typeof globalThis.Bun !== "undefined") {
    return Bun.password.verify(plain, hash);
  }
  return bcrypt.compare(plain, hash);
}
