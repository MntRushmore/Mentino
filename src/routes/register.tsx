import { Hono } from "hono";
import React from "react";
import { renderToString } from "react-dom/server";
import { Layout } from "../views/Layout";
import { RegisterStep } from "../views/pages/RegisterStep";
import { authMiddleware } from "../middleware/auth";
import { supabase } from "../db";
import { moderateFields } from "../lib/moderation";
import type { User } from "../types";

const register = new Hono();

function html(element: React.ReactElement, status = 200) {
  return new Response("<!DOCTYPE html>" + renderToString(element), {
    status,
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}

// All registration routes require auth
register.use("/register/*", authMiddleware);

// GET /register/step/:n
register.get("/register/step/:n", async (c) => {
  const step = parseInt(c.req.param("n"));
  const user = c.get("user");

  if (step < 1 || step > 5 || isNaN(step)) {
    return c.redirect("/register/step/1");
  }

  // Can't skip ahead
  if (step > user.registration_step) {
    return c.redirect(`/register/step/${user.registration_step}`);
  }

  // Already complete
  if (user.registration_complete) {
    return c.redirect("/dashboard");
  }

  const { student, mentor } = await loadRoleData(user);

  return html(
    <Layout title={`Registration - Step ${step}`} user={user}>
      <RegisterStep step={step} role={user.role as "student" | "mentor"} user={user} student={student} mentor={mentor} />
    </Layout>
  );
});

// POST /register/step/:n
register.post("/register/step/:n", async (c) => {
  const step = parseInt(c.req.param("n"));
  const user = c.get("user");
  const body = await c.req.parseBody({ all: true });

  if (step < 1 || step > 5 || isNaN(step)) {
    return c.redirect("/register/step/1");
  }

  const { student, mentor } = await loadRoleData(user);

  const renderError = (error: string) =>
    html(
      <Layout title={`Registration - Step ${step}`} user={user}>
        <RegisterStep step={step} role={user.role as "student" | "mentor"} user={user} student={student} mentor={mentor} error={error} />
      </Layout>
    );

  try {
    if (user.role === "student") {
      await handleStudentStep(step, user, body, student);
    } else if (user.role === "mentor") {
      await handleMentorStep(step, user, body, mentor);
    }
  } catch (err: any) {
    return renderError(err.message || "Something went wrong. Please try again.");
  }

  // Update registration step
  const nextStep = Math.min(step + 1, 5);
  const isComplete = step === 5;

  await supabase
    .from("accounts")
    .update({
      registration_step: isComplete ? 5 : nextStep,
      registration_complete: isComplete,
    })
    .eq("id", user.id);

  if (isComplete) {
    return c.redirect("/dashboard");
  }

  return c.redirect(`/register/step/${nextStep}`);
});

async function handleStudentStep(
  step: number,
  user: User,
  body: Record<string, any>,
  existing?: any
) {
  switch (step) {
    case 1: {
      const age = parseInt(body.age as string);
      if (isNaN(age) || age < 10 || age > 30) throw new Error("Age must be between 10 and 30");

      // Upsert student record
      if (existing?.id) {
        await supabase
          .from("students")
          .update({
            age,
            school_name: (body.school_name as string) || null,
            grade_or_year: (body.grade_or_year as string) || null,
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("students").insert({
          user_id: user.id,
          age,
          school_name: (body.school_name as string) || null,
          grade_or_year: (body.grade_or_year as string) || null,
          career_interests: [],
          availability: {},
        });
      }
      break;
    }
    case 2: {
      const interests = normalizeArray(body.career_interests);
      if (interests.length === 0) throw new Error("Select at least one career interest");

      await supabase
        .from("students")
        .update({ career_interests: interests })
        .eq("user_id", user.id);
      break;
    }
    case 3: {
      const goals = (body.learning_goals as string) || "";
      const tags = normalizeArray(body.personality_tags);

      const modResult = moderateFields({ learning_goals: goals });
      if (!modResult.clean) throw new Error(modResult.reason);

      if (goals.length < 10) throw new Error("Please describe your goals (at least 10 characters)");

      await supabase
        .from("students")
        .update({ learning_goals: goals, personality_tags: tags })
        .eq("user_id", user.id);
      break;
    }
    case 4: {
      const availability = parseAvailability(body);
      const hasSlots = Object.values(availability).some((slots) => slots.length > 0);
      if (!hasSlots) throw new Error("Select at least one time slot");

      await supabase
        .from("students")
        .update({ availability })
        .eq("user_id", user.id);
      break;
    }
    case 5: {
      // Check if parent consent is needed
      const { data: studentData } = await supabase
        .from("students")
        .select("age")
        .eq("user_id", user.id)
        .single();

      if (studentData && studentData.age < 18) {
        const consent = body.parent_consent === "true";
        const parentEmail = (body.parent_email as string) || "";
        if (!consent) throw new Error("Parental consent is required for students under 18");
        if (!parentEmail) throw new Error("Parent email is required");

        await supabase
          .from("students")
          .update({ parent_consent: true, parent_email: parentEmail })
          .eq("user_id", user.id);
      }
      break;
    }
  }
}

async function handleMentorStep(
  step: number,
  user: User,
  body: Record<string, any>,
  existing?: any
) {
  switch (step) {
    case 1: {
      const jobTitle = (body.job_title as string)?.trim();
      const company = (body.company as string)?.trim() || null;
      const yearsExp = parseInt(body.years_experience as string);

      if (!jobTitle) throw new Error("Job title is required");
      if (isNaN(yearsExp) || yearsExp < 1) throw new Error("Years of experience must be at least 1");

      if (existing?.id) {
        await supabase
          .from("mentors")
          .update({ job_title: jobTitle, company, years_experience: yearsExp })
          .eq("id", existing.id);
      } else {
        await supabase.from("mentors").insert({
          user_id: user.id,
          job_title: jobTitle,
          company,
          years_experience: yearsExp,
          career_field: "",
          topics: [],
          availability: {},
        });
      }
      break;
    }
    case 2: {
      const careerField = (body.career_field as string)?.trim();
      const topics = normalizeArray(body.topics);

      if (!careerField) throw new Error("Select a career field");
      if (topics.length === 0) throw new Error("Select at least one topic");

      await supabase
        .from("mentors")
        .update({ career_field: careerField, topics })
        .eq("user_id", user.id);
      break;
    }
    case 3: {
      const linkedinUrl = (body.linkedin_url as string)?.trim() || null;
      const bio = (body.bio as string)?.trim() || "";
      const tags = normalizeArray(body.personality_tags);

      const modResult = moderateFields({ bio });
      if (!modResult.clean) throw new Error(modResult.reason);

      if (bio.length < 20) throw new Error("Bio must be at least 20 characters");

      await supabase
        .from("mentors")
        .update({ linkedin_url: linkedinUrl, personality_tags: tags })
        .eq("user_id", user.id);

      await supabase
        .from("accounts")
        .update({ bio })
        .eq("id", user.id);
      break;
    }
    case 4: {
      const availability = parseAvailability(body);
      const hasSlots = Object.values(availability).some((slots) => slots.length > 0);
      if (!hasSlots) throw new Error("Select at least one time slot");

      const maxMentees = parseInt(body.max_mentees as string) || 3;

      await supabase
        .from("mentors")
        .update({ availability, max_mentees: Math.min(Math.max(maxMentees, 1), 10) })
        .eq("user_id", user.id);
      break;
    }
    case 5: {
      // Set verification status to pending
      await supabase
        .from("mentors")
        .update({ verification_status: "pending" })
        .eq("user_id", user.id);
      break;
    }
  }
}

async function loadRoleData(user: User) {
  let student, mentor;
  if (user.role === "student") {
    const { data } = await supabase.from("students").select("*").eq("user_id", user.id).single();
    student = data || undefined;
  } else if (user.role === "mentor") {
    const { data } = await supabase.from("mentors").select("*").eq("user_id", user.id).single();
    mentor = data || undefined;
  }
  return { student, mentor };
}

function normalizeArray(value: any): string[] {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string" && value) return [value];
  return [];
}

function parseAvailability(body: Record<string, any>): Record<string, string[]> {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const availability: Record<string, string[]> = {};
  for (const day of days) {
    const slots = normalizeArray(body[`availability_${day}`]);
    if (slots.length > 0) {
      availability[day] = slots;
    }
  }
  return availability;
}

export { register };
