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
    title: "Why Mentorship Matters for Career Success",
    date: "March 15, 2026",
    author: "Ethan Branzuela",
    category: "Mentorship",
    categoryColor: "indigo",
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    excerpt: "Confidence, networking, and professional growth — what the research says.",
    readTime: "6 min read",
    content: `
      <p>We live in the age of information. You can learn almost anything on YouTube, read research papers for free, and take online courses from top universities. So why does mentorship still matter?</p>

      <p>Because <strong>information is not the same as guidance</strong>. Knowing what to learn and knowing how to navigate a career are two completely different things.</p>

      <h3>The Research Is Clear</h3>

      <p>A landmark study by Sun Microsystems found that employees who had mentors were <strong>promoted five times more often</strong> than those without mentors. The mentors themselves were also promoted six times more often, suggesting mentorship benefits both sides of the relationship.</p>

      <p class="source">Source: Gartner, "Mentoring: A Practitioner's Guide to Touching Lives" (2006)</p>

      <p>Research published in the <em>Journal of Applied Psychology</em> found that mentored individuals reported:</p>

      <ul>
        <li><strong>Higher salaries</strong> — mentored employees earned an average of $5,610 more per year than non-mentored peers</li>
        <li><strong>Greater career satisfaction</strong> — 4x more satisfied with their career trajectory</li>
        <li><strong>More promotions</strong> — mentored individuals received promotions at a significantly higher rate</li>
      </ul>

      <p class="source">Source: Allen, T.D., Eby, L.T., Poteet, M.L., Lentz, E., & Lima, L. (2004). "Career Benefits Associated With Mentoring for Proteges." <em>Journal of Applied Psychology</em>, 89(1), 127-136.</p>

      <h3>Youth Mentorship: The MENTOR/Mentoring Effect</h3>

      <p>The National Mentoring Partnership (MENTOR) reports that young adults who had a mentor are:</p>

      <ul>
        <li><strong>55% more likely</strong> to be enrolled in college</li>
        <li><strong>78% more likely</strong> to volunteer regularly in their communities</li>
        <li><strong>90% more interested</strong> in becoming mentors themselves</li>
        <li><strong>130% more likely</strong> to hold leadership positions</li>
      </ul>

      <p class="source">Source: MENTOR: The National Mentoring Partnership, "The Mentoring Effect" (2014). Based on a nationally representative survey of 1,109 young adults ages 18-21.</p>

      <h3>The Confidence Factor</h3>

      <p>A study from the American Psychological Association found that mentorship significantly boosts self-efficacy — a person's belief in their ability to succeed. This confidence translates directly into career outcomes: people who believe they can succeed are more likely to take on challenges, apply for stretch roles, and persist through setbacks.</p>

      <p class="source">Source: Bandura, A. (1994). "Self-efficacy." In V.S. Ramachaudran (Ed.), <em>Encyclopedia of Human Behavior</em>, Vol. 4, 71-81. Academic Press.</p>

      <h3>Networking Through Mentorship</h3>

      <p>According to LinkedIn's Workforce Learning Report, 94% of employees say they would stay at a company longer if it invested in their career development. Mentorship is one of the most effective forms of career development because it creates <strong>warm introductions</strong> — connections that come with built-in trust and context.</p>

      <p class="source">Source: LinkedIn, "2019 Workforce Learning Report."</p>

      <p>A study in the <em>Academy of Management Journal</em> showed that mentored individuals develop broader professional networks and are more likely to access what researchers call "developmental networks" — multiple mentors across different areas who collectively accelerate career growth.</p>

      <p class="source">Source: Higgins, M.C., & Kram, K.E. (2001). "Reconceptualizing Mentoring at Work: A Developmental Network Perspective." <em>Academy of Management Review</em>, 26(2), 264-288.</p>

      <h3>The Access Gap</h3>

      <p>Here's the problem: mentorship access is deeply unequal. A report by the National Bureau of Economic Research found that children from high-income families are significantly more likely to have access to professional networks and informal mentorship compared to lower-income peers.</p>

      <p>Students from well-connected families get career advice over dinner. Everyone else has to figure it out alone.</p>

      <p class="source">Source: Chetty, R., Hendren, N., Kline, P., & Saez, E. (2014). "Where is the Land of Opportunity? The Geography of Intergenerational Mobility in the United States." <em>NBER Working Paper No. 19843</em>.</p>

      <h3>That's Why We Built Mentino</h3>

      <p>Mentino exists to close this gap. We connect students with verified working professionals for free, personalized career guidance. Because the right conversation at the right time can change someone's entire trajectory.</p>

      <p>If you're a student — don't wait. Reach out. Find someone who's where you want to be.</p>

      <p>If you're a professional — consider giving back. The data shows that one mentoring relationship can be the difference between someone finding their path and getting lost along the way.</p>
    `,
  },
  {
    slug: "stem-vs-non-stem-salaries",
    title: "STEM vs Non-STEM Salaries: What the Data Shows",
    date: "March 8, 2026",
    author: "Ethan Branzuela",
    category: "Salary Data",
    categoryColor: "emerald",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    excerpt: "NSF 2024 earnings data broken down clearly for students.",
    readTime: "8 min read",
    content: `
      <p>One of the biggest questions students have when choosing a career path is: <strong>"How much will I earn?"</strong> It's a fair question — and the data can help you make a more informed decision.</p>

      <p>Let's look at what the numbers actually say, using the most recent data from the National Science Foundation, Bureau of Labor Statistics, and other authoritative sources.</p>

      <h3>The Big Picture: STEM vs Non-STEM</h3>

      <p>According to the U.S. Bureau of Labor Statistics, the <strong>median annual wage for STEM occupations was $100,900 in May 2023</strong>, compared to $40,120 for all non-STEM occupations. That's a 151% difference.</p>

      <p class="source">Source: U.S. Bureau of Labor Statistics, Occupational Employment and Wages, May 2023. "STEM Occupations: Past, Present, And Future."</p>

      <p>But these numbers need context. "STEM" includes everything from software engineers ($127,260 median) to agricultural technicians ($40,160 median). The range within STEM is enormous.</p>

      <h3>Salary by Field: The Real Numbers</h3>

      <p>Here's a breakdown of median annual salaries by major occupation group (BLS, May 2023):</p>

      <table>
        <tr><th>Field</th><th>Median Salary</th><th>Growth (2022-2032)</th></tr>
        <tr><td>Computer & IT</td><td>$104,420</td><td>+15% (much faster)</td></tr>
        <tr><td>Engineering</td><td>$83,340</td><td>+7% (faster)</td></tr>
        <tr><td>Healthcare Practitioners</td><td>$77,600</td><td>+13% (much faster)</td></tr>
        <tr><td>Business & Financial</td><td>$76,850</td><td>+8% (faster)</td></tr>
        <tr><td>Architecture</td><td>$72,390</td><td>+5% (average)</td></tr>
        <tr><td>Life Sciences</td><td>$68,830</td><td>+5% (average)</td></tr>
        <tr><td>Legal</td><td>$84,910</td><td>+8% (faster)</td></tr>
        <tr><td>Arts & Design</td><td>$50,710</td><td>+3% (average)</td></tr>
        <tr><td>Education</td><td>$55,350</td><td>+4% (average)</td></tr>
        <tr><td>Social Sciences</td><td>$65,470</td><td>+5% (average)</td></tr>
      </table>

      <p class="source">Source: U.S. Bureau of Labor Statistics, "Occupational Outlook Handbook," 2024 Edition. Data from May 2023 surveys.</p>

      <h3>The College Premium Is Real — But Varies</h3>

      <p>Data from the Federal Reserve Bank of New York shows that the median wage for workers with a bachelor's degree was <strong>$60,000 in 2023</strong>, compared to $36,000 for those with only a high school diploma. That's a 67% premium.</p>

      <p>However, the return on a degree varies dramatically by field:</p>

      <ul>
        <li><strong>Computer Science</strong>: Median early career salary of $75,000 (Georgetown CEW)</li>
        <li><strong>Engineering</strong>: $73,000 median early career</li>
        <li><strong>Business</strong>: $52,000 median early career</li>
        <li><strong>Biology</strong>: $40,000 median early career (often requires graduate school)</li>
        <li><strong>Arts</strong>: $36,000 median early career</li>
        <li><strong>Education</strong>: $38,000 median early career</li>
      </ul>

      <p class="source">Source: Federal Reserve Bank of New York, "The Labor Market for Recent College Graduates," updated January 2024. Georgetown University Center on Education and the Workforce (CEW), "The Economic Value of College Majors" (2023).</p>

      <h3>The Graduate School Effect</h3>

      <p>For many non-STEM careers, graduate school dramatically changes the earnings picture:</p>

      <ul>
        <li><strong>Medicine (MD)</strong>: Median salary $229,300 (BLS, 2023) — but requires 11-15 years of training</li>
        <li><strong>Law (JD)</strong>: Median salary $135,740 (BLS, 2023) — 3 years beyond college</li>
        <li><strong>MBA</strong>: Median salary $105,000 (GMAC, 2023) — 2 years beyond college</li>
        <li><strong>Clinical Psychology (PhD)</strong>: Median salary $92,740 (BLS, 2023) — 5-7 years beyond college</li>
      </ul>

      <p class="source">Sources: Bureau of Labor Statistics, Occupational Outlook Handbook (2024). Graduate Management Admission Council (GMAC), "Corporate Recruiters Survey" (2023).</p>

      <h3>What About Job Satisfaction?</h3>

      <p>Salary isn't everything. The National Society of High School Scholars found that Gen Z ranks <strong>work-life balance</strong> and <strong>meaningful work</strong> above salary when evaluating career options. A Gallup survey found that workers who use their strengths daily are <strong>6x more likely to be engaged</strong> at work.</p>

      <p class="source">Sources: National Society of High School Scholars, "2023 Career Interest Survey." Gallup, "State of the American Workplace Report" (2023).</p>

      <h3>The Entrepreneurship Factor</h3>

      <p>Salary data only captures traditional employment. According to the Kauffman Foundation, the average income for successful small business owners exceeds $120,000 per year, though the range is vast and the failure rate is high (about 50% of small businesses fail within five years, per SBA data).</p>

      <p class="source">Sources: Ewing Marion Kauffman Foundation, "State of Entrepreneurship" (2023). U.S. Small Business Administration, "Frequently Asked Questions About Small Business" (2023).</p>

      <h3>The Bottom Line for Students</h3>

      <p>Here's what we'd tell any student thinking about career paths:</p>

      <ol>
        <li><strong>Don't choose solely based on salary.</strong> High-paying careers you hate lead to burnout. The best outcomes come from intersecting interest, aptitude, and market demand.</li>
        <li><strong>STEM pays more on average</strong>, but the range within every field is enormous. Top performers in any field out-earn average performers in "higher-paying" fields.</li>
        <li><strong>Talk to real people in the field.</strong> Salary data tells you the "what" but not the "feel." That's where mentorship comes in — ask someone who lives it every day.</li>
        <li><strong>Consider the full picture:</strong> debt, training time, lifestyle, geographic flexibility, and long-term growth trajectory.</li>
      </ol>

      <p>On Mentino, you can connect with professionals across 15+ career fields and get honest answers about what the work — and the compensation — really looks like.</p>
    `,
  },
  {
    slug: "how-mentorship-improves-career-outcomes",
    title: "How Mentorship Improves Career Outcomes",
    date: "February 28, 2026",
    author: "Ethan Branzuela",
    category: "Career Outcomes",
    categoryColor: "violet",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    excerpt: "From first job to lifelong transferable skills.",
    readTime: "7 min read",
    content: `
      <p>Mentorship doesn't just feel good — it produces measurable career outcomes. From landing your first job to building leadership skills that last a lifetime, the research consistently shows that mentored individuals outperform their peers.</p>

      <h3>First Job Outcomes</h3>

      <p>A study by the National Association of Colleges and Employers (NACE) found that students who had mentoring relationships during college were <strong>23% more likely to receive a job offer before graduation</strong> compared to those without mentors.</p>

      <p class="source">Source: National Association of Colleges and Employers (NACE), "Job Outlook Survey" (2023).</p>

      <p>The reason is straightforward: mentors help with resume review, mock interviews, industry introductions, and the kind of "insider knowledge" about what hiring managers actually look for that you can't find in a textbook.</p>

      <h3>Salary Acceleration</h3>

      <p>A meta-analysis published in the <em>Journal of Vocational Behavior</em> examined 43 studies on mentorship outcomes and found that mentored individuals consistently reported:</p>

      <ul>
        <li><strong>Higher compensation</strong> over time — not just starting salary, but faster raises and promotions</li>
        <li><strong>Greater career mobility</strong> — more job offers, more lateral movement options, and broader professional networks</li>
        <li><strong>Lower turnover intentions</strong> — mentored employees stay longer at organizations and report greater loyalty</li>
      </ul>

      <p class="source">Source: Allen, T.D., Eby, L.T., Poteet, M.L., Lentz, E., & Lima, L. (2004). "Career Benefits Associated With Mentoring for Proteges: A Meta-Analysis." <em>Journal of Applied Psychology</em>, 89(1), 127-136.</p>

      <h3>Leadership Development</h3>

      <p>Research from the Center for Creative Leadership found that <strong>71% of Fortune 500 companies have formal mentoring programs</strong>, and employees who participate are more likely to be identified as "high-potential" leaders.</p>

      <p>A Harvard Business Review study found that mentors help develop what researchers call "leadership self-efficacy" — the belief that you can lead effectively. This confidence is strongly predictive of actual leadership performance.</p>

      <p class="source">Sources: Center for Creative Leadership, "Mentoring: A Key Strategy for Leadership Development" (2021). Lester, P.B., Hannah, S.T., Harms, P.D., Vogelgesang, G.R., & Avolio, B.J. (2011). "Mentoring Impact on Leader Efficacy Development." <em>Journal of Leadership & Organizational Studies</em>, 18(4), 469-483.</p>

      <h3>Transferable Skills</h3>

      <p>Perhaps the most lasting benefit of mentorship is the development of transferable skills that compound over an entire career:</p>

      <ul>
        <li><strong>Communication:</strong> Mentors model professional communication — how to present ideas, give feedback, and navigate difficult conversations</li>
        <li><strong>Strategic thinking:</strong> Learning to see the bigger picture of a career, industry, or organization</li>
        <li><strong>Network building:</strong> Understanding how professional relationships work and how to cultivate them authentically</li>
        <li><strong>Resilience:</strong> Hearing how mentors overcame setbacks normalizes failure and builds persistence</li>
      </ul>

      <p>A longitudinal study from Cornell University tracked career outcomes over 20 years and found that early mentoring relationships had lasting effects on career satisfaction and earning potential decades later.</p>

      <p class="source">Source: Ramaswami, A., & Dreher, G.F. (2007). "The Benefits Associated with Workplace Mentoring Relationships." In T.D. Allen & L.T. Eby (Eds.), <em>The Blackwell Handbook of Mentoring</em>, 211-231. Wiley-Blackwell.</p>

      <h3>The Diversity Impact</h3>

      <p>Mentorship is particularly impactful for underrepresented groups. A study published in the <em>Harvard Business Review</em> found that mentoring programs boosted representation of Black, Hispanic, and Asian-American women in management by 9% to 24%. For Black men, the increase was 8% to 15%.</p>

      <p class="source">Source: Dobbin, F., & Kalev, A. (2016). "Why Diversity Programs Fail." <em>Harvard Business Review</em>, 94(7/8), 52-60.</p>

      <p>When mentors from diverse backgrounds share their experiences navigating career challenges specific to their identity, it creates a roadmap that formal education rarely provides.</p>

      <h3>What This Means for Students</h3>

      <p>The evidence is overwhelming: mentorship works. It improves starting salaries, accelerates career growth, develops leadership skills, and has lasting effects that compound over decades.</p>

      <p>But here's the key insight — <strong>the earlier you start, the more you benefit</strong>. Students who find mentors in high school or early college have more time to apply what they learn, more runway to build relationships, and more opportunities to course-correct before major decisions.</p>

      <p>That's exactly what Mentino is designed for. We connect students with verified professionals at the earliest stages of career exploration, so that every student — regardless of their background or network — can benefit from the mentorship effect.</p>
    `,
  },
  {
    slug: "how-to-find-your-career-path",
    title: "How to Find Your Career Path When You Have No Idea",
    date: "February 20, 2026",
    author: "Ethan Branzuela",
    category: "Career Advice",
    categoryColor: "amber",
    coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    excerpt: "A research-backed framework for exploring careers without the pressure.",
    readTime: "7 min read",
    content: `
      <p>If you're a high school or college student and someone asks "What do you want to be when you grow up?" — it's okay to not have an answer.</p>

      <p>In fact, according to the National Center for Education Statistics, <strong>about 30% of college students change their major at least once</strong>, and many change it two or three times. Research from the Federal Reserve Bank of New York shows that only <strong>27% of college graduates work in a field related to their major</strong>.</p>

      <p class="source">Sources: National Center for Education Statistics, "Beginning Postsecondary Students" (2023). Federal Reserve Bank of New York, "The Labor Market for Recent College Graduates" (2024).</p>

      <p>The point? Not knowing your path is the norm, not the exception. Here's a research-backed framework for figuring it out.</p>

      <h3>Step 1: Follow Curiosity, Not Prestige</h3>

      <p>Psychologist Angela Duckworth's research on "grit" shows that long-term passion and perseverance predict success more than talent or IQ. But you can't develop passion for something you chose because it sounded impressive at a dinner party.</p>

      <p>Ask yourself: <em>What topics do I read about voluntarily? What problems do I enjoy solving? When does time fly?</em></p>

      <p class="source">Source: Duckworth, A. (2016). <em>Grit: The Power of Passion and Perseverance</em>. Scribner.</p>

      <h3>Step 2: Talk to Real People</h3>

      <p>Career descriptions online are sterile. They tell you the "what" but not the "feel." A study in the <em>Journal of Career Development</em> found that students who conducted informational interviews were significantly more confident in their career choices and more realistic about their expectations.</p>

      <p class="source">Source: Crosby, O. (2010). "Informational Interviewing: Get the Inside Scoop on Careers." <em>Occupational Outlook Quarterly</em>, Bureau of Labor Statistics.</p>

      <p>That's literally what Mentino is for. Connect with professionals across 15+ career fields and ask them the questions Google can't answer:</p>

      <ul>
        <li>What does a typical day actually look like?</li>
        <li>What do you wish you knew before starting?</li>
        <li>What's the hardest part that nobody talks about?</li>
        <li>Would you choose this career again?</li>
      </ul>

      <h3>Step 3: Experiment Early</h3>

      <p>Stanford's "Designing Your Life" research by Bill Burnett and Dave Evans recommends "prototype experiences" — low-stakes ways to test career ideas before committing. This could mean job shadowing, volunteering, taking a project-based class, or starting a side project.</p>

      <p class="source">Source: Burnett, B., & Evans, D. (2016). <em>Designing Your Life: How to Build a Well-Lived, Joyful Life</em>. Knopf.</p>

      <h3>Step 4: Build Skills That Transfer</h3>

      <p>The World Economic Forum's "Future of Jobs Report 2023" lists the top skills employers will prioritize through 2027:</p>

      <ol>
        <li>Analytical thinking</li>
        <li>Creative thinking</li>
        <li>Resilience, flexibility, and agility</li>
        <li>Motivation and self-awareness</li>
        <li>Curiosity and lifelong learning</li>
      </ol>

      <p>Notice that none of these are field-specific. While you're exploring, focus on skills that compound no matter where you end up.</p>

      <p class="source">Source: World Economic Forum, "Future of Jobs Report 2023."</p>

      <h3>Step 5: Don't Optimize Too Early</h3>

      <p>Research by economist Ofer Malamud found that students who explored broadly before specializing ended up in <strong>better-fitting careers</strong> than those who specialized early. The UK education system (early specialization) was compared to the Scottish system (broader exploration), and Scottish graduates reported higher career satisfaction.</p>

      <p class="source">Source: Malamud, O. (2010). "Breadth versus Depth: The Timing of Specialization in Higher Education." <em>Labour</em>, 24(4), 349-369.</p>

      <h3>The Bottom Line</h3>

      <p>Your career path doesn't have to be a straight line. The most interesting careers rarely are. Give yourself permission to explore, build transferable skills, talk to real people in fields you're curious about, and trust that clarity comes from action — not from sitting and thinking about it.</p>
    `,
  },
  {
    slug: "building-mentino-at-15",
    title: "Building Mentino at 15: Lessons from a Young Founder",
    date: "February 10, 2026",
    author: "Ethan Branzuela",
    category: "Behind the Scenes",
    categoryColor: "rose",
    coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
    excerpt: "Starting a mentorship platform as a teenager — what I learned, what was hard, and what keeps me going.",
    readTime: "5 min read",
    content: `
      <p>When I tell people I started Mentino at 15, I usually get one of two reactions: "That's amazing!" or "Why?" The honest answer to both is the same: because I saw a problem I cared about and couldn't wait for someone else to solve it.</p>

      <h3>The Spark</h3>

      <p>It started with my own experience in sports photography. When I reached out to photographers I admired — asking questions, studying their work, learning from their experience — my growth accelerated dramatically. I went from a kid with a camera to a freelance sports photographer working with professional athletes in the Bay Area.</p>

      <p>And I thought: <em>What if every student had this kind of access?</em></p>

      <p>According to MENTOR: The National Mentoring Partnership, one in three young people in the U.S. will grow up without a mentor. That's over <strong>16 million young people</strong> navigating career decisions without guidance.</p>

      <p class="source">Source: MENTOR: The National Mentoring Partnership, "The Mentoring Gap" (2023).</p>

      <h3>The Hard Parts</h3>

      <p>Building a platform at 15 comes with unique challenges:</p>

      <ul>
        <li><strong>Credibility:</strong> Getting adults to take you seriously when you're asking them to volunteer their time on a platform built by a teenager</li>
        <li><strong>Reach:</strong> There are only so many people you can message personally. The Pew Research Center reports that teens spend an average of 8.5 hours per day on screens — but almost none of that time is spent on career development</li>
        <li><strong>Technical skills:</strong> Learning to build software while building the actual product</li>
        <li><strong>Time management:</strong> Balancing school, photography, and building a startup</li>
      </ul>

      <p class="source">Source: Pew Research Center, "Teens, Social Media and Technology 2023."</p>

      <h3>What I've Learned</h3>

      <p><strong>Start before you're ready.</strong> Research from Harvard Business School professor Francesca Gino shows that "learning by doing" is one of the most effective ways to develop competence. If I waited until I had all the skills and all the answers, Mentino would never exist.</p>

      <p class="source">Source: Gino, F. (2018). "The Business Case for Curiosity." <em>Harvard Business Review</em>, 96(5), 48-57.</p>

      <p><strong>Focus on impact first.</strong> According to a study in the <em>Journal of Business Venturing</em>, mission-driven founders are more resilient through early-stage challenges because their motivation is intrinsic, not just financial.</p>

      <p class="source">Source: Renko, M. (2013). "Early Challenges of Nascent Social Entrepreneurs." <em>Entrepreneurship Theory and Practice</em>, 37(5), 1045-1069.</p>

      <p><strong>Ask for help.</strong> Ironically, building a mentorship platform taught me the most important lesson about mentorship: you can't do it alone. Every person who gave me advice, feedback, or encouragement played a role in making Mentino real.</p>

      <h3>Young Founders Are More Common Than You Think</h3>

      <p>While the average age of successful startup founders is 45 (according to MIT research), some of the most impactful companies were started by young people: Mark Zuckerberg started Facebook at 19, Palmer Luckey started Oculus at 18, and Malala Yousafzai started the Malala Fund at 16.</p>

      <p class="source">Source: Azoulay, P., Jones, B.F., Kim, J.D., & Miranda, J. (2020). "Age and High-Growth Entrepreneurship." <em>American Economic Review: Insights</em>, 2(1), 65-82.</p>

      <p>Age isn't a barrier to impact. What matters is having a genuine problem to solve and the persistence to keep going.</p>

      <h3>What's Next</h3>

      <p>My vision for Mentino is simple: one day, a student should be able to click a button and instantly connect with the right mentor for their dream career. We're not there yet, but every conversation, every match, every session brings us closer.</p>

      <p>If you want to be part of this — as a student, a mentor, or someone who believes in what we're building — welcome. We're just getting started.</p>
    `,
  },
];

// GET /blog — Blog index
blog.get("/blog", optionalAuth, (c) => {
  const user = c.get("user");
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return html(
    <Layout title="Blog" user={user} currentPath="/blog">
      <div className="max-w-5xl mx-auto">

        {/* Blog Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Mentino Blog
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Stories, Research & Career Insights
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Research-backed articles on mentorship, career exploration, salary data, and student success — written by Ethan Branzuela.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { num: "5", label: "Research-backed articles", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
            { num: "16M", label: "Young people without a mentor (US)", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
            { num: "5×", label: "More promotions with a mentor", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          ].map((s) => (
            <div key={s.num} className={`${s.bg} border ${s.border} rounded-2xl p-5 text-center`}>
              <div className={`text-3xl font-extrabold ${s.color} mb-1`}>{s.num}</div>
              <div className="text-gray-600 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Featured Post — hero style */}
        <a href={`/blog/${featured.slug}`} className="group block mb-10">
          <div className="relative rounded-3xl overflow-hidden h-80 md:h-96">
            <img
              src={featured.coverImage}
              alt={featured.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {featured.category}
                </span>
                <span className="text-white/60 text-sm">{featured.date}</span>
                <span className="text-white/60 text-sm">{featured.readTime}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                {featured.title}
              </h2>
              <p className="text-white/70 text-sm md:text-base max-w-2xl">
                {featured.excerpt}
              </p>
              <div className="flex items-center text-indigo-300 font-semibold text-sm mt-4">
                Read article
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </a>

        {/* Category row */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <span className="text-gray-500 text-sm font-medium">Browse by topic:</span>
          {["Mentorship", "Salary Data", "Career Outcomes", "Career Advice", "Behind the Scenes"].map((cat) => (
            <span key={cat} className="bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 text-gray-600 text-sm px-3 py-1 rounded-full cursor-pointer transition-colors">
              {cat}
            </span>
          ))}
        </div>

        {/* Rest of posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-10">
          {rest.map((post) => (
            <BlogCard key={post.slug} post={post} large />
          ))}
        </div>

        {/* CTA Banner */}
        <div className="relative rounded-3xl overflow-hidden mt-4">
          <img
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80"
            alt="Mentorship in action"
            className="w-full h-56 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/92 to-violet-900/88 flex items-center justify-center">
            <div className="text-center text-white px-6">
              <h3 className="text-2xl font-bold mb-2">Ready to find your career mentor?</h3>
              <p className="text-indigo-200 mb-5">Join Mentino — free for all students, verified professionals only.</p>
              <a href="/signup" className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors">
                Get Started Free
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
});

function BlogCard({ post, large = false }: { post: typeof blogPosts[number]; large?: boolean }) {
  const categoryColors: Record<string, string> = {
    indigo: "bg-indigo-500 text-white",
    emerald: "bg-emerald-500 text-white",
    violet: "bg-violet-500 text-white",
    amber: "bg-amber-500 text-white",
    rose: "bg-rose-500 text-white",
  };

  return (
    <a href={`/blog/${post.slug}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Cover Image */}
        <div className={`relative ${large ? "h-56" : "h-48"} overflow-hidden`}>
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className={`absolute bottom-3 left-3 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${categoryColors[post.categoryColor] || "bg-gray-600 text-white"}`}>
            {post.category}
          </span>
          <span className="absolute top-3 right-3 bg-black/50 text-white/80 text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
            {post.readTime}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="text-xs text-gray-400 mb-2">{post.date}</div>
          <h3 className={`font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 leading-snug ${large ? "text-xl" : "text-lg"}`}>
            {post.title}
          </h3>
          <p className="text-gray-500 text-sm mb-4 flex-1 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-indigo-200">
                <img src="/images/founder.jpg" alt="Ethan Branzuela" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs text-gray-500">{post.author}</span>
            </div>
            <div className="flex items-center text-indigo-600 font-semibold text-sm">
              Read article
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

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
          <a href="/blog" className="text-indigo-600 hover:underline font-medium">
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
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return html(
    <Layout title={post.title} user={user}>
      <article className="max-w-3xl mx-auto">
        {/* Back link */}
        <a href="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 font-medium">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </a>

        {/* Cover Image */}
        <div className="rounded-2xl overflow-hidden mb-8 h-64 md:h-80">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Post header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              post.categoryColor === "indigo" ? "bg-indigo-100 text-indigo-700" :
              post.categoryColor === "emerald" ? "bg-emerald-100 text-emerald-700" :
              post.categoryColor === "violet" ? "bg-violet-100 text-violet-700" :
              post.categoryColor === "amber" ? "bg-amber-100 text-amber-700" :
              "bg-rose-100 text-rose-700"
            }`}>
              {post.category}
            </span>
            <span className="text-sm text-gray-400">{post.date}</span>
            <span className="text-sm text-gray-400">{post.readTime}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <p className="text-xl text-gray-500 mb-6">{post.excerpt}</p>
          <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-200">
              <img src="/images/founder.jpg" alt="Ethan Branzuela" className="w-full h-full object-cover" />
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
                .prose ul, .prose ol { color: #4b5563; margin-bottom: 1.25rem; padding-left: 1.5rem; }
                .prose li { margin-bottom: 0.5rem; line-height: 1.7; }
                .prose strong { color: #111827; }
                .prose em { color: #6b7280; }
                .prose .source { font-size: 0.8rem; color: #9ca3af; border-left: 3px solid #e5e7eb; padding-left: 0.75rem; margin-top: -0.5rem; margin-bottom: 1.5rem; line-height: 1.5; }
                .prose table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.9rem; }
                .prose th { background-color: #f3f4f6; font-weight: 600; color: #111827; text-align: left; padding: 0.75rem 1rem; border-bottom: 2px solid #e5e7eb; }
                .prose td { padding: 0.75rem 1rem; border-bottom: 1px solid #f3f4f6; color: #4b5563; }
                .prose tr:hover td { background-color: #f9fafb; }
              </style>
              ${post.content}
            `,
          }}
        />

        {/* Post navigation */}
        <div className="border-t border-gray-200 pt-8 grid grid-cols-2 gap-4">
          {prevPost ? (
            <a href={`/blog/${prevPost.slug}`} className="group p-4 rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors">
              <div className="text-xs text-gray-400 mb-1">Previous</div>
              <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {prevPost.title}
              </div>
            </a>
          ) : <div />}
          {nextPost ? (
            <a href={`/blog/${nextPost.slug}`} className="group p-4 rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors text-right">
              <div className="text-xs text-gray-400 mb-1">Next</div>
              <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {nextPost.title}
              </div>
            </a>
          ) : <div />}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Ready to find your mentor?</h3>
          <p className="text-indigo-100 mb-6">
            Join Mentino and connect with professionals who can help guide your career.
          </p>
          <a href="/signup" className="inline-block bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
            Get Started Free
          </a>
        </div>
      </article>
    </Layout>
  );
});

export { blog, blogPosts };
