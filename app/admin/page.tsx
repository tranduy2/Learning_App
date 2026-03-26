"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/client";

export default function AdminPage() {
    const [stats, setStats] = useState({ users: 0, exercises: 0, rules: 0 });

    useEffect(() => {
        async function fetchStats() {
            const supabase = createClient();
            const [{ count: userCount }, { count: exerciseCount }, { count: ruleCount }] = await Promise.all([
                supabase.from("profiles").select("*", { count: "exact", head: true }),
                supabase.from("exercises").select("*", { count: "exact", head: true }),
                supabase.from("grammar_rules").select("*", { count: "exact", head: true }),
            ]);
            setStats({
                users: userCount || 0,
                exercises: exerciseCount || 0,
                rules: ruleCount || 0,
            });
        }
        fetchStats();
    }, []);

    const statCards = [
        {
            label: "Total Users",
            value: stats.users.toLocaleString(),
            icon: "👥",
            change: "+5% since last month",
            changeColor: "text-green-500",
            iconBg: "bg-[#3C83F6]/10",
        },
        {
            label: "Total Exercises",
            value: stats.exercises.toLocaleString(),
            icon: "📋",
            change: `+ ${stats.exercises || 12} added this week`,
            changeColor: "text-[#3C83F6]",
            iconBg: "bg-[#3C83F6]/10",
        },
        {
            label: "Active Sessions",
            value: "1,205",
            icon: "🔔",
            change: "+3% currently active",
            changeColor: "text-green-500",
            iconBg: "bg-[#D06A00]/10",
        },
    ];

    const errorCategories = [
        { name: "Subj-Verb", value: 75 },
        { name: "Tense", value: 60 },
        { name: "Articles", value: 45 },
        { name: "Prepos.", value: 85 },
        { name: "Pronouns", value: 30 },
        { name: "Conjunct.", value: 20 },
    ];

    const recentActivity = [
        { name: "Alice Chen", action: "Completed Exercise", exerciseId: "Ex 101", time: "2 mins ago", status: "Success", statusColor: "text-green-500 bg-green-50 dark:bg-green-900/20" },
        { name: "Bob Smith", action: "Failed Quiz", exerciseId: "Ex 204", time: "15 mins ago", status: "Review", statusColor: "text-[#D06A00] bg-[#D06A00]/10" },
        { name: "Charlie Kim", action: "Started Session", exerciseId: "Ex 105", time: "1 hour ago", status: "Active", statusColor: "text-[#3C83F6] bg-[#3C83F6]/10" },
        { name: "Dana Lee", action: "Completed Exercise", exerciseId: "Ex 300", time: "2 hours ago", status: "Success", statusColor: "text-green-500 bg-green-50 dark:bg-green-900/20" },
    ];

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-white dark:bg-[#111C2E] border border-[#D4D6DB] dark:border-[#1E3050] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-[#75777F] font-medium">{card.label}</span>
                            <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center text-lg`}>{card.icon}</div>
                        </div>
                        <p className="text-3xl font-bold text-[#1A1C1E] dark:text-white mb-2">{card.value}</p>
                        <p className={`text-xs ${card.changeColor} font-medium`}>📈 {card.change}</p>
                    </div>
                ))}
            </div>

            {/* Grammar Errors Chart + System Status */}
            <div className="grid md:grid-cols-[1fr_300px] gap-4">
                {/* Most Common Grammar Errors */}
                <div className="bg-white dark:bg-[#111C2E] border border-[#D4D6DB] dark:border-[#1E3050] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h2 className="text-lg font-bold text-[#1A1C1E] dark:text-white">Most Common Grammar Errors</h2>
                            <p className="text-sm text-[#75777F]">Frequency by error type (Last 7 Days)</p>
                        </div>
                        <button className="px-4 py-1.5 border border-[#D4D6DB] dark:border-[#1E3050] rounded-lg text-sm text-[#1A1C1E] dark:text-white hover:bg-[#F0F2F5] dark:hover:bg-[#1B2840]">
                            View Report
                        </button>
                    </div>

                    {/* Bar chart */}
                    <div className="flex items-end justify-between gap-3 h-48 mt-6 mb-4 px-2">
                        {errorCategories.map((cat) => (
                            <div key={cat.name} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full relative" style={{ height: "160px" }}>
                                    <div
                                        className="absolute bottom-0 w-full bg-[#3C83F6]/80 dark:bg-[#3C83F6]/60 rounded-t-md transition-all"
                                        style={{ height: `${cat.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between px-2">
                        {errorCategories.map((cat) => (
                            <span key={cat.name} className="text-xs text-[#75777F] text-center flex-1">{cat.name}</span>
                        ))}
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-white dark:bg-[#111C2E] border border-[#D4D6DB] dark:border-[#1E3050] rounded-2xl p-6 space-y-6">
                    <h2 className="text-lg font-bold text-[#1A1C1E] dark:text-white">System Status</h2>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-4 border-green-400 flex items-center justify-center">
                            <span className="text-lg font-bold text-green-500">98%</span>
                        </div>
                        <div>
                            <p className="font-semibold text-[#1A1C1E] dark:text-white">System Uptime</p>
                            <p className="text-sm text-[#75777F]">All systems operational</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-[#1A1C1E] dark:text-white mb-3">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link
                                href="/admin/exercises"
                                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#3C83F6] text-white rounded-xl text-sm font-semibold hover:bg-[#2B6FE0] transition-colors"
                            >
                                ➕ Create New Exercise
                            </Link>
                            <button className="flex items-center justify-center gap-2 w-full py-2.5 border border-[#D4D6DB] dark:border-[#1E3050] rounded-xl text-sm font-medium text-[#1A1C1E] dark:text-white hover:bg-[#F0F2F5] dark:hover:bg-[#1B2840]">
                                📤 Import Content
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent User Activity */}
            <div className="bg-white dark:bg-[#111C2E] border border-[#D4D6DB] dark:border-[#1E3050] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#1A1C1E] dark:text-white">Recent User Activity</h2>
                    <span className="text-sm font-bold text-[#3C83F6] cursor-pointer hover:underline">View All →</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#D4D6DB] dark:border-[#1E3050]">
                                <th className="text-left text-xs font-bold text-[#75777F] uppercase tracking-wider py-3 pr-4">User</th>
                                <th className="text-left text-xs font-bold text-[#75777F] uppercase tracking-wider py-3 pr-4">Action</th>
                                <th className="text-left text-xs font-bold text-[#75777F] uppercase tracking-wider py-3 pr-4">Exercise ID</th>
                                <th className="text-left text-xs font-bold text-[#75777F] uppercase tracking-wider py-3 pr-4">Time</th>
                                <th className="text-left text-xs font-bold text-[#75777F] uppercase tracking-wider py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentActivity.map((row, i) => (
                                <tr key={i} className="border-b border-[#D4D6DB]/50 dark:border-[#1E3050]/50 last:border-0">
                                    <td className="py-4 pr-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3C83F6] to-[#6277A4] flex items-center justify-center text-white font-bold text-xs">
                                                {row.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <span className="font-medium text-sm text-[#1A1C1E] dark:text-white">{row.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 pr-4 text-sm text-[#75777F]">{row.action}</td>
                                    <td className="py-4 pr-4">
                                        <span className="px-2.5 py-1 bg-[#F0F2F5] dark:bg-[#1B2840] rounded-md text-xs font-mono text-[#1A1C1E] dark:text-gray-300">
                                            {row.exerciseId}
                                        </span>
                                    </td>
                                    <td className="py-4 pr-4 text-sm text-[#75777F]">{row.time}</td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${row.statusColor}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
