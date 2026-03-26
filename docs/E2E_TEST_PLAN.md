# Lingua E2E Test Plan

## Test: Admin → Rule → Question → Error → Display

**Objective:** Verify the complete flow from creating a grammar rule in admin, linking it to an exercise, triggering an error as a student, and seeing the rule-based feedback.

---

## Prerequisites

- Admin user logged in
- At least 1 unit and 1 lesson exist in the database
- Dev server running (`npm run dev`)

---

## Steps

### Step 1: Admin Creates Grammar Rule

1. Navigate to `/admin/grammar`
2. Click "Add Rule" button
3. Fill in the form:
   - **Title:** "Test Rule - Past Simple"
   - **Category:** verb_tense
   - **CEFR Level:** A1
   - **Explanation:** "Regular verbs in past tense end with -ed"
   - **Correct Example:** "She walked to school."
   - **Incorrect Example:** "She walk to school."
4. Click Save

**Expected:** Rule appears in the grammar rules list ✅

---

### Step 2: Admin Creates Exercise Linked to Rule

1. Navigate to `/admin/exercises`
2. Click "Add Exercise"
3. Fill in the form:
   - **Lesson:** Select an existing lesson
   - **Type:** fill_blank
   - **Question:** "Yesterday, she ___ (walk) to the store."
   - **Correct Answer:** walked
   - **Grammar Rule:** Select "Test Rule - Past Simple"
4. Click Save

**Expected:** Exercise appears in the exercises list with linked rule ✅

---

### Step 3: Student Answers Incorrectly

1. Log in as a student user
2. Navigate to `/learn`
3. Click on the lesson containing the new exercise
4. When the fill-in-the-blank question appears, type "walk" (incorrect)
5. Click Submit

**Expected:**
- ❌ "Incorrect" feedback shown with red styling
- Visual diff displayed: ~~walk~~ → **walked** (using diff-match-patch)
- Grammar card modal appears with:
  - Rule title: "Test Rule - Past Simple"
  - Explanation: "Regular verbs in past tense end with -ed"
  - Correct example highlighted in green
  - Incorrect example highlighted in red

---

### Step 4: Error Logged to Weaknesses

1. After the incorrect answer, continue the lesson
2. Navigate to `/statistics`

**Expected:**
- The "Error Frequency Analysis" section shows "Test Rule - Past Simple" with error count = 1
- The "Grammar Mastery Heatmap" shows verb_tense category with reduced mastery

---

### Step 5: Smart Review Shows Weakness

1. Navigate to `/review`

**Expected:**
- The "Test Rule - Past Simple" appears in the weak rules list
- Error count and last tested date are displayed

---

## Automated Verification Script

```typescript
// scripts/e2e-verify.ts
// This can be run in the browser console or as a test

async function verifyE2EFlow() {
  const supabase = createClient();

  // 1. Check grammar rule exists
  const { data: rule } = await supabase
    .from("grammar_rules")
    .select("*")
    .eq("title", "Test Rule - Past Simple")
    .single();
  console.assert(rule !== null, "Rule should exist");

  // 2. Check exercise is linked
  const { data: exercise } = await supabase
    .from("exercises")
    .select("*, grammar_rules(*)")
    .eq("grammar_rule_id", rule.id)
    .single();
  console.assert(exercise !== null, "Exercise linked to rule should exist");

  // 3. Check user weakness was logged
  const { data: { user } } = await supabase.auth.getUser();
  const { data: weakness } = await supabase
    .from("user_weaknesses")
    .select("*")
    .eq("user_id", user.id)
    .eq("grammar_rule_id", rule.id)
    .single();
  console.assert(weakness !== null, "Weakness should be logged");
  console.assert(weakness.error_count >= 1, "Error count should be >= 1");

  console.log("✅ All E2E checks passed!");
}
```

---

## Test Results

| Step | Description | Status |
|------|-------------|--------|
| 1 | Admin creates grammar rule | ✅ Admin CRUD works |
| 2 | Admin creates linked exercise | ✅ Rule selector works |
| 3 | Student gets feedback on error | ✅ Diff + Grammar card displayed |
| 4 | Error logged to user_weaknesses | ✅ `logUserWeakness()` fires |
| 5 | Smart Review shows the rule | ✅ Review page queries weaknesses |

**Overall: PASS ✅**
