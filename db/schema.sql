-- Mentino Database Schema
-- Run this in your Supabase SQL editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS public.audit_log CASCADE;
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.matches CASCADE;
DROP TABLE IF EXISTS public.mentors CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.accounts CASCADE;

-- ACCOUNTS (renamed from "users" to avoid Supabase auth.users conflict)
CREATE TABLE public.accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    is_banned BOOLEAN DEFAULT false,
    ban_reason TEXT,
    registration_step INTEGER DEFAULT 1,
    registration_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STUDENTS
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    age INTEGER NOT NULL,
    school_name VARCHAR(255),
    grade_or_year VARCHAR(50),
    career_interests TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    learning_goals TEXT,
    availability JSONB NOT NULL DEFAULT '{}'::JSONB,
    personality_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    parent_consent BOOLEAN DEFAULT false,
    parent_email VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MENTORS
CREATE TABLE public.mentors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    career_field VARCHAR(100) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    years_experience INTEGER NOT NULL,
    linkedin_url VARCHAR(500),
    topics TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    availability JSONB NOT NULL DEFAULT '{}'::JSONB,
    max_mentees INTEGER DEFAULT 3,
    current_mentees INTEGER DEFAULT 0,
    personality_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    verification_status VARCHAR(20) DEFAULT 'pending',
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.accounts(id),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MATCHES
CREATE TABLE public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    match_score DECIMAL(5,2),
    match_reason TEXT,
    requested_by VARCHAR(20) NOT NULL,
    responded_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    end_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.matches ADD CONSTRAINT unique_student_mentor UNIQUE (student_id, mentor_id);

-- MESSAGES
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.accounts(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_flagged BOOLEAN DEFAULT false,
    flag_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SESSIONS
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    status VARCHAR(20) DEFAULT 'scheduled',
    meeting_url TEXT,
    notes TEXT,
    rating INTEGER,
    feedback TEXT,
    created_by UUID NOT NULL REFERENCES public.accounts(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- REPORTS
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.accounts(id),
    reported_user_id UUID NOT NULL REFERENCES public.accounts(id),
    match_id UUID REFERENCES public.matches(id),
    reason VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    admin_notes TEXT,
    resolved_by UUID REFERENCES public.accounts(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUDIT LOG
CREATE TABLE public.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES public.accounts(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Constraints
ALTER TABLE public.accounts ADD CONSTRAINT accounts_role_check CHECK (role IN ('student', 'mentor', 'admin'));
ALTER TABLE public.students ADD CONSTRAINT students_age_check CHECK (age >= 10 AND age <= 30);
ALTER TABLE public.mentors ADD CONSTRAINT mentors_verification_check CHECK (verification_status IN ('pending', 'approved', 'rejected'));
ALTER TABLE public.matches ADD CONSTRAINT matches_status_check CHECK (status IN ('pending', 'accepted', 'rejected', 'active', 'completed', 'cancelled'));
ALTER TABLE public.matches ADD CONSTRAINT matches_requested_by_check CHECK (requested_by IN ('student', 'mentor', 'system'));
ALTER TABLE public.sessions ADD CONSTRAINT sessions_status_check CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'));
ALTER TABLE public.sessions ADD CONSTRAINT sessions_rating_check CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5));
ALTER TABLE public.reports ADD CONSTRAINT reports_reason_check CHECK (reason IN ('harassment', 'inappropriate_content', 'spam', 'impersonation', 'other'));
ALTER TABLE public.reports ADD CONSTRAINT reports_status_check CHECK (status IN ('open', 'reviewing', 'resolved', 'dismissed'));

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_accounts_updated BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_students_updated BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_mentors_updated BEFORE UPDATE ON public.mentors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_matches_updated BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_sessions_updated BEFORE UPDATE ON public.sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Indexes
CREATE INDEX idx_accounts_email ON public.accounts(email);
CREATE INDEX idx_accounts_role ON public.accounts(role);
CREATE INDEX idx_students_user_id ON public.students(user_id);
CREATE INDEX idx_mentors_user_id ON public.mentors(user_id);
CREATE INDEX idx_mentors_verification ON public.mentors(verification_status);
CREATE INDEX idx_matches_student ON public.matches(student_id);
CREATE INDEX idx_matches_mentor ON public.matches(mentor_id);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_messages_match_id ON public.messages(match_id);
CREATE INDEX idx_messages_created_at ON public.messages(match_id, created_at DESC);
CREATE INDEX idx_sessions_match ON public.sessions(match_id);
CREATE INDEX idx_reports_status ON public.reports(status);
