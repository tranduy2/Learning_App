"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/client";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface GrammarRule {
    id: string;
    title: string;
    explanation: string;
    examples: string[];
    cefr_level: string;
    category: string;
}

export default function GrammarRulesPage() {
    const [rules, setRules] = useState<GrammarRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingRule, setEditingRule] = useState<GrammarRule | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [explanation, setExplanation] = useState("");
    const [examples, setExamples] = useState("");
    const [cefrLevel, setCefrLevel] = useState("A1");
    const [category, setCategory] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadRules();
    }, []);

    async function loadRules() {
        const supabase = createClient();
        const { data } = await supabase
            .from("grammar_rules")
            .select("*")
            .order("created_at", { ascending: false });

        setRules(data || []);
        setLoading(false);
    }

    function openCreateForm() {
        setEditingRule(null);
        setTitle("");
        setExplanation("");
        setExamples("");
        setCefrLevel("A1");
        setCategory("");
        setShowForm(true);
    }

    function openEditForm(rule: GrammarRule) {
        setEditingRule(rule);
        setTitle(rule.title);
        setExplanation(rule.explanation);
        setExamples(rule.examples.join("\n"));
        setCefrLevel(rule.cefr_level);
        setCategory(rule.category);
        setShowForm(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const supabase = createClient();
        const examplesArray = examples.split("\n").filter((ex) => ex.trim());

        if (editingRule) {
            // Update
            await supabase
                .from("grammar_rules")
                .update({
                    title,
                    explanation,
                    examples: examplesArray,
                    cefr_level: cefrLevel,
                    category,
                })
                .eq("id", editingRule.id);
        } else {
            // Create
            await supabase.from("grammar_rules").insert({
                title,
                explanation,
                examples: examplesArray,
                cefr_level: cefrLevel,
                category,
            });
        }

        setSaving(false);
        setShowForm(false);
        loadRules();
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this grammar rule?")) return;

        const supabase = createClient();
        await supabase.from("grammar_rules").delete().eq("id", id);
        loadRules();
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
                <h1 className="text-2xl font-bold">Grammar Rules</h1>
                <button
                    onClick={openCreateForm}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                    <Plus className="h-4 w-4" />
                    Add Rule
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="w-full max-w-lg bg-card border border-border rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingRule ? "Edit Rule" : "Add New Rule"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                                    placeholder="e.g. Present Simple Tense"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">CEFR Level</label>
                                    <select
                                        value={cefrLevel}
                                        onChange={(e) => setCefrLevel(e.target.value)}
                                        className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                                    >
                                        <option value="A1">A1</option>
                                        <option value="A2">A2</option>
                                        <option value="B1">B1</option>
                                        <option value="B2">B2</option>
                                        <option value="C1">C1</option>
                                        <option value="C2">C2</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                                        placeholder="e.g. tense, articles"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Explanation</label>
                                <textarea
                                    value={explanation}
                                    onChange={(e) => setExplanation(e.target.value)}
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background resize-none"
                                    placeholder="Explain the grammar rule..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Examples (one per line)</label>
                                <textarea
                                    value={examples}
                                    onChange={(e) => setExamples(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background resize-none"
                                    placeholder="She works every day.&#10;He plays football."
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
                                    {saving ? "Saving..." : editingRule ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Rules List */}
            {rules.length === 0 ? (
                <div className="text-center py-12 bg-card border border-border rounded-xl">
                    <p className="text-muted-foreground">No grammar rules yet. Add your first one!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {rules.map((rule) => (
                        <div key={rule.id} className="p-4 bg-card border border-border rounded-xl">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-medium">{rule.title}</h3>
                                        <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                                            {rule.cefr_level}
                                        </span>
                                        {rule.category && (
                                            <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded">
                                                {rule.category}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {rule.explanation}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => openEditForm(rule)}
                                        className="p-2 rounded-lg hover:bg-muted"
                                    >
                                        <Pencil className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(rule.id)}
                                        className="p-2 rounded-lg hover:bg-muted"
                                    >
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
