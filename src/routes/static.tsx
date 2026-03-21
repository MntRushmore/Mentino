import { Hono } from "hono";
import React from "react";
import { renderToString } from "react-dom/server";
import { Layout } from "../views/Layout";
import { optionalAuth } from "../middleware/auth";

const staticPages = new Hono();

function html(element: React.ReactElement, status = 200) {
  return new Response("<!DOCTYPE html>" + renderToString(element), {
    status,
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}

// GET /code-of-conduct
staticPages.get("/code-of-conduct", optionalAuth, (c) => {
  const user = c.get("user");

  return html(
    <Layout title="Code of Conduct" user={user}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Community Code of Conduct</h1>

          <div className="prose prose-gray max-w-none space-y-6">
            <p className="text-gray-600 text-lg">
              Mentino is committed to providing a safe, supportive, and inclusive environment for all
              students and mentors. By using our platform, you agree to abide by the following guidelines.
            </p>

            <Section title="Respect & Professionalism">
              <ul>
                <li>Treat all members with dignity and respect, regardless of age, background, identity, or experience level.</li>
                <li>Maintain professional boundaries at all times. Mentorship relationships should remain educational and supportive.</li>
                <li>Be punctual for scheduled sessions and communicate proactively about changes.</li>
              </ul>
            </Section>

            <Section title="Communication Standards">
              <ul>
                <li>Keep all conversations appropriate and relevant to mentorship goals.</li>
                <li>Do not share personal contact information (phone number, home address) outside the platform until both parties are comfortable.</li>
                <li>Use constructive language. Avoid criticism that isn't actionable or helpful.</li>
              </ul>
            </Section>

            <Section title="Safety & Privacy">
              <ul>
                <li>Keep mentorship conversations confidential. Do not share details of your mentee's or mentor's personal life without permission.</li>
                <li>For students under 18, parental/guardian consent is required. Mentors should be mindful of age-appropriate interactions.</li>
                <li>Never request or share inappropriate content of any kind.</li>
              </ul>
            </Section>

            <Section title="Zero Tolerance Policy">
              <p>The following behaviors will result in immediate account removal:</p>
              <ul>
                <li>Harassment, bullying, or intimidation of any kind</li>
                <li>Solicitation of personal relationships beyond mentorship</li>
                <li>Sharing explicit, offensive, or discriminatory content</li>
                <li>Impersonating another person or providing false credentials</li>
                <li>Attempting to circumvent our verification process</li>
                <li>Any form of spam, scam, or commercial solicitation</li>
              </ul>
            </Section>

            <Section title="Reporting Violations">
              <p>
                If you experience or witness a violation of this Code of Conduct, please report it
                immediately through the platform's reporting feature. All reports are reviewed by our
                admin team within 24 hours and handled confidentially.
              </p>
            </Section>

            <Section title="Mentor Responsibilities">
              <ul>
                <li>Provide honest, constructive guidance based on your genuine experience.</li>
                <li>Be transparent about your background and qualifications.</li>
                <li>Respect your mentee's time and goals. Focus sessions on their needs.</li>
                <li>If you can no longer mentor, communicate this promptly so the student can be re-matched.</li>
              </ul>
            </Section>

            <Section title="Student Responsibilities">
              <ul>
                <li>Come prepared to sessions with questions or topics you'd like to discuss.</li>
                <li>Be respectful of your mentor's volunteer time.</li>
                <li>Provide honest feedback to help us improve the matching process.</li>
                <li>Follow through on action items discussed during sessions.</li>
              </ul>
            </Section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-400">
            Last updated: March 2026
          </div>
        </div>
      </div>
    </Layout>
  );
});

// GET /about
staticPages.get("/about", optionalAuth, (c) => {
  const user = c.get("user");

  return html(
    <Layout title="About" user={user}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About Mentino</h1>

          <div className="space-y-6 text-gray-600">
            <p className="text-lg">
              Mentino is a free mentorship marketplace that connects students with verified working
              professionals across industries. We believe every student deserves access to career
              guidance, regardless of their background or network.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
            <p>
              Too many talented students lack access to professional networks and career guidance.
              Mentino bridges this gap by creating a safe, structured platform where industry
              professionals can volunteer their time to help the next generation succeed.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">How It Works</h2>
            <div className="space-y-3">
              <p><strong>For Students:</strong> Create a profile, tell us about your career interests and goals, and our matching algorithm will connect you with mentors who align with your aspirations. Communicate through messaging and schedule video sessions for in-depth guidance.</p>
              <p><strong>For Mentors:</strong> Sign up, complete our verification process, and start making an impact. Share your experience, review resumes, conduct mock interviews, or simply help students understand what your career path looks like day-to-day.</p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800">Accessibility</h3>
                <p className="text-sm text-blue-700">Free for all students. No premium tiers, no paywalls.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-800">Safety</h3>
                <p className="text-sm text-green-700">All mentors are verified. Content is moderated. Students under 18 require parental consent.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800">Quality</h3>
                <p className="text-sm text-purple-700">Smart matching ensures productive mentorship pairs based on goals, availability, and compatibility.</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800">Community</h3>
                <p className="text-sm text-orange-700">Built by the community, for the community. No venture capital, no ads.</p>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
            <p>
              Have questions, feedback, or want to partner with us? Reach out at{" "}
              <a href="mailto:hello@mentino.org" className="text-blue-600 hover:underline">
                hello@mentino.org
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="text-gray-600 space-y-2">{children}</div>
    </div>
  );
}

export { staticPages };
