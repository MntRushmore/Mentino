/**
 * Mentino Match Quality Analysis Script
 * Run with: bun scripts/analyze-matches.ts
 *
 * Outputs:
 *  - Top 3 mentor matches for every registered student
 *  - Students with zero strong matches (score < 30)
 *  - Mentors receiving the most requests
 *  - Per-student score breakdowns
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  Bun.env.SUPABASE_URL!,
  Bun.env.SUPABASE_ANON_KEY!
);

// ── Scoring constants ────────────────────────────────────────────────────────

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

const STYLE_TO_APPROACH: Record<string, string> = {
  "Style: structured sessions": "Approach: structured sessions",
  "Style: casual chats": "Approach: casual conversations",
  "Style: project-based": "Approach: project-based",
  "Style: advice on demand": "Approach: available when needed",
};

const TOPIC_KEYWORDS: Record<string, string[]> = {
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

const PREFIXES = ["Need:", "Style:", "Freq:", "Approach:", "Best for:"];

// ── Scoring function ─────────────────────────────────────────────────────────

interface ScoreBreakdown {
  total: number;
  careerField: number;
  topicRelevance: number;
  availability: number;
  personality: number;
  styleAlignment: number;
  needsAlignment: number;
  experienceFit: number;
  capacity: number;
  reasons: string[];
}

function scoreStudentMentor(student: any, mentor: any): ScoreBreakdown {
  let total = 0;
  const reasons: string[] = [];

  // 1. Career field (35)
  const interests: string[] = student.career_interests || [];
  let careerField = 0;
  if (interests.includes(mentor.career_field)) {
    careerField = 35;
    reasons.push(`✅ Career field match: ${mentor.career_field}`);
  } else {
    careerField = 5;
    reasons.push(`⚠️  Career field mismatch (student: ${interests.join(", ")} | mentor: ${mentor.career_field})`);
  }
  total += careerField;

  // 2. Topic relevance (25)
  const mentorTopics: string[] = mentor.topics || [];
  const goalWords = (student.learning_goals || "").toLowerCase().split(/\s+/);
  let topicMatches = 0;
  for (const topic of mentorTopics) {
    const kws = TOPIC_KEYWORDS[topic] || [];
    if (kws.some((kw) => goalWords.some((gw: string) => gw.includes(kw)))) topicMatches++;
  }
  const topicRelevance = mentorTopics.length > 0 ? (topicMatches / mentorTopics.length) * 25 : 0;
  total += topicRelevance;
  if (topicMatches > 0) reasons.push(`✅ ${topicMatches} topic(s) match goals`);
  else reasons.push("⚠️  No topic↔goal overlap detected");

  // 3. Availability (20)
  const sAvail: Record<string, string[]> = student.availability || {};
  const mAvail: Record<string, string[]> = mentor.availability || {};
  let overlap = 0, studentSlots = 0;
  for (const [day, slots] of Object.entries(sAvail)) {
    studentSlots += slots.length;
    const ms = mAvail[day] || [];
    overlap += slots.filter((s: string) => ms.includes(s)).length;
  }
  const availability = studentSlots > 0 ? (overlap / studentSlots) * 20 : 10;
  total += availability;
  reasons.push(overlap > 0 ? `✅ ${overlap} overlapping time slot(s)` : "⚠️  No schedule overlap");

  // 4. Personality (10)
  const sTags: string[] = student.personality_tags || [];
  const mTags: string[] = mentor.personality_tags || [];
  const coreS = sTags.filter((t) => !PREFIXES.some((p) => t.startsWith(p)));
  const coreM = mTags.filter((t) => !PREFIXES.some((p) => t.startsWith(p)));
  let pMatches = 0;
  for (const st of coreS) {
    if ((COMPATIBLE_TAGS[st] || []).some((ct) => coreM.includes(ct))) pMatches++;
  }
  const personality = coreS.length > 0 ? (pMatches / coreS.length) * 10 : 0;
  total += personality;
  if (pMatches > 0) reasons.push(`✅ ${pMatches} personality compatibility match(es)`);

  // 5. Style alignment (8)
  const studentStyles = sTags.filter((t) => t.startsWith("Style:"));
  let styleHits = 0;
  for (const st of studentStyles) {
    const needed = STYLE_TO_APPROACH[st];
    if (needed && mTags.includes(needed)) styleHits++;
  }
  const styleAlignment = studentStyles.length > 0 ? (styleHits / studentStyles.length) * 8 : 0;
  total += styleAlignment;
  if (styleHits > 0) reasons.push(`✅ Mentoring style aligned (${studentStyles.filter(s => mTags.includes(STYLE_TO_APPROACH[s])).join(", ")})`);
  else if (studentStyles.length > 0) reasons.push(`⚠️  Style mismatch (student wants: ${studentStyles.join(", ")})`);

  // 6. Needs alignment (7)
  const studentNeeds = sTags.filter((t) => t.startsWith("Need:"));
  let needHits = 0;
  for (const n of studentNeeds) {
    if ((NEED_TO_TOPIC[n] || []).some((rt) => mentorTopics.includes(rt))) needHits++;
  }
  const needsAlignment = studentNeeds.length > 0 ? (needHits / studentNeeds.length) * 7 : 0;
  total += needsAlignment;
  if (needHits > 0) reasons.push(`✅ ${needHits}/${studentNeeds.length} specific need(s) covered by mentor topics`);
  else if (studentNeeds.length > 0) reasons.push(`⚠️  Needs not covered: ${studentNeeds.join(", ")}`);

  // 7. Experience fit (5)
  const grade: string = student.grade_or_year || "";
  const isHS = grade.toLowerCase().includes("grade");
  const isCollege = grade.toLowerCase().includes("college") || grade.toLowerCase().includes("graduate");
  const bestFor = mTags.filter((t) => t.startsWith("Best for:"));
  const yrs: number = mentor.years_experience || 0;
  let expFit = 0;
  if (isHS) {
    if (bestFor.includes("Best for: high schoolers") || bestFor.includes("Best for: any student")) expFit += 3;
    if (yrs >= 2 && yrs <= 15) expFit += 2;
  } else if (isCollege) {
    if (bestFor.includes("Best for: college students") || bestFor.includes("Best for: any student")) expFit += 3;
    if (yrs >= 3 && yrs <= 20) expFit += 2;
  } else {
    expFit = bestFor.includes("Best for: any student") ? 3 : 2;
  }
  const experienceFit = Math.min(expFit, 5);
  total += experienceFit;
  if (experienceFit >= 3) reasons.push(`✅ Experience level (${yrs} yrs) fits student stage`);

  // 8. Capacity (5)
  const cap = (mentor.max_mentees - (mentor.current_mentees || 0)) / mentor.max_mentees;
  const capacity = cap * 5;
  total += capacity;

  return {
    total: Math.round(total * 100) / 100,
    careerField: Math.round(careerField * 100) / 100,
    topicRelevance: Math.round(topicRelevance * 100) / 100,
    availability: Math.round(availability * 100) / 100,
    personality: Math.round(personality * 100) / 100,
    styleAlignment: Math.round(styleAlignment * 100) / 100,
    needsAlignment: Math.round(needsAlignment * 100) / 100,
    experienceFit: Math.round(experienceFit * 100) / 100,
    capacity: Math.round(capacity * 100) / 100,
    reasons,
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log("\n🔍  Mentino Match Quality Report");
console.log("=".repeat(60));

// Fetch students with full profiles
const { data: studentAccounts } = await supabase
  .from("accounts")
  .select("id, first_name, last_name, email, registration_complete")
  .eq("role", "student")
  .eq("registration_complete", true);

const { data: allStudents } = await supabase
  .from("students")
  .select("*");

const { data: allMentors } = await supabase
  .from("mentors")
  .select("*, accounts!user_id!inner(id, first_name, last_name, registration_complete)")
  .in("verification_status", ["approved", "pending"]);

if (!studentAccounts || !allStudents || !allMentors) {
  console.error("Failed to fetch data");
  process.exit(1);
}

const studentById: Record<string, any> = {};
for (const s of allStudents) studentById[s.user_id] = s;

const eligibleMentors = allMentors.filter((m: any) => m.accounts?.registration_complete);

console.log(`\n📊  ${studentAccounts.length} registered students | ${eligibleMentors.length} eligible mentors\n`);

const weakMatches: string[] = [];
const mentorRequestCount: Record<string, number> = {};

for (const account of studentAccounts) {
  const student = studentById[account.id];
  if (!student) {
    console.log(`⚠️  ${account.first_name} ${account.last_name} — no student profile found`);
    continue;
  }

  const scores = eligibleMentors.map((mentor: any) => ({
    mentor,
    ...scoreStudentMentor(student, mentor),
  })).sort((a: any, b: any) => b.total - a.total);

  const top3 = scores.slice(0, 3);
  const topScore = top3[0]?.total ?? 0;

  console.log(`\n👤  ${account.first_name} ${account.last_name} (${account.email})`);
  console.log(`    Grade: ${student.grade_or_year || "unknown"} | Interests: ${(student.career_interests || []).slice(0, 3).join(", ")}`);
  console.log(`    Needs: ${(student.personality_tags || []).filter((t: string) => t.startsWith("Need:")).join(", ") || "none specified"}`);
  console.log(`    Style: ${(student.personality_tags || []).filter((t: string) => t.startsWith("Style:")).join(", ") || "none specified"}`);
  console.log(`    Freq:  ${(student.personality_tags || []).filter((t: string) => t.startsWith("Freq:")).join(", ") || "none specified"}`);

  if (top3.length === 0) {
    console.log("    ❌  No eligible mentors");
    weakMatches.push(account.first_name + " " + account.last_name);
    continue;
  }

  console.log(`\n    Top matches:`);
  for (let i = 0; i < Math.min(3, top3.length); i++) {
    const m = top3[i];
    const name = `${m.mentor.accounts.first_name} ${m.mentor.accounts.last_name}`;
    const bar = "█".repeat(Math.round(m.total / 5)) + "░".repeat(20 - Math.round(m.total / 5));
    console.log(`    ${i + 1}. ${name} (${m.mentor.career_field}) — Score: ${m.total}/100`);
    console.log(`       [${bar}]`);
    console.log(`       Breakdown: field=${m.careerField} | topics=${m.topicRelevance.toFixed(1)} | avail=${m.availability.toFixed(1)} | personality=${m.personality.toFixed(1)} | style=${m.styleAlignment.toFixed(1)} | needs=${m.needsAlignment.toFixed(1)} | expFit=${m.experienceFit}`);
    for (const r of m.reasons.slice(0, 4)) {
      console.log(`       ${r}`);
    }
    // Track for demand analysis
    mentorRequestCount[name] = (mentorRequestCount[name] || 0) + 1;
  }

  if (topScore < 30) {
    weakMatches.push(`${account.first_name} ${account.last_name} (best score: ${topScore})`);
  }
}

// Summary
console.log("\n" + "=".repeat(60));
console.log("📋  SUMMARY");
console.log("=".repeat(60));

if (weakMatches.length > 0) {
  console.log(`\n⚠️  Students with weak matches (top score < 30):`);
  weakMatches.forEach((s) => console.log(`   - ${s}`));
  console.log(`\n   → Consider recruiting mentors in these fields or having these students update their profiles.`);
} else {
  console.log(`\n✅  All students have at least one strong match (score ≥ 30)`);
}

const sortedMentors = Object.entries(mentorRequestCount)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 5);

if (sortedMentors.length > 0) {
  console.log(`\n🏆  Most in-demand mentors (top 5):`);
  sortedMentors.forEach(([name, count]) => console.log(`   ${name}: top match for ${count} student(s)`));
}

console.log(`\n✅  Analysis complete.\n`);
