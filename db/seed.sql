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

-- Mentor: Maya Johnson
INSERT INTO public.accounts (id, email, password_hash, role, first_name, last_name, display_name, bio, registration_step, registration_complete)
VALUES (
    '00000000-0000-0000-0000-000000000010',
    'maya.johnson@example.com',
    '$2b$10$7a2vMxSpv0lgaIgYTc5d8uEiscLEVbqdjA0GZ9EvJ/QtI8EW47uD6',
    'mentor', 'Maya', 'Johnson', 'Maya J.',
    'Corporate attorney turned legal tech entrepreneur. I help students understand what a law career really looks like beyond what you see on TV.',
    5, true
);

INSERT INTO public.mentors (user_id, career_field, job_title, company, years_experience, topics, availability, verification_status, max_mentees)
VALUES (
    '00000000-0000-0000-0000-000000000010',
    'Law', 'Founder & Attorney', 'LegalEase AI', 10,
    ARRAY['Breaking into the field', 'Interview prep', 'College guidance', 'Entrepreneurship'],
    '{"monday": ["6pm-9pm"], "thursday": ["6pm-9pm"], "sunday": ["10am-12pm"]}'::JSONB,
    'approved', 4
);

-- Mentor: David Park
INSERT INTO public.accounts (id, email, password_hash, role, first_name, last_name, display_name, bio, registration_step, registration_complete)
VALUES (
    '00000000-0000-0000-0000-000000000011',
    'david.park@example.com',
    '$2b$10$7a2vMxSpv0lgaIgYTc5d8uEiscLEVbqdjA0GZ9EvJ/QtI8EW47uD6',
    'mentor', 'David', 'Park', 'David P.',
    'Finance professional with a passion for financial literacy. Started as an intern and worked my way up to VP. Happy to share what I learned along the way.',
    5, true
);

INSERT INTO public.mentors (user_id, career_field, job_title, company, years_experience, topics, availability, verification_status, max_mentees)
VALUES (
    '00000000-0000-0000-0000-000000000011',
    'Finance', 'Vice President', 'Goldman Sachs', 15,
    ARRAY['Breaking into the field', 'Interview prep', 'Resume review', 'Networking', 'Career growth'],
    '{"tuesday": ["7pm-9pm"], "friday": ["6pm-9pm"], "saturday": ["9am-12pm"]}'::JSONB,
    'approved', 3
);

-- Mentor: Rachel Green
INSERT INTO public.accounts (id, email, password_hash, role, first_name, last_name, display_name, bio, registration_step, registration_complete)
VALUES (
    '00000000-0000-0000-0000-000000000012',
    'rachel.green@example.com',
    '$2b$10$7a2vMxSpv0lgaIgYTc5d8uEiscLEVbqdjA0GZ9EvJ/QtI8EW47uD6',
    'mentor', 'Rachel', 'Green', 'Rachel G.',
    'Product designer at a top startup. I love helping young creatives find their path in UX, graphic design, and the broader arts & media world.',
    5, true
);

INSERT INTO public.mentors (user_id, career_field, job_title, company, years_experience, topics, availability, verification_status, max_mentees)
VALUES (
    '00000000-0000-0000-0000-000000000012',
    'Arts', 'Lead Product Designer', 'Figma', 7,
    ARRAY['Breaking into the field', 'Technical skills', 'Resume review', 'Industry trends', 'Soft skills'],
    '{"wednesday": ["5pm-8pm"], "saturday": ["10am-12pm"], "sunday": ["2pm-5pm"]}'::JSONB,
    'approved', 3
);

-- Mentor: Carlos Rivera
INSERT INTO public.accounts (id, email, password_hash, role, first_name, last_name, display_name, bio, registration_step, registration_complete)
VALUES (
    '00000000-0000-0000-0000-000000000013',
    'carlos.rivera@example.com',
    '$2b$10$7a2vMxSpv0lgaIgYTc5d8uEiscLEVbqdjA0GZ9EvJ/QtI8EW47uD6',
    'mentor', 'Carlos', 'Rivera', 'Carlos R.',
    'Mechanical engineer working in renewable energy. First-gen college grad who wants to help students navigate STEM careers and higher education.',
    5, true
);

INSERT INTO public.mentors (user_id, career_field, job_title, company, years_experience, topics, availability, verification_status, max_mentees)
VALUES (
    '00000000-0000-0000-0000-000000000013',
    'Engineering', 'Senior Mechanical Engineer', 'Tesla', 9,
    ARRAY['College guidance', 'Career growth', 'Technical skills', 'Work-life balance', 'Breaking into the field'],
    '{"monday": ["7pm-9pm"], "wednesday": ["7pm-9pm"], "saturday": ["11am-1pm"]}'::JSONB,
    'approved', 2
);

-- Mentor: Aisha Williams
INSERT INTO public.accounts (id, email, password_hash, role, first_name, last_name, display_name, bio, registration_step, registration_complete)
VALUES (
    '00000000-0000-0000-0000-000000000014',
    'aisha.williams@example.com',
    '$2b$10$7a2vMxSpv0lgaIgYTc5d8uEiscLEVbqdjA0GZ9EvJ/QtI8EW47uD6',
    'mentor', 'Aisha', 'Williams', 'Aisha W.',
    'High school biology teacher turned biotech researcher. I bridge the gap between education and industry for students interested in science.',
    5, true
);

INSERT INTO public.mentors (user_id, career_field, job_title, company, years_experience, topics, availability, verification_status, max_mentees)
VALUES (
    '00000000-0000-0000-0000-000000000014',
    'Science', 'Research Scientist', 'Genentech', 11,
    ARRAY['Pre-med guidance', 'College guidance', 'Career growth', 'Leadership', 'Industry trends'],
    '{"tuesday": ["6pm-8pm"], "thursday": ["6pm-8pm"], "sunday": ["10am-12pm"]}'::JSONB,
    'approved', 3
);

-- Mentor: Tom Nguyen
INSERT INTO public.accounts (id, email, password_hash, role, first_name, last_name, display_name, bio, registration_step, registration_complete)
VALUES (
    '00000000-0000-0000-0000-000000000015',
    'tom.nguyen@example.com',
    '$2b$10$7a2vMxSpv0lgaIgYTc5d8uEiscLEVbqdjA0GZ9EvJ/QtI8EW47uD6',
    'mentor', 'Tom', 'Nguyen', 'Tom N.',
    'Sports management professional. Played college basketball and now work behind the scenes in the NBA. Happy to talk sports careers beyond being an athlete.',
    5, true
);

INSERT INTO public.mentors (user_id, career_field, job_title, company, years_experience, topics, availability, verification_status, max_mentees)
VALUES (
    '00000000-0000-0000-0000-000000000015',
    'Sports', 'Director of Player Development', 'NBA', 8,
    ARRAY['Breaking into the field', 'Networking', 'Leadership', 'Career growth', 'Work-life balance'],
    '{"monday": ["8pm-10pm"], "friday": ["6pm-9pm"]}'::JSONB,
    'approved', 2
);

-- Mentor: Lisa Chang
INSERT INTO public.accounts (id, email, password_hash, role, first_name, last_name, display_name, bio, registration_step, registration_complete)
VALUES (
    '00000000-0000-0000-0000-000000000016',
    'lisa.chang@example.com',
    '$2b$10$7a2vMxSpv0lgaIgYTc5d8uEiscLEVbqdjA0GZ9EvJ/QtI8EW47uD6',
    'mentor', 'Lisa', 'Chang', 'Lisa C.',
    'Management consultant who has worked across healthcare, tech, and non-profit. I help students think strategically about their career path.',
    5, true
);

INSERT INTO public.mentors (user_id, career_field, job_title, company, years_experience, topics, availability, verification_status, max_mentees)
VALUES (
    '00000000-0000-0000-0000-000000000016',
    'Consulting', 'Senior Manager', 'McKinsey & Company', 10,
    ARRAY['Interview prep', 'Resume review', 'Career growth', 'Networking', 'Leadership'],
    '{"wednesday": ["7pm-9pm"], "saturday": ["9am-11am"], "sunday": ["3pm-5pm"]}'::JSONB,
    'approved', 3
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
