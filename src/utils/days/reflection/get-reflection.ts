import { getModelPath, isModelDownloaded, llama } from "@react-native-ai/llama";
import { generateText } from "ai";

import { AI_MODEL } from "@/constants/ai-models";
import {
  type ReflectionResult,
  buildSystemPrompt,
  reflectionCategories,
  reflectionSchema,
} from "@/constants/reflection";
import { DailyEntryObj } from "@/db/queries/entries";
import i18n from "@/i18n";
import { formatFieldValue } from "@/utils/entry/preview";
import { decodeRatingLabel } from "@/utils/journal/rating-label";

/**
 * 日毎のエントリーをLLMに渡すテキストに変換する
 */
const entriesToText = (entries: DailyEntryObj[]): string =>
  entries
    .map((entry) => {
      const header = `[${entry.journal.name}]`;
      const values = [...entry.values]
        .sort((a, b) => a.field.sortOrder - b.field.sortOrder)
        .map((v) => {
          if (v.field.type === "rating") {
            const { name, min, max } = decodeRatingLabel(v.field.label);
            return `${name} (${min}-${max}): ${formatFieldValue(v.value, v.field.type)}`;
          }
          return `${v.field.label}: ${formatFieldValue(v.value, v.field.type)}`;
        })
        .join("\n");
      return `${header}\n${values}`;
    })
    .join("\n---\n");

const categoryList = Object.entries(reflectionCategories)
  .map(([key, desc]) => `- ${key}: ${desc}`)
  .join("\n");

/**
 * その日の記録をもとに AI Reflection を生成する
 * @param entries その日のエントリーの一覧
 */
export const getReflection = async (entries: DailyEntryObj[]): Promise<ReflectionResult | null> => {
  const downloaded = await isModelDownloaded(AI_MODEL.gguf);
  if (!downloaded) return null;

  const modelPath = getModelPath(AI_MODEL.gguf);
  const model = llama.languageModel(modelPath);

  try {
    await model.prepare();

    const entriesText = entriesToText(entries);
    const prompt = `Here are today's journal entries. Generate a reflection based on these records.\n\n${entriesText}`;

    const { text } = await generateText({
      model,
      system: buildSystemPrompt(categoryList, i18n.language === "ja" ? "ja" : "en"),
      prompt,
    });
    const json = text.match(/\{[\s\S]*\}/)?.[0];

    if (!json) return null;
    const result = reflectionSchema.safeParse(JSON.parse(json));

    return result.success ? result.data : null;
  } catch (error) {
    console.warn("[reflection]", error);
    return null;
  } finally {
    await model.unload();
  }
};
