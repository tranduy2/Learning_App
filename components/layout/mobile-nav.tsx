"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/learn", label: "Learn", icon: "📚" },
    { href: "/dashboard", label: "Stats", icon: "📊" },
    { href: "/review", label: "Review", icon: "🧠" },
    { href: "/leaderboard", label: "Rank", icon: "🏆" },
    { href: "/profile", label: "Profile", icon: "👤" },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1B1D24] border-t border-[#D4D6DB] dark:border-[#2E3039] z-50">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${isActive
                                    ? "text-[#3C83F6]"
                                    : "text-[#75777F]"
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
