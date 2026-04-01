import { Hono } from "hono";
import React from "react";
import { renderToString } from "react-dom/server";
import { Layout } from "../views/Layout";
import { authMiddleware } from "../middleware/auth";
import { supabase } from "../db";
import { moderateText } from "../lib/moderation";
import { sendEmail, newMessageEmail } from "../lib/email";

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
      .select("*, mentors!inner(accounts!user_id!inner(first_name, last_name))")
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

        <script dangerouslySetInnerHTML={{ __html: `
          document.querySelectorAll('.local-time').forEach(function(el) {
            var utc = el.getAttribute('data-utc');
            if (!utc) return;
            var d = new Date(utc);
            var now = new Date();
            var diff = now - d;
            if (diff < 60000) { el.textContent = 'just now'; }
            else if (diff < 3600000) { el.textContent = Math.floor(diff/60000) + 'm ago'; }
            else if (diff < 86400000) { el.textContent = d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); }
            else { el.textContent = d.toLocaleDateString([],{month:'short',day:'numeric'}); }
          });
        `}} />
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
                      <span className="text-xs text-gray-400 local-time" data-utc={lastMsg.created_at}>
                        {lastMsg.created_at}
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
    .select("*, students!inner(user_id, accounts!user_id!inner(first_name, last_name)), mentors!inner(user_id, accounts!user_id!inner(first_name, last_name))")
    .eq("id", matchId)
    .single();

  if (!match) return c.redirect("/messages");

  const isStudent = match.students.user_id === user.id;
  const isMentor = match.mentors.user_id === user.id;
  if (!isStudent && !isMentor) return c.redirect("/messages");

  const otherUser = isStudent ? match.mentors.accounts : match.students.accounts;
  const otherUserId = isStudent ? match.mentors.user_id : match.students.user_id;

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

  // Check if student should be prompted to rate this mentor (after 5+ messages, only once)
  let showRatingPrompt = false;
  if (isStudent && threadMessages && threadMessages.length >= 5) {
    const { count: ratedCount } = await supabase
      .from("sessions")
      .select("*", { count: "exact", head: true })
      .eq("match_id", matchId)
      .not("rating", "is", null);
    if ((ratedCount || 0) === 0) showRatingPrompt = true;
  }

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
          <div className="ml-auto flex items-center gap-4">
            <a href={`/sessions?match_id=${matchId}`} className="text-blue-600 hover:underline text-sm font-medium">
              Schedule Session
            </a>
            <a href={`/reports/new?reported_id=${otherUserId}`} className="text-gray-400 hover:text-red-500 transition-colors text-xs font-medium flex items-center gap-1" title="Report this user">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H13l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              Report
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
                        className={`text-xs mt-1 local-time ${isMe ? "text-blue-200" : "text-gray-400"}`}
                        data-utc={msg.created_at}
                      >
                        {msg.created_at}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Send message form */}
        <script dangerouslySetInnerHTML={{ __html: `
          // Auto-scroll to bottom
          var msgBox = document.querySelector('.min-h-\\\\[400px\\\\]');
          if (msgBox) msgBox.scrollTop = msgBox.scrollHeight;
          // Convert UTC timestamps to local time
          document.querySelectorAll('.local-time').forEach(function(el) {
            var utc = el.getAttribute('data-utc');
            if (!utc) return;
            var d = new Date(utc);
            var now = new Date();
            var diff = now - d;
            if (diff < 60000) { el.textContent = 'just now'; }
            else if (diff < 3600000) { el.textContent = Math.floor(diff/60000) + 'm ago'; }
            else if (diff < 86400000) { el.textContent = d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); }
            else { el.textContent = d.toLocaleDateString([],{month:'short',day:'numeric'}) + ' ' + d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); }
          });
        `}} />
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

      {/* Rating popup — shown to students after 5+ messages if not yet rated */}
      {isStudent && (
        <div id="chat-rating-modal" className="fixed inset-0 z-50 items-center justify-center" style={{ display: "none" }}>
          <div className="absolute inset-0 bg-black/50" id="chat-rating-backdrop"></div>
          <div className="relative bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 z-10">
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⭐</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">How's it going with {otherUser.first_name}?</h2>
              <p className="text-sm text-gray-500">After {threadMessages?.length || 5}+ messages, your rating helps other students find great mentors.</p>
            </div>
            <form method="POST" action="/reviews" className="space-y-4">
              <input type="hidden" name="mentor_user_id" value={otherUserId} />
              <div>
                <div className="flex justify-center gap-2 mb-1" id="chat-star-row">
                  {[1,2,3,4,5].map((n) => (
                    <label key={n} className="cursor-pointer select-none">
                      <input type="radio" name="rating" value={String(n)} className="sr-only" required />
                      <span className="text-4xl" data-chat-star={n}>☆</span>
                    </label>
                  ))}
                </div>
                <p className="text-center text-xs text-gray-400 h-4" id="chat-star-label"></p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">What's been helpful? <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  name="comment"
                  rows={2}
                  placeholder="e.g. Great advice on college apps, very responsive..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-amber-500 text-white py-2.5 rounded-lg font-medium hover:bg-amber-600 transition-colors">
                  Submit Rating
                </button>
                <button type="button" id="chat-rating-dismiss" className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Later
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <script dangerouslySetInnerHTML={{ __html: `
        var chatModal = document.getElementById('chat-rating-modal');
        var chatBackdrop = document.getElementById('chat-rating-backdrop');
        var chatDismiss = document.getElementById('chat-rating-dismiss');
        var chatStarLabel = document.getElementById('chat-star-label');
        var chatStarLabels = ['','Terrible','Not great','Okay','Good','Amazing'];
        var PROMPT_KEY = 'chat_rated_${matchId}';

        // Auto-show if prompted and not dismissed before
        if (${showRatingPrompt} && !sessionStorage.getItem(PROMPT_KEY)) {
          setTimeout(function() {
            if (chatModal) chatModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
          }, 2000);
        }

        function closeChatModal() {
          if (chatModal) { chatModal.style.display = 'none'; document.body.style.overflow = ''; }
          sessionStorage.setItem(PROMPT_KEY, '1');
        }

        if (chatBackdrop) chatBackdrop.addEventListener('click', closeChatModal);
        if (chatDismiss) chatDismiss.addEventListener('click', closeChatModal);
        document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeChatModal(); });

        // Star interactivity
        if (document.getElementById('chat-star-row')) {
          document.querySelectorAll('#chat-star-row [data-chat-star]').forEach(function(star) {
            var n = parseInt(star.getAttribute('data-chat-star'));
            var input = star.previousElementSibling;
            star.addEventListener('mouseover', function() {
              document.querySelectorAll('#chat-star-row [data-chat-star]').forEach(function(s) {
                var sn = parseInt(s.getAttribute('data-chat-star'));
                s.textContent = sn <= n ? '★' : '☆';
                s.style.color = sn <= n ? '#f59e0b' : '#9ca3af';
              });
              if (chatStarLabel) chatStarLabel.textContent = chatStarLabels[n];
            });
            star.addEventListener('click', function() {
              input.checked = true;
              document.querySelectorAll('#chat-star-row [data-chat-star]').forEach(function(s) {
                var sn = parseInt(s.getAttribute('data-chat-star'));
                s.textContent = sn <= n ? '★' : '☆';
                s.style.color = sn <= n ? '#f59e0b' : '#9ca3af';
              });
              if (chatStarLabel) chatStarLabel.textContent = chatStarLabels[n];
            });
          });
          document.getElementById('chat-star-row').addEventListener('mouseleave', function() {
            var checked = document.querySelector('#chat-star-row input[type=radio]:checked');
            var cn = checked ? parseInt(checked.value) : 0;
            document.querySelectorAll('#chat-star-row [data-chat-star]').forEach(function(s) {
              var sn = parseInt(s.getAttribute('data-chat-star'));
              s.textContent = sn <= cn ? '★' : '☆';
              s.style.color = sn <= cn ? '#f59e0b' : '#9ca3af';
            });
            if (chatStarLabel) chatStarLabel.textContent = cn ? chatStarLabels[cn] : '';
          });
        }
      `}} />
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

  // Send email notification to the other participant
  const recipientId = match.students.user_id === user.id
    ? match.mentors.user_id
    : match.students.user_id;

  const { data: recipient } = await supabase
    .from("accounts")
    .select("email, first_name")
    .eq("id", recipientId)
    .single();

  if (recipient?.email) {
    const baseUrl = new URL(c.req.url).origin;
    sendEmail({
      to: recipient.email,
      subject: `New message from ${user.first_name} on Mentino`,
      html: newMessageEmail({
        recipientName: recipient.first_name,
        senderName: `${user.first_name} ${user.last_name}`,
        preview: content,
        matchId,
        baseUrl,
      }),
    });
  }

  return c.redirect(`/messages/${matchId}`);
});

export { messages };
