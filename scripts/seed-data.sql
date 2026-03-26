-- ============================================
-- LINGUA SEED DATA
-- Sample Users, 10 Grammar Rules, 1 Complete Unit
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. SAMPLE USERS (inserted into profiles)
-- ============================================
-- Note: Auth users must be created via Supabase Auth.
-- These are profile entries assuming auth users exist.
-- You can create sample auth users in the Supabase dashboard first.

INSERT INTO profiles (id, display_name, total_xp, current_streak, current_level, last_active_date)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Duy Tran', 1450, 12, 'B1', CURRENT_DATE),
  ('00000000-0000-0000-0000-000000000002', 'David Nguyen', 1200, 8, 'A2', CURRENT_DATE - INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000000000003', 'Sarah Le', 850, 5, 'A2', CURRENT_DATE - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000000000004', 'Emma Wilson', 2100, 15, 'B2', CURRENT_DATE),
  ('00000000-0000-0000-0000-000000000005', 'James Miller', 400, 3, 'A1', CURRENT_DATE - INTERVAL '3 days')
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  total_xp = EXCLUDED.total_xp,
  current_streak = EXCLUDED.current_streak,
  current_level = EXCLUDED.current_level;

-- ============================================
-- 2. GRAMMAR RULES (10 rules across categories)
-- ============================================

INSERT INTO grammar_rules (id, title, category, explanation, example_correct, example_incorrect, cefr_level)
VALUES
  (gen_random_uuid(), 'Subject-Verb Agreement (3rd person singular)',
   'verb_conjugation',
   'In the present simple tense, third-person singular subjects (he, she, it) require the verb to end in "-s" or "-es".',
   'She goes to the store every day.',
   'She go to the store every day.',
   'A1'),

  (gen_random_uuid(), 'Simple Past Tense (Regular Verbs)',
   'verb_tense',
   'Regular verbs form the past tense by adding "-ed" to the base form. If the verb ends in "e", add only "-d".',
   'I walked to school yesterday.',
   'I walk to school yesterday.',
   'A1'),

  (gen_random_uuid(), 'Articles: A vs An',
   'articles',
   'Use "a" before words that begin with a consonant sound and "an" before words that begin with a vowel sound.',
   'She is an engineer at a university.',
   'She is a engineer at an university.',
   'A1'),

  (gen_random_uuid(), 'Present Continuous Tense',
   'verb_tense',
   'The present continuous is formed with "am/is/are" + verb-ing. It describes actions happening right now.',
   'They are playing football in the park.',
   'They playing football in the park.',
   'A1'),

  (gen_random_uuid(), 'Possessive Adjectives vs Pronouns',
   'pronouns',
   'Possessive adjectives (my, your, his, her) come before a noun. Possessive pronouns (mine, yours, his, hers) replace the noun.',
   'This book is mine. That is your bag.',
   'This book is my. That is yours bag.',
   'A2'),

  (gen_random_uuid(), 'Comparative Adjectives',
   'adjectives',
   'Add "-er" for short adjectives (tall → taller). Use "more" for adjectives with 2+ syllables (beautiful → more beautiful). "Than" follows.',
   'Mount Everest is taller than Mont Blanc.',
   'Mount Everest is more tall than Mont Blanc.',
   'A2'),

  (gen_random_uuid(), 'Prepositions of Time: In, On, At',
   'prepositions',
   '"At" for specific times, "on" for days/dates, "in" for months/years/seasons.',
   'The meeting is at 3pm on Monday in January.',
   'The meeting is on 3pm at Monday on January.',
   'A2'),

  (gen_random_uuid(), 'Past Continuous Tense',
   'verb_tense',
   'Formed with "was/were" + verb-ing. Used for actions in progress at a specific past time, or interrupted by another action.',
   'I was reading when the phone rang.',
   'I was read when the phone rang.',
   'B1'),

  (gen_random_uuid(), 'Conditional Type 1 (Real/Possible)',
   'conditionals',
   'If + present simple, will + base verb. Describes a real or possible situation and its likely result.',
   'If it rains, I will take an umbrella.',
   'If it will rain, I take an umbrella.',
   'B1'),

  (gen_random_uuid(), 'Passive Voice (Present Simple)',
   'voice',
   'Object + am/is/are + past participle. The focus shifts from who does the action to what receives it.',
   'The report is written by the manager.',
   'The report written by the manager.',
   'B1')
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. COMPLETE UNIT: "Intro to Nouns" with 4 lessons
-- ============================================

-- Unit
INSERT INTO units (id, title, description, cefr_level, order_index, is_published)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001',
   'Intro to Nouns',
   'Identify people and objects.',
   'A1', 1, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Lessons
INSERT INTO lessons (id, unit_id, title, order_index, xp_reward)
VALUES
  ('bbbbbbbb-0000-0000-0000-000000000001',
   'aaaaaaaa-0000-0000-0000-000000000001',
   'Common Nouns', 1, 10),

  ('bbbbbbbb-0000-0000-0000-000000000002',
   'aaaaaaaa-0000-0000-0000-000000000001',
   'Proper Nouns', 2, 10),

  ('bbbbbbbb-0000-0000-0000-000000000003',
   'aaaaaaaa-0000-0000-0000-000000000001',
   'Singular & Plural', 3, 15),

  ('bbbbbbbb-0000-0000-0000-000000000004',
   'aaaaaaaa-0000-0000-0000-000000000001',
   'Unit Checkpoint', 4, 20)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index;

-- Exercises for Lesson 1: Common Nouns
INSERT INTO exercises (id, lesson_id, type, question, correct_answer, options, order_index, grammar_rule_id)
VALUES
  (gen_random_uuid(),
   'bbbbbbbb-0000-0000-0000-000000000001',
   'multiple_choice',
   'Which of the following is a common noun?',
   'dog',
   '["dog", "London", "Monday", "Sarah"]',
   1, NULL),

  (gen_random_uuid(),
   'bbbbbbbb-0000-0000-0000-000000000001',
   'fill_blank',
   'The ___ is sitting on the mat.',
   'cat',
   NULL,
   2, NULL),

  (gen_random_uuid(),
   'bbbbbbbb-0000-0000-0000-000000000001',
   'multiple_choice',
   'Select the common noun: "The teacher read a book in the library."',
   'teacher',
   '["teacher", "read", "the", "in"]',
   3, NULL)
ON CONFLICT DO NOTHING;

-- Exercises for Lesson 2: Proper Nouns
INSERT INTO exercises (id, lesson_id, type, question, correct_answer, options, order_index, grammar_rule_id)
VALUES
  (gen_random_uuid(),
   'bbbbbbbb-0000-0000-0000-000000000002',
   'multiple_choice',
   'Which word is a proper noun?',
   'Paris',
   '["city", "Paris", "country", "river"]',
   1, NULL),

  (gen_random_uuid(),
   'bbbbbbbb-0000-0000-0000-000000000002',
   'fill_blank',
   '___ is the capital of France.',
   'Paris',
   NULL,
   2, NULL)
ON CONFLICT DO NOTHING;

-- Exercises for Lesson 3: Singular & Plural
INSERT INTO exercises (id, lesson_id, type, question, correct_answer, options, order_index, grammar_rule_id)
VALUES
  (gen_random_uuid(),
   'bbbbbbbb-0000-0000-0000-000000000003',
   'multiple_choice',
   'What is the plural of "child"?',
   'children',
   '["childs", "children", "childes", "child"]',
   1, NULL),

  (gen_random_uuid(),
   'bbbbbbbb-0000-0000-0000-000000000003',
   'word_order',
   'Arrange: the / children / playing / are / in the park',
   'the children are playing in the park',
   '["the", "children", "are", "playing", "in the park"]',
   2, NULL),

  (gen_random_uuid(),
   'bbbbbbbb-0000-0000-0000-000000000003',
   'fill_blank',
   'There are three ___ (box) on the table.',
   'boxes',
   NULL,
   3, NULL)
ON CONFLICT DO NOTHING;

-- ============================================
-- DONE! Verify with:
--   SELECT count(*) FROM grammar_rules;
--   SELECT count(*) FROM units;
--   SELECT count(*) FROM lessons;
--   SELECT count(*) FROM exercises;
--   SELECT count(*) FROM profiles;
-- ============================================
