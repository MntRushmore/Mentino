import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().min(1, "Last name is required").max(100),
  role: z.enum(["student", "mentor"], { message: "Please select a role" }),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Registration step schemas — Student
export const studentStep1Schema = z.object({
  age: z.coerce.number().min(10, "Must be at least 10").max(30, "Must be 30 or younger"),
  school_name: z.string().max(255).optional(),
  grade_or_year: z.string().max(50).optional(),
});

export const studentStep2Schema = z.object({
  career_interests: z.array(z.string()).min(1, "Select at least one career interest"),
});

export const studentStep3Schema = z.object({
  learning_goals: z.string().min(10, "Please describe your goals (at least 10 characters)").max(2000),
  personality_tags: z.array(z.string()).default([]),
});

export const studentStep4Schema = z.object({
  availability: z.record(z.array(z.string())).refine(
    (val) => Object.values(val).some((slots) => slots.length > 0),
    "Select at least one time slot"
  ),
});

export const studentStep5Schema = z.object({
  parent_consent: z.boolean().optional(),
  parent_email: z.string().email().optional(),
});

// Registration step schemas — Mentor
export const mentorStep1Schema = z.object({
  job_title: z.string().min(1, "Job title is required").max(255),
  company: z.string().max(255).optional(),
  years_experience: z.coerce.number().min(1, "Must have at least 1 year of experience").max(50),
});

export const mentorStep2Schema = z.object({
  career_field: z.string().min(1, "Select a career field"),
  topics: z.array(z.string()).min(1, "Select at least one topic"),
});

export const mentorStep3Schema = z.object({
  linkedin_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  bio: z.string().min(20, "Bio must be at least 20 characters").max(2000),
  personality_tags: z.array(z.string()).default([]),
});

export const mentorStep4Schema = z.object({
  availability: z.record(z.array(z.string())).refine(
    (val) => Object.values(val).some((slots) => slots.length > 0),
    "Select at least one time slot"
  ),
  max_mentees: z.coerce.number().min(1).max(10).default(3),
});

export const profileEditSchema = z.object({
  display_name: z.string().max(100).optional(),
  bio: z.string().max(2000).optional(),
});
