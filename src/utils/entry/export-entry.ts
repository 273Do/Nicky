import { Alert } from "react-native";

import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import JSZip from "jszip";

import { db } from "@/db/client";
import { EntryDetailObj } from "@/db/queries/entries";
import i18n from "@/i18n";

import { formatFieldValue } from "./preview";

/**
 * エントリー1件分のテキストを生成する
 * @param entry エクスポートするエントリーの元データ
 * @param journalName ジャーナル名
 */
const buildEntryText = (entry: EntryDetailObj, journalName: string): string => {
  const lines = [...entry.values]
    .sort((a, b) => a.field.sortOrder - b.field.sortOrder)
    .map((v) => `${v.field.label}: ${formatFieldValue(v.value, v.field.type)}`)
    .join("\n");

  const date = new Date(entry.createdAt).toLocaleDateString();
  return `[${journalName}] ${date}\n\n${lines}`;
};

/**
 * エントリーをテキスト形式で書き出すための関数
 * @param entry エクスポートするエントリーの元データ
 * @param journalName ジャーナル名
 */
export const exportEntry = async (entry: EntryDetailObj, journalName: string): Promise<void> => {
  try {
    const content = buildEntryText(entry, journalName);
    const date = new Date(entry.createdAt).toLocaleDateString();
    const fileName = `${journalName}_${date.replace(/\//g, "-")}.txt`;
    const file = new File(Paths.document, fileName);

    if (file.exists) file.delete();
    file.create();
    file.write(content);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: "text/plain",
        dialogTitle: i18n.t("settings.exportEntryDialogTitle"),
        UTI: "public.plain-text",
      });
    }
  } catch (error) {
    Alert.alert(i18n.t("error.exportFailed"), i18n.t("error.exportFailedMessage"));
    console.error("Export Entry Failed:", error);
  }
};

/**
 * すべてのエントリーをジャーナルごとにフォルダ分けして zip で書き出すための関数
 */
export const exportAllEntries = async (): Promise<void> => {
  try {
    const journals = await db.query.journals.findMany({
      with: {
        entries: {
          with: { values: { with: { field: true } } },
        },
      },
    });

    const zip = new JSZip();
    let totalEntries = 0;

    for (const journal of journals) {
      if (journal.entries.length === 0) continue;

      const folder = zip.folder(journal.name)!;

      for (const entry of journal.entries) {
        const content = buildEntryText(entry, journal.name);
        const date = new Date(entry.createdAt).toLocaleDateString().replace(/\//g, "-");
        folder.file(`${date}_${entry.id.slice(0, 8)}.txt`, content);
        totalEntries++;
      }
    }

    if (totalEntries === 0) return;

    const uint8 = await zip.generateAsync({ type: "uint8array" });

    const file = new File(Paths.document, "entries.zip");
    if (file.exists) file.delete();
    file.create();
    file.write(uint8);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/zip",
        dialogTitle: i18n.t("settings.exportAllEntries"),
        UTI: "com.pkware.zip-archive",
      });
    }
  } catch (error) {
    Alert.alert(i18n.t("error.exportFailed"), i18n.t("error.exportFailedMessage"));
    console.error("Export All Entries Failed:", error);
  }
};
