-- Mentino Seed Data
-- All passwords are: password123

-- Admin user
INSERT INTO public.accounts (id, email, password_hash, role, first_name, last_name, display_name, registration_step, registration_complete)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@mentino.org',
    '$2b$10$7a2vMxSpv0lgaIgYTc5d8uEiscLEVbqdjA0GZ9EvJ/QtI8EW47uD6',
    'admin', 'Admin', 'User', 'Admin', 5, true
);

-- Mentor: Sarah Chen
INSERT INTO public.accounts (id, email, password_hash, role, first_name, last_name, display_name, bio, registration_step, registration_complete)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'sarah.chen@example.com',
    '$2b$10$7a2vMxSpv0lgaIgYTc5d8uEiscLEVbqdjA0GZ9EvJ/QtI8EW47uD6',
    'mentor', 'Sarah', 'Chen', 'Sarah C.',
    'Senior software engineer with 8 years of experience. Passionate about helping the next generation break into tech.',
    5, true
);

INSERT INTO public.mentors (user_id, career_field, job_title, company, years_experience, topics, availability, verification_status, max_mentees)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'Technology', 'Senior Software Engineer', 'Google', 8,
    ARRAY['Breaking into the field', 'Interview prep', 'Resume review', 'Career growth'],
    '{"monday": ["6pm-8pm"], "wednesday": ["6pm-8pm"], "saturday": ["10am-12pm"]}'::JSONB,
    'approved', 3
);

-- Mentor: James Wilson
INSERT INTO public.accounts (id, email, password_hash, role, first_name, last_name, display_name, bio, registration_step, registration_complete)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    'james.wilson@example.com',
    '$2b$10$7a2vMxSpv0lgaIgYTc5d8uEiscLEVbqdjA0GZ9EvJ/QtI8EW47uD6',
    'mentor', 'James', 'Wilson', 'James W.',
    'Emergency medicine physician. Love mentoring pre-med students and sharing what medical school is really like.',
    5, true
);

INSERT INTO public.mentors (user_id, career_field, job_title, company, years_experience, topics, availability, verification_status, max_mentees)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    'Medicine', 'Emergency Medicine Physician', 'Johns Hopkins Hospital', 12,
    ARRAY['Pre-med guidance', 'Medical school prep', 'Residency advice', 'Work-life balance'],
    '{"tuesday": ["7pm-9pm"], "thursday": ["7pm-9pm"]}'::JSONB,
    'approved', 2
);

-- Student: Alex Martinez
INSERT INTO public.accounts (id, email, password_hash, role, first_name, last_name, display_name, bio, registration_step, registration_complete)
VALUES (
    '00000000-0000-0000-0000-000000000004',
    'alex.martinez@example.com',
    '$2b$10$7a2vMxSpv0lgaIgYTc5d8uEiscLEVbqdjA0GZ9EvJ/QtI8EW47uD6',
    'student', 'Alex', 'Martinez', 'Alex M.',
    'High school junior interested in computer science. Want to learn about internships and college applications.',
    5, true
);

INSERT INTO public.students (user_id, age, school_name, grade_or_year, career_interests, learning_goals, availability, personality_tags, parent_consent)
VALUES (
    '00000000-0000-0000-0000-000000000004',
    16, 'Lincoln High School', '11th grade',
    ARRAY['Technology', 'Business'],
    'I want to learn about software engineering careers and how to prepare for college CS programs.',
    '{"monday": ["4pm-6pm"], "wednesday": ["4pm-6pm"], "saturday": ["10am-12pm"]}'::JSONB,
    ARRAY['visual-learner', 'curious', 'hands-on'],
    true
);

-- Student: Priya Patel
INSERT INTO public.accounts (id, email, password_hash, role, first_name, last_name, display_name, bio, registration_step, registration_complete)
VALUES (
    '00000000-0000-0000-0000-000000000005',
    'priya.patel@example.com',
    '$2b$10$7a2vMxSpv0lgaIgYTc5d8uEiscLEVbqdjA0GZ9EvJ/QtI8EW47uD6',
    'student', 'Priya', 'Patel', 'Priya P.',
    'College freshman considering pre-med. Looking for guidance on whether medicine is the right path for me.',
    5, true
);

INSERT INTO public.students (user_id, age, school_name, grade_or_year, career_interests, learning_goals, availability, personality_tags, parent_consent)
VALUES (
    '00000000-0000-0000-0000-000000000005',
    19, 'Stanford University', 'College Freshman',
    ARRAY['Medicine', 'Research'],
    'Exploring whether to pursue medicine. Want to understand the day-to-day of being a doctor.',
    '{"tuesday": ["5pm-7pm"], "thursday": ["5pm-7pm"], "sunday": ["2pm-4pm"]}'::JSONB,
    ARRAY['analytical', 'introvert', 'detail-oriented'],
    false
);
