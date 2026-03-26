import { Hono } from "hono";
import React from "react";
import { renderToString } from "react-dom/server";
import { Layout } from "../views/Layout";
import { Badge } from "../views/components/Badge";
import { authMiddleware } from "../middleware/auth";
import { adminMiddleware } from "../middleware/admin";
import { supabase } from "../db";

const admin = new Hono();

function html(element: React.ReactElement, status = 200) {
  return new Response("<!DOCTYPE html>" + renderToString(element), {
    status,
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}

// All admin routes require auth + admin
admin.use("/admin/*", authMiddleware, adminMiddleware);

// GET /admin — Dashboard
admin.get("/admin", async (c) => {
  const user = c.get("user");

  const [
    { count: totalUsers },
    { count: totalStudents },
    { count: totalMentors },
    { count: pendingMentors },
    { count: activeMatches },
    { count: openReports },
  ] = await Promise.all([
    supabase.from("accounts").select("*", { count: "exact", head: true }),
    supabase.from("students").select("*", { count: "exact", head: true }),
    supabase.from("mentors").select("*", { count: "exact", head: true }),
    supabase.from("mentors").select("*", { count: "exact", head: true }).eq("verification_status", "pending"),
    supabase.from("matches").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("reports").select("*", { count: "exact", head: true }).eq("status", "open"),
  ]);

  return html(
    <Layout title="Admin Dashboard" user={user}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard label="Total Users" value={totalUsers || 0} />
          <StatCard label="Students" value={totalStudents || 0} />
          <StatCard label="Mentors" value={totalMentors || 0} />
          <StatCard label="Pending Verification" value={pendingMentors || 0} color="yellow" />
          <StatCard label="Active Matches" value={activeMatches || 0} color="green" />
          <StatCard label="Open Reports" value={openReports || 0} color="red" />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/admin/verify" className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-1">Verify Mentors</h3>
            <p className="text-sm text-gray-500">Review and approve pending mentor applications</p>
            {(pendingMentors || 0) > 0 && (
              <span className="mt-2 inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {pendingMentors} pending
              </span>
            )}
          </a>
          <a href="/admin/users" className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-1">Manage Users</h3>
            <p className="text-sm text-gray-500">View, search, and manage user accounts</p>
          </a>
          <a href="/admin/reports" className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-1">Reports</h3>
            <p className="text-sm text-gray-500">Review code of conduct violation reports</p>
            {(openReports || 0) > 0 && (
              <span className="mt-2 inline-block bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {openReports} open
              </span>
            )}
          </a>
        </div>
      </div>
    </Layout>
  );
});

// GET /admin/verify — Pending mentors
admin.get("/admin/verify", async (c) => {
  const user = c.get("user");

  const { data: pendingMentors } = await supabase
    .from("mentors")
    .select("*, accounts!user_id!inner(first_name, last_name, email, bio, created_at)")
    .eq("verification_status", "pending")
    .order("created_at", { ascending: true });

  return html(
    <Layout title="Verify Mentors" user={user}>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mentor Verification Queue</h1>
          <a href="/admin" className="text-blue-600 hover:underline text-sm">Back to Admin</a>
        </div>

        {!pendingMentors || pendingMentors.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500 text-lg">No pending mentor applications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingMentors.map((mentor: any) => (
              <div key={mentor.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {mentor.accounts.first_name} {mentor.accounts.last_name}
                      </h3>
                      <Badge status="pending" />
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{mentor.accounts.email}</p>
                    <p className="text-gray-700 font-medium">{mentor.job_title} at {mentor.company || "N/A"}</p>
                    <p className="text-gray-500 text-sm">{mentor.career_field} &middot; {mentor.years_experience} years experience</p>
                    {mentor.linkedin_url && (
                      <p className="text-sm mt-1">
                        <a href={mentor.linkedin_url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          LinkedIn Profile
                        </a>
                      </p>
                    )}
                    {mentor.accounts.bio && (
                      <p className="text-gray-600 text-sm mt-2 italic">"{mentor.accounts.bio}"</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {mentor.topics?.map((topic: string) => (
                        <span key={topic} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <form method="POST" action={`/admin/verify/${mentor.id}`}>
                      <input type="hidden" name="action" value="approve" />
                      <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                        Approve
                      </button>
                    </form>
                    <form method="POST" action={`/admin/verify/${mentor.id}`}>
                      <input type="hidden" name="action" value="reject" />
                      <input type="text" name="rejection_reason" placeholder="Reason (optional)" className="w-full px-2 py-1 border border-gray-300 rounded text-xs mb-1" />
                      <button type="submit" className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
});

// POST /admin/verify/:mentorId
admin.post("/admin/verify/:mentorId", async (c) => {
  const user = c.get("user");
  const mentorId = c.req.param("mentorId");
  const body = await c.req.parseBody();
  const action = body.action as string;
  const rejectionReason = (body.rejection_reason as string) || null;

  if (action === "approve") {
    await supabase
      .from("mentors")
      .update({
        verification_status: "approved",
        verified_at: new Date().toISOString(),
        verified_by: user.id,
      })
      .eq("id", mentorId);

    await supabase.from("audit_log").insert({
      admin_id: user.id,
      action: "verify_mentor",
      target_type: "mentor",
      target_id: mentorId,
      details: { status: "approved" },
    });
  } else if (action === "reject") {
    await supabase
      .from("mentors")
      .update({
        verification_status: "rejected",
        verified_at: new Date().toISOString(),
        verified_by: user.id,
        rejection_reason: rejectionReason,
      })
      .eq("id", mentorId);

    await supabase.from("audit_log").insert({
      admin_id: user.id,
      action: "verify_mentor",
      target_type: "mentor",
      target_id: mentorId,
      details: { status: "rejected", reason: rejectionReason },
    });
  }

  return c.redirect("/admin/verify");
});

// GET /admin/users
admin.get("/admin/users", async (c) => {
  const user = c.get("user");

  const { data: users } = await supabase
    .from("accounts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return html(
    <Layout title="Manage Users" user={user}>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <a href="/admin" className="text-blue-600 hover:underline text-sm">Back to Admin</a>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users?.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {u.first_name} {u.last_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                  <td className="px-4 py-3"><Badge status={u.role} /></td>
                  <td className="px-4 py-3">
                    {u.is_banned ? (
                      <Badge status="rejected" />
                    ) : u.registration_complete ? (
                      <Badge status="active" />
                    ) : (
                      <Badge status="pending" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    {!u.is_banned && u.role !== "admin" && (
                      <form method="POST" action={`/admin/users/${u.id}/ban`} className="inline">
                        <button type="submit" className="text-red-600 hover:text-red-800 text-xs font-medium">
                          Ban
                        </button>
                      </form>
                    )}
                    {u.is_banned && (
                      <form method="POST" action={`/admin/users/${u.id}/unban`} className="inline">
                        <button type="submit" className="text-green-600 hover:text-green-800 text-xs font-medium">
                          Unban
                        </button>
                      </form>
                    )}
                    {!u.registration_complete && u.role !== "admin" && (
                      <form method="POST" action={`/admin/users/${u.id}/complete-registration`} className="inline">
                        <button type="submit" className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">
                          Fix Reg
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
});

// POST /admin/users/:id/ban
admin.post("/admin/users/:id/ban", async (c) => {
  const adminUser = c.get("user");
  const userId = c.req.param("id");

  await supabase.from("accounts").update({ is_banned: true }).eq("id", userId);

  await supabase.from("audit_log").insert({
    admin_id: adminUser.id,
    action: "ban_user",
    target_type: "user",
    target_id: userId,
  });

  return c.redirect("/admin/users");
});

// POST /admin/users/:id/complete-registration
admin.post("/admin/users/:id/complete-registration", async (c) => {
  const adminUser = c.get("user");
  const userId = c.req.param("id");

  // Force registration complete
  await supabase
    .from("accounts")
    .update({ registration_complete: true, registration_step: 5 })
    .eq("id", userId);

  // If they're a mentor, set verification_status to pending so they appear in matching
  const { data: mentor } = await supabase.from("mentors").select("id, verification_status").eq("user_id", userId).single();
  if (mentor && mentor.verification_status !== "approved") {
    await supabase.from("mentors").update({ verification_status: "approved", verified_at: new Date().toISOString() }).eq("id", mentor.id);
  }

  await supabase.from("audit_log").insert({
    admin_id: adminUser.id,
    action: "fix_registration",
    target_type: "user",
    target_id: userId,
  });

  return c.redirect("/admin/users");
});

// POST /admin/users/:id/unban
admin.post("/admin/users/:id/unban", async (c) => {
  const adminUser = c.get("user");
  const userId = c.req.param("id");

  await supabase.from("accounts").update({ is_banned: false, ban_reason: null }).eq("id", userId);

  await supabase.from("audit_log").insert({
    admin_id: adminUser.id,
    action: "unban_user",
    target_type: "user",
    target_id: userId,
  });

  return c.redirect("/admin/users");
});

// GET /admin/reports
admin.get("/admin/reports", async (c) => {
  const user = c.get("user");

  const { data: reports } = await supabase
    .from("reports")
    .select("*, reporter:accounts!reporter_id(first_name, last_name), reported:accounts!reported_user_id(first_name, last_name)")
    .order("created_at", { ascending: false })
    .limit(50);

  return html(
    <Layout title="Reports" user={user}>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <a href="/admin" className="text-blue-600 hover:underline text-sm">Back to Admin</a>
        </div>

        {!reports || reports.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500 text-lg">No reports</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report: any) => (
              <div key={report.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge status={report.status} />
                      <Badge status={report.reason} />
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{report.reporter?.first_name} {report.reporter?.last_name}</span>
                      {" reported "}
                      <span className="font-medium">{report.reported?.first_name} {report.reported?.last_name}</span>
                    </p>
                    <p className="text-gray-700 mt-2">{report.description}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(report.created_at).toLocaleString()}</p>
                  </div>
                  {report.status === "open" && (
                    <div className="flex gap-2 ml-4">
                      <form method="POST" action={`/admin/reports/${report.id}`}>
                        <input type="hidden" name="action" value="resolve" />
                        <button type="submit" className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-green-700">
                          Resolve
                        </button>
                      </form>
                      <form method="POST" action={`/admin/reports/${report.id}`}>
                        <input type="hidden" name="action" value="dismiss" />
                        <button type="submit" className="bg-gray-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-700">
                          Dismiss
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
});

// POST /admin/reports/:id
admin.post("/admin/reports/:id", async (c) => {
  const adminUser = c.get("user");
  const reportId = c.req.param("id");
  const body = await c.req.parseBody();
  const action = body.action as string;

  const newStatus = action === "resolve" ? "resolved" : "dismissed";

  await supabase
    .from("reports")
    .update({
      status: newStatus,
      resolved_by: adminUser.id,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", reportId);

  await supabase.from("audit_log").insert({
    admin_id: adminUser.id,
    action: `${action}_report`,
    target_type: "report",
    target_id: reportId,
  });

  return c.redirect("/admin/reports");
});

function StatCard({ label, value, color = "blue" }: { label: string; value: number; color?: string }) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
  };
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
      <div className={`text-2xl font-bold ${colorMap[color] || "text-blue-600"}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

export { admin };
