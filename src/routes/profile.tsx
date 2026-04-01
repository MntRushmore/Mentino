import { Hono } from "hono";
import React from "react";
import { renderToString } from "react-dom/server";
import { Layout } from "../views/Layout";
import { Badge } from "../views/components/Badge";
import { authMiddleware } from "../middleware/auth";
import { supabase } from "../db";
import { moderateFields } from "../lib/moderation";
import {
  getMentorBadges, getMentorLevel,
  getStudentBadges, getStudentLevel,
  parseMeetAgain, parseReviewText, encodeFeedback,
  type MentorBadge, type StudentBadge, type Level,
} from "../lib/badges";

const profile = new Hono();

function html(element: React.ReactElement, status = 200) {
  return new Response("<!DOCTYPE html>" + renderToString(element), {
    status,
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}

// GET /profile — own profile
profile.get("/profile", authMiddleware, async (c) => {
  const user = c.get("user");
  const roleData = await loadRoleData(user.id, user.role);

  let reviews: any[] = [];
  let mentorBadges: MentorBadge[] = [];
  let mentorLevel: Level | null = null;
  let studentBadges: StudentBadge[] = [];
  let studentLevel: Level | null = null;

  if (user.role === "mentor" && roleData?.id) {
    reviews = await loadMentorReviews(roleData.id);
    const completedCount = reviews.length;
    const ratedSessions = reviews.filter((r: any) => r.rating);
    const uniqueStudents = new Set(reviews.map((r: any) => r._studentUserId)).size;
    mentorBadges = getMentorBadges({
      completedSessions: completedCount,
      ratedSessions,
      verificationStatus: roleData.verification_status,
      yearsExperience: roleData.years_experience || 0,
      createdAt: user.created_at,
      uniqueStudents,
    });
    const avg = ratedSessions.length > 0
      ? ratedSessions.reduce((s: number, r: any) => s + r.rating, 0) / ratedSessions.length : 0;
    mentorLevel = getMentorLevel(completedCount, avg);
  }

  if (user.role === "student" && roleData) {
    const studentStats = await loadStudentStats(user.id);
    studentBadges = getStudentBadges(studentStats);
    studentLevel = getStudentLevel(studentStats.completedSessions);
  }

  return html(
    <Layout title="My Profile" user={user}>
      <ProfileView user={user} roleData={roleData} isOwn={true} reviews={reviews}
        mentorBadges={mentorBadges} mentorLevel={mentorLevel}
        studentBadges={studentBadges} studentLevel={studentLevel} />
    </Layout>
  );
});

// GET /profile/edit
profile.get("/profile/edit", authMiddleware, async (c) => {
  const user = c.get("user");
  const roleData = await loadRoleData(user.id, user.role);

  return html(
    <Layout title="Edit Profile" user={user}>
      <ProfileEditView user={user} roleData={roleData} />
    </Layout>
  );
});

// POST /profile/edit
profile.post("/profile/edit", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.parseBody({ all: true });

  const displayName = (body.display_name as string)?.trim() || null;
  const bio = (body.bio as string)?.trim() || null;
  const avatarUrl = (body.avatar_url as string)?.trim() || null;

  // Moderate text fields
  const textFields: Record<string, string> = {};
  if (displayName) textFields.display_name = displayName;
  if (bio) textFields.bio = bio;

  const modResult = moderateFields(textFields);
  if (!modResult.clean) {
    const roleData = await loadRoleData(user.id, user.role);
    return html(
      <Layout title="Edit Profile" user={user}>
        <ProfileEditView user={user} roleData={roleData} error={modResult.reason} />
      </Layout>
    );
  }

  // Update account fields
  await supabase
    .from("accounts")
    .update({ display_name: displayName, bio, avatar_url: avatarUrl })
    .eq("id", user.id);

  // Update role-specific fields
  if (user.role === "student") {
    const learningGoals = (body.learning_goals as string)?.trim() || null;
    const careerInterests = normalizeArray(body.career_interests);
    const careerInterestsCustom = (body.career_interests_custom as string)?.trim();
    if (careerInterestsCustom) {
      careerInterests.push(careerInterestsCustom);
    }
    const personalityTags = normalizeArray(body.personality_tags);
    const schoolName = (body.school_name as string)?.trim() || null;
    const gradeOrYear = (body.grade_or_year as string)?.trim() || null;

    if (learningGoals) {
      const goalsMod = moderateFields({ learning_goals: learningGoals });
      if (!goalsMod.clean) {
        const roleData = await loadRoleData(user.id, user.role);
        return html(
          <Layout title="Edit Profile" user={user}>
            <ProfileEditView user={user} roleData={roleData} error={goalsMod.reason} />
          </Layout>
        );
      }
    }

    const studentPayload: Record<string, any> = {
      user_id: user.id,
      school_name: schoolName,
      grade_or_year: gradeOrYear,
      career_interests: careerInterests.length > 0 ? careerInterests : [],
      learning_goals: learningGoals,
      personality_tags: personalityTags.length > 0 ? personalityTags : [],
    };
    const { data: existingStudent } = await supabase.from("students").select("id").eq("user_id", user.id).single();
    if (existingStudent) {
      await supabase.from("students").update(studentPayload).eq("user_id", user.id);
    } else {
      await supabase.from("students").insert(studentPayload);
    }
  } else if (user.role === "mentor") {
    const jobTitle = (body.job_title as string)?.trim() || null;
    const company = (body.company as string)?.trim() || null;
    const careerField = (body.career_field as string)?.trim() || null;
    const topics = normalizeArray(body.topics);
    const linkedinUrl = (body.linkedin_url as string)?.trim() || null;
    const careerFieldCustom = (body.career_field_custom as string)?.trim();
    const finalCareerField = careerFieldCustom || careerField;
    const personalityTagsMentor = normalizeArray(body.personality_tags);
    const yearsExp = parseInt(body.years_experience as string) || undefined;

    const updateData: Record<string, any> = {};
    if (jobTitle) updateData.job_title = jobTitle;
    if (company !== undefined) updateData.company = company;
    if (finalCareerField) updateData.career_field = finalCareerField;
    if (topics.length > 0) updateData.topics = topics;
    if (linkedinUrl !== undefined) updateData.linkedin_url = linkedinUrl;
    if (personalityTagsMentor.length > 0) updateData.personality_tags = personalityTagsMentor;
    if (yearsExp) updateData.years_experience = yearsExp;

    const { data: existingMentor } = await supabase.from("mentors").select("id").eq("user_id", user.id).single();
    if (existingMentor) {
      if (Object.keys(updateData).length > 0) {
        await supabase.from("mentors").update(updateData).eq("user_id", user.id);
      }
    } else {
      await supabase.from("mentors").insert({
        user_id: user.id,
        job_title: updateData.job_title || "",
        company: updateData.company || "",
        career_field: updateData.career_field || "",
        topics: updateData.topics || [],
        availability: {},
        verification_status: "approved",
        verified_at: new Date().toISOString(),
        ...updateData,
      });
    }
  }

  return c.redirect("/profile");
});

// GET /profile/:userId — view another user's profile
profile.get("/profile/:userId", authMiddleware, async (c) => {
  const currentUser = c.get("user");
  const userId = c.req.param("userId");

  const reviewed = c.req.query("reviewed");

  const { data: profileUser } = await supabase
    .from("accounts").select("*").eq("id", userId).single();

  if (!profileUser) {
    return html(
      <Layout title="Not Found" user={currentUser}>
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-300 mb-4">User not found</h1>
          <a href="/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</a>
        </div>
      </Layout>, 404
    );
  }

  const roleData = await loadRoleData(profileUser.id, profileUser.role);

  // Fetch reviews if this is a mentor profile
  let reviews: any[] = [];
  let canReview = false;
  let existingReview: any = null;
  let mentorBadgesP: MentorBadge[] = [];
  let mentorLevelP: Level | null = null;

  if (profileUser.role === "mentor" && roleData?.id) {
    reviews = await loadMentorReviews(roleData.id);

    // Check if current student has active match with this mentor
    if (currentUser.role === "student") {
      const { data: student } = await supabase.from("students").select("id").eq("user_id", currentUser.id).single();
      if (student) {
        const { data: activeMatch } = await supabase
          .from("matches").select("id")
          .eq("student_id", student.id).eq("mentor_id", roleData.id)
          .in("status", ["active", "accepted", "completed"]).single();
        canReview = !!activeMatch;
        existingReview = reviews.find((r: any) => r._studentUserId === currentUser.id) || null;
      }
    }

    const completedCount = reviews.length;
    const ratedSessions = reviews.filter((r: any) => r.rating);
    const uniqueStudents = new Set(reviews.map((r: any) => r._studentUserId)).size;
    mentorBadgesP = getMentorBadges({
      completedSessions: completedCount,
      ratedSessions,
      verificationStatus: roleData.verification_status,
      yearsExperience: roleData.years_experience || 0,
      createdAt: profileUser.created_at,
      uniqueStudents,
    });
    const avg = ratedSessions.length > 0
      ? ratedSessions.reduce((s: number, r: any) => s + r.rating, 0) / ratedSessions.length : 0;
    mentorLevelP = getMentorLevel(completedCount, avg);
  }

  return html(
    <Layout title={`${profileUser.first_name}'s Profile`} user={currentUser}>
      <ProfileView
        user={profileUser} roleData={roleData} isOwn={false}
        currentUser={currentUser} reviews={reviews}
        canReview={canReview} existingReview={existingReview}
        mentorBadges={mentorBadgesP} mentorLevel={mentorLevelP}
        flash={reviewed === "1" ? "Your review has been saved!" : undefined}
      />
    </Layout>
  );
});

// POST /reviews — save a review for a mentor (stored in their most recent completed session)
profile.post("/reviews", authMiddleware, async (c) => {
  const user = c.get("user");
  if (user.role !== "student") return c.redirect("/dashboard");

  const body = await c.req.parseBody();
  const mentorUserId = body.mentor_user_id as string;
  const rating = parseInt(body.rating as string);
  const comment = (body.comment as string)?.trim() || "";
  const meetAgain = body.meet_again === "yes" ? true : body.meet_again === "no" ? false : null;

  if (!mentorUserId || !rating || rating < 1 || rating > 5) {
    return c.redirect(`/profile/${mentorUserId}`);
  }

  // Moderate comment
  if (comment) {
    const { moderateText } = await import("../lib/moderation");
    const mod = moderateText(comment);
    if (!mod.clean) return c.redirect(`/profile/${mentorUserId}?reviewed=error`);
  }

  // Get student and mentor DB IDs
  const { data: student } = await supabase.from("students").select("id").eq("user_id", user.id).single();
  const { data: mentorAccount } = await supabase.from("accounts").select("id").eq("id", mentorUserId).single();
  if (!student || !mentorAccount) return c.redirect(`/profile/${mentorUserId}`);

  const { data: mentor } = await supabase.from("mentors").select("id").eq("user_id", mentorUserId).single();
  if (!mentor) return c.redirect(`/profile/${mentorUserId}`);

  // Find the most recent completed session between student and this mentor
  const { data: match } = await supabase
    .from("matches").select("id")
    .eq("student_id", student.id).eq("mentor_id", mentor.id)
    .in("status", ["active", "accepted", "completed"]).single();

  if (!match) return c.redirect(`/profile/${mentorUserId}`);

  const { data: session } = await supabase
    .from("sessions").select("id")
    .eq("match_id", match.id).eq("status", "completed")
    .order("scheduled_at", { ascending: false }).limit(1).single();

  if (session) {
    // Update the session's rating and feedback
    await supabase.from("sessions").update({
      rating,
      feedback: encodeFeedback(meetAgain, comment),
    }).eq("id", session.id);
  }

  return c.redirect(`/profile/${mentorUserId}?reviewed=1`);
});

async function loadMentorReviews(mentorDbId: string): Promise<any[]> {
  // Get all match IDs for this mentor
  const { data: matches } = await supabase
    .from("matches").select("id, student_id").eq("mentor_id", mentorDbId);
  if (!matches || matches.length === 0) return [];

  const matchIds = matches.map((m: any) => m.id);
  const studentMap: Record<string, string> = {};
  for (const m of matches) studentMap[m.id] = m.student_id;

  // Get completed sessions with ratings
  const { data: sessions } = await supabase
    .from("sessions").select("id, match_id, rating, feedback, scheduled_at")
    .in("match_id", matchIds).eq("status", "completed")
    .not("rating", "is", null)
    .order("scheduled_at", { ascending: false });

  if (!sessions || sessions.length === 0) return [];

  // Get student user IDs
  const studentDbIds = [...new Set(matches.map((m: any) => m.student_id))];
  const { data: students } = await supabase
    .from("students").select("id, user_id").in("id", studentDbIds);

  const studentUserMap: Record<string, string> = {};
  for (const s of students || []) studentUserMap[s.id] = s.user_id;

  // Get account info for students
  const studentUserIds = Object.values(studentUserMap);
  const { data: accounts } = await supabase
    .from("accounts").select("id, first_name, last_name, avatar_url").in("id", studentUserIds);

  const accountMap: Record<string, any> = {};
  for (const a of accounts || []) accountMap[a.id] = a;

  return sessions.map((s: any) => {
    const studentDbId = studentMap[s.match_id];
    const studentUserId = studentUserMap[studentDbId] || "";
    const account = accountMap[studentUserId] || {};
    return {
      ...s,
      _studentUserId: studentUserId,
      _studentName: `${account.first_name || "?"} ${account.last_name || ""}`,
      _studentAvatar: account.avatar_url || null,
      _meetAgain: parseMeetAgain(s.feedback),
      _reviewText: parseReviewText(s.feedback),
    };
  });
}

async function loadStudentStats(studentUserId: string) {
  const { data: student } = await supabase.from("students").select("id, learning_goals").eq("user_id", studentUserId).single();
  if (!student) return { completedSessions: 0, learningGoals: null, uniqueMentors: 0, receivedPositiveFeedback: false };

  const { data: matches } = await supabase.from("matches").select("id, mentor_id").eq("student_id", student.id);
  if (!matches || matches.length === 0) {
    return { completedSessions: 0, learningGoals: student.learning_goals, uniqueMentors: 0, receivedPositiveFeedback: false };
  }

  const matchIds = matches.map((m: any) => m.id);
  const uniqueMentors = new Set(matches.map((m: any) => m.mentor_id)).size;

  const { data: sessions } = await supabase
    .from("sessions").select("id, notes")
    .in("match_id", matchIds).eq("status", "completed");

  const completedSessions = sessions?.length || 0;
  // Positive feedback = mentor left a note (they engaged)
  const receivedPositiveFeedback = (sessions || []).some((s: any) => s.notes && s.notes.length > 10);

  return { completedSessions, learningGoals: student.learning_goals, uniqueMentors, receivedPositiveFeedback };
}

function normalizeArray(value: any): string[] {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string" && value) return [value];
  return [];
}

async function loadRoleData(userId: string, role: string) {
  if (role === "student") {
    const { data } = await supabase.from("students").select("*").eq("user_id", userId).single();
    return data;
  } else if (role === "mentor") {
    const { data } = await supabase.from("mentors").select("*").eq("user_id", userId).single();
    return data;
  }
  return null;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`w-4 h-4 ${s <= rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

function PencilLink({ href }: { href: string }) {
  return (
    <a href={href} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-indigo-500 p-1 rounded" title="Edit">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </a>
  );
}

function BadgeChip({ badge }: { badge: MentorBadge | StudentBadge }) {
  return (
    <span className={`inline-flex items-center gap-1 ${badge.color} ${badge.textColor} text-xs font-semibold px-2.5 py-1 rounded-full`}
      title={badge.description}>
      {badge.icon} {badge.label}
    </span>
  );
}

function LevelBar({ level, completedSessions }: { level: Level; completedSessions: number }) {
  const prev = level.number === 1 ? 0 : level.number === 2 ? 1 : level.number === 3 ? (level.label.includes("Mentor") ? 3 : 1) : (level.label.includes("Mentor") ? 10 : 5);
  const next = level.nextThreshold;
  const progress = next ? Math.min(100, Math.round(((completedSessions - prev) / (next - prev)) * 100)) : 100;

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-bold ${level.color}`}>Level {level.number} — {level.label}</span>
        {next && <span className="text-xs text-gray-400">{completedSessions}/{next} sessions to Level {level.number + 1}</span>}
        {!next && <span className="text-xs text-amber-500 font-semibold">Max Level Reached 🏆</span>}
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
          style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function ProfileView({ user, roleData, isOwn, currentUser, reviews = [], canReview = false,
  existingReview = null, mentorBadges = [], mentorLevel = null,
  studentBadges = [], studentLevel = null, flash }: {
  user: any; roleData: any; isOwn: boolean; currentUser?: any;
  reviews?: any[]; canReview?: boolean; existingReview?: any;
  mentorBadges?: MentorBadge[]; mentorLevel?: Level | null;
  studentBadges?: StudentBadge[]; studentLevel?: Level | null;
  flash?: string;
}) {
  const ratedReviews = reviews.filter((r: any) => r.rating);
  const avgRating = ratedReviews.length > 0
    ? Math.round((ratedReviews.reduce((s: number, r: any) => s + r.rating, 0) / ratedReviews.length) * 10) / 10
    : null;
  const meetAgainCount = reviews.filter((r: any) => r._meetAgain === true).length;
  const meetAgainPct = reviews.length > 0 ? Math.round((meetAgainCount / reviews.length) * 100) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {flash && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-xl text-sm font-medium">
          ✓ {flash}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header banner */}
        <div className={`relative px-8 py-10 overflow-hidden ${user.role === "mentor" ? "bg-gradient-to-r from-emerald-600 to-teal-600" : "bg-gradient-to-r from-indigo-600 to-blue-600"}`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10 flex items-center gap-6">
            {/* Avatar — click to edit if own profile */}
            {isOwn ? (
              <a href="/profile/edit" className="relative group flex-shrink-0" title="Change photo">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.first_name} className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-lg" />
                ) : (
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-white/30">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </a>
            ) : user.avatar_url ? (
              <img src={user.avatar_url} alt={user.first_name} className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-lg flex-shrink-0" />
            ) : (
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0 border-4 border-white/30">
                {user.first_name?.[0]}{user.last_name?.[0]}
              </div>
            )}
            <div className="text-white flex-1 min-w-0">
              <h1 className="text-2xl font-bold">{user.first_name} {user.last_name}</h1>
              {user.role === "mentor" && roleData && (
                <p className="text-white/80 text-sm mt-0.5">{roleData.job_title}{roleData.company ? ` · ${roleData.company}` : ""}</p>
              )}
              {user.role === "student" && roleData?.grade_or_year && (
                <p className="text-white/80 text-sm mt-0.5">{roleData.grade_or_year}{roleData.school_name ? ` · ${roleData.school_name}` : ""}</p>
              )}
              <div className="flex items-center flex-wrap gap-2 mt-2">
                <Badge status={user.role} />
                {roleData?.verification_status && <Badge status={roleData.verification_status} />}
                {avgRating && (
                  <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                    ★ {avgRating} ({ratedReviews.length} review{ratedReviews.length !== 1 ? "s" : ""})
                  </span>
                )}
                {meetAgainPct !== null && meetAgainPct >= 70 && (
                  <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                    🔄 {meetAgainPct}% would meet again
                  </span>
                )}
                {mentorLevel && (
                  <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                    Lv.{mentorLevel.number} {mentorLevel.label}
                  </span>
                )}
              </div>
              {(mentorBadges.length > 0 || studentBadges.length > 0) && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {mentorBadges.map((b) => <BadgeChip key={b.id} badge={b} />)}
                  {studentBadges.map((b) => <BadgeChip key={b.id} badge={b} />)}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 items-end">
              {isOwn && (
                <a href="/profile/edit" className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-white/30">
                  Edit Profile
                </a>
              )}
              {!isOwn && currentUser && (
                <a href={`/reports/new?reported_id=${user.id}&from=/profile/${user.id}`} className="text-white/60 hover:text-white/90 text-xs transition-colors">
                  Report
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {user.bio ? (
            <div className="mb-6 bg-gray-50 rounded-xl p-5 group relative">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">About</h3>
                {isOwn && <PencilLink href="/profile/edit#bio" />}
              </div>
              <p className="text-gray-700 leading-relaxed">{user.bio}</p>
            </div>
          ) : isOwn && (
            <a href="/profile/edit#bio" className="mb-6 flex items-center gap-2 bg-gray-50 border border-dashed border-gray-200 rounded-xl p-5 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              <span className="text-sm">Add a bio</span>
            </a>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Student specific */}
            {user.role === "student" && roleData && (
              <>
                <div className="bg-indigo-50 rounded-xl p-4 group relative">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">Education</h3>
                    {isOwn && <PencilLink href="/profile/edit#school" />}
                  </div>
                  <p className="text-gray-800 font-medium text-sm">{roleData.school_name || "—"}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{roleData.grade_or_year || "—"}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 group relative">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Career Interests</h3>
                    {isOwn && <PencilLink href="/profile/edit#interests" />}
                  </div>
                  {roleData.career_interests?.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {roleData.career_interests.map((i: string) => (
                        <span key={i} className="bg-white text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-200">{i}</span>
                      ))}
                    </div>
                  ) : (
                    isOwn ? <a href="/profile/edit#interests" className="text-xs text-blue-400 hover:underline">+ Add interests</a> : <p className="text-xs text-gray-400">—</p>
                  )}
                </div>
                <div className="md:col-span-2 bg-violet-50 rounded-xl p-4 group relative">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-wide">Learning Goals</h3>
                    {isOwn && <PencilLink href="/profile/edit#goals" />}
                  </div>
                  {roleData.learning_goals ? (
                    <p className="text-gray-700 text-sm">{roleData.learning_goals}</p>
                  ) : (
                    isOwn ? <a href="/profile/edit#goals" className="text-xs text-violet-400 hover:underline">+ Add your learning goals</a> : <p className="text-xs text-gray-400">—</p>
                  )}
                </div>
              </>
            )}

            {/* Mentor specific */}
            {user.role === "mentor" && roleData && (
              <>
                <div className="bg-emerald-50 rounded-xl p-4 group relative">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">Experience</h3>
                    {isOwn && <PencilLink href="/profile/edit#experience" />}
                  </div>
                  <p className="text-gray-800 font-medium text-sm">{roleData.job_title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{roleData.career_field} · {roleData.years_experience} yrs</p>
                </div>
                <div className="bg-teal-50 rounded-xl p-4 group relative">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-teal-500 uppercase tracking-wide">Mentoring Topics</h3>
                    {isOwn && <PencilLink href="/profile/edit#topics" />}
                  </div>
                  {roleData.topics?.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {roleData.topics.map((t: string) => (
                        <span key={t} className="bg-white text-teal-700 text-xs px-2 py-0.5 rounded-full border border-teal-200">{t}</span>
                      ))}
                    </div>
                  ) : (
                    isOwn ? <a href="/profile/edit#topics" className="text-xs text-teal-500 hover:underline">+ Add topics</a> : <p className="text-xs text-gray-400">—</p>
                  )}
                </div>
                {(roleData.linkedin_url || isOwn) && (
                  <div className="bg-blue-50 rounded-xl p-4 group relative">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wide">LinkedIn</h3>
                      {isOwn && <PencilLink href="/profile/edit#linkedin" />}
                    </div>
                    {roleData.linkedin_url ? (
                      <a href={roleData.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                        View LinkedIn Profile →
                      </a>
                    ) : (
                      <a href="/profile/edit#linkedin" className="text-xs text-blue-400 hover:underline">+ Add LinkedIn URL</a>
                    )}
                  </div>
                )}
              </>
            )}

            <div className="md:col-span-2 bg-purple-50 rounded-xl p-4 group relative">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
                  {user.role === "mentor" ? "Mentoring Style" : "Personality"}
                </h3>
                {isOwn && <PencilLink href="/profile/edit#personality" />}
              </div>
              {roleData?.personality_tags?.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {roleData.personality_tags.map((tag: string) => (
                    <span key={tag} className="bg-white text-purple-700 text-xs px-2 py-0.5 rounded-full border border-purple-200">{tag}</span>
                  ))}
                </div>
              ) : (
                isOwn ? <a href="/profile/edit#personality" className="text-xs text-purple-400 hover:underline">+ Add personality tags</a> : <p className="text-xs text-gray-400">—</p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100 text-xs text-gray-400">
            Member since {new Date(user.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Badges & Level section — mentor only, when there are badges */}
      {user.role === "mentor" && (mentorBadges.length > 0 || mentorLevel) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Achievements</h2>
          {mentorBadges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {mentorBadges.map((b) => (
                <div key={b.id} className={`flex items-center gap-2 ${b.color} ${b.textColor} rounded-xl px-3 py-2`}>
                  <span className="text-lg">{b.icon}</span>
                  <div>
                    <div className="text-xs font-bold">{b.label}</div>
                    <div className="text-xs opacity-75">{b.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {mentorLevel && (
            <LevelBar level={mentorLevel} completedSessions={reviews.length} />
          )}
        </div>
      )}

      {/* Student badges & level — own profile only */}
      {user.role === "student" && (studentBadges.length > 0 || studentLevel) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Your Progress</h2>
          {studentBadges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {studentBadges.map((b) => (
                <div key={b.id} className={`flex items-center gap-2 ${b.color} ${b.textColor} rounded-xl px-3 py-2`}>
                  <span className="text-lg">{b.icon}</span>
                  <div>
                    <div className="text-xs font-bold">{b.label}</div>
                    <div className="text-xs opacity-75">{b.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {studentLevel && (
            <LevelBar level={studentLevel} completedSessions={reviews.length} />
          )}
        </div>
      )}

      {/* Reviews section — only for mentors */}
      {user.role === "mentor" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Student Reviews</h2>
              {avgRating ? (
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <StarDisplay rating={Math.round(avgRating)} />
                    <span className="text-sm text-gray-600 font-semibold">{avgRating}</span>
                    <span className="text-sm text-gray-400">/ 5 · {ratedReviews.length} review{ratedReviews.length !== 1 ? "s" : ""}</span>
                  </div>
                  {meetAgainPct !== null && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${meetAgainPct >= 70 ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                      🔄 {meetAgainPct}% would meet again
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400 mt-1">No reviews yet</p>
              )}
            </div>
          </div>

          {/* Review form — only for matched students */}
          {canReview && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">
                {existingReview ? "Update Your Review" : "Leave a Review"}
              </h3>
              <form method="POST" action="/reviews" className="space-y-3">
                <input type="hidden" name="mentor_user_id" value={user.id} />
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Rating <span className="text-red-400">*</span></label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((n) => (
                      <label key={n} className="cursor-pointer">
                        <input type="radio" name="rating" value={n.toString()} defaultChecked={existingReview?.rating === n} required className="sr-only" />
                        <svg className="w-7 h-7 text-gray-300 hover:text-amber-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Would you meet with this mentor again?</label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="meet_again" value="yes" defaultChecked={existingReview?._meetAgain === true} className="text-emerald-500" />
                      <span className="text-sm text-gray-700">👍 Yes</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="meet_again" value="no" defaultChecked={existingReview?._meetAgain === false} />
                      <span className="text-sm text-gray-700">👎 No</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Comment <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea name="comment" rows={3} maxLength={500}
                    defaultValue={existingReview?._reviewText || ""}
                    placeholder="Share your experience — what did you learn? Was the mentor helpful?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
                </div>
                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
                  {existingReview ? "Update Review" : "Submit Review"}
                </button>
              </form>
            </div>
          )}

          {/* Reviews list */}
          {ratedReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <svg className="w-10 h-10 mx-auto mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
              <p className="text-sm">No reviews yet — be the first!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ratedReviews.map((rv: any, i: number) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {rv._studentAvatar ? (
                      <img src={rv._studentAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold">
                        {rv._studentName?.[0]}
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-800">{rv._studentName?.split(" ")[0]} {rv._studentName?.split(" ")[1]?.[0]}.</span>
                      <StarDisplay rating={rv.rating} />
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      {rv._meetAgain === true && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">👍 Would meet again</span>
                      )}
                      {rv._meetAgain === false && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">👎 Wouldn't meet again</span>
                      )}
                      <span className="text-xs text-gray-400">{new Date(rv.scheduled_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {rv._reviewText && <p className="text-sm text-gray-600 leading-relaxed">{rv._reviewText}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const CAREER_FIELDS_FULL = [
  "Technology & Software", "Medicine & Healthcare", "Law & Legal Services",
  "Business & Management", "Sports & Athletics", "Arts & Design",
  "Education & Teaching", "Engineering", "Finance & Accounting",
  "Science & Research", "Media & Journalism", "Government & Public Policy",
  "Non-Profit & Social Impact", "Real Estate", "Consulting", "Architecture",
  "Aviation & Aerospace", "Criminal Justice & Law Enforcement", "Cybersecurity",
  "Data Science & AI", "Dentistry", "Environmental Science", "Fashion & Apparel",
  "Film & Television", "Food & Culinary Arts", "Gaming & Esports",
  "Hospitality & Tourism", "Human Resources", "Marketing & Advertising",
  "Military & Defense", "Music & Performing Arts", "Nursing & Allied Health",
  "Pharmacy", "Photography & Visual Arts", "Psychology & Mental Health",
  "Public Health", "Publishing & Writing", "Robotics & Automation",
  "Social Work", "Supply Chain & Logistics", "Veterinary Medicine",
];

const PERSONALITY_TAGS_STUDENT = [
  "Visual learner", "Hands-on", "Analytical", "Creative",
  "Introvert", "Extrovert", "Detail-oriented", "Big-picture thinker",
  "Curious", "Goal-oriented",
];

const PERSONALITY_TAGS_MENTOR = [
  "Patient", "Direct", "Encouraging", "Storyteller",
  "Technical", "Strategic", "Empathetic", "Structured",
  "Casual", "Detail-oriented",
];

const MENTOR_TOPICS_FULL = [
  "Breaking into the field", "Interview prep", "Resume review",
  "Career growth", "College guidance", "Entrepreneurship",
  "Work-life balance", "Networking", "Leadership",
  "Industry trends", "Technical skills", "Soft skills",
];

function ProfileEditView({ user, roleData, error }: { user: any; roleData: any; error?: string }) {
  const inputClass = "w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm";

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Everything here is visible to {user.role === "student" ? "mentors you connect with" : "students who find you"}.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
          {error}
        </div>
      )}

      <form method="POST" action="/profile/edit" className="space-y-8">

        {/* Profile Picture + Basic */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Profile Picture & Display</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
            <div className="flex items-center gap-4">
              {/* Single avatar preview element — no duplicate ids */}
              <div id="avatar-wrap" className="flex-shrink-0 relative group cursor-pointer">
                {user.avatar_url ? (
                  <img id="avatar-preview" src={user.avatar_url} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
                ) : (
                  <div id="avatar-preview" className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <input type="hidden" id="avatar-url-hidden" name="avatar_url" defaultValue={user.avatar_url || ""} />
                <label className="flex items-center gap-2 cursor-pointer bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors w-fit">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Photo
                  <input type="file" id="avatar-file-input" accept="image/*" className="hidden" />
                </label>
                <p id="avatar-file-name" className="text-xs text-gray-400">Click photo or button — JPG/PNG, auto-resized.</p>
                {user.avatar_url && (
                  <button type="button" id="avatar-remove-btn" className="text-xs text-red-400 hover:text-red-600 underline block">Remove photo</button>
                )}
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-1">Display Name <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="text" id="display_name" name="display_name" defaultValue={user.display_name || ""} maxLength={100} placeholder="How you want your name shown" className={inputClass} />
          </div>
        </div>

        {/* About Me */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">About Me</h2>
          <p className="text-xs text-gray-400 -mt-2">This shows at the top of your profile. Make it personal — mentors and students read this first.</p>
          <textarea
            id="bio"
            name="bio"
            rows={5}
            maxLength={2000}
            defaultValue={user.bio || ""}
            className={`${inputClass} resize-y`}
            placeholder={user.role === "student"
              ? "Tell mentors about yourself — your interests, what drives you, what you're working toward, any hobbies or projects you're proud of..."
              : "Tell students about yourself — your career story, what you care about, why you became a mentor, and what kind of students you connect best with..."}
          />
          <p className="text-xs text-gray-400">There's no wrong way to write this. Just be honest.</p>
        </div>

        {/* Student-specific */}
        {user.role === "student" && (
          <>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">School & Year</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                  <input type="text" name="school_name" defaultValue={roleData?.school_name || ""} placeholder="e.g. Lincoln High School" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade or Year</label>
                  <select name="grade_or_year" defaultValue={roleData?.grade_or_year || ""} className={inputClass}>
                    <option value="">Select your grade</option>
                    <optgroup label="High School">
                      <option value="9th Grade">9th Grade</option>
                      <option value="10th Grade">10th Grade</option>
                      <option value="11th Grade">11th Grade</option>
                      <option value="12th Grade">12th Grade</option>
                    </optgroup>
                    <optgroup label="College">
                      <option value="College Freshman">College Freshman</option>
                      <option value="College Sophomore">College Sophomore</option>
                      <option value="College Junior">College Junior</option>
                      <option value="College Senior">College Senior</option>
                      <option value="Graduate Student">Graduate Student</option>
                    </optgroup>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Career Interests</h2>
              <p className="text-xs text-gray-400 -mt-2">Select everything you're curious about — even if you're unsure. This helps us find relevant mentors.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CAREER_FIELDS_FULL.map((field) => (
                  <label key={field} className="flex items-center gap-2 p-2 border border-gray-100 rounded-lg cursor-pointer hover:bg-indigo-50 has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-300 text-xs">
                    <input type="checkbox" name="career_interests" value={field} defaultChecked={roleData?.career_interests?.includes(field)} className="rounded text-indigo-600 flex-shrink-0" />
                    <span className="text-gray-700 leading-snug">{field}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Don't see yours? Add it <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" name="career_interests_custom" placeholder="e.g. Marine Biology, Nanotechnology..." className={inputClass} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Learning Goals</h2>
              <p className="text-xs text-gray-400 -mt-2">What do you actually want from a mentor? The more honest you are here, the better your matches will be.</p>
              <textarea
                name="learning_goals"
                rows={5}
                maxLength={2000}
                defaultValue={roleData?.learning_goals || ""}
                className={`${inputClass} resize-y`}
                placeholder="e.g. I want to learn what it's actually like to work in medicine day-to-day. I'm trying to figure out if pre-med is right for me, and I want to hear from someone who's been through it — the hard parts included..."
              />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Your Style</h2>
              <p className="text-xs text-gray-400 -mt-2">How would you describe yourself as a learner? Pick all that fit.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PERSONALITY_TAGS_STUDENT.map((tag) => (
                  <label key={tag} className="flex items-center gap-2 p-2 border border-gray-100 rounded-lg cursor-pointer hover:bg-indigo-50 has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-300 text-xs">
                    <input type="checkbox" name="personality_tags" value={tag} defaultChecked={roleData?.personality_tags?.includes(tag)} className="rounded text-indigo-600 flex-shrink-0" />
                    <span className="text-gray-700">{tag}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Mentor-specific */}
        {user.role === "mentor" && (
          <>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Professional Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input type="text" name="job_title" defaultValue={roleData?.job_title || ""} placeholder="e.g. Senior Software Engineer" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input type="text" name="company" defaultValue={roleData?.company || ""} placeholder="e.g. Google" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <input type="number" name="years_experience" defaultValue={roleData?.years_experience || ""} min={1} max={50} placeholder="Years in your field" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="url" name="linkedin_url" defaultValue={roleData?.linkedin_url || ""} placeholder="https://linkedin.com/in/yourname" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Career Field</label>
                <select name="career_field" defaultValue={roleData?.career_field || ""} className={inputClass}>
                  <option value="">Select your field</option>
                  {CAREER_FIELDS_FULL.map((field) => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Not listed? Write it in <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" name="career_field_custom" placeholder="e.g. Biomedical Engineering, Forensic Accounting..." className={inputClass} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Mentoring Topics</h2>
              <p className="text-xs text-gray-400 -mt-2">What can you actually help students with?</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MENTOR_TOPICS_FULL.map((topic) => (
                  <label key={topic} className="flex items-center gap-2 p-2 border border-gray-100 rounded-lg cursor-pointer hover:bg-emerald-50 has-[:checked]:bg-emerald-50 has-[:checked]:border-emerald-300 text-xs">
                    <input type="checkbox" name="topics" value={topic} defaultChecked={roleData?.topics?.includes(topic)} className="rounded text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{topic}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Mentoring Style</h2>
              <p className="text-xs text-gray-400 -mt-2">Students use this to find mentors who match how they learn best.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PERSONALITY_TAGS_MENTOR.map((tag) => (
                  <label key={tag} className="flex items-center gap-2 p-2 border border-gray-100 rounded-lg cursor-pointer hover:bg-emerald-50 has-[:checked]:bg-emerald-50 has-[:checked]:border-emerald-300 text-xs">
                    <input type="checkbox" name="personality_tags" value={tag} defaultChecked={roleData?.personality_tags?.includes(tag)} className="rounded text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{tag}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex gap-3 pb-6">
          <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
            Save Changes
          </button>
          <a href="/profile" className="text-gray-500 hover:text-gray-800 px-6 py-3 font-medium rounded-xl hover:bg-gray-100 transition-colors">
            Cancel
          </a>
        </div>
      </form>
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          var fileInput = document.getElementById('avatar-file-input');
          var hiddenInput = document.getElementById('avatar-url-hidden');
          var fileNameLabel = document.getElementById('avatar-file-name');
          var wrap = document.getElementById('avatar-wrap');
          var removeBtn = document.getElementById('avatar-remove-btn');
          if (!fileInput) return;

          // Clicking the avatar preview also triggers file picker
          if (wrap) wrap.addEventListener('click', function(e) {
            if (e.target === fileInput || e.target.closest('label')) return;
            fileInput.click();
          });

          fileInput.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (!file) return;
            fileNameLabel.textContent = file.name + ' — processing...';
            var reader = new FileReader();
            reader.onload = function(ev) {
              var img = new Image();
              img.onload = function() {
                var MAX = 300;
                var w = img.width, h = img.height;
                var scale = Math.min(MAX / w, MAX / h, 1);
                w = Math.round(w * scale); h = Math.round(h * scale);
                var canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                var dataUrl = canvas.toDataURL('image/jpeg', 0.88);
                hiddenInput.value = dataUrl;
                // Replace whatever is in avatar-wrap with an img
                var existing = document.getElementById('avatar-preview');
                if (existing && existing.tagName === 'IMG') {
                  existing.src = dataUrl;
                } else {
                  var newImg = document.createElement('img');
                  newImg.id = 'avatar-preview';
                  newImg.src = dataUrl;
                  newImg.className = 'w-20 h-20 rounded-full object-cover border-2 border-indigo-300';
                  if (existing) existing.replaceWith(newImg);
                }
                fileNameLabel.textContent = '\u2713 ' + file.name + ' — ready to save';
              };
              img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
          });

          // Remove photo button
          if (removeBtn) removeBtn.addEventListener('click', function() {
            hiddenInput.value = '';
            var existing = document.getElementById('avatar-preview');
            if (existing) {
              var initials = document.createElement('div');
              initials.id = 'avatar-preview';
              initials.className = 'w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl';
              initials.textContent = hiddenInput.dataset.initials || '?';
              existing.replaceWith(initials);
            }
            fileNameLabel.textContent = 'Photo removed — save to confirm.';
            removeBtn.style.display = 'none';
          });
        })();
      ` }} />
    </div>
  );
}

export { profile };
