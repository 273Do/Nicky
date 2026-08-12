import { generateText } from "ai";
import { z } from "zod";

import {
  type ReflectionCategory,
  reflectionItems,
  selectReflectionCategoryPrompt,
} from "@/constants/reflection-category";
import { DailyEntryObj } from "@/db/queries/entries";
import { formatFieldValue } from "@/utils/entry/preview";

import { getReflectionModel } from "./get-reflection-model";

const reflectionCategorySchema = z.enum(
  Object.keys(reflectionItems) as [ReflectionCategory, ...ReflectionCategory[]],
);

const schema = z.object({
  categories: z.array(reflectionCategorySchema).length(2),
});

/**
 * 日毎のエントリーをLLMに渡すテキストに変換する
 */
export const entriesToText = (entries: DailyEntryObj[]): string =>
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

/**
 * その日の記録をもとに、振り返りに最適なカテゴリーを2つ選択する
 * @param entries その日のエントリーの一覧
 */
export const getReflectionCategory = async (
  entries: DailyEntryObj[],
): Promise<ReflectionCategory[] | null> => {
  const model = await getReflectionModel();
  if (!model) return null;

  const categoryList = Object.entries(reflectionItems)
    .map(([key, desc]) => `- ${key}: ${desc.ja}`)
    .join("\n");

  const entriesText = entriesToText(entries);

  const system = `あなたはジャーナル振り返りのカテゴリー選択アシスタントです。以下のルールを厳守してください。

ルール:
- 与えられたカテゴリー一覧から、振り返りに最もふさわしいカテゴリーを2つ選ぶこと
- 出力は必ず {"categories":["cat1","cat2"]} のJSON形式のみとすること

カテゴリー一覧:
${categoryList}`;

  const prompt = `${selectReflectionCategoryPrompt.ja}\n\n${entriesText}\n/no_think`;

  try {
    const { text } = await generateText({ model, system, prompt });
    const json = text.match(/\{[\s\S]*\}/)?.[0];

    if (!json) return null;
    const result = schema.safeParse(JSON.parse(json));

    const { success, data } = result;

    return success ? data.categories : null;
  } catch (error) {
    console.warn("[reflection]", error);
    return null;
  }
};
