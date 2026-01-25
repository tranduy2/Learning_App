"use client";

import Link from "next/link";
import { Flame, Zap, Bell, User } from "lucide-react";

interface HeaderProps {
    user?: {
        displayName: string;
        avatarUrl?: string;
        currentStreak: number;
        totalXp: number;
    };
}

export function Header({ user }: HeaderProps) {
    const streak = user?.currentStreak ?? 0;
    const xp = user?.totalXp ?? 0;
    const displayName = user?.displayName ?? "Guest";

    return (
        <header className="sticky top-0 z-40 bg-card border-b border-border">
            <div className="flex items-center justify-between h-16 px-4 md:px-6">
                {/* Spacer for desktop */}
                <div className="hidden md:block" />

                {/* Stats and user section */}
                <div className="flex items-center gap-4 ml-auto">
                    {/* Streak counter */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10">
                        <Flame className={`h-5 w-5 text-orange-500 ${streak > 0 ? "animate-flame" : ""}`} />
                        <span className="text-sm font-bold text-orange-500">{streak}</span>
                    </div>

                    {/* XP counter */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/20">
                        <Zap className="h-5 w-5 text-accent-foreground" />
                        <span className="text-sm font-bold text-accent-foreground">{xp}</span>
                    </div>

                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg hover:bg-muted">
                        <Bell className="h-5 w-5 text-foreground" />
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
                    </button>

                    {/* User avatar */}
                    <Link href="/profile" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-foreground" />
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}
