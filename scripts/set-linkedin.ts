import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://oiltogwdhlgxnpdtmglq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pbHRvZ3dkaGxneG5wZHRtZ2xxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNjA3MDEsImV4cCI6MjA4OTYzNjcwMX0.dd7prjZvGPf4vhDai0I5tFqZiB1Aylgpk5cgQE7h7-M"
);

const MENTORS = [
  { firstName: "Sean",     lastName: "Ipakchi",    linkedin: "https://www.linkedin.com/in/sean-ipakchi-23246b8/" },
  { firstName: "Dustin",   lastName: "Vorsatz",    linkedin: "https://www.linkedin.com/in/vorsatz/" },
  { firstName: "Eduardo",  lastName: "Olmos",      linkedin: "https://www.linkedin.com/in/eolmos/" },
  { firstName: "Joanne",   lastName: "Branzuela",  linkedin: "https://www.linkedin.com/in/joanne-b-a829226/" },
  { firstName: "Anthony",  lastName: "Branzuela",  linkedin: "https://www.linkedin.com/in/anthonybranzuela/" },
];

for (const m of MENTORS) {
  // Find account by name
  const { data: acct, error: acctErr } = await supabase
    .from("accounts")
    .select("id")
    .eq("first_name", m.firstName)
    .eq("last_name", m.lastName)
    .single();

  if (acctErr || !acct) {
    console.log(`NOT FOUND: ${m.firstName} ${m.lastName} —`, acctErr?.message);
    continue;
  }

  // Update mentor row
  const { error: updErr } = await supabase
    .from("mentors")
    .update({ linkedin_url: m.linkedin })
    .eq("user_id", acct.id);

  if (updErr) {
    console.log(`UPDATE FAILED for ${m.firstName} ${m.lastName}:`, updErr.message);
  } else {
    console.log(`OK: ${m.firstName} ${m.lastName} -> ${m.linkedin}`);
  }
}
