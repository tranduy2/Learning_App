"use client";

import { useState, useEffect, useRef } from "react";
import { fetchWordData, DictionaryEntry } from "@/lib/api/dictionary";
import { Volume2, Loader2 } from "lucide-react";

interface VocabularyCardProps {
    word: string;
}

export function VocabularyCard({ word }: VocabularyCardProps) {
    const [entry, setEntry] = useState<DictionaryEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        setEntry(null);

        fetchWordData(word).then((result) => {
            setEntry(result.data);
            setError(result.error);
            setLoading(false);
        });
    }, [word]);

    // Find the best audio URL from phonetics
    function getAudioUrl(): string | null {
        if (!entry) return null;
        for (const phonetic of entry.phonetics) {
            if (phonetic.audio) return phonetic.audio;
        }
        return null;
    }

    // Find the best phonetic text
    function getPhoneticText(): string {
        if (!entry) return "";
        if (entry.phonetic) return entry.phonetic;
        for (const phonetic of entry.phonetics) {
            if (phonetic.text) return phonetic.text;
        }
        return "";
    }

    function playAudio() {
        const url = getAudioUrl();
        if (!url) return;

        if (audioRef.current) {
            audioRef.current.pause();
        }

        const audio = new Audio(url);
        audioRef.current = audio;
        setIsPlaying(true);

        audio.play();
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
    }

    // Loading state
    if (loading) {
        return (
            <div className="p-6 bg-card border border-border rounded-xl">
                <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-muted-foreground">Looking up &quot;{word}&quot;...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !entry) {
        return (
            <div className="p-6 bg-card border border-border rounded-xl">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">📖</span>
                    <div>
                        <h3 className="font-semibold text-foreground mb-1">{word}</h3>
                        <p className="text-sm text-destructive">{error || "Word not found"}</p>
                    </div>
                </div>
            </div>
        );
    }

    const phoneticText = getPhoneticText();
    const audioUrl = getAudioUrl();
    const firstMeaning = entry.meanings[0];

    return (
        <div className="p-6 bg-card border border-border rounded-xl space-y-4">
            {/* Word heading + phonetic + audio */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-foreground">{entry.word}</h3>
                    {phoneticText && (
                        <p className="text-sm text-primary mt-0.5">{phoneticText}</p>
                    )}
                </div>
                {audioUrl && (
                    <button
                        onClick={playAudio}
                        disabled={isPlaying}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 disabled:opacity-50 transition-colors"
                    >
                        <Volume2 className={`h-5 w-5 ${isPlaying ? "animate-pulse" : ""}`} />
                        <span className="text-sm font-medium">
                            {isPlaying ? "Playing..." : "Play Audio"}
                        </span>
                    </button>
                )}
            </div>

            {/* First meaning */}
            {firstMeaning && (
                <div>
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-secondary/10 text-secondary rounded mb-2">
                        {firstMeaning.partOfSpeech}
                    </span>
                    {firstMeaning.definitions.slice(0, 2).map((def, i) => (
                        <div key={i} className="mb-2">
                            <p className="text-sm text-foreground">{def.definition}</p>
                            {def.example && (
                                <p className="text-xs text-muted-foreground mt-1 italic">
                                    &quot;{def.example}&quot;
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Additional meanings */}
            {entry.meanings.length > 1 && (
                <p className="text-xs text-muted-foreground">
                    +{entry.meanings.length - 1} more meaning{entry.meanings.length > 2 ? "s" : ""}
                </p>
            )}
        </div>
    );
}
