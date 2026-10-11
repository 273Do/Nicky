import { Alert, Share } from "react-native";

import * as Crypto from "expo-crypto";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import JSZip from "jszip";
import { compressToEncodedURIComponent } from "lz-string";
import { z } from "zod";

import {
  fieldTypeSchema,
  JOURNAL_ICONS,
  TEMPLATE_LINK_BASE,
  TEMPLATE_LINK_SIGNATURE_LENGTH,
} from "@/constants/journal";
import { db } from "@/db/client";
import { JournalDetail } from "@/db/queries/journals";
import i18n from "@/i18n";

const SIGNING_SECRET = z.string().min(1).parse(process.env.EXPO_PUBLIC_SIGNING_SECRET);

/**
 * データの署名を生成する
 * <秘密鍵 + データの SHA-256> ハッシュ
 */
export const generateSignature = async (data: string): Promise<string> => {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${SIGNING_SECRET}:${data}`);
};

/**
 * ジャーナル1件分の署名付きエクスポートデータを生成する
 */
const buildSignedJournal = async (journal: JournalDetail) => {
  const newJournalId = Crypto.randomUUID();

  const exported: JournalDetail = {
    ...journal,
    id: newJournalId,
    fields: journal.fields.map((field) => ({
      ...field,
      id: Crypto.randomUUID(),
      journalId: newJournalId,
    })),
  };

  const dataString = JSON.stringify(exported);
  const signature = await generateSignature(dataString);

  return { data: exported, signature };
};

/**
 * 既存のジャーナルを ID を変えて署名付きで共有するための関数
 * @param journal エクスポートするジャーナルの元データ
 */
export const exportJournal = async (journal: JournalDetail): Promise<void> => {
  try {
    const file = new File(Paths.document, `${journal.name} template.json`);

    if (file.exists) {
      file.delete();
    }

    const signedExport = await buildSignedJournal(journal);

    file.create();
    await file.write(JSON.stringify(signedExport, null, 2));

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/json",
        dialogTitle: i18n.t("settings.exportJournalDialogTitle"),
        UTI: "public.json",
      });
    }

    file.delete();
  } catch (error) {
    Alert.alert(i18n.t("error.exportFailed"), i18n.t("error.exportFailedMessage"));
    console.error("Export Failed:", error);
  }
};

/**
 * 共有リンク用のコンパクトなペイロードを生成する
 *
 * URL を短くするため、テンプレートに必要な値だけをキーなしの配列にする。
 * ID・日時・表示順は読み込み時に再生成できるため含めない。
 * アイコンとフィールド種別は一覧のインデックスで表す
 *
 * 形式: `[name, iconIndex, color, flags, notificationTime, [[typeIndex, label], ...]]`
 * - flags: bit0 = oneEntry, bit1 = locked
 */
const buildJournalLinkPayload = (journal: JournalDetail): string => {
  const { name, icon, color, oneEntry, locked, notificationTime, fields } = journal;

  return JSON.stringify([
    name,
    JOURNAL_ICONS.indexOf(icon),
    color,
    (oneEntry ? 1 : 0) | (locked ? 2 : 0),
    notificationTime,
    [...fields]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(({ type, label }) => [fieldTypeSchema.options.indexOf(type), label]),
  ]);
};

/**
 * 既存のジャーナルを署名付きで、リンクとして共有するための関数
 *
 * コンパクトなペイロードを lz-string で URL セーフな文字列に圧縮し、
 * 先頭に短縮した署名を付けてクエリパラメータに載せる
 * @param journal 共有するジャーナルの元データ
 */
export const shareJournalLink = async (journal: JournalDetail): Promise<void> => {
  try {
    const payload = buildJournalLinkPayload(journal);
    const signature = (await generateSignature(payload)).slice(0, TEMPLATE_LINK_SIGNATURE_LENGTH);
    console.log(payload, signature);
    const encoded = signature + compressToEncodedURIComponent(payload);

    // lz-string の出力に含まれる "+" はクエリでは空白と解釈されうるため、エスケープする
    await Share.share({ message: `${TEMPLATE_LINK_BASE}?t=${encodeURIComponent(encoded)}` });
  } catch (error) {
    Alert.alert(i18n.t("error.exportFailed"), i18n.t("error.exportFailedMessage"));
    console.error("Share Journal Link Failed:", error);
  }
};

/**
 * 既存のジャーナルをすべて書き出し zip にまとめるための関数
 */
export const exportAllJournals = async (): Promise<void> => {
  try {
    const journals = await db.query.journals.findMany({ with: { fields: true } });

    if (journals.length === 0) return;

    const zip = new JSZip();

    for (const journal of journals) {
      const signedExport = await buildSignedJournal(journal);
      zip.file(`${journal.name} template.json`, JSON.stringify(signedExport, null, 2));
    }

    const uint8 = await zip.generateAsync({ type: "uint8array" });

    const file = new File(Paths.document, "journals.zip");
    if (file.exists) file.delete();
    file.create();
    await file.write(uint8);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/zip",
        dialogTitle: i18n.t("settings.exportAllJournals"),
        UTI: "com.pkware.zip-archive",
      });
    }

    file.delete();
  } catch (error) {
    Alert.alert(i18n.t("error.exportFailed"), i18n.t("error.exportFailedMessage"));
    console.error("Export All Journals Failed:", error);
  }
};
