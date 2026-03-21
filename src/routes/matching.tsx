import { Hono } from "hono";
import React from "react";
import { renderToString } from "react-dom/server";
import { Layout } from "../views/Layout";
import { Badge } from "../views/components/Badge";
import { authMiddleware } from "../middleware/auth";
import { supabase } from "../db";
import { findMatches } from "../lib/matching";

const matching = new Hono();

function html(element: React.ReactElement, status = 200) {
  return new Response("<!DOCTYPE html>" + renderToString(element), {
    status,
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}

// GET /matching — Browse potential matches
matching.get("/matching", authMiddleware, async (c) => {
  const user = c.get("user");

  if (!user.registration_complete) {
    return c.redirect(`/register/step/${user.registration_step}`);
  }

  if (user.role === "student") {
    const results = await findMatches(user.id);

    return html(
      <Layout title="Find a Mentor" user={user}>
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Find Your Mentor</h1>
            <p className="text-gray-500 mt-1">
              Based on your interests and goals, here are your top mentor matches.
            </p>
          </div>

          {results.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500 text-lg mb-2">No mentors available right now</p>
              <p className="text-gray-400 text-sm">Check back soon as new mentors are being verified.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={result.mentorDbId} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                      {result.mentorUser.first_name?.[0]}
                      {result.mentorUser.last_name?.[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {result.mentorUser.first_name} {result.mentorUser.last_name}
                        </h3>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {result.score}% match
                        </span>
                        {index === 0 && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            Top Match
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {result.mentor.job_title} at {result.mentor.company || "N/A"}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {result.mentor.career_field} &middot; {result.mentor.years_experience} years
                      </p>
                      {result.mentorUser.bio && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {result.mentorUser.bio}
                        </p>
                      )}
                      <p className="text-green-600 text-xs mt-2">{result.reason}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.mentor.topics?.slice(0, 5).map((topic: string) => (
                          <span
                            key={topic}
                            className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <form method="POST" action="/matching/request">
                        <input type="hidden" name="mentor_db_id" value={result.mentorDbId} />
                        <input type="hidden" name="score" value={result.score.toString()} />
                        <input type="hidden" name="reason" value={result.reason} />
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                        >
                          Request Match
                        </button>
                      </form>
                      <a
                        href={`/profile/${result.mentorId}`}
                        className="text-blue-600 hover:underline text-xs font-medium text-center"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // Mentors see their pending requests on the dashboard
  return c.redirect("/dashboard");
});

// POST /matching/request — Student requests a match
matching.post("/matching/request", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.parseBody();

  if (user.role !== "student") {
    return c.redirect("/dashboard");
  }

  const mentorDbId = body.mentor_db_id as string;
  const score = parseFloat(body.score as string) || 0;
  const reason = (body.reason as string) || "";

  // Get student record
  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!student) return c.redirect("/matching");

  // Check for existing match
  const { data: existing } = await supabase
    .from("matches")
    .select("id")
    .eq("student_id", student.id)
    .eq("mentor_id", mentorDbId)
    .in("status", ["pending", "accepted", "active"])
    .single();

  if (existing) {
    return c.redirect("/matching");
  }

  await supabase.from("matches").insert({
    student_id: student.id,
    mentor_id: mentorDbId,
    status: "pending",
    match_score: score,
    match_reason: reason,
    requested_by: "student",
  });

  return c.redirect("/dashboard");
});

// POST /matching/respond — Mentor accepts/rejects
matching.post("/matching/respond", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.parseBody();

  if (user.role !== "mentor") return c.redirect("/dashboard");

  const matchId = body.match_id as string;
  const action = body.action as string;

  if (action === "accept") {
    await supabase
      .from("matches")
      .update({
        status: "active",
        responded_at: new Date().toISOString(),
        started_at: new Date().toISOString(),
      })
      .eq("id", matchId);

    // Increment current_mentees
    const { data: match } = await supabase
      .from("matches")
      .select("mentor_id")
      .eq("id", matchId)
      .single();

    if (match) {
      const { data: mentor } = await supabase
        .from("mentors")
        .select("current_mentees")
        .eq("id", match.mentor_id)
        .single();

      if (mentor) {
        await supabase
          .from("mentors")
          .update({ current_mentees: (mentor.current_mentees || 0) + 1 })
          .eq("id", match.mentor_id);
      }
    }
  } else if (action === "reject") {
    await supabase
      .from("matches")
      .update({
        status: "rejected",
        responded_at: new Date().toISOString(),
      })
      .eq("id", matchId);
  }

  return c.redirect("/dashboard");
});

export { matching };
