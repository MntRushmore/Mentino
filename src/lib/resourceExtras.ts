/**
 * Extra, student-focused recommendations for the Resources search, keyed by
 * career cluster id (see CAREER_CLUSTERS in careerMapping.ts).
 */

export interface Channel { name: string; why: string }
export interface StudentSteps { highSchool: string[]; college: string[] }

export const CHANNELS: Record<string, Channel[]> = {
  technology: [
    { name: "freeCodeCamp.org", why: "Full, free courses on coding, web development and data." },
    { name: "CS50", why: "Harvard's intro computer science class, every lecture free." },
    { name: "Fireship", why: "Short videos that explain new tech in minutes." },
    { name: "Tech With Tim", why: "Beginner Python and project tutorials." },
  ],
  business: [
    { name: "Y Combinator", why: "Founders and investors explain how startups really grow." },
    { name: "Harvard Business Review", why: "Clear explainers on management, strategy and careers." },
    { name: "CNBC Make It", why: "Career paths, salaries and money basics for young people." },
  ],
  healthcare: [
    { name: "Med School Insiders", why: "What pre-med and medical school are really like." },
    { name: "Ninja Nerd", why: "Free anatomy and physiology lectures." },
    { name: "Osmosis from Elsevier", why: "Short, visual explanations of diseases and the body." },
  ],
  engineering: [
    { name: "Practical Engineering", why: "How bridges, dams and city systems work." },
    { name: "Real Engineering", why: "Deep dives on aircraft, energy and big machines." },
    { name: "Mark Rober", why: "Former NASA engineer building fun experiments." },
  ],
  creative: [
    { name: "The Futur", why: "Running a design career and pricing creative work." },
    { name: "Flux Academy", why: "Web and UI design for beginners." },
    { name: "Proko", why: "Drawing fundamentals taught by working artists." },
  ],
  education: [
    { name: "TED-Ed", why: "Model lessons on almost any subject." },
    { name: "Edutopia", why: "What works in real classrooms, from teachers." },
    { name: "CrashCourse", why: "Fast, clear courses on school subjects." },
  ],
  law: [
    { name: "LegalEagle", why: "A practicing lawyer explains real cases and legal ideas." },
    { name: "CrashCourse", why: "The Government and Politics series covers how law works." },
    { name: "LSAT Demon", why: "How the LSAT and law school admissions work." },
  ],
  trades: [
    { name: "Electrician U", why: "Real electrical work explained by a licensed electrician." },
    { name: "This Old House", why: "Carpentry, plumbing and building done by pros." },
    { name: "Essential Craftsman", why: "Decades of construction experience, explained simply." },
  ],
  science: [
    { name: "Kurzgesagt", why: "Animated explainers on biology, space and physics." },
    { name: "Veritasium", why: "Science questions answered with experiments." },
    { name: "SciShow", why: "Quick, accurate science news and explainers." },
  ],
  media: [
    { name: "Peter McKinnon", why: "Photography and video skills for beginners." },
    { name: "Film Riot", why: "How to make films on a small budget." },
    { name: "Colin and Samir", why: "How creators build audiences and careers." },
  ],
  sports: [
    { name: "Front Office Sports", why: "The business side of sports: teams, media, careers." },
    { name: "Jeff Nippard", why: "Training and nutrition explained with research." },
    { name: "ESPN", why: "Coverage and interviews across every major sport." },
  ],
  finance: [
    { name: "Rareliquid", why: "What investment banking and finance jobs are like day to day." },
    { name: "The Plain Bagel", why: "Investing and markets explained without hype." },
    { name: "Ben Felix", why: "Evidence-based personal finance and investing." },
  ],
};

export const STUDENT_STEPS: Record<string, StudentSteps> = {
  technology: {
    highSchool: ["Take AP Computer Science A or Principles", "Build one small project, like a website or game", "Join or start a coding club or hackathon team"],
    college: ["Major in computer science, data science or information systems", "Apply for summer internships starting sophomore year", "Put 2 or 3 projects on GitHub to show employers"],
  },
  business: {
    highSchool: ["Join DECA or FBLA", "Run a small business or club fundraiser", "Take economics or AP Macroeconomics"],
    college: ["Major in business, economics or marketing", "Join a consulting or investment club", "Do one internship before senior year"],
  },
  healthcare: {
    highSchool: ["Take biology, chemistry and AP science", "Volunteer at a hospital or clinic", "Join HOSA or shadow a healthcare worker"],
    college: ["Complete pre-med or pre-health requirements", "Get clinical hours as a scribe, EMT or CNA", "Plan for the MCAT or your program's entrance exam"],
  },
  engineering: {
    highSchool: ["Take calculus and physics", "Join robotics or a STEM competition", "Build something with Arduino or a 3D printer"],
    college: ["Choose an engineering major in your first year", "Join a project team like Formula SAE or Engineers Without Borders", "Look for co-op programs and summer internships"],
  },
  creative: {
    highSchool: ["Take art, design or media classes", "Start a portfolio of 10 of your best pieces", "Enter school or local art shows"],
    college: ["Major in design, fine arts or a related field", "Freelance for campus groups to build real work", "Keep an online portfolio updated"],
  },
  education: {
    highSchool: ["Tutor younger students", "Volunteer at a camp or after-school program", "Take psychology or child development"],
    college: ["Major in education or the subject you want to teach", "Complete student teaching hours", "Pass your state's teaching certification exam"],
  },
  law: {
    highSchool: ["Join debate, mock trial or Model UN", "Take government and AP English", "Shadow or interview a lawyer"],
    college: ["Any major works; pick one that builds writing and reasoning", "Keep your GPA high and plan for the LSAT", "Intern at a law office or public defender"],
  },
  trades: {
    highSchool: ["Take shop, auto or construction classes", "Look for a career and technical education (CTE) program", "Ask local contractors about summer helper jobs"],
    college: ["Enroll in a trade school or community college program", "Apply for a paid apprenticeship", "Work toward your state license"],
  },
  science: {
    highSchool: ["Take AP Biology, Chemistry or Physics", "Enter a science fair", "Email a local lab about summer programs"],
    college: ["Major in a natural science", "Join a professor's research lab early", "Present at a student research conference"],
  },
  media: {
    highSchool: ["Write for the school paper or yearbook", "Start a channel, podcast or blog", "Learn basic editing in a free tool"],
    college: ["Major in journalism, communications or film", "Work at the campus newspaper, radio or TV", "Intern at a newsroom, studio or agency"],
  },
  sports: {
    highSchool: ["Play, manage or keep stats for a school team", "Take anatomy or health science", "Volunteer at youth sports events"],
    college: ["Major in kinesiology, sports management or business", "Work with your athletic department", "Intern with a team, gym or sports agency"],
  },
  finance: {
    highSchool: ["Take economics and statistics", "Join an investing or personal finance club", "Track a mock stock portfolio"],
    college: ["Major in finance, economics or accounting", "Join the investment club and learn financial modeling", "Apply early for junior year internships"],
  },
};

/** "high school" or "college", from a student's grade_or_year field. */
export function stageFromGrade(grade?: string | null): "high school" | "college" | null {
  if (!grade) return null;
  const g = grade.toLowerCase();
  if (/(college|university|freshman|sophomore|junior|senior|undergrad|grad)/.test(g) && !/(9th|10th|11th|12th|high)/.test(g)) return "college";
  if (/(9|10|11|12|high)/.test(g)) return "high school";
  return null;
}

export function channelLink(name: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(name)}&sp=EgIQAg%253D%253D`;
}

/** Hand-picked, verified YouTube videos per career cluster (watch links, not searches). */
export interface TopVideo { id: string; title: string; channel: string }

export const TOP_VIDEOS: Record<string, TopVideo[]> = {
  business: [
    { id: "o7Ik1OB4TaE", title: "What Is Strategy? It's a Lot Simpler Than You Think", channel: "Harvard Business Review" },
    { id: "bAhM3td5PzY", title: "6 tips on being a successful entrepreneur", channel: "TEDx Talks" },
    { id: "HB3l1BPi7zo", title: "How Do Billion Dollar Startups Start?", channel: "Y Combinator" },
    { id: "CBYhVcO4WgI", title: "How to Start a Startup, Lecture 1 (Sam Altman, Dustin Moskovitz)", channel: "Y Combinator" },
    { id: "LZ2aHY4divg", title: "Careers for Business Students (and what they pay)", channel: "Kenji Explains" },
    { id: "ZU9x1vFx5lI", title: "Stand Out in a Job Interview", channel: "Harvard Business Review" },
  ],
};
