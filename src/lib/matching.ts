import { supabase } from "../db";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MatchResult {
  mentorId: string;
  mentorDbId: string;
  score: number;
  reason: string;
  matchLabel: "Best Match" | "Strong Alternative" | "Wildcard Match" | null;
  mentor: any;
  mentorUser: any;
}

// ── Compatibility maps ────────────────────────────────────────────────────────

// Personality compatibility matrix
const COMPATIBLE_TAGS: Record<string, string[]> = {
  "Visual learner": ["Patient", "Structured", "Detail-oriented"],
  "Hands-on": ["Direct", "Technical", "Casual"],
  "Analytical": ["Technical", "Structured", "Detail-oriented"],
  "Creative": ["Encouraging", "Storyteller", "Casual"],
  "Introvert": ["Patient", "Empathetic", "Structured"],
  "Extrovert": ["Direct", "Casual", "Storyteller"],
  "Detail-oriented": ["Structured", "Technical", "Detail-oriented"],
  "Big-picture thinker": ["Strategic", "Storyteller", "Encouraging"],
  "Curious": ["Storyteller", "Patient", "Encouraging"],
  "Goal-oriented": ["Direct", "Strategic", "Structured"],
};

// Maps student need tags → mentor topic names they align with
const NEED_TO_TOPIC: Record<string, string[]> = {
  "Need: college applications": ["College guidance", "Career growth", "Breaking into the field"],
  "Need: career exploration": ["Breaking into the field", "Industry trends", "Career growth"],
  "Need: skill building": ["Technical skills", "Soft skills", "Leadership"],
  "Need: interview prep": ["Interview prep", "Career growth"],
  "Need: networking": ["Networking", "Leadership", "Career growth"],
  "Need: day-in-life insights": ["Breaking into the field", "Industry trends"],
  "Need: resume cv": ["Resume review", "Interview prep"],
  "Need: entrepreneurship": ["Entrepreneurship", "Leadership", "Career growth"],
};

// Maps student style preference → mentor approach tag
const STYLE_TO_APPROACH: Record<string, string> = {
  "Style: structured sessions": "Approach: structured sessions",
  "Style: casual chats": "Approach: casual conversations",
  "Style: project-based": "Approach: project-based",
  "Style: advice on demand": "Approach: available when needed",
};

// Career field keyword map — enables partial/keyword matching
// Maps a broad field label → keywords that appear in mentor career_field or bio
const CAREER_KEYWORDS: Record<string, string[]> = {
  "Technology": ["tech", "software", "engineer", "developer", "coding", "programming", "computer", "it ", "data", "ai", "machine learning", "cyber", "cloud", "devops", "product"],
  "Technology & Software": ["tech", "software", "engineer", "developer", "coding", "programming", "computer"],
  "Business": ["business", "management", "operations", "strategy", "consulting", "corporate"],
  "Business & Management": ["business", "management", "operations", "strategy", "consulting", "corporate"],
  "Finance": ["finance", "financial", "investment", "banking", "accounting", "fintech", "wealth", "equity", "hedge", "portfolio"],
  "Finance & Accounting": ["finance", "financial", "investment", "banking", "accounting", "fintech"],
  "Medicine": ["medicine", "medical", "doctor", "physician", "health", "clinical", "nursing", "surgeon", "healthcare"],
  "Medicine & Healthcare": ["medicine", "medical", "doctor", "physician", "health", "clinical", "nursing", "healthcare"],
  "Law": ["law", "legal", "attorney", "lawyer", "counsel", "litigation", "compliance"],
  "Law & Legal Services": ["law", "legal", "attorney", "lawyer", "counsel"],
  "Engineering": ["engineer", "engineering", "mechanical", "electrical", "civil", "aerospace", "robotics", "hardware"],
  "Science": ["science", "research", "biology", "chemistry", "physics", "lab", "academia"],
  "Science & Research": ["science", "research", "biology", "chemistry", "physics", "lab"],
  "Sports & Athletics": ["sport", "athlete", "coach", "athletic", "basketball", "football", "soccer", "baseball", "track", "swim", "fitness", "training", "d1", "ncaa"],
  "Arts & Design": ["art", "design", "creative", "graphic", "ux", "ui", "visual", "brand", "illustration"],
  "Marketing & Advertising": ["marketing", "advertising", "brand", "social media", "digital", "growth", "seo", "content", "pr"],
  "Real Estate": ["real estate", "property", "realty", "broker", "mortgage", "housing"],
  "Entrepreneurship": ["entrepreneur", "startup", "founder", "venture", "business owner", "self-employed"],
  "Education": ["education", "teacher", "professor", "tutor", "curriculum", "school"],
  "Non-Profit & Social Impact": ["nonprofit", "non-profit", "social", "impact", "ngo", "charity", "community"],
  "Government & Public Policy": ["government", "policy", "public", "political", "administration", "federal", "state"],
  "Consulting": ["consult", "strategy", "advisory", "management consult", "mckinsey", "bain", "bcg"],
  "Cybersecurity": ["cyber", "security", "infosec", "penetration", "vulnerability", "soc"],
  "Data Science & AI": ["data", "machine learning", "ai", "artificial intelligence", "analytics", "python", "statistics"],
  "Gaming & Esports": ["gaming", "game", "esport", "esports", "streamer", "twitch", "unity", "unreal"],
  "Photography & Visual Arts": ["photo", "photography", "film", "video", "cinematography", "visual"],
  "Aviation & Aerospace": ["aviation", "aerospace", "pilot", "aircraft", "nasa", "spacex", "flight"],
  "Architecture": ["architect", "architecture", "design", "urban planning", "interior"],
  "Psychology & Mental Health": ["psychology", "mental health", "therapy", "counseling", "behavioral"],
};

// Goal alignment: keywords a student goal might contain → mentor signals that match
const GOAL_SIGNALS: Array<{
  goalKeywords: string[];
  mentorSignals: string[];
  label: string;
}> = [
  {
    goalKeywords: ["college", "university", "admission", "recruit", "scholarship", "d1", "ncaa", "division"],
    mentorSignals: ["college", "university", "recruit", "d1", "ncaa", "admission", "scholarship", "college guidance"],
    label: "Can help with college prep",
  },
  {
    goalKeywords: ["invest", "stock", "market", "finance", "wealth", "trading", "fund", "portfolio"],
    mentorSignals: ["finance", "investment", "trading", "portfolio", "fund", "banking", "financial"],
    label: "Strong finance background",
  },
  {
    goalKeywords: ["startup", "entrepreneur", "business", "company", "found", "product", "launch", "idea"],
    mentorSignals: ["startup", "entrepreneur", "founder", "venture", "entrepreneurship", "business owner"],
    label: "Entrepreneurial experience",
  },
  {
    goalKeywords: ["internship", "job", "hire", "career", "work", "professional", "industry"],
    mentorSignals: ["career", "internship", "hiring", "interview prep", "career growth", "breaking into the field"],
    label: "Can guide career entry",
  },
  {
    goalKeywords: ["resume", "cv", "application", "linkedin"],
    mentorSignals: ["resume", "resume review", "interview prep", "career growth"],
    label: "Resume & application expertise",
  },
  {
    goalKeywords: ["network", "connect", "linkedin", "relationship"],
    mentorSignals: ["network", "networking", "linkedin", "connection", "industry"],
    label: "Strong networking background",
  },
  {
    goalKeywords: ["code", "programming", "software", "app", "web", "developer", "engineer", "technical", "skill"],
    mentorSignals: ["software", "engineer", "coding", "developer", "technical skills", "tech"],
    label: "Technical skills mentor",
  },
  {
    goalKeywords: ["doctor", "medical", "healthcare", "hospital", "medicine", "patient", "clinical"],
    mentorSignals: ["medicine", "medical", "doctor", "healthcare", "clinical", "physician", "nursing"],
    label: "Healthcare insider",
  },
  {
    goalKeywords: ["law", "lawyer", "attorney", "legal", "justice", "court"],
    mentorSignals: ["law", "legal", "attorney", "lawyer", "litigation"],
    label: "Legal career insight",
  },
  {
    goalKeywords: ["sport", "athlete", "coach", "play", "team", "basketball", "football", "soccer", "baseball", "swim", "track"],
    mentorSignals: ["sport", "athlete", "coach", "d1", "ncaa", "athletics", "fitness"],
    label: "Sports & athletics mentor",
  },
  {
    goalKeywords: ["electrician", "trade", "contractor", "construction", "blue collar", "skilled trade"],
    mentorSignals: ["engineer", "construction", "trade", "entrepreneur", "business owner"],
    label: "Trades & business experience",
  },
  {
    goalKeywords: ["lead", "manage", "team", "people", "organization"],
    mentorSignals: ["leadership", "management", "team", "executive", "manager"],
    label: "Leadership development",
  },
];

// Topic keyword map for goal→topic matching
const TOPIC_KEYWORDS: Record<string, string[]> = {
  "Breaking into the field": ["break", "start", "begin", "enter", "get into", "career"],
  "Interview prep": ["interview", "prepare", "job", "hiring"],
  "Resume review": ["resume", "cv", "application"],
  "Career growth": ["grow", "advance", "promotion", "career"],
  "College guidance": ["college", "university", "school", "admission", "recruit"],
  "Entrepreneurship": ["business", "startup", "entrepreneur", "found", "company"],
  "Work-life balance": ["balance", "burnout", "stress"],
  "Networking": ["network", "connection", "linkedin"],
  "Leadership": ["lead", "manage", "team"],
  "Industry trends": ["trend", "future", "industry"],
  "Technical skills": ["technical", "coding", "skill", "learn", "programming"],
  "Soft skills": ["communication", "soft", "interpersonal"],
};

const PREFIXES = ["Need:", "Style:", "Freq:", "Approach:", "Best for:"];

// ── Hard filter helpers ───────────────────────────────────────────────────────

function hasScheduleOverlap(
  studentAvail: Record<string, string[]>,
  mentorAvail: Record<string, string[]>
): boolean {
  for (const [day, slots] of Object.entries(studentAvail)) {
    const mentorSlots = mentorAvail[day] || [];
    if (slots.some((s) => mentorSlots.includes(s))) return true;
  }
  return false;
}

// ── Main find function ────────────────────────────────────────────────────────

export async function findMatches(studentUserId: string): Promise<MatchResult[]> {
  // Get student data
  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", studentUserId)
    .single();

  if (!student) return [];

  // Get all mentors who have completed registration (approved or pending verification)
  const { data: mentors } = await supabase
    .from("mentors")
    .select("*, accounts!user_id!inner(id, first_name, last_name, email, bio, avatar_url, registration_complete)")
    .in("verification_status", ["approved", "pending"]);

  if (!mentors || mentors.length === 0) return [];

  // Filter out mentors already matched with this student
  const { data: existingMatches } = await supabase
    .from("matches")
    .select("mentor_id")
    .eq("student_id", student.id)
    .in("status", ["pending", "accepted", "active"]);

  const matchedMentorIds = new Set(existingMatches?.map((m: any) => m.mentor_id) || []);

  // Fetch feedback scores for all mentors (avg rating from completed sessions)
  const { data: ratedSessions } = await supabase
    .from("sessions")
    .select("match_id, rating, matches!inner(mentor_id)")
    .eq("status", "completed")
    .not("rating", "is", null);

  // Build mentor feedback map: mentorDbId → { totalRating, count }
  const mentorFeedback: Record<string, { total: number; count: number }> = {};
  for (const s of ratedSessions || []) {
    const mid = (s as any).matches?.mentor_id;
    if (!mid) continue;
    if (!mentorFeedback[mid]) mentorFeedback[mid] = { total: 0, count: 0 };
    mentorFeedback[mid].total += s.rating;
    mentorFeedback[mid].count += 1;
  }

  const results: MatchResult[] = [];

  for (const mentor of mentors) {
    // Skip if profile not complete or already matched
    if (!mentor.accounts?.registration_complete) continue;
    if (matchedMentorIds.has(mentor.id)) continue;

    // HARD FILTER 1: mentor at capacity → skip
    if ((mentor.current_mentees || 0) >= mentor.max_mentees) continue;

    // HARD FILTER 2: no schedule overlap → skip
    const studentAvail: Record<string, string[]> = student.availability || {};
    const mentorAvail: Record<string, string[]> = mentor.availability || {};
    if (
      Object.keys(studentAvail).length > 0 &&
      Object.keys(mentorAvail).length > 0 &&
      !hasScheduleOverlap(studentAvail, mentorAvail)
    ) continue;

    const { score, reasons } = calculateScore(student, mentor, mentorFeedback[mentor.id]);

    results.push({
      mentorId: mentor.accounts.id,
      mentorDbId: mentor.id,
      score,
      reason: reasons.join(". "),
      matchLabel: null,
      mentor,
      mentorUser: mentor.accounts,
    });
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  // Assign match labels to top 3, show ALL results
  if (results[0]) results[0].matchLabel = "Best Match";
  if (results[1]) results[1].matchLabel = "Strong Alternative";
  if (results[2]) results[2].matchLabel = "Wildcard Match";

  return results;
}

// ── Scoring ───────────────────────────────────────────────────────────────────

function calculateScore(
  student: any,
  mentor: any,
  feedback?: { total: number; count: number }
): { score: number; reasons: string[] } {
  const reasons: string[] = [];

  // ── 1. Career Alignment (30 pts) ──────────────────────────────────────────
  // Keyword-based partial matching — not just exact field comparison
  const studentInterests: string[] = student.career_interests || [];
  const mentorField: string = (mentor.career_field || "").toLowerCase();
  const mentorBio: string = (mentor.accounts?.bio || "").toLowerCase();
  const mentorJobTitle: string = (mentor.job_title || "").toLowerCase();
  const mentorSearchText = `${mentorField} ${mentorBio} ${mentorJobTitle}`;

  let careerHits = 0;
  for (const interest of studentInterests) {
    const keywords = CAREER_KEYWORDS[interest] || [interest.toLowerCase()];
    if (keywords.some((kw) => mentorSearchText.includes(kw))) {
      careerHits++;
    }
  }

  let careerScore = 0;
  if (studentInterests.length > 0) {
    const ratio = careerHits / studentInterests.length;
    if (ratio >= 0.5) {
      careerScore = 30;
      reasons.push(`Strong career alignment in ${mentor.career_field}`);
    } else if (ratio > 0) {
      careerScore = 30 * ratio * 0.7; // partial credit
      reasons.push(`Partial career match (${careerHits}/${studentInterests.length} interest areas)`);
    } else {
      careerScore = 3; // small base to not zero-out
    }
  } else {
    careerScore = 15; // unknown interests → neutral
  }

  // ── 2. Topic Relevance (20 pts) ───────────────────────────────────────────
  const mentorTopics: string[] = mentor.topics || [];
  const goalWords = (student.learning_goals || "").toLowerCase().split(/\s+/);

  let topicMatches = 0;
  for (const topic of mentorTopics) {
    const kws = TOPIC_KEYWORDS[topic] || [];
    if (kws.some((kw) => goalWords.some((gw: string) => gw.includes(kw)))) {
      topicMatches++;
    }
  }
  const topicScore = mentorTopics.length > 0 ? (topicMatches / mentorTopics.length) * 20 : 0;
  if (topicMatches > 0) reasons.push(`${topicMatches} topic(s) match your goals`);

  // ── 3. Goal Alignment (20 pts) — NEW ──────────────────────────────────────
  // Compares student's free-text goals against mentor's bio, topics, career field
  const studentGoal = (student.learning_goals || "").toLowerCase();
  const mentorSignalText = `${mentorSearchText} ${mentorTopics.join(" ").toLowerCase()}`;

  let goalHits = 0;
  const goalMatchLabels: string[] = [];
  for (const signal of GOAL_SIGNALS) {
    const goalMatches = signal.goalKeywords.some((kw) => studentGoal.includes(kw));
    const mentorMatches = signal.mentorSignals.some((s) => mentorSignalText.includes(s));
    if (goalMatches && mentorMatches) {
      goalHits++;
      goalMatchLabels.push(signal.label);
    }
  }
  const goalScore = Math.min(goalHits * 7, 20); // each hit worth 7, cap at 20
  if (goalHits > 0) reasons.push(goalMatchLabels[0]); // show strongest match label

  // ── 4. Schedule Match (15 pts) ────────────────────────────────────────────
  const studentAvail: Record<string, string[]> = student.availability || {};
  const mentorAvail: Record<string, string[]> = mentor.availability || {};
  let overlapSlots = 0;
  let totalStudentSlots = 0;

  for (const [day, slots] of Object.entries(studentAvail)) {
    totalStudentSlots += (slots as string[]).length;
    const ms = mentorAvail[day] || [];
    overlapSlots += (slots as string[]).filter((s) => ms.includes(s)).length;
  }

  const scheduleScore = totalStudentSlots > 0 ? (overlapSlots / totalStudentSlots) * 15 : 7.5;
  if (overlapSlots > 0) reasons.push(`${overlapSlots} overlapping time slot(s)`);

  // ── 5. Personality Fit (10 pts) ───────────────────────────────────────────
  const studentTags: string[] = student.personality_tags || [];
  const mentorTags: string[] = mentor.personality_tags || [];
  const coreStudentTags = studentTags.filter((t) => !PREFIXES.some((p) => t.startsWith(p)));
  const coreMentorTags = mentorTags.filter((t) => !PREFIXES.some((p) => t.startsWith(p)));

  let personalityMatches = 0;
  for (const sTag of coreStudentTags) {
    const compat = COMPATIBLE_TAGS[sTag] || [];
    if (coreMentorTags.some((mTag) => compat.includes(mTag))) personalityMatches++;
  }
  const personalityScore = coreStudentTags.length > 0
    ? (personalityMatches / coreStudentTags.length) * 10
    : 0;
  if (personalityMatches > 0) reasons.push("Compatible personality styles");

  // Style alignment bonus (folded into personality)
  const studentStyles = studentTags.filter((t) => t.startsWith("Style:"));
  let styleMatches = 0;
  for (const style of studentStyles) {
    const needed = STYLE_TO_APPROACH[style];
    if (needed && mentorTags.includes(needed)) styleMatches++;
  }
  const styleBonus = studentStyles.length > 0 ? (styleMatches / studentStyles.length) * 5 : 0;
  if (styleMatches > 0) reasons.push("Mentoring approach is a strong fit");

  // Needs → mentor topics alignment bonus
  const studentNeeds = studentTags.filter((t) => t.startsWith("Need:"));
  let needMatches = 0;
  for (const need of studentNeeds) {
    const related = NEED_TO_TOPIC[need] || [];
    if (related.some((rt) => mentorTopics.includes(rt))) needMatches++;
  }
  const needsBonus = studentNeeds.length > 0 ? (needMatches / studentNeeds.length) * 5 : 0;
  if (needMatches > 0) reasons.push(`${needMatches} of your specific need(s) covered`);

  // Experience level fit bonus
  const gradeOrYear: string = student.grade_or_year || "";
  const isHS = gradeOrYear.toLowerCase().includes("grade");
  const isCollege = gradeOrYear.toLowerCase().includes("college") || gradeOrYear.toLowerCase().includes("graduate");
  const bestFor: string[] = mentorTags.filter((t) => t.startsWith("Best for:"));
  const years: number = mentor.years_experience || 0;
  let expBonus = 0;
  if (isHS) {
    if (bestFor.includes("Best for: high schoolers") || bestFor.includes("Best for: any student")) expBonus += 3;
    if (years >= 2 && years <= 15) expBonus += 2;
  } else if (isCollege) {
    if (bestFor.includes("Best for: college students") || bestFor.includes("Best for: any student")) expBonus += 3;
    if (years >= 3 && years <= 20) expBonus += 2;
  } else {
    expBonus = bestFor.includes("Best for: any student") ? 3 : 2;
  }
  const expBonusCapped = Math.min(expBonus, 4);
  if (expBonusCapped >= 3) reasons.push("Experience level is a great fit for your stage");

  // ── 6. Mentor Capacity (5 pts) ────────────────────────────────────────────
  const capacityRatio = (mentor.max_mentees - (mentor.current_mentees || 0)) / mentor.max_mentees;
  const capacityScore = capacityRatio * 5;

  // ── FEEDBACK LOOP: rating bonus (±5 pts) ──────────────────────────────────
  // Mentors with avg rating ≥ 4.0 get a boost; ≤ 2.5 get a penalty
  let feedbackBonus = 0;
  if (feedback && feedback.count >= 2) {
    const avg = feedback.total / feedback.count;
    if (avg >= 4.5) {
      feedbackBonus = 5;
      reasons.push(`Highly rated mentor (${avg.toFixed(1)}★)`);
    } else if (avg >= 4.0) {
      feedbackBonus = 3;
      reasons.push(`Well-rated mentor (${avg.toFixed(1)}★)`);
    } else if (avg <= 2.5) {
      feedbackBonus = -5;
    } else if (avg <= 3.0) {
      feedbackBonus = -2;
    }
  }

  // ── Final score (weights sum to 100 + bonuses) ────────────────────────────
  const raw =
    careerScore +          // 30
    topicScore +           // 20
    goalScore +            // 20
    scheduleScore +        // 15
    personalityScore +     // 10
    styleBonus +           // up to 5 (bonus)
    needsBonus +           // up to 5 (bonus)
    expBonusCapped +       // up to 4 (bonus)
    capacityScore +        // 5
    feedbackBonus;         // ±5

  // Clamp to [0, 100]
  const score = Math.min(100, Math.max(0, Math.round(raw * 100) / 100));

  return { score, reasons };
}
