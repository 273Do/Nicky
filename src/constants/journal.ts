import type { SFSymbol } from "expo-symbols";

import { z } from "zod";

/**
 * ジャーナルフィールドの種別
 */
export const fieldTypeSchema = z.enum([
  "text",
  "longText",
  "link",
  "number",
  "media",
  "audio",
  "date",
  "time",
  "check",
  "rating",
  "location",
]);
export type FieldType = z.infer<typeof fieldTypeSchema>;

/**
 * FieldType に対応する SF Symbol アイコン名
 */
export const FIELD_ICONS: Record<FieldType, SFSymbol> = {
  text: "character.textbox",
  longText: "text.quote",
  link: "link",
  number: "numbers.rectangle",
  media: "photo",
  audio: "microphone",
  date: "calendar",
  time: "stopwatch",
  check: "checkmark.circle",
  rating: "star.leadinghalf.filled",
  location: "mappin.and.ellipse",
};

/**
 * FieldType に対応する i18n 翻訳キー
 */
export const FIELD_LABEL_KEYS: Record<FieldType, string> = {
  text: "field.text",
  longText: "field.longText",
  link: "field.link",
  number: "field.number",
  media: "field.media",
  audio: "field.audio",
  date: "field.date",
  time: "field.time",
  check: "field.check",
  rating: "field.rating",
  location: "field.location",
};

/** ジャーナルで使用するSFシンボル一覧 */
export const JOURNAL_ICONS = [
  // 読書・学習
  "book.fill",
  "pencil",
  "doc.fill",
  "folder.fill",
  "brain",
  "magnifyingglass",
  // 感情・日常
  "heart.fill",
  "star.fill",
  "sparkles",
  "wand.and.stars",
  "face.smiling.fill",
  "gift.fill",
  // 仕事・生産性
  "briefcase.fill",
  "chart.bar.fill",
  "clock.fill",
  "flag.fill",
  "bell.fill",
  "trophy.fill",
  // 健康・フィットネス
  "figure.walk",
  "figure.run",
  "figure.hiking",
  "figure.pool.swim",
  "figure.outdoor.cycle",
  "stethoscope",
  "pills.fill",
  // 食べ物・飲み物
  "fork.knife",
  "cup.and.saucer.fill",
  "birthday.cake.fill",
  "cart.fill",
  // 旅行・交通
  "airplane",
  "car.fill",
  "bicycle",
  "map.fill",
  "globe",
  // 自然・天気
  "leaf.fill",
  "flame.fill",
  "drop.fill",
  "cloud.fill",
  "sun.max.fill",
  "moon.fill",
  "snowflake",
  "umbrella.fill",
  "wind",
  "pawprint.fill",
  // エンタメ・趣味
  "music.note",
  "headphones",
  "film.fill",
  "camera.fill",
  "paintbrush.fill",
  "gamecontroller.fill",
  "tv.fill",
  // 家・プライベート
  "house.fill",
  "bed.double.fill",
  "lightbulb.fill",
  "key.fill",
  // 人・社会
  "person.fill",
  "person.2.fill",
  "crown.fill",
  "bolt.fill",
] satisfies SFSymbol[];

/** JOURNAL_ICONS の Zod スキーマ（ランタイムで一覧に含まれるか検証、型は SFSymbol を維持） */
export const journalIconSchema = z
  .string()
  .refine((v): v is SFSymbol => (JOURNAL_ICONS as string[]).includes(v), {
    message: "Invalid journal icon",
  }) as z.ZodType<SFSymbol>;
