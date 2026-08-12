import { z } from "zod";

export const reflectionCategories = {
  Highlights: "印象的・良かった出来事をピックアップして振り返る",
  Emotions: "感情の変化や心理状態を読み取り、振り返る",
  Achievements: "達成したことや努力したことを見つけ出す",
  Challenges: "困難や課題を整理し、振り返る",
  Insights: "気づきや学びを導き出す",
  Relationships: "人との関わりやコミュニケーションを振り返る",
  Habits: "睡眠・運動・食事など、習慣や行動パターンを分析する",
  Balance: "仕事・趣味・休息など、一日のバランスを評価する",
  Unresolved: "まだ整理できていない事柄や気がかりを抽出する",
  Tomorrow: "明日に活かせることや次のアクションを提案する",
} as const;

export type ReflectionCategory = keyof typeof reflectionCategories;

/**
 * AI Reflection の出力スキーマ
 */
export const reflectionSchema = z.object({
  /** その日を象徴する語りかけの一文 */
  title: z.string().min(1).max(20),
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
