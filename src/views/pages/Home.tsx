import React from "react";
import { ArrowRightIcon, CheckIcon, ChevronDownIcon } from "../components/Icons";

interface HomeProps {
  featuredMentors?: any[];
  stats?: { students: number; mentors: number; activeMatches: number };
}

const WRAP = "max-w-6xl mx-auto px-4 sm:px-6";

const OFFERS = [
  {
    title: "A mentor in your field",
    body: "Get matched with a verified professional who already does the job you want. Message them and set up video calls.",
    href: "/mentors",
    cta: "Browse mentors",
    img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=900&q=80",
  },
  {
    title: "Career Tracks",
    body: "Free 4 to 6 week courses for one career. Watch lessons, take notes, do a weekly assignment, earn a certificate.",
    href: "/tracks",
    cta: "See tracks",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80",
  },
  {
    title: "Resources for any career",
    body: "Search a job and get videos, YouTube channels, books and the steps to take now in high school or college.",
    href: "/resources",
    cta: "Search a career",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80",
  },
];

const STEPS = [
  "Create a free profile in about 5 minutes",
  "See mentors ranked by how well they fit you",
  "Send a request and start messaging",
  "Meet on video and ask your questions",
];

const SAFETY = [
  { title: "Verified mentors", desc: "Every mentor is reviewed by hand before they can talk to anyone." },
  { title: "Moderated messages", desc: "Flagged content is reviewed quickly, and every profile has a report button." },
  { title: "Parental consent", desc: "Students under 18 need a parent's consent to join." },
];

const FIELDS = [
  { name: "Technology", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=640&q=80", field: "Technology" },
  { name: "Medicine & Healthcare", img: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=640&q=80", field: "Medicine & Healthcare" },
  { name: "Law", img: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=640&q=80", field: "Law" },
  { name: "Business & Finance", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&q=80", field: "Business" },
  { name: "Sports & Athletics", img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=640&q=80", field: "Sports & Athletics" },
  { name: "Arts & Design", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=640&q=80", field: "Arts & Design" },
];

const MENTOR_BENEFITS = [
  "Mentor when you have time, pause when you don't",
  "Only students in your field, not random requests",
  "Student reviews build your public profile",
  "Free. No commissions or fees, ever",
];

const FAQS = [
  { q: "Is Mentino actually free?", a: "Yes, for students and mentors. No premium tiers, no subscriptions, no fees." },
  { q: "How does matching work?", a: "You share your career interests, goals, schedule and learning style. Mentino ranks mentors in your field who fit, and you send a short intro to the ones you like. They accept or decline." },
  { q: "Who are the mentors?", a: "Working professionals who signed up to give back. Our team reviews each one before they go live, and they agree to our Code of Conduct." },
  { q: "I'm in high school. Is this for me?", a: "Yes. Mentino was built by a high school student for students figuring out what career they want and what it is really like." },
  { q: "What does a session look like?", a: "A conversation over video or messages. You ask questions; the mentor shares their experience. There is no script." },
  { q: "What if a mentor is inappropriate?", a: "Report them from their profile. We review every report, and bans start at 24 hours and escalate from there." },
];

const HOME_CSS = `
.faq-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--dur-enter) var(--ease); }
.faq-panel > div { overflow: hidden; }
.faq-item.is-open .faq-panel { grid-template-rows: 1fr; }
.faq-item .faq-icon { transition: transform var(--dur-enter) var(--ease); }
.faq-item.is-open .faq-icon { transform: rotate(180deg); }
`;

function initials(m: any) {
  return `${m.accounts?.first_name?.[0] ?? ""}${m.accounts?.last_name?.[0] ?? ""}`;
}

export function Home({ featuredMentors = [], stats }: HomeProps) {
  const studentCount = stats?.students ?? 0;
  const mentorCount = stats?.mentors ?? 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HOME_CSS }} />

      {/* Hero */}
      <section className="-mt-14 pt-14" style={{ background: "linear-gradient(180deg, #f3ece0 0%, #fbfaf7 100%)" }}>
        <div className={`${WRAP} py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
          <div>
            <p className="text-sm text-gray-700 mb-4 anim-fade-up">Most students don't know anyone in their dream field. Mentino changes that.</p>
            <h1 className="font-serif text-5xl sm:text-6xl text-gray-900 anim-fade-up anim-d1">Get real advice from someone who's already there.</h1>
            <p className="text-lg text-gray-700 mt-6 max-w-xl anim-fade-up anim-d2">
              Free mentorship from verified professionals, plus career courses and research tools built for students.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-8 anim-fade-up anim-d3">
              <a href="/signup?role=student" className="btn btn-glass btn-lg">I'm a Student</a>
              <a href="/signup?role=mentor" className="btn btn-glass-light btn-lg">I'm a Mentor</a>
            </div>
            <ul className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-6 anim-fade-up anim-d3">
              {["Free for students", "Verified professionals", "Safe for under 18"].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckIcon className="w-4 h-4 text-forest flex-shrink-0" />{t}
                </li>
              ))}
            </ul>
          </div>
          <div className="skeleton rounded-xl overflow-hidden aspect-[4/3] anim-fade-up anim-d2">
            <img src="/images/hero-bg.jpg" alt="A student talking with a mentor" className="w-full h-full object-cover" data-fade />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={`${WRAP} py-8`}>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-gray-200 py-8">
          {[
            { num: `${mentorCount}`, count: mentorCount, label: "Mentors across 40+ fields" },
            { num: `${studentCount}`, count: studentCount, label: "Students signed up" },
            { num: "$0", label: "Cost for students" },
            { num: "16M", count: 16, suffix: "M", label: "US students without a mentor" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-1">
              <dt className="text-sm text-gray-600">{s.label}</dt>
              <dd className="text-4xl text-gray-900 tabular-nums" data-count={s.count} data-suffix={s.suffix}>{s.num}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* What you get */}
      <section className={`${WRAP} py-16 sm:py-24`}>
        <h2 className="font-serif text-4xl text-gray-900 max-w-2xl">Three ways Mentino helps you pick a career.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {OFFERS.map((o) => (
            <a key={o.title} href={o.href} className="card card-interactive overflow-hidden flex flex-col">
              <span className="block skeleton aspect-[4/3]">
                <img src={o.img} alt="" loading="lazy" className="w-full h-full object-cover zoom-on-hover" data-fade />
              </span>
              <span className="p-6 flex flex-col flex-1">
                <span className="text-xl text-gray-900">{o.title}</span>
                <span className="text-gray-600 mt-2 flex-1">{o.body}</span>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-forest mt-4">{o.cta} <ArrowRightIcon /></span>
              </span>
            </a>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-6">
          Not sure where to start? Take the <a href="/quiz" className="text-gray-900 underline underline-offset-4">10 question Career Quiz</a>.
        </p>
      </section>

      {/* How it works + safety */}
      <section className="bg-sage">
        <div className={`${WRAP} py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12`}>
          <div>
            <h2 className="font-serif text-4xl text-gray-900">How it works</h2>
            <ol className="mt-8 flex flex-col gap-4">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-forest text-white text-sm font-medium flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <span className="text-lg text-gray-900">{s}</span>
                </li>
              ))}
            </ol>
            <a href="/how-it-works" className="btn btn-secondary mt-8">Full details</a>
          </div>
          <div>
            <h2 className="font-serif text-4xl text-gray-900">Built for safety</h2>
            <ul className="mt-8 flex flex-col gap-6">
              {SAFETY.map((s) => (
                <li key={s.title}>
                  <p className="text-lg text-gray-900">{s.title}</p>
                  <p className="text-gray-700 mt-1">{s.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Career fields */}
      <section className={`${WRAP} py-16 sm:py-24`}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="font-serif text-4xl text-gray-900">Explore career fields</h2>
            <p className="text-gray-600 mt-2">Mentors across 40+ industries, including engineering, psychology, media and gaming.</p>
          </div>
          <a href="/resources" className="btn btn-secondary self-start md:self-auto">Search any career</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {FIELDS.map((f) => (
            <a key={f.name} href={`/signup?role=student&interest=${encodeURIComponent(f.field)}`} className="group block">
              <span className="block skeleton rounded-xl overflow-hidden aspect-[4/3]">
                <img src={f.img} alt="" loading="lazy" className="w-full h-full object-cover zoom-on-hover" data-fade />
              </span>
              <span className="block text-base text-gray-900 mt-2 group-hover:underline underline-offset-4">{f.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Featured mentors */}
      {featuredMentors.length > 0 && (
        <section className={`${WRAP} pb-16 sm:pb-24`}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h2 className="font-serif text-4xl text-gray-900">Meet some of our mentors</h2>
              <p className="text-gray-600 mt-2">Real professionals who signed up to help.</p>
            </div>
            <a href="/mentors" className="btn btn-secondary self-start md:self-auto">See all {mentorCount} mentors</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredMentors.map((m: any, i: number) => (
              <a key={i} href="/mentors" className="card card-interactive p-6 flex items-center gap-4">
                {m.accounts?.avatar_url ? (
                  <img src={m.accounts.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <span className="w-12 h-12 bg-clay rounded-full flex items-center justify-center text-gray-900 font-medium text-sm flex-shrink-0" aria-hidden="true">{initials(m)}</span>
                )}
                <span className="min-w-0">
                  <span className="block font-medium text-gray-900 truncate">{m.accounts?.first_name} {m.accounts?.last_name}</span>
                  <span className="block text-sm text-gray-600 truncate">{m.job_title}{m.company ? ` · ${m.company}` : ""}</span>
                  <span className="block t-meta truncate mt-1">{m.career_field}{m.years_experience > 0 ? ` · ${m.years_experience} yrs` : ""}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* For mentors */}
      <section className="bg-sand">
        <div className={`${WRAP} py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
          <div className="skeleton rounded-xl overflow-hidden aspect-[4/3] order-last lg:order-first">
            <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&q=80" alt="A professional advising a student" loading="lazy" className="w-full h-full object-cover" data-fade />
          </div>
          <div>
            <p className="t-eyebrow mb-4" style={{ color: "var(--ink)" }}>For mentors</p>
            <h2 className="font-serif text-4xl text-gray-900">Give back, on your schedule.</h2>
            <p className="text-lg text-gray-700 mt-4">A few honest conversations can change a student's direction.</p>
            <ul className="mt-6 flex flex-col gap-2">
              {MENTOR_BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-2 text-gray-800">
                  <CheckIcon className="w-4 h-4 text-forest flex-shrink-0" />{b}
                </li>
              ))}
            </ul>
            <a href="/signup?role=mentor" className="btn btn-glass btn-lg mt-8">Become a mentor</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${WRAP} py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-3 gap-8`}>
        <h2 className="font-serif text-4xl text-gray-900">Common questions</h2>
        <div className="lg:col-span-2 border-t border-gray-200">
          {FAQS.map((item, i) => (
            <div key={i} className="faq-item border-b border-gray-200">
              <h3>
                <button type="button" data-faq-btn={i} id={`faq-btn-${i}`} aria-expanded="false" aria-controls={`faq-panel-${i}`}
                  className="w-full text-left py-6 flex items-center justify-between gap-4 text-gray-900 hover:text-gray-600 transition-colors">
                  <span className="text-lg">{item.q}</span>
                  <ChevronDownIcon className="faq-icon w-5 h-5 text-gray-500 flex-shrink-0" />
                </button>
              </h3>
              <div className="faq-panel" id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-btn-${i}`}>
                <div><p className="text-gray-600 pb-6 max-w-prose">{item.a}</p></div>
              </div>
            </div>
          ))}
        </div>
        <script dangerouslySetInnerHTML={{ __html: `
    document.querySelectorAll('[data-faq-btn]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var item = this.closest('.faq-item');
        var open = !item.classList.contains('is-open');
        item.classList.toggle('is-open', open);
        this.setAttribute('aria-expanded', String(open));
      });
    });
  ` }} />
      </section>

      {/* CTA */}
      <section className={`${WRAP} pb-16 sm:pb-24`}>
        <div className="bg-clay rounded-xl p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl text-gray-900">Ready to find your mentor?</h2>
            <p className="text-gray-700 mt-2">Set up a profile in 5 minutes. Free for students.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <a href="/signup?role=student" className="btn btn-glass btn-lg">I'm a Student</a>
            <a href="/signup?role=mentor" className="btn btn-glass-light btn-lg">I'm a Mentor</a>
          </div>
        </div>
      </section>
    </>
  );
}
