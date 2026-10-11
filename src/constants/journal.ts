import type { SFSymbol } from "expo-symbols";

import { z } from "zod";

/**
 * ジャーナルフィールドの種別
 *
 * 共有リンクはインデックスで参照するため、追加は末尾に行い、並べ替えないこと
 */
export const fieldTypeSchema = z.enum([
  "text",
  "longText",
  "link",
  "number",
  "date",
  "time",
  "media",
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
  date: "calendar",
  time: "stopwatch",
  media: "photo",
  check: "checkmark.circle",
  rating: "slider.horizontal.below.rectangle",
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
  date: "field.date",
  time: "field.time",
  check: "field.check",
  rating: "field.rating",
  location: "field.location",
};

/**
 * ジャーナルで使用するSFシンボル一覧
 *
 * 共有リンクはインデックスで参照するため、追加は末尾に行い、並べ替えないこと
 */
export const JOURNAL_ICONS: SFSymbol[] = [
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

/** ジャーナルのデフォルトカラー */
export const DEFAULT_JOURNAL_COLOR = "#6d7ce1";

/** JOURNAL_ICONS の Zod スキーマ（ランタイムで一覧に含まれるか検証、型は SFSymbol を維持） */
export const journalIconSchema = z
  .string()
  .refine((v): v is SFSymbol => (JOURNAL_ICONS as string[]).includes(v), {
    message: "Invalid journal icon",
  }) as z.ZodType<SFSymbol>;

/**
 * ジャーナル共有リンクのベース URL（`?t=<署名付きデータ>` を付けて使う）
 *
 * expo-router により `src/app/(journal)/create.tsx` に解決される。
 * ユニバーサルリンクに移行する場合は `https://<domain>/create` に差し替える
 */
export const TEMPLATE_LINK_BASE = "nicky://create";

/** 共有リンクに付ける署名の長さ（SHA-256 の16進数を先頭から切り詰める） */
export const TEMPLATE_LINK_SIGNATURE_LENGTH = 16;
