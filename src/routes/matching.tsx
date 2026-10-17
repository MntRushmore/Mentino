import { Hono } from "hono";
import React from "react";
import { renderToString } from "react-dom/server";
import { Layout } from "../views/Layout";
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

function Avatar({ user, size = 64 }: { user: any; size?: number }) {
  const style = { width: size, height: size, fontSize: Math.round(size * 0.34) };
  if (user?.avatar_url) {
    return <img src={user.avatar_url} alt="" className="rounded-full object-cover flex-shrink-0 ring-4 ring-white" style={style} />;
  }
  return (
    <span className="rounded-full flex items-center justify-center bg-gray-100 text-gray-900 font-semibold flex-shrink-0 ring-4 ring-white" style={style} aria-hidden="true">
      {user?.first_name?.[0]}{user?.last_name?.[0]}
    </span>
  );
}

interface MentorCardData {
  dbId: string;
  userId: string;
  person: any;
  mentor: any;
  score: number;
  label?: string;
  reason: string;
  rating?: { avg: number; count: number };
}

const DAY_ABBR: Record<string, string> = { monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri", saturday: "Sat", sunday: "Sun" };

function MatchRing({ score: raw }: { score: number }) {
  const score = Math.round(raw);
  const r = 22, c = 2 * Math.PI * r;
  return (
    <span className="relative w-14 h-14 flex-shrink-0" title={`${score}% match`}>
      <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90" aria-hidden="true">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#f1f0ee" strokeWidth="5" />
        <circle cx="28" cy="28" r={r} fill="none" stroke="var(--forest)" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${(score / 100) * c} ${c}`} className="ring-anim" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">{score}%</span>
    </span>
  );
}

function MentorCard({ card, featured = false }: { card: MentorCardData; featured?: boolean }) {
  const { person, mentor } = card;
  const order = Object.keys(DAY_ABBR);
  const days = Object.entries((mentor.availability || {}) as Record<string, string[]>)
    .filter(([, slots]) => (slots || []).length)
    .sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
    .map(([d]) => DAY_ABBR[d] || d);
  const search = `${person.first_name} ${person.last_name} ${mentor.job_title || ""} ${mentor.company || ""} ${mentor.career_field || ""} ${(mentor.topics || []).join(" ")} ${person.bio || ""}`.toLowerCase();
  const verified = mentor.verification_status === "approved";

  return (
    <article data-mentor-search={search} data-mentor-field={mentor.career_field || ""}
      className={`card card-interactive overflow-hidden flex flex-col ${featured ? "md:flex-row" : ""}`}>
      <div className={`relative ${featured ? "md:w-2/5" : ""}`}>
        <div className={`cover ${featured ? "h-24 md:h-full md:min-h-[220px]" : "h-20"}`} />
        <div className={`absolute ${featured ? "left-6 -bottom-8 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2" : "left-6 -bottom-8"}`}>
          <Avatar user={person} size={featured ? 96 : 64} />
        </div>
        {featured && <span className="absolute top-4 left-4 beta-badge" style={{ background: "#111", color: "#fff" }}>Top match for you</span>}
      </div>

      <div className={`flex-1 flex flex-col p-6 ${featured ? "pt-12 md:pt-6" : "pt-12"}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg text-gray-900 flex items-center gap-1">
              <a href={`/profile/${card.userId}`} className="truncate hover:underline underline-offset-4">{person.first_name} {person.last_name}</a>
              {verified && (
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="var(--forest)" aria-label="Verified mentor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              )}
            </h2>
            <p className="text-sm text-gray-700 truncate">{mentor.job_title}{mentor.company ? ` at ${mentor.company}` : ""}</p>
            <p className="t-meta mt-1">{mentor.career_field}{mentor.years_experience ? ` · ${mentor.years_experience} yrs` : ""}{verified ? "" : " · verification pending"}</p>
          </div>
          {card.score > 0 && <MatchRing score={card.score} />}
        </div>

        {(card.label || card.rating) && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {card.label && <span className="chip-static">{card.label}</span>}
            {card.rating && (
              <span className="flex items-center gap-1 text-xs text-gray-700">
                <StarRating rating={card.rating.avg} /> {card.rating.avg} ({card.rating.count})
              </span>
            )}
          </div>
        )}

        {person.bio && <p className={`text-sm text-gray-700 mt-4 ${featured ? "line-clamp-3" : "line-clamp-2"}`}>{person.bio}</p>}
        {card.score > 0 && card.reason && <p className="text-sm text-gray-900 mt-2"><span className="font-semibold">Why you match:</span> {card.reason}</p>}

        {(mentor.topics || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {mentor.topics.slice(0, featured ? 6 : 3).map((t: string) => <span key={t} className="chip-static chip-soft">{t}</span>)}
          </div>
        )}
        {days.length > 0 && <p className="t-meta mt-4">Available {days.join(", ")}</p>}

        <div className="mt-auto pt-6">
          <details className="connect">
            <summary className={`btn btn-block ${featured ? "btn-glass" : "btn-dark"}`}>Connect</summary>
            <form method="POST" action="/matching/request" className="mt-4 flex flex-col gap-2">
              <input type="hidden" name="mentor_db_id" value={card.dbId} />
              <input type="hidden" name="score" value={String(Math.round(card.score))} />
              <input type="hidden" name="reason" value={card.reason} />
              <label htmlFor={`intro-${card.dbId}`} className="text-sm font-medium text-gray-900">Say hi to {person.first_name}</label>
              <textarea id={`intro-${card.dbId}`} name="intro_message" rows={3} minLength={30} maxLength={500} required
                placeholder="Who you are and what you'd like help with (30+ characters)" className="w-full px-3 py-2 border text-sm resize-none" />
              <button type="submit" className="btn btn-primary">Send request</button>
            </form>
          </details>
          <div className="flex items-center justify-between mt-2 text-xs">
            <a href={`/profile/${card.userId}`} className="text-gray-700 hover:underline underline-offset-4">View profile</a>
            <a href={`/reports/new?reported_id=${card.userId}&from=matching`} className="text-gray-500 hover:text-red-600">Report</a>
          </div>
        </div>
      </div>
    </article>
  );
}

const MATCH_CSS = `
.cover { background: linear-gradient(135deg, #fdf1e6 0%, #f7f6f4 60%, #ffffff 100%); }
.chip { flex-shrink: 0; height: 36px; padding: 0 16px; border-radius: 9999px; border: 1px solid var(--line-strong); background: #fff; color: var(--ink); font-size: 14px; font-weight: 500; transition: background-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease); }
.chip:hover { border-color: var(--ink); }
.chip.is-active { background: var(--ink); border-color: var(--ink); color: #fff; }
.chip-static { display: inline-flex; align-items: center; height: 24px; padding: 0 10px; border-radius: 9999px; background: #111; color: #fff; font-size: 12px; font-weight: 600; }
.chip-soft { background: #f5f5f4; color: var(--ink); font-weight: 500; }
details.connect > summary { list-style: none; cursor: pointer; }
details.connect > summary::-webkit-details-marker { display: none; }
details.connect[open] > summary { display: none; }
.ring-anim { transition: stroke-dasharray 900ms var(--ease); }
`;

const MATCH_JS = `
(function() {
  var searchInput = document.getElementById('mentor-search');
  var noResults = document.getElementById('no-results-msg');
  var activeFilter = 'All';
  var catKeywords = {
    'Tech': ['tech','software','engineer','developer','coding','data','computer','digital','web','ai','cloud'],
    'Healthcare': ['health','medical','medicine','doctor','nurse','hospital','clinical','pharma','biotech','therapy'],
    'Law': ['law','legal','attorney','lawyer','court','compliance','policy','government','regulation'],
    'Business': ['business','management','operations','strategy','startup','entrepreneur','product','consulting'],
    'Engineering': ['engineer','mechanical','electrical','civil','chemical','aerospace','manufacturing','robotics'],
    'Finance': ['finance','accounting','investment','banking','economics','trading','wealth','insurance','tax'],
    'Sports': ['sports','athletics','fitness','coaching','performance','training','exercise'],
    'Creative': ['design','art','creative','music','film','photography','fashion','architecture','ux','ui'],
    'Science': ['science','research','biology','chemistry','physics','geology','environmental','neuroscience'],
    'Education': ['education','teaching','academic','school','curriculum','tutoring','professor'],
    'Media': ['media','journalism','marketing','communications','pr','social media','advertising','publishing','writing']
  };
  function applyFilters() {
    var q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    var cards = document.querySelectorAll('[data-mentor-search]'), visible = 0;
    cards.forEach(function(card) {
      var text = card.getAttribute('data-mentor-search') || '';
      var ok = (!q || text.indexOf(q) > -1) && (activeFilter === 'All' || (catKeywords[activeFilter] || []).some(function(k) { return text.indexOf(k) > -1; }));
      card.style.display = ok ? '' : 'none';
      if (ok) visible++;
    });
    if (noResults) noResults.classList.toggle('hidden', visible > 0);
  }
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  document.querySelectorAll('[data-filter-cat]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      activeFilter = btn.getAttribute('data-filter-cat');
      document.querySelectorAll('[data-filter-cat]').forEach(function(b) { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-pressed', String(b === btn)); });
      applyFilters();
    });
  });
})();
`;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-orange-500" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// GET /matching: Browse potential matches
matching.get("/matching", authMiddleware, async (c) => {
  const user = c.get("user");

  if (!user.registration_complete) {
    return html(
      <Layout title="Complete Your Profile" user={user}>
        <div className="max-w-2xl mx-auto mt-12">
          <div className="relative bg-sage rounded-xl p-12 text-center overflow-hidden">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="font-serif text-3xl text-gray-900 mb-3">Complete Your Profile First</h1>
              <p className="text-gray-700 mb-6 max-w-md mx-auto">
                To find the best mentor matches, we need to know a bit more about you, your interests, goals, and availability.
              </p>
              <a href={`/register/step/${user.registration_step}`} className="btn btn-primary btn-lg">
                Complete Profile
              </a>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (user.role === "student") {
    const results = await findMatches(user.id);

    // Fallback: if algorithm returns 0 results, fetch all available mentors directly
    let allMentorsFallback: any[] = [];
    if (results.length === 0) {
      const { data: fallbackMentors } = await supabase
        .from("mentors")
        .select("*, accounts!user_id!inner(id, first_name, last_name, bio, avatar_url, registration_complete)")
        .in("verification_status", ["approved", "pending"]);
      if (fallbackMentors) {
        // Get student for existing match filter
        const { data: student } = await supabase.from("students").select("id").eq("user_id", user.id).single();
        const { data: existingMatches } = student
          ? await supabase.from("matches").select("mentor_id").eq("student_id", student.id).in("status", ["pending", "accepted", "active"])
          : { data: [] };
        const matchedIds = new Set((existingMatches || []).map((m: any) => m.mentor_id));
        allMentorsFallback = fallbackMentors.filter(
          (m: any) => m.accounts?.registration_complete && !matchedIds.has(m.id)
        );
      }
    }

    // Fetch reviews summary for each mentor from sessions (reviews table doesn't exist)
    const mentorIds = results.map((r) => r.mentorDbId);
    let reviewsMap: Record<string, { avg: number; count: number }> = {};
    if (mentorIds.length > 0) {
      const { data: ratedSessions } = await supabase
        .from("sessions")
        .select("rating, matches!inner(mentor_id)")
        .eq("status", "completed")
        .not("rating", "is", null);
      if (ratedSessions) {
        for (const s of ratedSessions) {
          const mid = (s as any).matches?.mentor_id;
          if (!mid || !mentorIds.includes(mid)) continue;
          if (!reviewsMap[mid]) reviewsMap[mid] = { avg: 0, count: 0 };
          reviewsMap[mid].count++;
          reviewsMap[mid].avg += s.rating;
        }
        for (const id of Object.keys(reviewsMap)) {
          reviewsMap[id].avg = Math.round((reviewsMap[id].avg / reviewsMap[id].count) * 10) / 10;
        }
      }
    }

    // One card shape for algorithm results and the browse-all fallback.
    const cards: MentorCardData[] = results.length
      ? results.map((r) => ({
          dbId: r.mentorDbId,
          userId: r.mentorId,
          person: r.mentorUser,
          mentor: r.mentor,
          score: r.score,
          label: r.matchLabel ?? undefined,
          reason: r.reason,
          rating: reviewsMap[r.mentorDbId],
        }))
      : allMentorsFallback.map((m: any) => ({
          dbId: m.id,
          userId: m.accounts.id,
          person: m.accounts,
          mentor: m,
          score: 0,
          label: undefined,
          reason: "Direct browse",
          rating: undefined,
        }));
    const [top, ...rest] = cards;

    return html(
      <Layout title="Find a Mentor" user={user} currentPath="/matching">
        <style dangerouslySetInnerHTML={{ __html: MATCH_CSS }} />
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <p className="t-eyebrow mb-2">Matching</p>
              <h1 className="font-serif text-4xl text-gray-900">Find your mentor</h1>
              <p className="text-gray-600 mt-2">{results.length ? "Ranked by how well each mentor fits your interests, goals and schedule." : "Browse every available mentor and send an intro."}</p>
            </div>
            <span className="t-meta">{cards.length} mentor{cards.length === 1 ? "" : "s"} available</span>
          </header>

          {cards.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-900 font-semibold text-lg">No mentors have signed up yet</p>
              <p className="text-gray-600 text-sm mt-1">Check back soon. Mentors are joining every week.</p>
              <a href="/resources" className="btn btn-secondary mt-6">Explore Resources meanwhile</a>
            </div>
          ) : (
            <>
              <div className="sticky top-14 z-10 -mx-4 px-4 py-4 mb-6 bg-white/90 backdrop-blur border-b border-gray-200 sm:static sm:mx-0 sm:px-0 sm:py-0 sm:mb-8 sm:bg-transparent sm:border-0 sm:backdrop-blur-none" data-no-reveal>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <label htmlFor="mentor-search" className="sr-only">Search mentors</label>
                  <input id="mentor-search" type="search" placeholder="Search name, field, company or topic"
                    className="w-full h-12 pl-11 pr-4 border text-base rounded-full" style={{ borderRadius: 9999 }} />
                </div>
                <div className="flex gap-2 overflow-x-auto mt-4 pb-1" role="group" aria-label="Filter by field">
                  {["All", "Tech", "Healthcare", "Law", "Business", "Engineering", "Finance", "Sports", "Creative", "Science", "Education", "Media"].map((cat) => (
                    <button key={cat} type="button" data-filter-cat={cat} aria-pressed={cat === "All"} className={`chip ${cat === "All" ? "is-active" : ""}`}>{cat}</button>
                  ))}
                </div>
              </div>

              <p id="no-results-msg" className="hidden text-center text-gray-600 text-sm py-12">No mentors match that. Try another keyword or field.</p>

              {top && <MentorCard card={top} featured />}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {rest.map((card) => <MentorCard key={card.dbId} card={card} />)}
                </div>
              )}
            </>
          )}
        </div>
        <script dangerouslySetInnerHTML={{ __html: MATCH_JS }} />
      </Layout>
    );
  }

  return c.redirect("/dashboard");
});

// POST /matching/request: Student requests a match
matching.post("/matching/request", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.parseBody();

  if (user.role !== "student") return c.redirect("/dashboard");

  const mentorDbId = body.mentor_db_id as string;
  const score = parseFloat(body.score as string) || 0;
  const reason = (body.reason as string) || "";
  const introMessage = (body.intro_message as string)?.trim() || null;

  // Enforce 30-char minimum
  if (!introMessage || introMessage.length < 30) {
    return c.redirect("/matching?error=intro_too_short");
  }

  const { data: student } = await supabase
    .from("students").select("id").eq("user_id", user.id).single();

  if (!student) return c.redirect("/matching");

  const { data: existing } = await supabase
    .from("matches").select("id")
    .eq("student_id", student.id).eq("mentor_id", mentorDbId)
    .in("status", ["pending", "accepted", "active"]).single();

  if (existing) return c.redirect("/matching");

  await supabase.from("matches").insert({
    student_id: student.id,
    mentor_id: mentorDbId,
    status: "pending",
    match_score: score,
    match_reason: reason,
    intro_message: introMessage,
    requested_by: "student",
  });

  return c.redirect("/dashboard");
});

// POST /matching/respond: Mentor accepts/rejects
matching.post("/matching/respond", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.parseBody();

  if (user.role !== "mentor") return c.redirect("/dashboard");

  const matchId = body.match_id as string;
  const action = body.action as string;

  if (action === "accept") {
    await supabase.from("matches").update({
      status: "active",
      responded_at: new Date().toISOString(),
      started_at: new Date().toISOString(),
    }).eq("id", matchId);

    const { data: match } = await supabase.from("matches").select("mentor_id").eq("id", matchId).single();
    if (match) {
      const { data: mentor } = await supabase.from("mentors").select("current_mentees").eq("id", match.mentor_id).single();
      if (mentor) {
        await supabase.from("mentors").update({ current_mentees: (mentor.current_mentees || 0) + 1 }).eq("id", match.mentor_id);
      }
    }
  } else if (action === "reject") {
    await supabase.from("matches").update({
      status: "rejected",
      responded_at: new Date().toISOString(),
    }).eq("id", matchId);
  }

  return c.redirect("/dashboard");
});

export { matching };
