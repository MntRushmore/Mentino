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

  return html(
    <Layout title="My Profile" user={user}>
      <ProfileView user={user} roleData={roleData} isOwn={true} />
    </Layout>
  );
});

// GET /profile/:userId — view another user's profile
profile.get("/profile/:userId", authMiddleware, async (c) => {
  const currentUser = c.get("user");
  const userId = c.req.param("userId");

  const { data: profileUser } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profileUser) {
    return html(
      <Layout title="Not Found" user={currentUser}>
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-300 mb-4">User not found</h1>
          <a href="/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</a>
        </div>
      </Layout>,
      404
    );
  }

  const roleData = await loadRoleData(profileUser.id, profileUser.role);

  return html(
    <Layout title={`${profileUser.first_name}'s Profile`} user={currentUser}>
      <ProfileView user={profileUser} roleData={roleData} isOwn={false} />
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
  const body = await c.req.parseBody();

  const displayName = (body.display_name as string)?.trim() || null;
  const bio = (body.bio as string)?.trim() || null;

  // Moderate
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

  await supabase
    .from("accounts")
    .update({ display_name: displayName, bio })
    .eq("id", user.id);

  return c.redirect("/profile");
});

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

function ProfileView({ user, roleData, isOwn }: { user: any; roleData: any; isOwn: boolean }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl shadow-md">
              {user.first_name?.[0]}{user.last_name?.[0]}
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{user.first_name} {user.last_name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge status={user.role} />
                {roleData?.verification_status && <Badge status={roleData.verification_status} />}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {isOwn && (
            <div className="flex justify-end mb-4">
              <a href="/profile/edit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Edit Profile
              </a>
            </div>
          )}

          {user.bio && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">About</h3>
              <p className="text-gray-700">{user.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Contact</h3>
              <p className="text-gray-700">{user.email}</p>
            </div>

            {/* Student specific */}
            {user.role === "student" && roleData && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Education</h3>
                  <p className="text-gray-700">{roleData.school_name || "N/A"}</p>
                  <p className="text-gray-500 text-sm">{roleData.grade_or_year || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Career Interests</h3>
                  <div className="flex flex-wrap gap-1">
                    {roleData.career_interests?.map((interest: string) => (
                      <span key={interest} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
                {roleData.learning_goals && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Learning Goals</h3>
                    <p className="text-gray-700">{roleData.learning_goals}</p>
                  </div>
                )}
              </>
            )}

            {/* Mentor specific */}
            {user.role === "mentor" && roleData && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Professional</h3>
                  <p className="text-gray-700 font-medium">{roleData.job_title}</p>
                  <p className="text-gray-500 text-sm">{roleData.company || "N/A"} &middot; {roleData.years_experience} years</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Field</h3>
                  <p className="text-gray-700">{roleData.career_field}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Mentoring Topics</h3>
                  <div className="flex flex-wrap gap-1">
                    {roleData.topics?.map((topic: string) => (
                      <span key={topic} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                {roleData.linkedin_url && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">LinkedIn</h3>
                    <a href={roleData.linkedin_url} className="text-blue-600 hover:underline text-sm" target="_blank" rel="noopener noreferrer">
                      View Profile
                    </a>
                  </div>
                )}
              </>
            )}

            {/* Personality Tags */}
            {roleData?.personality_tags?.length > 0 && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Personality</h3>
                <div className="flex flex-wrap gap-1">
                  {roleData.personality_tags.map((tag: string) => (
                    <span key={tag} className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-400">
            Member since {new Date(user.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileEditView({ user, roleData, error }: { user: any; roleData: any; error?: string }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form method="POST" action="/profile/edit" className="space-y-5">
          <div>
            <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              id="display_name"
              name="display_name"
              defaultValue={user.display_name || ""}
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={5}
              defaultValue={user.bio || ""}
              maxLength={2000}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
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
