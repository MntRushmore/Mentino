import { Hono } from "hono";
import React from "react";
import { renderToString } from "react-dom/server";
import { Layout } from "../views/Layout";
import { optionalAuth } from "../middleware/auth";

const staticPages = new Hono();

function html(element: React.ReactElement, status = 200) {
  return new Response("<!DOCTYPE html>" + renderToString(element), {
    status,
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}

// Donut chart segments pre-computed
// r=65, C = 2π×65 ≈ 408.41
const C = 2 * Math.PI * 65;
const matchSegs = [
  { pct: 35, color: "#6366f1", label: "Career Alignment", textColor: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
  { pct: 25, color: "#10b981", label: "Topic Relevance",  textColor: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  { pct: 20, color: "#8b5cf6", label: "Schedule Match",   textColor: "text-violet-600",  bg: "bg-violet-50",  border: "border-violet-100" },
  { pct: 15, color: "#f59e0b", label: "Personality Fit",  textColor: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-100" },
  { pct: 5,  color: "#f43f5e", label: "Mentor Capacity",  textColor: "text-rose-600",    bg: "bg-rose-50",    border: "border-rose-100" },
];
let _cum = 0;
const computedSegs = matchSegs.map((s) => {
  const dash = (s.pct / 100) * C;
  const result = { ...s, dash, offset: _cum };
  _cum += dash;
  return result;
});

// GET /code-of-conduct
staticPages.get("/code-of-conduct", optionalAuth, (c) => {
  const user = c.get("user");
  return html(
    <Layout title="Code of Conduct" user={user}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Community Code of Conduct</h1>
          <div className="prose prose-gray max-w-none space-y-6">
            <p className="text-gray-600 text-lg">
              Mentino is committed to providing a safe, supportive, and inclusive environment for all students and mentors. By using our platform, you agree to abide by the following guidelines.
            </p>
            <Section title="Respect & Professionalism">
              <ul>
                <li>Treat all members with dignity and respect, regardless of age, background, identity, or experience level.</li>
                <li>Maintain professional boundaries at all times. Mentorship relationships should remain educational and supportive.</li>
                <li>Be punctual for scheduled sessions and communicate proactively about changes.</li>
              </ul>
            </Section>
            <Section title="Communication Standards">
              <ul>
                <li>Keep all conversations appropriate and relevant to mentorship and career goals.</li>
                <li>Do not share personal contact information outside the platform until both parties are comfortable.</li>
                <li>Use constructive language. Avoid criticism that isn't actionable or helpful.</li>
              </ul>
            </Section>
            <Section title="Safety & Privacy">
              <ul>
                <li>Keep mentorship conversations confidential.</li>
                <li>For students under 18, parental/guardian consent is required. Mentors should be mindful of age-appropriate interactions.</li>
                <li>Never request or share inappropriate content of any kind.</li>
              </ul>
            </Section>
            <Section title="Zero Tolerance Policy">
              <p>The following behaviors will result in immediate account removal:</p>
              <ul>
                <li>Harassment, bullying, or intimidation of any kind</li>
                <li>Solicitation of personal relationships beyond mentorship</li>
                <li>Sharing explicit, offensive, or discriminatory content</li>
                <li>Impersonating another person or providing false credentials</li>
                <li>Any form of spam, scam, or commercial solicitation</li>
              </ul>
            </Section>
            <Section title="Reporting Violations">
              <p>If you experience or witness a violation, please report it immediately through the platform's reporting feature. All reports are reviewed within 24 hours and handled confidentially.</p>
            </Section>
            <Section title="Mentor Responsibilities">
              <ul>
                <li>Provide honest, constructive guidance based on your genuine experience.</li>
                <li>Be transparent about your background and qualifications.</li>
                <li>Respect your mentee's time and goals.</li>
              </ul>
            </Section>
            <Section title="Student Responsibilities">
              <ul>
                <li>Come prepared to sessions with questions or topics you'd like to discuss.</li>
                <li>Be respectful of your mentor's volunteer time.</li>
                <li>Provide honest feedback to help us improve the matching process.</li>
              </ul>
            </Section>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-400">Last updated: March 2026</div>
        </div>
      </div>
    </Layout>
  );
});

// GET /about
staticPages.get("/about", optionalAuth, (c) => {
  const user = c.get("user");
  return html(
    <Layout title="About" user={user} currentPath="/about">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">About Mentino</span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mentorship shouldn't depend on who you know.</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Mentino is a free platform that connects students with verified professionals for personalized career guidance — regardless of background or network.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Too many talented students lack access to professional networks and career guidance. Students from well-connected families get career advice over dinner. Everyone else has to figure it out alone. Mentino bridges this gap by creating a safe, structured platform where industry professionals can volunteer their time to help the next generation succeed.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">For Students</h3>
            <p className="text-gray-600">Create a profile, tell us about your career interests and goals, and our matching system will connect you with mentors who align with your aspirations.</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">For Mentors</h3>
            <p className="text-gray-600">Sign up, complete our verification process, and start making an impact. Share your experience, conduct mock interviews, or help students understand your career path.</p>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Accessibility", desc: "Free for all students. No premium tiers, no paywalls. Every student deserves opportunity.", bg: "bg-blue-50", border: "border-blue-100", h: "text-blue-800", p: "text-blue-700" },
              { title: "Safety", desc: "All mentors are verified. Content is moderated. Students under 18 require parental consent.", bg: "bg-emerald-50", border: "border-emerald-100", h: "text-emerald-800", p: "text-emerald-700" },
              { title: "Authenticity", desc: "Real mentors with real experience. No fluff, no filler — genuine career guidance from people who've done it.", bg: "bg-violet-50", border: "border-violet-100", h: "text-violet-800", p: "text-violet-700" },
              { title: "Impact", desc: "Conversations that create long-term growth. Sometimes one mentor is all it takes to change a life.", bg: "bg-amber-50", border: "border-amber-100", h: "text-amber-800", p: "text-amber-700" },
            ].map((v) => (
              <div key={v.title} className={`${v.bg} border ${v.border} rounded-xl p-5`}>
                <h3 className={`font-bold ${v.h} text-lg mb-1`}>{v.title}</h3>
                <p className={`${v.p} text-sm`}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Get in Touch</h2>
          <p className="text-gray-600">
            Have questions, feedback, or want to partner with us? Reach out at{" "}
            <a href="mailto:hello@mentino.org" className="text-blue-600 hover:underline font-medium">hello@mentino.org</a>
          </p>
        </div>
      </div>
    </Layout>
  );
});

// GET /founder — About the Founder
staticPages.get("/founder", optionalAuth, (c) => {
  const user = c.get("user");
  return html(
    <Layout title="About the Founder" user={user} currentPath="/founder">
      <div className="max-w-5xl mx-auto">

        {/* Hero with background image */}
        <div className="relative rounded-3xl overflow-hidden mb-12">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1542744094-24638eff58bb?w=1400&q=80"
              alt="Bay Area skyline"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90" />
          </div>
          <div className="relative z-10 text-center text-white py-20 px-8">
            <div className="w-40 h-40 mx-auto mb-6 rounded-2xl border-4 border-indigo-400 overflow-hidden shadow-2xl">
              <img src="/images/founder.jpg" alt="Ethan Branzuela, Founder of Mentino" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-4xl font-extrabold mb-2">Ethan Branzuela</h1>
            <p className="text-indigo-300 text-xl mb-5">Founder of Mentino</p>
            <div className="flex justify-center flex-wrap gap-3">
              {["15 years old", "Bay Area, CA", "Sports Photographer", "Young Entrepreneur"].map((tag) => (
                <span key={tag} className="bg-white/15 border border-white/20 text-white text-sm px-4 py-1.5 rounded-full backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Impact stats banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { num: "16M", label: "Young people without a mentor in the US", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
            { num: "5×", label: "More promotions for mentored employees", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
            { num: "500+", label: "Students connected on Mentino", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
            { num: "15+", label: "Career fields covered on the platform", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
          ].map((s) => (
            <div key={s.num} className={`${s.bg} border ${s.border} rounded-2xl p-5 text-center`}>
              <div className={`text-3xl font-extrabold ${s.color} mb-1`}>{s.num}</div>
              <div className="text-gray-600 text-xs leading-snug">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Story section with image */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10 items-start">
          <div className="md:col-span-3 bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                My name is <strong>Ethan Branzuela</strong>, and I'm a 15-year-old student in the Bay Area. I'm also a freelance sports photographer who has worked with professional, collegiate, and high school athletes throughout the region.
              </p>
              <p>
                As a young photographer trying to grow in a competitive field, I learned something early: <strong>talent isn't enough</strong>. What truly accelerated my growth was reaching out to photographers I admired — asking questions, studying their work, and learning directly from people with more experience than me.
              </p>
              <p>
                Having someone older, wiser, and further ahead guide me made an enormous difference in my career trajectory. That personal experience with mentorship is what inspired everything you see here.
              </p>
            </div>
          </div>
          <div className="md:col-span-2 space-y-3">
            <img src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=500&q=80" alt="Sports photography" className="rounded-2xl w-full h-52 object-cover" />
            <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80" alt="Youth in sports" className="rounded-2xl w-full h-44 object-cover" />
          </div>
        </div>

        {/* Realization callout */}
        <div className="relative bg-indigo-600 rounded-2xl p-10 mb-10 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/4 -translate-x-1/4" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">That realization stuck with me.</h2>
            <p className="text-indigo-100 text-lg leading-relaxed max-w-3xl">
              I began noticing the same pattern everywhere. Whether someone wants to become a professional athlete, a doctor, a lawyer, an entrepreneur, or a scientist — no one succeeds alone. Every successful person had guidance. Every successful person had someone who helped them navigate the unknown.
            </p>
          </div>
        </div>

        {/* Why Mentino + images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 items-center">
          <div className="space-y-4">
            <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&q=80" alt="Mentorship connection" className="rounded-2xl w-full h-56 object-cover" />
            <div className="grid grid-cols-2 gap-3">
              <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&q=80" alt="Student and mentor" className="rounded-2xl w-full h-36 object-cover" />
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80" alt="Career guidance" className="rounded-2xl w-full h-36 object-cover" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
              <h3 className="text-xl font-bold text-amber-900">That's why I created Mentino.</h3>
              <p className="text-amber-700 text-sm mt-1">A free platform to make mentorship accessible to every student.</p>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">My Vision</h3>
            <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 my-4 text-lg font-medium text-gray-800 italic">
              "One day, a student should be able to click a button and instantly connect with the right mentor for their dream career."
            </blockquote>
            <ul className="space-y-2 text-gray-600">
              {[
                "If you want to become a CEO, you should speak to one.",
                "If you want to become a doctor, you should learn from one.",
                "If you want to work in sports, law, tech, or science — you should have direct access.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">The Mentino Journey</h2>
          <div className="space-y-0">
            {[
              { year: "2022", title: "The Spark", desc: "Started sports photography, discovered the power of seeking guidance from experienced photographers.", color: "bg-blue-500" },
              { year: "2023", title: "The Idea", desc: "Recognized that every student deserves access to professional mentors, not just those with connections.", color: "bg-indigo-500" },
              { year: "2024", title: "Building Begins", desc: "Started designing and developing Mentino — learning to code while building the actual product.", color: "bg-violet-500" },
              { year: "2025", title: "Mentino Launches", desc: "Launched the platform with a focus on safety, smart matching, and free access for all students.", color: "bg-emerald-500" },
              { year: "2026", title: "Growing Impact", desc: "500+ students matched, 200+ verified mentors, 15+ career fields — and just getting started.", color: "bg-rose-500" },
            ].map((item, i, arr) => (
              <div key={i} className="flex gap-5 relative">
                <div className="flex flex-col items-center">
                  <div className={`${item.color} text-white w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 z-10`}>
                    {item.year.slice(2)}
                  </div>
                  {i < arr.length - 1 && <div className="w-0.5 bg-gray-200 flex-1 mt-1" />}
                </div>
                <div className={`pb-8 ${i === arr.length - 1 ? "pb-0" : ""}`}>
                  <div className="text-xs text-gray-400 font-semibold mb-0.5">{item.year}</div>
                  <h4 className="font-bold text-gray-900">{item.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Challenges</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Starting Mentino at 15 hasn't been easy. One of the biggest challenges has been reaching a wider audience. There are only so many people you can message personally, and building trust at a young age requires persistence and proof.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            But every meaningful idea starts small. And every large movement once began with a single conversation.
          </p>
          <p className="text-gray-800 font-semibold">
            I believe that if I focus on impact first, growth will follow.
          </p>
        </div>

        {/* Why Trust */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Trust Mentino?</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Mentino isn't just an idea — it's built from real experience. I've personally seen how mentorship accelerates career growth. I've experienced it in photography. I've seen it in sports. And I've seen how one conversation can change someone's confidence and direction.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { icon: "🌍", title: "Access", desc: "Every student deserves opportunity", bg: "bg-blue-50", border: "border-blue-100", h: "text-blue-800", p: "text-blue-700" },
              { icon: "✅", title: "Authenticity", desc: "Real mentors with real experience", bg: "bg-emerald-50", border: "border-emerald-100", h: "text-emerald-800", p: "text-emerald-700" },
              { icon: "🚀", title: "Impact", desc: "Conversations that create long-term growth", bg: "bg-violet-50", border: "border-violet-100", h: "text-violet-800", p: "text-violet-700" },
            ].map((v) => (
              <div key={v.title} className={`${v.bg} border ${v.border} rounded-xl p-5 text-center`}>
                <div className="text-3xl mb-2">{v.icon}</div>
                <h3 className={`font-bold ${v.h} text-lg mb-1`}>{v.title}</h3>
                <p className={`${v.p} text-sm`}>{v.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-600 leading-relaxed">
            This isn't about networking for status. It's about building bridges through conversation. And sometimes, <strong>one mentor is all it takes to change a life</strong>.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-10 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Join the Mission</h3>
          <p className="text-indigo-100 mb-6">Whether you're a student or a professional, there's a place for you at Mentino.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="/signup" className="bg-white text-indigo-600 font-bold px-7 py-3 rounded-full hover:bg-indigo-50 transition-colors">
              Sign Up as Student
            </a>
            <a href="/signup" className="border-2 border-white text-white font-semibold px-7 py-3 rounded-full hover:bg-white/10 transition-colors">
              Become a Mentor
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
});

// GET /how-it-works
staticPages.get("/how-it-works", optionalAuth, (c) => {
  const user = c.get("user");
  return html(
    <Layout title="How It Works" user={user} currentPath="/how-it-works">
      <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden mb-14">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80"
              alt="Students working together"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/88 via-teal-900/80 to-blue-900/85" />
          </div>
          <div className="relative z-10 text-center text-white py-20 px-8">
            <span className="inline-block bg-white/20 border border-white/30 text-white text-sm font-semibold px-5 py-2 rounded-full mb-4 backdrop-blur-sm">
              How It Works
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">From Sign-Up to Mentorship in Minutes</h1>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
              Our smart matching platform makes it easy to find the right career mentor. Here's exactly how the process works — step by step.
            </p>
          </div>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {[
            { num: "5 min", label: "Average time to complete your profile", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
            { num: "5×", label: "More career promotions for mentored individuals", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
            { num: "71%", label: "Of Fortune 500 companies have formal mentoring programs", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
            { num: "23%", label: "More job offers before graduation with a mentor", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
          ].map((s) => (
            <div key={s.num} className={`${s.bg} border ${s.border} rounded-2xl p-5 text-center`}>
              <div className={`text-3xl font-extrabold ${s.color} mb-1`}>{s.num}</div>
              <div className="text-gray-600 text-xs leading-snug">{s.label}</div>
            </div>
          ))}
        </div>

        {/* 4 Steps with images */}
        <div className="mb-14">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">Your 4-Step Journey</h2>
          <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
            From creating your profile to your first mentorship session — here's every step.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                number: 1, color: "blue",
                title: "Create Your Profile",
                img: "https://images.unsplash.com/photo-1616587226157-48e49175ee20?w=600&q=80",
                description: "Sign up and tell us about yourself. Students share their career interests, learning goals, availability, and personality traits. Mentors share professional background, expertise, and topics they can help with.",
                details: ["Choose your role: Student or Mentor", "Complete a simple multi-step registration", "Students: career interests, goals, schedule preferences", "Mentors: job title, experience, topics, verification"],
                numBg: "bg-blue-600", cardBg: "bg-blue-50", cardBorder: "border-blue-100", dot: "bg-blue-400",
              },
              {
                number: 2, color: "emerald",
                title: "Get Smart-Matched",
                img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
                description: "Our matching system analyzes 5 key factors to find the best mentor-student pairs. It's not random — it's thoughtful, data-driven pairing designed to maximize the value of every career conversation.",
                details: ["Career field alignment (35% of match score)", "Topic relevance to your goals (25%)", "Schedule overlap so you can actually meet (20%)", "Personality and learning style compatibility (15%)"],
                numBg: "bg-emerald-600", cardBg: "bg-emerald-50", cardBorder: "border-emerald-100", dot: "bg-emerald-400",
              },
              {
                number: 3, color: "violet",
                title: "Request a Match",
                img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
                description: "Browse your top matches, read mentor profiles, and request to connect with the ones that resonate with you. Mentors review requests and accept the students they feel they can help most.",
                details: ["See your top 10 matches ranked by compatibility", "Read detailed mentor bios and career expertise", "Send a match request with one click", "Mentors accept or pass — no pressure on either side"],
                numBg: "bg-violet-600", cardBg: "bg-violet-50", cardBorder: "border-violet-100", dot: "bg-violet-400",
              },
              {
                number: 4, color: "amber",
                title: "Connect & Learn",
                img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80",
                description: "Once matched, start messaging your mentor directly through Mentino. Schedule video sessions for deeper conversations. Get career guidance on interviews, college decisions, and more.",
                details: ["Direct messaging built into the platform", "Schedule video sessions at times that work for both", "Rate sessions and provide feedback", "Stay connected as long as the mentorship is valuable"],
                numBg: "bg-amber-600", cardBg: "bg-amber-50", cardBorder: "border-amber-100", dot: "bg-amber-400",
              },
            ].map((step) => (
              <div key={step.number} className={`${step.cardBg} border ${step.cardBorder} rounded-2xl overflow-hidden`}>
                <div className="h-44 overflow-hidden">
                  <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`${step.numBg} text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0`}>
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 mb-3 text-sm leading-relaxed">{step.description}</p>
                      <ul className="space-y-1">
                        {step.details.map((d, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className={`w-1.5 h-1.5 ${step.dot} rounded-full mt-1.5 flex-shrink-0`} />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inside the Matching System — Donut Chart + Legend */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-10 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Inside the Matching System</h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            Our algorithm considers five key factors to pair students with the most compatible career mentors. Here's exactly how each factor is weighted:
          </p>
          <div className="flex flex-col md:flex-row gap-10 items-center">
            {/* SVG Donut Chart */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 180 180" width="220" height="220">
                {computedSegs.map((s, i) => (
                  <circle
                    key={i}
                    cx="90" cy="90" r="65"
                    fill="none"
                    stroke={s.color}
                    strokeWidth="26"
                    strokeDasharray={`${s.dash} ${C - s.dash}`}
                    strokeDashoffset={`${-s.offset}`}
                    transform="rotate(-90 90 90)"
                  />
                ))}
                <text x="90" y="83" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#111827">5</text>
                <text x="90" y="100" textAnchor="middle" fontSize="11" fill="#6b7280">Factors</text>
              </svg>
            </div>
            {/* Legend + bars */}
            <div className="flex-1 space-y-4 w-full">
              {computedSegs.map((s) => (
                <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="font-semibold text-gray-900 text-sm">{s.label}</span>
                    </div>
                    <span className={`text-xl font-extrabold ${s.textColor}`}>{s.pct}%</span>
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Research Impact Section — visual bar chart */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-8 md:p-10 mb-10 text-white">
          <h2 className="text-2xl font-bold mb-2 text-center">Why Mentorship Works — The Research</h2>
          <p className="text-slate-300 text-center mb-10 max-w-xl mx-auto">
            The data is clear: mentored students and professionals consistently outperform their peers across every key career metric.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: horizontal bar chart */}
            <div>
              <h3 className="text-slate-200 font-semibold mb-5 text-sm uppercase tracking-wide">Mentorship Impact by the Numbers</h3>
              <div className="space-y-5">
                {[
                  { label: "More likely to be promoted", value: "5×", bar: 100, color: "#6366f1" },
                  { label: "More likely to enroll in college", value: "55%", bar: 55, color: "#10b981" },
                  { label: "More job offers before graduation", value: "23%", bar: 23, color: "#f59e0b" },
                  { label: "More career satisfaction", value: "4×", bar: 80, color: "#8b5cf6" },
                  { label: "Higher salary per year vs peers", value: "$5,610", bar: 60, color: "#f43f5e" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="font-bold text-white">{item.value}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full" style={{ width: `${item.bar}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-slate-500 text-xs mt-4">Sources: MENTOR, NACE, Journal of Applied Psychology, Gartner (2004–2024)</p>
            </div>
            {/* Right: key outcome stats */}
            <div>
              <h3 className="text-slate-200 font-semibold mb-5 text-sm uppercase tracking-wide">Career Outcomes Over Time</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { stat: "71%", label: "Fortune 500 companies with mentoring programs", color: "from-indigo-600 to-indigo-700" },
                  { stat: "130%", label: "More likely to hold leadership positions", color: "from-emerald-600 to-emerald-700" },
                  { stat: "78%", label: "More likely to volunteer in their communities", color: "from-violet-600 to-violet-700" },
                  { stat: "90%", label: "More interested in becoming a mentor themselves", color: "from-amber-600 to-amber-700" },
                ].map((s) => (
                  <div key={s.stat} className={`bg-gradient-to-br ${s.color} rounded-xl p-4 text-center`}>
                    <div className="text-3xl font-extrabold text-white mb-1">{s.stat}</div>
                    <div className="text-white/80 text-xs leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-slate-500 text-xs mt-4">Source: MENTOR: The National Mentoring Partnership, "The Mentoring Effect" (2014)</p>
            </div>
          </div>
        </div>

        {/* Salary Data Visual */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Salary by Career Field</h2>
          <p className="text-gray-500 text-center mb-8 max-w-xl mx-auto">
            Median annual salaries across major career fields (BLS, May 2023). Talk to mentors in any field to understand the full picture.
          </p>
          <div className="space-y-3">
            {[
              { field: "Computer & IT", salary: "$104,420", pct: 100, color: "bg-blue-500" },
              { field: "Legal", salary: "$84,910", pct: 82, color: "bg-amber-500" },
              { field: "Engineering", salary: "$83,340", pct: 80, color: "bg-indigo-500" },
              { field: "Business & Financial", salary: "$76,850", pct: 74, color: "bg-emerald-500" },
              { field: "Healthcare Practitioners", salary: "$77,600", pct: 75, color: "bg-rose-500" },
              { field: "Life Sciences", salary: "$68,830", pct: 66, color: "bg-violet-500" },
              { field: "Arts & Design", salary: "$50,710", pct: 49, color: "bg-pink-500" },
              { field: "Education", salary: "$55,350", pct: 53, color: "bg-teal-500" },
            ].map((item) => (
              <div key={item.field} className="flex items-center gap-4">
                <div className="w-36 text-sm text-gray-700 font-medium flex-shrink-0">{item.field}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                  <div className={`${item.color} h-6 rounded-full flex items-center justify-end pr-3`} style={{ width: `${item.pct}%` }}>
                    <span className="text-white text-xs font-bold">{item.salary}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">Source: U.S. Bureau of Labor Statistics, Occupational Employment and Wages, May 2023</p>
        </div>

        {/* Safety */}
        <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-10 overflow-hidden">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Built for Safety</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                ),
                bg: "bg-emerald-100",
                title: "Verified Mentors",
                desc: "Every mentor goes through a verification process before connecting with students. We check credentials, review backgrounds, and approve manually.",
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                ),
                bg: "bg-blue-100",
                title: "Content Moderation",
                desc: "All messages are monitored. Inappropriate content is flagged and reviewed by our admin team within 24 hours. Users can report any concern at any time.",
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                ),
                bg: "bg-amber-100",
                title: "Parental Consent",
                desc: "Students under 18 require parental consent to use the platform. We take the safety of young users extremely seriously.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-10 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Ready to get matched?</h3>
          <p className="text-emerald-100 mb-6">Create your profile in under 5 minutes and start connecting with career mentors today.</p>
          <a href="/signup" className="inline-block bg-white text-emerald-700 font-bold px-8 py-3 rounded-full hover:bg-emerald-50 transition-colors">
            Sign Up Free
          </a>
        </div>
      </div>
    </Layout>
  );
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="text-gray-600 space-y-2">{children}</div>
    </div>
  );
}

export { staticPages };
