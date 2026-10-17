/**
 * Six "Intro to Careers" tracks, one per signup career category.
 *
 * Weekly format (about 2 to 3 hours):
 *   Lesson 1: video + required notes
 *   Lesson 2: video or article + required notes
 *   Reading:  article (notes optional)
 *   Assignment (45 to 60 min), text response. Week 4 is the final project.
 *   Quiz: 4 multiple choice questions (10 min)
 *
 * Every resource has a review status:
 *   "verified"     opened when added; title, creator, length and date matched.
 *   "needs review" could not be checked automatically (site blocks bots, or no
 *                  video passed the quality rules). These use a main page, a
 *                  YouTube search link, or an "[ADD VIDEO: topic]" placeholder.
 * Never replace a placeholder with a URL that hasn't been opened and checked.
 */
import type { Lesson, ReviewStatus, Track } from "./tracks";

const ytSearch = (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
const BLS_OOH = "https://www.bls.gov/ooh/";

function video(
  id: string,
  o: { youtubeId: string; title: string; source: string; minutes: number; summary: string; notePrompt: string }
): Lesson {
  return { id, kind: "video", status: "verified", ...o };
}

/** A video slot where no video passed the rules: links to a YouTube search and keeps the placeholder. */
function videoNeeded(id: string, topic: string, o: { title: string; minutes: number; summary: string; notePrompt: string }): Lesson {
  return {
    id,
    kind: "video",
    status: "needs review",
    url: ytSearch(`${topic} explained`),
    placeholder: `[ADD VIDEO: ${topic}]`,
    source: "YouTube search",
    linkNote: "Pick an 8 to 30 minute video from an established channel.",
    ...o,
  };
}

function article(
  id: string,
  o: { url: string; title: string; source: string; minutes: number; summary: string; notePrompt: string; status?: ReviewStatus; linkNote?: string }
): Lesson {
  return { id, kind: "article", status: o.status ?? "verified", ...o };
}

function reading(
  id: string,
  o: { url: string; title: string; source: string; summary: string; minutes?: number; status?: ReviewStatus; linkNote?: string }
): Lesson {
  return { id, kind: "reading", minutes: o.minutes ?? 20, status: o.status ?? "verified", notePrompt: "Optional: write down anything you want to remember.", ...o };
}

function blsReading(id: string, search: string, summary: string): Lesson {
  return reading(id, {
    url: BLS_OOH,
    title: "Occupational Outlook Handbook: pay, education and job outlook",
    source: "U.S. Bureau of Labor Statistics",
    summary,
    status: "needs review",
    linkNote: `bls.gov blocks automated checks. Use the search box for: ${search}.`,
  });
}

const STD = { passPercent: 60, minutes: 10 } as const;

export const CAREER_TRACKS: Track[] = [
  // ── 1. Technology ─────────────────────────────────────────────────────────
  {
    slug: "intro-to-careers-in-technology",
    title: "Intro to Careers in Technology",
    career: "Technology",
    categories: ["Technology & Software"],
    shortDescription: "Explore the main tech roles, how software gets built, and the first steps into the industry.",
    description:
      "Tech is more than coding. In four weeks you will meet the main roles inside tech companies, see how software is planned and built, get a feel for data, AI and cybersecurity, and finish with a career plan and portfolio outline you can start working on now.",
    difficulty: "Beginner",
    hoursPerWeek: "2 to 3 hours",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
    outcomes: [
      "Compare software engineering, product, data, design and security roles",
      "Explain how tech companies make money",
      "Describe how a product goes from idea to release on an agile team",
      "Find patterns in a small dataset and explain them",
      "Explain the basics of AI and how to stay secure online",
      "Write a tech career plan and portfolio outline",
    ],
    keywords: ["technology", "tech", "software", "coding", "programming", "computer science", "data", "ai", "cybersecurity", "product manager", "ux"],
    clusterIds: ["technology"],
    weeks: [
      {
        number: 1,
        title: "The tech landscape",
        goal: "Meet the main tech roles and understand how tech companies earn money.",
        lessons: [
          videoNeeded("t1-l1", "tech jobs software engineer product manager data analyst", {
            title: "Tech jobs explained",
            minutes: 15,
            summary: "What software engineers, product managers, data analysts, UX designers and security analysts each do.",
            notePrompt: "Pick three tech roles. What does each one do day to day, and how do they work together?",
          }),
          videoNeeded("t1-l2", "how tech companies make money", {
            title: "How tech companies make money",
            minutes: 15,
            summary: "Ads, subscriptions, selling hardware, taking a cut of sales, and selling software to businesses.",
            notePrompt: "Name three ways tech companies earn money and give a real company for each one.",
          }),
          blsReading("t1-r", "software developers, data scientists, information security analysts", "Official pay, education and outlook for the main tech jobs."),
        ],
        assignment: {
          id: "t1-a",
          title: "Compare three tech roles",
          prompt:
            "Pick three roles: for example software engineer, product manager, data analyst, UX designer or cybersecurity analyst. For each, describe the daily work, the skills needed, and the typical salary range (use the BLS handbook). Finish with which one fits you best and why.",
          minWords: 200,
          minutes: 50,
        },
        quiz: {
          id: "t1-q",
          ...STD,
          questions: [
            { id: "q1", question: "Who decides what a product should do and why, then works with engineers and designers to build it?", options: ["Product manager", "Database administrator", "Network technician", "Accountant"], answer: 0, explanation: "Product managers own the 'what' and 'why' of a product." },
            { id: "q2", question: "A company earns money each month from users who pay for access. That model is called:", options: ["Advertising", "Subscription", "Hardware sales", "Licensing a patent"], answer: 1, explanation: "Recurring payments for access are a subscription model." },
            { id: "q3", question: "Which role focuses on finding patterns in data to answer business questions?", options: ["UX designer", "Data analyst", "Recruiter", "IT support"], answer: 1, explanation: "Data analysts turn raw data into answers and insights." },
            { id: "q4", question: "A free app that earns money by showing ads mainly makes money from:", options: ["Its users' subscriptions", "Advertisers", "Selling phones", "Government grants"], answer: 1, explanation: "With ad-supported apps, advertisers pay to reach the users." },
          ],
        },
      },
      {
        number: 2,
        title: "How software gets built",
        goal: "Understand coding basics, the product development cycle, and how agile teams work.",
        lessons: [
          video("t2-l1", {
            youtubeId: "qkFYqY3vr84",
            title: "Coding is easy, actually",
            source: "easy, actually",
            minutes: 10,
            summary: "A plain-language look at what code is and how programs follow instructions step by step.",
            notePrompt: "In your own words, what is a program? Describe one everyday task you could break into step-by-step instructions.",
          }),
          video("t2-l2", {
            youtubeId: "vxpKA9UuM1w",
            title: "Complete Agile course in 15 minutes",
            source: "David McLachlan",
            minutes: 15,
            summary: "Sprints, backlogs, stand-ups and why teams ship small pieces often.",
            notePrompt: "What is a sprint, and why do agile teams release small pieces instead of everything at once?",
          }),
          reading("t2-r", {
            url: "https://www.ibm.com/think/topics/sdlc",
            title: "What is the Software Development Lifecycle (SDLC)?",
            source: "IBM",
            summary: "The phases software moves through: planning, design, building, testing, release and maintenance.",
          }),
        ],
        assignment: {
          id: "t2-a",
          title: "Write a product spec",
          prompt:
            "Invent an app that solves a problem at your school or in your community. Write a short product spec with: the problem, who the users are, three key features (one sentence each), what you would build first, and how you would know it works.",
          minWords: 200,
          minutes: 55,
        },
        quiz: {
          id: "t2-q",
          ...STD,
          questions: [
            { id: "q1", question: "In agile, a sprint is:", options: ["A short, fixed period where a team builds a set of features", "The final launch party", "A type of programming language", "A bug"], answer: 0, explanation: "Sprints are short cycles, often 1 to 4 weeks." },
            { id: "q2", question: "Which phase comes right after building software in the development lifecycle?", options: ["Planning", "Testing", "Marketing", "Hiring"], answer: 1, explanation: "Code is tested before it is released." },
            { id: "q3", question: "A product spec mainly describes:", options: ["The company's profits", "The problem, users and features of a product", "Employees' schedules", "Server prices"], answer: 1, explanation: "Specs make sure everyone agrees on what to build and why." },
            { id: "q4", question: "Why do teams release small updates often?", options: ["To get feedback early and fix problems sooner", "Because big releases are illegal", "To avoid testing", "To use less electricity"], answer: 0, explanation: "Frequent small releases surface problems while they are cheap to fix." },
          ],
        },
      },
      {
        number: 3,
        title: "Data, AI and cybersecurity",
        goal: "See what data analysts do, how AI works at a basic level, and how to stay secure online.",
        lessons: [
          video("t3-l1", {
            youtubeId: "t2VuELCQBHA",
            title: "What I actually do as a data analyst",
            source: "Agatha",
            minutes: 9,
            summary: "A working data analyst on daily tasks, tools, pay and the parts of the job nobody mentions.",
            notePrompt: "Which tools does a data analyst use, and what kinds of questions do they answer?",
          }),
          video("t3-l2", {
            youtubeId: "qYNweeDHiyU",
            title: "AI, machine learning, deep learning and generative AI explained",
            source: "IBM Technology",
            minutes: 10,
            summary: "How these terms fit inside each other, explained by IBM.",
            notePrompt: "Explain the difference between AI, machine learning and generative AI in your own words.",
          }),
          reading("t3-r", {
            url: "https://www.cisa.gov/secure-our-world",
            title: "Secure Our World",
            source: "CISA (U.S. Cybersecurity and Infrastructure Security Agency)",
            summary: "Four simple habits that block most attacks: strong passwords, multifactor authentication, updates and spotting phishing.",
          }),
        ],
        assignment: {
          id: "t3-a",
          title: "Find three insights in a dataset",
          prompt:
            "Copy this table into Google Sheets: Day | Visitors | Sign-ups. Mon | 120 | 6. Tue | 150 | 9. Wed | 90 | 3. Thu | 200 | 16. Fri | 180 | 12. Sat | 60 | 2. Sun | 70 | 4. Add a column for sign-up rate (Sign-ups divided by Visitors). Write three insights you notice, and one question you would want more data to answer.",
          minWords: 150,
          minutes: 50,
        },
        quiz: {
          id: "t3-q",
          ...STD,
          questions: [
            { id: "q1", question: "Machine learning is best described as:", options: ["Computers learning patterns from data", "Robots with arms", "Faster internet", "A spreadsheet formula"], answer: 0, explanation: "Machine learning finds patterns in data instead of following hand-written rules." },
            { id: "q2", question: "Multifactor authentication (MFA) means:", options: ["Using two or more ways to prove it's you", "Having many accounts", "Changing your password daily", "Sharing your password"], answer: 0, explanation: "MFA adds a second check, like a code on your phone." },
            { id: "q3", question: "A phishing message usually tries to:", options: ["Trick you into giving up passwords or clicking a harmful link", "Speed up your computer", "Update your apps", "Back up your files"], answer: 0, explanation: "Phishing imitates trusted senders to steal information." },
            { id: "q4", question: "If 16 of 200 visitors sign up, the sign-up rate is:", options: ["16%", "8%", "1.6%", "32%"], answer: 1, explanation: "16 divided by 200 is 0.08, or 8%." },
          ],
        },
      },
      {
        number: 4,
        title: "Breaking into tech",
        goal: "Learn how students get internships, build a portfolio and use GitHub.",
        lessons: [
          video("t4-l1", {
            youtubeId: "8QC3Z1GNU_4",
            title: "How I landed my dream internship (and you can too)",
            source: "Johnathan Mo",
            minutes: 13,
            summary: "A student's path to a tech internship: projects, applications and interviews.",
            notePrompt: "What steps did this student take before applying? Which could you start this month?",
          }),
          video("t4-l2", {
            youtubeId: "r8jQ9hVA2qs",
            title: "A brief introduction to Git for beginners",
            source: "GitHub",
            minutes: 9,
            summary: "GitHub's own intro to version control, repositories and commits.",
            notePrompt: "What problem does Git solve? Explain a repository and a commit.",
          }),
          reading("t4-r", {
            url: "https://www.freecodecamp.org/news/how-to-build-a-developer-portfolio-website/",
            title: "How to build your own developer portfolio website",
            source: "freeCodeCamp",
            summary: "What to put on a portfolio site and how to build a simple one.",
          }),
        ],
        assignment: {
          id: "t4-a",
          title: "Final project: Tech career plan and portfolio outline",
          finalProject: true,
          prompt:
            "Write a one-page tech career plan: the role you're aiming for, three skills to learn this year, free resources you'll use, and one internship or program to apply to. Then outline a portfolio with three project ideas, what each shows about you, and where you will host it (GitHub or a personal site).",
          minWords: 300,
          minutes: 60,
        },
        quiz: {
          id: "t4-q",
          ...STD,
          questions: [
            { id: "q1", question: "On GitHub, a repository is:", options: ["A project folder that tracks every change", "A job posting", "A type of laptop", "A chat app"], answer: 0, explanation: "Repositories hold a project's files and history." },
            { id: "q2", question: "A commit is:", options: ["A saved snapshot of changes with a message", "A paid subscription", "An interview round", "A bug report"], answer: 0, explanation: "Commits record what changed and why." },
            { id: "q3", question: "Which best shows an employer you can build things?", options: ["A portfolio of real projects", "A long list of hobbies", "Your phone model", "Followers count"], answer: 0, explanation: "Projects are proof of skills." },
            { id: "q4", question: "For a first internship, students usually stand out by:", options: ["Showing projects and applying early to many places", "Waiting to be invited", "Only applying to one company", "Skipping the resume"], answer: 0, explanation: "Projects plus many early applications increase your chances." },
          ],
        },
      },
    ],
  },

  // ── 2. Medicine & Healthcare ──────────────────────────────────────────────
  {
    slug: "intro-to-careers-in-medicine-and-healthcare",
    title: "Intro to Careers in Medicine & Healthcare",
    career: "Medicine & Healthcare",
    categories: ["Medicine & Healthcare"],
    shortDescription: "Map healthcare careers, see how medicine and the health system work, and plan your path in.",
    description:
      "Healthcare has dozens of careers beyond doctor. In four weeks you will compare the main paths and their training, learn how diagnosis works, understand the health system and medical ethics, and build your own roadmap with shadowing, volunteering and starter certifications.",
    difficulty: "Beginner",
    hoursPerWeek: "2 to 3 hours",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&q=80",
    outcomes: [
      "Compare doctor, nurse, PA, pharmacist, physical therapist and public health careers",
      "Explain the education path and time for each",
      "Describe how doctors reach a diagnosis",
      "Explain insurance basics, informed consent and patient confidentiality",
      "Plan shadowing, volunteering and starter certifications like CNA and EMT",
    ],
    keywords: ["medicine", "healthcare", "health", "doctor", "nurse", "nursing", "pre-med", "physician", "pharmacist", "physical therapy", "public health", "emt"],
    clusterIds: ["healthcare"],
    weeks: [
      {
        number: 1,
        title: "The healthcare career map",
        goal: "Compare the main healthcare careers and the education each one takes.",
        lessons: [
          video("m1-l1", {
            youtubeId: "2kyPgu03pgE",
            title: "Top 10 highest paying healthcare jobs",
            source: "Med School Insiders",
            minutes: 12,
            summary: "A tour of well-paid healthcare careers, with the training and tradeoffs for each.",
            notePrompt: "List three careers from the video, the training each needs, and one tradeoff for each.",
          }),
          video("m1-l2", {
            youtubeId: "9vDOvaLKUS0",
            title: "Day in the life of an urgent care physician assistant",
            source: "Daniela Mendes",
            minutes: 13,
            summary: "A physician assistant's shift: seeing patients, ordering tests and working with doctors.",
            notePrompt: "What does a PA do on a typical shift? How is the role different from a doctor's?",
          }),
          blsReading("m1-r", "physicians and surgeons, registered nurses, physician assistants, pharmacists, physical therapists", "Official pay, schooling and outlook for each healthcare career."),
        ],
        assignment: {
          id: "m1-a",
          title: "Compare two healthcare careers",
          prompt:
            "Pick two healthcare careers. Compare them on: years of school after high school, rough cost of training, time until you are working, daily work, and pay (use the BLS handbook). Finish with which one you'd choose today and what would change your mind.",
          minWords: 200,
          minutes: 50,
        },
        quiz: {
          id: "m1-q",
          ...STD,
          questions: [
            { id: "q1", question: "Which usually takes the longest training after high school?", options: ["Physician (MD or DO)", "Certified nursing assistant", "EMT", "Pharmacy technician"], answer: 0, explanation: "Physicians do college, 4 years of medical school and 3 or more years of residency." },
            { id: "q2", question: "Physician assistants:", options: ["Diagnose and treat patients as part of a team with physicians", "Only file insurance paperwork", "Only work in pharmacies", "Do not need any license"], answer: 0, explanation: "PAs are licensed clinicians who diagnose and treat patients." },
            { id: "q3", question: "Public health focuses on:", options: ["The health of whole communities", "One patient at a time only", "Hospital billing", "Cosmetic surgery"], answer: 0, explanation: "Public health works on prevention and community-wide health." },
            { id: "q4", question: "The best official source for healthcare job pay and outlook is:", options: ["The BLS Occupational Outlook Handbook", "A random social media post", "A video game", "A movie"], answer: 0, explanation: "The BLS publishes official data for each occupation." },
          ],
        },
      },
      {
        number: 2,
        title: "How medicine works",
        goal: "Learn basic anatomy vocabulary and how doctors reason toward a diagnosis.",
        lessons: [
          videoNeeded("m2-l1", "introduction to anatomy and physiology", {
            title: "Introduction to anatomy and physiology",
            minutes: 12,
            summary: "The body's main organ systems and how structure relates to function.",
            notePrompt: "Name four organ systems and what each one does.",
          }),
          video("m2-l2", {
            youtubeId: "aL69B3SXwK0",
            title: "How to think like a doctor: chief complaint and differential diagnosis",
            source: "Dr. Philip Tisdall",
            minutes: 16,
            summary: "How clinicians go from a patient's complaint to a list of possible causes, then narrow it down.",
            notePrompt: "What is a differential diagnosis? Describe the steps a doctor uses to narrow it down.",
          }),
          reading("m2-r", {
            url: "https://medlineplus.gov/medwords/",
            title: "Understanding Medical Words tutorial",
            source: "MedlinePlus (National Library of Medicine)",
            summary: "How medical terms are built from roots, prefixes and suffixes.",
          }),
        ],
        assignment: {
          id: "m2-a",
          title: "Who would treat this patient?",
          prompt:
            "Case: A 16-year-old soccer player falls during a game and can't put weight on her right ankle. The ankle is swollen. Her coach calls her parents, who take her to urgent care. Explain which healthcare professionals would likely be involved from the field to full recovery (for example athletic trainer, urgent care clinician, radiology technologist, orthopedic doctor, physical therapist), what each one does, and why.",
          minWords: 200,
          minutes: 50,
        },
        quiz: {
          id: "m2-q",
          ...STD,
          questions: [
            { id: "q1", question: "A differential diagnosis is:", options: ["A list of possible conditions that could explain symptoms", "The final bill", "A type of medicine", "A hospital department"], answer: 0, explanation: "Doctors list possibilities, then test to narrow them down." },
            { id: "q2", question: "The suffix '-itis' means:", options: ["Inflammation", "Removal", "Study of", "Pain"], answer: 0, explanation: "Tonsillitis is inflammation of the tonsils." },
            { id: "q3", question: "Which system includes the heart and blood vessels?", options: ["Cardiovascular", "Digestive", "Skeletal", "Nervous"], answer: 0, explanation: "The cardiovascular system moves blood through the body." },
            { id: "q4", question: "The 'chief complaint' is:", options: ["The main reason the patient came in, in their words", "A complaint about the hospital", "The doctor's opinion", "A lab result"], answer: 0, explanation: "It is the starting point of the diagnostic process." },
          ],
        },
      },
      {
        number: 3,
        title: "The healthcare system and ethics",
        goal: "Understand hospitals vs clinics, insurance basics, public health, consent and confidentiality.",
        lessons: [
          video("m3-l1", {
            youtubeId: "dK4EV9wJPm0",
            title: "Anatomy of healthcare: the U.S. healthcare system explained",
            source: "Med School Insiders",
            minutes: 10,
            summary: "How patients, providers, hospitals and insurers connect, and who pays for what.",
            notePrompt: "Explain how insurance pays for care. What is a premium and what is a deductible?",
          }),
          videoNeeded("m3-l2", "medical ethics informed consent and confidentiality", {
            title: "Medical ethics: informed consent and confidentiality",
            minutes: 12,
            summary: "The core ethical principles in medicine and what makes patient consent valid.",
            notePrompt: "What makes consent 'informed'? Name the four ethical principles of medicine and define one.",
          }),
          reading("m3-r", {
            url: "https://medlineplus.gov/ency/patientinstructions/000445.htm",
            title: "Informed consent for adults",
            source: "MedlinePlus (National Library of Medicine)",
            summary: "What patients must be told before agreeing to treatment, and their right to say no.",
          }),
        ],
        assignment: {
          id: "m3-a",
          title: "Respond to an ethics dilemma",
          prompt:
            "Dilemma: A 17-year-old patient tells a nurse something private about their health and asks her not to tell their parents. The parents, who are in the waiting room, ask the nurse what is going on. Using the ideas of consent and confidentiality from this week, explain what the nurse should consider, what she could say, and why. (Real rules vary by state; focus on the reasoning.)",
          minWords: 180,
          minutes: 45,
        },
        quiz: {
          id: "m3-q",
          ...STD,
          questions: [
            { id: "q1", question: "A deductible is:", options: ["What you pay before insurance starts paying", "Your monthly insurance bill", "A doctor's salary", "A hospital fine"], answer: 0, explanation: "The monthly bill is the premium; the deductible comes first when you use care." },
            { id: "q2", question: "Informed consent requires that a patient:", options: ["Understands the risks, benefits and options and agrees freely", "Signs without reading", "Has a family member decide", "Pays first"], answer: 0, explanation: "Consent is only valid if it is informed and voluntary." },
            { id: "q3", question: "Patient confidentiality means:", options: ["Health information is kept private and shared only when allowed", "Doctors post cases online", "Anyone can view records", "Only parents can see records"], answer: 0, explanation: "Privacy rules protect patient information." },
            { id: "q4", question: "Compared to a clinic, a hospital typically:", options: ["Handles emergencies, surgery and overnight stays", "Only does check-ups", "Never has doctors", "Only sells medicine"], answer: 0, explanation: "Hospitals provide emergency and inpatient care." },
          ],
        },
      },
      {
        number: 4,
        title: "Your path into healthcare",
        goal: "Plan pre-med or other paths, shadowing, volunteering and starter certifications.",
        lessons: [
          video("m4-l1", {
            youtubeId: "RrKGr3JYCGw",
            title: "How to become a doctor (complete process explained)",
            source: "Med School Insiders",
            minutes: 15,
            summary: "Every step from high school through college, the MCAT, medical school and residency.",
            notePrompt: "List the steps to become a doctor in order, with roughly how long each takes.",
          }),
          video("m4-l2", {
            youtubeId: "iTC0Uk_I7RM",
            title: "Is EMT or paramedic worth it for premeds?",
            source: "Med School Insiders",
            minutes: 11,
            summary: "What EMT work involves, how long certification takes, and how it builds clinical experience.",
            notePrompt: "What are the pros and cons of becoming an EMT as a student?",
          }),
          reading("m4-r", {
            url: "https://students-residents.aamc.org/",
            title: "AAMC for students, applicants and residents",
            source: "Association of American Medical Colleges",
            summary: "The official guide to exploring medicine, preparing for medical school and applying.",
            linkNote: "Start with the 'Choosing a Medical Career' section.",
          }),
        ],
        assignment: {
          id: "m4-a",
          title: "Final project: Personal healthcare roadmap",
          finalProject: true,
          prompt:
            "Create your healthcare roadmap. Name your target career and a backup. Build a timeline from now through your first job: classes, a starter certification (CNA, EMT or another), shadowing and volunteering, college or training program, any entrance exam, and licensing. Add the total years and one way to test the career cheaply in the next 6 months.",
          minWords: 300,
          minutes: 60,
        },
        quiz: {
          id: "m4-q",
          ...STD,
          questions: [
            { id: "q1", question: "The exam most U.S. medical schools require is the:", options: ["MCAT", "LSAT", "GMAT", "SAT Subject Test"], answer: 0, explanation: "The MCAT is the Medical College Admission Test." },
            { id: "q2", question: "After medical school, new doctors complete:", options: ["Residency", "An MBA", "Law school", "Nothing more"], answer: 0, explanation: "Residency is supervised training in a specialty." },
            { id: "q3", question: "Shadowing means:", options: ["Following a professional to observe their work", "Working night shifts alone", "Taking an online quiz", "Writing a research paper"], answer: 0, explanation: "Shadowing lets you see the job up close." },
            { id: "q4", question: "Which starter certification lets you provide emergency care on an ambulance?", options: ["EMT", "Pharmacy technician", "Medical coder", "Phlebotomist"], answer: 0, explanation: "Emergency medical technicians respond to 911 calls." },
          ],
        },
      },
    ],
  },

  // ── 3. Law ────────────────────────────────────────────────────────────────
  {
    slug: "intro-to-careers-in-law",
    title: "Intro to Careers in Law",
    career: "Law",
    categories: ["Law & Legal Services"],
    shortDescription: "See what lawyers really do, how courts work, how to think like a lawyer, and the road to law school.",
    description:
      "Law is a mix of research, writing and argument. In four weeks you will learn the main practice areas, how cases move through court, the IRAC method lawyers use to analyze problems, and the path through college, the LSAT and law school. You'll finish by writing a persuasive legal memo.",
    difficulty: "Beginner",
    hoursPerWeek: "2 to 3 hours",
    image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=1200&q=80",
    outcomes: [
      "Explain litigation vs transactional law and other legal careers",
      "Describe the court system and civil vs criminal cases",
      "Summarize a Supreme Court case",
      "Analyze a problem with the IRAC method",
      "Plan the path through college, the LSAT and law school",
      "Write a persuasive legal memo",
    ],
    keywords: ["law", "lawyer", "attorney", "legal", "court", "paralegal", "law school", "lsat", "judge", "mock trial"],
    clusterIds: ["law"],
    weeks: [
      {
        number: 1,
        title: "What lawyers actually do",
        goal: "Understand litigation vs transactional law, practice areas and other legal careers.",
        lessons: [
          video("l1-l1", {
            youtubeId: "0GJmORbtXFs",
            title: "What being a Big Law attorney is really like",
            source: "Cece Xie",
            minutes: 16,
            summary: "A former large-firm lawyer on daily work, hours, pay and what she wishes she'd known.",
            notePrompt: "Describe a typical day at a large law firm. What surprised you?",
          }),
          video("l1-l2", {
            youtubeId: "sQfIZ5Nc_cQ",
            title: "Transactional lawyer vs litigation lawyer: what are the differences?",
            source: "Em and Lloyd",
            minutes: 9,
            summary: "Courtroom disputes vs deals and contracts, and the skills each needs.",
            notePrompt: "Explain litigation and transactional law. Which fits your personality better and why?",
          }),
          blsReading("l1-r", "lawyers, paralegals and legal assistants, judges", "Official pay, education and outlook for legal careers."),
        ],
        assignment: {
          id: "l1-a",
          title: "Research two practice areas",
          prompt:
            "Pick two practice areas (for example criminal defense, family, immigration, corporate, intellectual property or environmental law). For each, explain what a typical day looks like, who the clients are, and whether it is mostly litigation or transactional. Include one legal job that doesn't require being a lawyer, like paralegal or compliance analyst.",
          minWords: 200,
          minutes: 50,
        },
        quiz: {
          id: "l1-q",
          ...STD,
          questions: [
            { id: "q1", question: "Litigation is mainly about:", options: ["Resolving disputes, often in court", "Writing business contracts only", "Filing taxes", "Hiring employees"], answer: 0, explanation: "Litigators handle lawsuits and court disputes." },
            { id: "q2", question: "A transactional lawyer most often:", options: ["Drafts and negotiates deals and contracts", "Argues before juries", "Arrests suspects", "Runs elections"], answer: 0, explanation: "Transactional work focuses on deals rather than disputes." },
            { id: "q3", question: "A paralegal:", options: ["Assists lawyers with research and documents", "Is a judge", "Must pass the bar exam", "Represents clients alone in court"], answer: 0, explanation: "Paralegals support attorneys and don't need a law degree." },
            { id: "q4", question: "Which practice area deals with patents and trademarks?", options: ["Intellectual property", "Family law", "Criminal law", "Immigration"], answer: 0, explanation: "IP law protects inventions, brands and creative work." },
          ],
        },
      },
      {
        number: 2,
        title: "How the legal system works",
        goal: "Learn how courts are organized, civil vs criminal law, and how a case moves through court.",
        lessons: [
          videoNeeded("l2-l1", "how a case moves through court", {
            title: "How a case moves through court",
            minutes: 12,
            summary: "From filing to trial to appeal, and where most cases actually end.",
            notePrompt: "List the main steps of a case from start to finish. Where can it be appealed?",
          }),
          article("l2-l2", {
            url: "https://www.uscourts.gov/about-federal-courts/types-cases",
            title: "Types of cases: civil and criminal",
            source: "United States Courts",
            minutes: 20,
            summary: "How civil and criminal cases differ, who brings them and what is at stake.",
            notePrompt: "Compare civil and criminal cases: who brings them, the burden of proof, and possible outcomes.",
          }),
          reading("l2-r", {
            url: "https://www.uscourts.gov/about-federal-courts/court-role-and-structure",
            title: "Court role and structure",
            source: "United States Courts",
            summary: "District courts, courts of appeals and the Supreme Court, and what each does.",
          }),
        ],
        assignment: {
          id: "l2-a",
          title: "Summarize a Supreme Court case",
          prompt:
            "Choose a famous Supreme Court case (for example Brown v. Board of Education, Miranda v. Arizona, Tinker v. Des Moines or Gideon v. Wainwright). Use Oyez (oyez.org) to research it. Summarize the facts, the legal question, the decision and the Court's reasoning, and explain why it still matters today.",
          minWords: 220,
          minutes: 55,
        },
        quiz: {
          id: "l2-q",
          ...STD,
          questions: [
            { id: "q1", question: "In a criminal case, the prosecution must prove guilt:", options: ["Beyond a reasonable doubt", "By a preponderance of the evidence", "With any evidence at all", "By a vote of the public"], answer: 0, explanation: "Criminal cases have the highest standard of proof." },
            { id: "q2", question: "Most civil cases are decided by:", options: ["A preponderance of the evidence (more likely than not)", "Beyond a reasonable doubt", "A coin flip", "The president"], answer: 0, explanation: "Civil cases use a lower standard of proof." },
            { id: "q3", question: "In the federal system, trials happen in:", options: ["District courts", "The Supreme Court", "Congress", "City council"], answer: 0, explanation: "District courts are the federal trial courts." },
            { id: "q4", question: "If a party loses at trial in federal court, they usually appeal to:", options: ["A U.S. Court of Appeals", "A district court", "Congress", "A state legislature"], answer: 0, explanation: "Appeals go to the circuit courts of appeals." },
          ],
        },
      },
      {
        number: 3,
        title: "Thinking like a lawyer",
        goal: "Use legal reasoning and the IRAC method to build an argument.",
        lessons: [
          video("l3-l1", {
            youtubeId: "U9otse6UePU",
            title: "The secret code to reading legal opinions: IRAC",
            source: "BrynoDC",
            minutes: 9,
            summary: "Issue, Rule, Application, Conclusion, and how to spot each part in a court opinion.",
            notePrompt: "Define each step of IRAC with a one-sentence example.",
          }),
          video("l3-l2", {
            youtubeId: "p-2IscWNUkU",
            title: "Thinking like a lawyer",
            source: "TEDx Talks",
            minutes: 10,
            summary: "A lawyer on the habits behind legal reasoning: questioning assumptions and weighing both sides.",
            notePrompt: "What does 'thinking like a lawyer' mean according to the talk? Give an everyday example.",
          }),
          reading("l3-r", {
            url: "https://www.law.cornell.edu/wex/precedent",
            title: "Precedent",
            source: "Legal Information Institute, Cornell Law School",
            summary: "Why earlier decisions guide how courts decide new cases.",
          }),
        ],
        assignment: {
          id: "l3-a",
          title: "Write an IRAC analysis",
          prompt:
            "Scenario: A school rule says 'No phones may be used during class.' During a fire drill held during class time, Maya uses her phone to text her mom that she is safe. Her teacher gives her detention for breaking the rule. Write an IRAC analysis. Issue: did Maya break the rule? Rule: quote the rule. Application: argue both sides using the facts. Conclusion: decide, and explain why.",
          minWords: 220,
          minutes: 55,
        },
        quiz: {
          id: "l3-q",
          ...STD,
          questions: [
            { id: "q1", question: "In IRAC, the 'R' stands for:", options: ["Rule", "Reason", "Result", "Review"], answer: 0, explanation: "Issue, Rule, Application, Conclusion." },
            { id: "q2", question: "Which IRAC step applies the rule to the specific facts?", options: ["Application", "Issue", "Rule", "Conclusion"], answer: 0, explanation: "The application connects the rule to what happened." },
            { id: "q3", question: "Precedent means:", options: ["Earlier court decisions that guide later ones", "The newest law passed", "The judge's personal opinion", "A jury's vote"], answer: 0, explanation: "Courts follow past decisions on similar issues." },
            { id: "q4", question: "A strong legal argument should:", options: ["Address the strongest points on the other side", "Ignore the other side", "Rely on emotion only", "Avoid facts"], answer: 0, explanation: "Good lawyers anticipate counterarguments." },
          ],
        },
      },
      {
        number: 4,
        title: "The road to law",
        goal: "Plan college, the LSAT, law school, and experience like mock trial and debate.",
        lessons: [
          video("l4-l1", {
            youtubeId: "Qzv9ellioBA",
            title: "Soft factors that will make or break your application",
            source: "Michigan Law",
            minutes: 19,
            summary: "A law school admissions office explains what matters beyond grades and LSAT scores.",
            notePrompt: "Besides GPA and LSAT, what do law schools look at? How could you start building those now?",
          }),
          video("l4-l2", {
            youtubeId: "qwS1suoSimc",
            title: "How does mock trial work? The 5 parts of every trial",
            source: "Mock Trial Masterclass",
            minutes: 11,
            summary: "Opening statements, direct and cross examination, objections and closing arguments.",
            notePrompt: "List the parts of a trial in order. Which role would you want on a mock trial team?",
          }),
          reading("l4-r", {
            url: "https://www.lsac.org/lsat",
            title: "Take the LSAT",
            source: "Law School Admission Council",
            summary: "The official guide to the LSAT, including free practice tests.",
          }),
        ],
        assignment: {
          id: "l4-a",
          title: "Final project: Persuasive legal memo",
          finalProject: true,
          prompt:
            "Case: A city bans skateboarding in a public park after complaints about noise. A group of teen skaters argues the ban is unfair because the park is the only skating spot in town, and offers to skate only from 3 to 6 pm. Choose a side (the city or the skaters). Write a persuasive memo with: a heading, the question presented, a short facts section, your argument using IRAC, a response to the other side's best point, and a conclusion with what you want the decision-maker to do.",
          minWords: 350,
          minutes: 60,
        },
        quiz: {
          id: "l4-q",
          ...STD,
          questions: [
            { id: "q1", question: "The LSAT is run by:", options: ["The Law School Admission Council", "The American Medical Association", "The College Board", "The Supreme Court"], answer: 0, explanation: "LSAC administers the LSAT." },
            { id: "q2", question: "A full-time JD program usually takes:", options: ["3 years", "1 year", "6 years", "8 years"], answer: 0, explanation: "Most full-time law school programs take three years." },
            { id: "q3", question: "To become a lawyer in most U.S. states, after law school you must:", options: ["Pass the bar exam", "Pass the MCAT", "Win a mock trial", "Work as a judge"], answer: 0, explanation: "The bar exam is required for a license to practice." },
            { id: "q4", question: "Which undergraduate major is required for law school?", options: ["None; any major can apply", "Pre-law only", "Political science only", "History only"], answer: 0, explanation: "Law schools accept students from any major." },
          ],
        },
      },
    ],
  },

  // ── 4. Business & Finance ─────────────────────────────────────────────────
  {
    slug: "intro-to-careers-in-business-and-finance",
    title: "Intro to Careers in Business & Finance",
    career: "Business & Finance",
    categories: ["Business & Management", "Finance & Accounting"],
    shortDescription: "Learn how businesses make money, read financial statements, understand markets, and pitch an idea.",
    description:
      "Every company runs on the same basics: a model for making money, numbers that show how it's doing, and a strategy. In four weeks you'll learn business models and career paths, read real financial statements, understand stocks and bonds, and finish with a one-page business plan or startup pitch.",
    difficulty: "Beginner",
    hoursPerWeek: "2 to 3 hours",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80",
    outcomes: [
      "Explain business models and the difference between revenue and profit",
      "Compare finance, consulting, operations and entrepreneurship careers",
      "Read an income statement and a balance sheet",
      "Explain stocks, bonds, risk and diversification",
      "Use a SWOT analysis",
      "Write a one-page business plan or pitch",
    ],
    keywords: ["business", "finance", "money", "investing", "stocks", "entrepreneur", "startup", "accounting", "consulting", "banking", "economics"],
    clusterIds: ["business", "finance"],
    weeks: [
      {
        number: 1,
        title: "How businesses work",
        goal: "Understand business models, revenue vs profit, and the main business careers.",
        lessons: [
          video("b1-l1", {
            youtubeId: "2DYYO1OXMtM",
            title: "All of business explained in 20 minutes",
            source: "All i need is 20 minutes",
            minutes: 16,
            summary: "A fast overview of how companies create value, sell it and grow.",
            notePrompt: "What are the main parts of a business? Explain one business model with a real example.",
          }),
          videoNeeded("b1-l2", "revenue vs profit", {
            title: "Revenue vs profit",
            minutes: 10,
            summary: "Why a company can sell a lot and still lose money.",
            notePrompt: "Define revenue, costs and profit. Give an example where revenue is high but profit is low.",
          }),
          blsReading("b1-r", "financial analysts, management analysts, accountants and auditors, top executives", "Official pay, education and outlook for business and finance careers."),
        ],
        assignment: {
          id: "b1-a",
          title: "How does a company you use make money?",
          prompt:
            "Pick a company you use (Spotify, Nike, Chipotle, Roblox or another). Explain its business model: who pays it, for what, and how often. List its biggest costs and whether you think it's profitable. Which business career (finance, consulting, operations, marketing or entrepreneurship) would you want at that company, and why?",
          minWords: 200,
          minutes: 50,
        },
        quiz: {
          id: "b1-q",
          ...STD,
          questions: [
            { id: "q1", question: "Profit equals:", options: ["Revenue minus costs", "Revenue plus costs", "Number of customers", "Stock price"], answer: 0, explanation: "Profit is what's left after paying costs." },
            { id: "q2", question: "Revenue is:", options: ["The total money a company brings in from sales", "Money left after expenses", "The company's debt", "Employee salaries"], answer: 0, explanation: "Revenue is the top line, before costs." },
            { id: "q3", question: "Management consultants mainly:", options: ["Advise companies on solving problems and improving performance", "Build houses", "Teach classes", "Run cash registers"], answer: 0, explanation: "Consultants help companies make better decisions." },
            { id: "q4", question: "A business model describes:", options: ["How a company creates value and makes money", "Its office design", "Its logo", "Its holiday schedule"], answer: 0, explanation: "It explains who pays, for what and why." },
          ],
        },
      },
      {
        number: 2,
        title: "Money basics",
        goal: "Read income statements and balance sheets, and understand interest and personal finance.",
        lessons: [
          video("b2-l1", {
            youtubeId: "abh1PzKDAK0",
            title: "The income statement: all the basics",
            source: "Brian Feroldi",
            minutes: 10,
            summary: "Revenue, costs, operating income and net income, line by line.",
            notePrompt: "Walk through an income statement from top to bottom. What does net income tell you?",
          }),
          video("b2-l2", {
            youtubeId: "_VS4ni14JHs",
            title: "The balance sheet: all the basics",
            source: "Brian Feroldi",
            minutes: 12,
            summary: "Assets, liabilities and equity, and why they always balance.",
            notePrompt: "Explain assets, liabilities and equity. Why does a balance sheet always balance?",
          }),
          reading("b2-r", {
            url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/financial-statements",
            title: "Financial statements",
            source: "Investor.gov (U.S. Securities and Exchange Commission)",
            summary: "The SEC's plain-language definition of the main financial statements.",
          }),
        ],
        assignment: {
          id: "b2-a",
          title: "Read a real company's numbers",
          prompt:
            "Look up a public company on Yahoo Finance (finance.yahoo.com, open the 'Financials' tab) or in SEC EDGAR (sec.gov/edgar). Find its total revenue, net income, total assets and total liabilities for the latest year. Explain what each number shows and whether the company looks healthy, and why.",
          minWords: 180,
          minutes: 50,
        },
        quiz: {
          id: "b2-q",
          ...STD,
          questions: [
            { id: "q1", question: "The balance sheet equation is:", options: ["Assets = Liabilities + Equity", "Revenue = Profit", "Assets = Revenue - Costs", "Equity = Debt"], answer: 0, explanation: "Everything a company owns is funded by debt or owners." },
            { id: "q2", question: "Net income appears on the:", options: ["Income statement", "Balance sheet only", "Tax return only", "Business card"], answer: 0, explanation: "Net income is the bottom line of the income statement." },
            { id: "q3", question: "A liability is:", options: ["Something the company owes", "Something the company owns", "A customer", "A product"], answer: 0, explanation: "Loans and unpaid bills are liabilities." },
            { id: "q4", question: "Compound interest means you earn interest on:", options: ["Your original money and past interest", "Only your original money", "Only new deposits", "Nothing"], answer: 0, explanation: "Interest on interest makes savings grow faster over time." },
          ],
        },
      },
      {
        number: 3,
        title: "Markets and investing",
        goal: "Understand stocks, bonds, risk, and what moves markets.",
        lessons: [
          video("b3-l1", {
            youtubeId: "T37YvxMTofc",
            title: "Every stock market term explained",
            source: "The Paint Explainer",
            minutes: 13,
            summary: "Shares, indexes, bull and bear markets, dividends and more, in plain language.",
            notePrompt: "Define a stock, an index and a dividend. What makes a stock's price go up or down?",
          }),
          video("b3-l2", {
            youtubeId: "W3_qob_q3oU",
            title: "Stocks vs bonds: full explanation for beginners",
            source: "Martik Finance",
            minutes: 9,
            summary: "Owning part of a company vs lending money to one, and the risk and return of each.",
            notePrompt: "Compare stocks and bonds on ownership, risk and return.",
          }),
          reading("b3-r", {
            url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks",
            title: "Stocks: FAQs",
            source: "Investor.gov (U.S. Securities and Exchange Commission)",
            summary: "The SEC's guide to how stocks work and the risks of owning them.",
          }),
        ],
        assignment: {
          id: "b3-a",
          title: "Build a mock 5-stock portfolio",
          prompt:
            "Pretend you have $10,000. Pick five stocks (use Yahoo Finance to look them up). For each, give the company, what it does, why you picked it, and one risk. Explain how your picks are diversified across industries and what you'd watch over the next month. No real money, just practice.",
          minWords: 220,
          minutes: 55,
        },
        quiz: {
          id: "b3-q",
          ...STD,
          questions: [
            { id: "q1", question: "Buying a stock means you:", options: ["Own a small part of a company", "Lend money to a company", "Work for the company", "Insure the company"], answer: 0, explanation: "Stocks are ownership shares." },
            { id: "q2", question: "Buying a bond means you:", options: ["Lend money in exchange for interest", "Own part of the company", "Buy its products", "Pay its taxes"], answer: 0, explanation: "Bonds are loans to companies or governments." },
            { id: "q3", question: "Diversification helps by:", options: ["Spreading risk across different investments", "Guaranteeing profits", "Avoiding all taxes", "Picking one perfect stock"], answer: 0, explanation: "If one investment falls, others may not." },
            { id: "q4", question: "Generally, compared to bonds, stocks have:", options: ["Higher risk and higher potential return", "No risk", "Lower potential return and lower risk", "Guaranteed interest"], answer: 0, explanation: "Stocks swing more but have historically returned more over long periods." },
          ],
        },
      },
      {
        number: 4,
        title: "Strategy and entrepreneurship",
        goal: "Use SWOT analysis, learn how startups find customers, and pitch an idea.",
        lessons: [
          videoNeeded("b4-l1", "SWOT analysis", {
            title: "SWOT analysis",
            minutes: 10,
            summary: "Strengths, weaknesses, opportunities and threats, and how to use them to plan.",
            notePrompt: "Do a quick SWOT for a business near you: one point in each box.",
          }),
          video("b4-l2", {
            youtubeId: "hyYCn_kAngI",
            title: "How to get your first customers",
            source: "Y Combinator (Startup School)",
            minutes: 23,
            summary: "How new startups find and win their first users, from Y Combinator's Startup School.",
            notePrompt: "What does YC recommend for getting your first customers? Which tip surprised you?",
          }),
          reading("b4-r", {
            url: "https://www.sba.gov/business-guide/plan-your-business/write-your-business-plan",
            title: "Write your business plan",
            source: "U.S. Small Business Administration",
            summary: "The sections of a business plan and a lean one-page format.",
          }),
        ],
        assignment: {
          id: "b4-a",
          title: "Final project: One-page business plan or startup pitch",
          finalProject: true,
          prompt:
            "Write a one-page plan for a business you could start. Include: the problem, your solution, target customer, how you make money (price and costs), a SWOT analysis, how you'll get your first 10 customers, and what you'd do with $500 to test it. Write it as a pitch you could read out loud in two minutes.",
          minWords: 350,
          minutes: 60,
        },
        quiz: {
          id: "b4-q",
          ...STD,
          questions: [
            { id: "q1", question: "In SWOT, which two are internal to the business?", options: ["Strengths and weaknesses", "Opportunities and threats", "Threats and strengths", "Opportunities and weaknesses"], answer: 0, explanation: "Strengths and weaknesses come from inside; opportunities and threats from outside." },
            { id: "q2", question: "A new competitor opening next door is a:", options: ["Threat", "Strength", "Weakness", "Opportunity"], answer: 0, explanation: "External risks are threats." },
            { id: "q3", question: "Early-stage startups usually find their first customers by:", options: ["Reaching out to them directly and personally", "Buying Super Bowl ads", "Waiting for press", "Hiring a large sales team first"], answer: 0, explanation: "Founders often recruit early users one by one." },
            { id: "q4", question: "A good pitch clearly explains:", options: ["The problem, the solution and who will pay", "Only the founder's resume", "The office location", "The logo colors"], answer: 0, explanation: "Investors and customers want to know why it matters and how it makes money." },
          ],
        },
      },
    ],
  },

  // ── 5. Sports & Athletics ─────────────────────────────────────────────────
  {
    slug: "intro-to-careers-in-sports-and-athletics",
    title: "Intro to Careers in Sports & Athletics",
    career: "Sports & Athletics",
    categories: ["Sports & Athletics"],
    shortDescription: "Discover sports careers beyond playing: management, media, analytics, training and the business of sports.",
    description:
      "Most sports careers happen off the field. In four weeks you'll explore jobs in management, media, analytics and athletic training, learn how teams and leagues make money including NIL, practice sports writing or stat analysis, and build a plan to get into the industry.",
    difficulty: "Beginner",
    hoursPerWeek: "2 to 3 hours",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80",
    outcomes: [
      "Compare sports management, agent, media, analytics, training and coaching careers",
      "Explain how teams and leagues make money",
      "Explain NIL and what it means for college athletes",
      "Use stats to evaluate a player",
      "Write a game recap or stat breakdown",
      "Plan internships and networking in sports",
    ],
    keywords: ["sports", "athletics", "athletic trainer", "coach", "sports management", "sports media", "analytics", "nil", "agent", "fitness"],
    clusterIds: ["sports"],
    weeks: [
      {
        number: 1,
        title: "Careers beyond playing",
        goal: "Explore sports management, agents, media, analytics, athletic training and coaching.",
        lessons: [
          video("s1-l1", {
            youtubeId: "HuWS-LOf-j8",
            title: "How to find the right sports career",
            source: "WorkInSports",
            minutes: 12,
            summary: "The range of jobs across the sports industry and how to match your skills to them.",
            notePrompt: "List the sports jobs mentioned. Which ones match your skills and interests?",
          }),
          video("s1-l2", {
            youtubeId: "IGI896nXjSs",
            title: "Inside the job of an NFL athletic trainer",
            source: "Play Football (NFL)",
            minutes: 11,
            summary: "What athletic trainers do on game day and during the week to keep players healthy.",
            notePrompt: "What does an athletic trainer do? What education do you think the job requires?",
          }),
          blsReading("s1-r", "athletic trainers, coaches and scouts, agents and business managers of artists performers and athletes", "Official pay, education and outlook for sports careers."),
        ],
        assignment: {
          id: "s1-a",
          title: "Compare three sports careers",
          prompt:
            "Pick three sports careers (for example athletic trainer, sports agent, sports journalist, team analyst, coach or ticket sales manager). For each, explain the path in (education, certifications, first jobs), what the daily work looks like, and the pay range. Which path could you start on this year?",
          minWords: 200,
          minutes: 50,
        },
        quiz: {
          id: "s1-q",
          ...STD,
          questions: [
            { id: "q1", question: "Athletic trainers mainly:", options: ["Prevent, assess and treat athletes' injuries", "Sell tickets", "Negotiate contracts", "Broadcast games"], answer: 0, explanation: "They are healthcare professionals who work with athletes." },
            { id: "q2", question: "A sports agent:", options: ["Represents athletes in contract and sponsorship deals", "Referees games", "Designs stadiums", "Coaches a team"], answer: 0, explanation: "Agents negotiate on behalf of athletes." },
            { id: "q3", question: "Most jobs in the sports industry are:", options: ["Off the field, on the business and support side", "Professional athletes", "Referees", "Team owners"], answer: 0, explanation: "Far more people work in business, media and support roles than play." },
            { id: "q4", question: "Which organization represents athletic trainers?", options: ["National Athletic Trainers' Association (NATA)", "NCAA", "NFL Players Association", "The Olympics"], answer: 0, explanation: "NATA is the professional association for athletic trainers." },
          ],
        },
      },
      {
        number: 2,
        title: "The business of sports",
        goal: "Learn how teams and leagues make money from tickets, media rights, sponsorships and NIL.",
        lessons: [
          video("s2-l1", {
            youtubeId: "1OcGQo5xBbc",
            title: "How do NFL teams make money?",
            source: "First Team Football",
            minutes: 18,
            summary: "TV deals, revenue sharing, tickets, sponsors and merchandise.",
            notePrompt: "List the main ways an NFL team makes money. Which is the biggest and why?",
          }),
          video("s2-l2", {
            youtubeId: "rfBaTCOFvww",
            title: "Paid to play: understanding college sports",
            source: "ESPN",
            minutes: 15,
            summary: "How name, image and likeness (NIL) deals changed college sports.",
            notePrompt: "What is NIL? Give one benefit and one concern for college athletes.",
          }),
          reading("s2-r", {
            url: "https://www.ncaa.org/",
            title: "NCAA: name, image and likeness",
            source: "NCAA",
            summary: "The NCAA's official information on rules for college athletes.",
            status: "needs review",
            linkNote: "Search the site for 'name, image and likeness' to find the current NIL rules page.",
          }),
        ],
        assignment: {
          id: "s2-a",
          title: "How does a team or league make money?",
          prompt:
            "Pick one team or league (pro, college, or a league like the WNBA or MLS). Explain its main revenue streams: tickets, media rights, sponsorships, merchandise and anything else. Which is the largest, and how might NIL or streaming change it in the next five years?",
          minWords: 200,
          minutes: 50,
        },
        quiz: {
          id: "s2-q",
          ...STD,
          questions: [
            { id: "q1", question: "Media rights are:", options: ["Payments from broadcasters and streamers to show games", "Fan photos", "Player salaries", "Stadium parking"], answer: 0, explanation: "TV and streaming deals are a major source of league revenue." },
            { id: "q2", question: "NIL lets college athletes:", options: ["Earn money from their name, image and likeness", "Skip classes", "Play professionally while in college", "Get free cars from schools"], answer: 0, explanation: "NIL deals include endorsements, appearances and social media." },
            { id: "q3", question: "A sponsorship is when:", options: ["A company pays to be associated with a team or event", "Fans buy tickets", "A player is traded", "A coach is hired"], answer: 0, explanation: "Sponsors pay for visibility." },
            { id: "q4", question: "Revenue sharing in leagues helps:", options: ["Keep smaller-market teams financially competitive", "Lower ticket prices to zero", "Pay referees only", "Choose MVPs"], answer: 0, explanation: "Shared revenue spreads money across teams." },
          ],
        },
      },
      {
        number: 3,
        title: "Sports media and analytics",
        goal: "See how data and media shape sports, and practice using stats.",
        lessons: [
          video("s3-l1", {
            youtubeId: "A_pxpJgY7V4",
            title: "The business of football: the big data arms race",
            source: "Financial Times",
            minutes: 11,
            summary: "How teams use data to scout, train and make decisions.",
            notePrompt: "How do teams use data today? Give two examples from the video.",
          }),
          video("s3-l2", {
            youtubeId: "yeJIJ5SJtvI",
            title: "Sports statistician answers sports math questions",
            source: "WIRED",
            minutes: 13,
            summary: "A statistician explains probability, streaks and how to judge players fairly.",
            notePrompt: "Pick one question from the video and explain the statistician's answer in your own words.",
          }),
          reading("s3-r", {
            url: "https://www.basketball-reference.com/about/glossary.html",
            title: "Basketball statistics glossary",
            source: "Basketball-Reference (Sports Reference)",
            summary: "Definitions of common and advanced basketball stats.",
          }),
        ],
        assignment: {
          id: "s3-a",
          title: "Game recap or player stat breakdown",
          prompt:
            "Choose one. Option A: Write a 200-word recap of a recent game: the headline, the key moment, top performers with stats, and what it means for the season. Option B: Use a Sports Reference site (basketball-reference.com, pro-football-reference.com or baseball-reference.com) to compare two players with at least four stats, and argue which one had the better season.",
          minWords: 200,
          minutes: 50,
        },
        quiz: {
          id: "s3-q",
          ...STD,
          questions: [
            { id: "q1", question: "Sports analytics mainly uses:", options: ["Data to evaluate players and make decisions", "Ticket prices only", "Weather reports", "Fan chants"], answer: 0, explanation: "Analytics turns stats into decisions." },
            { id: "q2", question: "A good game recap starts with:", options: ["The most important result or moment", "The weather", "The stadium address", "The full roster"], answer: 0, explanation: "Lead with what matters most to readers." },
            { id: "q3", question: "Why compare players using per-game or per-minute stats?", options: ["To be fair when players have different playing time", "To make numbers bigger", "Because totals are illegal", "It's not useful"], answer: 0, explanation: "Rates adjust for opportunity." },
            { id: "q4", question: "A small sample size (like 3 games) means:", options: ["Results may be luck and less reliable", "Results are always accurate", "The player is the best", "Stats don't matter"], answer: 0, explanation: "More games give a more reliable picture." },
          ],
        },
      },
      {
        number: 4,
        title: "Getting into the industry",
        goal: "Plan internships, work with school teams, and start networking.",
        lessons: [
          video("s4-l1", {
            youtubeId: "jEmVlzt4X2I",
            title: "How to get a job in sports (from an ex-Nike exec)",
            source: "Jordan Rogers",
            minutes: 18,
            summary: "A former Nike executive on breaking into the sports business and standing out.",
            notePrompt: "What advice does he give for getting a first job in sports? Which step could you take this month?",
          }),
          video("s4-l2", {
            youtubeId: "J8oTdTDw70c",
            title: "5 summer internship tips to kickstart your search",
            source: "Indeed",
            minutes: 14,
            summary: "Where to find internships, how to apply and how to stand out.",
            notePrompt: "List the five tips. Which will you use first?",
          }),
          reading("s4-r", {
            url: "https://frontofficesports.com/",
            title: "Front Office Sports",
            source: "Front Office Sports",
            summary: "News on the business of sports. Read two articles about jobs, deals or teams.",
            linkNote: "Pick two recent articles about the business side of sports.",
          }),
        ],
        assignment: {
          id: "s4-a",
          title: "Final project: Sports career plan and sample work",
          finalProject: true,
          prompt:
            "Write a sports career plan: the role you want, three steps for this school year (for example manage a school team, keep stats, write for the school paper, volunteer at events), one internship or program to apply to, and three people to reach out to. Then include one sample piece: a short article, a description of a graphic you would make, or a stat breakdown of a player or team.",
          minWords: 350,
          minutes: 60,
        },
        quiz: {
          id: "s4-q",
          ...STD,
          questions: [
            { id: "q1", question: "A great way for students to get sports experience now is to:", options: ["Manage, film or keep stats for a school team", "Wait until after college", "Only watch games", "Buy jerseys"], answer: 0, explanation: "School teams offer real, hands-on experience." },
            { id: "q2", question: "Networking means:", options: ["Building real relationships with people in the field", "Spamming messages", "Only using social media likes", "Applying without a resume"], answer: 0, explanation: "Relationships lead to referrals and advice." },
            { id: "q3", question: "When reaching out to a professional, you should:", options: ["Be brief, specific and polite", "Ask for a job immediately", "Send a long life story", "Never follow up"], answer: 0, explanation: "Short, specific messages get replies." },
            { id: "q4", question: "Sports internships are often:", options: ["Competitive, so applying early matters", "Guaranteed for everyone", "Only for athletes", "Always remote"], answer: 0, explanation: "Many people want sports jobs, so start early." },
          ],
        },
      },
    ],
  },

  // ── 6. Arts & Design ──────────────────────────────────────────────────────
  {
    slug: "intro-to-careers-in-arts-and-design",
    title: "Intro to Careers in Arts & Design",
    career: "Arts & Design",
    categories: ["Arts & Design"],
    shortDescription: "Explore creative careers, learn design fundamentals and tools, and build a mini portfolio.",
    description:
      "Creative careers range from graphic and UX design to film, fashion and architecture. In four weeks you'll compare creative paths, learn the fundamentals of color, type and layout, practice with tools like Figma or Canva on a real brief, and finish with a mini portfolio and bio.",
    difficulty: "Beginner",
    hoursPerWeek: "2 to 3 hours",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80",
    outcomes: [
      "Compare graphic design, UX/UI, illustration, photography, film and other creative careers",
      "Use color, typography and composition intentionally",
      "Work from a creative brief and respond to feedback",
      "Use Figma or Canva for a simple design",
      "Build a mini portfolio and price creative work",
    ],
    keywords: ["art", "design", "graphic design", "ux", "ui", "illustration", "photography", "film", "animation", "fashion", "architecture", "creative"],
    clusterIds: ["creative"],
    weeks: [
      {
        number: 1,
        title: "Creative careers",
        goal: "Compare creative careers and see what working designers actually do.",
        lessons: [
          video("a1-l1", {
            youtubeId: "l8INYfIWlx4",
            title: "Day in the life of a graphic designer",
            source: "Jesse Nyberg",
            minutes: 20,
            summary: "A working graphic designer's day: client work, tools and the business side.",
            notePrompt: "What does a graphic designer do all day? What parts of the job surprised you?",
          }),
          video("a1-l2", {
            youtubeId: "qqG1V0hYg7s",
            title: "A realistic day in the life as a UX designer",
            source: "Hello Stephanie M",
            minutes: 10,
            summary: "How UX designers research users, design screens and work with engineers.",
            notePrompt: "How is UX design different from graphic design? Which fits you better?",
          }),
          blsReading("a1-r", "graphic designers, web developers and digital designers, special effects artists and animators, photographers", "Official pay, education and outlook for creative careers."),
        ],
        assignment: {
          id: "a1-a",
          title: "Compare two creative careers",
          prompt:
            "Pick two creative careers (for example graphic design, UX/UI, illustration, photography, film, animation, fashion or architecture). For each, describe the daily work, training, and pay. Find one professional's portfolio or website in each field, share the link, and describe what makes their work stand out.",
          minWords: 200,
          minutes: 50,
        },
        quiz: {
          id: "a1-q",
          ...STD,
          questions: [
            { id: "q1", question: "UX design focuses mainly on:", options: ["How easy and pleasant a product is to use", "Printing posters", "Painting murals", "Writing music"], answer: 0, explanation: "UX stands for user experience." },
            { id: "q2", question: "A portfolio is:", options: ["A collection of your best work", "A resume of only jobs", "A bank account", "A school transcript"], answer: 0, explanation: "Creative hiring is based heavily on portfolios." },
            { id: "q3", question: "Which creative career usually requires a license and an accredited degree?", options: ["Architect", "Illustrator", "Photographer", "Graphic designer"], answer: 0, explanation: "Architects must be licensed in every U.S. state." },
            { id: "q4", question: "Many graphic designers work as:", options: ["Freelancers or in-house and agency designers", "Only museum curators", "Only teachers", "Only printers"], answer: 0, explanation: "Designers work freelance, in-house or at agencies." },
          ],
        },
      },
      {
        number: 2,
        title: "Design fundamentals",
        goal: "Learn color, typography, composition and core design principles.",
        lessons: [
          video("a2-l1", {
            youtubeId: "FDFD2-poyGw",
            title: "Graphic design principles master-class: white space",
            source: "Satori Graphics",
            minutes: 10,
            summary: "How white space, balance and hierarchy make a design clear and easy to read.",
            notePrompt: "What is white space and why does it matter? Describe a design you've seen that uses it well or badly.",
          }),
          video("a2-l2", {
            youtubeId: "kGvDQCohHdM",
            title: "Basic color theory: beginner guide",
            source: "Aka",
            minutes: 9,
            summary: "The color wheel, complementary and analogous colors, and value.",
            notePrompt: "What are complementary colors? When would you use analogous colors instead?",
          }),
          reading("a2-r", {
            url: "https://www.figma.com/resource-library/color-theory/",
            title: "Color theory guide",
            source: "Figma",
            summary: "How color relationships work and how designers build palettes.",
          }),
        ],
        assignment: {
          id: "a2-a",
          title: "Redesign a poster or flyer",
          prompt:
            "Find a poster or flyer (at school, online or in your neighborhood). Redesign it using Canva, Figma or paper. Then explain your choices: what you changed about hierarchy, alignment, color and typography, and why the new version communicates better. Describe or link your before and after.",
          minWords: 180,
          minutes: 60,
        },
        quiz: {
          id: "a2-q",
          ...STD,
          questions: [
            { id: "q1", question: "Complementary colors are:", options: ["Opposite each other on the color wheel", "Next to each other", "All shades of gray", "Only black and white"], answer: 0, explanation: "Like blue and orange, they create strong contrast." },
            { id: "q2", question: "Visual hierarchy shows:", options: ["What to look at first, second and third", "The designer's name", "Printing costs", "File size"], answer: 0, explanation: "Size, color and placement guide the eye." },
            { id: "q3", question: "White space is:", options: ["Empty space that helps a design breathe", "Wasted space", "A printing error", "Only the color white"], answer: 0, explanation: "Space makes designs clearer and easier to read." },
            { id: "q4", question: "A serif font has:", options: ["Small strokes at the ends of letters", "No strokes", "Only capital letters", "Only bold letters"], answer: 0, explanation: "Serifs are the small feet on letters, like Times New Roman." },
          ],
        },
      },
      {
        number: 3,
        title: "Tools and the creative process",
        goal: "Learn Figma or Canva basics, work from a creative brief, and take feedback.",
        lessons: [
          video("a3-l1", {
            youtubeId: "jQ1sfKIl50E",
            title: "Figma tutorial for beginners",
            source: "Flux Academy",
            minutes: 13,
            summary: "Frames, shapes, text, components and auto layout in Figma.",
            notePrompt: "List the Figma tools you learned. What would you design first with them?",
          }),
          video("a3-l2", {
            youtubeId: "xqfrHgRGCCA",
            title: "Creative director 101: briefs and techniques",
            source: "orenmeetsworld",
            minutes: 20,
            summary: "What a creative brief contains and how creatives turn one into ideas.",
            notePrompt: "What goes into a creative brief? Why does it matter before you start designing?",
          }),
          reading("a3-r", {
            url: "https://help.figma.com/hc/en-us/articles/14563969806359-Figma-design-for-beginners",
            title: "What is Figma? Figma design for beginners",
            source: "Figma Learn",
            summary: "Figma's official starting guide, with free beginner lessons.",
          }),
        ],
        assignment: {
          id: "a3-a",
          title: "Complete a mock client brief",
          prompt:
            "Brief: Riverbend Public Library is launching free weekend coding workshops for teens. They need an Instagram post (1080 by 1080) that makes the workshops feel fun, not like school. Must include: 'Free Teen Coding Workshops', 'Saturdays 1 to 3 pm', 'Riverbend Library' and a sign-up link. Brand colors are navy and yellow. Design the post in Figma or Canva, then write a short note to the client explaining your concept, layout and color choices, and one thing you'd change if they gave feedback that it looks too busy.",
          minWords: 150,
          minutes: 60,
        },
        quiz: {
          id: "a3-q",
          ...STD,
          questions: [
            { id: "q1", question: "A creative brief tells the designer:", options: ["The goal, audience, message and requirements", "Only the deadline", "The designer's salary", "What software to buy"], answer: 0, explanation: "Briefs define the problem before design starts." },
            { id: "q2", question: "In Figma, a frame is:", options: ["A container for a screen or design", "A photo filter", "A font", "A color palette"], answer: 0, explanation: "Frames hold layouts like a phone screen or a post." },
            { id: "q3", question: "When a client gives feedback you disagree with, you should:", options: ["Ask questions, explain your reasoning, and look for a solution", "Ignore it", "Start over without asking", "Argue until they give up"], answer: 0, explanation: "Good feedback conversations focus on the goal." },
            { id: "q4", question: "A component in Figma is:", options: ["A reusable design element like a button", "A printer", "A file format", "A keyboard shortcut"], answer: 0, explanation: "Components keep designs consistent." },
          ],
        },
      },
      {
        number: 4,
        title: "Portfolios and freelancing",
        goal: "Build a portfolio, price your work, and find clients.",
        lessons: [
          video("a4-l1", {
            youtubeId: "0VGc7jrD9zo",
            title: "Good vs bad design portfolios (with examples)",
            source: "Flux Academy",
            minutes: 9,
            summary: "What makes a portfolio get you hired, with real examples.",
            notePrompt: "List three things good portfolios do. Which mistake will you avoid?",
          }),
          video("a4-l2", {
            youtubeId: "B7YjIGZiA-Q",
            title: "Freelance pricing secrets every designer should know",
            source: "Rachel How",
            minutes: 10,
            summary: "Hourly vs project pricing, and how to set your first rates.",
            notePrompt: "Compare hourly and project pricing. How would you price your first freelance job?",
          }),
          reading("a4-r", {
            url: "https://www.figma.com/resource-library/what-is-ui-design/",
            title: "What is UI design?",
            source: "Figma",
            summary: "An overview of UI design work, a fast-growing path for portfolio projects.",
          }),
        ],
        assignment: {
          id: "a4-a",
          title: "Final project: Mini portfolio and bio",
          finalProject: true,
          prompt:
            "Build a mini portfolio with three pieces (you can use your poster redesign and client brief from this course). For each piece, write the problem, your process and the result. Add a short bio (3 to 4 sentences) in the voice you'd use on your website. Share links (Behance, Canva, Figma, Google Drive or a personal site) and explain where you'd look for your first client.",
          minWords: 300,
          minutes: 60,
        },
        quiz: {
          id: "a4-q",
          ...STD,
          questions: [
            { id: "q1", question: "A strong portfolio piece shows:", options: ["The problem, your process and the result", "Only the final image", "Every sketch you've ever made", "Your grades"], answer: 0, explanation: "Clients want to see how you think, not just the final pixels." },
            { id: "q2", question: "Project pricing means:", options: ["Charging one set price for the whole job", "Charging by the hour", "Working for free", "Charging per email"], answer: 0, explanation: "A flat fee for the whole project." },
            { id: "q3", question: "How many pieces should a beginner portfolio usually show?", options: ["A few strong pieces", "Everything you've ever made", "Only one", "None"], answer: 0, explanation: "Quality beats quantity." },
            { id: "q4", question: "A good first place to find design clients is:", options: ["Local clubs, businesses and people you know", "Only huge companies", "Only overseas", "Nowhere until you're 30"], answer: 0, explanation: "Start with your own community." },
          ],
        },
      },
    ],
  },
];
