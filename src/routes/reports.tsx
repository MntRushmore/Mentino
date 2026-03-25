import { Hono } from "hono";
import React from "react";
import { renderToString } from "react-dom/server";
import { Layout } from "../views/Layout";
import { authMiddleware } from "../middleware/auth";
import { supabase } from "../db";
import { moderateFields } from "../lib/moderation";

const reports = new Hono();

function html(element: React.ReactElement, status = 200) {
  return new Response("<!DOCTYPE html>" + renderToString(element), {
    status,
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}

const REPORT_REASONS = [
  "Inappropriate behavior",
  "Harassment or bullying",
  "Spam or solicitation",
  "Fake profile or impersonation",
  "Inappropriate content",
  "Safety concern",
  "Other",
];

// GET /reports/new?reported_id=xxx
reports.get("/reports/new", authMiddleware, async (c) => {
  const user = c.get("user");
  const reportedId = c.req.query("reported_id");
  const from = c.req.query("from") || "/dashboard";

  if (!reportedId) return c.redirect("/dashboard");

  const { data: reported } = await supabase
    .from("accounts").select("first_name, last_name, role").eq("id", reportedId).single();

  if (!reported) return c.redirect("/dashboard");

  return html(
    <Layout title="Report User" user={user}>
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-rose-600 px-8 py-6 text-white">
            <h1 className="text-xl font-bold mb-1">Report a User</h1>
            <p className="text-red-100 text-sm">Help keep Mentino safe for everyone.</p>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm flex-shrink-0">
                {reported.first_name?.[0]}{reported.last_name?.[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{reported.first_name} {reported.last_name}</p>
                <p className="text-gray-500 text-xs capitalize">{reported.role}</p>
              </div>
            </div>

            <form method="POST" action="/reports" className="space-y-5">
              <input type="hidden" name="reported_user_id" value={reportedId} />
              <input type="hidden" name="from" value={from} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason <span className="text-red-500">*</span>
                </label>
                <select name="reason" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
                  <option value="">Select a reason</option>
                  {REPORT_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details <span className="text-gray-400 font-normal">(optional — the more context, the better)</span>
                </label>
                <textarea
                  name="description"
                  rows={4}
                  maxLength={1000}
                  placeholder="Describe what happened..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none text-sm"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                All reports are reviewed by our admin team within 24–48 hours. False reports may result in account action.
              </div>

              <div className="flex gap-3">
                <button type="submit" className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm">
                  Submit Report
                </button>
                <a href={from} className="text-gray-600 hover:text-gray-900 px-6 py-2.5 font-medium text-sm">
                  Cancel
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
});

// POST /reports
reports.post("/reports", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.parseBody();

  const reportedUserId = body.reported_user_id as string;
  const reason = body.reason as string;
  const description = (body.description as string)?.trim() || null;
  const from = (body.from as string) || "/dashboard";

  if (!reportedUserId || !reason) return c.redirect("/dashboard");

  if (description) {
    const mod = moderateFields({ description });
    if (!mod.clean) {
      return c.redirect(`/reports/new?reported_id=${reportedUserId}&error=moderation`);
    }
  }

  await supabase.from("reports").insert({
    reporter_id: user.id,
    reported_id: reportedUserId,
    reason,
    description,
    status: "open",
  });

  // Ban escalation: count resolved/open reports against this user
  const { count: reportCount } = await supabase
    .from("reports")
    .select("*", { count: "exact", head: true })
    .eq("reported_id", reportedUserId)
    .neq("status", "dismissed");

  const total = reportCount || 0;
  const now = new Date();

  if (total >= 4) {
    // 4th+ report: 2-month ban
    const until = new Date(now);
    until.setMonth(until.getMonth() + 2);
    await supabase.from("accounts").update({
      is_banned: true,
      ban_reason: `Banned until ${until.toISOString()} (escalation: ${total} reports)`,
    }).eq("id", reportedUserId);
  } else if (total === 3) {
    // 3rd report: 1-week ban
    const until = new Date(now);
    until.setDate(until.getDate() + 7);
    await supabase.from("accounts").update({
      is_banned: true,
      ban_reason: `Temporarily suspended until ${until.toISOString()} (3 reports)`,
    }).eq("id", reportedUserId);
  } else if (total === 2) {
    // 2nd report: 1-day ban
    const until = new Date(now);
    until.setDate(until.getDate() + 1);
    await supabase.from("accounts").update({
      is_banned: true,
      ban_reason: `Temporarily suspended until ${until.toISOString()} (2 reports)`,
    }).eq("id", reportedUserId);
  } else if (total === 1) {
    // 1st report: 1-day ban
    const until = new Date(now);
    until.setDate(until.getDate() + 1);
    await supabase.from("accounts").update({
      is_banned: true,
      ban_reason: `Temporarily suspended until ${until.toISOString()} (1st report)`,
    }).eq("id", reportedUserId);
  }

  return html(
    <Layout title="Report Submitted" user={user}>
      <div className="max-w-xl mx-auto mt-12 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Report Submitted</h1>
          <p className="text-gray-500 text-sm mb-6">Thank you for helping keep Mentino safe. Our team will review your report within 24–48 hours.</p>
          <a href={from} className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm">
            Go Back
          </a>
        </div>
      </div>
    </Layout>
  );
});

// POST /reviews — Student leaves a review on a mentor
reports.post("/reviews", authMiddleware, async (c) => {
  const user = c.get("user");
  if (user.role !== "student") return c.redirect("/dashboard");

  const body = await c.req.parseBody();
  const mentorUserId = body.mentor_user_id as string;
  const rating = parseInt(body.rating as string);
  const comment = (body.comment as string)?.trim() || null;

  if (!mentorUserId || isNaN(rating) || rating < 1 || rating > 5) {
    return c.redirect(`/profile/${mentorUserId}`);
  }

  if (comment) {
    const mod = moderateFields({ comment });
    if (!mod.clean) return c.redirect(`/profile/${mentorUserId}?error=moderation`);
  }

  // Verify the student has an active match with this mentor
  const { data: student } = await supabase.from("students").select("id").eq("user_id", user.id).single();
  if (!student) return c.redirect(`/profile/${mentorUserId}`);

  const { data: mentorData } = await supabase.from("mentors").select("id").eq("user_id", mentorUserId).single();
  if (!mentorData) return c.redirect(`/profile/${mentorUserId}`);

  const { data: activeMatch } = await supabase
    .from("matches").select("id")
    .eq("student_id", student.id).eq("mentor_id", mentorData.id)
    .in("status", ["active", "completed"]).single();

  if (!activeMatch) return c.redirect(`/profile/${mentorUserId}?error=no_match`);

  // Upsert (one review per student per mentor)
  await supabase.from("reviews").upsert({
    student_id: student.id,
    mentor_id: mentorData.id,
    mentor_user_id: mentorUserId,
    reviewer_user_id: user.id,
    rating,
    comment,
    updated_at: new Date().toISOString(),
  }, { onConflict: "student_id,mentor_id" });

  return c.redirect(`/profile/${mentorUserId}?reviewed=1`);
});

export { reports };
