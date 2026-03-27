const RESEND_KEY =
  (typeof Bun !== "undefined" ? Bun.env.RESEND_API_KEY : undefined) ||
  process.env.RESEND_API_KEY;

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!RESEND_KEY) {
    console.log(`[email] ${opts.subject} → ${opts.to}`);
    return;
  }
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Mentino <noreply@mentino.com>",
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    }),
  }).catch(() => {/* silent */});
}

export function newMessageEmail(opts: {
  recipientName: string;
  senderName: string;
  preview: string;
  matchId: string;
  baseUrl: string;
}) {
  return `
<div style="font-family:Inter,system-ui,sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
  <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:24px 28px;">
    <span style="color:#fff;font-size:20px;font-weight:800;letter-spacing:-0.5px;">Mentino</span>
  </div>
  <div style="padding:28px;">
    <p style="margin:0 0 6px;font-size:15px;color:#111827;">Hey <strong>${opts.recipientName}</strong>,</p>
    <p style="margin:0 0 18px;font-size:15px;color:#374151;"><strong>${opts.senderName}</strong> sent you a message on Mentino:</p>
    <div style="background:#f3f4f6;border-radius:8px;padding:14px 16px;margin-bottom:22px;">
      <p style="margin:0;font-size:14px;color:#6b7280;font-style:italic;">"${opts.preview.slice(0, 200)}${opts.preview.length > 200 ? "…" : ""}"</p>
    </div>
    <a href="${opts.baseUrl}/messages/${opts.matchId}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
      Reply Now →
    </a>
    <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;">You're receiving this because you have an active mentorship on Mentino.</p>
  </div>
</div>`;
}

export function newSessionEmail(opts: {
  recipientName: string;
  otherName: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingUrl?: string | null;
  baseUrl: string;
}) {
  const dt = new Date(opts.scheduledAt);
  const dateStr = dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const timeStr = dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" });
  return `
<div style="font-family:Inter,system-ui,sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
  <div style="background:linear-gradient(135deg,#059669,#0891b2);padding:24px 28px;">
    <span style="color:#fff;font-size:20px;font-weight:800;letter-spacing:-0.5px;">Mentino</span>
  </div>
  <div style="padding:28px;">
    <p style="margin:0 0 6px;font-size:15px;color:#111827;">Hey <strong>${opts.recipientName}</strong>,</p>
    <p style="margin:0 0 18px;font-size:15px;color:#374151;">A session with <strong>${opts.otherName}</strong> has been scheduled.</p>
    <div style="background:#ecfdf5;border:1px solid #d1fae5;border-radius:8px;padding:16px;margin-bottom:22px;">
      <p style="margin:0 0 4px;font-size:13px;color:#065f46;font-weight:600;">📅 ${dateStr}</p>
      <p style="margin:0 0 4px;font-size:13px;color:#065f46;">🕐 ${timeStr}</p>
      <p style="margin:0;font-size:13px;color:#065f46;">⏱ ${opts.durationMinutes} minutes</p>
    </div>
    ${opts.meetingUrl ? `<a href="${opts.meetingUrl}" style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin-bottom:12px;">Join Meeting →</a><br/>` : ""}
    <a href="${opts.baseUrl}/sessions" style="display:inline-block;background:#f3f4f6;color:#374151;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">View All Sessions</a>
    <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;">You're receiving this because you have an active mentorship on Mentino.</p>
  </div>
</div>`;
}
