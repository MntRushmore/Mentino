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

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  categoryColor: string;
  coverImage: string;
  excerpt: string;
  readTime: string;
  content: string;
  mentorAuthorId?: string;
  mentorAuthorTitle?: string;
}

// Blog post data
const blogPosts: BlogPost[] = [
  {
    slug: "family-law-attorney-qa",
    title: "What Law Actually Looks Like: A Family Attorney Answers 7 Honest Questions",
    date: "July 15, 2026",
    author: "Dustin Vorsatz",
    category: "Mentor Spotlight",
    categoryColor: "indigo",
    coverImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
    excerpt: "12 years in family law. The hardest part isn't the law. It's the humans. An attorney's unfiltered answers to the questions students actually want to ask.",
    readTime: "9 min read",
    mentorAuthorId: "38560524-3645-44e5-8ddb-8d790ff3b3d9",
    mentorAuthorTitle: "Attorney · Law Offices of Vorsatz & Vorsatz, A PC",
    content: `
      <style>
        .qa-intro-box { background: #f4f1ea; border-radius: 12px; padding: 24px 28px; margin-bottom: 32px; }
        .qa-intro-box p { color: #1f2420 !important; line-height: 1.7; margin-bottom: 0 !important; }
        .qa-intro-box strong { color: #1f2420 !important; }
        .qa-block { margin-bottom: 40px; padding-bottom: 40px; border-bottom: 1px solid #e7e2d8; }
        .qa-block:last-of-type { border-bottom: none; }
        .qa-question { display: flex; align-items: flex-start; gap: 12px; border-left: 2px solid #b84d0c; padding: 4px 0 4px 16px; margin-bottom: 16px; }
        .qa-q-num { background: #b84d0c; color: #fff; font-size: 12px; font-weight: 600; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .qa-q-text { font-size: 18px; font-weight: 500; color: #1f2420; line-height: 1.5; }
        .qa-answer { color: #35332f; line-height: 1.8; }
        .qa-answer p { margin-bottom: 16px !important; color: #35332f !important; }
        .qa-pullquote { border-left: 2px solid #b84d0c; padding: 4px 0 4px 24px; margin: 24px 0; }
        .qa-pullquote p { font-family: "Newsreader", Georgia, serif; color: #1f2420 !important; font-size: 22px; line-height: 1.5; margin-bottom: 0 !important; }
        .qa-resource-box { background: #fdf1e3; border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
        .qa-resource-title { font-size: 12px; font-weight: 600; color: #1f2420; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; }
        .qa-resource-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid rgba(31,36,32,0.1); }
        .qa-resource-item:last-child { border-bottom: none; padding-bottom: 0; }
        .qa-resource-icon { display: none; }
        .qa-resource-name { font-weight: 600; color: #1f2420; font-size: 15px; margin-bottom: 4px; }
        .qa-resource-desc { color: #46433e; font-size: 14px; line-height: 1.55; }
        .qa-insight-box { background: #f6edcf; border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
        .qa-insight-label { font-size: 12px; font-weight: 600; color: #1f2420; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
        .qa-insight-box p { color: #1f2420 !important; line-height: 1.65; margin-bottom: 0 !important; font-size: 15px; }
        .qa-stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 24px 0; }
        .qa-stat { background: #fff; border: 1px solid #e7e2d8; border-radius: 12px; padding: 16px; text-align: center; }
        .qa-stat-num { font-size: 28px; font-weight: 500; color: #1f2420; line-height: 1; }
        .qa-stat-label { font-size: 12px; color: #5a5650; margin-top: 8px; line-height: 1.4; }
        .qa-close-box { background: #f4f1ea; border-radius: 12px; padding: 24px 28px; margin-top: 8px; }
        .qa-close-box p { color: #1f2420 !important; line-height: 1.8; margin-bottom: 12px !important; }
        .qa-close-box p:last-child { margin-bottom: 0 !important; }
      </style>

      <div class="qa-intro-box">
        <p>I'm <strong>Dustin Vorsatz</strong>, an attorney at the Law Offices of Vorsatz &amp; Vorsatz in San Mateo, CA. I've been practicing family law for 12 years. Ethan at Mentino asked me seven questions about my career, and I answered them the way I'd want someone to have answered them when I was getting started.</p>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">1</div>
          <div class="qa-q-text">What's one piece of advice you wish someone gave you when you were starting?</div>
        </div>
        <div class="qa-answer">
          <p>Don't stress out about where you want to land later in life.</p>
          <p>There's a ton of pressure on kids to "figure out what you want to do when you're older," and that's ridiculous. Kids should be supported in pursuing reasonable interests regardless of where they may end up. Telling a kid "be a doctor, engineer, lawyer" puts a lot of stress on them.</p>
          <div class="qa-pullquote">
            <p>If a kid really likes biology, maybe they learn later in life they want to work with animals instead of humans, or work on habitat preservation. There are literally thousands of options in each field. You don't need to know where you want to end up when you start.</p>
          </div>
          <p>The interest matters. The specific destination can wait.</p>
        </div>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">2</div>
          <div class="qa-q-text">Can you walk me through a typical day in your current role?</div>
        </div>
        <div class="qa-answer">
          <p>What's interesting about law is there's <em>no</em> typical day.</p>
          <p>There's always some paperwork to do at the office, but there may be a client meeting, phone calls, a Zoom, a court appearance, research you can do, or work on marketing your business. Any given day can include all of those or none of them.</p>
          <div class="qa-insight-box">
            <div class="qa-insight-label">What students usually miss</div>
            <p>All of the law remains largely the same, the statutes don't change that often, but each client is completely different. So each problem is completely unique. You're applying a consistent framework to an endless variety of human situations. That's what makes it genuinely interesting after 12 years.</p>
          </div>
        </div>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">3</div>
          <div class="qa-q-text">What is the most challenging or surprising part of your job?</div>
        </div>
        <div class="qa-answer">
          <p>The most challenging part is honestly the nature of humans.</p>
          <p>I work 100% in family law, so the people I'm helping are emotionally charged and genuinely hurt. A lot of them want to actively harm the person they claimed they loved for years. The divorce process or custody dispute doesn't just surface their pain. It amplifies it.</p>
          <div class="qa-pullquote">
            <p>Getting around or through the emotional wall people put up is challenging. It's not what you'd expect if you're thinking about law as a purely technical career.</p>
          </div>
          <p>The law part I can handle. The human part is what keeps it hard, and what keeps it meaningful.</p>
        </div>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">4</div>
          <div class="qa-q-text">If you had six months to prepare for this job from scratch, how exactly would you spend your time?</div>
        </div>
        <div class="qa-answer">
          <p>Six months? Sheesh. Okay.</p>
          <p>I'd start with the fundamentals that help you understand how the system actually works, not just what the rules say on paper.</p>
          <div class="qa-resource-box">
            <div class="qa-resource-title">Resources Dustin Recommends</div>
            <div class="qa-resource-item">
              <div class="qa-resource-icon"></div>
              <div>
                <div class="qa-resource-name">The Judge's Bench Blotter</div>
                <div class="qa-resource-desc">A guide a retired judge publishes each year. It runs through major family law topics and the law surrounding specific concepts: child support, move-aways, etc. A shortcut to understanding what judges actually care about, in their own words.</div>
              </div>
            </div>
            <div class="qa-resource-item">
              <div class="qa-resource-icon"></div>
              <div>
                <div class="qa-resource-name">San Mateo Court Self Help Website</div>
                <div class="qa-resource-desc">Breaks down the general process of individual matters: how to modify support, how to modify custody, etc. Invaluable for understanding what a client actually goes through, step by step, in plain language.</div>
              </div>
            </div>
          </div>
          <p>Beyond the reading: spend time in a courtroom. Watch real cases. The fastest way to understand how something actually works is to watch people do it in real conditions, not read about it.</p>
        </div>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">5</div>
          <div class="qa-q-text">What's one common misconception about your industry?</div>
        </div>
        <div class="qa-answer">
          <p>That being a lawyer is anything like what you see on TV.</p>
          <div class="qa-pullquote">
            <p>There's maybe 1% of practicing attorneys that have careers like Suits or Lincoln Lawyer. Most lawyers are honest, ethical grinders who help clients move through a broken system.</p>
          </div>
          <div class="qa-stat-row">
            <div class="qa-stat">
              <div class="qa-stat-num">~1%</div>
              <div class="qa-stat-label">Attorneys whose careers resemble TV drama</div>
            </div>
            <div class="qa-stat">
              <div class="qa-stat-num">99%</div>
              <div class="qa-stat-label">Honest grinders helping real clients</div>
            </div>
            <div class="qa-stat">
              <div class="qa-stat-num">1.3M+</div>
              <div class="qa-stat-label">Licensed attorneys in the US (ABA, 2023)</div>
            </div>
          </div>
          <p>Some attorneys are unscrupulous, but those are rarer than TV would have you believe, too. The work is unglamorous most of the time. And I'd argue that's exactly what makes it meaningful: clients genuinely need you.</p>
        </div>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">6</div>
          <div class="qa-q-text">What's one skill students should start developing now?</div>
        </div>
        <div class="qa-answer">
          <p>Disconnecting from tech and learning how to problem-solve with your own skills.</p>
          <p>So many attorneys are becoming reliant on AI or auto-research and aren't understanding <em>why</em> cases are decided the way they are. I don't have an issue with people who aren't strong writers using AI to check their work. But too much reliance on tech doing all of the heavy lifting means you simply don't understand why the system functions the way it does.</p>
          <div class="qa-insight-box">
            <div class="qa-insight-label">The real risk</div>
            <p>If you can't reason through a problem without a tool, you can't catch it when the tool is wrong. And tools are wrong more than people realize, especially on nuanced, jurisdiction-specific legal questions. The baseline has to be your own understanding. This isn't an AI-specific point; it applies to every shortcut in every field.</p>
          </div>
        </div>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">7</div>
          <div class="qa-q-text">If you were in high school again, what would you do differently?</div>
        </div>
        <div class="qa-answer">
          <p>I'd take more time to explore other topics. High school now is so much different than when I was in school. We didn't have elective classes. I'd take classes that give me life skills: shop class, home ec, statistics, tax classes.</p>
          <p>These are all issues that crop up as a normal adult, and not everyone gets the luxury of saying "I make enough money to pay someone to do this for me."</p>
          <div class="qa-pullquote">
            <p>I think adults should know how to function basically: check your oil and change a tire, cook a healthy meal, understand how to budget your finances and figure out basic taxes.</p>
          </div>
          <div class="qa-insight-box">
            <div class="qa-insight-label">The thing nobody says out loud about high school</div>
            <p>High school as a system was built to acclimate humans to work an 8–9 hour day: working on 6–8 different tasks for approximately 50 minutes each. That's what it is. So you don't need to worry that "I didn't take AP Government, I'm never going to be a lawyer." That's not how any of this works. High school isn't the time to lock in your path. It's the time to learn how to show up consistently.</p>
          </div>
        </div>
      </div>

      <div class="qa-close-box">
        <p>If you're considering a career in law, or any field where you work directly with people, know that the human side of the job will be just as demanding as the technical side. The law itself is learnable. Understanding people is what you'll work on your whole career.</p>
        <p>If you have questions about what life in law actually looks like, I'm on Mentino for exactly this reason.</p>
      </div>
    `,
  },
  {
    slug: "physical-therapy-career-qa",
    title: "The Real Work of Physical Therapy: A PT Answers 7 Honest Questions",
    date: "September 20, 2026",
    author: "Stephanie Leung",
    category: "Mentor Spotlight",
    categoryColor: "indigo",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    excerpt: "It's not just the physical recovery. You become a cheerleader, a coach, and sometimes someone's emotional anchor. A physical therapist shares what the job really demands.",
    readTime: "8 min read",
    mentorAuthorId: "2476738b-1066-4208-9c5b-7c5096c49f14",
    mentorAuthorTitle: "Physical Therapist",
    content: `
      <style>
        .qa-intro-box { background: #f4f1ea; border-radius: 12px; padding: 24px 28px; margin-bottom: 32px; }
        .qa-intro-box p { color: #1f2420 !important; line-height: 1.7; margin-bottom: 0 !important; }
        .qa-intro-box strong { color: #1f2420 !important; }
        .qa-block { margin-bottom: 40px; padding-bottom: 40px; border-bottom: 1px solid #e7e2d8; }
        .qa-block:last-of-type { border-bottom: none; }
        .qa-question { display: flex; align-items: flex-start; gap: 12px; border-left: 2px solid #b84d0c; padding: 4px 0 4px 16px; margin-bottom: 16px; }
        .qa-q-num { background: #b84d0c; color: #fff; font-size: 12px; font-weight: 600; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .qa-q-text { font-size: 18px; font-weight: 500; color: #1f2420; line-height: 1.5; }
        .qa-answer { color: #35332f; line-height: 1.8; }
        .qa-answer p { margin-bottom: 16px !important; color: #35332f !important; }
        .qa-pullquote { border-left: 2px solid #b84d0c; padding: 4px 0 4px 24px; margin: 24px 0; }
        .qa-pullquote p { font-family: "Newsreader", Georgia, serif; color: #1f2420 !important; font-size: 22px; line-height: 1.5; margin-bottom: 0 !important; }
        .qa-resource-box { background: #fdf1e3; border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
        .qa-resource-title { font-size: 12px; font-weight: 600; color: #1f2420; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; }
        .qa-resource-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid rgba(31,36,32,0.1); }
        .qa-resource-item:last-child { border-bottom: none; padding-bottom: 0; }
        .qa-resource-icon { display: none; }
        .qa-resource-name { font-weight: 600; color: #1f2420; font-size: 15px; margin-bottom: 4px; }
        .qa-resource-desc { color: #46433e; font-size: 14px; line-height: 1.55; }
        .qa-insight-box { background: #f6edcf; border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
        .qa-insight-label { font-size: 12px; font-weight: 600; color: #1f2420; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
        .qa-insight-box p { color: #1f2420 !important; line-height: 1.65; margin-bottom: 0 !important; font-size: 15px; }
        .qa-stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 24px 0; }
        .qa-stat { background: #fff; border: 1px solid #e7e2d8; border-radius: 12px; padding: 16px; text-align: center; }
        .qa-stat-num { font-size: 28px; font-weight: 500; color: #1f2420; line-height: 1; }
        .qa-stat-label { font-size: 12px; color: #5a5650; margin-top: 8px; line-height: 1.4; }
        .qa-close-box { background: #f4f1ea; border-radius: 12px; padding: 24px 28px; margin-top: 8px; }
        .qa-close-box p { color: #1f2420 !important; line-height: 1.8; margin-bottom: 12px !important; }
        .qa-close-box p:last-child { margin-bottom: 0 !important; }
      </style>

      <div class="qa-intro-box">
        <p>I'm <strong>Stephanie Leung</strong>, a licensed physical therapist. Physical therapy is one of those careers where you think you know what it is, and then you actually do it. Ethan at Mentino asked me seven questions, and I answered them the way I'd want someone to have answered them for me when I was starting out.</p>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">1</div>
          <div class="qa-q-text">What's one piece of advice you wish someone gave you when you were starting?</div>
        </div>
        <div class="qa-answer">
          <p>This profession is rewarding, but it's really important to take care of yourself. As with most healthcare professions, it can be emotionally draining. Prioritize your health and well-being so you can better care for your patients.</p>
          <div class="qa-pullquote">
            <p>Forgive yourself. You will make mistakes as we all do. It doesn't help to beat yourself up because of your mistakes. You're human. Forgive yourself, learn and grow from it, and move forward.</p>
          </div>
          <div class="qa-wellbeing-box">
            <div class="qa-wellbeing-label">Why self-care isn't optional in healthcare</div>
            <p>Burnout in healthcare is one of the most studied problems in the field. PT is no exception: the emotional labor of supporting patients through pain, frustration, and setbacks compounds over years. The practitioners who last longest are the ones who treat their own recovery as seriously as their patients'.</p>
          </div>
        </div>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">2</div>
          <div class="qa-q-text">Can you walk me through a typical day in your current role?</div>
        </div>
        <div class="qa-answer">
          <p>A typical day starts with reviewing patient charts when I first get to work. Then I'll evaluate new patients or treat existing ones, prescribe and progress exercise programs, perform manual therapy as needed, and educate patients on their condition and recovery.</p>
          <p>As patients meet their goals or if they plateau, I discharge them with a plan to help them maintain their progress and manage their condition independently.</p>
          <div class="qa-stat-row">
            <div class="qa-stat">
              <div class="qa-stat-num"></div>
              <div class="qa-stat-label">Chart review every morning</div>
            </div>
            <div class="qa-stat">
              <div class="qa-stat-num"></div>
              <div class="qa-stat-label">Prescribe & progress exercises</div>
            </div>
            <div class="qa-stat">
              <div class="qa-stat-num"></div>
              <div class="qa-stat-label">Educate & discharge with a plan</div>
            </div>
          </div>
          <div class="qa-insight-box">
            <div class="qa-insight-label">What "manual therapy" actually means</div>
            <p>Manual therapy is hands-on work: joint mobilizations, soft tissue manipulation, massage. It's one of the most direct tools a PT has, and it's also one of the things that makes PT distinct from just prescribing a set of exercises. It requires a trained clinical touch that takes years to develop.</p>
          </div>
        </div>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">3</div>
          <div class="qa-q-text">What is the most challenging or surprising part of your job?</div>
        </div>
        <div class="qa-answer">
          <p>One of the biggest challenges is realizing that you can't change people, you can only guide them. Patients have to be willing to put in the work to recover. It's not passive. I guide them and they have to do the homework.</p>
          <p>A big part of my job is getting patients to buy into the treatment plan by helping them understand why we're doing certain exercises or treatments.</p>
          <div class="qa-pullquote">
            <p>A surprising part of the job, beyond the physical recovery work, is becoming people's emotional support as well. Although you didn't sign up to be a mental health therapist, you end up being one anyway.</p>
          </div>
          <p>Losing physical function significantly affects people mentally and emotionally, and you are their cheerleader. It's rewarding, but can be draining as well.</p>
          <div class="qa-insight-box">
            <div class="qa-insight-label">The therapist's dilemma</div>
            <p>This dynamic, caring deeply but not being able to force progress, is one of the most psychologically demanding parts of healthcare. The most effective PTs learn to separate patient outcomes from their own self-worth. You can give everything, and still have a patient who doesn't follow through. That's not a failure of your skill; it's the reality of working with humans.</p>
          </div>
        </div>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">4</div>
          <div class="qa-q-text">If you had six months to prepare for this job from scratch, how would you spend your time?</div>
        </div>
        <div class="qa-answer">
          <p>Physical therapy school will teach you the clinical skills, but bedside manners aren't taught enough. Patients want to feel heard, respected, and understood. Practice active listening, show empathy, maintain eye contact to build genuine rapport.</p>
          <p>These skills are just as important as your clinical skills because they help patients feel supported and motivated throughout their recovery. Ultimately, it'll help you become a better practitioner.</p>
          <div class="qa-pullquote">
            <p>Learning to communicate well during stressful situations will go a long way: staying calm, not reacting, responding tactfully and respectfully. The earlier you start practicing them, the more natural they'll feel by the time you start your career.</p>
          </div>
          <div class="qa-wellbeing-box">
            <div class="qa-wellbeing-label">Skills PT school doesn't always teach</div>
            <p>Active listening. Managing difficult conversations. De-escalating a frustrated patient. Reading body language. These are often treated as "soft skills", meaning optional, secondary, learnable on the fly. In practice, they separate average practitioners from excellent ones. Start now: volunteer in healthcare settings, take an improv or communication class, practice having hard conversations.</p>
          </div>
        </div>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">5</div>
          <div class="qa-q-text">What's one common misconception about your industry?</div>
        </div>
        <div class="qa-answer">
          <p>Many people assume physical therapy is one of the happier, less stressful professions, but they don't consider the mental and emotional demands of the job.</p>
          <div class="qa-pullquote">
            <p>It's rewarding, but burnout can run high. Recovery isn't always linear, and you're constantly supporting, educating, and encouraging people through difficult setbacks they don't always expect.</p>
          </div>
          <div class="qa-insight-box">
            <div class="qa-insight-label">What the data says about PT burnout</div>
            <p>Studies show physical therapist burnout rates range from 30–40%, similar to other healthcare professions. The combination of high patient caseloads, administrative burden, emotional labor, and the physical demands of the job itself takes a toll. Knowing this before you enter the field, and building coping strategies early, is one of the best things a prospective PT can do.</p>
          </div>
        </div>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">6</div>
          <div class="qa-q-text">What's one skill students should start developing now?</div>
        </div>
        <div class="qa-answer">
          <p>Develop strong communication and critical thinking skills. It will serve you throughout your career and in life.</p>
          <div class="qa-wellbeing-box">
            <div class="qa-wellbeing-label">Why these two go together</div>
            <p>Communication without critical thinking leads to confident-sounding advice that's wrong. Critical thinking without communication means you can diagnose a problem but can't get the patient to act on it. In PT, and honestly in most careers, you need both. Critical thinking helps you design the right treatment plan; communication is what gets the patient to follow it. Practice both deliberately, not just as side effects of other things you're doing.</p>
          </div>
        </div>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">7</div>
          <div class="qa-q-text">If you were in high school again, what would you do differently?</div>
        </div>
        <div class="qa-answer">
          <p>If I could go back, I wouldn't just learn to get a good grade or pass a test. I'd try to learn for the joy of it: approach learning from a sense of wonder and curiosity. That will make learning more enjoyable.</p>
          <div class="qa-pullquote">
            <p>I'd also remind myself that it's okay to make mistakes. I used to be really hard on myself and spent too much time comparing myself to other people. That only held me back.</p>
          </div>
          <p>Everyone learns differently and has different strengths. Your unique talents and perspectives are what makes you who you are. Be proud of what makes you different. That's where your greatest strengths often come from.</p>
          <div class="qa-insight-box">
            <div class="qa-insight-label">Learning for curiosity, not just grades</div>
            <p>There's research on this: students who are intrinsically motivated (learning because they find it interesting) retain information better and perform better over the long run than students who are extrinsically motivated (learning for grades or external rewards). Stephanie's advice maps exactly onto what the science shows. If you can find a way to actually care about what you're studying, not just how it looks on your transcript, you'll get more out of it, and burn out less doing it.</p>
          </div>
        </div>
      </div>

      <div class="qa-close-box">
        <p>Physical therapy is one of those careers that sounds straightforward until you're in it. The clinical work is learnable. What takes longer to develop is the patience, the communication, and the emotional resilience to guide people through some of the hardest periods of their lives, and still take care of yourself at the end of the day.</p>
        <p>If you're considering PT or any healthcare field, I'm on Mentino to have exactly these kinds of conversations. The things that actually prepare you for this job are the ones most schools don't teach.</p>
      </div>
    `,
  },
  {
    slug: "tech-career-qa-sean-ipakchi",
    title: "Inside a Tech Career: A Software Engineer Answers 7 Honest Questions",
    date: "September 20, 2026",
    author: "Sean Ipakchi",
    category: "Mentor Spotlight",
    categoryColor: "indigo",
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    excerpt: "Half the day is meetings. The other half is writing Python, SQL, or JavaScript with AI. A tech professional shares what the industry actually looks like, and what they wish students knew.",
    readTime: "8 min read",
    mentorAuthorId: "8a137b04-5e94-4bcf-be93-187547fd7530",
    mentorAuthorTitle: "Software Engineer & AI/BI Analytics Specialist",
    content: `
      <style>
        .qa-intro-box { background: #f4f1ea; border-radius: 12px; padding: 24px 28px; margin-bottom: 32px; }
        .qa-intro-box p { color: #1f2420 !important; line-height: 1.7; margin-bottom: 0 !important; }
        .qa-intro-box strong { color: #1f2420 !important; }
        .qa-block { margin-bottom: 40px; padding-bottom: 40px; border-bottom: 1px solid #e7e2d8; }
        .qa-block:last-of-type { border-bottom: none; }
        .qa-question { display: flex; align-items: flex-start; gap: 12px; border-left: 2px solid #b84d0c; padding: 4px 0 4px 16px; margin-bottom: 16px; }
        .qa-q-num { background: #b84d0c; color: #fff; font-size: 12px; font-weight: 600; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .qa-q-text { font-size: 18px; font-weight: 500; color: #1f2420; line-height: 1.5; }
        .qa-answer { color: #35332f; line-height: 1.8; }
        .qa-answer p { margin-bottom: 16px !important; color: #35332f !important; }
        .qa-pullquote { border-left: 2px solid #b84d0c; padding: 4px 0 4px 24px; margin: 24px 0; }
        .qa-pullquote p { font-family: "Newsreader", Georgia, serif; color: #1f2420 !important; font-size: 22px; line-height: 1.5; margin-bottom: 0 !important; }
        .qa-resource-box { background: #fdf1e3; border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
        .qa-resource-title { font-size: 12px; font-weight: 600; color: #1f2420; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; }
        .qa-resource-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid rgba(31,36,32,0.1); }
        .qa-resource-item:last-child { border-bottom: none; padding-bottom: 0; }
        .qa-resource-icon { display: none; }
        .qa-resource-name { font-weight: 600; color: #1f2420; font-size: 15px; margin-bottom: 4px; }
        .qa-resource-desc { color: #46433e; font-size: 14px; line-height: 1.55; }
        .qa-insight-box { background: #f6edcf; border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
        .qa-insight-label { font-size: 12px; font-weight: 600; color: #1f2420; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
        .qa-insight-box p { color: #1f2420 !important; line-height: 1.65; margin-bottom: 0 !important; font-size: 15px; }
        .qa-stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 24px 0; }
        .qa-stat { background: #fff; border: 1px solid #e7e2d8; border-radius: 12px; padding: 16px; text-align: center; }
        .qa-stat-num { font-size: 28px; font-weight: 500; color: #1f2420; line-height: 1; }
        .qa-stat-label { font-size: 12px; color: #5a5650; margin-top: 8px; line-height: 1.4; }
        .qa-close-box { background: #f4f1ea; border-radius: 12px; padding: 24px 28px; margin-top: 8px; }
        .qa-close-box p { color: #1f2420 !important; line-height: 1.8; margin-bottom: 12px !important; }
        .qa-close-box p:last-child { margin-bottom: 0 !important; }
      </style>

      <div class="qa-intro-box">
        <p>I'm <strong>Sean Ipakchi</strong>, a software engineer specializing in AI/BI analytics solutions. I work with tools like Claude Code, Sigma, Hex.tech, and Snowflake to build data products for clients. Ethan at Mentino asked me seven questions about what a career in tech actually looks like. Here's the honest version.</p>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">1</div>
          <div class="qa-q-text">What's one piece of advice you wish someone gave you when you were starting?</div>
        </div>
        <div class="qa-answer">
          <p>The key to a successful career is to stay curious and cultivate a passion for learning. That's the main attribute that's allowed me to adapt and stay relevant in the fast-paced world of technology.</p>
          <div class="qa-pullquote">
            <p>Being humble, spending time on YouTube, reading blogs and company docs, listening to podcasts, attending trainings, and going for certifications has all paid off in the long run. The best investment is in yourself.</p>
          </div>
          <div class="qa-insight-box">
            <div class="qa-insight-label">Why "staying curious" isn't just a cliché</div>
            <p>Tech moves fast enough that skills that made you hireable three years ago may already be table stakes or obsolete. The people who survive multiple technology cycles, from mobile, to cloud, to AI, aren't necessarily the smartest. They're the ones who never stopped learning. Curiosity is the engine; humility is what keeps it running.</p>
          </div>
        </div>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">2</div>
          <div class="qa-q-text">Can you walk me through a typical day in your current role?</div>
        </div>
        <div class="qa-answer">
          <p>Morning agile daily syncs with my engineering team to share key information and statuses. Analyzing the next priority features we're building and what's left in the backlog. Any blockers or decisions we should address.</p>
          <p>Then plenty of development time along with specific collaboration meetings or business development meetings to pursue other client project work. Could be a demo presentation that day as well.</p>
          <div class="qa-pullquote">
            <p>I'd say half the day is meetings, the other half is writing Python, SQL, or JavaScript with AI.</p>
          </div>
          <div class="qa-stat-row">
            <div class="qa-stat">
              <div class="qa-stat-num"></div>
              <div class="qa-stat-label">Agile standups every morning</div>
            </div>
            <div class="qa-stat">
              <div class="qa-stat-num"></div>
              <div class="qa-stat-label">Client demos & biz dev</div>
            </div>
            <div class="qa-stat">
              <div class="qa-stat-num"></div>
              <div class="qa-stat-label">Python, SQL, JS with AI</div>
            </div>
          </div>
          <div class="qa-tech-box">
            <div class="qa-tech-label">What "writing code with AI" actually means</div>
            <p>This isn't ChatGPT writing everything for you. It's using AI tools like Claude Code or GitHub Copilot as a pair programmer. You still need to understand the code, debug it, and make architectural decisions. AI speeds up the writing; the judgment of what to write is still entirely yours. That's why communication and critical thinking matter more than ever, not less.</p>
          </div>
        </div>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">3</div>
          <div class="qa-q-text">What is the most challenging or surprising part of your job?</div>
        </div>
        <div class="qa-answer">
          <p>Sometimes we really get the architecture direction on the project wrong and there's either leftover tech debt, or we have to acknowledge that in front of the client and redirect our solution to a better architecture, and explain why and how long that will take.</p>
          <div class="qa-pullquote">
            <p>There's no hiding from a bad architectural call. At some point you have to sit in front of a client, own it, and explain the path forward. That's genuinely hard.</p>
          </div>
          <div class="qa-insight-box">
            <div class="qa-insight-label">What "tech debt" actually costs</div>
            <p>Tech debt is what happens when you make fast decisions early that slow you down later. Every shortcut you take to ship quickly has interest, and at some point, the bill comes due. In consulting especially, you're accountable to a client who may not know the terminology but absolutely feels the slowdown. Learning to recognize architectural mistakes early, and communicating them honestly, is a skill that separates senior engineers from junior ones.</p>
          </div>
        </div>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">4</div>
          <div class="qa-q-text">If you had six months to prepare for this job from scratch, how would you spend your time?</div>
        </div>
        <div class="qa-answer">
          <p>Pick a niche within technology you want to focus your time on and then spend a lot of time learning it to become an expert in that technology.</p>
          <div class="qa-pullquote">
            <p>For me currently that's AI/BI Analytics solutions for clients involving Claude Code, Sigma, Hex.tech, and Snowflake. Go deep, not wide.</p>
          </div>
          <div class="qa-tech-box">
            <div class="qa-tech-label">How to pick your niche in tech</div>
            <p>The mistake most students make is trying to learn everything: a little JavaScript, a little Python, a little data science, a little cloud. You end up mediocre at all of it. Pick something that has real job demand, sits at an intersection you find interesting, and go deep enough that you can actually build things. The niche Sean works in, AI-powered business analytics, is a good example: it combines data engineering, business understanding, and AI tooling in a way that has serious market demand right now.</p>
          </div>
        </div>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">5</div>
          <div class="qa-q-text">What's one common misconception about your industry?</div>
        </div>
        <div class="qa-answer">
          <p>That it's all tech bros. That there are always layoffs and something is wrong with the culture. That everyone is making a lot of money off stock and their salaries.</p>
          <div class="qa-pullquote">
            <p>That you have to be an engineer to succeed in tech.</p>
          </div>
          <div class="qa-insight-box">
            <div class="qa-insight-label">The full picture of who works in tech</div>
            <p>Product managers, UX designers, technical writers, data analysts, sales engineers, solutions architects, program managers, security specialists, DevRel. Tech is a massive ecosystem, and most of these roles don't require you to write production code every day. If you're drawn to technology but don't want to be a software engineer, there are more paths than most people realize. The common thread is comfort with technical concepts and change, not necessarily deep coding expertise.</p>
          </div>
        </div>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">6</div>
          <div class="qa-q-text">What's one skill students should start developing now?</div>
        </div>
        <div class="qa-answer">
          <p>Reading comprehension, writing, and communication skills.</p>
          <div class="qa-pullquote">
            <p>To be successful with other people and AI, those are required skills.</p>
          </div>
          <div class="qa-tech-box">
            <div class="qa-tech-label">Why writing matters more in an AI world</div>
            <p>Counterintuitively, the rise of AI has made human communication skills more important, not less. AI tools respond to how clearly you can articulate what you want. Prompting is writing. Explaining a technical problem to a client is writing. Documenting a codebase so your team doesn't lose a week reverse-engineering your work is writing. The engineers and analysts who compound fastest are the ones who can translate between technical and human, and that's a writing and communication problem at its core.</p>
          </div>
        </div>
      </div>

      <div class="qa-block">
        <div class="qa-question">
          <div class="qa-q-num">7</div>
          <div class="qa-q-text">If you were in high school again, what would you do differently?</div>
        </div>
        <div class="qa-answer">
          <p>I would have largely done the same as I did. Get into honors/AP classes, play a ton of video games, bike and run, meet a great group of best friends I'm still hanging out with today. Maybe being nicer to my parents. It's tough, I know.</p>
          <div class="qa-insight-box">
            <div class="qa-insight-label">The one thing Sean would add</div>
            <p>Reach out to others more often to pick their brain, learn about what they're working on, and ask for help. It's taken a long time for me to swallow my pride and independence and ask others for help or fully collaborate on solutions. The students who accelerate fastest aren't the most talented. They're the ones who ask the best questions and are willing to let other people help them get there. That's a skill you can start practicing in high school.</p>
          </div>
        </div>
      </div>

      <div class="qa-close-box">
        <p>Tech is bigger and more diverse than the stereotypes suggest. You don't have to be a certain type of person, come from a certain background, or know how to code on day one. What you do need is a genuine interest in learning, the willingness to go deep on something, and the communication skills to work with the humans, and the AI tools, around you.</p>
        <p>If you're curious about what a career in tech, analytics, or AI actually looks like day to day, I'm on Mentino for exactly these kinds of conversations.</p>
      </div>
    `,
  },
  {
    slug: "why-mentorship-matters",
    title: "Why Mentorship Matters for Career Success",
    date: "March 15, 2026",
    author: "Ethan Branzuela",
    category: "Mentorship",
    categoryColor: "indigo",
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    excerpt: "Confidence, networking, and professional growth: what the research says.",
    readTime: "6 min read",
    content: `
      <p>You can learn almost anything online. Free courses, YouTube tutorials, research papers: information has never been more accessible. So why does mentorship still matter?</p>

      <p>Because knowing <em>what</em> to learn is different from knowing <em>how to navigate a career</em>. A mentor bridges that gap.</p>

      <h3>What the research actually says</h3>

      <p>A Sun Microsystems study found that mentored employees were <strong>promoted five times more often</strong> than employees without mentors. The mentors themselves were promoted six times more often. Both sides benefit.</p>

      <p class="source">Source: Gartner, "Mentoring: A Practitioner's Guide to Touching Lives" (2006)</p>

      <p>Research in the <em>Journal of Applied Psychology</em> found mentored workers reported:</p>

      <ul>
        <li><strong>Higher salaries:</strong> about $5,610 more per year on average</li>
        <li><strong>Greater career satisfaction:</strong> 4x the rate of non-mentored peers</li>
        <li><strong>More promotions</strong> at a significantly higher rate</li>
      </ul>

      <div style="background:#f4f1ea;border:1px solid #e7e2d8;border-radius:12px;padding:24px;margin:28px 0">
        <div style="font-size:0.75rem;font-weight:700;color:#b84d0c;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px">Mentored vs Non-Mentored Employees</div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div>
            <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:4px"><span style="color:#374151">Career promotions</span><span style="font-weight:700;color:#b84d0c">5×</span></div>
            <div style="background:#dbeafe;border-radius:99px;height:10px"><div style="background:#b84d0c;height:10px;border-radius:99px;width:100%"></div></div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:4px"><span style="color:#374151">Career satisfaction</span><span style="font-weight:700;color:#b84d0c">4×</span></div>
            <div style="background:#e7e2d8;border-radius:99px;height:10px"><div style="background:#b84d0c;height:10px;border-radius:99px;width:80%"></div></div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:4px"><span style="color:#374151">Higher avg salary vs peers</span><span style="font-weight:700;color:#b84d0c">+$5,610/yr</span></div>
            <div style="background:#f4f1ea;border-radius:99px;height:10px"><div style="background:#b84d0c;height:10px;border-radius:99px;width:60%"></div></div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:4px"><span style="color:#374151">Job offers before graduation</span><span style="font-weight:700;color:#ef4444">+23%</span></div>
            <div style="background:#fee2e2;border-radius:99px;height:10px"><div style="background:#ef4444;height:10px;border-radius:99px;width:23%"></div></div>
          </div>
        </div>
      </div>

      <p class="source">Source: Allen, T.D., Eby, L.T., Poteet, M.L., Lentz, E., & Lima, L. (2004). <em>Journal of Applied Psychology</em>, 89(1), 127-136.</p>

      <h3>For young people specifically</h3>

      <p>MENTOR's national study found that young adults who had a mentor are:</p>

      <ul>
        <li><strong>55% more likely</strong> to be enrolled in college</li>
        <li><strong>78% more likely</strong> to volunteer in their communities</li>
        <li><strong>130% more likely</strong> to hold leadership positions</li>
      </ul>

      <div style="background:#f4f1ea;border:1px solid #e7e2d8;border-radius:12px;padding:24px;margin:28px 0">
        <div style="font-size:0.75rem;font-weight:700;color:#b84d0c;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px">Key Stats for Young People with Mentors</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
          <div style="background:white;border-radius:14px;padding:16px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
            <div style="font-size:2rem;font-weight:900;color:#b84d0c;line-height:1">55%</div>
            <div style="font-size:0.72rem;color:#6b7280;margin-top:6px;line-height:1.4">More likely to enroll in college</div>
          </div>
          <div style="background:white;border-radius:14px;padding:16px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
            <div style="font-size:2rem;font-weight:900;color:#b84d0c;line-height:1">130%</div>
            <div style="font-size:0.72rem;color:#6b7280;margin-top:6px;line-height:1.4">More likely to hold leadership positions</div>
          </div>
          <div style="background:white;border-radius:14px;padding:16px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
            <div style="font-size:2rem;font-weight:900;color:#b84d0c;line-height:1">78%</div>
            <div style="font-size:0.72rem;color:#6b7280;margin-top:6px;line-height:1.4">More likely to volunteer in communities</div>
          </div>
        </div>
      </div>

      <p class="source">Source: MENTOR: The National Mentoring Partnership, "The Mentoring Effect" (2014). Survey of 1,109 young adults ages 18-21.</p>

      <h3>Confidence is underrated</h3>

      <p>Mentorship builds self-efficacy: the belief that you can actually accomplish something difficult. Research shows this translates directly into career behavior. People who believe in their own capabilities are more likely to pursue challenging roles, take on stretch assignments, and persist through setbacks rather than withdrawing.</p>

      <p class="source">Source: Bandura, A. (1994). "Self-efficacy." <em>Encyclopedia of Human Behavior</em>, Vol. 4, 71-81.</p>

      <h3>The access problem</h3>

      <p>Here's what bothers me: mentorship access is deeply unequal. Students from well-connected families get career advice over dinner. A parent's colleague becomes their first industry contact. Everyone else has to figure it out alone.</p>

      <p>That's not a talent gap. It's a network gap. And it's fixable.</p>

      <p class="source">Source: Chetty, R., Hendren, N., Kline, P., & Saez, E. (2014). <em>NBER Working Paper No. 19843</em>.</p>

      <h3>That's what Mentino is for</h3>

      <p>No network? No problem. Sign up, tell us what you're interested in, and we match you with someone who's actually in that field. Then you just ask them stuff.</p>

      <p>If you're a student: don't wait until you have everything figured out. The whole point is that you don't have to figure it out alone.</p>

      <p>If you're a professional: think about what it would've meant to you at 16 or 17 to have someone in your field willing to answer your questions. That's what you'd be doing.</p>
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
      <p>One of the biggest questions students have when choosing a career path is: <strong>"How much will I earn?"</strong> It's a fair question, and the data can help you make a more informed decision.</p>

      <p>Let's look at what the numbers actually say, using the most recent data from the National Science Foundation, Bureau of Labor Statistics, and other authoritative sources.</p>

      <h3>The Big Picture: STEM vs Non-STEM</h3>

      <p>According to the U.S. Bureau of Labor Statistics, the <strong>median annual wage for STEM occupations was $100,900 in May 2023</strong>, compared to $40,120 for all non-STEM occupations. That's a 151% difference.</p>

      <p class="source">Source: U.S. Bureau of Labor Statistics, Occupational Employment and Wages, May 2023. "STEM Occupations: Past, Present, And Future."</p>

      <p>But these numbers need context. "STEM" includes everything from software engineers ($127,260 median) to agricultural technicians ($40,160 median). The range within STEM is enormous.</p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:24px 0">
        <div style="background:#f4f1ea;border-radius:12px;padding:24px;color:white;text-align:center">
          <div style="font-size:0.7rem;font-weight:700;opacity:0.8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">STEM Median</div>
          <div style="font-size:2.5rem;font-weight:900;line-height:1">$100,900</div>
          <div style="font-size:0.75rem;opacity:0.8;margin-top:6px">per year (BLS, 2023)</div>
        </div>
        <div style="background:#f4f1ea;border-radius:12px;padding:24px;color:white;text-align:center">
          <div style="font-size:0.7rem;font-weight:700;opacity:0.8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">Non-STEM Median</div>
          <div style="font-size:2.5rem;font-weight:900;line-height:1">$40,120</div>
          <div style="font-size:0.75rem;opacity:0.8;margin-top:6px">per year (BLS, 2023)</div>
        </div>
      </div>
      <div style="background:#fef2f2;border-left:4px solid #f87171;border-radius:0 12px 12px 0;padding:14px 18px;margin:0 0 24px;font-size:0.85rem;color:#991b1b"><strong>151% higher</strong>, but context matters. Range within STEM is vast: from $40K to $127K+</div>

      <h3>Salary by Field: The Real Numbers</h3>

      <p>Here's a breakdown of median annual salaries by major occupation group (BLS, May 2023):</p>

      <div style="background:#f4f1ea;border-radius:12px;padding:24px;margin:24px 0;border:1px solid #e7e2d8">
        <div style="font-size:0.75rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px">Median Annual Salary by Field (BLS, May 2023)</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <div style="display:flex;align-items:center;gap:10px"><div style="font-size:0.78rem;color:#374151;width:140px;flex-shrink:0">Computer & IT</div><div style="flex:1;background:#e7e2d8;border-radius:99px;height:28px;overflow:hidden"><div style="background:linear-gradient(90deg,#b84d0c,#b84d0c);height:28px;border-radius:99px;width:100%;display:flex;align-items:center;justify-content:flex-end;padding-right:10px"><span style="color:white;font-weight:700;font-size:0.75rem">$104,420</span></div></div><div style="font-size:0.7rem;background:#dbeafe;color:#b84d0c;padding:2px 7px;border-radius:99px;white-space:nowrap">+15%</div></div>
          <div style="display:flex;align-items:center;gap:10px"><div style="font-size:0.78rem;color:#374151;width:140px;flex-shrink:0">Legal</div><div style="flex:1;background:#e7e2d8;border-radius:99px;height:28px;overflow:hidden"><div style="background:linear-gradient(90deg,#b84d0c,#b84d0c);height:28px;border-radius:99px;width:82%;display:flex;align-items:center;justify-content:flex-end;padding-right:10px"><span style="color:white;font-weight:700;font-size:0.75rem">$84,910</span></div></div><div style="font-size:0.7rem;background:#f4f1ea;color:#1f2420;padding:2px 7px;border-radius:99px;white-space:nowrap">+8%</div></div>
          <div style="display:flex;align-items:center;gap:10px"><div style="font-size:0.78rem;color:#374151;width:140px;flex-shrink:0">Engineering</div><div style="flex:1;background:#e7e2d8;border-radius:99px;height:28px;overflow:hidden"><div style="background:linear-gradient(90deg,#b84d0c,#b84d0c);height:28px;border-radius:99px;width:80%;display:flex;align-items:center;justify-content:flex-end;padding-right:10px"><span style="color:white;font-weight:700;font-size:0.75rem">$83,340</span></div></div><div style="font-size:0.7rem;background:#f4f1ea;color:#5b21b6;padding:2px 7px;border-radius:99px;white-space:nowrap">+7%</div></div>
          <div style="display:flex;align-items:center;gap:10px"><div style="font-size:0.78rem;color:#374151;width:140px;flex-shrink:0">Healthcare</div><div style="flex:1;background:#e7e2d8;border-radius:99px;height:28px;overflow:hidden"><div style="background:linear-gradient(90deg,#b84d0c,#b84d0c);height:28px;border-radius:99px;width:75%;display:flex;align-items:center;justify-content:flex-end;padding-right:10px"><span style="color:white;font-weight:700;font-size:0.75rem">$77,600</span></div></div><div style="font-size:0.7rem;background:#e7e2d8;color:#1f2420;padding:2px 7px;border-radius:99px;white-space:nowrap">+13%</div></div>
          <div style="display:flex;align-items:center;gap:10px"><div style="font-size:0.78rem;color:#374151;width:140px;flex-shrink:0">Business & Financial</div><div style="flex:1;background:#e7e2d8;border-radius:99px;height:28px;overflow:hidden"><div style="background:linear-gradient(90deg,#b84d0c,#b84d0c);height:28px;border-radius:99px;width:74%;display:flex;align-items:center;justify-content:flex-end;padding-right:10px"><span style="color:white;font-weight:700;font-size:0.75rem">$76,850</span></div></div><div style="font-size:0.7rem;background:#ccfbf1;color:#1f2420;padding:2px 7px;border-radius:99px;white-space:nowrap">+8%</div></div>
          <div style="display:flex;align-items:center;gap:10px"><div style="font-size:0.78rem;color:#374151;width:140px;flex-shrink:0">Life Sciences</div><div style="flex:1;background:#e7e2d8;border-radius:99px;height:28px;overflow:hidden"><div style="background:linear-gradient(90deg,#b84d0c,#b84d0c);height:28px;border-radius:99px;width:66%;display:flex;align-items:center;justify-content:flex-end;padding-right:10px"><span style="color:white;font-weight:700;font-size:0.75rem">$68,830</span></div></div><div style="font-size:0.7rem;background:#f4f1ea;color:#5b21b6;padding:2px 7px;border-radius:99px;white-space:nowrap">+5%</div></div>
          <div style="display:flex;align-items:center;gap:10px"><div style="font-size:0.78rem;color:#374151;width:140px;flex-shrink:0">Education</div><div style="flex:1;background:#e7e2d8;border-radius:99px;height:28px;overflow:hidden"><div style="background:linear-gradient(90deg,#b84d0c,#0284c7);height:28px;border-radius:99px;width:53%;display:flex;align-items:center;justify-content:flex-end;padding-right:10px"><span style="color:white;font-weight:700;font-size:0.75rem">$55,350</span></div></div><div style="font-size:0.7rem;background:#e0f2fe;color:#0c4a6e;padding:2px 7px;border-radius:99px;white-space:nowrap">+4%</div></div>
          <div style="display:flex;align-items:center;gap:10px"><div style="font-size:0.78rem;color:#374151;width:140px;flex-shrink:0">Arts & Design</div><div style="flex:1;background:#e7e2d8;border-radius:99px;height:28px;overflow:hidden"><div style="background:linear-gradient(90deg,#b84d0c,#db2777);height:28px;border-radius:99px;width:49%;display:flex;align-items:center;justify-content:flex-end;padding-right:10px"><span style="color:white;font-weight:700;font-size:0.75rem">$50,710</span></div></div><div style="font-size:0.7rem;background:#fce7f3;color:#831843;padding:2px 7px;border-radius:99px;white-space:nowrap">+3%</div></div>
        </div>
        <div style="font-size:0.7rem;color:#94a3b8;margin-top:12px">% growth = projected 2022–2032 job growth rate. Source: BLS Occupational Outlook Handbook 2024</div>
      </div>

      <p class="source">Source: U.S. Bureau of Labor Statistics, "Occupational Outlook Handbook," 2024 Edition. Data from May 2023 surveys.</p>

      <h3>The College Premium Is Real, But It Varies</h3>

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
        <li><strong>Medicine (MD):</strong> Median salary $229,300 (BLS, 2023); requires 11-15 years of training</li>
        <li><strong>Law (JD):</strong> Median salary $135,740 (BLS, 2023); 3 years beyond college</li>
        <li><strong>MBA:</strong> Median salary $105,000 (GMAC, 2023); 2 years beyond college</li>
        <li><strong>Clinical Psychology (PhD):</strong> Median salary $92,740 (BLS, 2023); 5-7 years beyond college</li>
      </ul>

      <p class="source">Sources: Bureau of Labor Statistics, Occupational Outlook Handbook (2024). Graduate Management Admission Council (GMAC), "Corporate Recruiters Survey" (2023).</p>

      <h3>What About Job Satisfaction?</h3>

      <p>Salary isn't everything. The National Society of High School Scholars found that Gen Z ranks <strong>work-life balance</strong> and <strong>meaningful work</strong> above salary when evaluating career options. A Gallup survey found that workers who use their strengths daily are <strong>6x more likely to be engaged</strong> at work.</p>

      <p class="source">Sources: National Society of High School Scholars, "2023 Career Interest Survey." Gallup, "State of the American Workplace Report" (2023).</p>

      <h3>The Entrepreneurship Factor</h3>

      <p>Salary data only captures traditional employment. According to the Kauffman Foundation, the average income for successful small business owners exceeds $120,000 per year, though the range is vast and the failure rate is high (about 50% of small businesses fail within five years, per SBA data).</p>

      <p class="source">Sources: Ewing Marion Kauffman Foundation, "State of Entrepreneurship" (2023). U.S. Small Business Administration, "Frequently Asked Questions About Small Business" (2023).</p>

      <h3>Salary Growth Over a Career</h3>

      <p>Starting salary is one data point. What matters more is the trajectory. The Bureau of Labor Statistics tracks median wages by age group: the gap between early career (25–34) and peak earning (45–54) tells you a lot about a field's growth ceiling.</p>

      <p>In software and engineering roles, median wages nearly double between early and peak career. In education, growth is much flatter. In law and medicine, early salaries look modest (especially with student debt) but peak earnings are among the highest of any profession. The key question isn't "what does this pay now?" It's "where does this go?"</p>

      <h3>What the Numbers Miss</h3>

      <p>Salary data is averages, and averages hide a lot. A software engineer at a startup making $85K and one at Google making $240K are both "software engineers." A pediatrician in rural Texas and an orthopedic surgeon in New York are both "doctors."</p>

      <p>The factors that actually determine your individual outcome: location, specialization, the specific company or institution, how long you stay, and how aggressive you are about negotiating. Research from Linda Babcock at Carnegie Mellon found that not negotiating your first salary costs an average of $500,000 in lifetime earnings due to compounding raises. That's not a salary issue. It's a negotiation issue.</p>

      <p class="source">Source: Babcock, L., & Laschever, S. (2003). <em>Women Don't Ask</em>. Princeton University Press. Carnegie Mellon University wage negotiation research (2001).</p>

      <h3>The Bottom Line for Students</h3>

      <p>A few things worth keeping in mind before you choose:</p>

      <ol>
        <li><strong>Don't pick a career just for the salary.</strong> A high-paying job you hate will burn you out faster than a lower-paying one you're actually good at.</li>
        <li><strong>STEM pays more on average</strong>, but the range inside every field is huge. A great attorney earns more than a mediocre software engineer. Field matters less than you'd think.</li>
        <li><strong>Talk to someone who actually does it.</strong> Salary data tells you the number, but it doesn't tell you what the job actually feels like at 10pm on a Tuesday. That's what mentors are for.</li>
        <li><strong>Think past the first paycheck:</strong> student debt, years of training, lifestyle, location, and where the field is headed in 10 years all matter.</li>
        <li><strong>Learn to negotiate.</strong> The single highest-ROI skill for early career isn't technical. It's knowing how to ask for what you're worth.</li>
      </ol>

      <h3>The Geographic Factor</h3>

      <p>Where you work matters almost as much as what you do. A software engineer in San Francisco earns a median of $136,000. The same role in a mid-sized city like Austin or Denver pays around $105,000. In a smaller market, it could be $75,000. The national median is just an average of all of those.</p>

      <p>This cuts both ways. Cost of living in San Francisco is dramatically higher than in Austin. MIT's Living Wage Calculator estimates a single adult in San Francisco needs around $72,000 just to cover basic expenses, before any discretionary spending or savings. The same calculation in Columbus, Ohio comes in under $35,000. A $105,000 salary in Columbus might actually leave you with more disposable income than $136,000 in San Francisco.</p>

      <p>Remote work has changed this somewhat, but not completely. Most high-paying roles still pay location-adjusted salaries even for remote workers, and many require some in-office presence. Before you anchor on a salary number, look up what it actually buys in the city where you plan to live.</p>

      <p class="source">Sources: MIT Living Wage Calculator (2024). Bureau of Labor Statistics, Occupational Employment Statistics by state (2023). Levels.fyi software engineering compensation data (2024).</p>

      <h3>When to Ignore Salary Data</h3>

      <p>There are a few cases where salary data is genuinely misleading and you should lean on lived experience instead:</p>

      <ul>
        <li><strong>Early-stage startups:</strong> Equity can be worth far more than salary, or nothing at all. You can't find this in BLS data.</li>
        <li><strong>Commission-based roles:</strong> Sales, real estate, and finance roles often have wide variation. Top performers earn multiples of the median.</li>
        <li><strong>Fields with long training ramps:</strong> Medicine and law look bad early (residency pays ~$60K) but look excellent at peak career. You need a 10-year view, not a first-year view.</li>
        <li><strong>Non-profit and public sector:</strong> The salary ceiling is lower but benefits, stability, and loan forgiveness programs change the actual financial picture considerably.</li>
      </ul>

      <p>This is exactly why talking to someone who's actually in the field matters. They'll tell you what the spreadsheet can't.</p>

      <p>On Mentino, you can find professionals across 15+ career fields who'll give you the honest version, not the recruiting brochure version.</p>
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
      <p>There's a version of career success that comes from grinding alone, and a version that comes from knowing the right person at the right time. Most people who made it had both, but the second one is a lot harder to get by accident.</p>

      <div style="background:#f4f1ea;border:1px solid #e7e2d8;border-radius:12px;padding:24px;margin:28px 0">
        <div style="font-size:0.75rem;font-weight:700;color:#b84d0c;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px">Measured Career Outcomes</div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
          <div style="background:white;border-radius:14px;padding:16px;border:1px solid #f4f1ea">
            <div style="font-size:1.8rem;font-weight:900;color:#b84d0c">23%</div>
            <div style="font-size:0.75rem;color:#6b7280;margin-top:4px">More likely to get a job offer before graduation</div>
          </div>
          <div style="background:white;border-radius:14px;padding:16px;border:1px solid #f4f1ea">
            <div style="font-size:1.8rem;font-weight:900;color:#b84d0c">71%</div>
            <div style="font-size:0.75rem;color:#6b7280;margin-top:4px">Fortune 500 companies with formal mentoring programs</div>
          </div>
          <div style="background:white;border-radius:14px;padding:16px;border:1px solid #f4f1ea">
            <div style="font-size:1.8rem;font-weight:900;color:#b84d0c">5×</div>
            <div style="font-size:0.75rem;color:#6b7280;margin-top:4px">More promotions over a career</div>
          </div>
          <div style="background:white;border-radius:14px;padding:16px;border:1px solid #f4f1ea">
            <div style="font-size:1.8rem;font-weight:900;color:#ef4444">+$5,610</div>
            <div style="font-size:0.75rem;color:#6b7280;margin-top:4px">Higher average salary per year</div>
          </div>
        </div>
      </div>

      <h3>First Job Outcomes</h3>

      <p>A study by the National Association of Colleges and Employers (NACE) found that students who had mentoring relationships during college were <strong>23% more likely to receive a job offer before graduation</strong> compared to those without mentors.</p>

      <p class="source">Source: National Association of Colleges and Employers (NACE), "Job Outlook Survey" (2023).</p>

      <p>The reason is straightforward: mentors help with resume review, mock interviews, industry introductions, and the kind of "insider knowledge" about what hiring managers actually look for that you can't find in a textbook.</p>

      <h3>Salary Acceleration</h3>

      <p>A meta-analysis published in the <em>Journal of Vocational Behavior</em> examined 43 studies on mentorship outcomes and found that mentored individuals consistently reported:</p>

      <ul>
        <li><strong>Higher compensation</strong> over time, not just in starting salary but in the pace of raises and promotions</li>
        <li><strong>Greater career mobility:</strong> more job offers, more lateral movement options, and broader professional networks</li>
        <li><strong>Lower turnover:</strong> mentored employees stay longer at organizations and report greater job satisfaction</li>
      </ul>

      <p class="source">Source: Allen, T.D., Eby, L.T., Poteet, M.L., Lentz, E., & Lima, L. (2004). "Career Benefits Associated With Mentoring for Proteges: A Meta-Analysis." <em>Journal of Applied Psychology</em>, 89(1), 127-136.</p>

      <h3>Leadership Development</h3>

      <p>Research from the Center for Creative Leadership found that <strong>71% of Fortune 500 companies have formal mentoring programs</strong>, and employees who participate are more likely to be identified as "high-potential" leaders.</p>

      <p>A Harvard Business Review study found that mentors help develop what researchers call "leadership self-efficacy": the belief that one can lead effectively. This sense of confidence is a strong predictor of actual leadership performance.</p>

      <p class="source">Sources: Center for Creative Leadership, "Mentoring: A Key Strategy for Leadership Development" (2021). Lester, P.B., Hannah, S.T., Harms, P.D., Vogelgesang, G.R., & Avolio, B.J. (2011). "Mentoring Impact on Leader Efficacy Development." <em>Journal of Leadership & Organizational Studies</em>, 18(4), 469-483.</p>

      <h3>Transferable Skills</h3>

      <p>Perhaps the most lasting benefit of mentorship is the development of transferable skills that compound over an entire career:</p>

      <ul>
        <li><strong>Communication:</strong> Mentors model professional communication, including how to present ideas, give feedback, and navigate difficult conversations</li>
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

      <h3>The Compound Effect</h3>

      <p>The most interesting thing about mentorship data isn't any single outcome. It's how the effects stack. Mentored students are more likely to get good first jobs. Better first jobs mean better second jobs. Better career trajectories mean more opportunities to develop skills, build networks, and earn more. The gap between mentored and non-mentored professionals widens over time, not narrows.</p>

      <p>A 2019 meta-analysis in the <em>Journal of Vocational Behavior</em> reviewed 27 studies covering over 11,000 participants and found consistent positive effects of mentoring on objective career outcomes (salary, promotions) and subjective outcomes (job satisfaction, career commitment). Crucially, the effects were strongest for mentees who had the relationship earliest in their careers.</p>

      <p class="source">Source: Eby, L.T., Allen, T.D., et al. (2019). "An interdisciplinary meta-analysis of the potential antecedents, correlates, and consequences of protégé perceptions of mentoring." <em>Journal of Vocational Behavior</em>, 112, 358-390.</p>

      <h3>What This Means for Students</h3>

      <p>The data is consistent across decades of research: mentorship works. Not just a little: it moves the needle on salary, promotions, leadership, and job satisfaction in ways that compound over a whole career.</p>

      <p>And the earlier you start, the more runway you have. A mentor in high school or early college gives you time to actually use what you learn, to make better decisions before you've locked anything in.</p>

      <h3>How to Actually Get Value From a Mentor</h3>

      <p>A lot of students get matched with a mentor and don't know what to do with it. They either ask questions that are too broad ("what should I do with my career?") or they go silent after the first message. Here's what the research and practical experience say actually works:</p>

      <ul>
        <li><strong>Come with specific questions.</strong> "What does a typical Tuesday look like for you?" gets a more useful answer than "what's your job like?" Specificity signals respect for the mentor's time and gets you concrete information.</li>
        <li><strong>Ask about the path, not just the destination.</strong> How did they get there? What would they do differently? What do most people misunderstand about the field? These questions can't be Googled.</li>
        <li><strong>Follow through on what they suggest.</strong> If a mentor recommends reading something or trying a project, do it and report back. This turns a one-off conversation into a relationship.</li>
        <li><strong>Don't wait until you have something impressive to share.</strong> Mentors don't need you to already be successful. They want to help you get there.</li>
      </ul>

      <p>A 2020 study from the Association for Talent Development found that the quality of mentor-mentee conversations mattered more than the quantity of sessions. One focused 30-minute conversation beats five aimless ones.</p>

      <p class="source">Source: Association for Talent Development, "State of Mentoring" report (2020).</p>

      <p>The students who get the most out of mentorship tend to share a few traits: they ask specific questions, they follow through on suggestions, and they stay in contact. You don't need to be impressive. You need to be curious and consistent.</p>

      <p>That's what Mentino is for. Sign up, find someone who's already where you're trying to go, and just ask them what you need to know.</p>
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
      <p>If you're in high school or early college and you don't know what you want to do with your life, you're not behind. You're normal.</p>

      <p>About 30% of college students change their major at least once. Research from the Federal Reserve Bank of New York shows only 27% of college graduates end up working in a field related to their major.</p>

      <p class="source">Sources: National Center for Education Statistics (2023). Federal Reserve Bank of New York, "The Labor Market for Recent College Graduates" (2024).</p>

      <p>Figuring out your path is a process, not a decision you make once and stick to. Here's what actually helps.</p>

      <div style="background:#f4f1ea;border:1px solid #e7e2d8;border-radius:12px;padding:20px;margin:24px 0;display:flex;flex-wrap:wrap;gap:10px">
        <div style="font-size:0.7rem;font-weight:700;color:#1f2420;text-transform:uppercase;letter-spacing:0.08em;width:100%;margin-bottom:4px">5 Things That Actually Help</div>
        <span style="background:#b84d0c;color:white;font-size:0.75rem;font-weight:600;padding:5px 12px;border-radius:99px">1. Follow your curiosity</span>
        <span style="background:#b84d0c;color:white;font-size:0.75rem;font-weight:600;padding:5px 12px;border-radius:99px">2. Talk to real people</span>
        <span style="background:#b84d0c;color:white;font-size:0.75rem;font-weight:600;padding:5px 12px;border-radius:99px">3. Try before committing</span>
        <span style="background:#b84d0c;color:white;font-size:0.75rem;font-weight:600;padding:5px 12px;border-radius:99px">4. Build flexible skills</span>
        <span style="background:#b84d0c;color:white;font-size:0.75rem;font-weight:600;padding:5px 12px;border-radius:99px">5. Don't specialize too soon</span>
      </div>

      <h3>1. Follow what you're actually curious about</h3>

      <p>Angela Duckworth's research on grit found that passion and persistence predict success more than raw talent. But you can't be passionate about something you picked because it sounded good on paper.</p>

      <p>A more useful question than "what do I want to be?" is: <em>What do I already read about voluntarily? What problems do I find interesting? When does time disappear?</em></p>

      <p class="source">Source: Duckworth, A. (2016). <em>Grit: The Power of Passion and Perseverance</em>. Scribner.</p>

      <h3>2. Talk to actual people in the field</h3>

      <p>Job descriptions tell you the requirements. They don't tell you what the work actually feels like. Research shows students who conduct informational interviews, simply asking someone in a field about their experience, make more confident and realistic career choices.</p>

      <p class="source">Source: Crosby, O. (2010). "Informational Interviewing: Get the Inside Scoop on Careers." <em>Occupational Outlook Quarterly</em>.</p>

      <p>Some questions worth asking:</p>
      <ul>
        <li>What does a typical week actually look like?</li>
        <li>What do you wish you'd known before getting into this?</li>
        <li>What's the part nobody warns you about?</li>
        <li>Would you do it again?</li>
      </ul>

      <p>That's genuinely what Mentino is built for. Find someone in a field you're considering and just ask them.</p>

      <h3>3. Try things before you commit</h3>

      <p>Stanford researchers Bill Burnett and Dave Evans call it "prototyping": low-stakes experiments that let you test whether you actually like something before it becomes a major decision. Shadow someone for a day. Start a project related to the field. Volunteer somewhere relevant. You learn more in two weeks of doing than two years of thinking about it.</p>

      <p class="source">Source: Burnett, B., & Evans, D. (2016). <em>Designing Your Life</em>. Knopf.</p>

      <h3>4. Build skills that work everywhere</h3>

      <p>The World Economic Forum's Future of Jobs Report lists the skills employers most want through 2027: analytical thinking, creative thinking, resilience, self-awareness, curiosity. None of them are field-specific. While you're figuring out your direction, focus on these. They compound no matter what you end up doing.</p>

      <p class="source">Source: World Economic Forum, "Future of Jobs Report 2023."</p>

      <h3>5. Don't specialize too soon</h3>

      <p>Economist Ofer Malamud compared students who specialized early vs. those who explored broadly first. The broad explorers ended up in better-fitting careers and reported higher satisfaction. There's a cost to narrowing too quickly.</p>

      <p class="source">Source: Malamud, O. (2010). "Breadth versus Depth: The Timing of Specialization in Higher Education." <em>Labour</em>, 24(4), 349-369.</p>

      <h3>The short version</h3>

      <h3>The Role of Identity in Career Choice</h3>

      <p>A lot of career confusion isn't about the career. It's about identity. "Who am I?" is a harder question than "what job should I have?" and students often mix them up. Psychologist James Marcia's research on identity development found that most teenagers are either in "moratorium" (actively exploring, unsettled) or "foreclosure" (committed to an identity they didn't actually choose, often because their parents chose it for them).</p>

      <p>If you feel pressure to commit to a path before you're ready, that pressure is usually external. Your parents, your school's college counselor, college apps. They all want a tidy story. But committing early to the wrong thing is a much more expensive mistake than taking time to explore.</p>

      <p class="source">Source: Marcia, J.E. (1966). "Development and validation of ego-identity status." <em>Journal of Personality and Social Psychology</em>, 3(5), 551-558.</p>

      <h3>What Actually Helps</h3>

      <p>Career counselors, personality tests, and online quizzes are a starting point at best. The research consistently shows that the most effective career exploration happens through two things: direct experience and conversations with people who are already doing the work.</p>

      <p>Direct experience means internships, part-time jobs, projects, competitions, or just building something related to the field. Not reading about it. Doing a version of it. Conversations with people already in the field give you information you genuinely cannot get anywhere else: what a random Tuesday feels like, what skills actually matter vs. what looks good on paper, whether the day-to-day matches the hype.</p>

      <p>Both of these require initiative. Nobody sends you an invitation. The good news is that reaching out to people is easier now than it's ever been, and most professionals are more willing to talk to curious students than you'd expect.</p>

      <p>Your career doesn't have to be a straight line, and it probably won't be. The most interesting ones rarely are. Explore, talk to real people, try things. Clarity comes from doing, not from sitting and thinking harder about it. Stop waiting to have it figured out and start having conversations with people who can help you figure it out.</p>
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
    excerpt: "Starting a mentorship platform as a teenager: what I learned, what was hard, and what keeps me going.",
    readTime: "5 min read",
    content: `
      <p>People ask me why I started Mentino at 15. Honestly? I didn't overthink it. I saw something that bothered me and I started building.</p>

      <h3>Where it came from</h3>

      <p>I shoot sports photography. I've been doing it since I was around 13, mostly professional and collegiate athletes in the Bay Area. It's my thing. And when I was trying to actually get good at it, I started cold-DMing photographers I followed online. Just asking questions. Most didn't respond. But a few did. And those few conversations did more for my work than years of watching YouTube tutorials.</p>

      <p>At some point I realized: that experience I had (someone further along taking 20 minutes to talk to me) most students don't get that. Not because people don't want to help, but because there's no easy way for them to connect. That's the gap Mentino is trying to close.</p>

      <p>About 1 in 3 young people in the U.S. will grow up without a mentor. That's 16 million people figuring things out alone when they don't have to.</p>

      <div style="background:#f4f1ea;border-radius:12px;padding:28px;margin:28px 0;text-align:center;color:white">
        <div style="font-size:4rem;font-weight:900;background:#f4f1ea;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1">16M</div>
        <div style="font-size:1rem;color:#cbd5e1;margin-top:8px">young people in the U.S. growing up without a mentor</div>
        <div style="display:flex;justify-content:center;gap:24px;margin-top:20px">
          <div style="text-align:center"><div style="font-size:1.3rem;font-weight:700;color:#f472b6">1 in 3</div><div style="font-size:0.7rem;color:#94a3b8;margin-top:2px">young Americans</div></div>
          <div style="width:1px;background:#334155"></div>
          <div style="text-align:center"><div style="font-size:1.3rem;font-weight:700;color:#34d399">Free</div><div style="font-size:0.7rem;color:#94a3b8;margin-top:2px">on Mentino</div></div>
          <div style="width:1px;background:#334155"></div>
          <div style="text-align:center"><div style="font-size:1.3rem;font-weight:700;color:#fbbf24">15</div><div style="font-size:0.7rem;color:#94a3b8;margin-top:2px">age of founder</div></div>
        </div>
      </div>

      <p class="source">Source: MENTOR: The National Mentoring Partnership, "The Mentoring Gap" (2023).</p>

      <h3>What's actually hard about this</h3>

      <p>I'm not going to pretend it's been smooth. A few things have been genuinely difficult:</p>

      <ul>
        <li><strong>Getting people to take you seriously.</strong> Asking adults to volunteer their time on a platform a 15-year-old built is not an easy pitch. Some people say yes immediately. Others look at my age and check out.</li>
        <li><strong>Limited reach.</strong> I can only personally message so many people. Growth is slow when you're one person with a phone and a laptop.</li>
        <li><strong>Building while learning.</strong> I was learning to code while building the actual product. That's a weird experience. Mistakes cost real time.</li>
        <li><strong>Time.</strong> School. Photography clients. Mentino. Sleep is a luxury.</li>
      </ul>

      <h3>What building this taught me</h3>

      <p>The biggest one: <strong>start before you're ready.</strong> If I waited until I knew everything I needed to know, I'd still be waiting. You learn way more by building than by planning to build.</p>

      <p>Second: asking for help isn't weakness. It's the whole point. Ironically, building a mentorship platform made me better at asking for mentorship myself. I've leaned on a lot of people to get here.</p>

      <p>Third: keep the focus on impact. When things get frustrating (and they do), I come back to why I started. Someone's going to connect with the right mentor through this platform and it's going to change something for them. That's worth the hard days.</p>

      <h3>The Technical Side</h3>

      <p>A lot of people are surprised that a 15-year-old built this. I get it. But the tools available now make it genuinely possible, not easy, but possible. Mentino is built on Hono (a fast web framework), React for the UI, and Supabase for the database. I was learning most of this as I built it.</p>

      <p>The hardest parts weren't the code. They were the decisions. How do you verify a mentor without asking for their social security number? How do you keep a platform safe for students under 18 without making it so locked down that nobody actually uses it? How do you build a matching algorithm that's actually useful and not just a feel-good percentage? These are design problems, not coding problems. You can't Google the answer. You have to think it through and make a call.</p>

      <p>I shipped a lot of bad first versions. The first matching algorithm was a simple keyword match that returned nonsense. The first message system had no read receipts and no notifications, so conversations would just... die silently. The first profile page had no way to edit anything after signing up. Every one of those was a decision I made too fast that I had to go back and fix.</p>

      <p>The lesson: ship early so you can find out what's broken, but be honest with yourself about what "early" means. Releasing something that actively works badly is different from releasing something that's incomplete. The former makes people not come back.</p>

      <h3>What I'd Tell Other Young Builders</h3>

      <p>If you're a student and you're thinking about building something:</p>

      <ul>
        <li><strong>Pick a problem you actually have.</strong> I used Mentino. That made every design decision easier. I could just ask myself what I would want.</li>
        <li><strong>Don't wait until you're good enough.</strong> You get good enough by building things. There is no other path.</li>
        <li><strong>The first version will be embarrassing.</strong> That's fine. Put it in front of real users anyway. The feedback is worth more than the embarrassment.</li>
        <li><strong>Find one person who's already done what you want to do.</strong> I've gotten more useful direction from a handful of conversations with people who've built products before than from any tutorial. Which is, honestly, exactly the point of Mentino.</li>
      </ul>

      <h3>What's next</h3>

      <p>I want a student to be able to open Mentino, find the right mentor for exactly where they're trying to go, and have a real conversation: not a form, not an algorithm pretending to care, just a real person with real experience. We're building toward that.</p>

      <p>The next phase is growth: getting more real mentors from more fields, and making sure every student who signs up can find someone relevant to them. After that, features that make the relationship better over time: session notes, progress tracking, resources mentors can share with students.</p>

      <p>If you're a student, sign up. If you're someone who's figured something out and wants to give back, we need you. We're just getting started.</p>
    `,
  },
];

// GET /blog: Blog index
blog.get("/blog", optionalAuth, (c) => {
  const user = c.get("user");
  const category = (c.req.query("category") || "").trim();
  const categories = [...new Set(blogPosts.map((p) => p.category))];
  const posts = category ? blogPosts.filter((p) => p.category === category) : blogPosts;

  return html(
    <Layout title="Blog" description="Career research, mentor interviews and honest advice for students choosing a career." user={user} currentPath="/blog">
      <div className="max-w-6xl mx-auto">
        <header className="max-w-2xl mb-8">
          <p className="t-eyebrow mb-4">Mentino Blog</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-gray-900">Things worth knowing before you pick a career.</h1>
          <p className="text-lg text-gray-600 mt-4">Career research, mentor interviews and honest takes from people doing the work.</p>
        </header>

        <nav aria-label="Topics" className="flex flex-wrap gap-2 mb-8">
          <a href="/blog" aria-current={!category ? "page" : undefined} className={`btn btn-sm ${!category ? "btn-primary" : "btn-secondary"}`}>All</a>
          {categories.map((cat) => (
            <a key={cat} href={`/blog?category=${encodeURIComponent(cat)}`} aria-current={category === cat ? "page" : undefined}
              className={`btn btn-sm ${category === cat ? "btn-primary" : "btn-secondary"}`}>{cat}</a>
          ))}
        </nav>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
        </div>

        <section className="mt-16 bg-sage rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl text-gray-900">Stop reading. Start talking to someone.</h2>
            <p className="text-gray-700 mt-2">One honest conversation beats all the research in the world.</p>
          </div>
          <a href="/signup" className="btn btn-primary btn-lg">Get started free</a>
        </section>
      </div>
    </Layout>
  );
});

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="card card-interactive overflow-hidden flex flex-col">
      <a href={`/blog/${post.slug}`} className="block skeleton aspect-[16/10]">
        <img src={post.coverImage} alt="" loading="lazy" className="w-full h-full object-cover" data-fade />
      </a>
      <div className="p-6 flex flex-col flex-1">
        <p className="t-meta">{post.category} · {post.readTime}</p>
        <h2 className="text-lg text-gray-900 mt-2 line-clamp-2">
          <a href={`/blog/${post.slug}`} className="hover:underline underline-offset-4">{post.title}</a>
        </h2>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3 flex-1">{post.excerpt}</p>
        <p className="text-sm text-gray-600 mt-4 pt-4 border-t border-gray-200">
          {post.mentorAuthorId ? <a href={`/profile/${post.mentorAuthorId}`} className="hover:underline">{post.author}</a> : post.author} · {post.date}
        </p>
      </div>
    </article>
  );
}

// GET /blog/:slug: Individual blog post
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
        <div className="rounded-xl overflow-hidden mb-8 aspect-[16/9]">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Post header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <a href={`/blog?category=${encodeURIComponent(post.category)}`} className="t-meta hover:underline">{post.category}</a>
            <span className="text-sm text-gray-400">{post.date}</span>
            <span className="text-sm text-gray-400">{post.readTime}</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-gray-900 mb-4">{post.title}</h1>
          <p className="text-xl text-gray-500 mb-6">{post.excerpt}</p>
          <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
            {post.mentorAuthorId ? (
              <a href={`/profile/${post.mentorAuthorId}`} className="flex items-center gap-3 hover:opacity-80 group">
                <div className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-gray-900 font-medium text-sm flex-shrink-0">
                  {post.author[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                    {post.author}
                    <span className="t-meta">Mentor</span>
                  </div>
                  <div className="text-xs text-gray-400">{post.mentorAuthorTitle} · {post.readTime}</div>
                </div>
              </a>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src="/images/founder.jpg" alt="Ethan Branzuela" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{post.author}</div>
                  <div className="text-xs text-gray-400">Founder of Mentino · {post.readTime}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Post content */}
        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{
            __html: `
              <style>
                .prose h3 { font-family: 'Newsreader', Georgia, serif; font-size: 1.6rem; font-weight: 400; color: #1f2420; margin-top: 2rem; margin-bottom: 0.75rem; }
                .prose p { color: #35332f; line-height: 1.8; margin-bottom: 1.25rem; }
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
        <div className="mt-12 bg-sage rounded-xl p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl text-gray-900">Ready to find your mentor?</h3>
            <p className="text-gray-700 mt-2">Free for students. Verified professionals only.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/signup" className="btn btn-primary">Get started free</a>
            <a href="/blog" className="btn btn-secondary">More articles</a>
          </div>
        </div>
      </article>
    </Layout>
  );
});

export function getBlogPostsByMentorId(mentorUserId: string): BlogPost[] {
  return blogPosts.filter((p) => p.mentorAuthorId === mentorUserId);
}

export { blog, blogPosts };
