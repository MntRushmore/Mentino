import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import React from "react";
import { renderToString } from "react-dom/server";
import { Layout } from "../views/Layout";
import { Login } from "../views/pages/Login";
import { Signup } from "../views/pages/Signup";
import { supabase } from "../db";
import { hashPassword, verifyPassword } from "../lib/password";
import { signToken } from "../lib/jwt";
import { signupSchema, loginSchema } from "../lib/validation";
import { config } from "../config";

const auth = new Hono();

function html(element: React.ReactElement, status = 200) {
  return new Response("<!DOCTYPE html>" + renderToString(element), {
    status,
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}

// GET /login
auth.get("/login", (c) => {
  return html(
    <Layout title="Log In">
      <Login />
    </Layout>
  );
});

// POST /login
auth.post("/login", async (c) => {
  const body = await c.req.parseBody();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return html(
      <Layout title="Log In">
        <Login error={parsed.error.errors[0].message} />
      </Layout>
    );
  }

  const { email, password } = parsed.data;

  const { data: user, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("email", email.toLowerCase())
    .single();

  if (error || !user) {
    return html(
      <Layout title="Log In">
        <Login error="Invalid email or password" />
      </Layout>
    );
  }

  if (user.is_banned) {
    return html(
      <Layout title="Log In">
        <Login error="This account has been suspended" />
      </Layout>
    );
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return html(
      <Layout title="Log In">
        <Login error="Invalid email or password" />
      </Layout>
    );
  }

  const token = await signToken(user.id, user.role);
  setCookie(c, config.cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: config.jwtExpiryDays * 24 * 60 * 60,
    path: "/",
  });

  return c.redirect("/dashboard");
});

// GET /signup
auth.get("/signup", (c) => {
  return html(
    <Layout title="Sign Up">
      <Signup />
    </Layout>
  );
});

// POST /signup
auth.post("/signup", async (c) => {
  const body = await c.req.parseBody();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return html(
      <Layout title="Sign Up">
        <Signup error={parsed.error.errors[0].message} />
      </Layout>
    );
  }

  const { email, password, first_name, last_name, role } = parsed.data;

  // Check if email already exists
  const { data: existing } = await supabase
    .from("accounts")
    .select("id")
    .eq("email", email.toLowerCase())
    .single();

  if (existing) {
    return html(
      <Layout title="Sign Up">
        <Signup error="An account with this email already exists" />
      </Layout>
    );
  }

  const password_hash = await hashPassword(password);

  const { data: user, error } = await supabase
    .from("accounts")
    .insert({
      email: email.toLowerCase(),
      password_hash,
      role,
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      display_name: `${first_name.trim()} ${last_name.trim().charAt(0)}.`,
      registration_step: 1,
      registration_complete: false,
    })
    .select()
    .single();

  if (error || !user) {
    return html(
      <Layout title="Sign Up">
        <Signup error="Something went wrong. Please try again." />
      </Layout>
    );
  }

  const token = await signToken(user.id, user.role);
  setCookie(c, config.cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: config.jwtExpiryDays * 24 * 60 * 60,
    path: "/",
  });

  return c.redirect("/dashboard");
});

// POST /logout
auth.post("/logout", (c) => {
  deleteCookie(c, config.cookieName, { path: "/" });
  return c.redirect("/");
});

export { auth };
