import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an expert English teacher helping ESL students learn vocabulary. 
You explain vocabulary words tailored to the student's CEFR level.

Level guidelines:
- A1/A2: Use very simple words, short explanations, and basic example sentences. Keep it beginner-friendly.
- B1/B2: Provide clear explanations with moderate complexity. Include useful collocations.
- C1/C2: Provide deeper nuances, idioms, formal/informal register differences, and complex examples.

You MUST return ONLY a valid JSON object (no markdown, no extra text) with this EXACT structure:
{
  "word": "string",
  "phonetic": "string (IPA format, e.g. /əˈpɒl.ə.dʒaɪz/)",
  "partOfSpeech": "string (e.g. noun, verb, adjective)",
  "definition": "string (Clear explanation in Vietnamese, tailored to the user's CEFR level)",
  "example": "string (An English example sentence suitable for the user's level)",
  "exampleTranslation": "string (Vietnamese translation of the example sentence)",
  "synonyms": ["string"] // Array of 2-3 synonyms. Empty array if none exist.
}`;

interface DictionaryResponse {
    word: string;
    phonetic: string;
    partOfSpeech: string;
    definition: string;
    example: string;
    exampleTranslation: string;
    synonyms: string[];
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { word, userLevel } = body;

        if (!word) {
            return NextResponse.json(
                { error: "Missing 'word' field" },
                { status: 400 }
            );
        }

        const level = userLevel || "A1";
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not configured" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const prompt = `${SYSTEM_PROMPT}

The student's CEFR level is: ${level}
The word to explain is: "${word}"

Return ONLY the JSON object, nothing else. No markdown code blocks, no extra text.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Extract JSON from response (may be wrapped in markdown code blocks)
        let jsonText = text;
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            jsonText = jsonMatch[1];
        }

        let parsed: DictionaryResponse;
        try {
            parsed = JSON.parse(jsonText);
        } catch (parseError) {
            console.error("JSON parse error from Gemini:", {
                text: jsonText.substring(0, 500),
                error: parseError instanceof Error ? parseError.message : String(parseError),
            });
            throw new Error(`Invalid JSON response from Gemini: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
        }

        // Validate structure
        if (
            typeof parsed.word !== "string" ||
            typeof parsed.definition !== "string"
        ) {
            throw new Error("Invalid response structure from AI");
        }

        // Ensure synonyms is an array
        if (!Array.isArray(parsed.synonyms)) {
            parsed.synonyms = [];
        }

        return NextResponse.json(parsed);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Gemini Dictionary API error:", {
            message: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json(
            {
                error: "Failed to look up word. Please try again.",
                details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
            },
            { status: 500 }
        );
    }
}
