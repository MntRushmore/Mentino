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
import { moderateUsername } from "../lib/moderation";
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
  const bio = (body.bio as string)?.trim() || null;

  // Moderate first and last name
  const firstMod = moderateUsername(first_name);
  if (!firstMod.clean) {
    return html(<Layout title="Sign Up"><Signup error={firstMod.reason} /></Layout>);
  }
  const lastMod = moderateUsername(last_name);
  if (!lastMod.clean) {
    return html(<Layout title="Sign Up"><Signup error={lastMod.reason} /></Layout>);
  }

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
      is_active: true,
      bio,
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

// In-memory reset tokens: token -> { userId, expires }
const resetTokens = new Map<string, { userId: string; expires: Date }>();

function generateToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
}

// GET /forgot-password
auth.get("/forgot-password", (c) => {
  return html(
    <Layout title="Forgot Password">
      <ForgotPasswordPage />
    </Layout>
  );
});

// POST /forgot-password
auth.post("/forgot-password", async (c) => {
  const body = await c.req.parseBody();
  const email = (body.email as string)?.trim().toLowerCase();

  if (!email) {
    return html(<Layout title="Forgot Password"><ForgotPasswordPage error="Please enter your email address." /></Layout>);
  }

  const { data: user } = await supabase.from("accounts").select("id, first_name").eq("email", email).single();

  // Always show success to prevent email enumeration
  if (user) {
    const token = generateToken();
    resetTokens.set(token, { userId: user.id, expires: new Date(Date.now() + 1000 * 60 * 60) }); // 1 hour

    const resetUrl = `${c.req.url.split("/forgot-password")[0]}/reset-password/${token}`;

    // Try to send email via RESEND_API_KEY if configured
    const resendKey = process.env.RESEND_API_KEY || (typeof Bun !== "undefined" ? Bun.env.RESEND_API_KEY : undefined);
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Mentino <noreply@mentino.com>",
          to: email,
          subject: "Reset your Mentino password",
          html: `<p>Hi ${user.first_name},</p><p>Click the link below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you didn't request this, ignore this email.</p>`,
        }),
      }).catch(() => {});
    } else {
      // Dev mode: log to console
      console.log(`[DEV] Password reset link for ${email}: ${resetUrl}`);
    }
  }

  return html(
    <Layout title="Forgot Password">
      <ForgotPasswordPage sent={true} email={email} />
    </Layout>
  );
});

// GET /reset-password/:token
auth.get("/reset-password/:token", (c) => {
  const token = c.req.param("token");
  const entry = resetTokens.get(token);

  if (!entry || entry.expires < new Date()) {
    return html(
      <Layout title="Reset Password">
        <div className="max-w-md mx-auto mt-16 text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <h1 className="text-xl font-bold text-red-800 mb-2">Link Expired</h1>
            <p className="text-red-700 text-sm mb-4">This reset link has expired or already been used.</p>
            <a href="/forgot-password" className="text-indigo-600 hover:underline font-medium text-sm">Request a new link</a>
          </div>
        </div>
      </Layout>
    );
  }

  return html(
    <Layout title="Reset Password">
      <ResetPasswordPage token={token} />
    </Layout>
  );
});

// POST /reset-password/:token
auth.post("/reset-password/:token", async (c) => {
  const token = c.req.param("token");
  const body = await c.req.parseBody();
  const password = body.password as string;
  const confirm = body.confirm_password as string;

  const entry = resetTokens.get(token);
  if (!entry || entry.expires < new Date()) {
    return html(<Layout title="Reset Password"><ResetPasswordPage token={token} error="This link has expired. Please request a new one." /></Layout>);
  }

  if (!password || password.length < 8) {
    return html(<Layout title="Reset Password"><ResetPasswordPage token={token} error="Password must be at least 8 characters." /></Layout>);
  }
  if (password !== confirm) {
    return html(<Layout title="Reset Password"><ResetPasswordPage token={token} error="Passwords do not match." /></Layout>);
  }

  const { hashPassword } = await import("../lib/password");
  const password_hash = await hashPassword(password);

  await supabase.from("accounts").update({ password_hash }).eq("id", entry.userId);
  resetTokens.delete(token);

  return html(
    <Layout title="Password Reset">
      <div className="max-w-md mx-auto mt-16 text-center">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-emerald-800 mb-2">Password Updated</h1>
          <p className="text-emerald-700 text-sm mb-4">Your password has been reset successfully.</p>
          <a href="/login" className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm">Log In</a>
        </div>
      </div>
    </Layout>
  );
});

function ForgotPasswordPage({ error, sent, email }: { error?: string; sent?: boolean; email?: string }) {
  if (sent) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-emerald-800 mb-2">Check your email</h1>
          <p className="text-emerald-700 text-sm">
            If an account exists for <strong>{email}</strong>, we sent a reset link. Check your inbox (and spam folder).
          </p>
          <p className="text-xs text-gray-400 mt-4">The link expires in 1 hour.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Forgot your password?</h1>
            <p className="text-gray-500 text-sm mt-1">Enter your email and we'll send you a reset link.</p>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">{error}</div>
          )}
          <form method="POST" action="/forgot-password" className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input type="email" id="email" name="email" required autoComplete="email" placeholder="you@example.com"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              Send Reset Link
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Remember it? <a href="/login" className="text-indigo-600 hover:underline font-medium">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordPage({ token, error }: { token: string; error?: string }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Set a new password</h1>
            <p className="text-gray-500 text-sm mt-1">Choose something strong and memorable.</p>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">{error}</div>
          )}
          <form method="POST" action={`/reset-password/${token}`} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New password</label>
              <input type="password" id="password" name="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm" />
            </div>
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
              <input type="password" id="confirm_password" name="confirm_password" required autoComplete="new-password" placeholder="Same password again"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export { auth };
