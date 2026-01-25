import Link from "next/link";
import { BookOpen, ChevronRight, Lock } from "lucide-react";

// Mock data - will replace with Supabase later
const mockUnits = [
    {
        id: "unit-1",
        title: "Getting Started",
        description: "Learn basic greetings and introductions",
        cefr_level: "A1",
        lessonCount: 5,
        isLocked: false,
    },
    {
        id: "unit-2",
        title: "Daily Routines",
        description: "Talk about your daily activities",
        cefr_level: "A1",
        lessonCount: 6,
        isLocked: false,
    },
    {
        id: "unit-3",
        title: "Food & Drinks",
        description: "Order food and discuss preferences",
        cefr_level: "A2",
        lessonCount: 5,
        isLocked: true,
    },
    {
        id: "unit-4",
        title: "Travel & Places",
        description: "Navigate cities and ask for directions",
        cefr_level: "A2",
        lessonCount: 7,
        isLocked: true,
    },
];

export default function LearnPage() {
    return (
        <div className="container max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-2">Learning Path</h1>
            <p className="text-muted-foreground mb-8">
                Master English step by step with CEFR-aligned lessons
            </p>

            <div className="space-y-4">
                {mockUnits.map((unit) => (
                    <Link
                        key={unit.id}
                        href={unit.isLocked ? "#" : `/learn/${unit.id}`}
                        className={`block p-5 rounded-xl border transition-colors ${unit.isLocked
                                ? "bg-muted/50 border-border cursor-not-allowed opacity-60"
                                : "bg-card border-border hover:border-primary/50"
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${unit.isLocked ? "bg-muted" : "bg-primary/10"}`}>
                                {unit.isLocked ? (
                                    <Lock className="h-6 w-6 text-muted-foreground" />
                                ) : (
                                    <BookOpen className="h-6 w-6 text-primary" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold">{unit.title}</h3>
                                    <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                                        {unit.cefr_level}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{unit.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">{unit.lessonCount} lessons</p>
                            </div>
                            {!unit.isLocked && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
