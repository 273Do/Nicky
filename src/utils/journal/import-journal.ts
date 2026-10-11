import { Alert } from "react-native";

import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { decompressFromEncodedURIComponent } from "lz-string";
import { z } from "zod";

import { journalIconSchema } from "@/constants/journal";
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

/** 署名付きデータの検証結果 */
type VerifyResult =
  | { ok: true; journal: JournalDetail }
  | { ok: false; reason: "invalidFormat" | "invalidSignature" };

/**
 * 署名付きのエクスポートデータを検証する（ファイル・リンク共通）
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
 * 共有リンクの文字列からジャーナルを読み込む関数
 *
 * 中身はファイルと同じ署名付きデータなので、展開後は同じ検証を行う
 * @param encoded リンクの t パラメータ（lz-string で圧縮された文字列）
 */
export const importJournalFromLink = async (encoded: string): Promise<JournalDetail | null> => {
  try {
    // 経由したアプリによって "+" が空白に変換されている場合があるため戻す。
    // 展開できない文字列は空文字か null になる
    const content = decompressFromEncodedURIComponent(encoded.replaceAll(" ", "+"));
    const verified = content ? await verifySignedJournal(JSON.parse(content)) : null;

    if (verified?.ok) return verified.journal;
  } catch (error) {
    console.warn("Import From Link Failed:", error);
  }

  Alert.alert(i18n.t("error.linkInvalidTitle"), i18n.t("error.linkInvalidMessage"));
  return null;
};
