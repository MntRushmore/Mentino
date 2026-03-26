import { supabase } from "../db";

interface MatchResult {
  mentorId: string;
  mentorDbId: string;
  score: number;
  reason: string;
  mentor: any;
  mentorUser: any;
}

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

  const results: MatchResult[] = [];

  for (const mentor of mentors) {
    // Skip if profile not complete, already matched, or at capacity
    if (!mentor.accounts?.registration_complete) continue;
    if (matchedMentorIds.has(mentor.id)) continue;
    if (mentor.current_mentees >= mentor.max_mentees) continue;

    const { score, reasons } = calculateScore(student, mentor);

    results.push({
      mentorId: mentor.accounts.id,
      mentorDbId: mentor.id,
      score,
      reason: reasons.join(". "),
      mentor,
      mentorUser: mentor.accounts,
    });
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, 10);
}

function calculateScore(
  student: any,
  mentor: any
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 1. Career field overlap (35%)
  const studentInterests: string[] = student.career_interests || [];
  if (studentInterests.includes(mentor.career_field)) {
    score += 35;
    reasons.push(`Matches your interest in ${mentor.career_field}`);
  } else {
    // Partial score if related
    score += 5;
  }

  // 2. Topic relevance (25%)
  const mentorTopics: string[] = mentor.topics || [];
  const goalWords = (student.learning_goals || "").toLowerCase().split(/\s+/);
  const topicKeywords: Record<string, string[]> = {
    "Breaking into the field": ["break", "start", "begin", "enter", "get into", "career"],
    "Interview prep": ["interview", "prepare", "job", "hiring"],
    "Resume review": ["resume", "cv", "application"],
    "Career growth": ["grow", "advance", "promotion", "career"],
    "College guidance": ["college", "university", "school", "admission"],
    "Entrepreneurship": ["business", "startup", "entrepreneur", "found"],
    "Work-life balance": ["balance", "burnout", "stress"],
    "Networking": ["network", "connection", "linkedin"],
    "Leadership": ["lead", "manage", "team"],
    "Industry trends": ["trend", "future", "industry"],
    "Technical skills": ["technical", "coding", "skill", "learn"],
    "Soft skills": ["communication", "soft", "interpersonal"],
  };

  let topicMatches = 0;
  for (const topic of mentorTopics) {
    const keywords = topicKeywords[topic] || [];
    if (keywords.some((kw) => goalWords.some((gw: string) => gw.includes(kw)))) {
      topicMatches++;
    }
  }
  const topicScore = mentorTopics.length > 0 ? (topicMatches / mentorTopics.length) * 25 : 0;
  score += topicScore;
  if (topicMatches > 0) {
    reasons.push(`${topicMatches} topic(s) match your goals`);
  }

  // 3. Availability overlap (20%)
  const studentAvail: Record<string, string[]> = student.availability || {};
  const mentorAvail: Record<string, string[]> = mentor.availability || {};
  let overlapSlots = 0;
  let totalStudentSlots = 0;

  for (const [day, slots] of Object.entries(studentAvail)) {
    totalStudentSlots += slots.length;
    const mentorSlots = mentorAvail[day] || [];
    overlapSlots += slots.filter((s: string) => mentorSlots.includes(s)).length;
  }

  const availScore = totalStudentSlots > 0 ? (overlapSlots / totalStudentSlots) * 20 : 10;
  score += availScore;
  if (overlapSlots > 0) {
    reasons.push(`${overlapSlots} matching time slot(s)`);
  }

  // 4. Personality compatibility (15%)
  const studentTags: string[] = student.personality_tags || [];
  const mentorTags: string[] = mentor.personality_tags || [];
  let personalityScore = 0;
  let personalityMatches = 0;

  for (const sTag of studentTags) {
    const compatibleMentorTags = COMPATIBLE_TAGS[sTag] || [];
    if (mentorTags.some((mTag) => compatibleMentorTags.includes(mTag))) {
      personalityMatches++;
    }
  }

  if (studentTags.length > 0) {
    personalityScore = (personalityMatches / studentTags.length) * 15;
  }
  score += personalityScore;
  if (personalityMatches > 0) {
    reasons.push("Compatible mentoring style");
  }

  // 5. Mentor capacity (5%)
  const capacityRatio = (mentor.max_mentees - (mentor.current_mentees || 0)) / mentor.max_mentees;
  score += capacityRatio * 5;

  return { score: Math.round(score * 100) / 100, reasons };
}
