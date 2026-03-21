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
              Mentino is committed to providing a safe, supportive, and inclusive environment for all
              students and mentors. By using our platform, you agree to abide by the following guidelines.
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
                <li>Keep all conversations appropriate and relevant to mentorship goals.</li>
                <li>Do not share personal contact information (phone number, home address) outside the platform until both parties are comfortable.</li>
                <li>Use constructive language. Avoid criticism that isn't actionable or helpful.</li>
              </ul>
            </Section>

            <Section title="Safety & Privacy">
              <ul>
                <li>Keep mentorship conversations confidential. Do not share details of your mentee's or mentor's personal life without permission.</li>
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
                <li>Attempting to circumvent our verification process</li>
                <li>Any form of spam, scam, or commercial solicitation</li>
              </ul>
            </Section>

            <Section title="Reporting Violations">
              <p>
                If you experience or witness a violation of this Code of Conduct, please report it
                immediately through the platform's reporting feature. All reports are reviewed by our
                admin team within 24 hours and handled confidentially.
              </p>
            </Section>

            <Section title="Mentor Responsibilities">
              <ul>
                <li>Provide honest, constructive guidance based on your genuine experience.</li>
                <li>Be transparent about your background and qualifications.</li>
                <li>Respect your mentee's time and goals. Focus sessions on their needs.</li>
                <li>If you can no longer mentor, communicate this promptly so the student can be re-matched.</li>
              </ul>
            </Section>

            <Section title="Student Responsibilities">
              <ul>
                <li>Come prepared to sessions with questions or topics you'd like to discuss.</li>
                <li>Be respectful of your mentor's volunteer time.</li>
                <li>Provide honest feedback to help us improve the matching process.</li>
                <li>Follow through on action items discussed during sessions.</li>
              </ul>
            </Section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-400">
            Last updated: March 2026
          </div>
        </div>
      </div>
    </Layout>
  );
});

// GET /about
staticPages.get("/about", optionalAuth, (c) => {
  const user = c.get("user");

  return html(
    <Layout title="About" user={user}>
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">About Mentino</span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mentorship shouldn't depend on who you know.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Mentino is a free platform that connects students with verified professionals for personalized career guidance — regardless of background or network.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Too many talented students lack access to professional networks and career guidance. Students from well-connected families get career advice over dinner. Everyone else has to figure it out alone. Mentino bridges this gap by creating a safe, structured platform where industry professionals can volunteer their time to help the next generation succeed.
          </p>
        </div>

        {/* How it works for students and mentors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">For Students</h3>
            <p className="text-gray-600">
              Create a profile, tell us about your career interests and goals, and our matching system will connect you with mentors who align with your aspirations. Communicate through messaging and schedule sessions for in-depth guidance.
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">For Mentors</h3>
            <p className="text-gray-600">
              Sign up, complete our verification process, and start making an impact. Share your experience, review resumes, conduct mock interviews, or help students understand what your career path looks like day-to-day.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <h3 className="font-bold text-blue-800 text-lg mb-1">Accessibility</h3>
              <p className="text-blue-700 text-sm">Free for all students. No premium tiers, no paywalls. Every student deserves opportunity.</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              <h3 className="font-bold text-emerald-800 text-lg mb-1">Safety</h3>
              <p className="text-emerald-700 text-sm">All mentors are verified. Content is moderated. Students under 18 require parental consent.</p>
            </div>
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-5">
              <h3 className="font-bold text-violet-800 text-lg mb-1">Authenticity</h3>
              <p className="text-violet-700 text-sm">Real mentors with real experience. No fluff, no filler — genuine guidance from people who've done it.</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <h3 className="font-bold text-amber-800 text-lg mb-1">Impact</h3>
              <p className="text-amber-700 text-sm">Conversations that create long-term growth. Sometimes one mentor is all it takes to change a life.</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Get in Touch</h2>
          <p className="text-gray-600">
            Have questions, feedback, or want to partner with us? Reach out at{" "}
            <a href="mailto:hello@mentino.org" className="text-blue-600 hover:underline font-medium">
              hello@mentino.org
            </a>
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
    <Layout title="About the Founder" user={user}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-10 text-center text-white mb-10">
          <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-slate-600 flex items-center justify-center text-5xl font-bold text-white border-4 border-slate-500 overflow-hidden">
            EB
          </div>
          <h1 className="text-3xl font-bold mb-2">Ethan B.</h1>
          <p className="text-slate-300 text-lg">Founder of Mentino</p>
          <div className="flex justify-center gap-3 mt-4">
            <span className="bg-slate-700 text-slate-300 text-sm px-3 py-1 rounded-full">15 years old</span>
            <span className="bg-slate-700 text-slate-300 text-sm px-3 py-1 rounded-full">Bay Area</span>
            <span className="bg-slate-700 text-slate-300 text-sm px-3 py-1 rounded-full">Sports Photographer</span>
          </div>
        </div>

        {/* Story */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Story</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              My name is <strong>Ethan B.</strong>, and I'm a 15-year-old student in the Bay Area. I'm also a freelance sports photographer who has worked with professional, collegiate, and high school athletes throughout the region.
            </p>
            <p>
              As a young photographer trying to grow in a competitive field, I learned something early: <strong>talent isn't enough</strong>. What truly accelerated my growth was reaching out to photographers I admired — asking questions, studying their work, and learning directly from people with more experience than me. Having someone older, wiser, and further ahead guide me made an enormous difference.
            </p>
          </div>
        </div>

        {/* Realization callout */}
        <div className="bg-blue-600 rounded-2xl p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4">That realization stuck with me.</h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            I began noticing the same pattern everywhere. Whether someone wants to become a professional athlete, a doctor, a lawyer, an entrepreneur, or a scientist — no one succeeds alone. Every successful person had guidance. Every successful person had someone who helped them navigate the unknown.
          </p>
        </div>

        {/* School programs and why Mentino */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Even at my own school, programs like "Big Brother, Little Brother" show how powerful mentorship can be during important transitions. When freshmen have upperclassmen to guide them, the adjustment becomes smoother, more confident, and more successful.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-6">
              <h3 className="text-xl font-bold text-amber-900 mb-2">That's why I created Mentino.</h3>
              <p className="text-amber-800">
                One day, a student should be able to click a button and instantly connect with the right mentor for their dream career.
              </p>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>If you want to become a <strong>CEO</strong>, you should speak to one.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>If you want to become a <strong>doctor</strong>, you should learn from one.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>If you want to work in <strong>sports, law, tech, or science</strong> — you should have direct access to someone who has already done it.</span>
              </li>
            </ul>
            <p className="text-lg font-medium text-gray-800 mt-4">
              Mentorship shouldn't depend on who you know. It should depend on who you aspire to become.
            </p>
          </div>
        </div>

        {/* Challenges */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Challenges</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Starting Mentino at 15 hasn't been easy. One of the biggest challenges has been reaching a wider audience. There are only so many people you can message personally, and building trust at a young age requires persistence and proof.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            But every meaningful idea starts small. And every large movement once began with a single conversation.
          </p>
          <p className="text-gray-800 font-medium">
            I believe that if I focus on impact first, growth will follow.
          </p>
        </div>

        {/* Why Trust */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Trust Mentino?</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Mentino isn't just an idea — it's built from real experience. I've personally seen how mentorship accelerates growth. I've experienced it in photography. I've seen it in sports. I've seen it in school programs. And I've seen how one conversation can change someone's confidence and direction.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-center">
              <div className="text-3xl mb-2">🌍</div>
              <h3 className="font-bold text-blue-800 text-lg mb-1">Access</h3>
              <p className="text-blue-700 text-sm">Every student deserves opportunity</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 text-center">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-bold text-emerald-800 text-lg mb-1">Authenticity</h3>
              <p className="text-emerald-700 text-sm">Real mentors with real experience</p>
            </div>
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-5 text-center">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-bold text-violet-800 text-lg mb-1">Impact</h3>
              <p className="text-violet-700 text-sm">Conversations that create long-term growth</p>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed">
            This isn't about networking for status. It's about building bridges through conversation. And sometimes, <strong>one mentor is all it takes to change a life</strong>.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Join the Mission</h3>
          <p className="text-blue-100 mb-6">Whether you're a student or a professional, there's a place for you at Mentino.</p>
          <div className="flex justify-center gap-4">
            <a href="/signup" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              Sign Up as Student
            </a>
            <a href="/signup" className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Become a Mentor
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
});

// GET /how-it-works — Matching system & how to use Mentino
staticPages.get("/how-it-works", optionalAuth, (c) => {
  const user = c.get("user");

  return html(
    <Layout title="How It Works" user={user}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">How It Works</span>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            From Sign-Up to Mentorship in Minutes
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Mentino makes it easy to find the right mentor for your career goals. Here's exactly how the process works.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-12">
          <StepCard
            number={1}
            color="blue"
            title="Create Your Profile"
            description="Sign up and tell us about yourself. Students share their career interests, learning goals, availability, and personality traits. Mentors share their professional background, expertise, and topics they can help with."
            details={[
              "Choose your role: Student or Mentor",
              "Fill out a simple multi-step registration",
              "Students: career interests, goals, schedule preferences",
              "Mentors: job title, experience, topics, verification",
            ]}
          />

          <StepCard
            number={2}
            color="emerald"
            title="Get Smart-Matched"
            description="Our matching system analyzes multiple factors to find the best mentor-student pairs. It's not random — it's thoughtful, data-driven pairing designed to maximize the value of every conversation."
            details={[
              "Career field alignment (35% of match score)",
              "Topic relevance to your goals (25%)",
              "Schedule overlap so you can actually meet (20%)",
              "Personality and learning style compatibility (15%)",
              "Mentor availability and capacity (5%)",
            ]}
          />

          <StepCard
            number={3}
            color="violet"
            title="Request a Match"
            description="Browse your top matches, read mentor profiles, and request to connect with the ones that resonate with you. Mentors review requests and accept the students they feel they can help most."
            details={[
              "See your top 10 matches ranked by compatibility",
              "Read detailed mentor bios and expertise areas",
              "Send a match request with one click",
              "Mentors accept or pass — no pressure on either side",
            ]}
          />

          <StepCard
            number={4}
            color="amber"
            title="Connect & Learn"
            description="Once matched, start messaging your mentor directly through Mentino. Schedule video sessions for deeper conversations. Get guidance on careers, college, interviews, and more."
            details={[
              "Direct messaging built into the platform",
              "Schedule video sessions at times that work for both",
              "Rate sessions and provide feedback to improve matches",
              "Stay connected as long as the mentorship is valuable",
            ]}
          />
        </div>

        {/* Matching System Deep Dive */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Inside the Matching System
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Our matching algorithm considers five key factors to pair students with the most compatible mentors. Here's how each factor is weighted:
          </p>

          <div className="space-y-4">
            <MatchFactor
              label="Career Field Overlap"
              percent={35}
              color="blue"
              description="Does the mentor work in a field the student is interested in? This is the strongest signal."
            />
            <MatchFactor
              label="Topic Relevance"
              percent={25}
              color="emerald"
              description="Do the mentor's topics match what the student wants to learn about (interviews, college, entrepreneurship, etc.)?"
            />
            <MatchFactor
              label="Availability Overlap"
              percent={20}
              color="violet"
              description="Can they actually meet? We compare day-by-day time slot preferences to find scheduling matches."
            />
            <MatchFactor
              label="Personality Compatibility"
              percent={15}
              color="amber"
              description="Learning styles and mentoring styles should complement each other. Visual learners pair well with patient, structured mentors."
            />
            <MatchFactor
              label="Mentor Capacity"
              percent={5}
              color="rose"
              description="Mentors with more available spots are slightly prioritized to ensure students get prompt responses."
            />
          </div>
        </div>

        {/* Safety */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Built for Safety</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Verified Mentors</h3>
              <p className="text-gray-500 text-sm">Every mentor goes through a verification process before they can connect with students.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Content Moderation</h3>
              <p className="text-gray-500 text-sm">All messages are monitored. Inappropriate content is flagged and reviewed by our team.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Parental Consent</h3>
              <p className="text-gray-500 text-sm">Students under 18 require parental consent to use the platform. Safety is our top priority.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Ready to get matched?</h3>
          <p className="text-emerald-100 mb-6">Create your profile in under 5 minutes and start connecting with mentors today.</p>
          <a href="/signup" className="inline-block bg-white text-emerald-600 font-semibold px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors">
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

function StepCard({
  number,
  color,
  title,
  description,
  details,
}: {
  number: number;
  color: string;
  title: string;
  description: string;
  details: string[];
}) {
  const bgColor = `bg-${color}-50`;
  const borderColor = `border-${color}-100`;
  const numberBg = `bg-${color}-600`;
  const detailDot = `bg-${color}-400`;

  return (
    <div className={`${bgColor} border ${borderColor} rounded-2xl p-6`}>
      <div className="flex items-start gap-4">
        <div className={`${numberBg} text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0`}>
          {number}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-3">{description}</p>
          <ul className="space-y-1.5">
            {details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className={`w-1.5 h-1.5 ${detailDot} rounded-full mt-1.5 flex-shrink-0`}></span>
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MatchFactor({
  label,
  percent,
  color,
  description,
}: {
  label: string;
  percent: number;
  color: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-16 text-right">
        <span className={`text-lg font-bold text-${color}-600`}>{percent}%</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h4 className="font-semibold text-gray-900">{label}</h4>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
          <div className={`bg-${color}-500 h-2 rounded-full`} style={{ width: `${percent}%` }}></div>
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export { staticPages };
