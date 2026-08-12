import { generateText } from "ai";

import {
  type ReflectionResult,
  buildSystemPrompt,
  reflectionCategories,
  reflectionSchema,
} from "@/constants/reflection";
import { DailyEntryObj } from "@/db/queries/entries";
import { formatFieldValue } from "@/utils/entry/preview";

import { getReflectionModel } from "./get-reflection-model";

/**
 * 日毎のエントリーをLLMに渡すテキストに変換する
 */
const entriesToText = (entries: DailyEntryObj[]): string =>
  entries
    .map((entry) => {
      const header = `[${entry.journal.name}]`;
      const values = [...entry.values]
        .sort((a, b) => a.field.sortOrder - b.field.sortOrder)
        .map((v) => `${v.field.label}: ${formatFieldValue(v.value, v.field.type)}`)
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
  const model = await getReflectionModel();
  if (!model) return null;

  const entriesText = entriesToText(entries);
  const prompt = `Here are today's journal entries. Generate a reflection based on these records.\n\n${entriesText}`;

  try {
    const { text } = await generateText({
      model,
      system: buildSystemPrompt(categoryList, "ja"),
      prompt,
    });
    const json = text.match(/\{[\s\S]*\}/)?.[0];

    if (!json) return null;
    const result = reflectionSchema.safeParse(JSON.parse(json));

    return result.success ? result.data : null;
  } catch (error) {
    console.warn("[reflection]", error);
    return null;
  }
};
