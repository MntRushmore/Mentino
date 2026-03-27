import React from "react";
import { Stepper } from "../components/Stepper";
import { FormField, TextAreaField, CheckboxGroup } from "../components/FormField";
import type { User, Student, Mentor } from "../../types";

interface RegisterStepProps {
  step: number;
  role: "student" | "mentor";
  error?: string;
  user: User;
  student?: Partial<Student>;
  mentor?: Partial<Mentor>;
}

const CAREER_FIELDS = [
  "Technology & Software",
  "Medicine & Healthcare",
  "Law & Legal Services",
  "Business & Management",
  "Sports & Athletics",
  "Arts & Design",
  "Education & Teaching",
  "Engineering",
  "Finance & Accounting",
  "Science & Research",
  "Media & Journalism",
  "Government & Public Policy",
  "Non-Profit & Social Impact",
  "Real Estate",
  "Consulting",
  "Architecture",
  "Aviation & Aerospace",
  "Criminal Justice & Law Enforcement",
  "Cybersecurity",
  "Data Science & AI",
  "Dentistry",
  "Environmental Science",
  "Fashion & Apparel",
  "Film & Television",
  "Food & Culinary Arts",
  "Gaming & Esports",
  "Hospitality & Tourism",
  "Human Resources",
  "Marketing & Advertising",
  "Military & Defense",
  "Music & Performing Arts",
  "Nursing & Allied Health",
  "Pharmacy",
  "Photography & Visual Arts",
  "Psychology & Mental Health",
  "Public Health",
  "Publishing & Writing",
  "Robotics & Automation",
  "Social Work",
  "Supply Chain & Logistics",
  "Veterinary Medicine",
];

const MENTOR_TOPICS = [
  "Breaking into the field", "Interview prep", "Resume review",
  "Career growth", "College guidance", "Entrepreneurship",
  "Work-life balance", "Networking", "Leadership",
  "Industry trends", "Technical skills", "Soft skills",
];

const PERSONALITY_TAGS_STUDENT = [
  "Visual learner", "Hands-on", "Analytical", "Creative",
  "Introvert", "Extrovert", "Detail-oriented", "Big-picture thinker",
  "Curious", "Goal-oriented",
];

const PERSONALITY_TAGS_MENTOR = [
  "Patient", "Direct", "Encouraging", "Storyteller",
  "Technical", "Strategic", "Empathetic", "Structured",
  "Casual", "Detail-oriented",
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = ["9am-12pm", "12pm-3pm", "3pm-6pm", "6pm-9pm"];

export function RegisterStep({ step, role, error, user, student, mentor }: RegisterStepProps) {
  const stepLabels =
    role === "student"
      ? ["About You", "Interests", "Goals", "Schedule", "Review"]
      : ["Career", "Expertise", "Profile", "Schedule", "Review"];

  // Decorative icons per step
  const stepIcons = role === "student"
    ? ["🎓", "🌟", "🎯", "📅", "✅"]
    : ["💼", "🔧", "👤", "📅", "✅"];

  return (
    <div className="max-w-2xl mx-auto mt-4 sm:mt-8 anim-fade-up">
      <Stepper currentStep={step} totalSteps={5} labels={stepLabels} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className={`relative px-5 sm:px-8 py-5 sm:py-6 overflow-hidden ${role === "student" ? "bg-gradient-to-r from-indigo-600 to-blue-600" : "bg-gradient-to-r from-emerald-600 to-teal-600"}`}>
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 pointer-events-none" />
          <svg className="absolute top-3 right-10 w-6 h-6 text-white/30 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
          </svg>
          <svg className="absolute bottom-3 right-24 w-4 h-4 text-white/20 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10"/>
          </svg>
          <div className="relative z-10 flex items-center gap-3">
            <span className="text-3xl">{stepIcons[step - 1]}</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-0.5">
                {stepLabels[step - 1]}
              </h1>
              <p className="text-white/70 text-sm">
                Step {step} of 5 &mdash; {role === "student" ? "Student" : "Mentor"} registration
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 sm:p-8">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form method="POST" action={`/register/step/${step}`} className="space-y-5">
          {/* STUDENT STEPS */}
          {role === "student" && step === 1 && (
            <>
              <FormField
                label="Age"
                name="age"
                type="number"
                required
                min={10}
                max={30}
                value={student?.age?.toString()}
                placeholder="Your age"
              />
              <FormField
                label="School Name"
                name="school_name"
                placeholder="e.g. Lincoln High School"
                value={student?.school_name || ""}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade or Year</label>
                <select
                  name="grade_or_year"
                  defaultValue={student?.grade_or_year || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select your grade or year</option>
                  <optgroup label="High School">
                    <option value="9th Grade">9th Grade</option>
                    <option value="10th Grade">10th Grade</option>
                    <option value="11th Grade">11th Grade</option>
                    <option value="12th Grade">12th Grade</option>
                  </optgroup>
                  <optgroup label="College">
                    <option value="College Freshman">College Freshman (1st Year)</option>
                    <option value="College Sophomore">College Sophomore (2nd Year)</option>
                    <option value="College Junior">College Junior (3rd Year)</option>
                    <option value="College Senior">College Senior (4th Year)</option>
                    <option value="Graduate Student">Graduate Student</option>
                  </optgroup>
                  <option value="Other">Other</option>
                </select>
              </div>
            </>
          )}

          {role === "student" && step === 2 && (
            <>
              <CheckboxGroup
                label="What career fields interest you? (select all that apply)"
                name="career_interests"
                options={CAREER_FIELDS}
                selected={student?.career_interests}
                columns={3}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Don't see yours? Write it in{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  name="career_interests_custom"
                  placeholder="e.g. Marine Biology, Urban Planning, Nanotechnology..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </>
          )}

          {role === "student" && step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What do you hope to learn from a mentor?{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <p className="text-xs text-gray-400 mb-2">Be specific — the more detail you give, the better your match will be.</p>
                <textarea
                  name="learning_goals"
                  placeholder="e.g. I want to understand what a day as a doctor actually looks like. I'm deciding between pre-med and nursing, and I'd love help preparing for college applications and picking the right major..."
                  defaultValue={student?.learning_goals || ""}
                  maxLength={2000}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>

              {/* Specific needs — improves match accuracy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What do you most need help with right now? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-2">Select all that apply — this directly feeds our matching algorithm.</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "Need: college applications", label: "🎓 College applications" },
                    { value: "Need: career exploration", label: "🔭 Exploring career options" },
                    { value: "Need: skill building", label: "🔧 Building specific skills" },
                    { value: "Need: interview prep", label: "🎤 Interview preparation" },
                    { value: "Need: networking", label: "🤝 Networking & connections" },
                    { value: "Need: day-in-life insights", label: "👁 Day-in-the-life insights" },
                    { value: "Need: resume cv", label: "📄 Resume / CV help" },
                    { value: "Need: entrepreneurship", label: "🚀 Starting something" },
                  ].map((opt) => {
                    const isSelected = student?.personality_tags?.includes(opt.value);
                    return (
                      <label key={opt.value} className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 transition-colors">
                        <input type="checkbox" name="session_needs" value={opt.value} defaultChecked={isSelected} className="rounded text-indigo-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Mentorship style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How would you prefer to be mentored? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "Style: structured sessions", label: "📋 Structured sessions with agendas" },
                    { value: "Style: casual chats", label: "💬 Casual, open conversations" },
                    { value: "Style: project-based", label: "📁 Working on projects together" },
                    { value: "Style: advice on demand", label: "⚡ Quick advice when I need it" },
                  ].map((opt) => {
                    const isSelected = student?.personality_tags?.includes(opt.value);
                    return (
                      <label key={opt.value} className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 transition-colors">
                        <input type="checkbox" name="mentorship_style" value={opt.value} defaultChecked={isSelected} className="rounded text-indigo-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Session frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How often can you commit to meeting? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "Freq: weekly", label: "📆 Weekly" },
                    { value: "Freq: bi-weekly", label: "📅 Every two weeks" },
                    { value: "Freq: monthly", label: "🗓 Monthly" },
                    { value: "Freq: as-needed", label: "🔔 As-needed / flexible" },
                  ].map((opt) => {
                    const isSelected = student?.personality_tags?.includes(opt.value);
                    return (
                      <label key={opt.value} className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 transition-colors">
                        <input type="radio" name="session_frequency" value={opt.value} defaultChecked={isSelected} className="text-indigo-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <CheckboxGroup
                label="How would you describe yourself?"
                name="personality_tags"
                options={PERSONALITY_TAGS_STUDENT}
                selected={student?.personality_tags?.filter((t: string) => PERSONALITY_TAGS_STUDENT.includes(t))}
                columns={2}
              />
            </>
          )}

          {role === "student" && step === 4 && (
            <AvailabilityGrid availability={student?.availability} />
          )}

          {role === "student" && step === 5 && (
            <StudentReview user={user} student={student} />
          )}

          {/* MENTOR STEPS */}
          {role === "mentor" && step === 1 && (
            <>
              <FormField
                label="Job Title"
                name="job_title"
                required
                placeholder="e.g. Senior Software Engineer"
                value={mentor?.job_title}
              />
              <FormField
                label="Company"
                name="company"
                placeholder="e.g. Google"
                value={mentor?.company || ""}
              />
              <FormField
                label="Years of Experience"
                name="years_experience"
                type="number"
                required
                min={1}
                max={50}
                value={mentor?.years_experience?.toString()}
                placeholder="Years in your field"
              />
            </>
          )}

          {role === "mentor" && step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Career Field <span className="text-red-500">*</span>
                </label>
                <select
                  name="career_field"
                  required
                  defaultValue={mentor?.career_field || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select your field</option>
                  {CAREER_FIELDS.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                  <option value="Other">Other (write below)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Not listed? Write your field{" "}
                  <span className="text-gray-400 font-normal">(optional — overrides selection above)</span>
                </label>
                <input
                  type="text"
                  name="career_field_custom"
                  placeholder="e.g. Marine Biology, Forensic Accounting, Biomedical Engineering..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <CheckboxGroup
                label="What topics can you mentor on?"
                name="topics"
                options={MENTOR_TOPICS}
                selected={mentor?.topics}
                columns={2}
              />
            </>
          )}

          {role === "mentor" && step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn Profile URL{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  placeholder="https://linkedin.com/in/yourname"
                  defaultValue={mentor?.linkedin_url || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <p className="text-xs text-gray-400 mb-2">Minimum 80 characters — students read this before deciding to connect with you, so give them a real picture of who you are.</p>
                <textarea
                  name="bio"
                  placeholder="e.g. I'm a software engineer at Google with 6 years of experience. I grew up without mentors and want to change that for the next generation. I can help with interview prep, breaking into tech, navigating college CS programs, and career growth."
                  defaultValue={user.bio || ""}
                  minLength={80}
                  maxLength={2000}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>
              {/* Mentor approach */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How do you typically mentor? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-2">Select all that apply — this helps us match you with compatible students.</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "Approach: structured sessions", label: "📋 Structured sessions" },
                    { value: "Approach: casual conversations", label: "💬 Casual conversations" },
                    { value: "Approach: project-based", label: "📁 Project-based work" },
                    { value: "Approach: available when needed", label: "⚡ Available when needed" },
                  ].map((opt) => {
                    const isSelected = mentor?.personality_tags?.includes(opt.value);
                    return (
                      <label key={opt.value} className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:border-emerald-400 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 transition-colors">
                        <input type="checkbox" name="mentor_approach" value={opt.value} defaultChecked={isSelected} className="rounded text-emerald-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Who they're best for */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Who do you mentor best? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "Best for: high schoolers", label: "🎒 High school students" },
                    { value: "Best for: college students", label: "🏛 College students" },
                    { value: "Best for: career changers", label: "🔄 Career changers" },
                    { value: "Best for: any student", label: "🌍 Anyone — I'm flexible" },
                  ].map((opt) => {
                    const isSelected = mentor?.personality_tags?.includes(opt.value);
                    return (
                      <label key={opt.value} className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:border-emerald-400 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 transition-colors">
                        <input type="checkbox" name="mentor_best_for" value={opt.value} defaultChecked={isSelected} className="rounded text-emerald-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <CheckboxGroup
                label="How would you describe your mentoring personality?"
                name="personality_tags"
                options={PERSONALITY_TAGS_MENTOR}
                selected={mentor?.personality_tags?.filter((t: string) => PERSONALITY_TAGS_MENTOR.includes(t))}
                columns={2}
              />
            </>
          )}

          {role === "mentor" && step === 4 && (
            <>
              <AvailabilityGrid availability={mentor?.availability} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum number of mentees</label>
                <select
                  name="max_mentees"
                  defaultValue={mentor?.max_mentees?.toString() || "3"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                    <option key={n} value={n.toString()}>{n} {n === 1 ? "mentee" : "mentees"}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {role === "mentor" && step === 5 && (
            <MentorReview user={user} mentor={mentor} />
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <a
                href={`/register/step/${step - 1}`}
                className="text-gray-600 hover:text-gray-900 font-medium py-2.5 px-6"
              >
                Back
              </a>
            )}
            <button
              type="submit"
              className="ml-auto bg-blue-600 text-white py-2.5 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {step === 5 ? "Complete Registration" : "Continue"}
            </button>
          </div>
        </form>
        </div>{/* end p-8 */}
      </div>{/* end card */}
    </div>
  );
}

function AvailabilityGrid({ availability }: { availability?: Record<string, string[]> }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        When are you available? <span className="text-red-500">*</span>
      </label>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-sm text-gray-500"></th>
              {TIME_SLOTS.map((slot) => (
                <th key={slot} className="p-2 text-center text-xs text-gray-500 font-medium">
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <tr key={day}>
                <td className="p-2 text-sm font-medium text-gray-700">{day}</td>
                {TIME_SLOTS.map((slot) => {
                  const key = day.toLowerCase();
                  const isChecked = availability?.[key]?.includes(slot) || false;
                  return (
                    <td key={slot} className="p-1 text-center">
                      <label className="flex items-center justify-center p-2 border border-gray-200 rounded cursor-pointer hover:bg-blue-50 has-[:checked]:bg-blue-100 has-[:checked]:border-blue-400">
                        <input
                          type="checkbox"
                          name={`availability_${key}`}
                          value={slot}
                          defaultChecked={isChecked}
                          className="sr-only"
                        />
                        <span className="w-4 h-4 rounded border border-gray-300 has-[:checked]:bg-blue-600"></span>
                      </label>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentReview({ user, student }: { user: User; student?: Partial<Student> }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">Please review your information before completing registration.</p>
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div>
          <span className="text-sm text-gray-500">Name:</span>{" "}
          <span className="font-medium">{user.first_name} {user.last_name}</span>
        </div>
        <div>
          <span className="text-sm text-gray-500">Age:</span>{" "}
          <span className="font-medium">{student?.age}</span>
        </div>
        {student?.school_name && (
          <div>
            <span className="text-sm text-gray-500">School:</span>{" "}
            <span className="font-medium">{student.school_name}</span>
          </div>
        )}
        {student?.career_interests && student.career_interests.length > 0 && (
          <div>
            <span className="text-sm text-gray-500">Interests:</span>{" "}
            <span className="font-medium">{student.career_interests.join(", ")}</span>
          </div>
        )}
        {student?.learning_goals && (
          <div>
            <span className="text-sm text-gray-500">Goals:</span>{" "}
            <span className="font-medium">{student.learning_goals}</span>
          </div>
        )}
      </div>

      {/* Prepare questions callout */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div>
            <h3 className="font-bold text-indigo-900 text-sm mb-1">Before your first session — prepare 3–5 questions</h3>
            <p className="text-indigo-700 text-xs leading-relaxed mb-3">
              Sessions go way better when you come prepared. Your mentor's time is valuable — showing up with real questions makes a strong first impression and gets you real answers.
            </p>
            <p className="text-xs font-semibold text-indigo-800 mb-1">Good question starters:</p>
            <ul className="text-xs text-indigo-700 space-y-0.5 list-disc list-inside">
              <li>"What does a typical day look like for you?"</li>
              <li>"What do you wish you'd known starting out?"</li>
              <li>"How did you get to where you are?"</li>
              <li>"What skills matter most in your field right now?"</li>
              <li>"If you were me, what would you do next?"</li>
            </ul>
          </div>
        </div>
      </div>

      {student?.age && student.age < 18 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800 font-medium mb-3">
            Since you're under 18, we need parental consent.
          </p>
          <label className="flex items-center space-x-2 mb-3">
            <input type="checkbox" name="parent_consent" value="true" required className="rounded text-blue-600" />
            <span className="text-sm text-gray-700">My parent/guardian consents to my use of Mentino</span>
          </label>
          <FormField
            label="Parent/Guardian Email"
            name="parent_email"
            type="email"
            required
            placeholder="parent@example.com"
          />
        </div>
      )}
    </div>
  );
}

function MentorReview({ user, mentor }: { user: User; mentor?: Partial<Mentor> }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">Please review your information. After registration, your profile will be reviewed by our admin team before you can be matched with students.</p>
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div>
          <span className="text-sm text-gray-500">Name:</span>{" "}
          <span className="font-medium">{user.first_name} {user.last_name}</span>
        </div>
        <div>
          <span className="text-sm text-gray-500">Title:</span>{" "}
          <span className="font-medium">{mentor?.job_title} at {mentor?.company || "N/A"}</span>
        </div>
        <div>
          <span className="text-sm text-gray-500">Field:</span>{" "}
          <span className="font-medium">{mentor?.career_field}</span>
        </div>
        <div>
          <span className="text-sm text-gray-500">Experience:</span>{" "}
          <span className="font-medium">{mentor?.years_experience} years</span>
        </div>
        {mentor?.topics && mentor.topics.length > 0 && (
          <div>
            <span className="text-sm text-gray-500">Topics:</span>{" "}
            <span className="font-medium">{mentor.topics.join(", ")}</span>
          </div>
        )}
      </div>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div>
            <h3 className="font-bold text-emerald-900 text-sm mb-1">Help students come prepared</h3>
            <p className="text-emerald-700 text-xs leading-relaxed mb-2">
              When a student requests a match with you, encourage them to prepare 3–5 questions beforehand. Sessions are much more productive when students come with specific things they want to learn, not just "tell me about your job."
            </p>
            <p className="text-xs text-emerald-800 font-semibold">Your first message to a new mentee can set the tone:</p>
            <div className="mt-2 bg-white/60 rounded-lg p-3 text-xs text-emerald-700 italic border border-emerald-200">
              "Before our first session, come with 3–5 questions. Think about what you actually want to know — the more specific, the better the conversation."
            </div>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          After completing registration, your profile is live and students can start requesting to match with you.
        </p>
      </div>
    </div>
  );
}
