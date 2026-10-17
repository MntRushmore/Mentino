import { Hono } from "hono";
import React from "react";
import { render } from "../app";
import { Layout } from "../views/Layout";
import { optionalAuth } from "../middleware/auth";
import { supabase } from "../db";
import { CAREER_CLUSTERS, KEYWORD_MAP } from "../lib/careerMapping";
import { CHANNELS, STUDENT_STEPS, channelLink, stageFromGrade } from "../lib/resourceExtras";
import { tracksForSearch, type Track } from "../data/tracks";

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
  const career = (c.req.query("career") || "").trim().slice(0, 80);

  // Personalize for logged-in students: their stage (high school or college) and interests.
  let stage: "high school" | "college" | null = null;
  let interests: string[] = [];
  if (user?.role === "student") {
    const { data: student } = await supabase
      .from("students")
      .select("grade_or_year, career_interests")
      .eq("user_id", user.id)
      .maybeSingle();
    stage = stageFromGrade(student?.grade_or_year);
    interests = (student?.career_interests || []).slice(0, 6);
  }

  const cluster = career ? matchCluster(career) : null;
  let mentorResults: any[] = [];

  if (career) {
    const { data: allMentors } = await supabase
      .from("mentors")
      .select("id, user_id, career_field, job_title, company, topics, accounts!user_id!inner(first_name, last_name, bio, avatar_url)")
      .eq("verification_status", "approved");

    const words = career.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    const clusterKeywords = cluster
      ? [cluster.name.toLowerCase(), ...cluster.relatedCareers.map((r) => r.toLowerCase())]
      : [];

    const scored = (allMentors || []).map((m: any) => {
      const hay = `${m.career_field} ${m.job_title} ${(m.topics || []).join(" ")}`.toLowerCase();
      let score = words.filter((w) => hay.includes(w)).length * 3;
      if (clusterKeywords.some((k) => hay.includes(k.split(" ")[0]))) score += 1;
      return { m, score };
    });
    mentorResults = scored.filter((x) => x.score > 0).sort((a, b) => b.score - a.score).map((x) => x.m).slice(0, 6);
  }

  return render(
    <Layout
      title="Career Resources"
      description="Search any career and get videos, YouTube channels, books, articles, mentors and next steps picked for students."
      user={user}
      currentPath="/resources"
    >
      <ResourcesPage
        career={career}
        cluster={cluster}
        mentors={mentorResults}
        stage={stage}
        interests={interests}
        tracks={career ? tracksForSearch(career, cluster?.id) : []}
      />
    </Layout>
  );
});

const ytSearch = (query: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
const googleSearch = (query: string) => `https://www.google.com/search?q=${encodeURIComponent(query)}`;

function YouTubeMark({ className = "w-12 h-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
      <path fill="#FF0000" d="M27.4 3.1A3.5 3.5 0 0 0 24.9.6C22.7 0 14 0 14 0S5.3 0 3.1.6A3.5 3.5 0 0 0 .6 3.1C0 5.3 0 10 0 10s0 4.7.6 6.9a3.5 3.5 0 0 0 2.5 2.5C5.3 20 14 20 14 20s8.7 0 10.9-.6a3.5 3.5 0 0 0 2.5-2.5c.6-2.2.6-6.9.6-6.9s0-4.7-.6-6.9Z" />
      <path fill="#fff" d="m11.2 14.3 7.3-4.3-7.3-4.3v8.6Z" />
    </svg>
  );
}

function SectionTitle({ title, count, note }: { title: string; count?: number; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 mb-4">
      <h3 className="text-xl text-gray-900">{title}{typeof count === "number" && <span className="t-meta ml-2">{count}</span>}</h3>
      {note && <span className="t-meta hidden sm:inline">{note}</span>}
    </div>
  );
}

function ResourcesPage({
  career,
  cluster,
  mentors,
  stage,
  interests,
  tracks,
}: {
  career: string;
  cluster: any;
  mentors: any[];
  stage: "high school" | "college" | null;
  interests: string[];
  tracks: Track[];
}) {
  const showResults = career.length > 0;
  const who = stage ? `${stage} students` : "students";

  // Searches phrased for students, first when the search is more specific than the field.
  const Career = career.charAt(0).toUpperCase() + career.slice(1);
  const specific = !cluster || cluster.name.toLowerCase() !== career.toLowerCase();
  const tailoredVideos = [
    { title: `${Career}: a day in the life`, query: `day in the life ${career}` },
    { title: `How to get into ${career}, starting in ${stage ?? "high school"}`, query: `how to get into ${career} ${stage ?? "high school"} student roadmap` },
    { title: `What to major in for ${career}`, query: `best college major for ${career}` },
    { title: `${Career} internships for ${who}`, query: `${career} internship tips for ${who}` },
    { title: `${Career} salary and honest pros and cons`, query: `${career} salary pros and cons honest` },
    { title: `Skills you need for ${career}`, query: `skills you need for ${career}` },
  ];
  const curatedVideos = cluster?.resources.videos ?? [];
  const videos = (specific ? [...tailoredVideos.slice(0, 4), ...curatedVideos] : [...curatedVideos, ...tailoredVideos]).slice(0, 6);

  const tailoredArticles = [
    { title: `${Career}: pay, education and job outlook`, source: "U.S. Bureau of Labor Statistics", query: `${career} site:bls.gov/ooh` },
    { title: `Summer programs and internships in ${career} for ${who}`, source: "Web search", query: `${career} summer program internship for ${who}` },
    { title: `Scholarships for students going into ${career}`, source: "Web search", query: `${career} scholarships for ${who}` },
  ];
  const curatedArticles = cluster?.resources.articles ?? [];
  const articles = (specific ? [...tailoredArticles, ...curatedArticles] : [...curatedArticles, ...tailoredArticles]).slice(0, 6);
  const channels = cluster ? CHANNELS[cluster.id] ?? [] : [];
  const steps = cluster ? STUDENT_STEPS[cluster.id] : null;
  const stepOrder: ("highSchool" | "college")[] = stage === "college" ? ["college", "highSchool"] : ["highSchool", "college"];

  return (
    <div className="max-w-5xl mx-auto">
      <header className="max-w-2xl mb-8">
        <p className="t-eyebrow mb-4">Resources</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-gray-900">Research any career in one search.</h1>
        <p className="text-lg text-gray-600 mt-4">
          Type a job you are curious about. You get videos, channels, books, articles, mentors on Mentino and the next steps to take as a {stage ?? "student"}.
        </p>
      </header>

      <form method="GET" action="/resources" role="search" className="flex flex-col sm:flex-row gap-2 mb-4">
        <label htmlFor="career-q" className="sr-only">Career</label>
        <input id="career-q" type="search" name="career" defaultValue={career}
          placeholder="Try: nurse, software engineer, marketing, lawyer"
          className="flex-1 h-12 px-4 border text-base" />
        <button type="submit" className="btn btn-primary btn-lg">Search</button>
      </form>

      {interests.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-12">
          <span className="text-sm text-gray-600">From your profile:</span>
          {interests.map((i) => (
            <a key={i} href={`/resources?career=${encodeURIComponent(i)}`} className="btn btn-secondary btn-sm">{i}</a>
          ))}
        </div>
      )}

      {!showResults && (
        <section className={interests.length ? "" : "mt-12"}>
          <h2 className="text-2xl text-gray-900 mb-2">Browse by field</h2>
          <p className="text-gray-600 text-sm mb-6">Not sure what to search? Start with a field.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAREER_CLUSTERS.map((cl) => (
              <a key={cl.id} href={`/resources?career=${encodeURIComponent(cl.name)}`} className="card card-interactive p-6 block">
                <h3 className="text-lg text-gray-900">{cl.name}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{cl.relatedCareers.slice(0, 4).join(", ")}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {showResults && (
        <div className="mt-12 flex flex-col gap-16">
          <div>
            <h2 className="font-serif text-3xl text-gray-900">Results for "{career}"</h2>
            {cluster ? (
              <p className="text-gray-600 mt-2">Field: {cluster.name}. Related jobs: {cluster.relatedCareers.slice(0, 5).join(", ")}.</p>
            ) : (
              <p className="text-gray-600 mt-2">No exact field match, so these are general searches for "{career}".</p>
            )}
          </div>

          {tracks.length > 0 && (
            <section aria-label="Career Tracks">
              {tracks.map((t) => (
                <a key={t.slug} href={`/tracks/${t.slug}`} className="bg-butter rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:opacity-90">
                  <div>
                    <p className="t-eyebrow mb-2" style={{ color: "var(--ink)" }}>Free Career Track</p>
                    <p className="text-xl text-gray-900">{t.title}</p>
                    <p className="text-sm text-gray-700 mt-1">{t.weeks.length} weeks of lessons, notes, assignments and quizzes. {t.shortDescription}</p>
                  </div>
                  <span className="btn btn-primary flex-shrink-0">View track</span>
                </a>
              ))}
            </section>
          )}

          {steps && (
            <section aria-labelledby="steps-h">
              <h3 id="steps-h" className="text-xl text-gray-900 mb-4">What to do now</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stepOrder.map((k) => (
                  <div key={k} className={`rounded-xl p-6 ${k === "highSchool" ? "bg-sage" : "bg-clay"}`}>
                    <p className="text-sm font-medium text-gray-900 mb-4">{k === "highSchool" ? "In high school" : "In college"}{(stage === "college") === (k === "college") && stage ? " (you)" : ""}</p>
                    <ol className="flex flex-col gap-2">
                      {steps[k].map((s, i) => (
                        <li key={s} className="flex gap-3 text-sm text-gray-800">
                          <span className="t-meta w-4 flex-shrink-0" style={{ color: "var(--ink)" }}>{i + 1}</span>{s}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section aria-labelledby="videos-h">
            <SectionTitle title="Videos to watch" count={videos.length} note="Opens YouTube" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((v: any, i: number) => (
                <a key={i} href={ytSearch(v.query)} target="_blank" rel="noopener noreferrer" className="card card-interactive overflow-hidden flex flex-col">
                  <div className="bg-panel aspect-video flex items-center justify-center">
                    <YouTubeMark className="w-16 h-12" />
                  </div>
                  <p className="p-4 text-sm font-medium text-gray-900">{v.title}</p>
                </a>
              ))}
            </div>
          </section>

          {channels.length > 0 && (
            <section aria-labelledby="channels-h">
              <SectionTitle title="YouTube channels to follow" count={channels.length} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {channels.map((ch) => (
                  <a key={ch.name} href={channelLink(ch.name)} target="_blank" rel="noopener noreferrer" className="card card-interactive p-4 flex items-center gap-4">
                    <YouTubeMark className="w-12 h-9 flex-shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-base font-medium text-gray-900">{ch.name}</span>
                      <span className="block text-sm text-gray-600">{ch.why}</span>
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}

          <section aria-labelledby="mentors-h">
            <SectionTitle title="Mentors you can talk to" count={mentors.length} />
            {mentors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mentors.map((m: any) => {
                  const acct = m.accounts as any;
                  const name = `${acct?.first_name || ""} ${acct?.last_name || ""}`.trim();
                  return (
                    <a key={m.id} href={`/profile/${m.user_id}`} className="card card-interactive p-4 block">
                      <div className="flex items-center gap-3">
                        {acct?.avatar_url ? (
                          <img src={acct.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <span className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-gray-900 text-sm font-medium flex-shrink-0">{name.charAt(0)}</span>
                        )}
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-gray-900 truncate">{name}</span>
                          <span className="block text-xs text-gray-600 truncate">{m.job_title}{m.company ? ` · ${m.company}` : ""}</span>
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-sm text-gray-700">No mentor matches "{career}" yet. New mentors join every week.</p>
                <a href="/mentors" className="btn btn-secondary btn-sm">Browse all mentors</a>
              </div>
            )}
          </section>

          {cluster && cluster.resources.books.length > 0 && (
            <section aria-labelledby="books-h">
              <SectionTitle title="Books to read" count={cluster.resources.books.length} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cluster.resources.books.map((b: any, i: number) => (
                  <a key={i} href={googleSearch(`${b.title} ${b.author} book`)} target="_blank" rel="noopener noreferrer" className="card card-interactive p-6 block">
                    <p className="text-base font-medium text-gray-900">{b.title}</p>
                    <p className="t-meta mt-1">{b.author}</p>
                    <p className="text-sm text-gray-600 mt-2">{b.why}</p>
                  </a>
                ))}
              </div>
            </section>
          )}

          <section aria-labelledby="articles-h">
            <SectionTitle title="Articles and guides" count={articles.length} note="Opens a web search" />
            <ul className="border-t border-gray-200">
              {articles.map((a: any, i: number) => (
                <li key={i} className="border-b border-gray-200">
                  <a href={googleSearch(a.query)} target="_blank" rel="noopener noreferrer" className="row-link flex items-center justify-between gap-4 py-4 group">
                    <span>
                      <span className="block text-base text-gray-900 group-hover:underline underline-offset-4">{a.title}</span>
                      <span className="t-meta">{a.source}</span>
                    </span>
                    <span aria-hidden="true" className="text-gray-500">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="related-h">
            <h3 id="related-h" className="text-xl text-gray-900 mb-4">Related fields</h3>
            <div className="flex flex-wrap gap-2">
              {CAREER_CLUSTERS.filter((cl) => !cluster || cl.id !== cluster.id).map((cl) => (
                <a key={cl.id} href={`/resources?career=${encodeURIComponent(cl.name)}`} className="btn btn-secondary btn-sm">{cl.name}</a>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
