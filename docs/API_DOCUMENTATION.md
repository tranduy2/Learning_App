# Lingua API & Supabase Documentation

## Overview

Lingua is a Next.js 15 app using **Supabase** as its backend (PostgreSQL + Auth + RLS). There are no custom REST API routes — all data access is via the **Supabase JS Client** directly from client/server components.

---

## Authentication

| Method | Function | Description |
|--------|----------|-------------|
| Email/Password | `supabase.auth.signInWithPassword()` | Login with email & password |
| Email/Password | `supabase.auth.signUp()` | Register new user |
| OAuth | `supabase.auth.signInWithOAuth({ provider: 'google' })` | Google OAuth login |
| Session | `supabase.auth.getUser()` | Get current authenticated user |
| Logout | `supabase.auth.signOut()` | End user session |

### Auth Flow
1. User signs up → Supabase creates auth user + triggers profile creation
2. JWT stored in cookies via `@supabase/ssr`
3. Middleware (`middleware.ts`) refreshes session on each request

---

## Database Tables

### `profiles`
User profile data, linked to `auth.users`.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK, FK → auth.users) | User ID |
| `display_name` | text | Display name |
| `total_xp` | integer | Accumulated XP |
| `current_streak` | integer | Consecutive active days |
| `current_level` | text | CEFR level (A1-C2) |
| `last_active_date` | date | Last day user earned XP |
| `created_at` | timestamp | Account creation date |

### `units`
Learning units (groups of lessons).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Unit ID |
| `title` | text | Unit title |
| `description` | text | Short description |
| `cefr_level` | text | CEFR level (A1-C2) |
| `order_index` | integer | Display order |
| `is_published` | boolean | Visibility flag |

### `lessons`
Individual lessons within units.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Lesson ID |
| `unit_id` | uuid (FK → units) | Parent unit |
| `title` | text | Lesson title |
| `order_index` | integer | Display order within unit |
| `xp_reward` | integer | XP earned on completion |

### `exercises`
Questions within lessons.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Exercise ID |
| `lesson_id` | uuid (FK → lessons) | Parent lesson |
| `type` | text | `multiple_choice`, `fill_blank`, `word_order` |
| `question` | text | Question text |
| `correct_answer` | text | Expected answer |
| `options` | jsonb | Array of choices (for MC) |
| `order_index` | integer | Display order |
| `grammar_rule_id` | uuid (FK → grammar_rules) | Linked rule (nullable) |

### `grammar_rules`
Grammar rules for feedback engine.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Rule ID |
| `title` | text | Rule name |
| `category` | text | Category (e.g., verb_tense, articles) |
| `explanation` | text | Full explanation |
| `example_correct` | text | Correct sentence example |
| `example_incorrect` | text | Incorrect sentence example |
| `cefr_level` | text | Difficulty level |

### `user_weaknesses`
Error tracking per user per grammar rule.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Record ID |
| `user_id` | uuid (FK → profiles) | User who made errors |
| `grammar_rule_id` | uuid (FK → grammar_rules) | Rule with errors |
| `error_count` | integer | Number of times wrong |
| `last_tested_at` | timestamp | Last error occurrence |

---

## Key Client-Side Data Operations

### Fetching Units & Lessons
```typescript
// app/(main)/learn/page.tsx
const { data } = await supabase
  .from("units")
  .select("id, title, description, cefr_level, order_index, lessons(id, title, order_index, xp_reward)")
  .eq("is_published", true)
  .order("order_index");
```

### Fetching Exercises for a Lesson
```typescript
// app/lesson/[lessonId]/page.tsx
const { data } = await supabase
  .from("exercises")
  .select("*, grammar_rules(*)")
  .eq("lesson_id", lessonId)
  .order("order_index");
```

### Saving XP on Lesson Completion
```typescript
// lib/api/gamification.ts → saveXpToProfile(userId, xpEarned)
const { data } = await supabase
  .from("profiles")
  .select("total_xp, current_streak, last_active_date")
  .eq("id", userId)
  .single();
// Calculates new streak, level, then updates profile
```

### Logging User Weakness
```typescript
// lib/api/weakness-tracker.ts → logUserWeakness(userId, ruleId)
await supabase.from("user_weaknesses").upsert({
  user_id: userId,
  grammar_rule_id: ruleId,
  error_count: existing + 1,
  last_tested_at: new Date().toISOString(),
});
```

---

## RLS Policies Summary

| Table | Policy | Description |
|-------|--------|-------------|
| `profiles` | Users can read/update own profile | `auth.uid() = id` |
| `units` | Public read if `is_published = true` | All authenticated users |
| `lessons` | Public read | All authenticated users |
| `exercises` | Public read | All authenticated users |
| `grammar_rules` | Public read | All authenticated users |
| `user_weaknesses` | Users can read/write own records | `auth.uid() = user_id` |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
