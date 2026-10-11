import { Alert } from "react-native";

import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { decompressFromEncodedURIComponent } from "lz-string";
import { z } from "zod";

import {
  fieldTypeSchema,
  JOURNAL_ICONS,
  journalIconSchema,
  TEMPLATE_LINK_SIGNATURE_LENGTH,
} from "@/constants/journal";
import type { JournalDetail } from "@/db/queries/journals";
import { fieldSelectSchema, journalSelectSchema } from "@/db/schemas";
import i18n from "@/i18n";
import { generateSignature } from "@/utils/journal/export-journal";

const journalDetailSchema = journalSelectSchema.extend({
  icon: journalIconSchema,
  fields: z.array(fieldSelectSchema),
});

const importFileSchema = z.object({
  data: journalDetailSchema,
  signature: z.string().min(1),
});

/** テンプレートとしてフォームに反映する値（ファイル・リンク共通） */
export type JournalTemplate = Pick<
  JournalDetail,
  "name" | "color" | "icon" | "oneEntry" | "locked" | "notificationTime"
> & { fields: Pick<JournalDetail["fields"][number], "type" | "label">[] };

/** 共有リンクのペイロードのスキーマ（形式は export-journal の buildJournalLinkPayload を参照） */
const linkPayloadSchema = z.tuple([
  z.string(),
  z
    .number()
    .int()
    .min(0)
    .max(JOURNAL_ICONS.length - 1),
  z.string(),
  z.number().int().min(0).max(3),
  z.number().int().nullable(),
  z.array(
    z.tuple([
      z
        .number()
        .int()
        .min(0)
        .max(fieldTypeSchema.options.length - 1),
      z.string(),
    ]),
  ),
]);

/** 署名付きデータの検証結果 */
type VerifyResult =
  | { ok: true; journal: JournalDetail }
  | { ok: false; reason: "invalidFormat" | "invalidSignature" };

/**
 * 署名付きのエクスポートデータを検証する
 * @param parsed JSON.parse 済みのデータ
 */
const verifySignedJournal = async (parsed: unknown): Promise<VerifyResult> => {
  const validated = importFileSchema.safeParse(parsed);

  if (!validated.success) return { ok: false, reason: "invalidFormat" };

  const { data: parsedData, signature } = validated.data;

  const expected = await generateSignature(JSON.stringify(parsedData));

  // HMAC
  if (expected !== signature) return { ok: false, reason: "invalidSignature" };

  return { ok: true, journal: parsedData };
};

/**
 * json をインポートして、新規ジャーナルを作成する関数
 */
export const importJournal = async (): Promise<JournalDetail | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return null;

    const fileUri = result.assets[0].uri;
    const file = new File(fileUri);
    const content = await file.text();

    const verified = await verifySignedJournal(JSON.parse(content));

    if (!verified.ok) {
      Alert.alert(
        i18n.t("error.importFailed"),
        verified.reason === "invalidFormat"
          ? i18n.t("error.importInvalidFormat")
          : i18n.t("error.importCannotImport"),
      );
      return null;
    }

    return verified.journal;
  } catch (error) {
    Alert.alert(i18n.t("error.importFailed"), i18n.t("error.importFailedMessage"));
    console.error("Import Failed:", error);
    return null;
  }
};

/**
 * 共有リンクの文字列を展開・検証してテンプレートに戻す
 * @param encoded 先頭に短縮した署名、続けて lz-string で圧縮したペイロード
 */
const decodeJournalLink = async (encoded: string): Promise<JournalTemplate | null> => {
  const signature = encoded.slice(0, TEMPLATE_LINK_SIGNATURE_LENGTH);
  // 展開できない文字列は空文字か null になる
  const payload = decompressFromEncodedURIComponent(encoded.slice(TEMPLATE_LINK_SIGNATURE_LENGTH));

  if (!payload) return null;

  const expected = (await generateSignature(payload)).slice(0, TEMPLATE_LINK_SIGNATURE_LENGTH);
  if (expected !== signature) return null;

  const validated = linkPayloadSchema.safeParse(JSON.parse(payload));
  if (!validated.success) return null;

  const [name, iconIndex, color, flags, notificationTime, fields] = validated.data;

  return {
    name,
    icon: JOURNAL_ICONS[iconIndex],
    color,
    oneEntry: (flags & 1) !== 0,
    locked: (flags & 2) !== 0,
    notificationTime,
    fields: fields.map(([typeIndex, label]) => ({
      type: fieldTypeSchema.options[typeIndex],
      label,
    })),
  };
};

/**
 * 共有リンクの文字列からジャーナルのテンプレートを読み込む関数
 * @param encoded リンクの t パラメータ
 */
export const importJournalFromLink = async (encoded: string): Promise<JournalTemplate | null> => {
  try {
    // 経由したアプリによって "+" が空白に変換されている場合があるため戻す
    const template = await decodeJournalLink(encoded.replaceAll(" ", "+"));

    if (template) return template;
  } catch (error) {
    console.warn("Import From Link Failed:", error);
  }

  Alert.alert(i18n.t("error.linkInvalidTitle"), i18n.t("error.linkInvalidMessage"));
  return null;
};
