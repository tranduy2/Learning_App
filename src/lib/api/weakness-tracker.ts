import { createClient } from "@/lib/client";

export async function logUserWeakness(
  userId: string,
  grammarRuleId: string,
  exerciseId: string
) {
  const supabase = createClient();

  // Check if weakness already exists
  const { data: existing } = await supabase
    .from("user_weaknesses")
    .select("id, error_count")
    .eq("user_id", userId)
    .eq("grammar_rule_id", grammarRuleId)
    .single();

  if (existing) {
    // Increment error count
    await supabase
      .from("user_weaknesses")
      .update({
        error_count: existing.error_count + 1,
        last_tested_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    // Insert new weakness
    await supabase.from("user_weaknesses").insert({
      user_id: userId,
      grammar_rule_id: grammarRuleId,
      exercise_id: exerciseId,
      error_count: 1,
      last_tested_at: new Date().toISOString(),
    });
  }
}
