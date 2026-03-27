import { Hono } from "hono";
import { getStudentBadges, getStudentLevel } from "../lib/badges";
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
    .select("*, mentors!inner(*, accounts!user_id!inner(first_name, last_name, email, bio))")
    .eq("student_id", student?.id)
    .in("status", ["pending", "accepted", "active"])
    .order("created_at", { ascending: false });

  // Get upcoming sessions
  const { data: sessions } = await supabase
    .from("sessions")
    .select("*, matches!inner(mentors!inner(accounts!user_id!inner(first_name, last_name)))")
    .eq("matches.student_id", student?.id)
    .in("status", ["scheduled"])
    .order("scheduled_at", { ascending: true })
    .limit(5);

  // Get unread message count — only in this student's active matches
  const matchIds = matches?.filter((m: any) => m.status === "active").map((m: any) => m.id) || [];
  const { count: unreadCount } = matchIds.length > 0
    ? await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .in("match_id", matchIds)
        .neq("sender_id", user.id)
        .eq("is_read", false)
    : { count: 0 };

  const activeCount = matches?.filter((m: any) => m.status === "active").length || 0;
  const pendingCount = matches?.filter((m: any) => m.status === "pending").length || 0;

  // Badges & level
  const allMatchIds = matches?.map((m: any) => m.id) || [];
  const { data: completedSessions } = await supabase
    .from("sessions").select("id, notes", { count: "exact" })
    .in("match_id", allMatchIds).eq("status", "completed");
  const completedCount = completedSessions?.length || 0;
  const uniqueMentors = new Set(matches?.filter((m: any) => m.status !== "pending").map((m: any) => m.mentor_id) || []).size;
  const receivedPositiveFeedback = (completedSessions || []).some((s: any) => s.notes && s.notes.length > 10);
  const studentBadges = getStudentBadges({
    completedSessions: completedCount,
    learningGoals: student?.learning_goals || null,
    uniqueMentors,
    receivedPositiveFeedback,
  });
  const studentLevel = getStudentLevel(completedCount);

  return html(
    <Layout title="Dashboard" user={user} navBadges={{ unreadMessages: unreadCount || 0 }}>
      <div className="space-y-6">
        {/* Hero welcome banner */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 rounded-2xl px-8 py-7 text-white overflow-hidden anim-fade-up">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-indigo-200 text-sm font-medium mb-1">Good to see you 👋</p>
              <h1 className="text-2xl sm:text-3xl font-bold">{user.first_name} {user.last_name}</h1>
              <p className="text-indigo-200 text-sm mt-1">Student · Mentino</p>
            </div>
            <div className="flex gap-3">
              <a href="/matching" className="bg-white text-indigo-700 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition-colors">
                Find a Mentor
              </a>
              <a href="/profile/edit" className="bg-white/20 border border-white/30 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-white/30 transition-colors">
                Edit Profile
              </a>
            </div>
          </div>
        </div>

        {!user.registration_complete && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
            <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-amber-900 text-sm">Finish setting up your profile</p>
              <p className="text-amber-700 text-xs mt-0.5">Complete a few more steps so we can find the right mentor for you.</p>
            </div>
            <a href={`/register/step/${user.registration_step}`} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors whitespace-nowrap">
              Continue →
            </a>
          </div>
        )}

        {/* Stats row — each card is a clickable link */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/matching", label: "Active Mentors", value: activeCount, color: "text-indigo-600", bg: "bg-indigo-50", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", delay: "anim-d1" },
            { href: "/matching", label: "Pending", value: pendingCount, color: "text-amber-600", bg: "bg-amber-50", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", delay: "anim-d2" },
            { href: "/messages", label: "Unread Messages", value: unreadCount || 0, color: "text-blue-600", bg: "bg-blue-50", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", delay: "anim-d3" },
            { href: "/sessions", label: "Sessions", value: sessions?.length || 0, color: "text-emerald-600", bg: "bg-emerald-50", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", delay: "anim-d4" },
          ].map((stat) => (
            <a key={stat.label} href={stat.href} className={`bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3 hover:shadow-md hover:border-gray-200 transition-all group anim-fade-up ${stat.delay}`}>
              <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <svg className={`w-5 h-5 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <div>
                <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-400 leading-tight">{stat.label}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Progress & Badges */}
        {(studentBadges.length > 0 || completedCount > 0) && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 anim-fade-up anim-d2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900 text-sm">Your Progress</h2>
              <a href="/profile" className="text-indigo-600 text-xs hover:underline">View profile →</a>
            </div>
            {/* Level bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold ${studentLevel.color}`}>Level {studentLevel.number} — {studentLevel.label}</span>
                {studentLevel.nextThreshold ? (
                  <span className="text-xs text-gray-400">{completedCount}/{studentLevel.nextThreshold} sessions to Level {studentLevel.number + 1}</span>
                ) : (
                  <span className="text-xs text-amber-500 font-semibold">Max Level 🏆</span>
                )}
              </div>
              {(() => {
                const prev = studentLevel.number === 1 ? 0 : studentLevel.number === 2 ? 1 : studentLevel.number === 3 ? 5 : 15;
                const next = studentLevel.nextThreshold;
                const pct = next ? Math.min(100, Math.round(((completedCount - prev) / (next - prev)) * 100)) : 100;
                return (
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                );
              })()}
            </div>
            {/* Badges */}
            {studentBadges.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {studentBadges.map((b) => (
                  <span key={b.id} className={`inline-flex items-center gap-1 ${b.color} ${b.textColor} text-xs font-semibold px-2.5 py-1 rounded-full`} title={b.description}>
                    {b.icon} {b.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Matches — wider */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">Your Mentors</h2>
              <a href="/matching" className="text-indigo-600 hover:underline text-sm font-medium">Browse all →</a>
            </div>
            {!matches || matches.length === 0 ? (
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-8 text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-800 mb-1">No mentors yet</p>
                <p className="text-gray-500 text-sm mb-4">Find someone who can help you get where you're going.</p>
                <a href="/matching" className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
                  Browse Mentors
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {matches.map((match: any) => (
                  <MatchCard key={match.id} match={match} otherUser={match.mentors.accounts} role="student" />
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions — narrower */}
          <div className="lg:col-span-2">
            <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { href: "/matching", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", label: "Find a Mentor", sub: "Browse and connect", color: "text-indigo-500", bg: "bg-indigo-50" },
                { href: "/messages", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", label: "Messages", sub: (unreadCount || 0) > 0 ? `${unreadCount} unread` : "Chat with mentors", color: "text-blue-500", bg: "bg-blue-50" },
                { href: "/profile/edit", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", label: "Edit Profile", sub: "Update your info", color: "text-emerald-500", bg: "bg-emerald-50" },
                { href: "/sessions", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: "Sessions", sub: "Upcoming meetings", color: "text-purple-500", bg: "bg-purple-50" },
              ].map((action) => (
                <a key={action.href} href={action.href} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3.5 hover:shadow-md hover:border-gray-200 transition-all group">
                  <div className={`w-9 h-9 ${action.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <svg className={`w-5 h-5 ${action.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{action.label}</p>
                    <p className="text-xs text-gray-400">{action.sub}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
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
    .select("*, students!inner(*, accounts!inner(id, first_name, last_name, email, bio))")
    .eq("mentor_id", mentor?.id)
    .in("status", ["pending", "accepted", "active"])
    .order("created_at", { ascending: false });

  const pendingRequests = matches?.filter((m: any) => m.status === "pending") || [];
  const activeMatches = matches?.filter((m: any) => m.status === "active") || [];

  return html(
    <Layout title="Dashboard" user={user} navBadges={{ pendingRequests: pendingRequests.length }}>
      <div className="space-y-6">

        {/* Hero welcome banner */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl px-8 py-7 text-white overflow-hidden anim-fade-up">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">Mentor Dashboard 🎓</p>
              <h1 className="text-2xl sm:text-3xl font-bold">{user.first_name} {user.last_name}</h1>
              {mentor?.job_title && <p className="text-emerald-100 text-sm mt-1">{mentor.job_title}{mentor.company ? ` · ${mentor.company}` : ""}</p>}
            </div>
            <div className="flex gap-3">
              <a href="/messages" className="bg-white text-emerald-700 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-emerald-50 transition-colors">
                Messages
              </a>
              <a href="/profile/edit" className="bg-white/20 border border-white/30 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-white/30 transition-colors">
                Edit Profile
              </a>
            </div>
          </div>
        </div>

        {!user.registration_complete && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
            <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-amber-900 text-sm">Finish setting up your profile</p>
              <p className="text-amber-700 text-xs mt-0.5">Complete your profile so students can find and connect with you.</p>
            </div>
            <a href={`/register/step/${user.registration_step}`} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors whitespace-nowrap">
              Continue →
            </a>
          </div>
        )}

        {mentor?.verification_status === "pending" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-800">Profile under review</p>
              <p className="text-sm text-yellow-700">Our team is verifying your profile — usually 24–48 hours. You can still receive and respond to mentee requests in the meantime.</p>
            </div>
          </div>
        )}

        {(mentor?.verification_status === "approved" || mentor?.verification_status === "pending") && (
          <>
            {/* Stats — clickable */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { href: "/messages", label: "Active Mentees", value: activeMatches.length, color: "text-emerald-600", bg: "bg-emerald-50", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", delay: "anim-d1" },
                { href: "/dashboard", label: "Pending Requests", value: pendingRequests.length, color: "text-amber-600", bg: "bg-amber-50", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", delay: "anim-d2" },
                { href: "/messages", label: "Messages", value: activeMatches.length, color: "text-blue-600", bg: "bg-blue-50", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", delay: "anim-d3" },
                { href: "/sessions", label: "Sessions", value: 0, color: "text-purple-600", bg: "bg-purple-50", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", delay: "anim-d4" },
              ].map((stat) => (
                <a key={stat.label} href={stat.href} className={`bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3 hover:shadow-md hover:border-gray-200 transition-all group anim-fade-up ${stat.delay}`}>
                  <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <svg className={`w-5 h-5 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                    </svg>
                  </div>
                  <div>
                    <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-gray-400 leading-tight">{stat.label}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pending Requests */}
              <div className="anim-fade-up anim-d2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Requests</h2>
                {pendingRequests.length === 0 ? (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-8 text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="font-semibold text-gray-800 mb-1">Inbox is clear</p>
                    <p className="text-gray-500 text-sm">New mentee requests will show up here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((match: any) => (
                      <div key={match.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-5">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-11 h-11 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">
                              {match.students.accounts.first_name[0]}{match.students.accounts.last_name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900">
                                  {match.students.accounts.first_name} {match.students.accounts.last_name}
                                </h4>
                                {match.match_score && (
                                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                    {match.match_score}% match
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">
                                {match.students.school_name && `${match.students.school_name} · `}
                                {match.students.grade_or_year || `Age ${match.students.age}`}
                              </p>
                            </div>
                            <a
                              href={`/profile/${match.students.accounts.id}`}
                              className="text-blue-600 hover:underline text-xs font-medium whitespace-nowrap"
                            >
                              View Profile
                            </a>
                          </div>

                          {match.students.career_interests?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {match.students.career_interests.map((interest: string) => (
                                <span key={interest} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
                                  {interest}
                                </span>
                              ))}
                            </div>
                          )}

                          {match.intro_message && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <p className="text-xs font-medium text-gray-500 mb-1">Their message to you:</p>
                              <p className="text-sm text-gray-700 italic">"{match.intro_message}"</p>
                            </div>
                          )}

                          {match.students.learning_goals && (
                            <div className="mb-3">
                              <p className="text-xs font-medium text-gray-500 mb-1">Learning goals:</p>
                              <p className="text-sm text-gray-600 line-clamp-2">{match.students.learning_goals}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex border-t border-gray-100">
                          <form method="POST" action="/matching/respond" className="flex-1">
                            <input type="hidden" name="match_id" value={match.id} />
                            <input type="hidden" name="action" value="accept" />
                            <button type="submit" className="w-full py-2.5 text-sm font-medium text-green-700 hover:bg-green-50 transition-colors">
                              Accept
                            </button>
                          </form>
                          <div className="w-px bg-gray-100" />
                          <form method="POST" action="/matching/respond" className="flex-1">
                            <input type="hidden" name="match_id" value={match.id} />
                            <input type="hidden" name="action" value="reject" />
                            <button type="submit" className="w-full py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                              Decline
                            </button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Mentees */}
              <div className="anim-fade-up anim-d3">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Mentees</h2>
                {activeMatches.length === 0 ? (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-8 text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="font-semibold text-gray-800 mb-1">No active mentees yet</p>
                    <p className="text-gray-500 text-sm">Accept a request to start your first mentorship.</p>
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

      </div>
    </Layout>
  );
}

export { dashboard };
