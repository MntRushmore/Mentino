import React from "react";

interface HomeProps {
  featuredMentors?: any[];
  stats?: { students: number; mentors: number; activeMatches: number };
}

export function Home({ featuredMentors = [], stats }: HomeProps) {
  const studentCount = stats?.students ?? 0;
  const mentorCount = stats?.mentors ?? 0;

  return (
    <div className="space-y-10 sm:space-y-16 pb-12">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative text-center py-14 sm:py-28 overflow-hidden rounded-2xl sm:rounded-3xl bg-indigo-950">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-700 rounded-full opacity-30 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-violet-700 rounded-full opacity-25 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-800 rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-5">
          {/* Origin hook — emotional grounding before the features */}
          <p className="text-indigo-300 text-sm sm:text-base font-medium mb-5 anim-fade-in max-w-xl mx-auto leading-relaxed">
            Most students don't know anyone in their dream field. Mentino changes that.
          </p>

          {/* Primary headline — the strongest line, front and center */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-5 leading-tight tracking-tight anim-fade-up">
            Get real advice from someone<br className="hidden sm:block" />
            <span className="text-indigo-300"> who's already there.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto anim-fade-up anim-d2">
            Mentino matches students with verified professionals — for free.
            No connection needed. No luck required. Just the right conversation at the right time.
          </p>

          {/* Split CTA — student vs mentor */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center anim-fade-up anim-d3">
            <a href="/signup?role=student"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-full text-base font-bold hover:bg-indigo-50 transition-all shadow-2xl hover:-translate-y-0.5 transform">
              I'm a Student
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a href="/signup?role=mentor"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/25 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-white/20 transition-all hover:-translate-y-0.5 transform">
              I'm a Mentor
            </a>
          </div>
          <p className="text-slate-400 text-sm mt-3 anim-fade-up anim-d3">Free to join. Takes 5 minutes.</p>

          {/* Trust badges */}
          <div className="flex flex-col sm:flex-row sm:justify-center gap-2 sm:gap-6 mt-8 anim-fade-up anim-d4">
            {[
              { text: "100% Free for Students" },
              { text: "Verified Professionals Only", tooltip: "Every mentor is reviewed by our team before going live" },
              { text: "Safe for Students Under 18" },
            ].map((t) => (
              <div key={t.text} className="flex items-center justify-center gap-1.5 text-slate-300 text-xs sm:text-sm" title={t.tooltip || ""}>
                <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t.text}
                {t.tooltip && (
                  <svg className="w-3 h-3 text-slate-500 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Early momentum — growing fast ───────────────────────────────── */}
      <section className="text-center">
        <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-3">Growing fast — be an early member</p>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
          {[
            { num: `${mentorCount}`, label: "Mentors across 40+ fields" },
            { num: `${studentCount}`, label: "Students already signed up" },
            { num: "100%", label: "Free — always" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-gray-900">{s.num}</div>
              <div className="text-sm text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Safety ──────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-10">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">Built for safety — especially if you're under 18</h2>
        <p className="text-gray-500 text-center text-sm mb-8 max-w-xl mx-auto">Mentino was designed from the ground up to be a safe place for students. Here's what that actually means.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              ),
              bg: "bg-emerald-100",
              title: "Verified Mentors",
              desc: "Every mentor is reviewed and approved before they can connect with anyone. We check credentials and backgrounds by hand — no automation shortcuts.",
            },
            {
              icon: (
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              ),
              bg: "bg-blue-100",
              title: "Content Moderation",
              desc: "Messages are monitored and flagged content is reviewed quickly. If something feels off, you can report it — and we take those seriously.",
            },
            {
              icon: (
                <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              ),
              bg: "bg-amber-100",
              title: "Parental Consent",
              desc: "Students under 18 need parental consent to join. This isn't optional — it's how we keep younger students safe.",
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
      </section>

      {/* ── Career fields ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Explore career fields</h2>
        <p className="text-gray-500 text-center mb-6 text-sm sm:text-base">Mentors across 40+ industries — find someone in your field.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {[
            { name: "Technology", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80", field: "Technology" },
            { name: "Medicine & Healthcare", img: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&q=80", field: "Medicine & Healthcare" },
            { name: "Law", img: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=500&q=80", field: "Law" },
            { name: "Business & Finance", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80", field: "Business" },
            { name: "Sports & Athletics", img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&q=80", field: "Sports & Athletics" },
            { name: "Arts & Design", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80", field: "Arts & Design" },
          ].map((field) => (
            <a key={field.name} href={`/signup?role=student&interest=${encodeURIComponent(field.field)}`}
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden h-28 sm:h-36 block">
              <img src={field.img} alt={field.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 text-white font-bold text-xs sm:text-sm">{field.name}</span>
            </a>
          ))}
        </div>
        <p className="text-center text-gray-400 text-xs sm:text-sm mt-3">+ Engineering, Psychology, Media, Gaming, and many more</p>
      </section>

      {/* ── For Mentors — distinct visual block ─────────────────────────── */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl sm:rounded-3xl p-5 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">For Mentors</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
              Give back — on your schedule.
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              You don't need to block off hours or commit to anything big. A few honest conversations can genuinely change a student's direction. Mentino makes it easy to share what you know with people who actually want to hear it.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                { icon: "🕐", text: "Fully flexible — mentor when you have time, pause when you don't" },
                { icon: "🎯", text: "We match you with students in your specific field, not random requests" },
                { icon: "⭐", text: "Build your reputation — students leave reviews on your public profile" },
                { icon: "🆓", text: "Free to join. No commissions, no fees, ever." },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <span className="text-gray-700 text-sm leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
            <a href="/signup?role=mentor"
              className="block sm:inline-block text-center bg-emerald-600 text-white px-7 py-3 rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-sm">
              Become a Mentor
            </a>
          </div>
          {/* Impact stats — with "16M" tied to a CTA */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm">
              <div className="text-3xl font-extrabold text-rose-600 mb-1">16M</div>
              <div className="text-gray-500 text-sm mb-3">US students currently without a mentor</div>
              <a href="/signup?role=student" className="text-rose-600 text-xs font-semibold hover:underline">
                Be one of the few who has one →
              </a>
            </div>
            <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
              <div className="text-3xl font-extrabold text-amber-600 mb-1">5×</div>
              <div className="text-gray-500 text-sm">
                More likely to be promoted with a mentor{" "}
                <span className="text-gray-400 text-xs">(LinkedIn Workplace Study, 2022)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured mentors ────────────────────────────────────────────── */}
      {featuredMentors.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">Meet some of our mentors</h2>
          <p className="text-gray-500 text-center mb-6 text-sm">Real professionals who signed up to help — not algorithms or bots.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {featuredMentors.map((m: any, i: number) => {
              const gradients = [
                "from-indigo-500 to-blue-500",
                "from-emerald-500 to-teal-500",
                "from-violet-500 to-purple-500",
                "from-amber-500 to-orange-500",
                "from-rose-500 to-pink-500",
                "from-cyan-500 to-sky-500",
              ];
              return (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    {m.accounts?.avatar_url ? (
                      <img src={m.accounts.avatar_url} alt={m.accounts?.first_name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className={`w-12 h-12 bg-gradient-to-br ${gradients[i % gradients.length]} rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
                        {m.accounts?.first_name?.[0]}{m.accounts?.last_name?.[0]}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{m.accounts?.first_name} {m.accounts?.last_name}</p>
                      <p className="text-xs text-gray-500 truncate">{m.job_title}{m.company ? ` · ${m.company}` : ""}</p>
                    </div>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">{m.career_field}</span>
                  {m.years_experience > 0 && (
                    <span className="ml-1.5 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{m.years_experience} yrs exp</span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-center mt-5">
            <a href="/signup" className="text-indigo-600 font-semibold hover:underline text-sm">
              Sign up to see all mentors and get matched →
            </a>
          </p>
        </section>
      )}

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Common questions</h2>
        <p className="text-gray-500 text-center mb-8 text-sm sm:text-base">Straight answers, no fluff.</p>
        <div className="space-y-3 max-w-3xl mx-auto" id="faq-list">
          {[
            {
              q: "Is Mentino actually free?",
              a: "Yes — free for students, free for mentors. No premium tiers, no subscriptions, no fees ever. We're a student-built platform focused on access, not profit."
            },
            {
              q: "How does the matching work?",
              a: "You fill out your profile — career interests, goals, schedule, and personality. Our algorithm finds mentors in your target fields who match your availability and style. You send them a short intro, they accept or decline. Simple."
            },
            {
              q: "Who are the mentors and how are they verified?",
              a: "Working professionals who signed up to give back. Before going live, each mentor is reviewed by our team — we check that their experience is real and that they've agreed to our Code of Conduct. You'll see their field, job title, and reviews from students they've worked with."
            },
            {
              q: "I'm in high school — is this for me?",
              a: "Yes, 100%. Mentino was literally built by a 15-year-old. High school students are exactly who this is for. If you're trying to figure out what career you want or what it actually looks like day-to-day, this is the place."
            },
            {
              q: "What does a mentorship session actually look like?",
              a: "It's a conversation — usually over video call or messages. You ask questions, the mentor shares their experience. There's no script. It could be about a day in their job, how to prepare for college, what skills matter, or just venting about not knowing what you want to do. It's real talk."
            },
            {
              q: "Can I message my mentor before scheduling a session?",
              a: "Once a mentor accepts your match request, you get a full messaging thread. You can ask anything before scheduling a formal session. Most students use this to break the ice first."
            },
            {
              q: "What if a mentor is rude or inappropriate?",
              a: "Report them. Every profile has a report button. We take reports seriously — first offense is a 24-hour ban, escalating from there. All mentors agreed to our Code of Conduct when they signed up."
            },
            {
              q: "I'm a professional — why should I become a mentor?",
              a: "Honestly? Because it matters. One conversation can change a student's direction entirely. It's flexible — you set your own availability and how many students you take on. And students leave reviews, so you build a real reputation on the platform."
            },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <button type="button" data-faq-btn={i}
                className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4 max-w-prose">{item.q}</span>
                <svg data-faq-icon={i} className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div data-faq-panel={i} className="hidden px-6 pb-5">
                <p className="text-gray-600 text-sm leading-relaxed max-w-prose">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
        <script dangerouslySetInnerHTML={{ __html: `
    document.querySelectorAll('[data-faq-btn]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var i = this.getAttribute('data-faq-btn');
        var panel = document.querySelector('[data-faq-panel="' + i + '"]');
        var icon = document.querySelector('[data-faq-icon="' + i + '"]');
        var isOpen = !panel.classList.contains('hidden');
        panel.classList.toggle('hidden', isOpen);
        if (icon) icon.style.transform = isOpen ? '' : 'rotate(180deg)';
      });
    });
  ` }} />
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────────────────── */}
      <section className="bg-indigo-950 rounded-2xl p-10 text-center text-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Ready to find your mentor?</h2>
        <p className="text-indigo-300 text-sm sm:text-base mb-8 max-w-md mx-auto">
          Set up a profile in 5 minutes and get matched with someone who's already in your dream career.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/signup?role=student"
            className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-8 py-3.5 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-md">
            I'm a Student — Get Matched
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a href="/signup?role=mentor"
            className="inline-flex items-center justify-center bg-white/10 border border-white/25 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/20 transition-colors">
            I'm a Mentor — Give Back
          </a>
        </div>
      </section>

    </div>
  );
}
