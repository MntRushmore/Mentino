import { Hono } from "hono";
import React from "react";
import { render } from "../app";
import { Layout } from "../views/Layout";
import { optionalAuth } from "../middleware/auth";
import { supabase } from "../db";
import { CAREER_CLUSTERS, KEYWORD_MAP } from "../lib/careerMapping";

export const quiz = new Hono();

// GET /quiz — main quiz page (SSR shell, JS drives it)
quiz.get("/", optionalAuth, async (c) => {
  const user = c.get("user");
  return render(
    <Layout title="Career Discovery Quiz | Mentino" user={user} currentPath="/quiz">
      <QuizPage />
    </Layout>
  );
});

// GET /quiz/results — results page driven by query params
quiz.get("/results", optionalAuth, async (c) => {
  const user = c.get("user");
  const clusterId = c.req.query("cluster") || "technology";
  const directCareer = c.req.query("career") || null;
  const cluster = CAREER_CLUSTERS.find(cl => cl.id === clusterId) ?? CAREER_CLUSTERS[0];

  // Fetch mentors in this career field
  const { data: mentors } = await supabase
    .from("mentors")
    .select("id, user_id, career_field, job_title, company, topics, accounts!user_id!inner(first_name, last_name, bio)")
    .eq("verification_status", "approved")
    .limit(3);

  // Filter by cluster relevance (career field keyword match)
  const clusterKeywords = [cluster.name.toLowerCase(), ...cluster.relatedCareers.map(r => r.toLowerCase())];
  const filteredMentors = (mentors || []).filter((m: any) => {
    const field = (m.career_field || "").toLowerCase();
    const title = (m.job_title || "").toLowerCase();
    return clusterKeywords.some(k => field.includes(k.split(" ")[0]) || title.includes(k.split(" ")[0]));
  }).slice(0, 3);

  const displayMentors = filteredMentors.length > 0 ? filteredMentors : (mentors || []).slice(0, 3);

  return render(
    <Layout title={`${cluster.name} Career Match | Mentino`} user={user} currentPath="/quiz">
      <ResultsPage cluster={cluster} mentors={displayMentors} user={user} directCareer={directCareer} />
    </Layout>
  );
});

// Inline quiz page component
function QuizPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0e0e2e 0%, #1e1b4b 60%, #1a1035 100%)", position: "relative", overflow: "hidden" }}>
      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: -120, right: -80, width: 420, height: 420, background: "radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: -60, width: 320, height: 320, background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      <div id="quiz-app" style={{ maxWidth: 700, margin: "0 auto", padding: "48px 20px 80px", position: "relative", zIndex: 1 }}>

        {/* Landing screen */}
        <div id="landing-screen">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            {/* Brand gradient badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 99, padding: "6px 16px", marginBottom: 20 }}>
              <span style={{ fontSize: 14 }}>🧭</span>
              <span style={{ color: "#c4b5fd", fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>Career Discovery</span>
            </div>
            <h1 style={{ color: "white", fontSize: 32, fontWeight: 800, margin: "0 0 14px", lineHeight: 1.2 }}>
              Find your{" "}
              <span style={{ background: "linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>perfect career path</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 16, maxWidth: 460, margin: "0 auto", lineHeight: 1.65 }}>
              Answer 10 quick questions or tell us a career you have in mind. We'll show you resources, mentors, and next steps.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <button {...{"onclick": "showDiscoverMode()"} as any} style={{
              background: "linear-gradient(135deg, rgba(236,72,153,0.1), rgba(139,92,246,0.12), rgba(59,130,246,0.08))",
              border: "1.5px solid rgba(139,92,246,0.4)", borderRadius: 20, padding: "28px 30px",
              cursor: "pointer", textAlign: "left", width: "100%", transition: "border-color 0.2s",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #ec4899, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🔍</div>
                <div>
                  <div style={{ color: "white", fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Help me discover my career</div>
                  <div style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.55 }}>Answer 10 short questions and we'll match you to your best-fit career cluster with personalized resources and mentor recommendations.</div>
                  <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #ec4899, #8b5cf6)", borderRadius: 99, padding: "5px 14px" }}>
                    <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>Start Quiz →</span>
                  </div>
                </div>
              </div>
            </button>
            <button {...{"onclick": "showDirectMode()"} as any} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "28px 30px",
              cursor: "pointer", textAlign: "left", width: "100%", transition: "border-color 0.2s",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>⚡</div>
                <div>
                  <div style={{ color: "white", fontSize: 17, fontWeight: 700, marginBottom: 6 }}>I already know my career</div>
                  <div style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.55 }}>Tell us the career you have in mind and instantly get curated books, articles, and videos to explore it.</div>
                  <div style={{ marginTop: 12, color: "#64748b", fontSize: 13 }}>Skip the quiz, go straight to resources</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Direct career input screen */}
        <div id="direct-career-screen" style={{ display: "none" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 99, padding: "6px 16px", marginBottom: 20 }}>
              <span style={{ fontSize: 14 }}>⚡</span>
              <span style={{ color: "#c4b5fd", fontSize: 13, fontWeight: 600 }}>Direct Career Search</span>
            </div>
            <h1 style={{ color: "white", fontSize: 26, fontWeight: 800, margin: "0 0 10px" }}>What career are you interested in?</h1>
            <p style={{ color: "#64748b", fontSize: 15 }}>Type a career and we'll find the best resources for you right away.</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 20, padding: "36px 32px" }}>
            <input
              type="text"
              id="direct-career-input"
              placeholder="e.g. Software engineer, nurse, architect, teacher..."
              style={{
                width: "100%", padding: "16px 18px", background: "rgba(255,255,255,0.06)",
                border: "1.5px solid rgba(139,92,246,0.25)", borderRadius: 14,
                color: "white", fontSize: 16, outline: "none", boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button {...{"onclick": "goBackToLanding()"} as any} style={{
                padding: "13px 24px", background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8",
                borderRadius: 12, cursor: "pointer", fontSize: 15,
              }}>Back</button>
              <button {...{"onclick": "submitDirectCareer()"} as any} style={{
                flex: 1, padding: "13px 24px",
                background: "linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6)",
                border: "none", color: "white", borderRadius: 12,
                cursor: "pointer", fontSize: 15, fontWeight: 700,
              }}>Get Resources →</button>
            </div>
          </div>
        </div>

        {/* Progress bar (hidden initially) */}
        <div id="progress-wrap" style={{ marginBottom: 32, display: "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span id="progress-label" style={{ color: "#94a3b8", fontSize: 14 }}>Question 1 of 10</span>
            <span id="progress-pct" style={{ background: "linear-gradient(90deg, #ec4899, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: 14, fontWeight: 700 }}>10%</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99 }}>
            <div id="progress-bar" style={{ height: "100%", width: "10%", background: "linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)", borderRadius: 99, transition: "width 0.4s ease" }}></div>
          </div>
        </div>

        {/* Question card (hidden initially) */}
        <div id="question-card" style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(139,92,246,0.2)",
          borderRadius: 24,
          padding: "40px 36px",
          minHeight: 400,
          display: "none",
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        }}>
          <div id="question-content">Loading...</div>
        </div>

        {/* Navigation (hidden initially, shown as flex when quiz starts) */}
        <div id="quiz-nav" style={{ justifyContent: "space-between", marginTop: 24, gap: 12, display: "none" }}>
          <button id="btn-prev" {...{"onclick": "prevQuestion()"} as any} style={{
            padding: "12px 28px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#94a3b8", borderRadius: 14, cursor: "pointer", fontSize: 15,
          }}>Back</button>
          <div style={{ flex: 1 }}></div>
          <button id="btn-next" {...{"onclick": "nextQuestion()"} as any} style={{
            padding: "12px 32px", background: "linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6)",
            border: "none", color: "white", borderRadius: 14, cursor: "pointer", fontSize: 15, fontWeight: 700,
          }}>Next</button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .q-title { color: white; font-size: 22px; font-weight: 800; margin-bottom: 8px; line-height: 1.4; }
        .q-sub { color: #94a3b8; font-size: 15px; margin-bottom: 28px; }
        .option-btn {
          display: flex; align-items: center; gap: 14px;
          width: 100%; padding: 16px 20px; margin-bottom: 10px;
          background: rgba(255,255,255,0.03); border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 16px; cursor: pointer; text-align: left;
          color: #e2e8f0; font-size: 15px; transition: all 0.2s;
        }
        .option-btn:hover { background: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.4); transform: translateY(-1px); }
        .option-btn.selected {
          background: linear-gradient(135deg, rgba(236,72,153,0.15), rgba(139,92,246,0.15));
          border-color: #8b5cf6; color: white;
          box-shadow: 0 0 20px rgba(139,92,246,0.2);
        }
        .option-btn .opt-icon { font-size: 22px; flex-shrink: 0; }
        .slider-wrap { padding: 16px 4px; }
        .slider-wrap input[type=range] {
          -webkit-appearance: none; width: 100%; height: 6px;
          background: linear-gradient(90deg, #8b5cf6 var(--val, 50%), rgba(255,255,255,0.08) var(--val, 50%));
          border-radius: 99px; outline: none;
        }
        .slider-wrap input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 24px; height: 24px;
          background: linear-gradient(135deg, #ec4899, #8b5cf6); border-radius: 50%;
          box-shadow: 0 0 12px rgba(139,92,246,0.7); cursor: pointer;
        }
        .slider-labels { display: flex; justify-content: space-between; color: #64748b; font-size: 13px; margin-top: 10px; }
        .text-input {
          width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(139,92,246,0.2); border-radius: 14px;
          color: white; font-size: 15px; outline: none; box-sizing: border-box;
          font-family: inherit; resize: vertical; min-height: 80px;
        }
        .text-input:focus { border-color: #8b5cf6; background: rgba(139,92,246,0.08); }
        .text-input::placeholder { color: #475569; }
        #direct-career-input:focus { border-color: #8b5cf6 !important; background: rgba(139,92,246,0.08) !important; }
        @media (max-width: 600px) {
          #quiz-app { padding: 24px 16px 60px; }
          #question-card { padding: 28px 20px; }
          .q-title { font-size: 18px; }
        }
      ` }} />

      <script dangerouslySetInnerHTML={{ __html: `
// Module-level data shared across quiz and direct-career modes
var CLUSTER_IDS = ${JSON.stringify(CAREER_CLUSTERS.map(c => c.id))};
var CLUSTER_DEFS = ${JSON.stringify(CAREER_CLUSTERS.map(c => ({ id: c.id, name: c.name, relatedCareers: c.relatedCareers })))};
var KEYWORD_MAP = ${JSON.stringify(KEYWORD_MAP)};

var WEIGHTS = {
  activities: ${JSON.stringify({"coding":{"technology":3,"engineering":1},"sports":{"sports":3},"art":{"creative":3,"media":1},"volunteering":{"education":2,"healthcare":1,"law":1},"music":{"creative":2,"media":2},"debate":{"law":3,"media":1,"business":1},"science":{"science":3,"engineering":1,"healthcare":1},"business":{"business":3,"finance":2}})},
  subjects:   ${JSON.stringify({"math":{"engineering":2,"finance":2,"science":1,"technology":1},"science":{"science":3,"engineering":1,"healthcare":2},"english":{"media":2,"education":1,"law":1,"creative":1},"history":{"law":2,"education":2,"media":1},"art":{"creative":3},"pe":{"sports":3,"healthcare":1},"cs":{"technology":3,"engineering":1},"business":{"business":3,"finance":2}})},
  environment:${JSON.stringify({"office":{"business":1,"finance":1,"law":1},"outdoors":{"trades":2,"sports":1,"science":1},"lab":{"science":3,"healthcare":2,"engineering":1},"studio":{"creative":3,"media":2},"community":{"education":2,"healthcare":1,"law":1},"remote":{"technology":2,"media":1,"business":1}})},
  social:     ${JSON.stringify({"alone":{"science":1,"technology":1,"creative":1},"small":{"education":1,"healthcare":1},"large":{"business":2,"law":1,"media":1,"sports":1},"mix":{"business":1,"media":1}})},
  priority:   ${JSON.stringify({"helping":{"healthcare":3,"education":2,"law":1},"money":{"finance":3,"business":2,"technology":1},"creativity":{"creative":3,"media":2},"stability":{"trades":2,"finance":1,"education":1},"impact":{"science":2,"law":2,"education":1,"healthcare":1},"recognition":{"media":2,"sports":2,"business":1}})},
  personality:${JSON.stringify({"analytical":{"technology":2,"science":2,"finance":2,"engineering":1},"creative":{"creative":3,"media":2},"leader":{"business":3,"law":2,"sports":1},"helper":{"healthcare":2,"education":3},"builder":{"engineering":2,"trades":3},"communicator":{"media":3,"law":2,"education":1}})},
};

var QUESTIONS = [
  {
    id: "grade", type: "single",
    title: "What grade are you in?",
    sub: "This helps us tailor career timelines for you.",
    options: [
      { value: "6-8", label: "Middle School (6th-8th)", icon: "📖" },
      { value: "9", label: "9th Grade", icon: "🏫" },
      { value: "10", label: "10th Grade", icon: "📚" },
      { value: "11", label: "11th Grade", icon: "🎓" },
      { value: "12", label: "12th Grade", icon: "🏆" },
      { value: "college", label: "College / Other", icon: "🎯" },
    ]
  },
  {
    id: "activities", type: "multi",
    title: "What do you do after school?",
    sub: "Select all that apply.",
    options: [
      { value: "coding", label: "Coding / Tech Projects", icon: "💻" },
      { value: "sports", label: "Sports / Athletics", icon: "⚽" },
      { value: "art", label: "Art / Drawing / Design", icon: "🎨" },
      { value: "volunteering", label: "Volunteering / Community", icon: "🤝" },
      { value: "music", label: "Music / Performing Arts", icon: "🎵" },
      { value: "debate", label: "Debate / Student Council", icon: "🗣️" },
      { value: "science", label: "Science Club / STEM", icon: "🔬" },
      { value: "business", label: "Business / Entrepreneurship", icon: "💡" },
    ]
  },
  {
    id: "subjects", type: "multi",
    title: "Which subjects do you enjoy most?",
    sub: "Pick your top subjects.",
    options: [
      { value: "math", label: "Math", icon: "📐" },
      { value: "science", label: "Science", icon: "⚗️" },
      { value: "english", label: "English / Writing", icon: "✍️" },
      { value: "history", label: "History / Social Studies", icon: "🌍" },
      { value: "art", label: "Art / Music", icon: "🎭" },
      { value: "pe", label: "Physical Education", icon: "🏃" },
      { value: "cs", label: "Computer Science", icon: "🖥️" },
      { value: "business", label: "Business / Economics", icon: "📈" },
    ]
  },
  {
    id: "environment", type: "single",
    title: "Where do you see yourself working?",
    sub: "Pick the environment that feels most right.",
    options: [
      { value: "office", label: "Office / Corporate", icon: "🏢" },
      { value: "outdoors", label: "Outdoors / Field Work", icon: "🌲" },
      { value: "lab", label: "Lab / Research Facility", icon: "🔬" },
      { value: "studio", label: "Studio / Creative Space", icon: "🎨" },
      { value: "community", label: "Community / Schools / Clinics", icon: "🏥" },
      { value: "remote", label: "Remote / From Anywhere", icon: "🌐" },
    ]
  },
  {
    id: "salary", type: "slider",
    title: "How important is a high salary to you?",
    sub: "Be honest. There's no wrong answer.",
    min: 0, max: 100, defaultVal: 50,
    labels: ["Not at all", "Somewhat", "Very important"],
  },
  {
    id: "social", type: "single",
    title: "How do you prefer to work?",
    sub: "Think about your ideal day.",
    options: [
      { value: "alone", label: "Mostly alone, deep focus", icon: "🎧" },
      { value: "small", label: "Small team of 2-5 people", icon: "👥" },
      { value: "large", label: "Large groups or public", icon: "🎤" },
      { value: "mix", label: "Mix of both", icon: "🔄" },
    ]
  },
  {
    id: "priority", type: "single",
    title: "What matters most to you in a career?",
    sub: "Choose the one that resonates most.",
    options: [
      { value: "helping", label: "Helping others directly", icon: "❤️" },
      { value: "money", label: "Earning a great income", icon: "💰" },
      { value: "creativity", label: "Creative freedom", icon: "✨" },
      { value: "stability", label: "Job security & stability", icon: "🏛️" },
      { value: "impact", label: "Changing the world", icon: "🌍" },
      { value: "recognition", label: "Fame or recognition", icon: "⭐" },
    ]
  },
  {
    id: "personality", type: "single",
    title: "Which word best describes you?",
    sub: "Go with your gut.",
    options: [
      { value: "analytical", label: "Analytical: I love data and logic", icon: "🧠" },
      { value: "creative", label: "Creative: I think outside the box", icon: "🎨" },
      { value: "leader", label: "Leader: I take charge naturally", icon: "👑" },
      { value: "helper", label: "Helper: I care about people", icon: "🤗" },
      { value: "builder", label: "Builder: I love making things", icon: "🔧" },
      { value: "communicator", label: "Communicator: I love to talk and write", icon: "💬" },
    ]
  },
  {
    id: "hobbies", type: "text",
    title: "What are your hobbies or passions?",
    sub: "Describe what you love doing in your free time. Be specific!",
    placeholder: "e.g. I love building apps, playing guitar, drawing comics...",
  },
  {
    id: "dream", type: "text",
    title: "What's your dream job or career?",
    sub: "Even if it seems unrealistic, write it down.",
    placeholder: "e.g. Game developer, doctor, musician, own my own business...",
  },
];

var current = 0;
var answers = {};
try { answers = JSON.parse(localStorage.getItem('quiz_answers') || '{}'); } catch(e) {}

// ---- Screen management ----

function showDiscoverMode() {
  document.getElementById('landing-screen').style.display = 'none';
  document.getElementById('progress-wrap').style.display = 'block';
  document.getElementById('question-card').style.display = 'block';
  document.getElementById('quiz-nav').style.display = 'flex';
  renderQuestion();
}

function showDirectMode() {
  document.getElementById('landing-screen').style.display = 'none';
  document.getElementById('direct-career-screen').style.display = 'block';
  setTimeout(function() {
    var inp = document.getElementById('direct-career-input');
    if (inp) {
      inp.focus();
      inp.onkeydown = function(e) { if (e.key === 'Enter') submitDirectCareer(); };
    }
  }, 50);
}

function goBackToLanding() {
  document.getElementById('direct-career-screen').style.display = 'none';
  document.getElementById('landing-screen').style.display = 'block';
}

// ---- Shared scoring helpers ----

function initScores() {
  var s = {};
  CLUSTER_IDS.forEach(function(id) { s[id] = 0; });
  return s;
}

function scoreText(clusterScores, text, mult) {
  mult = mult || 1;
  var lower = (text || '').toLowerCase();
  Object.keys(KEYWORD_MAP).forEach(function(kw) {
    if (lower.indexOf(kw) !== -1) {
      var pts = KEYWORD_MAP[kw];
      Object.keys(pts).forEach(function(c) { clusterScores[c] = (clusterScores[c] || 0) + pts[c] * mult; });
    }
  });
}

function topCluster(clusterScores) {
  return Object.keys(clusterScores).sort(function(a, b) { return clusterScores[b] - clusterScores[a]; })[0] || 'technology';
}

// ---- Direct career submission ----

function submitDirectCareer() {
  var inp = document.getElementById('direct-career-input');
  var text = (inp ? inp.value : '').trim();
  if (!text) {
    if (inp) { inp.style.borderColor = '#ef4444'; setTimeout(function() { inp.style.borderColor = 'rgba(255,255,255,0.12)'; }, 1500); }
    return;
  }
  var scores = initScores();
  // Keyword matching (high weight since this is intentional input)
  scoreText(scores, text, 2);
  // Direct match against cluster names and related careers
  var lower = text.toLowerCase();
  CLUSTER_DEFS.forEach(function(cl) {
    if (lower.indexOf(cl.name.toLowerCase()) !== -1) {
      scores[cl.id] = (scores[cl.id] || 0) + 15;
    }
    cl.relatedCareers.forEach(function(career) {
      var cl2 = career.toLowerCase();
      if (lower.indexOf(cl2) !== -1 || lower === cl2.split(' ')[0]) {
        scores[cl.id] = (scores[cl.id] || 0) + 8;
      }
    });
  });
  var top = topCluster(scores);
  localStorage.setItem('quiz_completed', '1');
  window.location.href = '/quiz/results?cluster=' + encodeURIComponent(top) + '&career=' + encodeURIComponent(text);
}

// ---- Quiz flow ----

function saveAnswers() {
  try { localStorage.setItem('quiz_answers', JSON.stringify(answers)); } catch(e) {}
}

function renderQuestion() {
  var q = QUESTIONS[current];
  var pct = Math.round(((current + 1) / QUESTIONS.length) * 100);
  document.getElementById('progress-label').textContent = 'Question ' + (current + 1) + ' of ' + QUESTIONS.length;
  document.getElementById('progress-pct').textContent = pct + '%';
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('btn-prev').style.display = current > 0 ? 'block' : 'none';
  document.getElementById('btn-next').textContent = current === QUESTIONS.length - 1 ? 'See My Results →' : 'Next →';

  var html = '<div class="q-title">' + q.title + '</div>';
  html += '<div class="q-sub">' + q.sub + '</div>';

  if (q.type === 'single' || q.type === 'multi') {
    for (var i = 0; i < q.options.length; i++) {
      var opt = q.options[i];
      var sel = q.type === 'multi'
        ? (Array.isArray(answers[q.id]) && answers[q.id].indexOf(opt.value) !== -1)
        : answers[q.id] === opt.value;
      html += '<button class="option-btn' + (sel ? ' selected' : '') + '" onclick="selectOpt(' + JSON.stringify(q.id) + ',' + JSON.stringify(opt.value) + ',' + JSON.stringify(q.type) + ')">'
        + '<span class="opt-icon">' + opt.icon + '</span>'
        + '<span>' + opt.label + '</span>'
        + '</button>';
    }
  } else if (q.type === 'slider') {
    var val = answers[q.id] !== undefined ? answers[q.id] : q.defaultVal;
    html += '<div class="slider-wrap">'
      + '<input type="range" id="slider-' + q.id + '" min="' + q.min + '" max="' + q.max + '" value="' + val + '" '
      + 'style="--val:' + val + '%"'
      + ' oninput="updateSlider(this,' + JSON.stringify(q.id) + ')">'
      + '<div class="slider-labels"><span>' + q.labels[0] + '</span><span>' + q.labels[1] + '</span><span>' + q.labels[2] + '</span></div>'
      + '</div>';
  } else if (q.type === 'text') {
    var textVal = answers[q.id] || '';
    html += '<textarea class="text-input" id="text-' + q.id + '" placeholder="' + q.placeholder + '" rows="4" oninput="updateText(this,' + JSON.stringify(q.id) + ')">' + textVal + '</textarea>';
  }

  document.getElementById('question-content').innerHTML = html;
}

function selectOpt(qId, value, type) {
  if (type === 'single') {
    answers[qId] = value;
  } else {
    if (!Array.isArray(answers[qId])) answers[qId] = [];
    var idx = answers[qId].indexOf(value);
    if (idx === -1) answers[qId].push(value);
    else answers[qId].splice(idx, 1);
  }
  saveAnswers();
  renderQuestion();
}

function updateSlider(el, qId) {
  var val = el.value;
  answers[qId] = parseInt(val, 10);
  el.style.setProperty('--val', val + '%');
  saveAnswers();
}

function updateText(el, qId) {
  answers[qId] = el.value;
  saveAnswers();
}

function nextQuestion() {
  if (current === QUESTIONS.length - 1) {
    submitQuiz();
    return;
  }
  current++;
  renderQuestion();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevQuestion() {
  if (current > 0) { current--; renderQuestion(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
}

function submitQuiz() {
  var clusterScores = initScores();

  function applyWeights(w, val) {
    if (!val || !w) return;
    var pts = w[val];
    if (pts) Object.keys(pts).forEach(function(c) { clusterScores[c] = (clusterScores[c] || 0) + pts[c]; });
  }
  function applyMulti(w, vals) {
    if (!Array.isArray(vals)) return;
    vals.forEach(function(v) { applyWeights(w, v); });
  }

  applyMulti(WEIGHTS.activities, answers['activities']);
  applyMulti(WEIGHTS.subjects, answers['subjects']);
  applyWeights(WEIGHTS.environment, answers['environment']);
  applyWeights(WEIGHTS.social, answers['social']);
  applyWeights(WEIGHTS.priority, answers['priority']);
  applyWeights(WEIGHTS.personality, answers['personality']);

  var salary = parseInt(answers['salary'] || 50, 10);
  if (salary >= 70) { clusterScores['finance']=(clusterScores['finance']||0)+2; clusterScores['business']=(clusterScores['business']||0)+1; clusterScores['technology']=(clusterScores['technology']||0)+1; }
  if (salary >= 90) { clusterScores['finance']=(clusterScores['finance']||0)+2; clusterScores['business']=(clusterScores['business']||0)+1; }
  if (salary <= 30) { clusterScores['education']=(clusterScores['education']||0)+1; clusterScores['law']=(clusterScores['law']||0)+1; }

  scoreText(clusterScores, answers['hobbies'], 1);
  scoreText(clusterScores, answers['dream'], 1.5);

  var top = topCluster(clusterScores);
  localStorage.setItem('quiz_answers', JSON.stringify(answers));
  localStorage.setItem('quiz_completed', '1');
  window.location.href = '/quiz/results?cluster=' + encodeURIComponent(top);
}
      ` }} />
    </div>
  );
}

// Results page component
function ResultsPage({ cluster, mentors, user, directCareer }: { cluster: any; mentors: any[]; user: any; directCareer?: string | null }) {
  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(cluster.youtubeQuery)}`;
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(cluster.googleQuery)}`;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0e0e2e 0%, #1e1b4b 60%, #1a1035 100%)", paddingBottom: 80, position: "relative", overflow: "hidden" }}>
      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: -100, right: -60, width: 380, height: 380, background: "radial-gradient(circle, rgba(236,72,153,0.16) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 200, left: -80, width: 300, height: 300, background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      {/* Hero result */}
      <div style={{ textAlign: "center", padding: "64px 20px 48px", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 76, marginBottom: 20, filter: "drop-shadow(0 0 30px rgba(139,92,246,0.4))" }}>{cluster.emoji}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 99, padding: "6px 16px", marginBottom: 18 }}>
          <span style={{ color: "#c4b5fd", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5 }}>
            {directCareer ? `Resources for: ${directCareer}` : "Your Top Career Match"}
          </span>
        </div>
        <h1 style={{ color: "white", fontSize: 44, fontWeight: 800, margin: "0 0 20px", lineHeight: 1.1 }}>
          <span style={{ background: "linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{cluster.name}</span>
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 17, maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.7 }}>{cluster.description}</p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <a href={ytUrl} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "13px 26px", background: "#ef4444", color: "white",
            borderRadius: 14, textDecoration: "none", fontWeight: 700, fontSize: 15,
          }}>▶ Watch Career Videos</a>
          <a href={googleUrl} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "13px 26px", background: "linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6)", color: "white",
            borderRadius: 14, textDecoration: "none", fontWeight: 700, fontSize: 15,
          }}>🔍 Explore Careers</a>
          <a href="/quiz" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "13px 26px", background: "rgba(255,255,255,0.06)", color: "#94a3b8",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, textDecoration: "none", fontSize: 15,
          }}>Retake Quiz</a>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 1 }}>
        {/* Related careers */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 20, padding: "32px", marginBottom: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
          <h2 style={{ color: "white", fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Related Careers to Explore</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {cluster.relatedCareers.map((career: string) => (
              <a key={career} href={`https://www.google.com/search?q=${encodeURIComponent(career + " career path salary")}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  padding: "8px 18px", background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)",
                  borderRadius: 99, color: "#c4b5fd", textDecoration: "none", fontSize: 14, fontWeight: 500,
                }}>
                {career}
              </a>
            ))}
          </div>
        </div>

        {/* Resources: Books, Articles, Videos */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 20, padding: "32px", marginBottom: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
          <h2 style={{ color: "white", fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Recommended Resources</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32 }}>Curated books, articles, and videos for {cluster.name} careers.</p>

          {/* Books */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ color: "#a5b4fc", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>
              📚 Books
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cluster.resources.books.map((book: any) => (
                <a key={book.title}
                  href={`https://www.google.com/search?q=${encodeURIComponent(book.title + " " + book.author + " book")}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", padding: "16px 18px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, textDecoration: "none" }}>
                  <div style={{ color: "white", fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{book.title}</div>
                  <div style={{ color: "#64748b", fontSize: 13, marginBottom: 6 }}>by {book.author}</div>
                  <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.5 }}>{book.why}</div>
                </a>
              ))}
            </div>
          </div>

          {/* Articles */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ color: "#34d399", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>
              📰 Articles
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cluster.resources.articles.map((article: any) => (
                <a key={article.title}
                  href={`https://www.google.com/search?q=${encodeURIComponent(article.query)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, textDecoration: "none" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "white", fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{article.title}</div>
                    <div style={{ color: "#64748b", fontSize: 13 }}>{article.source}</div>
                  </div>
                  <div style={{ color: "#475569", fontSize: 20, flexShrink: 0 }}>→</div>
                </a>
              ))}
            </div>
          </div>

          {/* Videos */}
          <div>
            <div style={{ color: "#f87171", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>
              ▶ Videos
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cluster.resources.videos.map((video: any) => (
                <a key={video.title}
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video.query)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, textDecoration: "none" }}>
                  <div style={{ width: 38, height: 38, background: "#ef4444", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "white", fontSize: 16 }}>▶</div>
                  <div style={{ color: "white", fontWeight: 600, fontSize: 14, lineHeight: 1.4 }}>{video.title}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Mentor recommendations */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 20, padding: "32px", marginBottom: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
          <h2 style={{ color: "white", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Mentors in {cluster.name}</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
            Connect with real mentors who work in this field.
            {!user && " Create a free account to send a message."}
          </p>

          {mentors.length === 0 ? (
            <p style={{ color: "#475569", textAlign: "center", padding: "20px 0" }}>
              No mentors in this field yet. Check back soon!
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {mentors.map((m: any) => {
                const acct = m.accounts as any;
                const name = `${acct?.first_name || ""} ${acct?.last_name || ""}`.trim();
                return (
                  <div key={m.id} style={{
                    display: "flex", alignItems: "center", gap: 16,
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14, padding: "18px 20px",
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366f1, #a855f7)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontWeight: 700, fontSize: 18, flexShrink: 0,
                    }}>{name[0] || "M"}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "white", fontWeight: 600, marginBottom: 2 }}>{name}</div>
                      <div style={{ color: "#64748b", fontSize: 13 }}>{m.job_title}{m.company ? ` at ${m.company}` : ""}</div>
                    </div>
                    {user ? (
                      <a href={`/profile/${m.user_id}`} style={{
                        padding: "8px 18px", background: "linear-gradient(135deg, #6366f1, #a855f7)",
                        color: "white", borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 600, flexShrink: 0,
                      }}>View Profile</a>
                    ) : (
                      <a href="/login" style={{
                        padding: "8px 18px", background: "rgba(99,102,241,0.15)",
                        color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)",
                        borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 600, flexShrink: 0,
                      }}>Login to Connect</a>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!user && (
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <a href="/signup" style={{
                display: "inline-block", padding: "12px 28px",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                color: "white", borderRadius: 12, textDecoration: "none", fontWeight: 600,
              }}>Create Free Account</a>
              <span style={{ color: "#475569", fontSize: 13, marginLeft: 12 }}>Already have one? <a href="/login" style={{ color: "#6366f1" }}>Log in</a></span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <a href="/matching" style={{
            display: "inline-block", padding: "15px 36px",
            background: "linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6)",
            color: "white", borderRadius: 14, textDecoration: "none", fontWeight: 700, fontSize: 16,
            boxShadow: "0 8px 32px rgba(139,92,246,0.4)",
          }}>{user ? "Browse All Mentors →" : "Find a Mentor →"}</a>
        </div>
      </div>
    </div>
  );
}
