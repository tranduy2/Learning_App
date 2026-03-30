export interface DictionaryEntry {
    word: string;
    phonetic: string;
    partOfSpeech: string;
    definition: string;
    example: string;
    exampleTranslation: string;
    synonyms: string[];
}

export interface DictionaryResult {
    data: DictionaryEntry | null;
    error: string | null;
}

export async function lookupWord(
    word: string,
    userLevel: string = "A1"
): Promise<DictionaryResult> {
    try {
        const response = await fetch("/api/dictionary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ word: word.trim(), userLevel }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return {
                data: null,
                error: errorData?.error || "Failed to look up word.",
            };
        }

        const data: DictionaryEntry = await response.json();
        return { data, error: null };
    } catch {
        return { data: null, error: "Network error. Please try again." };
    }
}
