"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/client";
import { getLevelInfo } from "@/lib/api/gamification";

export default function EditProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [totalXp, setTotalXp] = useState(0);
    const [currentLevel, setCurrentLevel] = useState("");
    const [memberSince, setMemberSince] = useState("");

    useEffect(() => {
        async function fetchProfile() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setEmail(user.email || "");

            const { data: profile } = await supabase
                .from("profiles")
                .select("display_name, total_xp, current_level, created_at")
                .eq("id", user.id)
                .single();

            if (profile) {
                setDisplayName(profile.display_name || "");
                setTotalXp(profile.total_xp || 0);
                setCurrentLevel(profile.current_level || "A1");
                setMemberSince(
                    new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                );
            }
            setLoading(false);
        }
        fetchProfile();
    }, []);

    async function handleSave() {
        setSaving(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
            .from("profiles")
            .update({ display_name: displayName })
            .eq("id", user.id);

        setSaving(false);
        router.push("/profile");
    }

    const levelInfo = getLevelInfo(totalXp);
    const levelLabels: Record<string, string> = {
        A1: "Beginner", A2: "Elementary", B1: "Intermediate",
        B2: "Upper Intermediate", C1: "Advanced", C2: "Proficiency",
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-[#3C83F6] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1A1C1E] dark:text-white">Edit Profile</h1>
                <p className="text-[#75777F] mt-1">Configure your digital learning identity and account settings.</p>
            </div>

            <div className="grid md:grid-cols-[300px_1fr] gap-6">
                {/* Left: Avatar Card */}
                <div className="bg-white dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039] rounded-2xl p-6 text-center h-fit">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#3C83F6] to-[#6277A4] flex items-center justify-center text-4xl text-white font-bold border-4 border-[#3C83F6]/30">
                            {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div className="absolute bottom-1 right-1 w-9 h-9 bg-[#3C83F6] rounded-full flex items-center justify-center border-3 border-white dark:border-[#1B1D24] cursor-pointer hover:bg-[#2B6FE0] transition-colors">
                            <span className="text-white text-sm">📷</span>
                        </div>
                    </div>
                    <h2 className="text-lg font-bold text-[#1A1C1E] dark:text-white">{displayName || "Student"}</h2>
                    <p className="text-xs text-[#75777F] mt-1">Joined {memberSince}</p>

                    <div className="mt-5">
                        <p className="text-[10px] font-bold text-[#75777F] uppercase tracking-wider mb-3">Quick Presets</p>
                        <div className="flex justify-center gap-3">
                            {["🧑‍💻", "🎓", "🌍"].map((emoji, i) => (
                                <div
                                    key={i}
                                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#3C83F6]/20 to-[#6277A4]/20 dark:from-[#3C83F6]/10 dark:to-[#6277A4]/10 flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform border border-[#D4D6DB] dark:border-[#2E3039]"
                                >
                                    {emoji}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039] rounded-2xl p-6 space-y-5">
                        {/* Username */}
                        <div>
                            <label className="text-xs font-bold text-[#75777F] uppercase tracking-wider mb-2 block">Username</label>
                            <div className="flex items-center gap-3 bg-[#F0F2F5] dark:bg-[#0B1525] border border-[#D4D6DB] dark:border-[#2E3039] rounded-xl px-4 py-3">
                                <span className="text-[#75777F]">@</span>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="flex-1 bg-transparent text-[#1A1C1E] dark:text-white outline-none text-sm"
                                    placeholder="Your display name"
                                />
                            </div>
                            <p className="text-xs text-[#75777F] mt-1.5">This is your public identifier within Lingua.</p>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-xs font-bold text-[#75777F] uppercase tracking-wider mb-2 block">Email Address</label>
                            <div className="flex items-center gap-3 bg-[#F0F2F5] dark:bg-[#0B1525] border border-[#D4D6DB] dark:border-[#2E3039] rounded-xl px-4 py-3">
                                <span className="text-[#75777F]">✉️</span>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="flex-1 bg-transparent text-[#75777F] outline-none text-sm cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="text-xs font-bold text-[#75777F] uppercase tracking-wider mb-2 block">Student Biography</label>
                            <div className="flex gap-3 bg-[#F0F2F5] dark:bg-[#0B1525] border border-[#D4D6DB] dark:border-[#2E3039] rounded-xl px-4 py-3">
                                <span className="text-[#75777F] mt-0.5">📝</span>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={3}
                                    className="flex-1 bg-transparent text-[#1A1C1E] dark:text-white outline-none text-sm resize-none"
                                    placeholder="Passionate about linguistics and software engineering. Currently mastering React and Japanese syntax. 🚀"
                                />
                            </div>
                        </div>

                        {/* Learning Stats (Read Only) */}
                        <div>
                            <label className="text-xs font-bold text-[#75777F] uppercase tracking-wider mb-3 block">Learning Stats (Read Only)</label>
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-2 border border-[#3C83F6]/30 dark:border-[#3C83F6]/20 rounded-full text-sm font-medium text-[#3C83F6]">
                                    LEVEL <span className="font-bold">{levelInfo.level}</span>
                                </span>
                                <span className="px-4 py-2 border border-[#D4D6DB] dark:border-[#2E3039] rounded-full text-sm font-medium text-[#1A1C1E] dark:text-white">
                                    RANK <span className="font-bold">{levelLabels[levelInfo.level] || "Scholar"}</span>
                                </span>
                                <span className="px-4 py-2 border border-[#D4D6DB] dark:border-[#2E3039] rounded-full text-sm font-medium text-[#1A1C1E] dark:text-white">
                                    CERTIFIED <span className="font-bold">{currentLevel} English</span>
                                </span>
                            </div>
                        </div>

                        {/* Save / Cancel */}
                        <div className="flex gap-4 pt-2">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-8 py-3 bg-[#3C83F6] text-white rounded-xl font-semibold hover:bg-[#2B6FE0] transition-colors disabled:opacity-50 shadow-lg shadow-[#3C83F6]/20"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            <Link
                                href="/profile"
                                className="px-8 py-3 border border-[#D4D6DB] dark:border-[#2E3039] rounded-xl font-medium text-[#1A1C1E] dark:text-white hover:bg-[#F0F2F5] dark:hover:bg-[#2A2D35] text-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>

                    {/* Bottom cards: Security + Notifications */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039] rounded-2xl p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#3C83F6]/10 flex items-center justify-center">
                                    <span className="text-[#3C83F6]">🔒</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-[#1A1C1E] dark:text-white">Account Security</h3>
                                    <p className="text-xs text-[#75777F] mt-1 leading-relaxed">Manage passwords and 2FA authentication.</p>
                                    <span className="text-xs font-bold text-[#3C83F6] mt-2 inline-block cursor-pointer hover:underline">Update Security</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039] rounded-2xl p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#3C83F6]/10 flex items-center justify-center">
                                    <span className="text-[#3C83F6]">🔔</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-[#1A1C1E] dark:text-white">Notifications</h3>
                                    <p className="text-xs text-[#75777F] mt-1 leading-relaxed">Configure study reminders and notification types.</p>
                                    <span className="text-xs font-bold text-[#3C83F6] mt-2 inline-block cursor-pointer hover:underline">Manage Alerts</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-2xl p-5 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-sm text-red-600 dark:text-red-400">Danger Zone</h3>
                            <p className="text-xs text-[#75777F] mt-0.5">Permanently delete your account and all learning data.</p>
                        </div>
                        <button className="text-xs font-bold text-red-500 hover:underline whitespace-nowrap">Delete Account</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
