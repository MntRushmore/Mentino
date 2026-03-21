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
  "Technology", "Medicine", "Law", "Business", "Sports", "Arts",
  "Education", "Engineering", "Finance", "Science", "Media", "Government",
  "Non-Profit", "Real Estate", "Consulting",
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

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Stepper currentStep={step} totalSteps={5} labels={stepLabels} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {stepLabels[step - 1]}
        </h1>
        <p className="text-gray-500 mb-6">
          Step {step} of 5 &mdash;{" "}
          {role === "student" ? "Student" : "Mentor"} registration
        </p>

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
              <FormField
                label="Grade or Year"
                name="grade_or_year"
                placeholder="e.g. 11th grade, College Sophomore"
                value={student?.grade_or_year || ""}
              />
            </>
          )}

          {role === "student" && step === 2 && (
            <CheckboxGroup
              label="What career fields interest you? (select all that apply)"
              name="career_interests"
              options={CAREER_FIELDS}
              selected={student?.career_interests}
              columns={3}
            />
          )}

          {role === "student" && step === 3 && (
            <>
              <TextAreaField
                label="What do you hope to learn from a mentor?"
                name="learning_goals"
                required
                placeholder="Describe your goals, questions, or what you'd like guidance on..."
                value={student?.learning_goals || ""}
                minLength={10}
                maxLength={2000}
              />
              <CheckboxGroup
                label="How would you describe yourself?"
                name="personality_tags"
                options={PERSONALITY_TAGS_STUDENT}
                selected={student?.personality_tags}
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
                </select>
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
              <FormField
                label="LinkedIn Profile URL"
                name="linkedin_url"
                type="url"
                placeholder="https://linkedin.com/in/yourname"
                value={mentor?.linkedin_url || ""}
              />
              <TextAreaField
                label="Bio"
                name="bio"
                required
                placeholder="Tell students about yourself, your experience, and why you want to mentor..."
                value={user.bio || ""}
                minLength={20}
                maxLength={2000}
              />
              <CheckboxGroup
                label="How would you describe your mentoring style?"
                name="personality_tags"
                options={PERSONALITY_TAGS_MENTOR}
                selected={mentor?.personality_tags}
                columns={2}
              />
            </>
          )}

          {role === "mentor" && step === 4 && (
            <>
              <AvailabilityGrid availability={mentor?.availability} />
              <FormField
                label="Maximum number of mentees"
                name="max_mentees"
                type="number"
                min={1}
                max={10}
                value={mentor?.max_mentees?.toString() || "3"}
              />
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
      </div>
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          After completing registration, your profile will be submitted for verification. Our team will review it within 24-48 hours. You'll be notified once approved.
        </p>
      </div>
    </div>
  );
}
