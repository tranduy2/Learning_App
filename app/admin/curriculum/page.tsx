"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/client";
import { Plus, Pencil, Trash2, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface Unit {
    id: string;
    title: string;
    description: string;
    cefr_level: string;
    order_index: number;
}

interface Lesson {
    id: string;
    unit_id: string;
    title: string;
    target_skill: string;
    order_index: number;
}

export default function CurriculumPage() {
    const [units, setUnits] = useState<Unit[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
    const [showUnitForm, setShowUnitForm] = useState(false);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

    // Unit form state
    const [unitTitle, setUnitTitle] = useState("");
    const [unitDescription, setUnitDescription] = useState("");
    const [unitCefrLevel, setUnitCefrLevel] = useState("A1");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        const supabase = createClient();
        const [unitsRes, lessonsRes] = await Promise.all([
            supabase.from("units").select("*").order("order_index"),
            supabase.from("lessons").select("*").order("order_index"),
        ]);
        setUnits(unitsRes.data || []);
        setLessons(lessonsRes.data || []);
        setLoading(false);
    }

    function openCreateUnitForm() {
        setEditingUnit(null);
        setUnitTitle("");
        setUnitDescription("");
        setUnitCefrLevel("A1");
        setShowUnitForm(true);
    }

    function openEditUnitForm(unit: Unit) {
        setEditingUnit(unit);
        setUnitTitle(unit.title);
        setUnitDescription(unit.description);
        setUnitCefrLevel(unit.cefr_level);
        setShowUnitForm(true);
    }

    async function handleUnitSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const supabase = createClient();

        if (editingUnit) {
            await supabase
                .from("units")
                .update({ title: unitTitle, description: unitDescription, cefr_level: unitCefrLevel })
                .eq("id", editingUnit.id);
        } else {
            await supabase.from("units").insert({
                title: unitTitle,
                description: unitDescription,
                cefr_level: unitCefrLevel,
                order_index: units.length + 1,
                is_published: true,
            });
        }

        setSaving(false);
        setShowUnitForm(false);
        loadData();
    }

    async function handleDeleteUnit(id: string) {
        if (!confirm("Delete this unit and all its lessons?")) return;
        const supabase = createClient();
        await supabase.from("units").delete().eq("id", id);
        loadData();
    }

    function getLessonsForUnit(unitId: string) {
        return lessons.filter((lesson) => lesson.unit_id === unitId);
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
                <h1 className="text-2xl font-bold">Curriculum</h1>
                <button
                    onClick={openCreateUnitForm}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                    <Plus className="h-4 w-4" />
                    Add Unit
                </button>
            </div>

            {/* Unit Form Modal */}
            {showUnitForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="w-full max-w-md bg-card border border-border rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingUnit ? "Edit Unit" : "Add Unit"}
                        </h2>
                        <form onSubmit={handleUnitSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    value={unitTitle}
                                    onChange={(e) => setUnitTitle(e.target.value)}
                                    required
                                    className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={unitDescription}
                                    onChange={(e) => setUnitDescription(e.target.value)}
                                    rows={2}
                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">CEFR Level</label>
                                <select
                                    value={unitCefrLevel}
                                    onChange={(e) => setUnitCefrLevel(e.target.value)}
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
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowUnitForm(false)}
                                    className="flex-1 h-10 border border-border rounded-lg hover:bg-muted"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 h-10 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : editingUnit ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Units List */}
            {units.length === 0 ? (
                <div className="text-center py-12 bg-card border border-border rounded-xl">
                    <p className="text-muted-foreground">No units yet. Add your first one!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {units.map((unit) => {
                        const unitLessons = getLessonsForUnit(unit.id);
                        const isExpanded = expandedUnit === unit.id;

                        return (
                            <div key={unit.id} className="bg-card border border-border rounded-xl overflow-hidden">
                                <div className="p-4 flex items-center justify-between">
                                    <button
                                        onClick={() => setExpandedUnit(isExpanded ? null : unit.id)}
                                        className="flex items-center gap-3 text-left flex-1"
                                    >
                                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{unit.title}</span>
                                                <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                                                    {unit.cefr_level}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {unitLessons.length} lessons
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                    <div className="flex gap-1">
                                        <button onClick={() => openEditUnitForm(unit)} className="p-2 rounded-lg hover:bg-muted">
                                            <Pencil className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                        <button onClick={() => handleDeleteUnit(unit.id)} className="p-2 rounded-lg hover:bg-muted">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </button>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="px-4 pb-4 border-t border-border pt-3">
                                        {unitLessons.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">No lessons in this unit.</p>
                                        ) : (
                                            <ul className="space-y-2">
                                                {unitLessons.map((lesson) => (
                                                    <li key={lesson.id} className="flex items-center gap-2 text-sm">
                                                        <span className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs">
                                                            {lesson.order_index}
                                                        </span>
                                                        <span>{lesson.title}</span>
                                                        <span className="px-2 py-0.5 text-xs bg-muted rounded">
                                                            {lesson.target_skill}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
