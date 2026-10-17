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

interface Person { first_name: string; last_name: string; avatar_url?: string | null }
interface Conversation { match: any; lastMsg: any; unread: number; otherUser: Person }

/** Messages more than 30 minutes apart start a new block with a time divider. */
const GROUP_GAP_MS = 30 * 60 * 1000;

// ── Data ──────────────────────────────────────────────────────────────────

async function loadInbox(user: any): Promise<Conversation[] | null> {
  let matchQuery;
  if (user.role === "student") {
    const { data: student } = await supabase.from("students").select("id").eq("user_id", user.id).single();
    if (!student) return null;
    matchQuery = supabase
      .from("matches")
      .select("*, mentors!inner(accounts!user_id!inner(first_name, last_name, avatar_url))")
      .eq("student_id", student.id)
      .eq("status", "active");
  } else {
    const { data: mentor } = await supabase.from("mentors").select("id").eq("user_id", user.id).single();
    if (!mentor) return null;
    matchQuery = supabase
      .from("matches")
      .select("*, students!inner(accounts!inner(first_name, last_name, avatar_url))")
      .eq("mentor_id", mentor.id)
      .eq("status", "active");
  }
  const { data: activeMatches } = await matchQuery;

  const conversations = await Promise.all(
    (activeMatches || []).map(async (match: any) => {
      const { data: lastMsg } = await supabase
        .from("messages")
        .select("content, created_at, sender_id")
        .eq("match_id", match.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      const { count: unread } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("match_id", match.id)
        .neq("sender_id", user.id)
        .eq("is_read", false);
      const otherUser = user.role === "student" ? match.mentors?.accounts : match.students?.accounts;
      return { match, lastMsg, unread: unread || 0, otherUser };
    })
  );
  return conversations.sort((a, b) => (b.lastMsg?.created_at || b.match.created_at || "").localeCompare(a.lastMsg?.created_at || a.match.created_at || ""));
}

async function loadParticipants(matchId: string) {
  const { data: match } = await supabase
    .from("matches")
    .select("*, students!inner(user_id, accounts!user_id!inner(first_name, last_name, avatar_url)), mentors!inner(user_id, accounts!user_id!inner(first_name, last_name, avatar_url))")
    .eq("id", matchId)
    .single();
  return match;
}

// ── UI pieces ─────────────────────────────────────────────────────────────

function Avatar({ person, size = 56, ring = false }: { person?: Person; size?: number; ring?: boolean }) {
  const initials = `${person?.first_name?.[0] ?? ""}${person?.last_name?.[0] ?? ""}`;
  const style = { width: size, height: size, fontSize: Math.round(size * 0.36) };
  const ringStyle = ring ? { boxShadow: "0 0 0 2px #fff, 0 0 0 4px var(--forest)" } : {};
  return person?.avatar_url ? (
    <img src={person.avatar_url} alt="" className="rounded-full object-cover flex-shrink-0" style={{ ...style, ...ringStyle }} />
  ) : (
    <span className="rounded-full flex items-center justify-center font-semibold text-gray-900 bg-gray-100 flex-shrink-0" style={{ ...style, ...ringStyle }} aria-hidden="true">
      {initials}
    </span>
  );
}

function Inbox({ user, conversations, activeId }: { user: any; conversations: Conversation[]; activeId?: string }) {
  return (
    <aside className={`${activeId ? "hidden md:flex" : "flex"} flex-col border-r border-gray-200 min-h-0`} aria-label="Conversations">
      <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">{user.first_name}</h1>
        <span className="t-meta">Messages</span>
      </div>
      {conversations.length === 0 ? (
        <div className="p-6 text-center my-auto">
          <p className="text-gray-900 font-semibold">No conversations yet</p>
          <p className="text-sm text-gray-600 mt-1">Get matched to start chatting.</p>
          <a href="/matching" className="btn btn-primary btn-sm mt-4">Find a mentor</a>
        </div>
      ) : (
        <ul className="overflow-y-auto flex-1 py-2">
          {conversations.map(({ match, lastMsg, unread, otherUser }) => {
            const active = match.id === activeId;
            const mine = lastMsg?.sender_id === user.id;
            return (
              <li key={match.id}>
                <a href={`/messages/${match.id}`} aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${active ? "bg-gray-100" : "hover:bg-gray-50"}`}>
                  <Avatar person={otherUser} size={56} ring={unread > 0} />
                  <span className="flex-1 min-w-0">
                    <span className={`block text-sm truncate ${unread ? "font-bold text-gray-900" : "text-gray-900"}`}>{otherUser?.first_name} {otherUser?.last_name}</span>
                    <span className={`flex items-center gap-1 text-sm ${unread ? "font-semibold text-gray-900" : "text-gray-500"}`}>
                      <span className="truncate">{lastMsg ? `${mine ? "You: " : ""}${lastMsg.content}` : "Say hello"}</span>
                      {lastMsg && <span className="flex-shrink-0">· <span className="rel-time" data-ts={lastMsg.created_at} /></span>}
                    </span>
                  </span>
                  {unread > 0 && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "var(--forest)" }} aria-label={`${unread} unread`} />}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}

const CHAT_CSS = `
.chat-shell { height: calc(100vh - 168px); min-height: 520px; }
.bubble { max-width: min(75%, 520px); padding: 8px 14px; font-size: 15px; line-height: 20px; border-radius: 22px; white-space: pre-wrap; overflow-wrap: anywhere; }
.bubble-me { background: linear-gradient(135deg, #c2540f, #9a400a); color: #fff; }
.bubble-them { background: #efefef; color: var(--ink); }
.row-me + .row-me .bubble-me { border-top-right-radius: 6px; }
.row-me:has(+ .row-me) .bubble-me { border-bottom-right-radius: 6px; }
.row-them + .row-them .bubble-them { border-top-left-radius: 6px; }
.row-them:has(+ .row-them) .bubble-them { border-bottom-left-radius: 6px; }
.row-them .them-avatar { visibility: hidden; }
.row-them:not(:has(+ .row-them)) .them-avatar { visibility: visible; }
.bubble.pending { opacity: 0.6; }
.composer input:placeholder-shown ~ button { opacity: 0.35; pointer-events: none; }
@keyframes popIn { from { opacity: 0; transform: translateY(6px) scale(0.98); } to { opacity: 1; transform: none; } }
.pop-in { animation: popIn 220ms var(--ease) both; }
`;

const TIME_JS = `
function fmtRel(d) {
  var diff = Date.now() - d;
  if (diff < 60000) return 'now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h';
  if (diff < 604800000) return Math.floor(diff / 86400000) + 'd';
  return Math.floor(diff / 604800000) + 'w';
}
function fmtDivider(d) {
  var now = new Date(), y = new Date(now); y.setDate(now.getDate() - 1);
  var time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (d.toDateString() === now.toDateString()) return 'Today ' + time;
  if (d.toDateString() === y.toDateString()) return 'Yesterday ' + time;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + time;
}
function paintTimes(root) {
  (root || document).querySelectorAll('.rel-time[data-ts]').forEach(function(el) { el.textContent = fmtRel(new Date(el.getAttribute('data-ts'))); });
  (root || document).querySelectorAll('.divider-time[data-ts]').forEach(function(el) { el.textContent = fmtDivider(new Date(el.getAttribute('data-ts'))); });
  (root || document).querySelectorAll('.bubble[data-ts]').forEach(function(el) { el.title = new Date(el.getAttribute('data-ts')).toLocaleString(); });
}
paintTimes();
`;

// ── Inbox page ────────────────────────────────────────────────────────────

messages.get("/messages", authMiddleware, async (c) => {
  const user = c.get("user");
  const conversations = await loadInbox(user);
  if (!conversations) return c.redirect("/dashboard");

  return html(
    <Layout title="Messages" user={user} currentPath="/messages">
      <style dangerouslySetInnerHTML={{ __html: CHAT_CSS }} />
      <div className="max-w-6xl mx-auto">
        <div className="card overflow-hidden chat-shell grid grid-cols-1 md:grid-cols-[360px_1fr]" data-no-reveal>
          <Inbox user={user} conversations={conversations} />
          <section className="hidden md:flex flex-col items-center justify-center text-center p-8">
            <span className="w-24 h-24 rounded-full border-2 border-gray-900 flex items-center justify-center" aria-hidden="true">
              <svg className="w-10 h-10 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </span>
            <h2 className="text-xl font-bold text-gray-900 mt-6">Your messages</h2>
            <p className="text-sm text-gray-600 mt-1">Pick a conversation to keep talking with your {user.role === "student" ? "mentor" : "students"}.</p>
          </section>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: TIME_JS }} />
    </Layout>
  );
});

// ── Thread page ───────────────────────────────────────────────────────────

messages.get("/messages/:matchId", authMiddleware, async (c) => {
  const user = c.get("user");
  const matchId = c.req.param("matchId");

  const match = await loadParticipants(matchId);
  if (!match) return c.redirect("/messages");
  const isStudent = match.students.user_id === user.id;
  const isMentor = match.mentors.user_id === user.id;
  if (!isStudent && !isMentor) return c.redirect("/messages");

  const otherUser: Person = isStudent ? match.mentors.accounts : match.students.accounts;
  const otherUserId = isStudent ? match.mentors.user_id : match.students.user_id;

  const [{ data: threadMessages }, conversations] = await Promise.all([
    supabase.from("messages").select("*").eq("match_id", matchId).order("created_at", { ascending: true }),
    loadInbox(user),
  ]);

  await supabase.from("messages").update({ is_read: true }).eq("match_id", matchId).neq("sender_id", user.id).eq("is_read", false);

  // Prompt students to rate the mentor after 5+ messages, once.
  let showRatingPrompt = false;
  if (isStudent && threadMessages && threadMessages.length >= 5) {
    const { count: ratedCount } = await supabase
      .from("sessions")
      .select("*", { count: "exact", head: true })
      .eq("match_id", matchId)
      .not("rating", "is", null);
    if ((ratedCount || 0) === 0) showRatingPrompt = true;
  }

  const msgs = threadMessages || [];
  const lastMine = [...msgs].reverse().find((m: any) => m.sender_id === user.id);
  const lastOverall = msgs[msgs.length - 1];
  const seen = !!lastMine && lastMine.is_read && lastOverall?.id === lastMine.id;

  return html(
    <Layout title={`Chat with ${otherUser.first_name}`} user={user} currentPath="/messages">
      <style dangerouslySetInnerHTML={{ __html: CHAT_CSS }} />
      <div className="max-w-6xl mx-auto">
        <div className="card overflow-hidden chat-shell grid grid-cols-1 md:grid-cols-[360px_1fr]" data-no-reveal>
          <Inbox user={user} conversations={conversations || []} activeId={matchId} />

          <section className="flex flex-col min-h-0" aria-label={`Conversation with ${otherUser.first_name}`}>
            {/* Header */}
            <header className="h-16 px-4 sm:px-6 flex items-center gap-3 border-b border-gray-200 flex-shrink-0">
              <a href="/messages" className="md:hidden btn btn-ghost btn-sm w-8 px-0" aria-label="Back to inbox">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </a>
              <a href={`/profile/${otherUserId}`} className="flex items-center gap-3 min-w-0">
                <Avatar person={otherUser} size={40} />
                <span className="min-w-0">
                  <span className="block text-base font-semibold text-gray-900 truncate">{otherUser.first_name} {otherUser.last_name}</span>
                  <span className="block text-xs text-gray-500">{isStudent ? "Your mentor" : "Your mentee"}</span>
                </span>
              </a>
              <div className="ml-auto flex items-center gap-1">
                <a href={`/sessions?match_id=${matchId}`} className="btn btn-ghost btn-sm w-10 px-0" aria-label="Schedule a session" title="Schedule a session">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </a>
                <a href={`/reports/new?reported_id=${otherUserId}`} className="btn btn-ghost btn-sm w-10 px-0" aria-label="Report this user" title="Report">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H13l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                </a>
              </div>
            </header>

            {/* Thread */}
            <div id="thread" className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 flex flex-col gap-1" data-match={matchId}
              data-last={lastOverall?.created_at || ""}>
              <div className="flex flex-col items-center text-center pb-8">
                <Avatar person={otherUser} size={88} />
                <p className="text-lg font-semibold text-gray-900 mt-4">{otherUser.first_name} {otherUser.last_name}</p>
                <p className="text-sm text-gray-500">{isStudent ? "Your mentor on Mentino" : "Your mentee on Mentino"}</p>
                <a href={`/profile/${otherUserId}`} className="btn btn-secondary btn-sm mt-4">View profile</a>
              </div>

              {msgs.length === 0 && <p className="text-center text-sm text-gray-500">No messages yet. Say hello.</p>}

              {msgs.map((msg: any, i: number) => {
                const isMe = msg.sender_id === user.id;
                const prev = msgs[i - 1];
                const newBlock = !prev || new Date(msg.created_at).getTime() - new Date(prev.created_at).getTime() > GROUP_GAP_MS;
                return (
                  <React.Fragment key={msg.id}>
                    {newBlock && <p className="divider-time text-center text-xs text-gray-500 my-4" data-ts={msg.created_at} />}
                    <div className={`flex items-end gap-2 ${isMe ? "row-me justify-end" : "row-them"}`}>
                      {!isMe && <span className="them-avatar"><Avatar person={otherUser} size={28} /></span>}
                      <p className={`bubble ${isMe ? "bubble-me" : "bubble-them"}`} data-ts={msg.created_at}>{msg.content}</p>
                    </div>
                  </React.Fragment>
                );
              })}
              <p id="seen" className={`text-right text-xs text-gray-500 mt-1 ${seen ? "" : "hidden"}`}>Seen</p>
            </div>

            {/* Composer */}
            <form id="composer" method="POST" action={`/messages/${matchId}`} className="px-4 sm:px-6 pb-4 pt-2 flex-shrink-0">
              <div className="composer flex items-center gap-2 h-12 pl-5 pr-2 rounded-full border border-gray-300 focus-within:border-gray-900 transition-colors">
                <label htmlFor="msg-input" className="sr-only">Message</label>
                <input id="msg-input" type="text" name="content" required autoComplete="off" maxLength={4000}
                  placeholder="Message..." className="flex-1 bg-transparent text-[15px] outline-none"
                  style={{ border: 0, boxShadow: "none", background: "transparent", padding: 0 }} />
                <button type="submit" className="px-3 h-9 rounded-full text-sm font-semibold transition-opacity" style={{ color: "var(--forest)" }}>Send</button>
              </div>
              <p id="send-error" className="hidden text-xs text-red-600 mt-2 px-4" role="alert">Message not sent. Check your connection and try again.</p>
            </form>
          </section>
        </div>
      </div>

      {/* Rating prompt: shown to students after 5+ messages if not yet rated */}
      {isStudent && (
        <div id="chat-rating-modal" className="fixed inset-0 z-50 items-center justify-center" style={{ display: "none" }}>
          <div className="absolute inset-0 bg-black/50" id="chat-rating-backdrop"></div>
          <div className="relative overlay p-8 max-w-sm w-full mx-4 z-10" role="dialog" aria-modal="true" aria-labelledby="rate-h">
            <div className="text-center mb-6">
              <span className="w-12 h-12 rounded-full bg-clay flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <svg className="w-6 h-6" viewBox="0 0 20 20" fill="var(--forest)"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.3a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.17 0l-2.8 2.03c-.78.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.03 8.73c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69l1.07-3.3z" /></svg>
              </span>
              <h2 id="rate-h" className="text-xl font-bold text-gray-900">How's it going with {otherUser.first_name}?</h2>
              <p className="text-sm text-gray-600 mt-1">Your rating helps other students find great mentors.</p>
            </div>
            <form method="POST" action="/reviews" className="flex flex-col gap-4">
              <input type="hidden" name="mentor_user_id" value={otherUserId} />
              <div>
                <div className="flex justify-center gap-2 mb-1" id="chat-star-row">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <label key={n} className="cursor-pointer select-none">
                      <input type="radio" name="rating" value={String(n)} className="sr-only" required />
                      <span className="text-4xl" data-chat-star={n}>☆</span>
                    </label>
                  ))}
                </div>
                <p className="text-center text-xs text-gray-500 h-4" id="chat-star-label"></p>
              </div>
              <div>
                <label htmlFor="rate-comment" className="block text-sm font-medium text-gray-700 mb-1">What's been helpful? <span className="text-gray-500 font-normal">(optional)</span></label>
                <textarea id="rate-comment" name="comment" rows={2} placeholder="Great advice on college apps, very responsive..." className="w-full px-3 py-2 border resize-none text-sm" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1">Submit rating</button>
                <button type="button" id="chat-rating-dismiss" className="btn btn-secondary">Later</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <script dangerouslySetInnerHTML={{ __html: TIME_JS + `
(function() {
  var thread = document.getElementById('thread');
  var form = document.getElementById('composer');
  var input = document.getElementById('msg-input');
  var seenEl = document.getElementById('seen');
  var errEl = document.getElementById('send-error');
  var matchId = thread.getAttribute('data-match');
  var lastTs = thread.getAttribute('data-last') || new Date(0).toISOString();
  var them = ${JSON.stringify({ first_name: otherUser.first_name, last_name: otherUser.last_name, avatar_url: otherUser.avatar_url || null })};

  function scrollBottom() { thread.scrollTop = thread.scrollHeight; }
  scrollBottom();

  function avatarEl(size) {
    var el;
    if (them.avatar_url) { el = document.createElement('img'); el.src = them.avatar_url; el.alt = ''; el.className = 'rounded-full object-cover flex-shrink-0'; }
    else { el = document.createElement('span'); el.className = 'rounded-full flex items-center justify-center font-semibold text-gray-900 bg-gray-100 flex-shrink-0'; el.textContent = (them.first_name[0] || '') + (them.last_name[0] || ''); el.style.fontSize = Math.round(size * 0.36) + 'px'; }
    el.style.width = el.style.height = size + 'px';
    return el;
  }
  function addBubble(text, mine, ts, pending) {
    var last = thread.querySelector('.bubble[data-ts]:last-of-type');
    var bubbles = thread.querySelectorAll('.bubble[data-ts]');
    var prevTs = bubbles.length ? bubbles[bubbles.length - 1].getAttribute('data-ts') : null;
    if (!prevTs || new Date(ts) - new Date(prevTs) > ${GROUP_GAP_MS}) {
      var d = document.createElement('p'); d.className = 'divider-time text-center text-xs text-gray-500 my-4'; d.setAttribute('data-ts', ts); thread.insertBefore(d, seenEl);
    }
    var row = document.createElement('div');
    row.className = 'flex items-end gap-2 pop-in ' + (mine ? 'row-me justify-end' : 'row-them');
    if (!mine) { var a = document.createElement('span'); a.className = 'them-avatar'; a.appendChild(avatarEl(28)); row.appendChild(a); }
    var b = document.createElement('p');
    b.className = 'bubble ' + (mine ? 'bubble-me' : 'bubble-them') + (pending ? ' pending' : '');
    b.setAttribute('data-ts', ts); b.textContent = text;
    row.appendChild(b);
    thread.insertBefore(row, seenEl);
    paintTimes(thread);
    scrollBottom();
    return b;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    errEl.classList.add('hidden');
    seenEl.classList.add('hidden');
    var bubble = addBubble(text, true, new Date().toISOString(), true);
    var body = new URLSearchParams(); body.set('content', text);
    fetch(form.action, { method: 'POST', body: body, headers: { 'Accept': 'application/json' } })
      .then(function(r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function(data) {
        bubble.classList.remove('pending');
        if (data.message) { bubble.setAttribute('data-ts', data.message.created_at); lastTs = data.message.created_at > lastTs ? data.message.created_at : lastTs; }
      })
      .catch(function() { bubble.parentElement.remove(); input.value = text; errEl.classList.remove('hidden'); });
  });

  function poll() {
    if (document.hidden) return;
    fetch('/messages/' + matchId + '/updates?after=' + encodeURIComponent(lastTs), { headers: { 'Accept': 'application/json' } })
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(data) {
        if (!data) return;
        (data.messages || []).forEach(function(m) { addBubble(m.content, false, m.created_at, false); if (m.created_at > lastTs) lastTs = m.created_at; });
        var lastBubble = thread.querySelector('.row-me:last-of-type');
        var rows = thread.querySelectorAll('.row-me, .row-them');
        var lastRow = rows[rows.length - 1];
        seenEl.classList.toggle('hidden', !(data.seen && lastRow && lastRow.classList.contains('row-me')));
      })
      .catch(function() {});
  }
  setInterval(poll, 4000);
  setInterval(function() { paintTimes(); }, 60000);

  // Rating prompt
  var chatModal = document.getElementById('chat-rating-modal');
  var chatBackdrop = document.getElementById('chat-rating-backdrop');
  var chatDismiss = document.getElementById('chat-rating-dismiss');
  var chatStarLabel = document.getElementById('chat-star-label');
  var chatStarLabels = ['', 'Terrible', 'Not great', 'Okay', 'Good', 'Amazing'];
  var PROMPT_KEY = 'chat_rated_' + matchId;
  function stored(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  if (${showRatingPrompt} && !stored(PROMPT_KEY)) {
    setTimeout(function() { if (chatModal) { chatModal.style.display = 'flex'; document.body.style.overflow = 'hidden'; } }, 2000);
  }
  function closeChatModal() {
    if (chatModal) { chatModal.style.display = 'none'; document.body.style.overflow = ''; }
    try { sessionStorage.setItem(PROMPT_KEY, '1'); } catch (e) {}
  }
  if (chatBackdrop) chatBackdrop.addEventListener('click', closeChatModal);
  if (chatDismiss) chatDismiss.addEventListener('click', closeChatModal);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && chatModal && chatModal.style.display === 'flex') closeChatModal(); });
  var row = document.getElementById('chat-star-row');
  if (row) {
    var stars = row.querySelectorAll('[data-chat-star]');
    function paintStars(n) {
      stars.forEach(function(s) { var sn = +s.getAttribute('data-chat-star'); s.textContent = sn <= n ? '★' : '☆'; s.style.color = sn <= n ? '#e8742a' : '#a8a29e'; });
      if (chatStarLabel) chatStarLabel.textContent = n ? chatStarLabels[n] : '';
    }
    stars.forEach(function(star) {
      var n = +star.getAttribute('data-chat-star');
      star.addEventListener('mouseover', function() { paintStars(n); });
      star.addEventListener('click', function() { star.previousElementSibling.checked = true; paintStars(n); });
    });
    row.addEventListener('mouseleave', function() { var c = row.querySelector('input:checked'); paintStars(c ? +c.value : 0); });
  }
})();
` }} />
    </Layout>
  );
});

// GET /messages/:matchId/updates: new messages from the other person + seen status (JSON, for live chat)
messages.get("/messages/:matchId/updates", authMiddleware, async (c) => {
  const user = c.get("user");
  const matchId = c.req.param("matchId");
  const after = c.req.query("after") || new Date(0).toISOString();

  const { data: match } = await supabase
    .from("matches")
    .select("id, students!inner(user_id), mentors!inner(user_id)")
    .eq("id", matchId)
    .single();
  if (!match) return c.json({ error: "not found" }, 404);
  const m: any = match;
  if (m.students.user_id !== user.id && m.mentors.user_id !== user.id) return c.json({ error: "forbidden" }, 403);

  const [{ data: incoming }, { data: lastMine }] = await Promise.all([
    supabase.from("messages").select("id, content, created_at").eq("match_id", matchId).neq("sender_id", user.id).gt("created_at", after).order("created_at", { ascending: true }),
    supabase.from("messages").select("is_read").eq("match_id", matchId).eq("sender_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  if (incoming && incoming.length) {
    await supabase.from("messages").update({ is_read: true }).eq("match_id", matchId).neq("sender_id", user.id).eq("is_read", false);
  }
  return c.json({ messages: incoming || [], seen: !!(lastMine as any)?.is_read });
});

// POST /messages/:matchId: Send a message
messages.post("/messages/:matchId", authMiddleware, async (c) => {
  const user = c.get("user");
  const matchId = c.req.param("matchId");
  const wantsJson = (c.req.header("accept") || "").includes("application/json");
  const body = await c.req.parseBody();
  const content = (body.content as string)?.trim().slice(0, 4000);

  if (!content) return wantsJson ? c.json({ ok: false }, 400) : c.redirect(`/messages/${matchId}`);

  // Verify user is part of this match
  const { data: match } = await supabase
    .from("matches")
    .select("*, students!inner(user_id), mentors!inner(user_id)")
    .eq("id", matchId)
    .eq("status", "active")
    .single();

  if (!match) return wantsJson ? c.json({ ok: false }, 404) : c.redirect("/messages");

  const isParticipant = match.students.user_id === user.id || match.mentors.user_id === user.id;
  if (!isParticipant) return wantsJson ? c.json({ ok: false }, 403) : c.redirect("/messages");

  // Moderate content
  const modResult = moderateText(content);
  const isFlagged = !modResult.clean;

  const { data: inserted } = await supabase
    .from("messages")
    .insert({
      match_id: matchId,
      sender_id: user.id,
      content,
      is_flagged: isFlagged,
      flag_reason: modResult.reason || null,
    })
    .select("id, content, created_at")
    .single();

  // Send email notification to the other participant
  const recipientId = match.students.user_id === user.id ? match.mentors.user_id : match.students.user_id;
  const { data: recipient } = await supabase.from("accounts").select("email, first_name").eq("id", recipientId).single();
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

  return wantsJson ? c.json({ ok: true, message: inserted }) : c.redirect(`/messages/${matchId}`);
});

export { messages };
