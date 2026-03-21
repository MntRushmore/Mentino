import { createMiddleware } from "hono/factory";
import { getCookie, deleteCookie } from "hono/cookie";
import { config } from "../config";
import { verifyToken } from "../lib/jwt";
import { supabase } from "../db";
import type { User } from "../types";

// Extend Hono context with user
declare module "hono" {
  interface ContextVariableMap {
    user: User;
  }
}

export const authMiddleware = createMiddleware(async (c, next) => {
  const token = getCookie(c, config.cookieName);

  if (!token) {
    return c.redirect("/login");
  }

  const payload = await verifyToken(token);
  if (!payload) {
    deleteCookie(c, config.cookieName);
    return c.redirect("/login");
  }

  const { data: user, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", payload.sub)
    .single();

  if (error || !user) {
    deleteCookie(c, config.cookieName);
    return c.redirect("/login");
  }

  if (user.is_banned || !user.is_active) {
    deleteCookie(c, config.cookieName);
    return c.redirect("/login");
  }

  c.set("user", user as User);
  await next();
});

// Optional auth — sets user if logged in but doesn't require it
export const optionalAuth = createMiddleware(async (c, next) => {
  const token = getCookie(c, config.cookieName);

  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      const { data: user } = await supabase
        .from("accounts")
        .select("*")
        .eq("id", payload.sub)
        .single();

      if (user && !user.is_banned && user.is_active) {
        c.set("user", user as User);
      }
    }
  }

  await next();
});
