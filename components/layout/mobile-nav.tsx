"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Trophy, User } from "lucide-react";

const navItems = [
    { href: "/learn", label: "Learn", icon: BookOpen },
    { href: "/dashboard", label: "Stats", icon: LayoutDashboard },
    { href: "/leaderboard", label: "Rank", icon: Trophy },
    { href: "/profile", label: "Profile", icon: User },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-border">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg min-w-[64px] ${isActive ? "text-primary" : "text-muted-foreground"
                                }`}
                        >
                            <Icon className={`h-6 w-6 ${isActive ? "scale-110" : ""}`} />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
