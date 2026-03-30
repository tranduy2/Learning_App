"use client";

import { useState } from "react";
import { Wand2, Loader2, Save, X } from "lucide-react";
import { createClient } from "@/lib/client";

interface GeneratedExercise {
    type: string;
    question: string;
    correct_answer: string;
    options?: string[];
    explanation?: string;
    hint?: string;
    xp_reward?: number;
}

interface AIExerciseGeneratorProps {
    onSaved: () => void;
    lessons?: Array<{ id: string; title: string }>;
}

export function AIExerciseGenerator({ onSaved, lessons: initialLessons = [] }: AIExerciseGeneratorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [lessonId, setLessonId] = useState("");
    const [lessons, setLessons] = useState(initialLessons);
    const [topic, setTopic] = useState("");
    const [level, setLevel] = useState("A1");
    const [count, setCount] = useState(5);
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState<GeneratedExercise[] | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load lessons when modal opens if not provided
    const openModal = async () => {
        if (lessons.length === 0) {
            const supabase = createClient();
            const { data } = await supabase.from("lessons").select("id, title");
            if (data) setLessons(data);
        }
        setIsOpen(true);
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setGenerating(true);
        setError(null);
        setGenerated(null);

        try {
            const res = await fetch("/api/admin/generate-exercises", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topic: topic.trim() || "General English",
                    level,
                    count,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to generate exercises");
            }

            const data = await res.json();
            setGenerated(data.exercises);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!generated || generated.length === 0) return;

        setSaving(true);
        setError(null);

        try {
            const supabase = createClient();

            // Insert only widely-supported columns to avoid schema-cache mismatches.
            const baseExercises = generated.map((ex, idx) => ({
                lesson_id: lessonId,
                type: ex.type,
                question: ex.question,
                correct_answer: ex.correct_answer,
                options: ex.options ?? null,
                order_index: idx + 1,
            }));

            let { error: insertError } = await supabase
                .from("exercises")
                .insert(baseExercises);

            const isRlsError =
                insertError &&
                (insertError as { code?: string; message?: string }).code === "42501";

            // Fallback for older schemas that may not have `options` yet.
            if (insertError && !isRlsError) {
                const noOptionsExercises = generated.map((ex, idx) => ({
                    lesson_id: lessonId,
                    type: ex.type,
                    question: ex.question,
                    correct_answer: ex.correct_answer,
                    order_index: idx + 1,
                }));

                const retry = await supabase.from("exercises").insert(noOptionsExercises);
                insertError = retry.error;
            }

            if (isRlsError) {
                throw new Error("RLS policy is blocking insert into exercises. Please add INSERT policy for admin users.");
            }

            if (insertError) throw insertError;

            setGenerated(null);
            setTopic("");
            setLevel("A1");
            setCount(5);
            setLessonId("");
            setIsOpen(false);
            onSaved();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save exercises");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <button
                onClick={openModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
                <Wand2 className="w-4 h-4" />
                AI Generate
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-[#1B1D24] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generate Exercises with AI</h2>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setGenerated(null);
                                    setError(null);
                                }}
                                title="Close modal"
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {!generated ? (
                            /* Generation Form */
                            <form onSubmit={handleGenerate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-2">
                                        Select Lesson *
                                    </label>
                                    <select
                                        value={lessonId}
                                        onChange={(e) => setLessonId(e.target.value)}
                                        required
                                        title="Select a lesson for the exercises"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#0F1729] dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                    >
                                        <option value="">-- Choose a lesson --</option>
                                        {lessons.map((lesson: any) => (
                                            <option key={lesson.id} value={lesson.id}>
                                                {lesson.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-2">
                                        Topic
                                    </label>
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g., Airport travel, Daily routines..."
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#0F1729] dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-2">
                                            CEFR Level
                                        </label>
                                        <select
                                            value={level}
                                            onChange={(e) => setLevel(e.target.value)}
                                            title="Select CEFR proficiency level"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#0F1729] dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                        >
                                            {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
                                                <option key={lvl} value={lvl}>
                                                    {lvl}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-2">
                                            Number of Questions
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={count}
                                            onChange={(e) => setCount(Math.min(Math.max(parseInt(e.target.value) || 1, 1), 10))}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#0F1729] dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={generating || !lessonId}
                                    className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                    {generating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="w-4 h-4" />
                                            Generate Exercises
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            /* Preview & Save */
                            <div className="space-y-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        Generated {generated.length} exercises for &quot;{topic}&quot; at level {level}
                                    </p>
                                </div>

                                {/* Exercise List Preview */}
                                <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                                    {generated.map((ex, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 bg-gray-50 dark:bg-[#0F1729] border border-gray-200 dark:border-gray-700 rounded-lg"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full font-semibold text-sm">
                                                    {idx + 1}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                                        <span className="inline-block px-2 py-0.5 text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded mr-2">
                                                            {ex.type}
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-gray-900 dark:text-white font-medium mb-2">
                                                        {ex.question}
                                                    </p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                        <strong>Answer:</strong> {ex.correct_answer}
                                                    </p>
                                                    {ex.options && ex.options.length > 0 && (
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                            <strong>Options:</strong> {ex.options.join(", ")}
                                                        </p>
                                                    )}
                                                    {ex.explanation && (
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                            <strong>Explanation:</strong> {ex.explanation}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => {
                                            setGenerated(null);
                                            setError(null);
                                        }}
                                        className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                                    >
                                        Generate Again
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Save {generated.length} Exercises
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
