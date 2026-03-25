import { Hono } from "hono";
import React from "react";
import { renderToString } from "react-dom/server";
import { Layout } from "../views/Layout";
import { Badge } from "../views/components/Badge";
import { authMiddleware } from "../middleware/auth";
import { supabase } from "../db";
import { moderateFields } from "../lib/moderation";

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
  if (user.role === "mentor" && roleData?.id) {
    const { data: rv } = await supabase
      .from("reviews").select("*, accounts!reviewer_user_id(first_name, last_name, avatar_url)")
      .eq("mentor_id", roleData.id).order("updated_at", { ascending: false });
    reviews = rv || [];
  }

  return html(
    <Layout title="My Profile" user={user}>
      <ProfileView user={user} roleData={roleData} isOwn={true} reviews={reviews} />
    </Layout>
  );
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
  if (profileUser.role === "mentor" && roleData?.id) {
    const { data: rv } = await supabase
      .from("reviews")
      .select("*, accounts!reviewer_user_id(first_name, last_name, avatar_url)")
      .eq("mentor_id", roleData.id)
      .order("updated_at", { ascending: false });
    reviews = rv || [];

    // Check if current student has active match with this mentor
    if (currentUser.role === "student") {
      const { data: student } = await supabase.from("students").select("id").eq("user_id", currentUser.id).single();
      if (student) {
        const { data: activeMatch } = await supabase
          .from("matches").select("id")
          .eq("student_id", student.id).eq("mentor_id", roleData.id)
          .in("status", ["active", "completed"]).single();
        canReview = !!activeMatch;
        existingReview = reviews.find((r: any) => r.reviewer_user_id === currentUser.id) || null;
      }
    }
  }

  return html(
    <Layout title={`${profileUser.first_name}'s Profile`} user={currentUser}>
      <ProfileView
        user={profileUser} roleData={roleData} isOwn={false}
        currentUser={currentUser} reviews={reviews}
        canReview={canReview} existingReview={existingReview}
        flash={reviewed === "1" ? "Your review has been saved!" : undefined}
      />
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

    await supabase
      .from("students")
      .update({
        school_name: schoolName,
        grade_or_year: gradeOrYear,
        career_interests: careerInterests.length > 0 ? careerInterests : undefined,
        learning_goals: learningGoals,
      })
      .eq("user_id", user.id);
  } else if (user.role === "mentor") {
    const jobTitle = (body.job_title as string)?.trim() || null;
    const company = (body.company as string)?.trim() || null;
    const careerField = (body.career_field as string)?.trim() || null;
    const topics = normalizeArray(body.topics);
    const linkedinUrl = (body.linkedin_url as string)?.trim() || null;

    const updateData: Record<string, any> = {};
    if (jobTitle) updateData.job_title = jobTitle;
    if (company !== undefined) updateData.company = company;
    if (careerField) updateData.career_field = careerField;
    if (topics.length > 0) updateData.topics = topics;
    if (linkedinUrl !== undefined) updateData.linkedin_url = linkedinUrl;

    if (Object.keys(updateData).length > 0) {
      await supabase.from("mentors").update(updateData).eq("user_id", user.id);
    }
  }

  return c.redirect("/profile");
});

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

function ProfileView({ user, roleData, isOwn, currentUser, reviews = [], canReview = false, existingReview = null, flash }: {
  user: any; roleData: any; isOwn: boolean; currentUser?: any;
  reviews?: any[]; canReview?: boolean; existingReview?: any; flash?: string;
}) {
  const avgRating = reviews.length > 0
    ? Math.round((reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length) * 10) / 10
    : null;

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
            {/* Avatar */}
            {user.avatar_url ? (
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
              <div className="flex items-center gap-2 mt-2">
                <Badge status={user.role} />
                {roleData?.verification_status && <Badge status={roleData.verification_status} />}
                {avgRating && (
                  <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                    ★ {avgRating} ({reviews.length})
                  </span>
                )}
              </div>
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
          {user.bio && (
            <div className="mb-6 bg-gray-50 rounded-xl p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">About</h3>
              <p className="text-gray-700 leading-relaxed">{user.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Student specific */}
            {user.role === "student" && roleData && (
              <>
                <div className="bg-indigo-50 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-2">Education</h3>
                  <p className="text-gray-800 font-medium text-sm">{roleData.school_name || "—"}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{roleData.grade_or_year || "—"}</p>
                </div>
                {roleData.career_interests?.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-2">Career Interests</h3>
                    <div className="flex flex-wrap gap-1">
                      {roleData.career_interests.map((i: string) => (
                        <span key={i} className="bg-white text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-200">{i}</span>
                      ))}
                    </div>
                  </div>
                )}
                {roleData.learning_goals && (
                  <div className="md:col-span-2 bg-violet-50 rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-wide mb-2">Learning Goals</h3>
                    <p className="text-gray-700 text-sm">{roleData.learning_goals}</p>
                  </div>
                )}
              </>
            )}

            {/* Mentor specific */}
            {user.role === "mentor" && roleData && (
              <>
                <div className="bg-emerald-50 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-emerald-500 uppercase tracking-wide mb-2">Experience</h3>
                  <p className="text-gray-800 font-medium text-sm">{roleData.job_title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{roleData.career_field} · {roleData.years_experience} yrs</p>
                </div>
                {roleData.topics?.length > 0 && (
                  <div className="bg-teal-50 rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-teal-500 uppercase tracking-wide mb-2">Mentoring Topics</h3>
                    <div className="flex flex-wrap gap-1">
                      {roleData.topics.map((t: string) => (
                        <span key={t} className="bg-white text-teal-700 text-xs px-2 py-0.5 rounded-full border border-teal-200">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {roleData.linkedin_url && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-2">LinkedIn</h3>
                    <a href={roleData.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                      View LinkedIn Profile →
                    </a>
                  </div>
                )}
              </>
            )}

            {roleData?.personality_tags?.length > 0 && (
              <div className="md:col-span-2 bg-purple-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-2">
                  {user.role === "mentor" ? "Mentoring Style" : "Personality"}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {roleData.personality_tags.map((tag: string) => (
                    <span key={tag} className="bg-white text-purple-700 text-xs px-2 py-0.5 rounded-full border border-purple-200">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100 text-xs text-gray-400">
            Member since {new Date(user.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Reviews section — only for mentors */}
      {user.role === "mentor" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Student Reviews</h2>
              {avgRating ? (
                <div className="flex items-center gap-2 mt-1">
                  <StarDisplay rating={Math.round(avgRating)} />
                  <span className="text-sm text-gray-500 font-medium">{avgRating} out of 5 · {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
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
                  <label className="block text-xs font-medium text-gray-600 mb-1">Rating</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((n) => (
                      <label key={n} className="cursor-pointer">
                        <input type="radio" name="rating" value={n.toString()} defaultChecked={existingReview?.rating === n} required className="sr-only" />
                        <svg className="w-7 h-7 text-gray-300 hover:text-amber-400 transition-colors peer-checked:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Comment <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea name="comment" rows={3} maxLength={500} defaultValue={existingReview?.comment || ""} placeholder="Share your experience..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
                </div>
                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
                  {existingReview ? "Update Review" : "Submit Review"}
                </button>
              </form>
            </div>
          )}

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <svg className="w-10 h-10 mx-auto mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
              <p className="text-sm">No reviews yet — be the first!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rv: any, i: number) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {rv.accounts?.avatar_url ? (
                      <img src={rv.accounts.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold">
                        {rv.accounts?.first_name?.[0]}{rv.accounts?.last_name?.[0]}
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-800">{rv.accounts?.first_name} {rv.accounts?.last_name?.[0]}.</span>
                      <StarDisplay rating={rv.rating} />
                    </div>
                    <span className="ml-auto text-xs text-gray-400">{new Date(rv.updated_at).toLocaleDateString()}</span>
                  </div>
                  {rv.comment && <p className="text-sm text-gray-600 leading-relaxed">{rv.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const CAREER_FIELDS = [
  "Technology", "Medicine", "Law", "Business", "Sports", "Arts",
  "Education", "Engineering", "Finance", "Science", "Media", "Government",
  "Non-Profit", "Real Estate", "Consulting",
];

const MENTOR_TOPICS = [
  "Breaking into the field", "Interview prep", "Resume review",
  "Career growth", "College guidance", "Entrepreneurship",
  "Work-life balance", "Networking", "Leadership",
  "Industry trends", "Technical skills", "Soft skills",
];

function ProfileEditView({ user, roleData, error }: { user: any; roleData: any; error?: string }) {
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form method="POST" action="/profile/edit" className="space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Basic Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm border border-gray-200">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>
                  )}
                  <input type="url" name="avatar_url" defaultValue={user.avatar_url || ""} placeholder="https://example.com/your-photo.jpg" className={`${inputClass} flex-1`} />
                </div>
                <p className="text-xs text-gray-400 mt-1">Paste a link to a photo (e.g. from Google Photos, Imgur, etc.)</p>
              </div>
              <div>
                <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input type="text" id="display_name" name="display_name" defaultValue={user.display_name || ""} maxLength={100} className={inputClass} />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea id="bio" name="bio" rows={4} defaultValue={user.bio || ""} maxLength={2000} className={`${inputClass} resize-y`} placeholder="Tell us about yourself..." />
              </div>
            </div>
          </div>

          {/* Student-specific fields */}
          {user.role === "student" && roleData && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Student Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                    <input type="text" name="school_name" defaultValue={roleData.school_name || ""} placeholder="e.g. Lincoln High School" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade / Year</label>
                    <input type="text" name="grade_or_year" defaultValue={roleData.grade_or_year || ""} placeholder="e.g. 11th grade" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Career Interests</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CAREER_FIELDS.map((field) => (
                      <label key={field} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" name="career_interests" value={field} defaultChecked={roleData.career_interests?.includes(field)} className="rounded text-blue-600" />
                        {field}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Learning Goals</label>
                  <textarea name="learning_goals" rows={3} defaultValue={roleData.learning_goals || ""} maxLength={2000} className={`${inputClass} resize-y`} placeholder="What do you hope to learn from a mentor?" />
                </div>
              </div>
            </div>
          )}

          {/* Mentor-specific fields */}
          {user.role === "mentor" && roleData && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Professional Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input type="text" name="job_title" defaultValue={roleData.job_title || ""} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input type="text" name="company" defaultValue={roleData.company || ""} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Career Field</label>
                  <select name="career_field" defaultValue={roleData.career_field || ""} className={inputClass}>
                    <option value="">Select your field</option>
                    {CAREER_FIELDS.map((field) => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mentoring Topics</label>
                  <div className="grid grid-cols-2 gap-2">
                    {MENTOR_TOPICS.map((topic) => (
                      <label key={topic} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" name="topics" value={topic} defaultChecked={roleData.topics?.includes(topic)} className="rounded text-blue-600" />
                        {topic}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                  <input type="url" name="linkedin_url" defaultValue={roleData.linkedin_url || ""} placeholder="https://linkedin.com/in/yourname" className={inputClass} />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
            <a href="/profile" className="text-gray-600 hover:text-gray-900 px-6 py-2.5 font-medium">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export { profile };
