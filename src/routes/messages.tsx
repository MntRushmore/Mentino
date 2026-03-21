import { Hono } from "hono";
import React from "react";
import { renderToString } from "react-dom/server";
import { Layout } from "../views/Layout";
import { authMiddleware } from "../middleware/auth";
import { supabase } from "../db";
import { moderateText } from "../lib/moderation";

const messages = new Hono();

function html(element: React.ReactElement, status = 200) {
  return new Response("<!DOCTYPE html>" + renderToString(element), {
    status,
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}

// GET /messages — List all conversations
messages.get("/messages", authMiddleware, async (c) => {
  const user = c.get("user");

  // Get user's role-specific ID
  let matchQuery;
  if (user.role === "student") {
    const { data: student } = await supabase.from("students").select("id").eq("user_id", user.id).single();
    if (!student) return c.redirect("/dashboard");
    matchQuery = supabase
      .from("matches")
      .select("*, mentors!inner(accounts!inner(first_name, last_name))")
      .eq("student_id", student.id)
      .eq("status", "active");
  } else {
    const { data: mentor } = await supabase.from("mentors").select("id").eq("user_id", user.id).single();
    if (!mentor) return c.redirect("/dashboard");
    matchQuery = supabase
      .from("matches")
      .select("*, students!inner(accounts!inner(first_name, last_name))")
      .eq("mentor_id", mentor.id)
      .eq("status", "active");
  }

  const { data: activeMatches } = await matchQuery;

  // Get last message + unread count for each match
  const conversations = await Promise.all(
    (activeMatches || []).map(async (match: any) => {
      const { data: lastMsg } = await supabase
        .from("messages")
        .select("content, created_at, sender_id")
        .eq("match_id", match.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const { count: unread } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("match_id", match.id)
        .neq("sender_id", user.id)
        .eq("is_read", false);

      const otherUser = user.role === "student"
        ? match.mentors?.accounts
        : match.students?.accounts;

      return { match, lastMsg, unread: unread || 0, otherUser };
    })
  );

  return html(
    <Layout title="Messages" user={user}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500 text-lg mb-2">No conversations yet</p>
            <p className="text-gray-400 text-sm mb-4">Get matched with a mentor or student to start chatting.</p>
            <a href="/matching" className="text-blue-600 hover:underline font-medium">Find Matches</a>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
            {conversations.map(({ match, lastMsg, unread, otherUser }) => (
              <a
                key={match.id}
                href={`/messages/${match.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold flex-shrink-0">
                  {otherUser?.first_name?.[0]}{otherUser?.last_name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {otherUser?.first_name} {otherUser?.last_name}
                    </h3>
                    {lastMsg && (
                      <span className="text-xs text-gray-400">
                        {new Date(lastMsg.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {lastMsg ? lastMsg.content : "No messages yet"}
                  </p>
                </div>
                {unread > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    {unread}
                  </span>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
});

// GET /messages/:matchId — View message thread
messages.get("/messages/:matchId", authMiddleware, async (c) => {
  const user = c.get("user");
  const matchId = c.req.param("matchId");

  // Verify user is part of this match
  const { data: match } = await supabase
    .from("matches")
    .select("*, students!inner(user_id, accounts!inner(first_name, last_name)), mentors!inner(user_id, accounts!inner(first_name, last_name))")
    .eq("id", matchId)
    .single();

  if (!match) return c.redirect("/messages");

  const isStudent = match.students.user_id === user.id;
  const isMentor = match.mentors.user_id === user.id;
  if (!isStudent && !isMentor) return c.redirect("/messages");

  const otherUser = isStudent ? match.mentors.accounts : match.students.accounts;

  // Get messages
  const { data: threadMessages } = await supabase
    .from("messages")
    .select("*")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });

  // Mark unread messages as read
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("match_id", matchId)
    .neq("sender_id", user.id)
    .eq("is_read", false);

  return html(
    <Layout title={`Chat with ${otherUser.first_name}`} user={user}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <a href="/messages" className="text-gray-400 hover:text-gray-600">
            &larr;
          </a>
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
            {otherUser.first_name[0]}{otherUser.last_name[0]}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {otherUser.first_name} {otherUser.last_name}
            </h1>
            <p className="text-xs text-gray-500">
              {isStudent ? "Your Mentor" : "Your Mentee"}
            </p>
          </div>
          <div className="ml-auto">
            <a href={`/sessions?match_id=${matchId}`} className="text-blue-600 hover:underline text-sm font-medium">
              Schedule Session
            </a>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 min-h-[400px] max-h-[600px] overflow-y-auto">
          {!threadMessages || threadMessages.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400">No messages yet. Say hello!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {threadMessages.map((msg: any) => {
                const isMe = msg.sender_id === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isMe
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${isMe ? "text-blue-200" : "text-gray-400"}`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Send message form */}
        <form method="POST" action={`/messages/${matchId}`} className="flex gap-2">
          <input
            type="text"
            name="content"
            required
            placeholder="Type a message..."
            autoComplete="off"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </Layout>
  );
});

// POST /messages/:matchId — Send a message
messages.post("/messages/:matchId", authMiddleware, async (c) => {
  const user = c.get("user");
  const matchId = c.req.param("matchId");
  const body = await c.req.parseBody();
  const content = (body.content as string)?.trim();

  if (!content) return c.redirect(`/messages/${matchId}`);

  // Verify user is part of this match
  const { data: match } = await supabase
    .from("matches")
    .select("*, students!inner(user_id), mentors!inner(user_id)")
    .eq("id", matchId)
    .eq("status", "active")
    .single();

  if (!match) return c.redirect("/messages");

  const isParticipant = match.students.user_id === user.id || match.mentors.user_id === user.id;
  if (!isParticipant) return c.redirect("/messages");

  // Moderate content
  const modResult = moderateText(content);
  const isFlagged = !modResult.clean;

  await supabase.from("messages").insert({
    match_id: matchId,
    sender_id: user.id,
    content,
    is_flagged: isFlagged,
    flag_reason: modResult.reason || null,
  });

  return c.redirect(`/messages/${matchId}`);
});

export { messages };
