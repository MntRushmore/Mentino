import { Hono } from "hono";
import React from "react";
import { render } from "../app";
import { Layout } from "../views/Layout";
import { authMiddleware, optionalAuth } from "../middleware/auth";
import { TRACKS, getTrack, type Track, type Week, type Difficulty } from "../data/tracks";
import {
  ASSIGNMENT_MAX_CHARS,
  NOTE_MAX_CHARS,
  NOTE_MIN_CHARS,
  NOTE_MIN_SENTENCES,
  TracksUnavailable,
  currentWeek,
  enroll,
  getEnrollment,
  isComplete,
  listEnrollments,
  nextStep,
  notesQualify,
  progress,
  saveState,
  wordCount,
  weekStatuses,
  type Enrollment,
  type TrackState,
  type WeekStatus,
} from "../lib/tracks";

export const tracks = new Hono();

const WRAP = "max-w-5xl mx-auto";
const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

// ── Small shared pieces ───────────────────────────────────────────────────

function ProgressBar({ percent, label }: { percent: number; label?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-gray-600">{label ?? "Progress"}</span>
        <span className="font-medium text-gray-900 tabular-nums">{percent}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full bg-forest rounded-full" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function Meta({ track }: { track: Track }) {
  return (
    <p className="t-meta">
      {track.weeks.length} weeks · {track.difficulty} · {track.hoursPerWeek} per week
    </p>
  );
}

function Notice({ tone = "info", children }: { tone?: "info" | "error" | "success"; children: React.ReactNode }) {
  const styles = {
    info: "bg-butter border-gray-200 text-gray-900",
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-sage border-gray-200 text-gray-900",
  }[tone];
  return <div role={tone === "error" ? "alert" : "status"} className={`border rounded-xl px-4 py-3 text-sm ${styles}`}>{children}</div>;
}

const UNAVAILABLE_TEXT = "Enrollment for Career Tracks opens shortly. You can read every track outline now.";

async function safeEnrollment(userId: string | undefined, slug: string): Promise<{ enrollment: Enrollment | null; unavailable: boolean }> {
  if (!userId) return { enrollment: null, unavailable: false };
  try {
    return { enrollment: await getEnrollment(userId, slug), unavailable: false };
  } catch (e) {
    if (e instanceof TracksUnavailable) return { enrollment: null, unavailable: true };
    throw e;
  }
}

// ── Catalog ───────────────────────────────────────────────────────────────

tracks.get("/tracks", optionalAuth, async (c) => {
  const user = c.get("user");
  const q = (c.req.query("q") || "").trim();
  const difficulty = (c.req.query("difficulty") || "") as Difficulty | "";

  const needle = q.toLowerCase();
  const results = TRACKS.filter(
    (t) =>
      (!difficulty || t.difficulty === difficulty) &&
      (!needle ||
        [t.title, t.career, t.shortDescription, ...t.keywords].some((s) => s.toLowerCase().includes(needle)))
  );

  let mine: Enrollment[] = [];
  let unavailable = false;
  if (user) {
    try {
      mine = await listEnrollments(user.id);
    } catch (e) {
      if (!(e instanceof TracksUnavailable)) throw e;
      unavailable = true;
    }
  }
  const enrolledSlugs = new Set(mine.map((m) => m.track_slug));

  return render(
    <Layout
      title="Career Tracks"
      description="Free self-paced career courses for students. Watch lessons, take notes, finish weekly assignments and quizzes, and earn a certificate."
      user={user}
      currentPath="/tracks"
    >
      <div className={WRAP}>
        <header className="max-w-2xl mb-8">
          <p className="t-eyebrow mb-4">Career Tracks</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-gray-900">Learn a career, one week at a time.</h1>
          <p className="text-lg text-gray-600 mt-4">
            Each track is a free, self-paced course: short lessons, your own notes, a weekly assignment and a quick quiz. Finish every week to earn a certificate.
          </p>
        </header>

        {unavailable && <div className="mb-6"><Notice>{UNAVAILABLE_TEXT}</Notice></div>}

        {mine.length > 0 && (
          <section className="mb-12" aria-labelledby="my-tracks">
            <h2 id="my-tracks" className="text-xl text-gray-900 mb-4">My Tracks</h2>
            <MyTracksList enrollments={mine} />
            <p className="mt-4 text-sm"><a href="/tracks/notes" className="text-gray-900 underline underline-offset-4">View all my notes</a></p>
          </section>
        )}

        <form method="GET" action="/tracks" className="flex flex-col sm:flex-row gap-2 mb-8" role="search">
          <label htmlFor="track-q" className="sr-only">Search tracks</label>
          <input id="track-q" type="search" name="q" defaultValue={q} placeholder="Search a career, like marketing"
            className="flex-1 h-10 px-4 border text-sm" />
          <label htmlFor="track-difficulty" className="sr-only">Difficulty</label>
          <select id="track-difficulty" name="difficulty" defaultValue={difficulty} className="h-10 px-3 border text-sm sm:w-44">
            <option value="">All levels</option>
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        {results.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-900 font-medium">No tracks match {q ? `"${q}"` : "that filter"} yet.</p>
            <p className="text-sm text-gray-600 mt-2">
              Try the <a href={`/resources${q ? `?career=${encodeURIComponent(q)}` : ""}`} className="underline underline-offset-4">Resources search</a> for videos, books and mentors in that field.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((t) => (
              <article key={t.slug} className="card overflow-hidden flex flex-col">
                <a href={`/tracks/${t.slug}`} className="block skeleton aspect-[16/9]">
                  <img src={t.image} alt="" loading="lazy" className="w-full h-full object-cover" data-fade />
                </a>
                <div className="p-6 flex flex-col flex-1">
                  <p className="t-eyebrow mb-2">{t.career}</p>
                  <h2 className="text-xl text-gray-900"><a href={`/tracks/${t.slug}`} className="hover:underline underline-offset-4">{t.title}</a></h2>
                  <p className="text-sm text-gray-600 mt-2 flex-1">{t.shortDescription}</p>
                  <div className="mt-4"><Meta track={t} /></div>
                  <div className="mt-6">
                    {enrolledSlugs.has(t.slug) ? (
                      <a href={`/tracks/${t.slug}`} className="btn btn-secondary btn-block">Continue</a>
                    ) : user ? (
                      <form method="POST" action={`/tracks/${t.slug}/enroll`}>
                        <button type="submit" className="btn btn-primary btn-block">Enroll</button>
                      </form>
                    ) : (
                      <a href="/signup?role=student" className="btn btn-primary btn-block">Enroll</a>
                    )}
                  </div>
                </div>
              </article>
            ))}
            <aside className="bg-sand rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-lg text-gray-900">More tracks are coming</h2>
                <p className="text-sm text-gray-700 mt-2">Finance, nursing, software engineering and law are next. Until then, Resources has videos, books and mentors for any career.</p>
              </div>
              <a href="/resources" className="btn btn-secondary mt-6 self-start">Search Resources</a>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
});

export function MyTracksList({ enrollments }: { enrollments: Enrollment[] }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {enrollments.map((e) => {
        const track = getTrack(e.track_slug);
        if (!track) return null;
        const p = progress(track, e.state);
        const next = nextStep(track, e.state);
        const done = isComplete(track, e.state);
        return (
          <li key={e.id} className="card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg text-gray-900"><a href={`/tracks/${track.slug}`} className="hover:underline underline-offset-4">{track.title}</a></h3>
                <p className="t-meta mt-1">{done ? "Completed" : `Week ${currentWeek(track, e.state)} of ${track.weeks.length}`}</p>
              </div>
            </div>
            <ProgressBar percent={p.percent} />
            <div className="mt-4">
              {done ? (
                <a href={`/tracks/${track.slug}/certificate`} className="btn btn-secondary btn-sm">View certificate</a>
              ) : next ? (
                <a href={next.href} className="btn btn-primary btn-sm">Next: {next.label}</a>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ── My Notes ──────────────────────────────────────────────────────────────

tracks.get("/tracks/notes", authMiddleware, async (c) => {
  const user = c.get("user");
  let enrollments: Enrollment[] = [];
  let unavailable = false;
  try {
    enrollments = await listEnrollments(user.id);
  } catch (e) {
    if (!(e instanceof TracksUnavailable)) throw e;
    unavailable = true;
  }

  const groups = enrollments
    .map((e) => ({ e, track: getTrack(e.track_slug) }))
    .filter((g): g is { e: Enrollment; track: Track } => !!g.track);

  const hasNotes = groups.some(({ e }) => Object.values(e.state.lessons).some((l) => l.notes?.trim()));

  return render(
    <Layout title="My Notes" user={user} currentPath="/tracks">
      <div className="max-w-3xl mx-auto">
        <p className="t-eyebrow mb-4"><a href="/tracks" className="hover:underline">Career Tracks</a></p>
        <h1 className="font-serif text-4xl text-gray-900 mb-8">My Notes</h1>
        {unavailable && <Notice>{UNAVAILABLE_TEXT}</Notice>}
        {!unavailable && !hasNotes && (
          <div className="card p-8">
            <p className="text-gray-900">You have not written any notes yet.</p>
            <p className="text-sm text-gray-600 mt-2">Notes you write under each lesson are saved automatically and collected here.</p>
            <a href="/tracks" className="btn btn-primary mt-6">Browse tracks</a>
          </div>
        )}
        {groups.map(({ e, track }) => (
          <section key={e.id} className="mb-12">
            <h2 className="text-2xl text-gray-900 mb-4">{track.title}</h2>
            {track.weeks.map((w) => {
              const lessons = w.lessons.filter((l) => e.state.lessons[l.id]?.notes?.trim());
              if (!lessons.length) return null;
              return (
                <div key={w.number} className="mb-8">
                  <h3 className="t-eyebrow mb-4">Week {w.number}: {w.title}</h3>
                  <div className="flex flex-col gap-4">
                    {lessons.map((l) => (
                      <article key={l.id} className="card p-6">
                        <div className="flex items-baseline justify-between gap-4 mb-2">
                          <h4 className="text-base text-gray-900">{l.title}</h4>
                          <a href={`/tracks/${track.slug}/week/${w.number}#lesson-${l.id}`} className="text-sm text-gray-600 underline underline-offset-4 flex-shrink-0">Edit</a>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{e.state.lessons[l.id].notes}</p>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        ))}
      </div>
    </Layout>
  );
});

// ── Track overview ────────────────────────────────────────────────────────

tracks.get("/tracks/:slug", optionalAuth, async (c) => {
  const user = c.get("user");
  const track = getTrack(c.req.param("slug"));
  if (!track) return c.notFound();

  const { enrollment, unavailable } = await safeEnrollment(user?.id, track.slug);
  const state = enrollment?.state;
  const p = state ? progress(track, state) : null;
  const next = state ? nextStep(track, state) : null;
  const done = state ? isComplete(track, state) : false;
  const err = c.req.query("err");

  return render(
    <Layout title={track.title} description={track.shortDescription} user={user} currentPath="/tracks">
      <div className={WRAP}>
        <p className="t-eyebrow mb-4"><a href="/tracks" className="hover:underline">Career Tracks</a> / {track.career}</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <h1 className="font-serif text-4xl sm:text-5xl text-gray-900">{track.title}</h1>
            <div className="mt-4"><Meta track={track} /></div>
            <p className="text-lg text-gray-700 mt-6">{track.description}</p>
          </div>
          <div className="lg:col-span-5">
            <div className="skeleton rounded-xl overflow-hidden aspect-[4/3]">
              <img src={track.image} alt="" className="w-full h-full object-cover" data-fade />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 max-w-2xl">
          {(unavailable || err === "unavailable") && <Notice>{UNAVAILABLE_TEXT}</Notice>}
          {enrollment && p ? (
            <div className="card p-6">
              <ProgressBar percent={p.percent} label={done ? "Track complete" : `Week ${currentWeek(track, enrollment.state)} of ${track.weeks.length}`} />
              <div className="mt-4 flex flex-wrap gap-2">
                {done ? (
                  <a href={`/tracks/${track.slug}/certificate`} className="btn btn-primary">View certificate</a>
                ) : next ? (
                  <a href={next.href} className="btn btn-primary">Continue: {next.label}</a>
                ) : null}
                <a href="/tracks/notes" className="btn btn-secondary">My notes</a>
              </div>
            </div>
          ) : user ? (
            <form method="POST" action={`/tracks/${track.slug}/enroll`}>
              <button type="submit" className="btn btn-primary btn-lg">Start Track</button>
            </form>
          ) : (
            <div className="flex flex-wrap items-center gap-4">
              <a href="/signup?role=student" className="btn btn-primary btn-lg">Start Track</a>
              <span className="text-sm text-gray-600">Free. <a href="/login" className="underline underline-offset-4">Log in</a> if you already have an account.</span>
            </div>
          )}
        </div>

        <section className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <h2 className="text-2xl text-gray-900">What you will learn</h2>
          </div>
          <ul className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {track.outcomes.map((o) => (
              <li key={o} className="flex gap-3 text-gray-700">
                <span className="h-6 flex items-center flex-shrink-0"><span className="w-2 h-2 rounded-full bg-forest" /></span>
                {o}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <h2 className="text-2xl text-gray-900">Week by week</h2>
            <p className="text-sm text-gray-600 mt-2">Each week: lessons with notes, one assignment, one short quiz. A week unlocks when you finish the lessons and assignment before it.</p>
          </div>
          <ol className="lg:col-span-8 border-t border-gray-200">
            {track.weeks.map((w, i) => {
              const s = p?.statuses[i];
              return (
                <li key={w.number} className="py-6 border-b border-gray-200">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-lg text-gray-900">
                      <span className="t-meta mr-2">Week {w.number}</span>
                      {s?.unlocked ? (
                        <a href={`/tracks/${track.slug}/week/${w.number}`} className="hover:underline underline-offset-4">{w.title}</a>
                      ) : w.title}
                    </h3>
                    {s && <WeekBadge status={s} />}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{w.goal}</p>
                  <p className="t-meta mt-2">{w.lessons.length} lessons · 1 assignment · {w.quiz.questions.length} question quiz</p>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </Layout>
  );
});

function WeekBadge({ status }: { status: WeekStatus }) {
  const [label, cls] = status.complete
    ? ["Complete", "bg-sage text-gray-900"]
    : status.unlocked
      ? ["In progress", "bg-butter text-gray-900"]
      : ["Locked", "bg-gray-100 text-gray-600"];
  return <span className={`t-meta inline-flex items-center h-6 px-2 rounded flex-shrink-0 ${cls}`} style={{ color: "inherit" }}>{label}</span>;
}

// ── Enroll ────────────────────────────────────────────────────────────────

tracks.post("/tracks/:slug/enroll", authMiddleware, async (c) => {
  const user = c.get("user");
  const track = getTrack(c.req.param("slug"));
  if (!track) return c.notFound();
  try {
    await enroll(user.id, track.slug);
  } catch (e) {
    if (e instanceof TracksUnavailable) return c.redirect(`/tracks/${track.slug}?err=unavailable`);
    throw e;
  }
  return c.redirect(`/tracks/${track.slug}/week/1`);
});

// ── Week page ─────────────────────────────────────────────────────────────

async function loadForWeek(c: any) {
  const user = c.get("user");
  const track = getTrack(c.req.param("slug"));
  if (!track) return { error: c.notFound() };
  const n = Number(c.req.param("n"));
  const week = track.weeks.find((w) => w.number === n);
  if (!week) return { error: c.notFound() };
  const { enrollment, unavailable } = await safeEnrollment(user.id, track.slug);
  if (unavailable) return { error: c.redirect(`/tracks/${track.slug}?err=unavailable`) };
  if (!enrollment) return { error: c.redirect(`/tracks/${track.slug}`) };
  const status = weekStatuses(track, enrollment.state)[n - 1];
  return { user, track, week, enrollment, status };
}

tracks.get("/tracks/:slug/week/:n", authMiddleware, async (c) => {
  const r = await loadForWeek(c);
  if ("error" in r) return r.error;
  const { user, track, week, enrollment, status } = r;
  const msg = c.req.query("msg");
  const err = c.req.query("err");
  const state = enrollment.state;
  const quizResult = state.quizzes[week.quiz.id];
  const nextWeek = track.weeks.find((w) => w.number === week.number + 1);
  const nextUnlocked = nextWeek ? weekStatuses(track, state)[nextWeek.number - 1].unlocked : false;
  const p = progress(track, state);

  return render(
    <Layout title={`Week ${week.number}: ${week.title}`} user={user} currentPath="/tracks">
      <div className="max-w-3xl mx-auto">
        <p className="t-eyebrow mb-4">
          <a href="/tracks" className="hover:underline">Career Tracks</a> / <a href={`/tracks/${track.slug}`} className="hover:underline">{track.title}</a>
        </p>
        <h1 className="font-serif text-4xl text-gray-900">Week {week.number}: {week.title}</h1>
        <p className="text-lg text-gray-700 mt-4">{week.goal}</p>
        <div className="mt-6"><ProgressBar percent={p.percent} label="Track progress" /></div>

        <nav aria-label="Weeks" className="flex flex-wrap gap-2 mt-6">
          {weekStatuses(track, state).map((s) => (
            s.unlocked ? (
              <a key={s.week.number} href={`/tracks/${track.slug}/week/${s.week.number}`}
                aria-current={s.week.number === week.number ? "page" : undefined}
                className={`btn btn-sm ${s.week.number === week.number ? "btn-primary" : "btn-secondary"}`}>
                Week {s.week.number}{s.complete ? " (done)" : ""}
              </a>
            ) : (
              <span key={s.week.number} className="btn btn-sm btn-secondary" aria-disabled="true">Week {s.week.number} (locked)</span>
            )
          ))}
        </nav>

        <div className="mt-6 flex flex-col gap-2">
          {msg && <Notice tone="success">{msg}</Notice>}
          {err && <Notice tone="error">{err}</Notice>}
        </div>

        {!status.unlocked ? (
          <div className="card p-8 mt-8">
            <h2 className="text-xl text-gray-900">This week is locked</h2>
            <p className="text-gray-600 mt-2">Finish the lessons and assignment in Week {week.number - 1} to unlock it.</p>
            <a href={`/tracks/${track.slug}/week/${week.number - 1}`} className="btn btn-primary mt-6">Go to Week {week.number - 1}</a>
          </div>
        ) : (
          <>
            {/* Lessons */}
            <section className="mt-12" aria-labelledby="lessons-h">
              <div className="flex items-baseline justify-between mb-4">
                <h2 id="lessons-h" className="text-2xl text-gray-900">Lessons</h2>
                <span className="t-meta">{status.lessonsDone} of {status.lessonsTotal} complete</span>
              </div>
              <ol className="flex flex-col gap-8">
                {week.lessons.map((l, i) => {
                  const ls = state.lessons[l.id];
                  const done = !!ls?.completedAt;
                  return (
                    <li key={l.id} id={`lesson-${l.id}`} className="card overflow-hidden scroll-mt-24">
                      {l.kind === "video" && l.youtubeId && (
                        <div className="aspect-video bg-gray-100">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${l.youtubeId}?rel=0`}
                            title={l.title}
                            loading="lazy"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="t-meta">Lesson {i + 1} · {l.kind === "video" ? "Video" : "Reading"} · {l.source}</p>
                            <h3 className="text-xl text-gray-900 mt-1">{l.title}</h3>
                          </div>
                          {done && <span className="t-meta inline-flex items-center h-6 px-2 rounded bg-sage flex-shrink-0" style={{ color: "var(--ink)" }}>Complete</span>}
                        </div>
                        <p className="text-gray-700 mt-2">{l.summary}</p>
                        {l.kind === "article" && l.url && (
                          <a href={l.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-4">
                            Open the reading <span aria-hidden="true">↗</span>
                          </a>
                        )}

                        <form method="POST" action={`/tracks/${track.slug}/lessons/${l.id}/complete`} className="mt-6" data-lesson-form>
                          <label htmlFor={`notes-${l.id}`} className="block text-sm font-medium text-gray-900">Your notes</label>
                          <p className="text-sm text-gray-600 mt-1">{l.notePrompt}</p>
                          <textarea
                            id={`notes-${l.id}`}
                            name="notes"
                            rows={6}
                            maxLength={NOTE_MAX_CHARS}
                            defaultValue={ls?.notes ?? ""}
                            data-autosave={`/tracks/${track.slug}/lessons/${l.id}/notes`}
                            className="w-full mt-2 px-4 py-3 border text-base"
                            placeholder="Write at least 3 full sentences in your own words."
                          />
                          <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                            <p className="t-meta" data-note-status aria-live="polite">
                              {ls?.notesUpdatedAt ? "Saved" : "Notes save automatically"}
                            </p>
                            <p className="t-meta" data-note-count>
                              {NOTE_MIN_SENTENCES} sentences needed to complete
                            </p>
                          </div>
                          {!done && (
                            <button type="submit" className="btn btn-primary mt-4" data-complete-btn disabled={!notesQualify(ls?.notes ?? "")}>
                              Mark lesson complete
                            </button>
                          )}
                        </form>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* Assignment */}
            <section id="assignment" className="mt-16 scroll-mt-24" aria-labelledby="assignment-h">
              <h2 id="assignment-h" className="text-2xl text-gray-900 mb-4">Assignment: {week.assignment.title}</h2>
              <div className="card p-6">
                <p className="text-gray-700">{week.assignment.prompt}</p>
                <p className="t-meta mt-2">At least {week.assignment.minWords} words</p>
                {!status.allLessonsDone ? (
                  <p className="text-sm text-gray-600 mt-6 bg-panel rounded p-4">Complete all {status.lessonsTotal} lessons above to open the assignment.</p>
                ) : (
                  <form method="POST" action={`/tracks/${track.slug}/week/${week.number}/assignment`} className="mt-6">
                    <label htmlFor="assignment-response" className="sr-only">Your response</label>
                    <textarea
                      id="assignment-response"
                      name="response"
                      rows={10}
                      maxLength={ASSIGNMENT_MAX_CHARS}
                      defaultValue={state.assignments[week.assignment.id]?.response ?? ""}
                      data-min-words={week.assignment.minWords}
                      className="w-full px-4 py-3 border text-base"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                      <p className="t-meta" data-word-count>0 words</p>
                      {state.assignments[week.assignment.id] && (
                        <p className="t-meta">Submitted {new Date(state.assignments[week.assignment.id].submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                      )}
                    </div>
                    <button type="submit" className="btn btn-primary mt-4">
                      {state.assignments[week.assignment.id] ? "Update submission" : "Submit assignment"}
                    </button>
                  </form>
                )}
              </div>
            </section>

            {/* Quiz */}
            <section id="quiz" className="mt-16 scroll-mt-24" aria-labelledby="quiz-h">
              <div className="flex items-baseline justify-between mb-4">
                <h2 id="quiz-h" className="text-2xl text-gray-900">Week {week.number} quiz</h2>
                <span className="t-meta">Pass with {week.quiz.passPercent}% or higher</span>
              </div>
              <div className="card p-6">
                {!status.assignmentDone ? (
                  <p className="text-sm text-gray-600 bg-panel rounded p-4">Submit the assignment to open the quiz.</p>
                ) : (
                  <>
                    {quizResult && (
                      <div className="mb-6">
                        <Notice tone={quizResult.passed ? "success" : "error"}>
                          You scored {quizResult.score} of {quizResult.total}. {quizResult.passed ? "Passed." : "Review the explanations and try again."}
                        </Notice>
                      </div>
                    )}
                    <QuizForm track={track} week={week} result={quizResult} />
                  </>
                )}
              </div>
            </section>

            {/* Next */}
            <div className="mt-16 card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {isComplete(track, state) ? (
                <>
                  <p className="text-gray-900">You finished every week of {track.title}.</p>
                  <a href={`/tracks/${track.slug}/certificate`} className="btn btn-primary">View certificate</a>
                </>
              ) : nextWeek ? (
                <>
                  <p className="text-gray-700">{nextUnlocked ? `Week ${nextWeek.number} is open.` : `Finish the lessons and assignment to unlock Week ${nextWeek.number}.`}</p>
                  {nextUnlocked && <a href={`/tracks/${track.slug}/week/${nextWeek.number}`} className="btn btn-primary">Go to Week {nextWeek.number}</a>}
                </>
              ) : (
                <p className="text-gray-700">Pass every quiz to finish the track and get your certificate.</p>
              )}
            </div>
          </>
        )}
      </div>

      <script dangerouslySetInnerHTML={{ __html: weekPageScript() }} />
    </Layout>
  );
});

function QuizForm({ track, week, result }: { track: Track; week: Week; result?: TrackState["quizzes"][string] }) {
  return (
    <form method="POST" action={`/tracks/${track.slug}/week/${week.number}/quiz`}>
      <ol className="flex flex-col gap-8">
        {week.quiz.questions.map((q, qi) => {
          const picked = result?.answers[qi];
          return (
            <li key={q.id}>
              <fieldset>
                <legend className="text-base text-gray-900 font-medium">{qi + 1}. {q.question}</legend>
                <div className="flex flex-col gap-2 mt-4">
                  {q.options.map((opt, oi) => {
                    const isAnswer = oi === q.answer;
                    const marked = result && picked === oi;
                    const tone = result ? (isAnswer ? "border-forest bg-sage" : marked ? "border-red-300 bg-red-50" : "") : "";
                    return (
                      <label key={oi} className={`flex items-start gap-3 border border-gray-200 rounded p-3 cursor-pointer hover:bg-panel ${tone}`}>
                        <input type="radio" name={`q${qi}`} value={oi} required defaultChecked={picked === oi} className="mt-1" />
                        <span className="text-sm text-gray-800">{opt}</span>
                      </label>
                    );
                  })}
                </div>
                {result && (
                  <p className="text-sm text-gray-600 mt-2">
                    {picked === q.answer ? "Correct. " : "Not quite. "}{q.explanation}
                  </p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>
      <button type="submit" className="btn btn-primary mt-8">{result ? "Retake quiz" : "Submit quiz"}</button>
    </form>
  );
}

function weekPageScript() {
  return `
(function() {
  var MIN_S = ${NOTE_MIN_SENTENCES}, MIN_C = ${NOTE_MIN_CHARS};
  function sentences(t) {
    var m = t.trim().match(/[^.!?]+[.!?]+(\\s|$)/g) || [];
    return m.filter(function(s) { return s.trim().split(/\\s+/).length >= 3; }).length;
  }
  document.querySelectorAll('[data-lesson-form]').forEach(function(form) {
    var ta = form.querySelector('textarea[data-autosave]');
    var status = form.querySelector('[data-note-status]');
    var count = form.querySelector('[data-note-count]');
    var btn = form.querySelector('[data-complete-btn]');
    var timer = null, lastSaved = ta.value;
    function update() {
      var n = sentences(ta.value);
      var ok = n >= MIN_S && ta.value.trim().length >= MIN_C;
      count.textContent = ok ? 'Ready to complete' : (Math.min(n, MIN_S) + ' of ' + MIN_S + ' sentences');
      if (btn) btn.disabled = !ok;
    }
    function save() {
      if (ta.value === lastSaved) return;
      var value = ta.value;
      status.textContent = 'Saving...';
      fetch(ta.getAttribute('data-autosave'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: value })
      }).then(function(r) {
        if (!r.ok) throw new Error();
        lastSaved = value;
        status.textContent = 'Saved';
      }).catch(function() {
        status.textContent = 'Could not save. Check your connection.';
      });
    }
    ta.addEventListener('input', function() {
      update();
      status.textContent = 'Unsaved changes';
      clearTimeout(timer);
      timer = setTimeout(save, 800);
    });
    ta.addEventListener('blur', save);
    update();
  });
  document.querySelectorAll('textarea[data-min-words]').forEach(function(ta) {
    var out = ta.parentElement.querySelector('[data-word-count]');
    var min = +ta.getAttribute('data-min-words');
    function update() {
      var n = ta.value.trim() ? ta.value.trim().split(/\\s+/).length : 0;
      out.textContent = n + ' of ' + min + ' words';
    }
    ta.addEventListener('input', update);
    update();
  });
})();
`;
}

// ── Actions ───────────────────────────────────────────────────────────────

function findLesson(track: Track, lessonId: string) {
  for (const w of track.weeks) {
    const l = w.lessons.find((x) => x.id === lessonId);
    if (l) return { week: w, lesson: l };
  }
  return null;
}

tracks.post("/tracks/:slug/lessons/:lessonId/notes", authMiddleware, async (c) => {
  const user = c.get("user");
  const track = getTrack(c.req.param("slug"));
  const found = track && findLesson(track, c.req.param("lessonId"));
  if (!track || !found) return c.json({ ok: false }, 404);
  let enrollment: Enrollment | null;
  try {
    enrollment = await getEnrollment(user.id, track.slug);
  } catch (e) {
    if (e instanceof TracksUnavailable) return c.json({ ok: false, error: "unavailable" }, 503);
    throw e;
  }
  if (!enrollment) return c.json({ ok: false, error: "not enrolled" }, 403);
  if (!weekStatuses(track, enrollment.state)[found.week.number - 1].unlocked) return c.json({ ok: false, error: "locked" }, 403);

  const body = await c.req.json().catch(() => ({}));
  const notes = String(body?.notes ?? "").slice(0, NOTE_MAX_CHARS);
  const state = enrollment.state;
  state.lessons[found.lesson.id] = { ...state.lessons[found.lesson.id], notes, notesUpdatedAt: new Date().toISOString() };
  await saveState(enrollment, track, state);
  return c.json({ ok: true, qualifies: notesQualify(notes) });
});

tracks.post("/tracks/:slug/lessons/:lessonId/complete", authMiddleware, async (c) => {
  const user = c.get("user");
  const track = getTrack(c.req.param("slug"));
  const found = track && findLesson(track, c.req.param("lessonId"));
  if (!track || !found) return c.notFound();
  const back = `/tracks/${track.slug}/week/${found.week.number}`;
  let enrollment: Enrollment | null;
  try {
    enrollment = await getEnrollment(user.id, track.slug);
  } catch (e) {
    if (e instanceof TracksUnavailable) return c.redirect(`/tracks/${track.slug}?err=unavailable`);
    throw e;
  }
  if (!enrollment) return c.redirect(`/tracks/${track.slug}`);
  if (!weekStatuses(track, enrollment.state)[found.week.number - 1].unlocked) return c.redirect(back);

  const body = await c.req.parseBody();
  const notes = String(body.notes ?? "").slice(0, NOTE_MAX_CHARS);
  const state = enrollment.state;
  const now = new Date().toISOString();
  state.lessons[found.lesson.id] = { ...state.lessons[found.lesson.id], notes, notesUpdatedAt: now };

  if (!notesQualify(notes)) {
    await saveState(enrollment, track, state);
    const err = encodeURIComponent(`Write at least ${NOTE_MIN_SENTENCES} full sentences of notes for "${found.lesson.title}" before marking it complete.`);
    return c.redirect(`${back}?err=${err}#lesson-${found.lesson.id}`);
  }
  state.lessons[found.lesson.id].completedAt = state.lessons[found.lesson.id].completedAt ?? now;
  await saveState(enrollment, track, state);

  const status = weekStatuses(track, state)[found.week.number - 1];
  const nextLesson = found.week.lessons.find((l) => !state.lessons[l.id]?.completedAt);
  const anchor = nextLesson ? `#lesson-${nextLesson.id}` : status.allLessonsDone ? "#assignment" : "";
  const msg = encodeURIComponent(status.allLessonsDone ? "All lessons done. The assignment is open." : `Lesson complete: ${found.lesson.title}`);
  return c.redirect(`${back}?msg=${msg}${anchor}`);
});

tracks.post("/tracks/:slug/week/:n/assignment", authMiddleware, async (c) => {
  const r = await loadForWeek(c);
  if ("error" in r) return r.error;
  const { track, week, enrollment, status } = r;
  const back = `/tracks/${track.slug}/week/${week.number}`;
  if (!status.unlocked || !status.allLessonsDone) return c.redirect(`${back}#assignment`);

  const body = await c.req.parseBody();
  const response = String(body.response ?? "").slice(0, ASSIGNMENT_MAX_CHARS).trim();
  if (wordCount(response) < week.assignment.minWords) {
    const err = encodeURIComponent(`Your assignment needs at least ${week.assignment.minWords} words. You wrote ${wordCount(response)}.`);
    return c.redirect(`${back}?err=${err}#assignment`);
  }
  const state = enrollment.state;
  state.assignments[week.assignment.id] = { response, submittedAt: new Date().toISOString() };
  await saveState(enrollment, track, state);
  const nextWeek = track.weeks.find((w) => w.number === week.number + 1);
  const msg = encodeURIComponent(nextWeek ? `Assignment submitted. Week ${nextWeek.number} is unlocked. Take the quiz below to finish this week.` : "Assignment submitted. Take the quiz below.");
  return c.redirect(`${back}?msg=${msg}#quiz`);
});

tracks.post("/tracks/:slug/week/:n/quiz", authMiddleware, async (c) => {
  const r = await loadForWeek(c);
  if ("error" in r) return r.error;
  const { track, week, enrollment, status } = r;
  const back = `/tracks/${track.slug}/week/${week.number}`;
  if (!status.unlocked || !status.assignmentDone) return c.redirect(`${back}#quiz`);

  const body = await c.req.parseBody();
  const answers = week.quiz.questions.map((_, i) => {
    const v = Number(body[`q${i}`]);
    return Number.isInteger(v) ? v : -1;
  });
  const score = answers.filter((a, i) => a === week.quiz.questions[i].answer).length;
  const total = week.quiz.questions.length;
  const passed = (score / total) * 100 >= week.quiz.passPercent;
  const state = enrollment.state;
  state.quizzes[week.quiz.id] = { score, total, passed, answers, attemptedAt: new Date().toISOString() };
  await saveState(enrollment, track, state);
  if (passed && isComplete(track, state)) return c.redirect(`/tracks/${track.slug}/certificate`);
  return c.redirect(`${back}#quiz`);
});

// ── Certificate ───────────────────────────────────────────────────────────

tracks.get("/tracks/:slug/certificate", authMiddleware, async (c) => {
  const user = c.get("user");
  const track = getTrack(c.req.param("slug"));
  if (!track) return c.notFound();
  const { enrollment, unavailable } = await safeEnrollment(user.id, track.slug);
  if (unavailable) return c.redirect(`/tracks/${track.slug}?err=unavailable`);
  if (!enrollment || !isComplete(track, enrollment.state)) return c.redirect(`/tracks/${track.slug}`);

  const completed = new Date(enrollment.completed_at ?? enrollment.updated_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const name = `${user.first_name} ${user.last_name ?? ""}`.trim();

  return render(
    <Layout title={`Certificate: ${track.title}`} user={user} currentPath="/tracks">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          #site-nav, footer, #quiz-fab, .no-print, #route-progress, .skip-link { display: none !important; }
          body { background: #fff !important; }
          main { padding: 0 !important; }
          .certificate { border-color: #1f2420 !important; }
        }
      ` }} />
      <div className="max-w-3xl mx-auto">
        <div className="no-print flex flex-wrap items-center justify-between gap-4 mb-6">
          <p className="text-gray-700">Congratulations, {user.first_name}. You finished every week.</p>
          <div className="flex gap-2">
            <button type="button" id="print-cert" className="btn btn-primary">Print or save as PDF</button>
            <a href="/tracks" className="btn btn-secondary">Back to tracks</a>
          </div>
        </div>
        <article className="certificate bg-white border-2 rounded-xl p-8 sm:p-16 text-center" style={{ borderColor: "var(--forest)" }}>
          <img src="/images/logo.svg" alt="Mentino" width={48} height={48} className="w-12 h-12 mx-auto" />
          <p className="t-eyebrow mt-8">Certificate of Completion</p>
          <p className="text-gray-600 mt-8">This certifies that</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-gray-900 mt-4">{name}</h1>
          <p className="text-gray-600 mt-8">completed the Mentino Career Track</p>
          <h2 className="text-2xl sm:text-3xl text-gray-900 mt-4">{track.title}</h2>
          <p className="text-gray-600 mt-4">{track.weeks.length} weeks · {track.weeks.reduce((n, w) => n + w.lessons.length, 0)} lessons · {track.weeks.length} assignments · {track.weeks.length} quizzes</p>
          <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-4 text-sm text-gray-600">
            <span>Completed {completed}</span>
            <span>mentino.org</span>
          </div>
        </article>
      </div>
      <script dangerouslySetInnerHTML={{ __html: `document.getElementById('print-cert').addEventListener('click', function(){ window.print(); });` }} />
    </Layout>
  );
});
