import { Hono } from "hono";
import React from "react";
import { renderToString } from "react-dom/server";
import { Layout } from "../views/Layout";
import { Badge } from "../views/components/Badge";
import { MatchCard } from "../views/components/Card";
import { authMiddleware } from "../middleware/auth";
import { supabase } from "../db";

const dashboard = new Hono();

function html(element: React.ReactElement, status = 200) {
  return new Response("<!DOCTYPE html>" + renderToString(element), {
    status,
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}

dashboard.get("/dashboard", authMiddleware, async (c) => {
  const user = c.get("user");

  if (user.role === "student") {
    return renderStudentDashboard(c, user);
  } else if (user.role === "mentor") {
    return renderMentorDashboard(c, user);
  } else {
    return c.redirect("/admin");
  }
});

async function renderStudentDashboard(c: any, user: any) {
  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Get matches with mentor info
  const { data: matches } = await supabase
    .from("matches")
    .select("*, mentors!inner(*, accounts!inner(first_name, last_name, email, bio))")
    .eq("student_id", student?.id)
    .in("status", ["pending", "accepted", "active"])
    .order("created_at", { ascending: false });

  // Get upcoming sessions
  const { data: sessions } = await supabase
    .from("sessions")
    .select("*, matches!inner(mentors!inner(accounts!inner(first_name, last_name)))")
    .eq("matches.student_id", student?.id)
    .in("status", ["scheduled"])
    .order("scheduled_at", { ascending: true })
    .limit(5);

  // Get unread message count
  const { count: unreadCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .neq("sender_id", user.id)
    .eq("is_read", false);

  return html(
    <Layout title="Dashboard" user={user}>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.first_name}!
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your mentorships.</p>
        </div>

        {!user.registration_complete && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-blue-900">Complete your profile to get matched!</h2>
                <p className="text-blue-700 text-sm mt-1">
                  Fill out your profile so we can find the perfect mentor for you. It only takes a few minutes.
                </p>
              </div>
              <a
                href={`/register/step/${user.registration_step}`}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Complete Profile
              </a>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {matches?.filter((m: any) => m.status === "active").length || 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">Active Mentors</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">
              {matches?.filter((m: any) => m.status === "pending").length || 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">Pending Requests</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">{unreadCount || 0}</div>
            <div className="text-xs text-gray-500 mt-1">Unread Messages</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{sessions?.length || 0}</div>
            <div className="text-xs text-gray-500 mt-1">Upcoming Sessions</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Matches */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Matches</h2>
              <a href="/matching" className="text-blue-600 hover:underline text-sm">Find Mentors</a>
            </div>
            {!matches || matches.length === 0 ? (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
                <p className="text-gray-500 mb-4">No matches yet</p>
                <a href="/matching" className="text-blue-600 hover:underline font-medium">Browse Mentors</a>
              </div>
            ) : (
              <div className="space-y-3">
                {matches.map((match: any) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    otherUser={match.mentors.accounts}
                    role="student"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a href="/matching" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-gray-900">Find a Mentor</h3>
                <p className="text-sm text-gray-500">Browse our matching system to find the perfect mentor for you</p>
              </a>
              <a href="/messages" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-gray-900">Messages</h3>
                <p className="text-sm text-gray-500">
                  Chat with your mentors
                  {(unreadCount || 0) > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </p>
              </a>
              <a href="/sessions" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-gray-900">Sessions</h3>
                <p className="text-sm text-gray-500">View and schedule mentoring sessions</p>
              </a>
              <a href="/profile" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-gray-900">Your Profile</h3>
                <p className="text-sm text-gray-500">View and edit your profile</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

async function renderMentorDashboard(c: any, user: any) {
  const { data: mentor } = await supabase
    .from("mentors")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Get matches with student info
  const { data: matches } = await supabase
    .from("matches")
    .select("*, students!inner(*, accounts!inner(first_name, last_name, email))")
    .eq("mentor_id", mentor?.id)
    .in("status", ["pending", "accepted", "active"])
    .order("created_at", { ascending: false });

  const pendingRequests = matches?.filter((m: any) => m.status === "pending") || [];
  const activeMatches = matches?.filter((m: any) => m.status === "active") || [];

  return html(
    <Layout title="Dashboard" user={user}>
      <div>
        {!user.registration_complete && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-blue-900">Complete your profile to start mentoring!</h2>
                <p className="text-blue-700 text-sm mt-1">
                  Fill out your professional details so students can find and connect with you.
                </p>
              </div>
              <a
                href={`/register/step/${user.registration_step}`}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Complete Profile
              </a>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.first_name}!
          </h1>
          <p className="text-gray-500 mt-1">
            {mentor?.verification_status === "pending" ? (
              <span className="text-yellow-600">Your profile is pending verification.</span>
            ) : mentor?.verification_status === "rejected" ? (
              <span className="text-red-600">Your profile was not approved. {mentor?.rejection_reason || ""}</span>
            ) : (
              "Manage your mentorships below."
            )}
          </p>
        </div>

        {mentor?.verification_status === "approved" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{activeMatches.length}</div>
                <div className="text-xs text-gray-500 mt-1">Active Mentees</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</div>
                <div className="text-xs text-gray-500 mt-1">Pending Requests</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-green-600">{mentor.max_mentees}</div>
                <div className="text-xs text-gray-500 mt-1">Max Mentees</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">
                  {mentor.max_mentees - (mentor.current_mentees || 0)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Spots Available</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pending Requests */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Requests</h2>
                {pendingRequests.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
                    <p className="text-gray-500">No pending requests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests.map((match: any) => (
                      <div key={match.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                              {match.students.accounts.first_name[0]}{match.students.accounts.last_name[0]}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">
                                {match.students.accounts.first_name} {match.students.accounts.last_name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {match.students.career_interests?.join(", ")}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <form method="POST" action="/matching/respond">
                              <input type="hidden" name="match_id" value={match.id} />
                              <input type="hidden" name="action" value="accept" />
                              <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700">
                                Accept
                              </button>
                            </form>
                            <form method="POST" action="/matching/respond">
                              <input type="hidden" name="match_id" value={match.id} />
                              <input type="hidden" name="action" value="reject" />
                              <button type="submit" className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700">
                                Decline
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Mentees */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Mentees</h2>
                {activeMatches.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
                    <p className="text-gray-500">No active mentees yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeMatches.map((match: any) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        otherUser={match.students.accounts}
                        role="mentor"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {mentor?.verification_status === "pending" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">Profile Under Review</h2>
            <p className="text-yellow-700">
              Our admin team is reviewing your profile. You'll be able to start mentoring once approved.
              This usually takes 24-48 hours.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export { dashboard };
