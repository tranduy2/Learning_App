// Dictionary API utility
// Fetches word data from Free Dictionary API

interface Phonetic {
    text?: string;
    audio?: string;
}

interface Definition {
    definition: string;
    example?: string;
}

interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
}

export interface DictionaryEntry {
    word: string;
    phonetic?: string;
    phonetics: Phonetic[];
    meanings: Meaning[];
}

export interface DictionaryResult {
    data: DictionaryEntry | null;
    error: string | null;
}

export async function fetchWordData(word: string): Promise<DictionaryResult> {
    try {
        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
        );

        if (!response.ok) {
            if (response.status === 404) {
                return { data: null, error: "Word not found in the dictionary." };
            }
            return { data: null, error: "Failed to fetch word data." };
        }

        const entries: DictionaryEntry[] = await response.json();

        if (entries.length === 0) {
            return { data: null, error: "No data found for this word." };
        }

        return { data: entries[0], error: null };
    } catch (err) {
        return { data: null, error: "Network error. Please try again." };
    }
}
