import { generateText } from "ai";
import { z } from "zod";

import { type ReflectionCategory, reflectionItems } from "@/constants/reflection-category";
import { DailyEntryObj } from "@/db/queries/entries";

import { entriesToText } from "./get-reflection-category";
import { getReflectionModel } from "./get-reflection-model";

const schema = z.object({
  content: z.string().min(1),
});

/**
 * 指定されたカテゴリーについて、その日の記録をもとに振り返りを生成する
 * @param entries その日のエントリーの一覧
 * @param category 振り返りカテゴリー
 */
export const getReflectionContent = async (
  entries: DailyEntryObj[],
  category: ReflectionCategory,
): Promise<string | null> => {
  const model = await getReflectionModel();
  if (!model) return null;

  const categoryDesc = reflectionItems[category];
  const entriesText = entriesToText(entries);
  const system = `あなたはジャーナル振り返りアシスタントです。

厳守するルール:
- 語尾を「ですね」などにし、相手に話すように親しみやすく第三者視点で振り返りを行うこと
- 箇条書きや記号は使わず、必ず80文字以内の親しみやすい自然な日本語で書くこと
- カテゴリー名や観点名、「今日の記録から」「記録を振り返ると」などのメタ的な内容は含めず、内容について直接記載すること
- 出力は必ず {"content":"振り返りの文章"} のJSON形式のみとすること`;

  const prompt = `以下は本日のジャーナル記録です。

${entriesText}

この記録をもとに、次の観点で振り返ってください。
観点: ${categoryDesc.ja}
/no_think`;

  try {
    const { text } = await generateText({ model, system, prompt });
    const json = text.match(/\{[\s\S]*\}/)?.[0];

    if (!json) return null;
    const result = schema.safeParse(JSON.parse(json));

    return result.success ? result.data.content : null;
  } catch (error) {
    console.warn("[reflection]", error);
    return null;
  }
};
