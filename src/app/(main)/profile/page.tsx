"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/client";
import Link from "next/link";
import { getLevelInfo } from "@/lib/api/gamification";

interface Profile {
    display_name: string;
    avatar_url?: string;
    total_xp: number;
    current_streak: number;
    current_level: string;
    created_at: string;
}

interface ProfileRow {
    display_name?: string;
    name?: string;
    avatar_url?: string;
    total_xp?: number;
    current_streak?: number;
    current_level?: string;
    created_at?: string;
}

interface Weakness {
    grammar_rule_id: string;
    error_count: number;
    grammar_rules: {
        title: string;
        category: string;
    };
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [weaknesses, setWeaknesses] = useState<Weakness[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();
            if (profileData) {
                const row = profileData as ProfileRow;
                setProfile({
                    display_name: row.display_name || row.name || "Student",
                    avatar_url: row.avatar_url || "",
                    total_xp: row.total_xp || 0,
                    current_streak: row.current_streak || 0,
                    current_level: row.current_level || "A1",
                    created_at: row.created_at || "",
                });
            }

            const { data: weakData } = await supabase
                .from("user_weaknesses")
                .select("grammar_rule_id, error_count")
                .eq("user_id", user.id)
                .order("error_count", { ascending: false })
                .limit(10);

            if (weakData && weakData.length > 0) {
                const grammarRuleIds = weakData
                    .map((w: any) => w.grammar_rule_id)
                    .filter(Boolean);

                const { data: grammarRulesData } = await supabase
                    .from("grammar_rules")
                    .select("id, title, category")
                    .in("id", grammarRuleIds);

                const grammarRuleMap = new Map(
                    (grammarRulesData || []).map((rule: any) => [rule.id, rule])
                );

                const mappedWeaknesses: Weakness[] = weakData.map((item: any) => {
                    const rule = grammarRuleMap.get(item.grammar_rule_id);

                    return {
                        grammar_rule_id: item.grammar_rule_id,
                        error_count: item.error_count,
                        grammar_rules: {
                            title: rule?.title || "Unknown Rule",
                            category: rule?.category || "General",
                        },
                    };
                });

                setWeaknesses(mappedWeaknesses);
            } else {
                setWeaknesses([]);
            }

            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-[#3C83F6] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const xp = profile?.total_xp || 0;
    const streak = profile?.current_streak || 0;
    const levelInfo = getLevelInfo(xp);
    const displayName = profile?.display_name || "Student";
    const memberSince = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "";

    const levelLabels: Record<string, string> = {
        A1: "Beginner", A2: "Elementary", B1: "Intermediate",
        B2: "Upper Intermediate", C1: "Advanced", C2: "Proficiency",
    };
    const levelLabel = levelLabels[levelInfo.level] || "Scholar";

    // Grammar categories mastery (mock data based on weaknesses)
    const categories = [
        { name: "Verb Tenses", mastery: 80, color: "#3C83F6" },
        { name: "Subject-Verb Agreement", mastery: 70, color: "#3C83F6" },
        { name: "Prepositions", mastery: 30, color: "#D06A00", warn: true },
        { name: "Articles (a, an, the)", mastery: 50, color: "#F59E0B" },
    ];

    // Weakness heatmap colors
    const heatmapColors = [
        "#3C83F6", "#3C83F6", "#3C83F6", "#6277A4", "#3C83F6", "#D06A00",
        "#3C83F6", "#3C83F6", "#D06A00", "#F59E0B", "#6277A4", "#6277A4",
        "#D06A00", "#F59E0B", "#6277A4", "#6277A4", "#6277A4", "#6277A4",
    ];

    const topWeakness = weaknesses[0];
    const overallMastery = Math.round(categories.reduce((sum, c) => sum + c.mastery, 0) / categories.length);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-[320px_1fr] gap-8">
                {/* LEFT COLUMN */}
                <div className="space-y-4">
                    {/* Profile Card */}
                    <div className="bg-white dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039] rounded-2xl p-6 text-center">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#3C83F6] to-[#6277A4] flex items-center justify-center text-3xl text-white font-bold overflow-hidden">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile avatar" className="w-full h-full object-cover" />
                                ) : (
                                    displayName.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-[#1B1D24]" />
                        </div>
                        <h2 className="text-xl font-bold text-[#1A1C1E] dark:text-white">{displayName}</h2>
                        <p className="text-sm text-[#3C83F6] font-medium">Level {levelInfo.level} {levelLabel}</p>
                        <p className="text-xs text-[#75777F] mt-1">Member since {memberSince}</p>
                        <div className="flex gap-3 mt-5 justify-center">
                            <Link href="/profile/edit" className="flex items-center gap-2 px-5 py-2 bg-[#1A1C1E] dark:bg-white text-white dark:text-[#1A1C1E] rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                                ✏️ Edit
                            </Link>
                            <Link href="/settings" className="flex items-center gap-2 px-5 py-2 border border-[#D4D6DB] dark:border-[#2E3039] rounded-full text-sm font-medium text-[#1A1C1E] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2A2D35] transition-colors">
                                ⚙️ Settings
                            </Link>
                        </div>
                    </div>

                    {/* Total XP Card */}
                    <div className="bg-white dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039] rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-4 right-4 text-[#3C83F6]/10 text-6xl">🏆</div>
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-yellow-500">⭐</span>
                                <span className="text-sm font-medium text-[#75777F]">Total XP</span>
                            </div>
                            <p className="text-4xl font-bold text-[#1A1C1E] dark:text-white mb-3">{xp.toLocaleString()}</p>
                            <div className="h-2 bg-[#E3E5E8] dark:bg-[#2A2D35] rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-[#3C83F6] rounded-full" style={{ width: `${levelInfo.progress}%` }} />
                            </div>
                            <p className="text-sm text-green-500 font-medium">+350 today</p>
                        </div>
                    </div>

                    {/* Current Streak Card */}
                    <div className="bg-white dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039] rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-4 right-4 text-[#D06A00]/10 text-6xl">🔥</div>
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-2">
                                <span>🔥</span>
                                <span className="text-sm font-medium text-[#75777F]">Current Streak</span>
                            </div>
                            <p className="text-4xl font-bold text-[#1A1C1E] dark:text-white mb-3">{streak} Days</p>
                            <div className="flex gap-1.5 mb-2">
                                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                                    <div
                                        key={d}
                                        className={`w-3 h-3 rounded-full ${d <= Math.min(streak, 7) ? "bg-[#D06A00]" : "bg-[#E3E5E8] dark:bg-[#2A2D35]"}`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-green-500 font-medium">Keep it up!</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-[#1A1C1E] dark:text-white mb-1">Grammar Proficiency Analysis</h1>
                        <p className="text-[#75777F]">Your personalized learning map based on recent performance.</p>
                    </div>

                    {/* Overall Mastery + Weakness Heatmap */}
                    <div className="grid md:grid-cols-[1fr_280px] gap-4">
                        {/* Overall Mastery */}
                        <div className="bg-white dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039] rounded-2xl p-6">
                            <p className="text-xs font-bold text-[#75777F] uppercase tracking-wider mb-3">Overall Mastery</p>
                            <div className="flex items-end gap-3 mb-6">
                                <span className="text-5xl font-bold text-[#1A1C1E] dark:text-white">{overallMastery}%</span>
                                <span className="text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-lg mb-1">
                                    📈 +5% this week
                                </span>
                            </div>

                            <div className="space-y-5">
                                {categories.map((cat) => (
                                    <div key={cat.name}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm font-medium text-[#1A1C1E] dark:text-gray-200">
                                                {cat.name}
                                                {cat.warn && <span className="text-[#D06A00] ml-1">⚠️</span>}
                                            </span>
                                            <span className="text-sm font-semibold" style={{ color: cat.color }}>{cat.mastery}%</span>
                                        </div>
                                        <div className="h-2.5 bg-[#E3E5E8] dark:bg-[#2A2D35] rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all" style={{ width: `${cat.mastery}%`, backgroundColor: cat.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weakness Heatmap + Focus Area */}
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039] rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-[#1A1C1E] dark:text-white">Weakness Heatmap</h3>
                                    <Link href="/statistics" className="text-xs font-bold text-[#3C83F6] hover:underline">View History</Link>
                                </div>
                                <div className="grid grid-cols-6 gap-2 mb-3">
                                    {heatmapColors.map((color, i) => (
                                        <div key={i} className="aspect-square rounded-lg cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: color }} />
                                    ))}
                                </div>
                                <p className="text-xs text-[#75777F] mb-2">Click to practice specific rule</p>
                                <div className="flex items-center gap-4 text-xs text-[#75777F]">
                                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#D06A00]" /> Weak</span>
                                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#3C83F6]" /> Strong</span>
                                </div>
                            </div>

                            {/* Focus Area */}
                            <div className="bg-[#D06A00]/5 dark:bg-[#D06A00]/10 border border-[#D06A00]/20 rounded-2xl p-5">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#D06A00] flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-white text-sm">🎯</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#1A1C1E] dark:text-white text-sm mb-1">
                                            Focus Area: {topWeakness ? topWeakness.grammar_rules?.title : "Prepositions"}
                                        </h4>
                                        <p className="text-xs text-[#75777F] leading-relaxed mb-2">
                                            {topWeakness
                                                ? `You've made ${topWeakness.error_count} errors. We recommend a focused session.`
                                                : `You've made 12 errors with "in" vs "on" this week. We recommend a focused session.`}
                                        </p>
                                        <Link href="/review" className="text-xs font-bold text-[#3C83F6] hover:underline">
                                            Start Practice Session →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-[#1A1C1E] dark:text-white">Recent Activity</h2>
                            <Link href="/statistics" className="text-sm font-bold text-[#3C83F6] hover:underline">View All</Link>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-4 bg-white dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039] rounded-2xl p-4">
                                <div className="w-11 h-11 rounded-xl bg-[#3C83F6]/10 dark:bg-[#3C83F6]/20 flex items-center justify-center">
                                    <span className="text-[#3C83F6]">📝</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-[#1A1C1E] dark:text-white text-sm">Mixed Tenses Quiz</p>
                                    <p className="text-xs text-[#75777F]">2 hours ago • 20 Questions</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-[#1A1C1E] dark:text-white text-sm">18/20</p>
                                    <p className="text-xs font-medium text-[#3C83F6]">+45 XP</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039] rounded-2xl p-4">
                                <div className="w-11 h-11 rounded-xl bg-[#3C83F6]/10 dark:bg-[#3C83F6]/20 flex items-center justify-center">
                                    <span className="text-[#3C83F6]">💬</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-[#1A1C1E] dark:text-white text-sm">Speaking: Daily Routine</p>
                                    <p className="text-xs text-[#75777F]">Yesterday • 5 Minutes</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-[#1A1C1E] dark:text-white text-sm">Good</p>
                                    <p className="text-xs font-medium text-[#3C83F6]">+20 XP</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
