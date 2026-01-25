"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CheckCircle, XCircle, ArrowRight } from "lucide-react";

// Mock exercises - will replace with Supabase later
const mockExercises: Record<string, Array<{
    id: string;
    type: string;
    question: string;
    correctAnswer: string;
    explanation: string;
}>> = {
    "lesson-1": [
        { id: "ex-1", type: "fill_blank", question: "Complete: Hello! My name ___ John.", correctAnswer: "is", explanation: "Use 'is' with singular subjects (my name is)." },
        { id: "ex-2", type: "translation", question: "Translate to English: Xin chào", correctAnswer: "hello", explanation: "'Hello' is a common greeting in English." },
        { id: "ex-3", type: "fill_blank", question: "Nice ___ meet you!", correctAnswer: "to", explanation: "The phrase is 'Nice to meet you' - a polite greeting." },
    ],
    "lesson-2": [
        { id: "ex-4", type: "fill_blank", question: "What ___ your name?", correctAnswer: "is", explanation: "'Is' is used with 'what' for questions about singular nouns." },
        { id: "ex-5", type: "fill_blank", question: "My name ___ Sarah.", correctAnswer: "is", explanation: "Use 'is' to connect a subject with its name." },
    ],
};

// Default exercises for any lesson
const defaultExercises = [
    { id: "ex-d1", type: "fill_blank", question: "I ___ a student.", correctAnswer: "am", explanation: "Use 'am' with 'I' (first person singular)." },
    { id: "ex-d2", type: "fill_blank", question: "She ___ from Vietnam.", correctAnswer: "is", explanation: "Use 'is' with he/she/it (third person singular)." },
    { id: "ex-d3", type: "fill_blank", question: "They ___ my friends.", correctAnswer: "are", explanation: "Use 'are' with they/we/you (plural subjects)." },
];

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const lessonId = params.lessonId as string;

    const exercises = mockExercises[lessonId] || defaultExercises;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);

    const currentExercise = exercises[currentIndex];
    const progress = ((currentIndex + 1) / exercises.length) * 100;

    function handleSubmit() {
        const correct = answer.toLowerCase().trim() === currentExercise.correctAnswer.toLowerCase().trim();
        setIsCorrect(correct);
        setShowResult(true);
        if (correct) {
            setScore(score + 10);
        }
    }

    function handleNext() {
        if (currentIndex < exercises.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setAnswer("");
            setShowResult(false);
        } else {
            // Lesson complete - go back to learn
            router.push("/learn");
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 bg-card border-b border-border z-10">
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
                    <Link href="/learn" className="p-2 hover:bg-muted rounded-lg">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex-1">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {currentIndex + 1}/{exercises.length}
                    </span>
                    <span className="text-sm font-bold text-accent">+{score} XP</span>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-2xl mx-auto px-4 py-8">
                <div className="space-y-6">
                    {/* Question */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <p className="text-sm text-muted-foreground mb-2 capitalize">
                            {currentExercise.type.replace("_", " ")}
                        </p>
                        <h2 className="text-xl font-semibold">{currentExercise.question}</h2>
                    </div>

                    {/* Answer input */}
                    {!showResult && (
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Type your answer..."
                                className="w-full h-12 px-4 rounded-lg border border-input bg-background text-lg"
                                autoFocus
                                onKeyDown={(e) => e.key === "Enter" && answer && handleSubmit()}
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={!answer}
                                className="w-full h-12 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50"
                            >
                                Check Answer
                            </button>
                        </div>
                    )}

                    {/* Result */}
                    {showResult && (
                        <div className={`p-6 rounded-xl ${isCorrect ? "bg-success/10" : "bg-destructive/10"}`}>
                            <div className="flex items-center gap-3 mb-2">
                                {isCorrect ? (
                                    <CheckCircle className="h-6 w-6 text-success" />
                                ) : (
                                    <XCircle className="h-6 w-6 text-destructive" />
                                )}
                                <span className={`font-semibold ${isCorrect ? "text-success" : "text-destructive"}`}>
                                    {isCorrect ? "Correct! +10 XP" : "Incorrect"}
                                </span>
                            </div>

                            {!isCorrect && (
                                <p className="text-sm mb-2">
                                    Correct answer: <strong>{currentExercise.correctAnswer}</strong>
                                </p>
                            )}

                            <p className="text-sm text-muted-foreground mb-4">
                                {currentExercise.explanation}
                            </p>

                            <button
                                onClick={handleNext}
                                className="w-full h-12 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
                            >
                                {currentIndex < exercises.length - 1 ? "Next Question" : "Finish Lesson"}
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
