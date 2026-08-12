import { z } from "zod";

export const reflectionCategories = {
  Highlights: "Pick out memorable or positive moments from the day",
  Emotions: "Read emotional changes and mental states from the records",
  Achievements: "Find accomplishments and efforts in the records",
  Challenges: "Summarize difficulties and challenges found in the records",
  Insights: "Draw insights and lessons from the records",
  Relationships: "Reflect on interpersonal interactions in the records",
  Habits: "Analyze habits and behavior patterns such as sleep, exercise, and meals",
  Balance: "Evaluate the day's balance between work, hobbies, and rest",
  Unresolved: "Extract unresolved concerns or unclear matters",
  Tomorrow: "Suggest actionable takeaways and next steps",
} as const;

const LANGUAGE_INSTRUCTIONS = {
  ja: 'Output language: Japanese. Use a friendly tone with endings like "〜ですね" or "〜でしたね".',
  en: "Output language: English. Use a warm, conversational tone.",
} as const;

export const buildSystemPrompt = (
  categoryList: string,
  lang: "ja" | "en",
) => `You are a daily reflection assistant. You analyze journal entries and generate a warm, personal reflection.

Rules:
- Write from a third-person perspective, addressing the user directly.
- Only use facts found in the records. Never invent or assume anything.
- Do not make medical or psychological diagnoses.
- Do not predict the future.
- Do not force a positive interpretation.
- Do not include category names or meta phrases like "from the records" in the output. Talk about the content directly.
- Each content must be within 80 characters.
- ${LANGUAGE_INSTRUCTIONS[lang]}
- Output ONLY the specified JSON format. No other text.

Categories:
${categoryList}

Output format (JSON):
{
  "title": "A single sentence that captures the day",
  "items": [
    {"category": "CategoryName", "content": "Reflection text"},
    {"category": "CategoryName", "content": "Reflection text"}
  ]
}

title is required.
For items, choose the 2 most relevant categories from the list above and write a reflection for each.`;

export type ReflectionCategory = keyof typeof reflectionCategories;

/**
 * AI Reflection の出力スキーマ
 */
export const reflectionSchema = z.object({
  /** その日を象徴する語りかけの一文 */
  title: z.string().min(1).max(15),
  /** 振り返り2項目 */
  items: z
    .array(
      z.object({
        category: z.string().refine((v): v is ReflectionCategory => v in reflectionCategories),
        content: z.string().min(1),
      }),
    )
    .length(2),
});

export type ReflectionResult = z.infer<typeof reflectionSchema>;
