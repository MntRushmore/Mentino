import { supabase } from "../db";
import { requiresNotes, type Lesson, type Track, type Week } from "../data/tracks";

/** A lesson needs at least this much note-taking before it can be marked complete. */
export const NOTE_MIN_SENTENCES = 3;
export const NOTE_MIN_CHARS = 100;
export const NOTE_MAX_CHARS = 10000;
export const ASSIGNMENT_MAX_CHARS = 20000;

export interface LessonState { notes: string; notesUpdatedAt?: string; completedAt?: string }
export interface AssignmentState { response: string; submittedAt: string }
export interface QuizState { score: number; total: number; passed: boolean; answers: number[]; attemptedAt: string }
export interface TrackState {
  lessons: Record<string, LessonState>;
  assignments: Record<string, AssignmentState>;
  quizzes: Record<string, QuizState>;
}

export interface Enrollment {
  id: string;
  user_id: string;
  track_slug: string;
  state: TrackState;
  started_at: string;
  completed_at: string | null;
  updated_at: string;
}

export function emptyState(): TrackState {
  return { lessons: {}, assignments: {}, quizzes: {} };
}

function normalize(state: any): TrackState {
  return {
    lessons: state?.lessons ?? {},
    assignments: state?.assignments ?? {},
    quizzes: state?.quizzes ?? {},
  };
}

// ── Rules ─────────────────────────────────────────────────────────────────

export function countSentences(text: string): number {
  return (text.trim().match(/[^.!?]+[.!?]+(\s|$)/g) || []).filter((s) => s.trim().split(/\s+/).length >= 3).length;
}

export function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

export function notesQualify(text: string): boolean {
  return text.trim().length >= NOTE_MIN_CHARS && countSentences(text) >= NOTE_MIN_SENTENCES;
}

/** Whether a lesson can be marked complete with these notes (readings need no notes). */
export function canComplete(lesson: Lesson, notes: string): boolean {
  return !requiresNotes(lesson) || notesQualify(notes);
}

export interface WeekStatus {
  week: Week;
  unlocked: boolean;
  lessonsDone: number;
  lessonsTotal: number;
  allLessonsDone: boolean;
  assignmentDone: boolean;
  quizPassed: boolean;
  quizAttempted: boolean;
  /** Lessons and assignment done: enough to unlock the next week. */
  gateCleared: boolean;
  complete: boolean;
}

export function weekStatuses(track: Track, state: TrackState): WeekStatus[] {
  const out: WeekStatus[] = [];
  track.weeks.forEach((week, i) => {
    const lessonsDone = week.lessons.filter((l) => state.lessons[l.id]?.completedAt).length;
    const allLessonsDone = lessonsDone === week.lessons.length;
    const assignmentDone = !!state.assignments[week.assignment.id];
    const quiz = state.quizzes[week.quiz.id];
    const gateCleared = allLessonsDone && assignmentDone;
    out.push({
      week,
      unlocked: i === 0 || out[i - 1].gateCleared,
      lessonsDone,
      lessonsTotal: week.lessons.length,
      allLessonsDone,
      assignmentDone,
      quizPassed: !!quiz?.passed,
      quizAttempted: !!quiz,
      gateCleared,
      complete: gateCleared && !!quiz,
    });
  });
  return out;
}

export function progress(track: Track, state: TrackState) {
  const statuses = weekStatuses(track, state);
  let done = 0;
  let total = 0;
  for (const s of statuses) {
    total += s.lessonsTotal + 2;
    done += s.lessonsDone + (s.assignmentDone ? 1 : 0) + (s.quizAttempted ? 1 : 0);
  }
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0, statuses };
}

/**
 * The certificate unlocks when the final project is submitted. Weeks unlock in order
 * (lessons + assignment), so a submitted final project means every lesson and
 * assignment before it is done too. Quizzes check understanding but do not block it.
 */
export function isComplete(track: Track, state: TrackState): boolean {
  return weekStatuses(track, state).every((s) => s.gateCleared);
}

/** The single next thing the student should do, with a link straight to it. */
export function nextStep(track: Track, state: TrackState): { label: string; href: string; weekNumber: number } | null {
  for (const s of weekStatuses(track, state)) {
    if (!s.unlocked) break;
    const base = `/tracks/${track.slug}/week/${s.week.number}`;
    const lesson = s.week.lessons.find((l) => !state.lessons[l.id]?.completedAt);
    if (lesson) return { label: `Lesson: ${lesson.title}`, href: `${base}#lesson-${lesson.id}`, weekNumber: s.week.number };
    if (!s.assignmentDone) return { label: `Assignment: ${s.week.assignment.title}`, href: `${base}#assignment`, weekNumber: s.week.number };
    if (!s.quizAttempted) return { label: `Week ${s.week.number} quiz`, href: `${base}#quiz`, weekNumber: s.week.number };
  }
  return null;
}

export function currentWeek(track: Track, state: TrackState): number {
  return nextStep(track, state)?.weekNumber ?? track.weeks.length;
}

// ── Storage ───────────────────────────────────────────────────────────────

/** True when the track_enrollments table has not been created yet. */
export function isMissingTable(error: any): boolean {
  return !!error && (error.code === "PGRST205" || error.code === "42P01");
}

export class TracksUnavailable extends Error {}

function check(error: any) {
  if (isMissingTable(error)) throw new TracksUnavailable("track_enrollments table missing");
  if (error) throw new Error(error.message);
}

export async function getEnrollment(userId: string, slug: string): Promise<Enrollment | null> {
  const { data, error } = await supabase
    .from("track_enrollments")
    .select("*")
    .eq("user_id", userId)
    .eq("track_slug", slug)
    .maybeSingle();
  check(error);
  return data ? { ...(data as any), state: normalize((data as any).state) } : null;
}

export async function listEnrollments(userId: string): Promise<Enrollment[]> {
  const { data, error } = await supabase
    .from("track_enrollments")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  check(error);
  return (data || []).map((d: any) => ({ ...d, state: normalize(d.state) }));
}

export async function enroll(userId: string, slug: string): Promise<Enrollment> {
  const existing = await getEnrollment(userId, slug);
  if (existing) return existing;
  const { data, error } = await supabase
    .from("track_enrollments")
    .insert({ user_id: userId, track_slug: slug, state: emptyState() })
    .select("*")
    .single();
  check(error);
  return { ...(data as any), state: normalize((data as any).state) };
}

export async function saveState(enrollment: Enrollment, track: Track, state: TrackState): Promise<void> {
  const now = new Date().toISOString();
  const complete = isComplete(track, state);
  const { error } = await supabase
    .from("track_enrollments")
    .update({
      state,
      updated_at: now,
      completed_at: complete ? enrollment.completed_at ?? now : null,
    })
    .eq("id", enrollment.id);
  check(error);
}
