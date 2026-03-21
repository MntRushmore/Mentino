import { Hono } from "hono";
import React from "react";
import { renderToString } from "react-dom/server";
import { Layout } from "../views/Layout";
import { optionalAuth } from "../middleware/auth";

const blog = new Hono();

function html(element: React.ReactElement, status = 200) {
  return new Response("<!DOCTYPE html>" + renderToString(element), {
    status,
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}

// Blog post data
const blogPosts = [
  {
    slug: "why-mentorship-matters",
    title: "Why Mentorship Matters More Than Ever",
    date: "March 15, 2026",
    author: "Ethan B.",
    category: "Mentorship",
    categoryColor: "blue",
    coverEmoji: "🤝",
    excerpt:
      "In a world where information is everywhere, guidance is rare. Here's why having a mentor can change your trajectory.",
    content: `
      <p>We live in the age of information. You can learn almost anything on YouTube, read research papers for free, and take online courses from the best universities in the world. So why does mentorship still matter?</p>

      <p>Because <strong>information is not the same as guidance</strong>.</p>

      <p>Knowing what to learn and knowing <em>how to navigate</em> a career are two completely different things. A mentor doesn't just teach you facts — they share context, perspective, and the kind of nuanced advice that only comes from lived experience.</p>

      <h3>The Numbers Don't Lie</h3>

      <p>Studies consistently show that mentored individuals are:</p>

      <ul>
        <li><strong>5x more likely</strong> to get promoted</li>
        <li><strong>More confident</strong> in their career decisions</li>
        <li><strong>Better networked</strong> within their industry</li>
        <li><strong>Less likely to drop out</strong> of school or career paths</li>
      </ul>

      <p>Yet, access to mentors is deeply unequal. Students from well-connected families get career advice over dinner. Everyone else has to figure it out alone.</p>

      <h3>What a Good Mentor Actually Does</h3>

      <p>A good mentor doesn't hand you answers. They help you ask better questions. They've made mistakes you haven't made yet, and they can help you avoid the ones that matter while encouraging you to take the risks that are worth it.</p>

      <p>Whether it's choosing a college major, preparing for your first interview, or deciding whether to take a gap year — having someone in your corner who's been there makes all the difference.</p>

      <h3>That's Why We Built Mentino</h3>

      <p>Mentino exists to make mentorship accessible to every student, regardless of their background. We believe the right conversation at the right time can change someone's entire trajectory.</p>

      <p>If you're a student — don't wait. Reach out. Ask questions. Find someone who's where you want to be.</p>

      <p>If you're a professional — consider giving back. One hour of your time could reshape someone's future.</p>
    `,
  },
  {
    slug: "finding-your-career-path",
    title: "How to Find Your Career Path When You Have No Idea",
    date: "March 8, 2026",
    author: "Ethan B.",
    category: "Career Advice",
    categoryColor: "emerald",
    coverEmoji: "🧭",
    excerpt:
      "Not knowing what you want to do is totally normal. Here's a framework for figuring it out without the pressure.",
    content: `
      <p>If you're a high school or college student and someone asks "What do you want to be when you grow up?" — it's okay to not have an answer. Most adults changed their minds multiple times before landing where they are now.</p>

      <p>Here's a practical framework for exploring careers without the overwhelm.</p>

      <h3>Step 1: Follow Curiosity, Not Prestige</h3>

      <p>Don't pick a career because it sounds impressive. Pick one because you're genuinely curious about the work. Prestige fades. Curiosity compounds.</p>

      <p>Ask yourself: <em>What topics do I read about voluntarily? What problems do I enjoy solving?</em></p>

      <h3>Step 2: Talk to Real People</h3>

      <p>Career descriptions online are sterile. They tell you the "what" but not the "feel." The best way to understand a career is to talk to someone who lives it every day.</p>

      <p>That's literally what Mentino is for. You can connect with professionals across 15+ career fields and ask them the questions Google can't answer:</p>

      <ul>
        <li>What does a typical day actually look like?</li>
        <li>What do you wish you knew before starting?</li>
        <li>What's the hardest part that nobody talks about?</li>
        <li>Would you choose this career again?</li>
      </ul>

      <h3>Step 3: Experiment Early</h3>

      <p>You don't need to commit to a career at 16. But you can start experimenting. Job shadow. Volunteer. Take on a project. The goal isn't to find "the answer" — it's to gather data points about what you enjoy and what you don't.</p>

      <h3>Step 4: Build Skills That Transfer</h3>

      <p>While you're exploring, focus on skills that are valuable everywhere: communication, problem-solving, writing, teamwork, and learning how to learn. These compound no matter where you end up.</p>

      <h3>The Bottom Line</h3>

      <p>Your career path doesn't have to be a straight line. The most interesting careers rarely are. Give yourself permission to explore, and find mentors who can help you see possibilities you didn't know existed.</p>
    `,
  },
  {
    slug: "mentorship-in-sports",
    title: "What Sports Taught Me About Mentorship",
    date: "February 28, 2026",
    author: "Ethan B.",
    category: "Personal Story",
    categoryColor: "amber",
    coverEmoji: "📸",
    excerpt:
      "From the sidelines as a sports photographer, I saw the same pattern over and over: the best athletes all had great mentors.",
    content: `
      <p>As a freelance sports photographer, I've spent hundreds of hours on the sidelines watching athletes compete at every level — from high school games to professional events.</p>

      <p>And I noticed something that changed how I think about success.</p>

      <h3>Behind Every Great Athlete Is a Great Coach</h3>

      <p>The best athletes I've photographed don't just have natural talent. They have someone in their corner pushing them, correcting them, and believing in them — especially when things get tough.</p>

      <p>A coach sees potential that the athlete can't see in themselves. They provide structure, accountability, and the kind of honest feedback that accelerates growth faster than solo practice ever could.</p>

      <h3>This Isn't Just About Sports</h3>

      <p>The same pattern exists everywhere. In business, in medicine, in tech, in the arts. The people who rise fastest are the ones who sought out guidance early and often.</p>

      <ul>
        <li>Steve Jobs had Robert Friedland</li>
        <li>Warren Buffett had Benjamin Graham</li>
        <li>Oprah Winfrey had Maya Angelou</li>
        <li>Mark Zuckerberg had Steve Jobs</li>
      </ul>

      <p>Mentorship isn't a luxury — it's a multiplier.</p>

      <h3>My Own Experience</h3>

      <p>When I started photography at 13, I was terrible. But I didn't stay terrible for long because I reached out to photographers I admired. I asked questions, studied their work, and learned directly from people with more experience.</p>

      <p>That willingness to seek guidance — not just information, but personal guidance — is what accelerated my growth more than anything else.</p>

      <h3>The Mentino Connection</h3>

      <p>That experience is exactly why I created Mentino (originally MentorMatch). Every student deserves a "coach" for their career — someone who's been where they want to go and is willing to share the playbook.</p>

      <p>You don't need to figure it out alone. And you shouldn't have to.</p>
    `,
  },
  {
    slug: "how-to-make-the-most-of-mentorship",
    title: "5 Ways to Make the Most of Your Mentorship",
    date: "February 20, 2026",
    author: "Ethan B.",
    category: "Tips",
    categoryColor: "violet",
    coverEmoji: "🎯",
    excerpt:
      "Getting matched with a mentor is just the beginning. Here's how to turn that connection into real growth.",
    content: `
      <p>Getting matched with a mentor on Mentino is exciting. But the real magic happens in how you show up to that relationship. Here are five ways to get the most out of your mentorship experience.</p>

      <h3>1. Come Prepared</h3>

      <p>Before each session, write down 2-3 specific questions or topics you want to discuss. Generic questions get generic answers. Specific questions unlock real insight.</p>

      <p><strong>Instead of:</strong> "What should I do with my life?"</p>
      <p><strong>Try:</strong> "I'm deciding between pre-med and biomedical engineering. What does the day-to-day look like in each, and how did you decide?"</p>

      <h3>2. Be Honest About Where You Are</h3>

      <p>Don't pretend to know things you don't. The whole point of mentorship is to learn from someone who's further ahead. Your mentor can only help if they know where you're actually starting from.</p>

      <h3>3. Take Action Between Sessions</h3>

      <p>If your mentor suggests reading something, trying something, or reaching out to someone — do it before your next session. This shows respect for their time and creates momentum.</p>

      <h3>4. Ask Follow-Up Questions</h3>

      <p>The best conversations go deep, not wide. When your mentor shares something interesting, dig into it. Ask "why" and "how" and "what happened next." That's where the real learning lives.</p>

      <h3>5. Express Gratitude</h3>

      <p>Your mentor is volunteering their time to help you. A simple thank-you message after a great session goes a long way. Let them know when their advice made a difference — it's motivating for them too.</p>

      <h3>Remember</h3>

      <p>Mentorship is a two-way street. The more you invest in the relationship, the more you'll get out of it. Show up curious, be respectful of their time, and take action on what you learn.</p>
    `,
  },
  {
    slug: "building-mentino",
    title: "Building Mentino at 15: Lessons from a Young Founder",
    date: "February 10, 2026",
    author: "Ethan B.",
    category: "Behind the Scenes",
    categoryColor: "rose",
    coverEmoji: "🚀",
    excerpt:
      "Starting a platform to connect students with mentors as a 15-year-old has been the hardest and most rewarding thing I've done.",
    content: `
      <p>When I tell people I started Mentino at 15, I usually get one of two reactions: "That's amazing!" or "Why?" The honest answer to both is the same: because I saw a problem I cared about and couldn't wait for someone else to solve it.</p>

      <h3>The Spark</h3>

      <p>It started with my own experience in photography. When I reached out to photographers I admired — asking questions, studying their work, learning from their experience — my growth accelerated dramatically. I went from a kid with a camera to a freelance sports photographer working with professional athletes.</p>

      <p>And I thought: <em>What if every student had this kind of access?</em></p>

      <h3>The Hard Parts</h3>

      <p>Building a platform at 15 comes with unique challenges:</p>

      <ul>
        <li><strong>Credibility:</strong> Getting adults to take you seriously when you're asking them to volunteer their time</li>
        <li><strong>Reach:</strong> There are only so many people you can message personally</li>
        <li><strong>Technical skills:</strong> Learning to build software while building the actual product</li>
        <li><strong>Time management:</strong> Balancing school, photography, and building a startup</li>
      </ul>

      <h3>What I've Learned</h3>

      <p><strong>Start before you're ready.</strong> If I waited until I had all the skills and all the answers, Mentino would never exist. I learned by doing, made mistakes, and improved along the way.</p>

      <p><strong>Focus on impact first.</strong> Growth follows when you're genuinely solving a problem people care about. I didn't start with a marketing plan — I started with a mission.</p>

      <p><strong>Ask for help.</strong> Ironically, building a mentorship platform taught me the most important lesson about mentorship: you can't do it alone. Every person who gave me advice, feedback, or encouragement played a role in making Mentino real.</p>

      <h3>What's Next</h3>

      <p>My vision for Mentino is simple: one day, a student should be able to click a button and instantly connect with the right mentor for their dream career. We're not there yet, but every conversation, every match, every session brings us closer.</p>

      <p>If you want to be part of this — as a student, a mentor, or someone who believes in what we're building — welcome. We're just getting started.</p>
    `,
  },
];

// GET /blog — Blog index
blog.get("/blog", optionalAuth, (c) => {
  const user = c.get("user");

  return html(
    <Layout title="Blog" user={user}>
      <div className="max-w-5xl mx-auto">
        {/* Blog Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Our Blog
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Stories, Tips & Insights
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Thoughts on mentorship, career exploration, and building
            something that matters — written by the Mentino team.
          </p>
        </div>

        {/* Featured Post */}
        <a
          href={`/blog/${blogPosts[0].slug}`}
          className="block mb-10 group"
        >
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-blue-300 transition-colors">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-12 text-center">
              <span className="text-7xl">{blogPosts[0].coverEmoji}</span>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-${blogPosts[0].categoryColor}-100 text-${blogPosts[0].categoryColor}-700`}
                >
                  {blogPosts[0].category}
                </span>
                <span className="text-sm text-gray-400">
                  {blogPosts[0].date}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                {blogPosts[0].title}
              </h2>
              <p className="text-gray-500 text-lg">{blogPosts[0].excerpt}</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  EB
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {blogPosts[0].author}
                </span>
              </div>
            </div>
          </div>
        </a>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.slice(1).map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div
                  className={`bg-gradient-to-br ${
                    post.categoryColor === "emerald"
                      ? "from-emerald-400 to-teal-500"
                      : post.categoryColor === "amber"
                      ? "from-amber-400 to-orange-500"
                      : post.categoryColor === "violet"
                      ? "from-violet-400 to-purple-500"
                      : "from-rose-400 to-pink-500"
                  } p-8 text-center`}
                >
                  <span className="text-5xl">{post.coverEmoji}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-${post.categoryColor}-100 text-${post.categoryColor}-700`}
                    >
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                      EB
                    </div>
                    <span className="text-xs text-gray-500">{post.author}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Layout>
  );
});

// GET /blog/:slug — Individual blog post
blog.get("/blog/:slug", optionalAuth, (c) => {
  const user = c.get("user");
  const slug = c.req.param("slug");

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return html(
      <Layout title="Post Not Found" user={user}>
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-300 mb-4">Post Not Found</h1>
          <p className="text-gray-500 mb-6">
            This blog post doesn't exist or may have been removed.
          </p>
          <a
            href="/blog"
            className="text-blue-600 hover:underline font-medium"
          >
            Back to Blog
          </a>
        </div>
      </Layout>,
      404
    );
  }

  // Find adjacent posts for navigation
  const currentIndex = blogPosts.indexOf(post);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  const gradientClass =
    post.categoryColor === "blue"
      ? "from-blue-500 to-indigo-600"
      : post.categoryColor === "emerald"
      ? "from-emerald-400 to-teal-500"
      : post.categoryColor === "amber"
      ? "from-amber-400 to-orange-500"
      : post.categoryColor === "violet"
      ? "from-violet-400 to-purple-500"
      : "from-rose-400 to-pink-500";

  return html(
    <Layout title={post.title} user={user}>
      <article className="max-w-3xl mx-auto">
        {/* Back link */}
        <a
          href="/blog"
          className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 font-medium"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </a>

        {/* Cover */}
        <div
          className={`bg-gradient-to-br ${gradientClass} rounded-2xl p-16 text-center mb-8`}
        >
          <span className="text-8xl">{post.coverEmoji}</span>
        </div>

        {/* Post header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full bg-${post.categoryColor}-100 text-${post.categoryColor}-700`}
            >
              {post.category}
            </span>
            <span className="text-sm text-gray-400">{post.date}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <p className="text-xl text-gray-500 mb-6">{post.excerpt}</p>
          <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              EB
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{post.author}</div>
              <div className="text-xs text-gray-400">Founder of Mentino</div>
            </div>
          </div>
        </div>

        {/* Post content */}
        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{
            __html: `
              <style>
                .prose h3 { font-size: 1.35rem; font-weight: 700; color: #111827; margin-top: 2rem; margin-bottom: 0.75rem; }
                .prose p { color: #4b5563; line-height: 1.8; margin-bottom: 1.25rem; }
                .prose ul { color: #4b5563; margin-bottom: 1.25rem; padding-left: 1.5rem; }
                .prose li { margin-bottom: 0.5rem; line-height: 1.7; }
                .prose strong { color: #111827; }
                .prose em { color: #6b7280; }
              </style>
              ${post.content}
            `,
          }}
        />

        {/* Post navigation */}
        <div className="border-t border-gray-200 pt-8 grid grid-cols-2 gap-4">
          {prevPost ? (
            <a
              href={`/blog/${prevPost.slug}`}
              className="group p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="text-xs text-gray-400 mb-1">Previous</div>
              <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {prevPost.title}
              </div>
            </a>
          ) : (
            <div />
          )}
          {nextPost ? (
            <a
              href={`/blog/${nextPost.slug}`}
              className="group p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors text-right"
            >
              <div className="text-xs text-gray-400 mb-1">Next</div>
              <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {nextPost.title}
              </div>
            </a>
          ) : (
            <div />
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Ready to find your mentor?</h3>
          <p className="text-blue-100 mb-6">
            Join Mentino and connect with professionals who can help guide your career.
          </p>
          <a
            href="/signup"
            className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Get Started Free
          </a>
        </div>
      </article>
    </Layout>
  );
});

export { blog, blogPosts };
