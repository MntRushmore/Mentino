import React from "react";

interface HomeProps {
  featuredMentors?: any[];
}

export function Home({ featuredMentors = [] }: HomeProps) {
  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-20">
        <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          Free Mentorship for Every Student
        </span>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Your career starts with<br />
          the right <span className="text-blue-600">conversation</span>.
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
          Mentino connects students with verified working professionals for personalized career
          guidance. Get real-world advice from people who've been where you want to go.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/signup"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started Free
          </a>
          <a
            href="/how-it-works"
            className="border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            How It Works
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">How Mentino Works</h2>
        <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
          Three simple steps to connect with a mentor who gets where you're going.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Your Profile</h3>
            <p className="text-gray-500">
              Sign up as a student or mentor. Tell us about your goals, interests, and availability.
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Matched</h3>
            <p className="text-gray-500">
              Our system finds mentors that align with your career interests, schedule, and
              learning style.
            </p>
          </div>
          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Start Learning</h3>
            <p className="text-gray-500">
              Connect through messaging and video sessions. Get guidance on careers, interviews,
              college, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Career Fields */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Explore Career Fields
        </h2>
        <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
          Find mentors across a wide range of industries and professions.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Technology", icon: "💻", bg: "bg-blue-50", border: "border-blue-100" },
            { name: "Medicine", icon: "🏥", bg: "bg-rose-50", border: "border-rose-100" },
            { name: "Law", icon: "⚖️", bg: "bg-amber-50", border: "border-amber-100" },
            { name: "Business", icon: "📊", bg: "bg-emerald-50", border: "border-emerald-100" },
            { name: "Sports", icon: "🏅", bg: "bg-orange-50", border: "border-orange-100" },
            { name: "Arts", icon: "🎨", bg: "bg-violet-50", border: "border-violet-100" },
          ].map((field) => (
            <div
              key={field.name}
              className={`${field.bg} border ${field.border} rounded-2xl p-6 text-center hover:shadow-md transition-shadow cursor-pointer`}
            >
              <div className="text-3xl mb-2">{field.icon}</div>
              <div className="font-semibold text-gray-800">{field.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Mentors */}
      {featuredMentors.length > 0 && (
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Meet Our Mentors
          </h2>
          <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
            Real professionals, ready to guide you. Here are some of the mentors on Mentino.
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
              const color = colors[i % colors.length];
              return (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                      {m.accounts?.first_name?.[0]}{m.accounts?.last_name?.[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {m.accounts?.first_name} {m.accounts?.last_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {m.job_title} at {m.company || "N/A"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {m.accounts?.bio || `${m.years_experience} years in ${m.career_field}`}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {m.career_field}
                    </span>
                    <span className="text-xs text-gray-400">{m.years_experience} years exp.</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {m.topics?.slice(0, 3).map((topic: string) => (
                      <span key={topic} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <a
              href="/signup"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign up to see all mentors and get matched &rarr;
            </a>
          </div>
        </section>
      )}

      {/* Matching system preview */}
      <section className="py-16">
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">Smart Matching</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Matched by more than just career field
              </h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Our matching system looks at five different factors to pair you with the right mentor — not just what career you're interested in, but how you learn, when you're available, and what you want to get out of mentorship.
              </p>
              <a href="/how-it-works" className="text-blue-600 font-semibold hover:underline">
                See how matching works &rarr;
              </a>
            </div>
            <div className="space-y-3">
              {[
                { label: "Career Alignment", pct: 35, color: "bg-blue-500" },
                { label: "Topic Relevance", pct: 25, color: "bg-emerald-500" },
                { label: "Schedule Match", pct: 20, color: "bg-violet-500" },
                { label: "Personality Fit", pct: 15, color: "bg-amber-500" },
                { label: "Mentor Capacity", pct: 5, color: "bg-rose-400" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{item.label}</span>
                    <span className="text-gray-400">{item.pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder spotlight */}
      <section className="py-16">
        <div className="bg-slate-800 rounded-2xl p-10 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl mx-auto mb-6 border-2 border-slate-500 overflow-hidden">
              <img src="/images/founder.jpg" alt="Ethan Branzuela, Founder of Mentino" className="w-full h-full object-cover" />
            </div>
            <blockquote className="text-xl leading-relaxed mb-6 text-slate-200">
              "Mentorship shouldn't depend on who you know. It should depend on who you aspire to become. I built Mentino because I believe every student deserves a guide for their career — someone who's been where they want to go."
            </blockquote>
            <div className="text-white font-semibold">Ethan Branzuela</div>
            <div className="text-slate-400 text-sm">Founder of Mentino, 15-year-old student & sports photographer</div>
            <a href="/founder" className="inline-block mt-4 text-blue-400 hover:text-blue-300 font-medium text-sm">
              Read Ethan's story &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-blue-600 rounded-2xl text-white text-center mb-8">
        <h2 className="text-3xl font-bold mb-8">Making an Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div>
            <div className="text-4xl font-bold">500+</div>
            <div className="text-blue-200 mt-1">Students Matched</div>
          </div>
          <div>
            <div className="text-4xl font-bold">200+</div>
            <div className="text-blue-200 mt-1">Verified Mentors</div>
          </div>
          <div>
            <div className="text-4xl font-bold">15+</div>
            <div className="text-blue-200 mt-1">Career Fields</div>
          </div>
        </div>
      </section>

      {/* Blog preview */}
      <section className="py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">From the Blog</h2>
            <p className="text-gray-500 mt-1">Research-backed articles on mentorship and careers</p>
          </div>
          <a href="/blog" className="text-indigo-600 font-semibold hover:underline">
            View all posts &rarr;
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
                <div className="relative h-48 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className={`absolute bottom-3 left-3 ${post.categoryColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {post.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 leading-snug">
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
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
        <p className="text-gray-500 mb-8 max-w-xl mx-auto">
          Whether you're a student looking for guidance or a professional wanting to give back,
          Mentino is for you.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/signup"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign Up as a Student
          </a>
          <a
            href="/signup"
            className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Become a Mentor
          </a>
        </div>
      </section>
    </div>
  );
}
