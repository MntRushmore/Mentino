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

// Shared article layout for About pages: one column, news style.
function ArticleShell({ kicker, title, dek, byline, image, caption, children }: {
  kicker: string; title: string; dek: string; byline: string; image?: { src: string; alt: string }; caption?: string; children: React.ReactNode;
}) {
  return (
    <article className="max-w-2xl mx-auto">
      <p className="t-eyebrow mb-4">{kicker}</p>
      <h1 className="font-serif text-4xl sm:text-5xl text-gray-900">{title}</h1>
      <p className="text-xl text-gray-600 mt-4">{dek}</p>
      <p className="text-sm text-gray-600 mt-6 pb-6 border-b border-gray-200">{byline}</p>
      {image && (
        <figure className="mt-8 -mx-4 sm:mx-0">
          <img src={image.src} alt={image.alt} className="w-full aspect-[3/2] object-cover sm:rounded-xl" />
          {caption && <figcaption className="text-sm text-gray-600 mt-2 px-4 sm:px-0">{caption}</figcaption>}
        </figure>
      )}
      <div className="article-body mt-8">{children}</div>
      <style dangerouslySetInnerHTML={{ __html: `
        .article-body p { font-size: 18px; line-height: 32px; color: var(--ink); margin-bottom: 24px; }
        .article-body h2 { font-family: "Newsreader", Georgia, serif; font-weight: 400 !important; font-size: 28px; line-height: 36px; color: var(--ink); margin: 48px 0 16px; }
        .article-body a { text-decoration: underline; text-underline-offset: 4px; }
        .article-body blockquote { border-left: 2px solid var(--forest); padding-left: 24px; margin: 40px 0; font-family: "Newsreader", Georgia, serif; font-size: 26px; line-height: 36px; color: var(--ink); }
      ` }} />
    </article>
  );
}

function PersonRow({ img, name, role, children }: { img: string; name: string; role: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 mb-8">
      <img src={img} alt={name} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
      <div>
        <p className="text-base font-medium text-gray-900" style={{ marginBottom: 0 }}>{name}</p>
        <p className="t-meta" style={{ marginBottom: 8 }}>{role}</p>
        <p style={{ fontSize: 16, lineHeight: "26px", marginBottom: 0 }}>{children}</p>
      </div>
    </div>
  );
}

// GET /about
staticPages.get("/about", optionalAuth, (c) => {
  const user = c.get("user");
  return html(
    <Layout title="About Mentino" user={user} currentPath="/about">
      <ArticleShell
        kicker="About Mentino"
        title="Mentorship shouldn't depend on who you know."
        dek="Every student deserves a shot at their dream career, not just the ones whose parents happened to know the right people."
        byline="Mentino · Bay Area, California"
        image={{ src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1400&q=80", alt: "People working together around a table" }}
      >
        <h2>Our mission</h2>
        <p>
          Some students have a parent in the field they want to enter. An uncle who is a lawyer. A family friend who runs a startup. They get career advice over dinner without even asking for it. Everyone else has to figure things out alone, or not at all.
        </p>
        <p>
          Mentino exists to close that gap. It is where students who don't have those connections can find a real person who is already doing the work and just ask them.
        </p>

        <h2>How it works for students and mentors</h2>
        <p>
          <strong>Students</strong> sign up, share what they are interested in and where they want to go, and get matched with mentors who have actually been there. They can also research any career in <a href="/resources">Resources</a> and take free self-paced courses in <a href="/tracks">Career Tracks</a>.
        </p>
        <p>
          <strong>Mentors</strong> sign up, go through our verification process, and connect with students who genuinely want to hear from someone like them. A few conversations is all it takes.
        </p>

        <h2>What we believe</h2>
        <p>
          <strong>Accessibility.</strong> Free for students, full stop. No premium tier, no waitlist, no paywall. <strong>Safety.</strong> Every mentor is manually reviewed before going live, and students under 18 need parental consent. <strong>Honesty.</strong> We match you with people who have done the thing, not coaches who have read about it. <strong>Impact.</strong> One conversation can change how you see your future.
        </p>

        <h2>Contact</h2>
        <p>
          Questions, feedback, or want to get involved? Email <a href="mailto:hello@mentino.org">hello@mentino.org</a>. You can also read <a href="/founder">how Mentino started</a>.
        </p>
      </ArticleShell>
    </Layout>
  );
});

// GET /founder: About Us (the people behind Mentino)
staticPages.get("/founder", optionalAuth, (c) => {
  const user = c.get("user");
  return html(
    <Layout title="About Us" user={user} currentPath="/founder">
      <ArticleShell
        kicker="About Us"
        title="Why a Bay Area student built a free mentorship platform"
        dek="Mentino connects students with verified professionals at no cost. Here is how it started, and the people who run it."
        byline="By the Mentino team · Bay Area, California"
        image={{ src: "/images/founder.jpg", alt: "Ethan Branzuela, founder of Mentino" }}
        caption="Ethan Branzuela, founder and CEO of Mentino, at Serra Track & Field."
      >
        <p>
          Ethan Branzuela shoots sports photography for professional and collegiate athletes. When he was trying to get better, he sent cold messages to photographers he followed online. A few responded, and those conversations taught him more in a few weeks than years of tutorials ever did.
        </p>
        <p>
          "That experience made something obvious," he said. "One real conversation with someone who has already done the thing is worth more than any amount of research. I kept asking myself why this wasn't easier for every student."
        </p>
        <p>
          He started seeing the same pattern everywhere. Athletes who made it had coaches. Doctors who made it had mentors. Lawyers, engineers and founders almost all had someone older who showed them how things actually worked. Not from a book, but from real experience. That is the thing you can't Google.
        </p>

        <h2>The idea</h2>
        <p>
          So he built Mentino: a free platform where any student can find a verified professional in their field and just talk to them. No connections required. No luck needed.
        </p>
        <blockquote>
          "One day, a student should be able to click a button and instantly connect with the right mentor for their dream career."
        </blockquote>
        <p>
          If you want to become a CEO, you should be able to speak to one. If you want to become a doctor, you should be able to learn from one. If you want to work in sports, law, tech or science, you should have direct access to people already there.
        </p>
        <p>
          Ethan runs the platform while still in high school. His photography work is at <a href="https://ebonthecam.mypixieset.com/" target="_blank" rel="noopener noreferrer">ebonthecam.mypixieset.com</a>.
        </p>

        <h2>The team</h2>
        <PersonRow img="/images/founder.jpg" name="Ethan Branzuela" role="Founder and Chief Executive Officer">
          Ethan founded Mentino to give every student access to real mentors in their field without needing the right connections. He builds and runs the platform.
        </PersonRow>
        <PersonRow img="/images/zachary-jasmer.jpg" name="Zachary Jasmer" role="Chief Operating Officer">
          Zachary oversees day-to-day operations and helps drive the platform's growth, bringing strategic focus and operational discipline to the team.
        </PersonRow>

        <h2>Advisors</h2>
        <PersonRow img="/images/advisor-anthony.jpg" name="Anthony Branzuela" role="Co-Advisor">
          Anthony is an automotive industry leader with over 30 years of experience in dealership management, sales strategy and business operations. He has led luxury and mainstream brands including Porsche, Audi, Lamborghini and Ford. He advises Mentino on entrepreneurship, business strategy, customer experience and partnerships that connect students with career opportunities.
        </PersonRow>
        <PersonRow img="/images/advisor-joanne.jpg" name="Joanne Branzuela" role="Co-Advisor">
          Joanne is a healthcare leader and registered nurse with expertise in nursing leadership, program development and operational excellence. With a background in operating room and ambulatory care management, she has led interdisciplinary teams and quality improvement work. She advises Mentino on leadership, strategic planning and building experiences that help students explore their future careers.
        </PersonRow>

        <h2>Get involved</h2>
        <p>
          If you are a student trying to figure out your path, <a href="/signup?role=student">sign up</a>. If you have already figured something out and want to share it, <a href="/signup?role=mentor">become a mentor</a>. Questions go to <a href="mailto:hello@mentino.org">hello@mentino.org</a>.
        </p>
      </ArticleShell>
    </Layout>
  );
});

// GET /how-it-works
const STEPS = [
  { title: "Create your profile", body: "Pick Student or Mentor. Students share career interests, goals, schedule and how they like to learn. Mentors share their job, experience and what they can help with. It takes about 5 minutes." },
  { title: "Get matched", body: "Mentino ranks mentors by how well they fit your career field, your goals, your schedule and your learning style. You see the best fits first, with real bios, not just job titles." },
  { title: "Send a request", body: "Pick a mentor and send a short intro with one click. Mentors accept when they think they can help. No cold emails and no awkwardness either way." },
  { title: "Talk and learn", body: "Once matched, message your mentor, schedule video sessions, and leave feedback after. Keep going for as long as it is useful." },
];

const MATCH_WEIGHTS = [
  { label: "Career field", pct: 35 },
  { label: "Topics and goals", pct: 25 },
  { label: "Schedule overlap", pct: 20 },
  { label: "Personality and learning style", pct: 15 },
  { label: "Mentor availability", pct: 5 },
];

const RESEARCH = [
  { stat: "5x", label: "more likely to be promoted with a mentor" },
  { stat: "55%", label: "more likely to enroll in college" },
  { stat: "130%", label: "more likely to hold leadership positions" },
  { stat: "23%", label: "more job offers before graduation" },
];

const QUESTIONS = [
  { q: "What does a typical day look like for you?", why: "Replaces assumptions with what the job is really like." },
  { q: "What do you wish you had known when you started?", why: "Years of experience in a few minutes." },
  { q: "How did you get to where you are, step by step?", why: "The real path, not the polished version." },
  { q: "What skills matter most in your field right now?", why: "Tells you what to work on first." },
  { q: "If you were me, what would you do next?", why: "Advice you can't get anywhere else." },
];

staticPages.get("/how-it-works", optionalAuth, (c) => {
  const user = c.get("user");
  return html(
    <Layout title="How It Works" description="How Mentino works: create a profile, get matched with a verified professional, and start talking. Plus free career Resources and Career Tracks." user={user} currentPath="/how-it-works">
      <div className="max-w-5xl mx-auto">
        <header className="max-w-2xl">
          <p className="t-eyebrow mb-4">How It Works</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-gray-900">Sign up. Get matched. Actually talk to someone.</h1>
          <p className="text-lg text-gray-600 mt-4">Everything a student needs to go from curious to talking with a professional, in four steps.</p>
        </header>

        {/* Steps: text beside one photo */}
        <section className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <ol className="border-t border-gray-200">
            {STEPS.map((step, i) => (
              <li key={step.title} className="py-6 border-b border-gray-200 flex gap-4">
                <span className="w-8 h-8 rounded-full bg-forest text-white text-sm font-medium flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <div>
                  <h2 className="text-lg text-gray-900">{step.title}</h2>
                  <p className="text-gray-600 mt-1">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <figure className="lg:sticky lg:top-24">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80" alt="Students working together at a table" className="w-full aspect-[4/5] object-cover rounded-xl" />
          </figure>
        </section>

        {/* More ways to learn */}
        <section className="mt-24">
          <h2 className="font-serif text-3xl text-gray-900">More ways to learn, while you wait for a match</h2>
          <p className="text-gray-600 mt-2 max-w-2xl">Two free tools for every student, no mentor needed.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <a href="/resources" className="card card-interactive overflow-hidden block">
              <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80" alt="" className="w-full aspect-[16/9] object-cover" />
              <div className="p-6">
                <h3 className="text-xl text-gray-900">Resources</h3>
                <p className="text-gray-600 mt-2">Search any career and get videos, YouTube channels, books, articles, mentors on Mentino, and the next steps to take in high school or college.</p>
                <span className="btn btn-secondary mt-4">Search a career</span>
              </div>
            </a>
            <a href="/tracks" className="card card-interactive overflow-hidden block">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80" alt="" className="w-full aspect-[16/9] object-cover" />
              <div className="p-6">
                <h3 className="text-xl text-gray-900">Career Tracks</h3>
                <p className="text-gray-600 mt-2">Free self-paced courses for one career, 4 to 6 weeks long. Each week has lessons, your own notes, an assignment and a short quiz. Finish to earn a certificate.</p>
                <span className="btn btn-secondary mt-4">Browse tracks</span>
              </div>
            </a>
          </div>
        </section>

        {/* Matching */}
        <section className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <h2 className="font-serif text-3xl text-gray-900">How matching works</h2>
            <p className="text-gray-600 mt-4">
              Every mentor gets a score for every student. The biggest factor is whether they work in the field you picked. Next come your goals and topics, then whether your schedules overlap, since you need to actually meet. Mentors who have room for more students rank a little higher.
            </p>
          </div>
          <ul className="flex flex-col gap-4 justify-center">
            {MATCH_WEIGHTS.map((w) => (
              <li key={w.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-900">{w.label}</span>
                  <span className="text-gray-600 tabular-nums">{w.pct}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-forest rounded-full" style={{ width: `${w.pct * 2}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Prepare */}
        <section className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <h2 className="font-serif text-3xl text-gray-900">Bring 3 to 5 questions to every session</h2>
            <p className="text-gray-600 mt-4">
              Students who prepare get the most out of Mentino. Specific questions get specific answers. You'll be asked to confirm you have questions ready before your first session.
            </p>
          </div>
          <ol className="border-t border-gray-200">
            {QUESTIONS.map((item) => (
              <li key={item.q} className="py-4 border-b border-gray-200">
                <p className="text-gray-900">"{item.q}"</p>
                <p className="text-sm text-gray-600 mt-1">{item.why}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Research */}
        <section className="mt-24 bg-sand rounded-xl p-6 sm:p-12">
          <h2 className="font-serif text-3xl text-gray-900">Why mentorship works</h2>
          <p className="text-gray-700 mt-2 max-w-2xl">Studies keep finding the same thing: people with mentors do better.</p>
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            {RESEARCH.map((r) => (
              <div key={r.label}>
                <dt className="sr-only">{r.label}</dt>
                <dd className="text-4xl text-gray-900 tabular-nums">{r.stat}</dd>
                <dd className="text-sm text-gray-700 mt-2">{r.label}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-gray-700 mt-8">Sources: MENTOR, "The Mentoring Effect" (2014); NACE; Gartner.</p>
        </section>

        {/* Safety */}
        <section className="mt-24">
          <h2 className="font-serif text-3xl text-gray-900">Built for safety</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {[
              { title: "Verified mentors", desc: "Every mentor is reviewed and approved by hand before they can connect with anyone." },
              { title: "Content moderation", desc: "Messages are monitored and flagged content is reviewed quickly. You can report anything that feels off." },
              { title: "Parental consent", desc: "Students under 18 need parental consent to join. This is not optional." },
            ].map((item) => (
              <div key={item.title} className="border-t-2 pt-4" style={{ borderColor: "var(--forest)" }}>
                <h3 className="text-lg text-gray-900">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24 bg-sage rounded-xl p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl text-gray-900">Start the conversation.</h2>
            <p className="text-gray-700 mt-2">Set up your profile in 5 minutes. It is free.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <a href="/signup?role=student" className="btn btn-primary btn-lg">I'm a Student</a>
            <a href="/signup?role=mentor" className="btn btn-secondary btn-lg">I'm a Mentor</a>
          </div>
        </section>
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

// GET /terms
staticPages.get("/terms", optionalAuth, (c) => {
  const user = c.get("user");
  return html(
    <Layout title="Terms of Service" user={user} currentPath="/terms">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 pb-6 border-b border-gray-200">
          <p className="t-eyebrow mb-4">Legal</p>
          <h1 className="font-serif text-4xl text-gray-900">Terms of Service</h1>
          <p className="text-sm text-gray-600 mt-2">Last updated: March 2026 · Effective immediately upon account creation</p>
        </header>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
          <p className="text-amber-900 text-sm font-medium">
            <strong>Please read these terms carefully.</strong> By creating an account or using Mentino, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.
          </p>
        </div>

        <div className="space-y-8 bg-white rounded-2xl border border-gray-100 p-8">
          <Section title="1. About Mentino">
            <p>Mentino ("we," "us," or "the platform") is a free mentorship platform that connects students with verified working professionals. Mentino is operated by Ethan Branzuela as an independent project. We are not a staffing agency, school, or licensed counseling service.</p>
          </Section>

          <Section title="2. Eligibility">
            <p>You must be at least 10 years old to use Mentino. Students under 18 must have verifiable parental or guardian consent, which is collected during registration. By registering, you confirm that all information you provide is truthful and accurate.</p>
          </Section>

          <Section title="3. User Accounts">
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree not to share your login, impersonate another person, or create multiple accounts. Mentino reserves the right to suspend or terminate accounts that violate these terms.</p>
          </Section>

          <Section title="4. Use of the Platform">
            <p>Mentino is intended solely for career mentorship and educational guidance. You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Use the platform for solicitation, advertising, or commercial gain</li>
              <li>Share inappropriate, harmful, or illegal content</li>
              <li>Harass, bully, or threaten any user</li>
              <li>Collect or misuse other users' personal information</li>
              <li>Attempt to bypass safety or moderation systems</li>
            </ul>
          </Section>

          <Section title="5. Liability Disclaimer: User Interactions">
            <p className="font-semibold text-gray-800">Mentino is a platform that facilitates connections between users. We do not guarantee the quality, accuracy, or outcome of any mentorship relationship.</p>
            <p className="mt-2">All interactions between students and mentors are voluntary and occur at each user's own risk. Mentino is not responsible for:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Advice given by mentors (which is not professional, legal, or medical counsel)</li>
              <li>Unsuccessful, discouraging, or negative experiences with mentors</li>
              <li>Missed sessions, unresponsive mentors, or dissolved match relationships</li>
              <li>Any direct, indirect, or consequential harm arising from platform use</li>
            </ul>
            <p className="mt-2 text-sm text-gray-500 italic">Mentors on Mentino are volunteer professionals, not Mentino employees. Their conduct is their own responsibility.</p>
          </Section>

          <Section title="6. Minors: Additional Terms">
            <p className="font-semibold text-gray-800">If you are under 18, the following additional terms apply to you.</p>
            <p className="mt-2">Your use of Mentino is entirely at your own risk and the risk of your parent or guardian who consented on your behalf. Mentino implements safety features including mentor verification, content moderation, and parental consent requirements, however:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Mentino does not guarantee the safety or appropriateness of all mentor interactions</li>
              <li>Parents and guardians are encouraged to monitor their child's activity on the platform</li>
              <li>Any adverse experience, emotional impact, or harm arising from platform use is not the liability of Mentino</li>
              <li>Mentino is not a substitute for professional counseling, academic advising, or parental guidance</li>
            </ul>
          </Section>

          <Section title="7. Content Moderation & Reports">
            <p>Mentino uses automated moderation and human review to keep the platform safe. Users may report inappropriate behavior at any time. Reported users are subject to temporary or permanent suspension depending on the severity and frequency of violations.</p>
            <p className="mt-2">Submitting a false report is a violation of these terms and may result in action against your account.</p>
          </Section>

          <Section title="8. Mentor Verification">
            <p>Mentors are required to complete a verification process before being approved. However, Mentino does not independently verify all credentials claimed by mentors. Mentor information is self-reported. Use your judgment and report any concerns to our team.</p>
          </Section>

          <Section title="9. Termination">
            <p>We reserve the right to suspend or permanently ban any account at any time for any violation of these terms, without prior notice. You may also delete your account at any time by contacting us at <a href="mailto:hello@mentino.org" className="text-indigo-600 hover:underline">hello@mentino.org</a>.</p>
          </Section>

          <Section title="10. Changes to Terms">
            <p>We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the revised terms. We will notify users of significant changes via email when possible.</p>
          </Section>

          <Section title="11. Contact">
            <p>For questions about these terms, contact us at <a href="mailto:hello@mentino.org" className="text-indigo-600 hover:underline">hello@mentino.org</a>.</p>
          </Section>
        </div>

        <div className="text-center mt-8">
          <a href="/privacy" className="text-indigo-600 hover:underline font-medium text-sm">Read our Privacy Policy →</a>
        </div>
      </div>
    </Layout>
  );
});

// GET /privacy
staticPages.get("/privacy", optionalAuth, (c) => {
  const user = c.get("user");
  return html(
    <Layout title="Privacy Policy" user={user} currentPath="/privacy">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 pb-6 border-b border-gray-200">
          <p className="t-eyebrow mb-4">Legal</p>
          <h1 className="font-serif text-4xl text-gray-900">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mt-2">Last updated: March 2026</p>
        </header>

        <div className="space-y-8 bg-white rounded-2xl border border-gray-100 p-8">
          <Section title="1. What We Collect">
            <p>When you use Mentino, we collect:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>Account information:</strong> name, email, password (hashed), role</li>
              <li><strong>Profile data:</strong> school, grade, career interests, bio, job title, availability</li>
              <li><strong>Activity data:</strong> messages, session records, match history, reports</li>
              <li><strong>For minors:</strong> parental consent and parent email address</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Data">
            <p>We use your data solely to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Match students with appropriate mentors</li>
              <li>Enable messaging and session scheduling</li>
              <li>Moderate content and enforce safety policies</li>
              <li>Improve the platform</li>
            </ul>
            <p className="mt-2">We do not sell your data, use it for advertising, or share it with third parties except as required by law.</p>
          </Section>

          <Section title="3. Data Storage">
            <p>Your data is stored in Supabase (PostgreSQL), a cloud database provider. Passwords are stored as bcrypt hashes, never in plain text. All authentication uses secure, HTTP-only cookies.</p>
          </Section>

          <Section title="4. Minors' Privacy">
            <p>We take the privacy of users under 18 seriously. We collect only the minimum data necessary. Parent emails collected for consent are used solely for that purpose. We do not share minors' data with any third party.</p>
          </Section>

          <Section title="5. Your Rights">
            <p>You may request deletion of your account and associated data at any time by emailing <a href="mailto:hello@mentino.org" className="text-indigo-600 hover:underline">hello@mentino.org</a>. We will process deletion requests within 30 days.</p>
          </Section>

          <Section title="6. Cookies">
            <p>We use a single secure HTTP-only cookie for authentication. We do not use tracking cookies, analytics cookies, or third-party cookies.</p>
          </Section>

          <Section title="7. Contact">
            <p>Privacy questions: <a href="mailto:hello@mentino.org" className="text-indigo-600 hover:underline">hello@mentino.org</a></p>
          </Section>
        </div>

        <div className="text-center mt-8">
          <a href="/terms" className="text-indigo-600 hover:underline font-medium text-sm">← Back to Terms of Service</a>
        </div>
      </div>
    </Layout>
  );
});

export { staticPages };
