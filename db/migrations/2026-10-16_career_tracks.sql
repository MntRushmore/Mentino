-- Career Tracks: one row per student per track.
-- Track content lives in src/data/tracks.ts; this table only stores each
-- student's progress (notes, completed lessons, assignments, quiz scores).
-- Run once in the Supabase SQL editor.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.track_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    track_slug VARCHAR(100) NOT NULL,
    state JSONB NOT NULL DEFAULT '{}'::JSONB,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, track_slug)
);

CREATE INDEX IF NOT EXISTS idx_track_enrollments_user ON public.track_enrollments(user_id);

-- Make the new table visible to the API immediately.
NOTIFY pgrst, 'reload schema';
