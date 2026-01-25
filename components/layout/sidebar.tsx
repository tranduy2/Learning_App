"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Trophy, User, Settings, Shield, GraduationCap } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navItems = [
    { href: "/learn", label: "Learn", icon: BookOpen },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
            <div className="flex flex-col flex-grow bg-card border-r border-border">
                {/* Logo */}
                <div className="flex items-center gap-2 h-16 px-6 border-b border-border">
                    <GraduationCap className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold text-foreground">Lingua</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-foreground hover:bg-muted"
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}

                    {/* Admin link */}
                    <div className="pt-4 mt-4 border-t border-border">
                        <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase">
                            Admin
                        </p>
                        <Link
                            href="/admin"
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith("/admin")
                                    ? "bg-primary text-primary-foreground"
                                    : "text-foreground hover:bg-muted"
                                }`}
                        >
                            <Shield className="h-5 w-5" />
                            Admin Panel
                        </Link>
                    </div>
                </nav>

                {/* Bottom section */}
                <div className="p-4 border-t border-border space-y-3">
                    <Link
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted"
                    >
                        <Settings className="h-5 w-5" />
                        Settings
                    </Link>
                    <ThemeToggle />
                </div>
            </div>
        </aside>
    );
}
