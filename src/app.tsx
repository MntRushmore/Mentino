import { Hono } from "hono";
import React from "react";
import { renderToString } from "react-dom/server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Layout } from "./views/Layout";
import { Home } from "./views/pages/Home";
import { auth } from "./routes/auth";
import { register } from "./routes/register";
import { admin } from "./routes/admin";
import { dashboard } from "./routes/dashboard";
import { profile } from "./routes/profile";
import { matching } from "./routes/matching";
import { messages } from "./routes/messages";
import { sessions } from "./routes/sessions";
import { staticPages } from "./routes/static";
import { blog } from "./routes/blog";
import { reports } from "./routes/reports";
import { optionalAuth } from "./middleware/auth";
import { supabase } from "./db";

export const app = new Hono();

// Serve static files from /public
app.use("/images/*", serveStatic({ root: "./public" }));
app.use("/js/*", serveStatic({ root: "./public" }));

// Helper to render full-page HTML
export function render(element: React.ReactElement, status = 200) {
  return new Response("<!DOCTYPE html>" + renderToString(element), {
    status,
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}

// Landing page
app.get("/", optionalAuth, async (c) => {
  const user = c.get("user");

  // Fetch featured mentors + real stats in parallel
  const [featuredResult, studentCountResult, mentorCountResult, matchCountResult] = await Promise.all([
    supabase
      .from("mentors")
      .select("career_field, job_title, company, years_experience, topics, accounts!user_id!inner(first_name, last_name, bio)")
      .eq("verification_status", "approved")
      .limit(6),
    supabase
      .from("accounts")
      .select("*", { count: "exact", head: true })
      .eq("role", "student"),
    supabase
      .from("accounts")
      .select("*", { count: "exact", head: true })
      .eq("role", "mentor"),
    supabase
      .from("matches")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
  ]);

  const stats = {
    students: studentCountResult.count ?? 0,
    mentors: mentorCountResult.count ?? 0,
    activeMatches: matchCountResult.count ?? 0,
  };

  return render(
    <Layout title="Home" user={user} currentPath="/">
      <Home featuredMentors={featuredResult.data || []} stats={stats} />
    </Layout>
  );
});

// Notifications API — for browser push polling
app.get("/api/notifications", async (c) => {
  const { getCookie } = await import("hono/cookie");
  const { verifyToken } = await import("./lib/jwt");
  const { config } = await import("./config");

  const token = getCookie(c, config.cookieName);
  if (!token) return c.json({ unreadMessages: 0, upcomingSessions: [] });

  const payload = await verifyToken(token);
  if (!payload) return c.json({ unreadMessages: 0, upcomingSessions: [] });

  const userId = payload.sub as string;

  // Get user + active match IDs
  const { data: roleRow } = await supabase
    .from("accounts")
    .select("role")
    .eq("id", userId)
    .single();

  let matchIds: string[] = [];
  if (roleRow?.role === "student") {
    const { data: student } = await supabase.from("students").select("id").eq("user_id", userId).single();
    if (student) {
      const { data: m } = await supabase.from("matches").select("id").eq("student_id", student.id).eq("status", "active");
      matchIds = m?.map((x: any) => x.id) || [];
    }
  } else if (roleRow?.role === "mentor") {
    const { data: mentor } = await supabase.from("mentors").select("id").eq("user_id", userId).single();
    if (mentor) {
      const { data: m } = await supabase.from("matches").select("id").eq("mentor_id", mentor.id).eq("status", "active");
      matchIds = m?.map((x: any) => x.id) || [];
    }
  }

  const { count: unreadMessages } = matchIds.length > 0
    ? await supabase.from("messages").select("*", { count: "exact", head: true })
        .in("match_id", matchIds).neq("sender_id", userId).eq("is_read", false)
    : { count: 0 };

  // Upcoming sessions (next 24 hours)
  const nowIso = new Date().toISOString();
  const soonIso = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const { data: upcomingRaw } = matchIds.length > 0
    ? await supabase.from("sessions")
        .select("id, scheduled_at, matches!inner(students!inner(accounts!inner(first_name,last_name)), mentors!inner(accounts!user_id!inner(first_name,last_name)))")
        .in("match_id", matchIds)
        .eq("status", "scheduled")
        .gte("scheduled_at", nowIso)
        .lte("scheduled_at", soonIso)
    : { data: [] };

  const upcomingSessions = (upcomingRaw || []).map((s: any) => ({
    id: s.id,
    scheduled_at: s.scheduled_at,
    other_name: roleRow?.role === "student"
      ? `${s.matches.mentors.accounts.first_name} ${s.matches.mentors.accounts.last_name}`
      : `${s.matches.students.accounts.first_name} ${s.matches.students.accounts.last_name}`,
  }));

  return c.json({ unreadMessages: unreadMessages ?? 0, upcomingSessions });
});

// Auth routes
app.route("/", auth);

// Registration routes
app.route("/", register);

// Admin routes
app.route("/", admin);

// Dashboard & Profile routes
app.route("/", dashboard);
app.route("/", profile);

// Matching routes
app.route("/", matching);

// Messaging routes
app.route("/", messages);

// Session routes
app.route("/", sessions);

// Blog routes
app.route("/", blog);

// Reports & Reviews routes
app.route("/", reports);

// Static pages
app.route("/", staticPages);

// 404 fallback
app.notFound((c) => {
  return render(
    <Layout title="Not Found">
      <div className="text-center py-20">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <p className="text-xl text-gray-500 mb-8">Page not found</p>
        <a href="/" className="text-blue-600 hover:underline font-medium">
          Go back home
        </a>
      </div>
    </Layout>
  );
});
