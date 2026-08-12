export type ReflectionCategory =
  | "Highlights"
  | "Emotions"
  | "Achievements"
  | "Challenges"
  | "Insights"
  | "Relationships"
  | "Habits"
  | "Balance"
  | "Unresolved"
  | "Tomorrow";

export type ReflectionDescriptionObj = {
  ja: string;
  en: string;
};

export const reflectionItems: Record<ReflectionCategory, ReflectionDescriptionObj> = {
  Highlights: {
    ja: "その日の記録から、印象的・良かった出来事をピックアップして振り返る",
    en: "Highlight memorable or positive moments from the day's records",
  },

  Emotions: {
    ja: "記録に表れた感情の変化や心理状態を読み取り、振り返る",
    en: "Identify emotional changes and mental states reflected in the entries",
  },

  Achievements: {
    ja: "記録から達成したことや努力したことを見つけ出す",
    en: "Find accomplishments and efforts documented in the records",
  },

  Challenges: {
    ja: "記録された困難や課題を整理し、振り返る",
    en: "Summarize difficulties and challenges found in the entries",
  },

  Insights: {
    ja: "ジャーナルや記録の内容から気づきや学びを導き出す",
    en: "Draw insights and lessons from the journal entries and records",
  },

  Relationships: {
    ja: "記録に含まれる人との関わりやコミュニケーションを振り返る",
    en: "Reflect on interpersonal interactions mentioned in the records",
  },

  Habits: {
    ja: "睡眠・運動・食事など、記録された習慣や行動パターンを分析する",
    en: "Analyze habits and behavior patterns such as sleep, exercise, and meals",
  },

  Balance: {
    ja: "仕事・趣味・休息など、記録から一日のバランスを評価する",
    en: "Evaluate the day's balance between work, hobbies, and rest based on the records",
  },

  Unresolved: {
    ja: "記録の中でまだ整理できていない事柄や気がかりを抽出する",
    en: "Extract unresolved concerns or unclear matters from the entries",
  },

  Tomorrow: {
    ja: "記録をもとに、明日に活かせることや次のアクションを提案する",
    en: "Suggest actionable takeaways and next steps based on the day's records",
  },
};

export const selectReflectionCategoryPrompt: ReflectionDescriptionObj = {
  ja: "以下は本日のジャーナルの記録です。複数のジャーナルにまたがるエントリーをまとめて振り返ります。内容をもとに、振り返りに最もふさわしいカテゴリーを2つ選択してください。",
  en: "Here are today's journal entries, spanning multiple journals. Based on their content, please choose the 2 categories that best fit for a reflection.",
};
