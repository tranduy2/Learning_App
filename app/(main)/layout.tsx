import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // TODO: Fetch real user data from Supabase
    const mockUser = {
        displayName: "Student",
        currentStreak: 5,
        totalXp: 250,
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="md:pl-64">
                {/* Header */}
                <Header user={mockUser} />

                {/* Page Content */}
                <main id="main-content" className="min-h-[calc(100vh-4rem)] pb-20 md:pb-0">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileNav />
        </div>
    );
}
