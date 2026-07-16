export interface CareerResource {
  books: { title: string; author: string; why: string }[];
  articles: { title: string; source: string; query: string }[];
  videos: { title: string; query: string }[];
}

export interface CareerCluster {
  id: string;
  name: string;
  emoji: string;
  description: string;
  relatedCareers: string[];
  youtubeQuery: string;
  googleQuery: string;
  color: string;
  resources: CareerResource;
}

export const CAREER_CLUSTERS: CareerCluster[] = [
  {
    id: "technology",
    name: "Technology",
    emoji: "💻",
    description: "You thrive in digital environments and love solving complex problems with code, systems, or data. A future in tech means building the tools that power modern life.",
    relatedCareers: ["Software Engineer", "Data Scientist", "Cybersecurity Analyst", "UX Designer", "AI/ML Engineer", "Product Manager", "Cloud Architect", "DevOps Engineer"],
    youtubeQuery: "technology careers for teenagers",
    googleQuery: "technology career paths for high school students",
    color: "#6366f1",
    resources: {
      books: [
        { title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", why: "The bible for anyone learning to code professionally. Teaches you how to think like a real engineer." },
        { title: "Zero to One", author: "Peter Thiel", why: "How the biggest tech companies get built. Essential reading if you want to understand Silicon Valley." },
        { title: "Designing Your Life", author: "Bill Burnett & Dave Evans", why: "Stanford engineers turned this into a framework for building a career you actually want." },
      ],
      articles: [
        { title: "How to become a software engineer from scratch", source: "freeCodeCamp", query: "how to become a software engineer from scratch freeCodeCamp" },
        { title: "Tech career paths: which one is right for you?", source: "Indeed Career Guide", query: "tech career paths for students indeed career guide" },
        { title: "What is AI/ML and how do I get started?", source: "Google Developers", query: "getting started with AI machine learning for students google" },
      ],
      videos: [
        { title: "Day in the Life: Software Engineer at Google", query: "day in the life software engineer Google" },
        { title: "Every Tech Job Explained in 10 Minutes", query: "every tech job explained for beginners" },
        { title: "How to Learn Coding for Free (Beginner Roadmap)", query: "how to learn coding for free beginner roadmap 2024" },
      ],
    },
  },
  {
    id: "business",
    name: "Business & Entrepreneurship",
    emoji: "📊",
    description: "You have a knack for strategy, leadership, and turning ideas into reality. Whether starting your own venture or leading teams, business is where your energy shines.",
    relatedCareers: ["Entrepreneur", "Marketing Manager", "Financial Analyst", "Operations Manager", "Management Consultant", "Business Analyst", "Sales Director", "HR Manager"],
    youtubeQuery: "business and entrepreneurship careers for teens",
    googleQuery: "business career paths high school students",
    color: "#f59e0b",
    resources: {
      books: [
        { title: "The Lean Startup", author: "Eric Ries", why: "How modern businesses are built quickly and tested in the real world. Changed how startups work." },
        { title: "$100M Offers", author: "Alex Hormozi", why: "Practical, no-fluff guide to sales and value creation. Reads fast and teaches you what business actually is." },
        { title: "Good to Great", author: "Jim Collins", why: "Why some companies make the leap from good to great and others don't. A must-read on leadership." },
      ],
      articles: [
        { title: "How to start a business as a teenager", source: "Entrepreneur.com", query: "how to start a business as a teenager entrepreneur" },
        { title: "What does a management consultant actually do?", source: "Harvard Business Review", query: "what does a management consultant do Harvard Business Review" },
        { title: "Business vs. entrepreneurship: which path is right for you?", source: "Forbes", query: "business vs entrepreneurship career path Forbes" },
      ],
      videos: [
        { title: "Day in the Life: Young Entrepreneur", query: "day in the life young entrepreneur teenager" },
        { title: "How to Start a Business at 16 with No Money", query: "how to start a business at 16 with no money" },
        { title: "What Does a Business Major Actually Do?", query: "what does a business major actually do career" },
      ],
    },
  },
  {
    id: "healthcare",
    name: "Healthcare & Medicine",
    emoji: "🏥",
    description: "You care deeply about people's well-being and want to make a real difference in lives. Healthcare offers countless paths from direct patient care to groundbreaking research.",
    relatedCareers: ["Physician", "Nurse Practitioner", "Physical Therapist", "Pharmacist", "Medical Researcher", "Dentist", "Psychologist", "Public Health Officer"],
    youtubeQuery: "healthcare careers for teenagers what to study",
    googleQuery: "healthcare medical career paths for high school students",
    color: "#ef4444",
    resources: {
      books: [
        { title: "When Breath Becomes Air", author: "Paul Kalanithi", why: "A neurosurgeon writes about life, death, and medicine. Every pre-med student should read this." },
        { title: "The Body: A Guide for Occupants", author: "Bill Bryson", why: "Fascinating overview of how the human body works. Makes you fall in love with medicine." },
        { title: "How Doctors Think", author: "Jerome Groopman", why: "Reveals the actual decision-making process behind diagnoses. Eye-opening for anyone considering medicine." },
      ],
      articles: [
        { title: "How to become a doctor: step-by-step guide", source: "Association of American Medical Colleges", query: "how to become a doctor step by step AAMC guide" },
        { title: "Healthcare careers beyond being a doctor", source: "Bureau of Labor Statistics", query: "healthcare careers beyond doctor BLS occupational outlook" },
        { title: "What is nursing really like? A day in the life", source: "Nurse.org", query: "what is nursing really like day in the life nurse" },
      ],
      videos: [
        { title: "Day in the Life: ER Doctor", query: "day in the life emergency room doctor" },
        { title: "Pre-Med Advice: What I Wish I Knew in High School", query: "pre-med advice what I wish I knew high school" },
        { title: "All the Healthcare Careers Explained", query: "all healthcare careers explained for students" },
      ],
    },
  },
  {
    id: "engineering",
    name: "Engineering",
    emoji: "⚙️",
    description: "You love designing, building, and optimizing systems that work. Engineering lets you apply math and science to create everything from bridges to spacecraft.",
    relatedCareers: ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Aerospace Engineer", "Chemical Engineer", "Biomedical Engineer", "Environmental Engineer", "Robotics Engineer"],
    youtubeQuery: "engineering careers for teenagers day in the life",
    googleQuery: "engineering career paths for high school students",
    color: "#3b82f6",
    resources: {
      books: [
        { title: "The Art of Problem Solving (Vol. 1)", author: "Sandor Lehoczky & Richard Rusczyk", why: "The go-to math book for students who want to think like engineers." },
        { title: "Engineering in Plain Sight", author: "Grady Hillhouse", why: "Explains the infrastructure around us. Makes you see engineering everywhere you look." },
        { title: "How to Fly a Horse", author: "Kevin Ashton", why: "The real story of how inventions are created. Demystifies the engineering and creative process." },
      ],
      articles: [
        { title: "Which engineering field is right for me?", source: "MIT Technology Review", query: "which engineering field is right for me MIT career" },
        { title: "How to prepare for engineering in high school", source: "Engineering.com", query: "how to prepare for engineering career in high school" },
        { title: "Biomedical engineering: the future of healthcare and tech", source: "IEEE Spectrum", query: "biomedical engineering career future IEEE spectrum" },
      ],
      videos: [
        { title: "Day in the Life: NASA Engineer", query: "day in the life NASA aerospace engineer" },
        { title: "Every Engineering Discipline Explained", query: "every engineering discipline explained for students" },
        { title: "How to Become an Engineer: High School to Job", query: "how to become an engineer high school to job" },
      ],
    },
  },
  {
    id: "creative",
    name: "Creative Arts & Design",
    emoji: "🎨",
    description: "You see the world differently and express ideas through visual, audio, or written mediums. Creative careers blend passion with craft to shape culture and communication.",
    relatedCareers: ["Graphic Designer", "Film Director", "Architect", "Fashion Designer", "Illustrator", "Art Director", "Animator", "Interior Designer"],
    youtubeQuery: "creative arts design careers for teenagers",
    googleQuery: "creative design career paths for high school students",
    color: "#ec4899",
    resources: {
      books: [
        { title: "Steal Like an Artist", author: "Austin Kleon", why: "How creativity actually works and how to develop your own style. Quick read, massive impact." },
        { title: "The War of Art", author: "Steven Pressfield", why: "About overcoming resistance and actually creating things. Every artist needs this book." },
        { title: "Show Your Work!", author: "Austin Kleon", why: "How to build an audience and share your creative process. Essential for the modern creative." },
      ],
      articles: [
        { title: "How to build a design portfolio from scratch", source: "Behance", query: "how to build a design portfolio from scratch for students Behance" },
        { title: "Creative careers that actually pay well", source: "Creative Bloq", query: "creative careers that pay well salary 2024 Creative Bloq" },
        { title: "The truth about art school: is it worth it?", source: "The Guardian", query: "is art school worth it truth Guardian" },
      ],
      videos: [
        { title: "Day in the Life: Graphic Designer at a Top Agency", query: "day in the life graphic designer agency" },
        { title: "How I Became an Animator at Disney/Pixar", query: "how to become animator Disney Pixar career path" },
        { title: "How to Start a Creative Career with No Experience", query: "how to start creative career no experience" },
      ],
    },
  },
  {
    id: "education",
    name: "Education & Social Services",
    emoji: "📚",
    description: "You find purpose in helping others grow and learn. Careers in education and social services let you shape communities and support people at every stage of life.",
    relatedCareers: ["Teacher", "School Counselor", "Social Worker", "Child Psychologist", "Educational Administrator", "Speech Therapist", "Youth Program Director", "Curriculum Designer"],
    youtubeQuery: "education social work careers for teenagers",
    googleQuery: "education social services career paths high school",
    color: "#10b981",
    resources: {
      books: [
        { title: "Educated", author: "Tara Westover", why: "A memoir about the transformative power of education. Reminds you why teaching matters." },
        { title: "The Light We Carry", author: "Michelle Obama", why: "About community, resilience, and helping others find their path. Deeply relevant to social work." },
        { title: "Teach Like a Champion", author: "Doug Lemov", why: "The most practical teaching techniques from the best teachers in the country." },
      ],
      articles: [
        { title: "What does a school counselor actually do?", source: "ASCA", query: "what does a school counselor do ASCA career guide" },
        { title: "Social work careers: paths, salaries, and how to get started", source: "NASW", query: "social work career paths salaries how to get started NASW" },
        { title: "Why education jobs are more diverse than you think", source: "EdSurge", query: "education career paths beyond teaching EdSurge" },
      ],
      videos: [
        { title: "Day in the Life: High School Teacher", query: "day in the life high school teacher realistic" },
        { title: "What is Social Work? Everything You Need to Know", query: "what is social work career explained" },
        { title: "How to Become a School Counselor", query: "how to become a school counselor career path" },
      ],
    },
  },
  {
    id: "law",
    name: "Law & Government",
    emoji: "⚖️",
    description: "You care about justice, policy, and how societies are governed. Law and government careers put you at the center of decisions that affect millions of people.",
    relatedCareers: ["Lawyer", "Judge", "Politician", "Public Policy Analyst", "Paralegal", "FBI Agent", "Diplomat", "City Planner"],
    youtubeQuery: "law government policy careers for teenagers",
    googleQuery: "law government career paths for high school students",
    color: "#8b5cf6",
    resources: {
      books: [
        { title: "Just Mercy", author: "Bryan Stevenson", why: "A lawyer fighting for justice in the criminal system. Possibly the most compelling argument for a legal career." },
        { title: "The New Jim Crow", author: "Michelle Alexander", why: "Understand the legal system and its impact. Essential reading for anyone interested in law and justice." },
        { title: "1984", author: "George Orwell", why: "Understanding government power and civil liberties starts here. Still the best introduction to political thought." },
      ],
      articles: [
        { title: "How to become a lawyer: from high school to bar exam", source: "ABA Journal", query: "how to become a lawyer high school to bar exam ABA" },
        { title: "Careers in government: beyond politics", source: "USAJobs", query: "government careers beyond politics for students" },
        { title: "What is public policy and why should you care?", source: "Harvard Kennedy School", query: "what is public policy career Harvard Kennedy School" },
      ],
      videos: [
        { title: "Day in the Life: Lawyer at a Big Law Firm", query: "day in the life lawyer big law firm" },
        { title: "How to Become a Lawyer: Everything You Need to Know", query: "how to become a lawyer everything you need to know" },
        { title: "What Government Jobs Actually Pay", query: "government jobs salary career paths" },
      ],
    },
  },
  {
    id: "trades",
    name: "Skilled Trades",
    emoji: "🔧",
    description: "You love hands-on work and building tangible things. Skilled trades offer high demand, strong salaries, and the satisfaction of seeing real results from your work.",
    relatedCareers: ["Electrician", "Plumber", "HVAC Technician", "Welder", "Carpenter", "Auto Mechanic", "Construction Manager", "Marine Technician"],
    youtubeQuery: "skilled trades careers for teenagers high pay",
    googleQuery: "skilled trades career paths for high school students",
    color: "#f97316",
    resources: {
      books: [
        { title: "The Case for Trade School", author: "Mike Rowe", why: "America's most famous advocate for skilled trades explains why these jobs are undervalued and in demand." },
        { title: "Shop Class as Soulcraft", author: "Matthew Crawford", why: "A philosopher who quit his think-tank job to become a motorcycle mechanic. Makes the case for working with your hands." },
        { title: "Apprenticeship Patterns", author: "Dave Hoover & Adewale Oshineye", why: "How the apprenticeship model creates skilled, respected workers in any field." },
      ],
      articles: [
        { title: "Skilled trades that pay over $80,000 a year", source: "Bureau of Labor Statistics", query: "skilled trades jobs that pay over 80000 a year BLS" },
        { title: "How to become an electrician: step-by-step", source: "Indeed Career Guide", query: "how to become an electrician step by step Indeed" },
        { title: "Trade school vs. college: which is right for you?", source: "Forbes", query: "trade school vs college which is right for you Forbes" },
      ],
      videos: [
        { title: "Day in the Life: Master Electrician ($100K+)", query: "day in the life electrician salary" },
        { title: "Why Skilled Trades Are the Smartest Career Choice Right Now", query: "why skilled trades smartest career choice 2024" },
        { title: "How to Start an Apprenticeship in the Trades", query: "how to start apprenticeship skilled trades high school" },
      ],
    },
  },
  {
    id: "science",
    name: "Science & Research",
    emoji: "🔬",
    description: "You ask questions others overlook and find answers through careful experimentation. Science careers push humanity's understanding of the natural world forward.",
    relatedCareers: ["Biologist", "Chemist", "Physicist", "Geologist", "Marine Scientist", "Astronomer", "Neuroscientist", "Environmental Scientist"],
    youtubeQuery: "science research careers for teenagers",
    googleQuery: "science research career paths for high school students",
    color: "#06b6d4",
    resources: {
      books: [
        { title: "The Double Helix", author: "James Watson", why: "The story of discovering DNA. A first-person account of what science actually feels like." },
        { title: "A Brief History of Time", author: "Stephen Hawking", why: "The universe explained by the greatest physicist of our time. Makes the cosmos feel personal." },
        { title: "The Immortal Life of Henrietta Lacks", author: "Rebecca Skloot", why: "Where science, ethics, race, and medicine intersect. One of the most important science stories ever told." },
      ],
      articles: [
        { title: "How to become a research scientist: a complete guide", source: "Nature Careers", query: "how to become a research scientist complete guide Nature careers" },
        { title: "What does a neuroscientist actually do?", source: "Society for Neuroscience", query: "what does a neuroscientist do day in the life" },
        { title: "Science internships and research opportunities for high schoolers", source: "Science News for Students", query: "science research internships for high school students" },
      ],
      videos: [
        { title: "Day in the Life: Research Scientist at a University", query: "day in the life research scientist university" },
        { title: "What It's Like to Be a Marine Biologist", query: "day in the life marine biologist" },
        { title: "Science Careers Ranked: Salary, Demand, and Satisfaction", query: "science careers ranked salary demand satisfaction" },
      ],
    },
  },
  {
    id: "media",
    name: "Media & Communications",
    emoji: "📱",
    description: "You have a talent for storytelling and connecting with audiences. Media careers let you inform, entertain, and shape how the world receives information.",
    relatedCareers: ["Journalist", "Content Creator", "Public Relations Specialist", "Broadcaster", "Podcast Producer", "Social Media Manager", "Copywriter", "Photographer"],
    youtubeQuery: "media communications journalism careers for teenagers",
    googleQuery: "media communications career paths for high school students",
    color: "#0ea5e9",
    resources: {
      books: [
        { title: "On Writing", author: "Stephen King", why: "The best book about writing ever made. Applies to journalists, copywriters, content creators, and anyone who communicates for a living." },
        { title: "The Elements of Style", author: "Strunk & White", why: "The shortest, most powerful writing guide ever written. Every communicator should read this once a year." },
        { title: "Trust Me, I'm Lying", author: "Ryan Holiday", why: "How media actually works behind the scenes. Eye-opening and slightly terrifying." },
      ],
      articles: [
        { title: "How to start a journalism career with no experience", source: "Poynter Institute", query: "how to start journalism career no experience Poynter" },
        { title: "Content creator vs. journalist: what's the difference?", source: "Columbia Journalism Review", query: "content creator vs journalist difference career" },
        { title: "PR careers: what you actually do and what it pays", source: "PR Week", query: "public relations career what you do salary PR Week" },
      ],
      videos: [
        { title: "Day in the Life: Journalist at a Major Newspaper", query: "day in the life journalist major newspaper" },
        { title: "How to Become a Content Creator That Actually Makes Money", query: "how to become content creator that makes money" },
        { title: "Media Careers Explained: Every Job in the Industry", query: "media careers explained every job in the industry" },
      ],
    },
  },
  {
    id: "sports",
    name: "Sports & Recreation",
    emoji: "🏃",
    description: "You live for movement, competition, and physical excellence. Sports careers span from professional athletics to coaching, sports medicine, and management.",
    relatedCareers: ["Professional Athlete", "Sports Coach", "Athletic Trainer", "Sports Agent", "Exercise Physiologist", "Recreation Director", "Sports Journalist", "Esports Manager"],
    youtubeQuery: "sports recreation careers beyond being a pro athlete",
    googleQuery: "sports recreation career paths for high school students",
    color: "#84cc16",
    resources: {
      books: [
        { title: "Mindset: The New Psychology of Success", author: "Carol Dweck", why: "The science of how athletes and coaches develop excellence. Required reading for anyone in sports." },
        { title: "The Inner Game of Tennis", author: "Timothy Gallwey", why: "The original book on sports psychology and peak performance. Applies to every sport." },
        { title: "Shoe Dog", author: "Phil Knight", why: "How Nike was built from scratch. The sports business side nobody talks about." },
      ],
      articles: [
        { title: "Sports careers beyond being an athlete", source: "Sports Management Worldwide", query: "sports careers beyond being an athlete sports management" },
        { title: "How to become a sports agent: everything you need to know", source: "Sports Business Journal", query: "how to become sports agent everything you need to know" },
        { title: "Exercise science and kinesiology: career paths explained", source: "ACSM", query: "exercise science kinesiology career paths ACSM" },
      ],
      videos: [
        { title: "Day in the Life: NFL Athletic Trainer", query: "day in the life NFL athletic trainer" },
        { title: "How to Become a Sports Agent (The Real Path)", query: "how to become sports agent real path career" },
        { title: "Sports Business Careers: Beyond Playing the Game", query: "sports business careers beyond playing" },
      ],
    },
  },
  {
    id: "finance",
    name: "Finance & Economics",
    emoji: "💰",
    description: "Numbers tell you stories others can't read. Finance and economics careers let you shape investment decisions, economic policy, and financial well-being at every scale.",
    relatedCareers: ["Investment Banker", "Actuary", "Economist", "Financial Planner", "Accountant", "Risk Analyst", "Hedge Fund Manager", "Real Estate Investor"],
    youtubeQuery: "finance economics careers for teenagers",
    googleQuery: "finance economics career paths for high school students",
    color: "#fbbf24",
    resources: {
      books: [
        { title: "The Intelligent Investor", author: "Benjamin Graham", why: "Warren Buffett's favorite book. The foundation of value investing and financial thinking." },
        { title: "Freakonomics", author: "Steven Levitt & Stephen Dubner", why: "Economics applied to everyday life in surprising ways. Makes you see the world through a data lens." },
        { title: "The Psychology of Money", author: "Morgan Housel", why: "Why smart people make bad financial decisions. The most readable finance book of the decade." },
      ],
      articles: [
        { title: "Investment banking explained: what you actually do", source: "Wall Street Oasis", query: "investment banking explained what you actually do Wall Street Oasis" },
        { title: "How to become an actuary: one of the most in-demand careers", source: "Be An Actuary", query: "how to become an actuary career path Be An Actuary" },
        { title: "Finance vs. accounting: which career is right for you?", source: "CFA Institute", query: "finance vs accounting career difference CFA Institute" },
      ],
      videos: [
        { title: "Day in the Life: Investment Banker (Goldman Sachs)", query: "day in the life investment banker Goldman Sachs" },
        { title: "Finance Careers Explained: Every Job on Wall Street", query: "finance careers explained every job Wall Street" },
        { title: "How to Get Into Finance with No Experience", query: "how to get into finance no experience student" },
      ],
    },
  },
];

// Scoring weights: question index → cluster scores
// Each answer option has a map of cluster IDs to points added
export const QUESTION_WEIGHTS: Record<number, Record<string, Record<string, number>>> = {
  // Q0: Grade level — minimal direct influence, just metadata
  0: {},
  // Q1: After-school activities
  1: {
    "coding": { technology: 3, engineering: 1 },
    "sports": { sports: 3 },
    "art": { creative: 3, media: 1 },
    "volunteering": { education: 2, healthcare: 1, law: 1 },
    "music": { creative: 2, media: 2 },
    "debate": { law: 3, media: 1, business: 1 },
    "science": { science: 3, engineering: 1, healthcare: 1 },
    "business": { business: 3, finance: 2 },
  },
  // Q2: Favorite subjects
  2: {
    "math": { engineering: 2, finance: 2, science: 1, technology: 1 },
    "science": { science: 3, engineering: 1, healthcare: 2 },
    "english": { media: 2, education: 1, law: 1, creative: 1 },
    "history": { law: 2, education: 2, media: 1 },
    "art": { creative: 3 },
    "pe": { sports: 3, healthcare: 1 },
    "cs": { technology: 3, engineering: 1 },
    "business": { business: 3, finance: 2 },
  },
  // Q3: Work environment
  3: {
    "office": { business: 1, finance: 1, law: 1 },
    "outdoors": { trades: 2, sports: 1, science: 1 },
    "lab": { science: 3, healthcare: 2, engineering: 1 },
    "studio": { creative: 3, media: 2 },
    "community": { education: 2, healthcare: 1, law: 1 },
    "remote": { technology: 2, media: 1, business: 1 },
  },
  // Q5: Social preference
  5: {
    "alone": { science: 1, technology: 1, creative: 1 },
    "small": { education: 1, healthcare: 1 },
    "large": { business: 2, law: 1, media: 1, sports: 1 },
    "mix": { business: 1, media: 1 },
  },
  // Q6: What matters most in a career
  6: {
    "helping": { healthcare: 3, education: 2, law: 1 },
    "money": { finance: 3, business: 2, technology: 1 },
    "creativity": { creative: 3, media: 2 },
    "stability": { trades: 2, finance: 1, education: 1 },
    "impact": { science: 2, law: 2, education: 1, healthcare: 1 },
    "recognition": { media: 2, sports: 2, business: 1 },
  },
  // Q7: Personality
  7: {
    "analytical": { technology: 2, science: 2, finance: 2, engineering: 1 },
    "creative": { creative: 3, media: 2 },
    "leader": { business: 3, law: 2, sports: 1 },
    "helper": { healthcare: 2, education: 3 },
    "builder": { engineering: 2, trades: 3 },
    "communicator": { media: 3, law: 2, education: 1 },
  },
};

// Keyword → cluster points for text answers (Q8 hobbies, Q9 dream job)
export const KEYWORD_MAP: Record<string, Record<string, number>> = {
  // Tech
  code: { technology: 3 }, coding: { technology: 3 }, programming: { technology: 3 },
  software: { technology: 3 }, app: { technology: 2 }, website: { technology: 2 },
  computer: { technology: 2 }, robot: { engineering: 2, technology: 1 },
  game: { technology: 2, media: 1 }, gaming: { technology: 2 },
  ai: { technology: 3 }, data: { technology: 2, science: 1 }, cyber: { technology: 2 },
  // Business
  business: { business: 3 }, startup: { business: 3 }, entrepreneur: { business: 3 },
  marketing: { business: 2, media: 1 }, sales: { business: 2 }, money: { finance: 2 },
  invest: { finance: 3 }, stock: { finance: 3 }, trade: { finance: 2 },
  // Healthcare
  doctor: { healthcare: 3 }, medicine: { healthcare: 3 }, nurse: { healthcare: 3 },
  hospital: { healthcare: 2 }, health: { healthcare: 2 }, therapy: { healthcare: 2 },
  mental: { healthcare: 2 }, surgery: { healthcare: 3 }, dental: { healthcare: 2 },
  // Engineering
  engineer: { engineering: 3 }, build: { engineering: 2, trades: 1 },
  design: { engineering: 1, creative: 2 }, mechanical: { engineering: 3 },
  electrical: { engineering: 3 }, civil: { engineering: 3 }, aerospace: { engineering: 3 },
  // Creative
  art: { creative: 3 }, draw: { creative: 3 }, paint: { creative: 3 },
  music: { creative: 2, media: 1 }, sing: { creative: 2, media: 1 },
  dance: { creative: 2, sports: 1 }, film: { creative: 2, media: 2 },
  photo: { creative: 2, media: 2 }, fashion: { creative: 3 },
  // Education
  teach: { education: 3 }, tutor: { education: 2 }, school: { education: 2 },
  kids: { education: 2 }, children: { education: 2 }, counsel: { education: 2 },
  // Law
  law: { law: 3 }, lawyer: { law: 3 }, legal: { law: 3 }, judge: { law: 3 },
  police: { law: 2 }, government: { law: 2 }, politics: { law: 2 }, policy: { law: 2 },
  // Trades
  fix: { trades: 2 }, repair: { trades: 2 }, weld: { trades: 3 }, plumb: { trades: 3 },
  electric: { trades: 2, engineering: 1 }, construct: { trades: 2 }, carpent: { trades: 3 },
  // Science
  science: { science: 3 }, research: { science: 2 }, lab: { science: 2 },
  experiment: { science: 2 }, biology: { science: 3 }, chemistry: { science: 3 },
  physics: { science: 3 }, nature: { science: 1 }, environment: { science: 2 },
  // Media
  write: { media: 2, creative: 1 }, writing: { media: 2, creative: 1 },
  blog: { media: 2 }, journalism: { media: 3 }, podcast: { media: 2 },
  video: { media: 2 }, youtube: { media: 3 }, social: { media: 2 },
  // Sports
  sport: { sports: 3 }, athlete: { sports: 3 }, football: { sports: 3 },
  basketball: { sports: 3 }, soccer: { sports: 3 }, swim: { sports: 2 },
  track: { sports: 2 }, gym: { sports: 2 }, fitness: { sports: 2 },
  // Finance
  finance: { finance: 3 }, accounting: { finance: 3 }, economic: { finance: 2 },
  bank: { finance: 2 }, crypto: { finance: 2, technology: 1 },
};

export function scoreKeywords(text: string): Record<string, number> {
  const scores: Record<string, number> = {};
  const lower = text.toLowerCase();
  for (const [keyword, clusterPoints] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword)) {
      for (const [cluster, pts] of Object.entries(clusterPoints)) {
        scores[cluster] = (scores[cluster] || 0) + pts;
      }
    }
  }
  return scores;
}

export function computeTopClusters(answers: Record<string, any>): { cluster: CareerCluster; score: number }[] {
  const scores: Record<string, number> = {};
  const init = () => CAREER_CLUSTERS.forEach(c => { if (!scores[c.id]) scores[c.id] = 0; });
  init();

  // Salary importance (Q4, 0-100 slider) — higher = finance/business/technology boost
  const salary = parseInt(answers["salary"] ?? "50", 10);
  if (salary >= 70) { scores["finance"] += 2; scores["business"] += 1; scores["technology"] += 1; }
  if (salary >= 90) { scores["finance"] += 2; scores["business"] += 1; }
  if (salary <= 30) { scores["education"] += 1; scores["law"] += 1; scores["science"] += 1; }

  // Activity (Q1) — multi-select
  const activities: string[] = Array.isArray(answers["activities"]) ? answers["activities"] : [];
  for (const act of activities) {
    const w = QUESTION_WEIGHTS[1]?.[act] ?? {};
    for (const [c, pts] of Object.entries(w)) scores[c] = (scores[c] || 0) + pts;
  }

  // Subject (Q2) — multi-select
  const subjects: string[] = Array.isArray(answers["subjects"]) ? answers["subjects"] : [];
  for (const sub of subjects) {
    const w = QUESTION_WEIGHTS[2]?.[sub] ?? {};
    for (const [c, pts] of Object.entries(w)) scores[c] = (scores[c] || 0) + pts;
  }

  // Environment (Q3) — single
  const env = answers["environment"] ?? "";
  const envW = QUESTION_WEIGHTS[3]?.[env] ?? {};
  for (const [c, pts] of Object.entries(envW)) scores[c] = (scores[c] || 0) + pts;

  // Social (Q5) — single
  const social = answers["social"] ?? "";
  const socialW = QUESTION_WEIGHTS[5]?.[social] ?? {};
  for (const [c, pts] of Object.entries(socialW)) scores[c] = (scores[c] || 0) + pts;

  // Career priority (Q6) — single
  const priority = answers["priority"] ?? "";
  const prioW = QUESTION_WEIGHTS[6]?.[priority] ?? {};
  for (const [c, pts] of Object.entries(prioW)) scores[c] = (scores[c] || 0) + pts;

  // Personality (Q7) — single
  const personality = answers["personality"] ?? "";
  const persW = QUESTION_WEIGHTS[7]?.[personality] ?? {};
  for (const [c, pts] of Object.entries(persW)) scores[c] = (scores[c] || 0) + pts;

  // Text: hobbies (Q8) + dream job (Q9)
  const hobbyScores = scoreKeywords(answers["hobbies"] ?? "");
  const dreamScores = scoreKeywords(answers["dream"] ?? "");
  for (const [c, pts] of Object.entries(hobbyScores)) scores[c] = (scores[c] || 0) + pts;
  for (const [c, pts] of Object.entries(dreamScores)) scores[c] = (scores[c] || 0) + (pts * 1.5); // dream job weighted more

  return CAREER_CLUSTERS
    .map(c => ({ cluster: c, score: scores[c.id] || 0 }))
    .sort((a, b) => b.score - a.score);
}
