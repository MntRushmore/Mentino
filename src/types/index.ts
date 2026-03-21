export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: "student" | "mentor" | "admin";
  first_name: string;
  last_name: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_active: boolean;
  is_banned: boolean;
  ban_reason: string | null;
  registration_step: number;
  registration_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  age: number;
  school_name: string | null;
  grade_or_year: string | null;
  career_interests: string[];
  learning_goals: string | null;
  availability: Record<string, string[]>;
  personality_tags: string[];
  parent_consent: boolean;
  parent_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface Mentor {
  id: string;
  user_id: string;
  career_field: string;
  job_title: string;
  company: string | null;
  years_experience: number;
  linkedin_url: string | null;
  topics: string[];
  availability: Record<string, string[]>;
  max_mentees: number;
  current_mentees: number;
  personality_tags: string[];
  verification_status: "pending" | "approved" | "rejected";
  verified_at: string | null;
  verified_by: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  student_id: string;
  mentor_id: string;
  status: "pending" | "accepted" | "rejected" | "active" | "completed" | "cancelled";
  match_score: number | null;
  match_reason: string | null;
  requested_by: "student" | "mentor" | "system";
  responded_at: string | null;
  started_at: string | null;
  ended_at: string | null;
  end_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  is_flagged: boolean;
  flag_reason: string | null;
  created_at: string;
}

export interface Session {
  id: string;
  match_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "no_show";
  room_id: string | null;
  notes: string | null;
  rating: number | null;
  feedback: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  match_id: string | null;
  reason: "harassment" | "inappropriate_content" | "spam" | "impersonation" | "other";
  description: string;
  status: "open" | "reviewing" | "resolved" | "dismissed";
  admin_notes: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}
