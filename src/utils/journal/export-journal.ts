import { Alert } from "react-native";

import * as Crypto from "expo-crypto";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import JSZip from "jszip";
import { z } from "zod";

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
    file.write(JSON.stringify(signedExport, null, 2));

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/json",
        dialogTitle: i18n.t("settings.exportJournalDialogTitle"),
        UTI: "public.json",
      });
    }
  } catch (error) {
    Alert.alert(i18n.t("error.exportFailed"), i18n.t("error.exportFailedMessage"));
    console.error("Export Failed:", error);
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
    file.write(uint8);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/zip",
        dialogTitle: i18n.t("settings.exportAllJournals"),
        UTI: "com.pkware.zip-archive",
      });
    }
  } catch (error) {
    Alert.alert(i18n.t("error.exportFailed"), i18n.t("error.exportFailedMessage"));
    console.error("Export All Journals Failed:", error);
  }
};
