import { mock } from "bun:test";
const now = Date.now(); const iso = (minAgo: number) => new Date(now - minAgo * 60000).toISOString();
const tables: Record<string, any[]> = {
  accounts: [
    { id: "u1", role: "student", first_name: "Alex", last_name: "Martinez", is_active: true, is_banned: false, registration_complete: true, email: "a@x.com" },
    { id: "u2", role: "mentor", first_name: "Sean", last_name: "Ipakchi", is_active: true, is_banned: false, registration_complete: true, email: "s@x.com", avatar_url: null },
  ],
  students: [{ id: "s1", user_id: "u1" }],
  mentors: [{ id: "m1", user_id: "u2" }],
  matches: [
    { id: "match1", student_id: "s1", mentor_id: "m1", status: "active", created_at: iso(5000),
      students: { user_id: "u1", accounts: { first_name: "Alex", last_name: "Martinez", avatar_url: null } },
      mentors: { user_id: "u2", accounts: { first_name: "Sean", last_name: "Ipakchi", avatar_url: null } } },
    { id: "match2", student_id: "s1", mentor_id: "m2", status: "active", created_at: iso(9000),
      students: { user_id: "u1", accounts: { first_name: "Alex", last_name: "Martinez" } },
      mentors: { user_id: "u3", accounts: { first_name: "Joanne", last_name: "Branzuela" } } },
  ],
  messages: [
    { id: "1", match_id: "match1", sender_id: "u1", content: "Hi Sean! I'm a junior interested in data science. Could I ask you a few questions about your work at Slalom?", is_read: true, created_at: iso(1500) },
    { id: "2", match_id: "match1", sender_id: "u2", content: "Of course, happy to help.", is_read: true, created_at: iso(1490) },
    { id: "3", match_id: "match1", sender_id: "u2", content: "What are you most curious about? Day to day work, how I got here, or what to study?", is_read: true, created_at: iso(1489) },
    { id: "4", match_id: "match1", sender_id: "u1", content: "Mostly what to study. Should I take AP Stats or AP CS first?", is_read: true, created_at: iso(30) },
    { id: "5", match_id: "match1", sender_id: "u1", content: "And does a project portfolio matter for internships?", is_read: true, created_at: iso(29) },
    { id: "6", match_id: "match2", sender_id: "u3", content: "Great question about nursing programs, let's talk Thursday.", is_read: false, created_at: iso(200) },
  ],
  sessions: [],
};
function q(table: string) {
  const filters: ((r: any) => boolean)[] = [];
  let op = "select", payload: any = null, single = false, maybe = false, head = false, order: [string, boolean] | null = null, limit = 0;
  const api: any = {
    select(_c?: string, o?: any) { if (o?.head) head = true; return api; },
    eq(k: string, v: any) { filters.push((r) => r[k] === v); return api; },
    neq(k: string, v: any) { filters.push((r) => r[k] !== v); return api; },
    gt(k: string, v: any) { filters.push((r) => r[k] > v); return api; },
    in(k: string, v: any[]) { filters.push((r) => v.includes(r[k])); return api; },
    not() { filters.push(() => false); return api; },
    order(k: string, o?: any) { order = [k, o?.ascending !== false]; return api; },
    limit(n: number) { limit = n; return api; },
    insert(p: any) { op = "insert"; payload = p; return api; }, update(p: any) { op = "update"; payload = p; return api; },
    single() { single = true; return api; }, maybeSingle() { maybe = true; return api; },
    then(res: any, rej: any) {
      const all = tables[table] || [];
      if (op === "insert") { const row = { id: String(Date.now()), created_at: new Date().toISOString(), ...payload }; all.push(row); return Promise.resolve({ data: row, error: null }).then(res, rej); }
      let rows = all.filter((r) => filters.every((f) => f(r)));
      if (op === "update") { rows.forEach((r) => Object.assign(r, payload)); return Promise.resolve({ data: null, error: null }).then(res, rej); }
      if (order) { const [k, asc] = order; rows = [...rows].sort((a, b) => (a[k] > b[k] ? 1 : -1) * (asc ? 1 : -1)); }
      if (limit) rows = rows.slice(0, limit);
      if (head) return Promise.resolve({ count: rows.length, data: null, error: null }).then(res, rej);
      if (single || maybe) return Promise.resolve({ data: rows[0] ?? null, error: rows[0] || maybe ? null : { message: "none" } }).then(res, rej);
      return Promise.resolve({ data: rows, error: null, count: rows.length }).then(res, rej);
    },
  };
  return api;
}
mock.module("./src/db", () => ({ supabase: { from: (t: string) => q(t) } }));
const { app } = await import("./src/app");
const { signToken } = await import("./src/lib/jwt");
console.log("TOKEN=" + await signToken("u1", "student"));
Bun.serve({ port: 3100, fetch: app.fetch });
console.log("mock chat server on 3100");
