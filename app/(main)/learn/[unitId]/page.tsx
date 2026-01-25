"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Clock, BookOpen } from "lucide-react";

// Mock data - will replace with Supabase later
const mockUnits: Record<string, { title: string; cefr_level: string; description: string }> = {
    "unit-1": { title: "Getting Started", cefr_level: "A1", description: "Learn basic greetings and introductions" },
    "unit-2": { title: "Daily Routines", cefr_level: "A1", description: "Talk about your daily activities" },
};

const mockLessons: Record<string, Array<{ id: string; title: string; skill: string; minutes: number; xp: number }>> = {
    "unit-1": [
        { id: "lesson-1", title: "Hello & Goodbye", skill: "speaking", minutes: 5, xp: 10 },
        { id: "lesson-2", title: "What's your name?", skill: "listening", minutes: 5, xp: 10 },
        { id: "lesson-3", title: "Nice to meet you", skill: "reading", minutes: 8, xp: 15 },
        { id: "lesson-4", title: "Where are you from?", skill: "writing", minutes: 10, xp: 20 },
        { id: "lesson-5", title: "Review & Practice", skill: "grammar", minutes: 10, xp: 25 },
    ],
    "unit-2": [
        { id: "lesson-6", title: "Morning Routine", skill: "vocabulary", minutes: 5, xp: 10 },
        { id: "lesson-7", title: "At Work", skill: "reading", minutes: 8, xp: 15 },
        { id: "lesson-8", title: "Evening Activities", skill: "listening", minutes: 8, xp: 15 },
        { id: "lesson-9", title: "Weekends", skill: "speaking", minutes: 10, xp: 20 },
        { id: "lesson-10", title: "Present Simple Tense", skill: "grammar", minutes: 12, xp: 25 },
        { id: "lesson-11", title: "Review & Practice", skill: "writing", minutes: 10, xp: 20 },
    ],
};

export default function UnitPage() {
    const params = useParams();
    const unitId = params.unitId as string;

    const unit = mockUnits[unitId] || { title: "Unknown Unit", cefr_level: "A1", description: "" };
    const lessons = mockLessons[unitId] || [];

    return (
        <div className="container max-w-3xl mx-auto px-4 py-8">
            <Link
                href="/learn"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ChevronLeft className="h-4 w-4" />
                Back to Learning Path
            </Link>

            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">{unit.title}</h1>
                    <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                        {unit.cefr_level}
                    </span>
                </div>
                <p className="text-muted-foreground">{unit.description}</p>
            </div>

            <div className="space-y-3">
                {lessons.map((lesson, index) => (
                    <Link
                        key={lesson.id}
                        href={`/lesson/${lesson.id}`}
                        className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium">{lesson.title}</h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                    <BookOpen className="h-4 w-4" />
                                    {lesson.skill}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {lesson.minutes}m
                                </span>
                                <span>+{lesson.xp} XP</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
