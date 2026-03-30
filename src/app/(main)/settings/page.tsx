"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";

export default function SettingsPage() {
    const router = useRouter();
    const [dailyGoal, setDailyGoal] = useState("Regular");
    const [soundEffects, setSoundEffects] = useState(true);
    const [hapticFeedback, setHapticFeedback] = useState(false);
    const [emailReminders, setEmailReminders] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [twoFactor, setTwoFactor] = useState(false);

    async function handleLogout() {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    }

    const goals = ["Casual", "Regular", "Serious"];

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1A1C1E] dark:text-white">Account Settings</h1>
                <p className="text-[#75777F] mt-1">
                    Manage your cognitive architecture, visual preferences, and security protocols to optimize your learning flow.
                </p>
            </div>

            <div className="grid md:grid-cols-[1fr_320px] gap-6">
                {/* LEFT COLUMN */}
                <div className="space-y-6">
                    {/* Learning Preferences */}
                    <div className="bg-white dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039] rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-[#3C83F6]">⚙️</span>
                            <h2 className="text-xl font-bold text-[#1A1C1E] dark:text-white">Learning Preferences</h2>
                        </div>

                        {/* Daily Goal */}
                        <div className="mb-6">
                            <label className="text-xs font-bold text-[#3C83F6] uppercase tracking-wider mb-3 block">Daily Goal</label>
                            <div className="flex gap-2">
                                {goals.map((goal) => (
                                    <button
                                        key={goal}
                                        onClick={() => setDailyGoal(goal)}
                                        className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${
                                            dailyGoal === goal
                                                ? "bg-[#3C83F6] text-white shadow-md shadow-[#3C83F6]/20"
                                                : "border border-[#D4D6DB] dark:border-[#2E3039] text-[#75777F] hover:border-[#3C83F6] hover:text-[#3C83F6]"
                                        }`}
                                    >
                                        {goal}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sound Effects */}
                        <div className="flex items-center justify-between py-4 border-t border-[#D4D6DB]/50 dark:border-[#2E3039]/50">
                            <div>
                                <p className="font-semibold text-sm text-[#1A1C1E] dark:text-white">Sound Effects</p>
                                <p className="text-xs text-[#75777F]">Auditory feedback for correct syntax logic</p>
                            </div>
                            <Toggle label="Sound Effects" value={soundEffects} onChange={setSoundEffects} />
                        </div>

                        {/* Haptic Feedback */}
                        <div className="flex items-center justify-between py-4 border-t border-[#D4D6DB]/50 dark:border-[#2E3039]/50">
                            <div>
                                <p className="font-semibold text-sm text-[#1A1C1E] dark:text-white">Haptic Feedback</p>
                                <p className="text-xs text-[#75777F]">Tactile response on mobile interactions</p>
                            </div>
                            <Toggle label="Haptic Feedback" value={hapticFeedback} onChange={setHapticFeedback} />
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039] rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-[#3C83F6]">🔒</span>
                            <h2 className="text-xl font-bold text-[#1A1C1E] dark:text-white">Security</h2>
                        </div>

                        {/* Password */}
                        <div className="flex items-center justify-between py-4">
                            <div>
                                <p className="font-semibold text-sm text-[#1A1C1E] dark:text-white">Password</p>
                                <p className="text-xs text-[#75777F]">Last changed 3 months ago</p>
                            </div>
                            <button className="px-5 py-2 border border-[#3C83F6] text-[#3C83F6] rounded-full text-sm font-medium hover:bg-[#3C83F6]/5 transition-colors">
                                Change Password
                            </button>
                        </div>

                        {/* 2FA */}
                        <div className="flex items-center justify-between py-4 border-t border-[#D4D6DB]/50 dark:border-[#2E3039]/50">
                            <div>
                                <p className="font-semibold text-sm text-[#1A1C1E] dark:text-white">Two-Factor Authentication</p>
                                <p className="text-xs text-[#75777F]">Add an extra layer of logic security</p>
                            </div>
                            <Toggle label="Two-Factor Authentication" value={twoFactor} onChange={setTwoFactor} />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                    {/* Notifications */}
                    <div className="bg-white dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039] rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <span className="text-[#3C83F6]">🔔</span>
                            <h2 className="text-lg font-bold text-[#1A1C1E] dark:text-white">Notifications</h2>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <span className="text-sm font-medium text-[#1A1C1E] dark:text-white">Email Reminders</span>
                            <Toggle label="Email Reminders" value={emailReminders} onChange={setEmailReminders} />
                        </div>
                        <div className="flex items-center justify-between py-3 border-t border-[#D4D6DB]/50 dark:border-[#2E3039]/50">
                            <span className="text-sm font-medium text-[#1A1C1E] dark:text-white">Push Notifications</span>
                            <Toggle label="Push Notifications" value={pushNotifications} onChange={setPushNotifications} />
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className="bg-white dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039] rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <span className="text-[#D06A00]">⚠️</span>
                            <h2 className="text-lg font-bold text-[#1A1C1E] dark:text-white">Account Actions</h2>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between px-4 py-3 border border-[#D4D6DB] dark:border-[#2E3039] rounded-xl mb-3 hover:bg-[#F0F2F5] dark:hover:bg-[#2A2D35] transition-colors"
                        >
                            <span className="text-sm font-medium text-[#1A1C1E] dark:text-white">Log Out</span>
                            <span className="text-[#75777F]">🚪</span>
                        </button>

                        <button className="w-full flex items-center justify-between px-4 py-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                            <span className="text-sm font-bold text-red-500">Delete Account</span>
                            <span className="text-red-500">❌</span>
                        </button>

                        <p className="text-[10px] font-bold text-[#75777F] uppercase tracking-wider mt-3 text-center">
                            Warning: Action is non-reversible
                        </p>
                    </div>

                    {/* Weekly Tip */}
                    <div className="bg-gradient-to-br from-[#3C83F6]/10 to-[#6277A4]/10 dark:from-[#3C83F6]/5 dark:to-[#6277A4]/5 border border-[#3C83F6]/20 rounded-2xl p-5">
                        <p className="text-[10px] font-bold text-[#3C83F6] uppercase tracking-wider mb-2">Weekly Tip</p>
                        <p className="text-sm text-[#1A1C1E] dark:text-gray-200 leading-relaxed">
                            Consistent daily goals increase retention by 40%.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* Toggle Component */
function Toggle({
    label,
    value,
    onChange,
}: {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <button
            onClick={() => onChange(!value)}
            title={`Toggle ${label}`}
            aria-label={`Toggle ${label}`}
            className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                value ? "bg-[#3C83F6]" : "bg-[#D4D6DB] dark:bg-[#2E3039]"
            }`}
        >
            <div
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    value ? "translate-x-5" : "translate-x-0.5"
                }`}
            />
        </button>
    );
}
