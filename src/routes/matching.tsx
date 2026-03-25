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

function Avatar({ user, size = "md" }: { user: any; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "w-16 h-16 text-xl" : size === "sm" ? "w-9 h-9 text-sm" : "w-12 h-12 text-base";
  if (user?.avatar_url) {
    return <img src={user.avatar_url} alt={user.first_name} className={`${sz} rounded-full object-cover flex-shrink-0 border-2 border-white shadow`} />;
  }
  return (
    <div className={`${sz} bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold flex-shrink-0`}>
      {user?.first_name?.[0]}{user?.last_name?.[0]}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// GET /matching — Browse potential matches
matching.get("/matching", authMiddleware, async (c) => {
  const user = c.get("user");

  if (!user.registration_complete) {
    return html(
      <Layout title="Complete Your Profile" user={user}>
        <div className="max-w-2xl mx-auto mt-12">
          <div className="relative bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl p-12 text-center text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-3">Complete Your Profile First</h1>
              <p className="text-indigo-100 mb-6 max-w-md mx-auto">
                To find the best mentor matches, we need to know a bit more about you — your interests, goals, and availability.
              </p>
              <a href={`/register/step/${user.registration_step}`} className="inline-block bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-colors">
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

    // Fetch reviews summary for each mentor
    const mentorIds = results.map((r) => r.mentorDbId);
    let reviewsMap: Record<string, { avg: number; count: number }> = {};
    if (mentorIds.length > 0) {
      const { data: reviews } = await supabase
        .from("reviews")
        .select("mentor_id, rating")
        .in("mentor_id", mentorIds);
      if (reviews) {
        for (const r of reviews) {
          if (!reviewsMap[r.mentor_id]) reviewsMap[r.mentor_id] = { avg: 0, count: 0 };
          reviewsMap[r.mentor_id].count++;
          reviewsMap[r.mentor_id].avg += r.rating;
        }
        for (const id of Object.keys(reviewsMap)) {
          reviewsMap[id].avg = Math.round((reviewsMap[id].avg / reviewsMap[id].count) * 10) / 10;
        }
      }
    }

    return html(
      <Layout title="Find a Mentor" user={user}>
        <div>
          {/* Page header */}
          <div className="relative bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 mb-8 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <circle cx="80" cy="20" r="40" fill="white" />
                <circle cx="10" cy="80" r="30" fill="white" />
              </svg>
            </div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-1">Find Your Mentor</h1>
              <p className="text-indigo-100">Based on your interests and goals, here are your top matches.</p>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                </svg>
              </div>
              <p className="text-gray-700 font-semibold text-lg mb-1">No mentors available right now</p>
              <p className="text-gray-400 text-sm">Check back soon — new mentors are being verified regularly.</p>
            </div>
          ) : (
            <>
            {/* Search + category filter */}
            <div className="mb-6 space-y-3">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  id="mentor-search"
                  type="text"
                  placeholder="Search by name, field, company, topic..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {["All", "Technology & Software", "Medicine & Healthcare", "Law & Legal Services", "Business & Management", "Engineering", "Finance & Accounting", "Sports & Athletics", "Arts & Design", "Science & Research", "Education & Teaching", "Psychology & Mental Health", "Media & Journalism"].map((cat) => (
                  <button
                    key={cat}
                    data-filter-cat={cat}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${cat === "All" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <p id="no-results-msg" className="hidden text-center text-gray-400 text-sm py-6">No mentors match your search. Try different keywords or a different category.</p>
            </div>
            <div className="space-y-5">
              {results.map((result, index) => {
                const rv = reviewsMap[result.mentorDbId];
                return (
                  <div key={result.mentorDbId}
                    data-mentor-search={`${result.mentorUser.first_name} ${result.mentorUser.last_name} ${result.mentor.job_title || ''} ${result.mentor.company || ''} ${result.mentor.career_field || ''} ${(result.mentor.topics || []).join(' ')} ${result.mentorUser.bio || ''}`.toLowerCase()}
                    data-mentor-field={result.mentor.career_field || ''}
                    className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${index === 0 ? "border-indigo-200 ring-1 ring-indigo-200" : "border-gray-100"}`}>
                    {index === 0 && (
                      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <span className="text-white text-xs font-semibold">Best Match for You</span>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar user={result.mentorUser} size="lg" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="text-lg font-bold text-gray-900">
                              {result.mentorUser.first_name} {result.mentorUser.last_name}
                            </h3>
                            <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                              {result.score}% match
                            </span>
                            {result.mentor.verification_status === "approved" ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-400 text-xs px-2 py-0.5 rounded-full">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth="2" /></svg>
                                Not Verified
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm font-medium">
                            {result.mentor.job_title}{result.mentor.company ? ` · ${result.mentor.company}` : ""}
                          </p>
                          <p className="text-gray-400 text-xs mb-2">
                            {result.mentor.career_field} · {result.mentor.years_experience} yrs experience
                          </p>
                          {rv && (
                            <div className="flex items-center gap-1.5 mb-2">
                              <StarRating rating={rv.avg} />
                              <span className="text-xs text-gray-500 font-medium">{rv.avg} ({rv.count} review{rv.count !== 1 ? "s" : ""})</span>
                            </div>
                          )}
                          {result.mentorUser.bio && (
                            <p className="text-gray-600 text-sm line-clamp-2 mb-2">{result.mentorUser.bio}</p>
                          )}
                          <p className="text-emerald-600 text-xs font-medium mb-2">✓ {result.reason}</p>
                          <div className="flex flex-wrap gap-1">
                            {result.mentor.topics?.slice(0, 4).map((topic: string) => (
                              <span key={topic} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{topic}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[190px]">
                          <form method="POST" action="/matching/request" className="space-y-2">
                            <input type="hidden" name="mentor_db_id" value={result.mentorDbId} />
                            <input type="hidden" name="score" value={result.score.toString()} />
                            <input type="hidden" name="reason" value={result.reason} />
                            <div>
                              <textarea
                                name="intro_message"
                                placeholder="Introduce yourself — at least 30 characters (what would you like help with?)"
                                rows={3}
                                minLength={30}
                                maxLength={500}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                              />
                              <p className="text-xs text-gray-400 mt-0.5">Min 30 characters</p>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
                              Request Match
                            </button>
                          </form>
                          <div className="flex gap-2">
                            <a href={`/profile/${result.mentorId}`} className="flex-1 text-center text-indigo-600 hover:underline text-xs font-medium py-1">
                              View Profile
                            </a>
                            <a href={`/reports/new?reported_id=${result.mentorId}&from=matching`} className="text-gray-400 hover:text-red-500 text-xs font-medium py-1 transition-colors">
                              Report
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <script dangerouslySetInnerHTML={{ __html: `
  (function() {
    var searchInput = document.getElementById('mentor-search');
    var noResults = document.getElementById('no-results-msg');
    var activeFilter = 'All';

    function applyFilters() {
      var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      var cards = document.querySelectorAll('[data-mentor-search]');
      var visible = 0;
      cards.forEach(function(card) {
        var searchText = card.getAttribute('data-mentor-search') || '';
        var field = card.getAttribute('data-mentor-field') || '';
        var matchesSearch = !query || searchText.includes(query);
        var matchesFilter = activeFilter === 'All' || field === activeFilter;
        if (matchesSearch && matchesFilter) {
          card.style.display = '';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });
      if (noResults) noResults.classList.toggle('hidden', visible > 0);
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }

    document.querySelectorAll('[data-filter-cat]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        activeFilter = this.getAttribute('data-filter-cat');
        document.querySelectorAll('[data-filter-cat]').forEach(function(b) {
          b.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600');
          b.classList.add('bg-white', 'text-gray-600', 'border-gray-200');
        });
        this.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600');
        this.classList.remove('bg-white', 'text-gray-600', 'border-gray-200');
        applyFilters();
      });
    });
  })();
` }} />
            </>
          )}
        </div>
      </Layout>
    );
  }

  return c.redirect("/dashboard");
});

// POST /matching/request — Student requests a match
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

// POST /matching/respond — Mentor accepts/rejects
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
