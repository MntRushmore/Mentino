import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || Bun.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || Bun.env.SUPABASE_ANON_KEY || ""
);

const PASSWORD_HASH = "$2b$10$7a2vMxSpv0lgaIgYTc5d8uEiscLEVbqdjA0GZ9EvJ/QtI8EW47uD6"; // password123

const mentors = [
  {
    account: { id: "00000000-0000-0000-0000-000000000002", email: "sarah.chen@example.com", first_name: "Sarah", last_name: "Chen", display_name: "Sarah C.", bio: "Senior software engineer with 8 years of experience. Passionate about helping the next generation break into tech." },
    mentor: { career_field: "Technology", job_title: "Senior Software Engineer", company: "Google", years_experience: 8, topics: ["Breaking into the field", "Interview prep", "Resume review", "Career growth"], availability: { monday: ["6pm-8pm"], wednesday: ["6pm-8pm"], saturday: ["10am-12pm"] }, max_mentees: 3 },
  },
  {
    account: { id: "00000000-0000-0000-0000-000000000003", email: "james.wilson@example.com", first_name: "James", last_name: "Wilson", display_name: "James W.", bio: "Emergency medicine physician. Love mentoring pre-med students and sharing what medical school is really like." },
    mentor: { career_field: "Medicine", job_title: "Emergency Medicine Physician", company: "Johns Hopkins Hospital", years_experience: 12, topics: ["Breaking into the field", "Interview prep", "Career growth", "Work-life balance"], availability: { tuesday: ["7pm-9pm"], thursday: ["7pm-9pm"] }, max_mentees: 2 },
  },
  {
    account: { id: "00000000-0000-0000-0000-000000000010", email: "maya.johnson@example.com", first_name: "Maya", last_name: "Johnson", display_name: "Maya J.", bio: "Corporate attorney turned legal tech entrepreneur. I help students understand what a law career really looks like." },
    mentor: { career_field: "Law", job_title: "Founder & Attorney", company: "LegalEase AI", years_experience: 10, topics: ["Breaking into the field", "Interview prep", "College guidance", "Entrepreneurship"], availability: { monday: ["6pm-9pm"], thursday: ["6pm-9pm"], sunday: ["10am-12pm"] }, max_mentees: 4 },
  },
  {
    account: { id: "00000000-0000-0000-0000-000000000011", email: "david.park@example.com", first_name: "David", last_name: "Park", display_name: "David P.", bio: "Finance professional with a passion for financial literacy. Started as an intern and worked my way up to VP." },
    mentor: { career_field: "Finance", job_title: "Vice President", company: "Goldman Sachs", years_experience: 15, topics: ["Breaking into the field", "Interview prep", "Resume review", "Networking", "Career growth"], availability: { tuesday: ["7pm-9pm"], friday: ["6pm-9pm"], saturday: ["9am-12pm"] }, max_mentees: 3 },
  },
  {
    account: { id: "00000000-0000-0000-0000-000000000012", email: "rachel.green@example.com", first_name: "Rachel", last_name: "Green", display_name: "Rachel G.", bio: "Product designer at a top startup. I love helping young creatives find their path in UX, graphic design, and the broader arts world." },
    mentor: { career_field: "Arts", job_title: "Lead Product Designer", company: "Figma", years_experience: 7, topics: ["Breaking into the field", "Technical skills", "Resume review", "Industry trends", "Soft skills"], availability: { wednesday: ["5pm-8pm"], saturday: ["10am-12pm"], sunday: ["2pm-5pm"] }, max_mentees: 3 },
  },
  {
    account: { id: "00000000-0000-0000-0000-000000000013", email: "carlos.rivera@example.com", first_name: "Carlos", last_name: "Rivera", display_name: "Carlos R.", bio: "Mechanical engineer working in renewable energy. First-gen college grad who wants to help students navigate STEM careers." },
    mentor: { career_field: "Engineering", job_title: "Senior Mechanical Engineer", company: "Tesla", years_experience: 9, topics: ["College guidance", "Career growth", "Technical skills", "Work-life balance", "Breaking into the field"], availability: { monday: ["7pm-9pm"], wednesday: ["7pm-9pm"], saturday: ["11am-1pm"] }, max_mentees: 2 },
  },
  {
    account: { id: "00000000-0000-0000-0000-000000000014", email: "aisha.williams@example.com", first_name: "Aisha", last_name: "Williams", display_name: "Aisha W.", bio: "High school biology teacher turned biotech researcher. I bridge the gap between education and industry for students interested in science." },
    mentor: { career_field: "Science", job_title: "Research Scientist", company: "Genentech", years_experience: 11, topics: ["College guidance", "Career growth", "Leadership", "Industry trends"], availability: { tuesday: ["6pm-8pm"], thursday: ["6pm-8pm"], sunday: ["10am-12pm"] }, max_mentees: 3 },
  },
  {
    account: { id: "00000000-0000-0000-0000-000000000015", email: "tom.nguyen@example.com", first_name: "Tom", last_name: "Nguyen", display_name: "Tom N.", bio: "Sports management professional. Played college basketball and now work behind the scenes in the NBA." },
    mentor: { career_field: "Sports", job_title: "Director of Player Development", company: "NBA", years_experience: 8, topics: ["Breaking into the field", "Networking", "Leadership", "Career growth", "Work-life balance"], availability: { monday: ["8pm-10pm"], friday: ["6pm-9pm"] }, max_mentees: 2 },
  },
  {
    account: { id: "00000000-0000-0000-0000-000000000016", email: "lisa.chang@example.com", first_name: "Lisa", last_name: "Chang", display_name: "Lisa C.", bio: "Management consultant who has worked across healthcare, tech, and non-profit. I help students think strategically about their career path." },
    mentor: { career_field: "Consulting", job_title: "Senior Manager", company: "McKinsey & Company", years_experience: 10, topics: ["Interview prep", "Resume review", "Career growth", "Networking", "Leadership"], availability: { wednesday: ["7pm-9pm"], saturday: ["9am-11am"], sunday: ["3pm-5pm"] }, max_mentees: 3 },
  },
];

async function seed() {
  console.log("Seeding demo mentors...\n");

  for (const m of mentors) {
    // Upsert account
    const { error: accErr } = await supabase.from("accounts").upsert({
      id: m.account.id,
      email: m.account.email,
      password_hash: PASSWORD_HASH,
      role: "mentor",
      first_name: m.account.first_name,
      last_name: m.account.last_name,
      display_name: m.account.display_name,
      bio: m.account.bio,
      registration_step: 5,
      registration_complete: true,
    }, { onConflict: "id" });

    if (accErr) {
      console.error(`  Account ${m.account.email}: ${accErr.message}`);
      continue;
    }

    // Upsert mentor
    const { error: mentorErr } = await supabase.from("mentors").upsert({
      user_id: m.account.id,
      career_field: m.mentor.career_field,
      job_title: m.mentor.job_title,
      company: m.mentor.company,
      years_experience: m.mentor.years_experience,
      topics: m.mentor.topics,
      availability: m.mentor.availability,
      verification_status: "approved",
      max_mentees: m.mentor.max_mentees,
      current_mentees: 0,
    }, { onConflict: "user_id" });

    if (mentorErr) {
      console.error(`  Mentor ${m.account.email}: ${mentorErr.message}`);
    } else {
      console.log(`  ${m.account.first_name} ${m.account.last_name} (${m.mentor.job_title} @ ${m.mentor.company})`);
    }
  }

  // Verify
  const { data: count } = await supabase
    .from("mentors")
    .select("id", { count: "exact" })
    .eq("verification_status", "approved");

  console.log(`\nDone! ${count?.length || 0} approved mentors in database.`);
}

seed();
