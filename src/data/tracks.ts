/**
 * Career Tracks content.
 *
 * Add a new track by appending an object to TRACKS. Nothing else needs to change:
 * the catalog, overview, week pages, progress, notes and certificate all read from here.
 *
 * Rules the app enforces (see src/lib/tracks.ts):
 * - A lesson can be marked complete only after the student writes at least
 *   NOTE_MIN_SENTENCES sentences (and NOTE_MIN_CHARS characters) of notes.
 * - In each week: lessons first, then the assignment, then the quiz.
 * - Week N+1 unlocks once week N's lessons and assignment are done.
 * - The track is complete when every lesson, assignment and quiz is done.
 * - Lesson, assignment and quiz ids must stay stable once students have progress.
 */

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

/** "verified": link opened and title/creator matched when added. "needs review": could not be checked automatically. */
export type ReviewStatus = "verified" | "needs review";

export interface Lesson {
  id: string;
  title: string;
  /** "video" and "article" lessons require notes; "reading" is marked done without notes. */
  kind: "video" | "article" | "reading";
  /** Estimated minutes to complete (video length, or reading time). */
  minutes: number;
  /** YouTube video id, for kind "video". */
  youtubeId?: string;
  /** External link, for articles and readings (or a channel/search link when no single page fits). */
  url?: string;
  /** Shown instead of a resource when none could be verified, e.g. "[ADD VIDEO: topic]". */
  placeholder?: string;
  /** Who made it, shown under the title. */
  source: string;
  summary: string;
  /** Question shown above the notes box to guide what to write. */
  notePrompt: string;
  /** Extra instruction shown with the link, e.g. what to search for on a main page. */
  linkNote?: string;
  status: ReviewStatus;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  /** Index into options. */
  answer: number;
  explanation: string;
}

export interface Week {
  number: number;
  title: string;
  goal: string;
  lessons: Lesson[];
  assignment: { id: string; title: string; prompt: string; minWords: number; minutes: number; finalProject?: boolean };
  quiz: { id: string; passPercent: number; minutes: number; questions: QuizQuestion[] };
}

export interface Track {
  slug: string;
  title: string;
  career: string;
  /** Signup interest categories this track belongs to (must match CAREER_FIELDS at signup). */
  categories: string[];
  shortDescription: string;
  description: string;
  difficulty: Difficulty;
  hoursPerWeek: string;
  image: string;
  outcomes: string[];
  /** Resources search terms and career clusters this track should appear for. */
  keywords: string[];
  clusterIds: string[];
  weeks: Week[];
}

/** Lessons that need written notes before they can be marked complete. */
export function requiresNotes(lesson: Lesson): boolean {
  return lesson.kind !== "reading";
}

/** Estimated minutes to write the required notes for a lesson. */
export const NOTES_MINUTES = 10;

/** Total time for a lesson: the video or article, plus note-taking when notes are required. */
export function lessonMinutes(lesson: Lesson): number {
  return lesson.minutes + (requiresNotes(lesson) ? NOTES_MINUTES : 0);
}

export function weekMinutes(week: Week): number {
  return week.lessons.reduce((n, l) => n + lessonMinutes(l), 0) + week.assignment.minutes + week.quiz.minutes;
}

export function formatMinutes(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

import { CAREER_TRACKS } from "./careerTracks";

export const TRACKS: Track[] = [
  {
    slug: "intro-to-marketing",
    title: "Intro to Marketing",
    career: "Marketing",
    categories: ["Business & Management", "Media & Journalism"],
    shortDescription: "Learn how companies find customers, what marketers do all day, and how to plan a real campaign.",
    description:
      "Marketing is how a business figures out who its customers are, what they need, and how to reach them. In four weeks you will learn the core ideas every marketer uses, practice them on brands you already know, and finish with a short plan you can show in a college application or internship interview.",
    difficulty: "Beginner",
    hoursPerWeek: "2 to 3 hours",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    outcomes: [
      "Explain what marketing is and how it differs from advertising and sales",
      "Split a market into segments and describe a target customer",
      "Use the 4 Ps to compare two competing products",
      "Write a positioning statement for a brand",
      "Draft a simple marketing plan with a goal, audience, channels and one metric",
      "Describe the main marketing jobs and what they pay",
    ],
    keywords: ["marketing", "advertising", "brand", "branding", "social media", "digital marketing", "pr", "public relations", "market research", "content"],
    clusterIds: ["business", "media"],
    weeks: [
      {
        number: 1,
        title: "What marketing actually is",
        goal: "Understand the job of marketing and spot it in brands you use every day.",
        lessons: [
          {
            id: "m1-what-is-marketing",
            title: "What is marketing?",
            kind: "video",
            minutes: 1,
            status: "verified",
            youtubeId: "PRjqwpDFAqw",
            source: "Neil Patel",
            summary: "A plain definition of marketing and why every business depends on it.",
            notePrompt: "In your own words, what is marketing? How is it different from just running ads?",
          },
          {
            id: "m1-marketing-in-3-minutes",
            title: "Marketing in 3 minutes",
            kind: "video",
            minutes: 3,
            status: "verified",
            youtubeId: "QusJ4fpWQwA",
            source: "Shane Hummus",
            summary: "A fast overview of the main parts of marketing and the kinds of jobs inside it.",
            notePrompt: "List the parts of marketing mentioned. Which one sounds most interesting to you and why?",
          },
          {
            id: "m1-digital-marketing",
            title: "What is digital marketing?",
            kind: "article",
            minutes: 20,
            status: "verified",
            url: "https://blog.hubspot.com/marketing/what-is-digital-marketing",
            source: "HubSpot",
            summary: "How marketing works online: search, social, email, content and paid ads.",
            notePrompt: "Pick two digital channels from the article. Give one real example of a brand using each.",
          },
        ],
        assignment: {
          id: "m1-assignment",
          title: "Spot marketing in the wild",
          prompt:
            "Pick one brand you bought from or used this month. Explain who you think the brand is trying to reach, what message convinced you, and where you saw it (in a store, an app, social media, or from a friend). End with one thing the brand could do better.",
          minWords: 120,
          minutes: 45,
        },
        quiz: {
          id: "m1-quiz",
          passPercent: 60,
          minutes: 10,
          questions: [
            {
              id: "q1",
              question: "Which statement best describes marketing?",
              options: [
                "Running as many ads as possible",
                "Understanding customers and creating value that reaches them",
                "Lowering prices until people buy",
                "Designing a company logo",
              ],
              answer: 1,
              explanation: "Advertising is one tool. Marketing starts with understanding what customers need.",
            },
            {
              id: "q2",
              question: "A brand posts short videos on TikTok to reach teenagers. Which channel is this?",
              options: ["Email marketing", "Search engine optimization", "Social media marketing", "Print advertising"],
              answer: 2,
              explanation: "Posting on a social platform to reach an audience is social media marketing.",
            },
            {
              id: "q3",
              question: "Why does a company do marketing before it sells anything?",
              options: [
                "To learn who wants the product and what they will pay",
                "Because it is required by law",
                "To avoid talking to customers",
                "It does not; marketing only happens after launch",
              ],
              answer: 0,
              explanation: "Research before launch tells a company whether there is demand and at what price.",
            },
            {
              id: "q4",
              question: "Which of these is NOT usually a marketing job?",
              options: ["Brand manager", "Content strategist", "Payroll accountant", "Market research analyst"],
              answer: 2,
              explanation: "Payroll is a finance and HR function. The others are common marketing roles.",
            },
          ],
        },
      },
      {
        number: 2,
        title: "Know your customer",
        goal: "Split a market into groups and describe one target customer in detail.",
        lessons: [
          {
            id: "m2-segmentation",
            title: "Market segmentation with real examples",
            kind: "video",
            minutes: 11,
            status: "verified",
            youtubeId: "IrJ1cNIfmsk",
            source: "Business School 101",
            summary: "The four common ways to split a market: by demographics, location, behavior and attitudes.",
            notePrompt: "Name the four types of segmentation and give one example of each from a brand you know.",
          },
          {
            id: "m2-stp",
            title: "Segmentation, targeting and positioning (STP)",
            kind: "video",
            minutes: 8,
            status: "verified",
            youtubeId: "iGOw39GWDaI",
            source: "EPM",
            summary: "How marketers move from a whole market to one chosen group and one clear message.",
            notePrompt: "Explain the three steps of STP in order. Why does a company pick one segment instead of everyone?",
          },
          {
            id: "m2-personas",
            title: "How to research a buyer persona",
            kind: "article",
            minutes: 20,
            status: "verified",
            url: "https://blog.hubspot.com/marketing/buyer-persona-research",
            source: "HubSpot",
            summary: "How teams turn interviews and data into a profile of a typical customer.",
            notePrompt: "What information goes into a buyer persona? Which questions would you ask a real customer?",
          },
        ],
        assignment: {
          id: "m2-assignment",
          title: "Build a customer persona",
          prompt:
            "Choose a local business near you (a cafe, gym, tutoring center or store). Write a persona for its most important customer: age, school or job, what they care about, what problem the business solves for them, and where they spend time online. Then say which segmentation type you used and why.",
          minWords: 150,
          minutes: 45,
        },
        quiz: {
          id: "m2-quiz",
          passPercent: 60,
          minutes: 10,
          questions: [
            {
              id: "q1",
              question: "Grouping customers by how often they buy is which kind of segmentation?",
              options: ["Demographic", "Geographic", "Behavioral", "Psychographic"],
              answer: 2,
              explanation: "Behavioral segmentation looks at actions such as purchase frequency and loyalty.",
            },
            {
              id: "q2",
              question: "What is the correct order of STP?",
              options: [
                "Targeting, segmentation, positioning",
                "Segmentation, targeting, positioning",
                "Positioning, segmentation, targeting",
                "Segmentation, positioning, targeting",
              ],
              answer: 1,
              explanation: "First split the market, then choose a segment, then decide how to stand out to it.",
            },
            {
              id: "q3",
              question: "A buyer persona is best described as:",
              options: [
                "A real customer's private data",
                "A made-up mascot for the brand",
                "A research-based profile of a typical customer",
                "A list of every customer's email",
              ],
              answer: 2,
              explanation: "Personas summarize research about a group of real customers into one profile.",
            },
            {
              id: "q4",
              question: "Grouping customers by values and lifestyle is:",
              options: ["Psychographic", "Geographic", "Demographic", "Behavioral"],
              answer: 0,
              explanation: "Psychographic segmentation is about attitudes, values and lifestyle.",
            },
          ],
        },
      },
      {
        number: 3,
        title: "The 4 Ps and positioning",
        goal: "Use the marketing mix to compare products and write a clear positioning statement.",
        lessons: [
          {
            id: "m3-four-ps",
            title: "The 4 Ps with real world examples",
            kind: "video",
            minutes: 9,
            status: "verified",
            youtubeId: "g_gEOf0UePw",
            source: "Business School 101",
            summary: "Product, price, place and promotion, shown through well known brands.",
            notePrompt: "Define each of the 4 Ps in one sentence. Which P do you think matters most for a phone brand?",
          },
          {
            id: "m3-four-ps-campaigns",
            title: "Using the 4 Ps to plan campaigns",
            kind: "video",
            minutes: 7,
            status: "verified",
            youtubeId: "HFjbrjWjUWc",
            source: "HubSpot Marketing",
            summary: "How marketers use the 4 Ps as a checklist before launching a campaign.",
            notePrompt: "How does the video suggest using the 4 Ps in practice? Write down one tip you would use.",
          },
          {
            id: "m3-positioning-video",
            title: "What is brand positioning?",
            kind: "video",
            minutes: 10,
            status: "verified",
            youtubeId: "Rcv-J6534oE",
            source: "Brand Master Academy",
            summary: "Why customers choose one brand over another and how companies claim a spot in their minds.",
            notePrompt: "What is positioning? Describe how two competing brands position themselves differently.",
          },
          {
            id: "m3-positioning-reading",
            title: "Positioning (marketing)",
            kind: "article",
            minutes: 20,
            status: "verified",
            url: "https://en.wikipedia.org/wiki/Positioning_(marketing)",
            source: "Wikipedia",
            summary: "The history of positioning and the standard parts of a positioning statement.",
            notePrompt: "Write the parts of a positioning statement. Draft one for your favorite brand.",
          },
        ],
        assignment: {
          id: "m3-assignment",
          title: "Compare two competitors",
          prompt:
            "Pick two brands that compete (for example two sneaker, phone or streaming brands). Compare them using the 4 Ps in a short paragraph for each P. Then write one positioning statement for the brand you think is weaker, using this format: For [target customer] who [need], [brand] is the [category] that [key benefit] because [reason to believe].",
          minWords: 180,
          minutes: 45,
        },
        quiz: {
          id: "m3-quiz",
          passPercent: 60,
          minutes: 10,
          questions: [
            {
              id: "q1",
              question: "Which of these is part of 'Place' in the 4 Ps?",
              options: ["The product's color", "Where and how the product is sold", "A discount code", "A TV commercial"],
              answer: 1,
              explanation: "Place covers distribution: stores, websites, apps and how the product gets to customers.",
            },
            {
              id: "q2",
              question: "A 20% off weekend sale is mainly a decision about:",
              options: ["Product", "Price", "Place", "Positioning"],
              answer: 1,
              explanation: "Discounts change the price customers pay.",
            },
            {
              id: "q3",
              question: "Positioning is about:",
              options: [
                "Where the product sits on a store shelf",
                "The spot a brand holds in customers' minds compared to competitors",
                "The order of slides in a pitch deck",
                "Hiring the right salespeople",
              ],
              answer: 1,
              explanation: "Positioning is how customers see a brand relative to its alternatives.",
            },
            {
              id: "q4",
              question: "Which belongs in a positioning statement?",
              options: ["The CEO's name", "The target customer and key benefit", "Last year's revenue", "The office address"],
              answer: 1,
              explanation: "A positioning statement names who it is for and why it is the better choice for them.",
            },
            {
              id: "q5",
              question: "An influencer partnership on Instagram is part of which P?",
              options: ["Promotion", "Product", "Price", "Place"],
              answer: 0,
              explanation: "Promotion covers how a brand communicates: ads, social, PR and partnerships.",
            },
          ],
        },
      },
      {
        number: 4,
        title: "Plans, metrics and marketing careers",
        goal: "Put the pieces together in a simple plan and see what marketing jobs look like.",
        lessons: [
          {
            id: "m4-plan-video",
            title: "A 5 step system for a marketing plan",
            kind: "video",
            minutes: 5,
            status: "verified",
            youtubeId: "lDdTW0o7N6Q",
            source: "HubSpot Marketing",
            summary: "The steps marketers follow to turn goals into a plan they can measure.",
            notePrompt: "List the five steps. Which step would be hardest for a small business and why?",
          },
          {
            id: "m4-plan-template",
            title: "Marketing plan template",
            kind: "article",
            minutes: 20,
            status: "verified",
            url: "https://blog.hubspot.com/marketing/marketing-plan-template-generator",
            source: "HubSpot",
            summary: "The sections of a real marketing plan, with examples you can copy.",
            notePrompt: "Which sections does a marketing plan include? Which metric would you track for a school event?",
          },
          {
            id: "m4-careers",
            title: "Marketing managers: pay, outlook and how to get there",
            kind: "article",
            minutes: 20,
            status: "needs review",
            url: "https://www.bls.gov/ooh/management/advertising-promotions-and-marketing-managers.htm",
            source: "U.S. Bureau of Labor Statistics",
            linkNote: "bls.gov blocks automated checks; confirm this page opens.",
            summary: "Official data on what marketing managers do, the education they need and what they earn.",
            notePrompt: "What degree and experience do marketing managers usually have? What is the median pay?",
          },
        ],
        assignment: {
          id: "m4-assignment",
          title: "Final project: Research a marketing company",
          finalProject: true,
          prompt:
            "Research one company that sells marketing products or services (for example an ad agency, HubSpot, Canva or Mailchimp). Explain how it makes money, who its customers are, and one marketing job you could have there. Finish with a three sentence plan to promote one of its products to students: the goal, the channel, and the metric you would track.",
          minWords: 180,
          minutes: 45,
        },
        quiz: {
          id: "m4-quiz",
          passPercent: 60,
          minutes: 10,
          questions: [
            {
              id: "q1",
              question: "Which is a good, measurable marketing goal?",
              options: [
                "Make the brand cooler",
                "Get 200 sign-ups for the club fair by Friday",
                "Post more",
                "Be the best club",
              ],
              answer: 1,
              explanation: "Good goals are specific, measurable and have a deadline.",
            },
            {
              id: "q2",
              question: "Click-through rate measures:",
              options: [
                "How many people saw an ad",
                "The share of people who clicked after seeing something",
                "How much an ad cost",
                "How long a video is",
              ],
              answer: 1,
              explanation: "Click-through rate is clicks divided by impressions.",
            },
            {
              id: "q3",
              question: "Most marketing managers start their careers with:",
              options: [
                "No degree and no experience",
                "A bachelor's degree and experience in a related role",
                "A medical license",
                "A law degree",
              ],
              answer: 1,
              explanation: "Most have a bachelor's degree and several years in roles like sales, advertising or analysis.",
            },
            {
              id: "q4",
              question: "What should a marketing plan include?",
              options: [
                "Goals, target audience, channels and how success is measured",
                "Only the budget",
                "Only a logo and slogan",
                "A list of competitors' employees",
              ],
              answer: 0,
              explanation: "A plan connects goals to an audience, a set of channels and the metrics that show it worked.",
            },
          ],
        },
      },
    ],
  },
];

TRACKS.push(...CAREER_TRACKS);

export function getTrack(slug: string): Track | undefined {
  return TRACKS.find((t) => t.slug === slug);
}

/** Tracks relevant to a Resources search term or career cluster. */
export function tracksForSearch(term: string, clusterId?: string | null): Track[] {
  const q = term.toLowerCase();
  return TRACKS.filter(
    (t) =>
      (clusterId && t.clusterIds.includes(clusterId)) ||
      t.keywords.some((k) => q.includes(k)) ||
      q.includes(t.career.toLowerCase())
  );
}
