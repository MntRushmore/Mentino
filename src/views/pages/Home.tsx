import React from "react";

interface HomeProps {
  featuredMentors?: any[];
}

export function Home({ featuredMentors = [] }: HomeProps) {
  return (
    <div className="space-y-16 pb-12">

      {/* Hero */}
      <section className="relative text-center py-20 sm:py-28 overflow-hidden rounded-2xl sm:rounded-3xl bg-indigo-950">
        {/* Decorative background shapes — no competing imagery */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-700 rounded-full opacity-30 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-violet-700 rounded-full opacity-25 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-800 rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-5">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-indigo-200 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full mb-6 anim-fade-in">
            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
            Free mentorship for students
          </div>

          {/* Headline — pure white on very dark background = maximum contrast */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-5 leading-tight tracking-tight anim-fade-up">
            Connect with mentors<br className="hidden sm:block" />
            <span className="text-indigo-300"> in your dream career.</span>
          </h1>

          {/* Subtext — slightly muted but still very readable */}
          <p className="text-base sm:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto anim-fade-up anim-d2">
            Mentino matches you with verified professionals — for free.
            Get real advice from someone who's already where you want to be.
          </p>

          {/* CTA */}
          <div className="anim-fade-up anim-d3">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 sm:px-12 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-indigo-50 transition-all shadow-2xl hover:-translate-y-0.5 transform"
            >
              Get Started — It's Free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <p className="text-slate-400 text-sm mt-3">No credit card. No commitment. Takes 5 minutes.</p>
          </div>

          {/* Trust badges */}
          <div className="flex justify-center flex-wrap gap-4 sm:gap-6 mt-8 anim-fade-up anim-d4">
            {["100% Free for Students", "Verified Professionals Only", "Safe for Students Under 18"].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-slate-300 text-xs sm:text-sm">
                <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Mentors */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl sm:rounded-3xl p-6 sm:p-10 anim-fade-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div>
            <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">For Mentors</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
              Give back — on your schedule.
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed">
              You don't need to commit to anything big. A few conversations can genuinely change someone's direction. Mentino makes it easy to share what you know with students who actually want to hear it.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                { icon: "🕐", text: "Fully flexible — mentor when you have time, pause when you don't" },
                { icon: "🎯", text: "We match you with students in your specific field" },
                { icon: "⭐", text: "Build your reputation — students leave reviews on your profile" },
                { icon: "🆓", text: "Free to join. No commissions, no fees, ever." },
              ].map((item, i) => (
                <li key={i} className={`flex items-start gap-3 anim-slide-r anim-d${i + 1}`}>
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <span className="text-gray-700 text-sm leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
            <a href="/signup" className="inline-block bg-emerald-600 text-white px-7 py-3 rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-sm">
              Become a Mentor
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { num: "200+", label: "Mentors already signed up", border: "border-emerald-100", color: "text-emerald-600" },
              { num: "40+", label: "Career fields covered", border: "border-indigo-100", color: "text-indigo-600" },
              { num: "5×", label: "More promotions with a mentor", border: "border-amber-100", color: "text-amber-600" },
              { num: "16M", label: "US students without a mentor", border: "border-rose-100", color: "text-rose-600" },
            ].map((s, i) => (
              <div key={s.num} className={`bg-white rounded-2xl border ${s.border} p-4 sm:p-5 shadow-sm anim-fade-up anim-d${i + 1}`}>
                <div className={`text-2xl sm:text-3xl font-extrabold ${s.color} mb-1`}>{s.num}</div>
                <div className="text-gray-500 text-xs sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — 3 steps */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">How it works</h2>
        <p className="text-gray-500 mb-8 text-sm sm:text-base">Three steps to your first mentor session.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { num: "1", title: "Create your profile", desc: "Tell us your career interests and goals in under 5 minutes.", color: "bg-indigo-600" },
            { num: "2", title: "Get matched", desc: "Our algorithm finds mentors that fit your goals, schedule, and personality.", color: "bg-emerald-600" },
            { num: "3", title: "Start connecting", desc: "Message your mentor, schedule sessions, and get real career guidance.", color: "bg-violet-600" },
          ].map((step) => (
            <div key={step.num} className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm text-left">
              <div className={`${step.color} text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold mb-4`}>
                {step.num}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Career fields */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Explore career fields</h2>
        <p className="text-gray-500 text-center mb-6 text-sm sm:text-base">Mentors across 40+ industries, ready to guide you.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {[
            { name: "Technology", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80" },
            { name: "Medicine & Healthcare", img: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&q=80" },
            { name: "Law", img: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=500&q=80" },
            { name: "Business & Finance", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80" },
            { name: "Sports & Athletics", img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&q=80" },
            { name: "Arts & Design", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80" },
          ].map((field) => (
            <a key={field.name} href="/signup" className="group relative rounded-xl sm:rounded-2xl overflow-hidden h-28 sm:h-36 block">
              <img src={field.img} alt={field.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 text-white font-bold text-xs sm:text-sm">{field.name}</span>
            </a>
          ))}
        </div>
        <p className="text-center text-gray-400 text-xs sm:text-sm mt-3">+ Engineering, Psychology, Media, Gaming, and many more</p>
      </section>

      {/* Social proof stats */}
      <section>
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 rounded-2xl sm:rounded-3xl text-white text-center py-12 sm:py-14 px-6 sm:px-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-1">Making an impact</h2>
          <p className="text-indigo-200 text-sm mb-8 sm:mb-10">Real students. Real mentors. Real outcomes.</p>
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
            {[
              { num: "500+", label: "Students Matched" },
              { num: "200+", label: "Verified Mentors" },
              { num: "40+", label: "Career Fields" },
            ].map((s) => (
              <div key={s.num}>
                <div className="text-2xl sm:text-4xl font-extrabold">{s.num}</div>
                <div className="text-indigo-200 text-xs sm:text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured mentors — only shown if data exists */}
      {featuredMentors.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">Meet some of our mentors</h2>
          <p className="text-gray-500 text-center mb-6 text-sm">Real professionals ready to guide your career journey.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {featuredMentors.map((m: any, i: number) => {
              const colors = ["bg-blue-100 text-blue-600", "bg-emerald-100 text-emerald-600", "bg-violet-100 text-violet-600", "bg-amber-100 text-amber-600", "bg-rose-100 text-rose-600", "bg-cyan-100 text-cyan-600"];
              return (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-11 h-11 ${colors[i % colors.length]} rounded-full flex items-center justify-center font-bold text-base flex-shrink-0`}>
                      {m.accounts?.first_name?.[0]}{m.accounts?.last_name?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{m.accounts?.first_name} {m.accounts?.last_name}</p>
                      <p className="text-xs text-gray-500">{m.job_title}{m.company ? ` · ${m.company}` : ""}</p>
                    </div>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">{m.career_field}</span>
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

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Common questions</h2>
        <p className="text-gray-500 text-center mb-8 text-sm sm:text-base">Straight answers, no fluff.</p>
        <div className="space-y-3" id="faq-list">
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
              q: "Who are the mentors?",
              a: "Working professionals who signed up to give back. Each mentor is interviewed and verified by our team before they show up in results. You'll see their field, job title, and reviews from students they've worked with."
            },
            {
              q: "I'm in high school — is this for me?",
              a: "Yes, 100%. Mentino was literally built by a 15-year-old. High school students are exactly who this is for. If you're trying to figure out what career you want or what it actually looks like, this is the place."
            },
            {
              q: "What does a mentorship session actually look like?",
              a: "It's a conversation — usually over video call or messages. You ask questions, the mentor shares their experience. There's no script. It could be about a day in their job, how to prepare for college, what skills matter, or just venting about not knowing what you want to do. It's real talk."
            },
            {
              q: "Can I message my mentor before committing?",
              a: "Once a mentor accepts your match request, you get a full messaging thread. You can ask anything before scheduling a formal session."
            },
            {
              q: "What if a mentor is rude or inappropriate?",
              a: "Report them. Every profile has a report button. We take reports seriously — first offense is a 24-hour ban, escalating from there. All mentors agreed to our Code of Conduct when they signed up."
            },
            {
              q: "I'm a professional — why should I become a mentor?",
              a: "Honestly? Because it matters. One conversation can change a student's direction entirely. It's flexible — you set your own availability and max mentees. And students leave reviews, so you build a real reputation on the platform."
            },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <button
                type="button"
                data-faq-btn={i}
                className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4">{item.q}</span>
                <svg data-faq-icon={i} className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div data-faq-panel={i} className="hidden px-6 pb-5">
                <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
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

      {/* Bottom CTA strip */}
      <section className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Ready to find your mentor?</h2>
        <p className="text-gray-500 text-sm sm:text-base mb-6 max-w-md mx-auto">It takes 5 minutes to set up a profile and get matched with someone in your field.</p>
        <a href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-indigo-700 transition-colors text-base shadow-md hover:-translate-y-0.5 transform">
          Create Your Free Profile
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </section>

    </div>
  );
}
