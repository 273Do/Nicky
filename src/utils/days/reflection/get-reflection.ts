import { generateText } from "ai";

import {
  type ReflectionResult,
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

const SYSTEM_PROMPT = `あなたはユーザーの一日を振り返るアシスタントです。

ルール:
- 第三者の視点からユーザーに伝えるような振り返りをすること
- 記録に書かれた事実のみを使うこと。事実にないことは絶対に書かないこと
- 未来の予測・医学的・心理学的な診断をしないこと
- カテゴリー名や「記録から」などのメタ的な内容は含めず、内容について直接語ること
- 各contentは80文字以内とし、「〜です」「〜ますね」のような語りかける口調で書くこと
- 出力は指定されたJSON形式のみとすること

カテゴリー一覧:
${categoryList}

出力形式 (JSON):
{
  "title": "その日を象徴する語りかけの一文(例: 新しい発見がありましたね)",
  "items": [
    {"category": "カテゴリー名", "content": "語りかける振り返り文"},
    {"category": "カテゴリー名", "content": "語りかける振り返り文"}
  ]
}

titleは必須です。
itemsに関しては、エントリーを元に最適なカテゴリーをカテゴリー一覧から2つ選び、それぞれの振り返りを書くこと。`;

/**
 * その日の記録をもとに AI Reflection を生成する
 * @param entries その日のエントリーの一覧
 */
export const getReflection = async (entries: DailyEntryObj[]): Promise<ReflectionResult | null> => {
  const model = await getReflectionModel();
  if (!model) return null;

  const entriesText = entriesToText(entries);
  const prompt = `以下は本日のジャーナル記録です。この記録をもとに振り返りを生成してください。\n\n${entriesText}`;

  console.log(prompt);

  try {
    const { text } = await generateText({ model, system: SYSTEM_PROMPT, prompt });
    const json = text.match(/\{[\s\S]*\}/)?.[0];

    if (!json) return null;
    const result = reflectionSchema.safeParse(JSON.parse(json));

    return result.success ? result.data : null;
  } catch (error) {
    console.warn("[reflection]", error);
    return null;
  }
};
