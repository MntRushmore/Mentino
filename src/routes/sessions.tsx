import { Hono } from "hono";
import React from "react";
import { renderToString } from "react-dom/server";
import { Layout } from "../views/Layout";
import { Badge } from "../views/components/Badge";
import { authMiddleware } from "../middleware/auth";
import { supabase } from "../db";

const sessions = new Hono();

function html(element: React.ReactElement, status = 200) {
  return new Response("<!DOCTYPE html>" + renderToString(element), {
    status,
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}

// GET /sessions — List sessions
sessions.get("/sessions", authMiddleware, async (c) => {
  const user = c.get("user");
  const matchId = c.req.query("match_id");

  // Get user's matches
  let matchIds: string[] = [];
  if (user.role === "student") {
    const { data: student } = await supabase.from("students").select("id").eq("user_id", user.id).single();
    if (student) {
      const { data: matches } = await supabase.from("matches").select("id").eq("student_id", student.id).eq("status", "active");
      matchIds = matches?.map((m: any) => m.id) || [];
    }
  } else if (user.role === "mentor") {
    const { data: mentor } = await supabase.from("mentors").select("id").eq("user_id", user.id).single();
    if (mentor) {
      const { data: matches } = await supabase.from("matches").select("id").eq("mentor_id", mentor.id).eq("status", "active");
      matchIds = matches?.map((m: any) => m.id) || [];
    }
  }

  // Get sessions for these matches
  let sessionData: any[] = [];
  if (matchIds.length > 0) {
    const { data } = await supabase
      .from("sessions")
      .select("*, matches!inner(students!inner(accounts!inner(first_name, last_name)), mentors!inner(accounts!inner(first_name, last_name)))")
      .in("match_id", matchIds)
      .order("scheduled_at", { ascending: false });
    sessionData = data || [];
  }

  // Get active matches for the create form
  let activeMatches: any[] = [];
  if (matchIds.length > 0) {
    const { data } = await supabase
      .from("matches")
      .select("id, students!inner(accounts!inner(first_name, last_name)), mentors!inner(accounts!inner(first_name, last_name))")
      .in("id", matchIds);
    activeMatches = data || [];
  }

  return html(
    <Layout title="Sessions" user={user}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>
        </div>

        {/* Schedule New Session */}
        {activeMatches.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule a Session</h2>
            <form method="POST" action="/sessions/create" className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">With</label>
                <select
                  name="match_id"
                  required
                  defaultValue={matchId || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select a match</option>
                  {activeMatches.map((m: any) => {
                    const other = user.role === "student" ? m.mentors.accounts : m.students.accounts;
                    return (
                      <option key={m.id} value={m.id}>
                        {other.first_name} {other.last_name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  name="scheduled_at"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select
                  name="duration"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="15">15 minutes</option>
                  <option value="30" selected>30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Session List */}
        {sessionData.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500 text-lg mb-2">No sessions yet</p>
            <p className="text-gray-400 text-sm">Schedule your first mentoring session above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessionData.map((session: any) => {
              const otherUser = user.role === "student"
                ? session.matches.mentors.accounts
                : session.matches.students.accounts;
              const isPast = new Date(session.scheduled_at) < new Date();

              return (
                <div key={session.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          Session with {otherUser.first_name} {otherUser.last_name}
                        </h3>
                        <Badge status={session.status} />
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(session.scheduled_at).toLocaleDateString()} at{" "}
                        {new Date(session.scheduled_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-sm text-gray-500">{session.duration_minutes} minutes</p>
                      {session.notes && (
                        <p className="text-sm text-gray-600 mt-2 italic">Notes: {session.notes}</p>
                      )}
                      {session.rating && (
                        <p className="text-sm text-yellow-600 mt-1">
                          Rating: {"★".repeat(session.rating)}{"☆".repeat(5 - session.rating)}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {session.status === "scheduled" && !isPast && (
                        <a
                          href={`/sessions/${session.id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 text-center"
                        >
                          Join
                        </a>
                      )}
                      {session.status === "scheduled" && (
                        <form method="POST" action={`/sessions/${session.id}/cancel`}>
                          <button type="submit" className="text-red-600 hover:text-red-800 text-xs font-medium">
                            Cancel
                          </button>
                        </form>
                      )}
                      {session.status === "completed" && !session.rating && (
                        <a
                          href={`/sessions/${session.id}`}
                          className="text-blue-600 hover:underline text-xs font-medium"
                        >
                          Add Rating
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
});

// POST /sessions/create
sessions.post("/sessions/create", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.parseBody();

  const matchId = body.match_id as string;
  const scheduledAt = body.scheduled_at as string;
  const duration = parseInt(body.duration as string) || 30;

  if (!matchId || !scheduledAt) return c.redirect("/sessions");

  await supabase.from("sessions").insert({
    match_id: matchId,
    scheduled_at: new Date(scheduledAt).toISOString(),
    duration_minutes: duration,
    status: "scheduled",
    room_id: `room-${crypto.randomUUID().slice(0, 8)}`,
    created_by: user.id,
  });

  return c.redirect("/sessions");
});

// GET /sessions/:id — Session room (video stub)
sessions.get("/sessions/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const sessionId = c.req.param("id");

  const { data: session } = await supabase
    .from("sessions")
    .select("*, matches!inner(students!inner(accounts!inner(first_name, last_name)), mentors!inner(accounts!inner(first_name, last_name)))")
    .eq("id", sessionId)
    .single();

  if (!session) return c.redirect("/sessions");

  const otherUser = user.role === "student"
    ? session.matches.mentors.accounts
    : session.matches.students.accounts;

  return html(
    <Layout title="Session Room" user={user}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Video Area (Stub) */}
          <div className="bg-gray-900 aspect-video flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">📹</div>
              <h2 className="text-xl font-semibold mb-2">Video Session</h2>
              <p className="text-gray-400">
                Video calling coming soon! For now, use an external video tool.
              </p>
              <p className="text-gray-500 text-sm mt-2">Room: {session.room_id}</p>
            </div>
          </div>

          {/* Session Info */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Session with {otherUser.first_name} {otherUser.last_name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {new Date(session.scheduled_at).toLocaleString()} &middot; {session.duration_minutes} min
            </p>

            {/* Notes & Rating Form */}
            <form method="POST" action={`/sessions/${sessionId}/complete`} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Notes</label>
                <textarea
                  name="notes"
                  rows={4}
                  defaultValue={session.notes || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                  placeholder="What did you discuss? Key takeaways..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <label key={n} className="cursor-pointer">
                      <input type="radio" name="rating" value={n} className="sr-only" defaultChecked={session.rating === n} />
                      <span className="text-2xl hover:scale-110 transition-transform inline-block">
                        {n <= (session.rating || 0) ? "★" : "☆"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                <textarea
                  name="feedback"
                  rows={2}
                  defaultValue={session.feedback || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                  placeholder="Any feedback about the session..."
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Mark Complete & Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
});

// POST /sessions/:id/complete
sessions.post("/sessions/:id/complete", authMiddleware, async (c) => {
  const sessionId = c.req.param("id");
  const body = await c.req.parseBody();

  await supabase
    .from("sessions")
    .update({
      status: "completed",
      notes: (body.notes as string) || null,
      rating: body.rating ? parseInt(body.rating as string) : null,
      feedback: (body.feedback as string) || null,
    })
    .eq("id", sessionId);

  return c.redirect("/sessions");
});

// POST /sessions/:id/cancel
sessions.post("/sessions/:id/cancel", authMiddleware, async (c) => {
  const sessionId = c.req.param("id");

  await supabase
    .from("sessions")
    .update({ status: "cancelled" })
    .eq("id", sessionId);

  return c.redirect("/sessions");
});

export { sessions };
