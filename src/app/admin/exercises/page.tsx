"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/client";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { AIExerciseGenerator } from "@/components/admin/ai-exercise-generator";

interface Exercise {
    id: string;
    lesson_id: string;
    type: string;
    question: string;
    correct_answer: string;
    grammar_rule_id: string | null;
}

interface GrammarRule {
    id: string;
    title: string;
}

interface Lesson {
    id: string;
    title: string;
}

export default function ExercisesPage() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [grammarRules, setGrammarRules] = useState<GrammarRule[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

    // Form state
    const [lessonId, setLessonId] = useState("");
    const [type, setType] = useState("multiple_choice");
    const [question, setQuestion] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [grammarRuleId, setGrammarRuleId] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        const supabase = createClient();

        const [exercisesRes, rulesRes, lessonsRes] = await Promise.all([
            supabase.from("exercises").select("*").order("created_at", { ascending: false }).limit(50),
            supabase.from("grammar_rules").select("id, title"),
            supabase.from("lessons").select("id, title"),
        ]);

        setExercises(exercisesRes.data || []);
        setGrammarRules(rulesRes.data || []);
        setLessons(lessonsRes.data || []);
        setLoading(false);
    }

    function openCreateForm() {
        setEditingExercise(null);
        setLessonId("");
        setType("multiple_choice");
        setQuestion("");
        setCorrectAnswer("");
        setGrammarRuleId("");
        setShowForm(true);
    }

    function openEditForm(exercise: Exercise) {
        setEditingExercise(exercise);
        setLessonId(exercise.lesson_id);
        setType(exercise.type);
        setQuestion(exercise.question);
        setCorrectAnswer(exercise.correct_answer);
        setGrammarRuleId(exercise.grammar_rule_id || "");
        setShowForm(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const supabase = createClient();

        const data = {
            lesson_id: lessonId || null,
            type,
            question,
            correct_answer: correctAnswer,
            grammar_rule_id: grammarRuleId || null,
        };

        if (editingExercise) {
            await supabase.from("exercises").update(data).eq("id", editingExercise.id);
        } else {
            await supabase.from("exercises").insert({ ...data, order_index: 1 });
        }

        setSaving(false);
        setShowForm(false);
        loadData();
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this exercise?")) return;
        const supabase = createClient();
        await supabase.from("exercises").delete().eq("id", id);
        loadData();
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Exercises</h1>
                <div className="flex items-center gap-3">
                    <AIExerciseGenerator onSaved={loadData} lessons={lessons} />
                    <button
                        onClick={openCreateForm}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        Add Exercise
                    </button>
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="w-full max-w-lg bg-card border border-border rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingExercise ? "Edit Exercise" : "Add Exercise"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Lesson</label>
                                <select
                                    value={lessonId}
                                    onChange={(e) => setLessonId(e.target.value)}
                                    title="Select a lesson for this exercise"
                                    className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                                >
                                    <option value="">Select lesson...</option>
                                    {lessons.map((lesson) => (
                                        <option key={lesson.id} value={lesson.id}>
                                            {lesson.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        title="Select exercise type"
                                        className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                                    >
                                        <option value="multiple_choice">Multiple Choice</option>
                                        <option value="fill_blank">Fill in the Blank</option>
                                        <option value="word_order">Word Order</option>
                                        <option value="translation">Translation</option>
                                        <option value="listening">Listening</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Grammar Rule</label>
                                    <select
                                        value={grammarRuleId}
                                        onChange={(e) => setGrammarRuleId(e.target.value)}
                                        title="Select grammar rule or leave empty for none"
                                        className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                                    >
                                        <option value="">None</option>
                                        {grammarRules.map((rule) => (
                                            <option key={rule.id} value={rule.id}>
                                                {rule.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Question</label>
                                <textarea
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    required
                                    rows={2}
                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background resize-none"
                                    placeholder="Enter the question..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Correct Answer</label>
                                <input
                                    type="text"
                                    value={correctAnswer}
                                    onChange={(e) => setCorrectAnswer(e.target.value)}
                                    required
                                    className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 h-10 border border-border rounded-lg hover:bg-muted"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 h-10 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : editingExercise ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Exercises List */}
            {exercises.length === 0 ? (
                <div className="text-center py-12 bg-card border border-border rounded-xl">
                    <p className="text-muted-foreground">No exercises yet. Add your first one!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {exercises.map((exercise) => (
                        <div key={exercise.id} className="p-4 bg-card border border-border rounded-xl">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 text-xs bg-muted text-foreground rounded">
                                            {exercise.type}
                                        </span>
                                        {exercise.grammar_rule_id && (
                                            <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                                                Has Rule
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium">{exercise.question}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Answer: {exercise.correct_answer}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => openEditForm(exercise)} className="p-2 rounded-lg hover:bg-muted" title="Edit exercise">
                                        <Pencil className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                    <button onClick={() => handleDelete(exercise.id)} className="p-2 rounded-lg hover:bg-muted" title="Delete exercise">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
