import React from "react";

interface HomeProps {
  featuredMentors?: any[];
}

export function Home({ featuredMentors = [] }: HomeProps) {
  return (
    <div>
      {/* Hero Section with Background Image */}
      <section className="relative text-center py-28 overflow-hidden rounded-3xl mb-16">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&q=80"
            alt="Students collaborating on career goals"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-blue-900/85 to-violet-900/80" />
        </div>
        <div className="relative z-10 text-white max-w-4xl mx-auto px-6">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-5 py-2 rounded-full mb-6 border border-white/30">
            Free Mentorship for Every Student
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Your career starts with<br />
            the right <span className="text-blue-300">conversation</span>.
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Mentino connects students with verified working professionals for personalized career
            guidance and mentorship. Get real-world advice from people who've been where you want to go.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="/signup"
              className="bg-white text-indigo-700 px-8 py-3.5 rounded-full text-lg font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Get Started Free
            </a>
            <a
              href="/how-it-works"
              className="border-2 border-white/60 text-white px-8 py-3.5 rounded-full text-lg font-semibold hover:bg-white/10 transition-colors"
            >
              How It Works →
            </a>
          </div>
          <div className="flex justify-center flex-wrap gap-6 mt-10 text-blue-200 text-sm">
            {["100% Free for Students", "Verified Professionals Only", "Safe for Students Under 18"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research-backed Impact Numbers */}
      <section className="py-4 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { number: "5x", label: "More likely to be promoted with a mentor", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
            { number: "55%", label: "More likely to enroll in college with mentorship", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
            { number: "16M", label: "Young people grow up without a mentor in the US", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
            { number: "23%", label: "More job offers before graduation for mentored students", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} border ${stat.border} rounded-2xl p-6 text-center`}>
              <div className={`text-4xl font-extrabold ${stat.color} mb-2`}>{stat.number}</div>
              <div className="text-gray-600 text-sm leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-3">Sources: MENTOR, NACE, Journal of Applied Psychology, BLS</p>
      </section>

      {/* How It Works — with step images */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">How Mentino Works</h2>
        <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
          Three simple steps to connect with the right mentor for your career goals and professional growth.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              num: "1",
              title: "Create Your Profile",
              desc: "Sign up as a student or mentor. Tell us about your career interests, goals, and availability in under 5 minutes.",
              img: "https://images.unsplash.com/photo-1616587226157-48e49175ee20?w=500&q=80",
              bg: "bg-blue-50", border: "border-blue-100", numBg: "bg-blue-600",
            },
            {
              num: "2",
              title: "Get Smart-Matched",
              desc: "Our algorithm analyzes 5 factors to find the perfect mentor — career alignment, topic relevance, schedule, personality, and capacity.",
              img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80",
              bg: "bg-emerald-50", border: "border-emerald-100", numBg: "bg-emerald-600",
            },
            {
              num: "3",
              title: "Connect & Grow",
              desc: "Message your mentor directly, schedule video sessions, and get real career guidance on interviews, college, and more.",
              img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80",
              bg: "bg-violet-50", border: "border-violet-100", numBg: "bg-violet-600",
            },
          ].map((step) => (
            <div key={step.num} className={`${step.bg} border ${step.border} rounded-2xl overflow-hidden group hover:shadow-lg transition-shadow`}>
              <div className="h-44 overflow-hidden">
                <img src={step.img} alt={step.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-6">
                <div className={`${step.numBg} text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold mb-4`}>
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Career Fields with Image Backgrounds */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">Explore Career Fields</h2>
        <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
          Find career mentors across 15+ industries. Whatever your professional aspiration, we have verified experts ready to guide you.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: "Technology & Engineering", icon: "💻", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80" },
            { name: "Medicine & Healthcare", icon: "🏥", img: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&q=80" },
            { name: "Law & Justice", icon: "⚖️", img: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=500&q=80" },
            { name: "Business & Finance", icon: "📊", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80" },
            { name: "Sports & Athletics", icon: "🏅", img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&q=80" },
            { name: "Arts & Creative", icon: "🎨", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80" },
          ].map((field) => (
            <a key={field.name} href="/signup" className="group relative rounded-2xl overflow-hidden h-40 block cursor-pointer">
              <img src={field.img} alt={field.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="text-2xl">{field.icon}</span>
                <span className="text-white font-bold text-sm leading-tight">{field.name}</span>
              </div>
            </a>
          ))}
        </div>
        <p className="text-center text-gray-400 text-sm mt-4">+ Science, Education, Entrepreneurship, Media, and more</p>
      </section>

      {/* Featured Mentors */}
      {featuredMentors.length > 0 && (
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">Meet Our Mentors</h2>
          <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
            Real professionals. Real experience. Ready to guide your career journey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMentors.map((m: any, i: number) => {
              const colors = [
                "bg-blue-100 text-blue-600",
                "bg-emerald-100 text-emerald-600",
                "bg-violet-100 text-violet-600",
                "bg-amber-100 text-amber-600",
                "bg-rose-100 text-rose-600",
                "bg-cyan-100 text-cyan-600",
              ];
              return (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 ${colors[i % colors.length]} rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                      {m.accounts?.first_name?.[0]}{m.accounts?.last_name?.[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{m.accounts?.first_name} {m.accounts?.last_name}</h3>
                      <p className="text-sm text-gray-500">{m.job_title} at {m.company || "N/A"}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {m.accounts?.bio || `${m.years_experience} years in ${m.career_field}`}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">{m.career_field}</span>
                    <span className="text-xs text-gray-400">{m.years_experience} yrs exp.</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {m.topics?.slice(0, 3).map((topic: string) => (
                      <span key={topic} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{topic}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <a href="/signup" className="text-indigo-600 font-semibold hover:underline">
              Sign up to see all mentors and get matched →
            </a>
          </div>
        </section>
      )}

      {/* Smart Matching — dark gradient section */}
      <section className="py-16">
        <div className="relative bg-gradient-to-br from-slate-900 to-indigo-900 rounded-3xl p-10 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500 rounded-full opacity-10 -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-violet-500 rounded-full opacity-10 translate-y-1/3 -translate-x-1/4" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-emerald-500/30">
                Smart Matching Algorithm
              </span>
              <h2 className="text-3xl font-bold mb-4">
                Matched by more than just career field
              </h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Our intelligent matching system weighs 5 different factors to pair you with the ideal mentor for your career journey — not just what field you're interested in, but how you learn, when you're available, and what you want to achieve.
              </p>
              <a href="/how-it-works" className="inline-block bg-emerald-500 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-emerald-400 transition-colors">
                See how matching works →
              </a>
            </div>
            <div className="space-y-4">
              {[
                { label: "Career Alignment", pct: 35, color: "bg-indigo-400" },
                { label: "Topic Relevance", pct: 25, color: "bg-emerald-400" },
                { label: "Schedule Match", pct: 20, color: "bg-violet-400" },
                { label: "Personality Fit", pct: 15, color: "bg-amber-400" },
                { label: "Mentor Capacity", pct: 5, color: "bg-rose-400" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-200 font-medium">{item.label}</span>
                    <span className="text-slate-400 font-bold">{item.pct}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5">
                    <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Mentorship Gap — image grid + stats */}
      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-rose-100 text-rose-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              The Mentorship Gap
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              16 million young people grow up without a mentor
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Students from well-connected families get career advice over dinner. Everyone else has to figure it out alone. Mentino bridges this gap by creating a free, structured platform where industry professionals volunteer their time to guide the next generation.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: "5x", label: "More promotions", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
                { stat: "55%", label: "More college enrollment", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
                { stat: "$5,610", label: "Higher salary per year", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
                { stat: "4x", label: "More career satisfaction", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
              ].map((s) => (
                <div key={s.stat} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
                  <div className={`text-2xl font-extrabold ${s.color}`}>{s.stat}</div>
                  <div className="text-gray-600 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">Source: MENTOR, Journal of Applied Psychology (2004)</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80" alt="Students in mentorship session" className="rounded-2xl w-full h-52 object-cover" />
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80" alt="Students collaborating" className="rounded-2xl w-full h-52 object-cover mt-8" />
            <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80" alt="Professional mentoring" className="rounded-2xl w-full h-52 object-cover -mt-8" />
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80" alt="Career guidance session" className="rounded-2xl w-full h-52 object-cover" />
          </div>
        </div>
      </section>

      {/* Founder Spotlight */}
      <section className="py-16">
        <div className="relative bg-slate-900 rounded-3xl p-12 text-white overflow-hidden">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1400&q=80" alt="" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/60" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="w-24 h-24 rounded-2xl mx-auto mb-6 border-4 border-indigo-400 overflow-hidden shadow-2xl">
              <img src="/images/founder.jpg" alt="Ethan Branzuela, Founder of Mentino" className="w-full h-full object-cover" />
            </div>
            <blockquote className="text-2xl leading-relaxed mb-6 text-slate-200 italic font-light">
              "Mentorship shouldn't depend on who you know. It should depend on who you aspire to become. I built Mentino because I believe every student deserves a guide for their career."
            </blockquote>
            <div className="text-white font-bold text-lg">Ethan Branzuela</div>
            <div className="text-slate-400 text-sm mb-6">Founder of Mentino · 15-year-old student & sports photographer, Bay Area</div>
            <a href="/founder" className="inline-block bg-indigo-600 text-white font-semibold px-7 py-3 rounded-full hover:bg-indigo-500 transition-colors">
              Read Ethan's Story →
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 mb-8">
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 rounded-3xl text-white text-center p-14">
          <h2 className="text-3xl font-bold mb-2">Making an Impact</h2>
          <p className="text-indigo-200 mb-10">Real students. Real mentors. Real career outcomes.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { num: "500+", label: "Students Matched" },
              { num: "200+", label: "Verified Mentors" },
              { num: "15+", label: "Career Fields" },
            ].map((s) => (
              <div key={s.num}>
                <div className="text-5xl font-extrabold">{s.num}</div>
                <div className="text-indigo-200 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">From the Blog</h2>
            <p className="text-gray-500 mt-1">Research-backed articles on mentorship, career exploration, and student success</p>
          </div>
          <a href="/blog" className="text-indigo-600 font-semibold hover:underline hidden md:block">
            View all posts →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              slug: "why-mentorship-matters",
              title: "Why Mentorship Matters for Career Success",
              excerpt: "Confidence, networking, and professional growth — what the research says.",
              image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
              category: "Mentorship",
              categoryColor: "bg-indigo-500",
            },
            {
              slug: "stem-vs-non-stem-salaries",
              title: "STEM vs Non-STEM Salaries: What the Data Shows",
              excerpt: "NSF 2024 earnings data broken down clearly for students.",
              image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
              category: "Salary Data",
              categoryColor: "bg-emerald-500",
            },
            {
              slug: "how-mentorship-improves-career-outcomes",
              title: "How Mentorship Improves Career Outcomes",
              excerpt: "From first job to lifelong transferable skills.",
              image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
              category: "Career Outcomes",
              categoryColor: "bg-violet-500",
            },
          ].map((post) => (
            <a key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                <div className="relative h-52 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className={`absolute bottom-3 left-3 ${post.categoryColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {post.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 leading-snug text-lg">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex items-center text-indigo-600 font-semibold text-sm">
                    Read article
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="text-center mt-6 md:hidden">
          <a href="/blog" className="text-indigo-600 font-semibold hover:underline">View all posts →</a>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-8 text-center mb-8">
        <div className="relative rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1400&q=80"
            alt="Students and professionals connecting"
            className="w-full h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/92 to-violet-900/88 flex items-center justify-center">
            <div className="text-white text-center px-6">
              <h2 className="text-3xl font-bold mb-3">Ready to Start Your Career Journey?</h2>
              <p className="text-indigo-200 mb-7 max-w-xl mx-auto">
                Whether you're a student looking for mentorship or a professional wanting to give back, Mentino is for you.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <a href="/signup" className="bg-white text-indigo-700 px-8 py-3 rounded-full text-lg font-bold hover:bg-indigo-50 transition-colors">
                  Sign Up as a Student
                </a>
                <a href="/signup" className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white/10 transition-colors">
                  Become a Mentor
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
