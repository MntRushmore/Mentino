import { Hono } from "hono";
import React from "react";
import { renderToString } from "react-dom/server";
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
import { optionalAuth } from "./middleware/auth";
import { supabase } from "./db";

export const app = new Hono();

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

  // Fetch featured mentors for the landing page
  const { data: featuredMentors } = await supabase
    .from("mentors")
    .select("career_field, job_title, company, years_experience, topics, accounts!inner(first_name, last_name, bio)")
    .eq("verification_status", "approved")
    .limit(6);

  return render(
    <Layout title="Home" user={user}>
      <Home featuredMentors={featuredMentors || []} />
    </Layout>
  );
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
