import { Hono } from "hono";
import React from "react";
import { render } from "../app";
import { Layout } from "../views/Layout";
import { optionalAuth } from "../middleware/auth";
import { supabase } from "../db";
import { CAREER_CLUSTERS, KEYWORD_MAP } from "../lib/careerMapping";

export const resources = new Hono();

function matchCluster(text: string) {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [kw, pts] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(kw)) {
      for (const [cluster, score] of Object.entries(pts as Record<string, number>)) {
        scores[cluster] = (scores[cluster] || 0) + (score * 2);
      }
    }
  }
  for (const cluster of CAREER_CLUSTERS) {
    if (lower.includes(cluster.name.toLowerCase())) {
      scores[cluster.id] = (scores[cluster.id] || 0) + 15;
    }
    for (const career of cluster.relatedCareers) {
      if (lower.includes(career.toLowerCase())) {
        scores[cluster.id] = (scores[cluster.id] || 0) + 8;
      }
    }
  }
  const topId = Object.keys(scores).sort((a, b) => (scores[b] || 0) - (scores[a] || 0))[0];
  return topId ? CAREER_CLUSTERS.find((c) => c.id === topId) : null;
}

resources.get("/resources", optionalAuth, async (c) => {
  const user = c.get("user");
  const career = (c.req.query("career") || "").trim();

  let cluster = career ? matchCluster(career) : null;
  let mentorResults: any[] = [];

  if (career) {
    const { data: allMentors } = await supabase
      .from("mentors")
      .select("id, user_id, career_field, job_title, company, topics, accounts!user_id!inner(first_name, last_name, bio, avatar_url)")
      .eq("verification_status", "approved");

    const lowerCareer = career.toLowerCase();
    const clusterKeywords = cluster
      ? [cluster.name.toLowerCase(), ...cluster.relatedCareers.map((r) => r.toLowerCase())]
      : [];

    mentorResults = (allMentors || []).filter((m: any) => {
      const field = (m.career_field || "").toLowerCase();
      const title = (m.job_title || "").toLowerCase();
      const topics = (m.topics || []).join(" ").toLowerCase();
      const directMatch = field.includes(lowerCareer.split(" ")[0]) || title.includes(lowerCareer.split(" ")[0]);
      const clusterMatch = clusterKeywords.some((k) => field.includes(k.split(" ")[0]) || title.includes(k.split(" ")[0]));
      return directMatch || clusterMatch;
    }).slice(0, 6);

    if (mentorResults.length === 0) {
      mentorResults = (allMentors || []).slice(0, 3);
    }
  }

  return render(
    <Layout title="Resources | Mentino" user={user} currentPath="/resources">
      <ResourcesPage career={career} cluster={cluster} mentors={mentorResults} />
    </Layout>
  );
});

function ResourcesPage({
  career,
  cluster,
  mentors,
}: {
  career: string;
  cluster: any;
  mentors: any[];
}) {
  const ytSearch = (query: string) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  const googleSearch = (query: string) =>
    `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  const showResults = career.length > 0;

  return (
    <div className="max-w-5xl mx-auto">

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden mb-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-indigo-900 to-blue-900" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full -translate-y-1/4 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-400/10 rounded-full translate-y-1/4 -translate-x-1/4 blur-3xl" />
        <div className="relative z-10 text-center text-white py-14 px-8">
          <span className="inline-block bg-white/15 border border-white/20 text-white text-sm font-semibold px-5 py-2 rounded-full mb-5 backdrop-blur-sm">
            Career Resources
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Find resources for<br />any career path
          </h1>
          <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
            Search any career you're curious about — videos, books, websites, and mentors you can actually talk to.
          </p>

          {/* Search bar */}
          <form method="GET" action="/resources" className="max-w-xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                name="career"
                defaultValue={career}
                placeholder="e.g. software engineer, physical therapist, lawyer..."
                className="flex-1 px-5 py-3.5 rounded-xl border-0 text-gray-900 text-sm font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-6 py-3.5 rounded-xl transition-colors shadow-lg whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* No search yet: show career cluster browse */}
      {!showResults && (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Career Field</h2>
            <p className="text-gray-500 text-sm">Pick a field to explore videos, books, websites, and mentors.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {CAREER_CLUSTERS.map((cl) => (
              <a
                key={cl.id}
                href={`/resources?career=${encodeURIComponent(cl.name)}`}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-indigo-200 transition-all group"
              >
                <div className="text-3xl mb-3">{cl.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors">{cl.name}</h3>
                <p className="text-gray-500 text-xs leading-snug line-clamp-2">{cl.description}</p>
              </a>
            ))}
          </div>
        </>
      )}

      {/* Search results */}
      {showResults && (
        <>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              {cluster && <span className="text-2xl">{cluster.emoji}</span>}
              <h2 className="text-2xl font-bold text-gray-900">
                Resources for <span className="text-indigo-600">"{career}"</span>
              </h2>
            </div>
            {cluster && (
              <p className="text-gray-500 text-sm ml-9">{cluster.description}</p>
            )}
          </div>

          {/* YouTube Videos */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Videos to Watch</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cluster ? (
                cluster.resources.videos.map((v: any, i: number) => (
                  <a
                    key={i}
                    href={ytSearch(v.query)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-red-200 hover:shadow-md transition-all"
                  >
                    <div className="w-full h-32 bg-gradient-to-br from-red-50 to-red-100 rounded-lg mb-3 flex items-center justify-center">
                      <svg className="w-10 h-10 text-red-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-red-700 transition-colors leading-snug">{v.title}</p>
                    <p className="text-xs text-gray-400 mt-1">Search on YouTube →</p>
                  </a>
                ))
              ) : (
                [
                  { title: `Day in the life: ${career}`, q: `day in the life ${career}` },
                  { title: `How to become a ${career}`, q: `how to become a ${career} career guide` },
                  { title: `${career} career advice for students`, q: `${career} career advice for high school students` },
                ].map((v, i) => (
                  <a
                    key={i}
                    href={ytSearch(v.q)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-red-200 hover:shadow-md transition-all"
                  >
                    <div className="w-full h-32 bg-gradient-to-br from-red-50 to-red-100 rounded-lg mb-3 flex items-center justify-center">
                      <svg className="w-10 h-10 text-red-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-red-700 transition-colors leading-snug">{v.title}</p>
                    <p className="text-xs text-gray-400 mt-1">Search on YouTube →</p>
                  </a>
                ))
              )}
            </div>
          </section>

          {/* Mentors */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Mentors You Can Talk To</h3>
            </div>
            {mentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mentors.map((m: any) => {
                  const acct = m.accounts as any;
                  const name = `${acct?.first_name || ""} ${acct?.last_name || ""}`.trim();
                  return (
                    <a
                      key={m.id}
                      href={`/profile/${m.user_id}`}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-200 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {acct?.avatar_url ? (
                          <img src={acct.avatar_url} alt={name} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 text-sm group-hover:text-indigo-700 transition-colors">{name}</p>
                          <p className="text-xs text-gray-500">{m.job_title}</p>
                        </div>
                      </div>
                      {m.company && <p className="text-xs text-gray-400 mb-2">{m.company}</p>}
                      {acct?.bio && (
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{acct.bio}</p>
                      )}
                      <p className="text-xs text-indigo-600 font-medium mt-2">View profile →</p>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-center">
                <p className="text-indigo-700 text-sm font-medium mb-2">No exact matches yet</p>
                <p className="text-indigo-600 text-xs mb-3">Browse all mentors to find someone in this field</p>
                <a href="/mentors" className="inline-block bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors">Browse All Mentors</a>
              </div>
            )}
          </section>

          {/* Books */}
          {cluster && cluster.resources.books.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Books to Read</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cluster.resources.books.map((b: any, i: number) => (
                  <a
                    key={i}
                    href={googleSearch(`${b.title} ${b.author} book`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-amber-200 hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-0.5 group-hover:text-amber-700 transition-colors">{b.title}</p>
                    <p className="text-xs text-gray-500 mb-2">{b.author}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{b.why}</p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Websites / Articles */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Websites & Articles</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cluster ? (
                cluster.resources.articles.map((a: any, i: number) => (
                  <a
                    key={i}
                    href={googleSearch(a.query)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-200 hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors leading-snug">{a.title}</p>
                    <p className="text-xs text-emerald-600 font-medium mb-2">{a.source}</p>
                    <p className="text-xs text-gray-400">Search on Google →</p>
                  </a>
                ))
              ) : (
                [
                  { title: `${career} career guide`, source: "BLS Occupational Outlook", q: `${career} career occupational outlook BLS` },
                  { title: `How to get into ${career}`, source: "Indeed Career Guide", q: `how to get into ${career} career indeed guide` },
                  { title: `${career} salary and job outlook`, source: "Glassdoor / LinkedIn", q: `${career} average salary job outlook` },
                ].map((a, i) => (
                  <a
                    key={i}
                    href={googleSearch(a.q)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-200 hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors leading-snug">{a.title}</p>
                    <p className="text-xs text-emerald-600 font-medium mb-2">{a.source}</p>
                    <p className="text-xs text-gray-400">Search on Google →</p>
                  </a>
                ))
              )}
            </div>
          </section>

          {/* Also explore other clusters */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-4">
            <h3 className="font-bold text-indigo-900 mb-3">Also explore related fields</h3>
            <div className="flex flex-wrap gap-2">
              {CAREER_CLUSTERS.filter((cl) => !cluster || cl.id !== cluster.id).map((cl) => (
                <a
                  key={cl.id}
                  href={`/resources?career=${encodeURIComponent(cl.name)}`}
                  className="inline-flex items-center gap-1.5 bg-white border border-indigo-200 text-indigo-700 text-sm font-medium px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                >
                  {cl.emoji} {cl.name}
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
