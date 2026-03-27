// ── Badge & Level Definitions ─────────────────────────────────────────────────

export interface MentorBadge {
  id: string;
  label: string;
  description: string;
  color: string; // tailwind bg color
  textColor: string;
  icon: string; // emoji
}

export interface StudentBadge {
  id: string;
  label: string;
  description: string;
  color: string;
  textColor: string;
  icon: string;
}

export interface Level {
  number: number;
  label: string;
  nextThreshold: number | null; // sessions needed for next level (null = max)
  color: string;
}

// ── Mentor Badges ─────────────────────────────────────────────────────────────

const MENTOR_BADGE_DEFS: Record<string, Omit<MentorBadge, "id">> = {
  "top-rated": {
    label: "Top Rated",
    description: "Average rating ≥ 4.5 with 5+ reviews",
    color: "bg-amber-100",
    textColor: "text-amber-800",
    icon: "🏆",
  },
  "most-active": {
    label: "Most Active",
    description: "10+ completed mentoring sessions",
    color: "bg-emerald-100",
    textColor: "text-emerald-800",
    icon: "⚡",
  },
  "expert": {
    label: "Expert Mentor",
    description: "Verified mentor with 5+ years experience",
    color: "bg-indigo-100",
    textColor: "text-indigo-800",
    icon: "🎯",
  },
  "rising": {
    label: "Rising Star",
    description: "New mentor with outstanding early feedback",
    color: "bg-violet-100",
    textColor: "text-violet-800",
    icon: "🌟",
  },
  "consistent": {
    label: "Consistent",
    description: "High ratings across multiple students",
    color: "bg-teal-100",
    textColor: "text-teal-800",
    icon: "💎",
  },
};

export function getMentorBadges(params: {
  completedSessions: number;
  ratedSessions: { rating: number }[];
  verificationStatus: string;
  yearsExperience: number;
  createdAt: string;
  uniqueStudents: number;
}): MentorBadge[] {
  const badges: MentorBadge[] = [];
  const { completedSessions, ratedSessions, verificationStatus, yearsExperience, createdAt, uniqueStudents } = params;

  const avgRating = ratedSessions.length > 0
    ? ratedSessions.reduce((s, r) => s + r.rating, 0) / ratedSessions.length
    : 0;

  // Top Rated: avg ≥ 4.5 with ≥ 5 reviews
  if (avgRating >= 4.5 && ratedSessions.length >= 5) {
    badges.push({ id: "top-rated", ...MENTOR_BADGE_DEFS["top-rated"] });
  }

  // Most Active: ≥ 10 completed sessions
  if (completedSessions >= 10) {
    badges.push({ id: "most-active", ...MENTOR_BADGE_DEFS["most-active"] });
  }

  // Expert Mentor: verified + 5+ years experience
  if (verificationStatus === "approved" && yearsExperience >= 5) {
    badges.push({ id: "expert", ...MENTOR_BADGE_DEFS["expert"] });
  }

  // Rising Star: joined within last 6 months, avg ≥ 4.0, ≥ 3 sessions
  const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
  const isNew = new Date(createdAt) > sixMonthsAgo;
  if (isNew && avgRating >= 4.0 && ratedSessions.length >= 3) {
    badges.push({ id: "rising", ...MENTOR_BADGE_DEFS["rising"] });
  }

  // Consistent: ≥ 3 unique students with avg ≥ 4.2
  if (uniqueStudents >= 3 && avgRating >= 4.2) {
    badges.push({ id: "consistent", ...MENTOR_BADGE_DEFS["consistent"] });
  }

  return badges;
}

// ── Mentor Levels ─────────────────────────────────────────────────────────────

export function getMentorLevel(completedSessions: number, avgRating: number): Level {
  if (completedSessions >= 25 && avgRating >= 4.0) {
    return { number: 4, label: "Elite Mentor", nextThreshold: null, color: "text-amber-600" };
  }
  if (completedSessions >= 10) {
    return { number: 3, label: "Proven Mentor", nextThreshold: 25, color: "text-indigo-600" };
  }
  if (completedSessions >= 3) {
    return { number: 2, label: "Active Mentor", nextThreshold: 10, color: "text-emerald-600" };
  }
  return { number: 1, label: "New Mentor", nextThreshold: 3, color: "text-gray-500" };
}

// ── Student Badges ────────────────────────────────────────────────────────────

const STUDENT_BADGE_DEFS: Record<string, Omit<StudentBadge, "id">> = {
  "first-session": {
    label: "First Session",
    description: "Completed your first mentoring session",
    color: "bg-emerald-100",
    textColor: "text-emerald-800",
    icon: "🎉",
  },
  "goal-setter": {
    label: "Goal Setter",
    description: "Set meaningful learning goals",
    color: "bg-blue-100",
    textColor: "text-blue-800",
    icon: "🎯",
  },
  "consistent": {
    label: "Consistent Learner",
    description: "Completed 5+ sessions — you're committed!",
    color: "bg-violet-100",
    textColor: "text-violet-800",
    icon: "📚",
  },
  "explorer": {
    label: "Explorer",
    description: "Connected with 3+ different mentors",
    color: "bg-amber-100",
    textColor: "text-amber-800",
    icon: "🔭",
  },
  "high-performer": {
    label: "High Performer",
    description: "Received positive feedback from mentors",
    color: "bg-rose-100",
    textColor: "text-rose-800",
    icon: "⭐",
  },
};

export function getStudentBadges(params: {
  completedSessions: number;
  learningGoals: string | null;
  uniqueMentors: number;
  receivedPositiveFeedback: boolean;
}): StudentBadge[] {
  const badges: StudentBadge[] = [];
  const { completedSessions, learningGoals, uniqueMentors, receivedPositiveFeedback } = params;

  if (completedSessions >= 1) {
    badges.push({ id: "first-session", ...STUDENT_BADGE_DEFS["first-session"] });
  }
  if (learningGoals && learningGoals.trim().length > 10) {
    badges.push({ id: "goal-setter", ...STUDENT_BADGE_DEFS["goal-setter"] });
  }
  if (completedSessions >= 5) {
    badges.push({ id: "consistent", ...STUDENT_BADGE_DEFS["consistent"] });
  }
  if (uniqueMentors >= 3) {
    badges.push({ id: "explorer", ...STUDENT_BADGE_DEFS["explorer"] });
  }
  if (receivedPositiveFeedback) {
    badges.push({ id: "high-performer", ...STUDENT_BADGE_DEFS["high-performer"] });
  }

  return badges;
}

// ── Student Levels ────────────────────────────────────────────────────────────

export function getStudentLevel(completedSessions: number): Level {
  if (completedSessions >= 15) {
    return { number: 4, label: "Advanced Student", nextThreshold: null, color: "text-amber-600" };
  }
  if (completedSessions >= 5) {
    return { number: 3, label: "Committed Student", nextThreshold: 15, color: "text-indigo-600" };
  }
  if (completedSessions >= 1) {
    return { number: 2, label: "Active Student", nextThreshold: 5, color: "text-emerald-600" };
  }
  return { number: 1, label: "New Student", nextThreshold: 1, color: "text-gray-500" };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Parse "would meet again" from feedback string: stored as "[again:yes]\nReview text" */
export function parseMeetAgain(feedback: string | null): boolean | null {
  if (!feedback) return null;
  if (feedback.startsWith("[again:yes]")) return true;
  if (feedback.startsWith("[again:no]")) return false;
  return null;
}

export function parseReviewText(feedback: string | null): string {
  if (!feedback) return "";
  return feedback.replace(/^\[again:(yes|no)\]\n?/, "").trim();
}

export function encodeFeedback(meetAgain: boolean | null, text: string): string {
  const prefix = meetAgain === true ? "[again:yes]\n" : meetAgain === false ? "[again:no]\n" : "";
  return prefix + (text || "");
}
