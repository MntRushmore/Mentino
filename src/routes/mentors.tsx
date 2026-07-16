import { Hono } from "hono";
import React from "react";
import { render } from "../app";
import { Layout } from "../views/Layout";
import { optionalAuth } from "../middleware/auth";
import { supabase } from "../db";

export const mentors = new Hono();

mentors.get("/mentors", optionalAuth, async (c) => {
  const user = c.get("user");

  const { data: mentorData } = await supabase
    .from("mentors")
    .select("id, user_id, career_field, job_title, company, years_experience, topics, accounts!user_id!inner(first_name, last_name, bio, avatar_url)")
    .eq("verification_status", "approved")
    .order("created_at", { ascending: false });

  // Fetch average ratings
  const mentorIds = (mentorData || []).map((m: any) => m.id);
  let ratingsMap: Record<string, { avg: number; count: number }> = {};
  if (mentorIds.length > 0) {
    const { data: sessions } = await supabase
      .from("sessions")
      .select("rating, matches!inner(mentor_id)")
      .not("rating", "is", null)
      .in("matches.mentor_id", mentorIds);
    if (sessions) {
      for (const s of sessions as any[]) {
        const mid = s.matches?.mentor_id;
        if (!mid) continue;
        if (!ratingsMap[mid]) ratingsMap[mid] = { avg: 0, count: 0 };
        ratingsMap[mid].count++;
        ratingsMap[mid].avg += s.rating;
      }
      for (const mid of Object.keys(ratingsMap)) {
        ratingsMap[mid].avg = Math.round((ratingsMap[mid].avg / ratingsMap[mid].count) * 10) / 10;
      }
    }
  }

  const allFields = Array.from(new Set((mentorData || []).map((m: any) => m.career_field).filter(Boolean))).sort();

  return render(
    <Layout title="Browse Mentors | Mentino" user={user} currentPath="/mentors">
      <MentorsPage mentors={mentorData || []} ratingsMap={ratingsMap} allFields={allFields} user={user} />
    </Layout>
  );
});

const GRADIENTS = [
  "from-indigo-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-violet-500 to-purple-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-cyan-500 to-sky-500",
];

function StarRow({ rating, count }: { rating: number; count: number }) {
  if (!count) return null;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ color: "#f59e0b", fontSize: 13 }}>
        {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
      </span>
      <span style={{ color: "#6b7280", fontSize: 12 }}>{rating} ({count})</span>
    </div>
  );
}

function MentorsPage({ mentors, ratingsMap, allFields, user }: {
  mentors: any[];
  ratingsMap: Record<string, { avg: number; count: number }>;
  allFields: string[];
  user: any;
}) {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <section className="text-center py-10 sm:py-14">
        <p className="text-indigo-500 text-sm font-semibold uppercase tracking-widest mb-3">Real professionals. Zero cost.</p>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Meet the mentors
        </h1>
        <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto mb-6">
          Every mentor on Mentino is a verified professional who signed up to help students. Not for money, just to give back.
        </p>
        {!user && (
          <a href="/signup?role=student"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-7 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-md">
            Sign Up Free to Connect
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        )}
      </section>

      {/* Search + filter bar */}
      <section>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            id="mentor-search"
            type="text"
            placeholder="Search by name, job title, or skill..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <select id="field-filter"
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
            <option value="">All fields</option>
            {allFields.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <p id="mentor-count" className="text-gray-400 text-sm mb-4">{mentors.length} mentor{mentors.length !== 1 ? "s" : ""}</p>

        {/* Grid */}
        <div id="mentor-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {mentors.map((m: any, i: number) => {
            const acct = m.accounts as any;
            const name = `${acct?.first_name || ""} ${acct?.last_name || ""}`.trim();
            const rating = ratingsMap[m.id];
            const topics: string[] = Array.isArray(m.topics) ? m.topics.slice(0, 3) : [];
            const bio = acct?.bio ? acct.bio.slice(0, 120) + (acct.bio.length > 120 ? "…" : "") : "";
            const searchStr = `${name} ${m.job_title || ""} ${m.company || ""} ${m.career_field || ""} ${(m.topics || []).join(" ")} ${acct?.bio || ""}`.toLowerCase();

            return (
              <a
                key={m.id}
                href={`/profile/${m.user_id}`}
                data-mentor-card="1"
                data-search={searchStr}
                data-field={m.career_field || ""}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-indigo-200 transition-all flex flex-col no-underline cursor-pointer"
                style={{ textDecoration: "none", display: "flex" }}
              >
                {/* Avatar + name */}
                <div className="flex items-center gap-3 mb-3">
                  {acct?.avatar_url ? (
                    <img src={acct.avatar_url} alt={name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className={`w-12 h-12 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
                      {name[0] || "M"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{name}</p>
                    <p className="text-xs text-gray-500 truncate">{m.job_title}{m.company ? ` · ${m.company}` : ""}</p>
                    {rating && <StarRow rating={rating.avg} count={rating.count} />}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {m.career_field && (
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">{m.career_field}</span>
                  )}
                  {m.years_experience > 0 && (
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{m.years_experience} yrs</span>
                  )}
                </div>

                {/* Topics */}
                {topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {topics.map((t) => (
                      <span key={t} className="bg-slate-50 border border-slate-200 text-slate-500 text-xs px-2 py-0.5 rounded-md">{t}</span>
                    ))}
                  </div>
                )}

                {/* Bio snippet */}
                {bio && <p className="text-gray-400 text-xs leading-relaxed mb-4 flex-1">{bio}</p>}

                {/* CTA */}
                <div className="mt-auto">
                  {user ? (
                    <div className="block text-center bg-indigo-600 text-white text-sm font-semibold py-2.5 rounded-xl">
                      View Profile →
                    </div>
                  ) : (
                    <div className="block text-center bg-indigo-50 text-indigo-700 text-sm font-semibold py-2.5 rounded-xl border border-indigo-200">
                      View Profile →
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>

        <div id="no-results" className="hidden text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium">No mentors match that search.</p>
          <p className="text-sm mt-1">Try a different keyword or clear the field filter.</p>
        </div>
      </section>

      {/* Bottom CTA */}
      {!user && (
        <section className="bg-indigo-950 rounded-2xl p-10 text-center text-white">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Ready to get matched?</h2>
          <p className="text-indigo-300 text-sm sm:text-base mb-6 max-w-md mx-auto">
            Create a free account and we'll match you with the right mentor for your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/signup?role=student"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-8 py-3.5 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-md">
              I'm a Student, Get Matched
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a href="/signup?role=mentor"
              className="inline-flex items-center justify-center bg-white/10 border border-white/25 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/20 transition-colors">
              I'm a Mentor, Give Back
            </a>
          </div>
        </section>
      )}

      <script dangerouslySetInnerHTML={{ __html: `
function filterMentors() {
  var q = document.getElementById('mentor-search').value.toLowerCase();
  var field = document.getElementById('field-filter').value;
  var cards = document.querySelectorAll('[data-mentor-card]');
  var visible = 0;
  cards.forEach(function(card) {
    var matchSearch = !q || card.getAttribute('data-search').includes(q);
    var matchField = !field || card.getAttribute('data-field') === field;
    var show = matchSearch && matchField;
    card.style.display = show ? 'flex' : 'none';
    if (show) visible++;
  });
  var countEl = document.getElementById('mentor-count');
  if (countEl) countEl.textContent = visible + ' mentor' + (visible !== 1 ? 's' : '');
  var noResults = document.getElementById('no-results');
  if (noResults) noResults.classList.toggle('hidden', visible > 0);
}
// Wire up search/filter (React SSR strips lowercase event attributes)
var searchEl = document.getElementById('mentor-search');
var filterEl = document.getElementById('field-filter');
if (searchEl) searchEl.addEventListener('input', filterMentors);
if (filterEl) filterEl.addEventListener('change', filterMentors);
      `}} />
    </div>
  );
}
