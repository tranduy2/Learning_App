import Link from "next/link";
import { Flame, Zap, Target, BookOpen, TrendingUp } from "lucide-react";

// Mock data - will replace with Supabase later
const mockStats = {
    totalXp: 250,
    currentStreak: 5,
    currentLevel: "A1",
    lessonsCompleted: 8,
    dailyGoal: 10,
    dailyProgress: 6,
};

export default function DashboardPage() {
    return (
        <div className="container max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                    icon={<Zap className="h-6 w-6" />}
                    value={mockStats.totalXp}
                    label="Total XP"
                    color="text-accent bg-accent/10"
                />
                <StatCard
                    icon={<Flame className="h-6 w-6" />}
                    value={mockStats.currentStreak}
                    label="Day Streak"
                    color="text-orange-500 bg-orange-500/10"
                />
                <StatCard
                    icon={<Target className="h-6 w-6" />}
                    value={mockStats.currentLevel}
                    label="Current Level"
                    color="text-primary bg-primary/10"
                />
                <StatCard
                    icon={<BookOpen className="h-6 w-6" />}
                    value={mockStats.lessonsCompleted}
                    label="Lessons Done"
                    color="text-success bg-success/10"
                />
            </div>

            {/* Progress Section */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Your Progress
                </h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Level Progress</span>
                            <span className="text-muted-foreground">{mockStats.totalXp % 100} / 100 XP</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${mockStats.totalXp % 100}%` }}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Daily Goal</span>
                            <span className="text-muted-foreground">
                                {mockStats.dailyProgress} / {mockStats.dailyGoal} XP
                            </span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-success rounded-full"
                                style={{ width: `${(mockStats.dailyProgress / mockStats.dailyGoal) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Continue Learning</h2>
                <Link
                    href="/learn"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                    <BookOpen className="h-4 w-4" />
                    Go to Lessons
                </Link>
            </div>
        </div>
    );
}

function StatCard({ icon, value, label, color }: {
    icon: React.ReactNode;
    value: number | string;
    label: string;
    color: string;
}) {
    const [textColor, bgColor] = color.split(" ");
    return (
        <div className="p-4 bg-card border border-border rounded-xl">
            <div className={`inline-flex p-2 rounded-lg ${bgColor} ${textColor} mb-2`}>
                {icon}
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    );
}
