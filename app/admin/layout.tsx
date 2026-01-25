import Link from "next/link";
import { GraduationCap, BookOpen, FileText, Layers, ChevronLeft } from "lucide-react";

const adminNavItems = [
    { href: "/admin", label: "Overview", icon: Layers },
    { href: "/admin/grammar-rules", label: "Grammar Rules", icon: FileText },
    { href: "/admin/exercises", label: "Exercises", icon: BookOpen },
    { href: "/admin/curriculum", label: "Curriculum", icon: Layers },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            {/* Admin Header */}
            <header className="bg-card border-b border-border">
                <div className="flex items-center justify-between h-16 px-6">
                    <div className="flex items-center gap-4">
                        <Link href="/learn" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                            <ChevronLeft className="h-4 w-4" />
                            Back
                        </Link>
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-primary" />
                            <span className="font-bold">Admin Panel</span>
                        </div>
                    </div>
                </div>

                {/* Admin Navigation */}
                <nav className="flex gap-1 px-6 pb-2">
                    {adminNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </header>

            {/* Content */}
            <main className="p-6">
                {children}
            </main>
        </div>
    );
}
