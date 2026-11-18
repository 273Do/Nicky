import { Alert } from "react-native";

import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import JSZip from "jszip";

import { db } from "@/db/client";
import { DailyEntryObj, EntryDetailObj } from "@/db/queries/entries";
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
    await file.write(content);

    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "text/plain",
          dialogTitle: i18n.t("settings.exportEntryDialogTitle"),
          UTI: "public.plain-text",
        });
      }
    } finally {
      file.delete();
    }
  } catch (error) {
    Alert.alert(i18n.t("error.exportFailed"), i18n.t("error.exportFailedMessage"));
    console.error("Export Entry Failed:", error);
  }
};

/**
 * エントリー一覧をジャーナル名フォルダ付きで zip に詰めて共有する
 * @param journals ジャーナル一覧
 * @param fileName 出力ファイル名
 * @param dialogTitle ダイアログタイトル
 */
const exportEntriesAsZip = async (
  journals: { name: string; entries: EntryDetailObj[] }[],
  fileName: string,
  dialogTitle: string,
): Promise<void> => {
  try {
    const zip = new JSZip();
    let totalEntries = 0;

    for (const journal of journals) {
      const { name, entries } = journal;
      if (entries.length === 0) continue;

      const folder = zip.folder(name)!;

      for (const entry of entries) {
        const content = buildEntryText(entry, name);
        const date = new Date(entry.createdAt).toISOString().slice(0, 10);
        folder.file(`${date}_${entry.id.slice(0, 8)}.txt`, content);
        totalEntries++;
      }
    }

    if (totalEntries === 0) return;

    const uint8 = await zip.generateAsync({ type: "uint8array" });

    const file = new File(Paths.document, fileName);
    if (file.exists) file.delete();
    file.create();
    await file.write(uint8);

    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "application/zip",
          dialogTitle,
          UTI: "com.pkware.zip-archive",
        });
      }
    } finally {
      file.delete();
    }
  } catch (error) {
    Alert.alert(i18n.t("error.exportFailed"), i18n.t("error.exportFailedMessage"));
    console.error("Export Entries Failed:", error);
  }
};

/**
 * 指定のジャーナルのすべてのエントリーを zip で書き出すための関数
 * @param journalId - ジャーナルID
 * @param journalName - ジャーナル名
 */
export const exportJournalEntries = async (
  journalId: string,
  journalName: string,
): Promise<void> => {
  const entries = await db.query.entries.findMany({
    where: (e, { eq }) => eq(e.journalId, journalId),
    with: { values: { with: { field: true } } },
  });

  await exportEntriesAsZip(
    [{ name: journalName, entries }],
    `${journalName}_entries.zip`,
    i18n.t("settings.exportAllEntries"),
  );
};

/**
 * すべてのエントリーをジャーナルごとにフォルダ分けして zip で書き出すための関数
 */
export const exportAllEntries = async (): Promise<void> => {
  const journals = await db.query.journals.findMany({
    with: {
      entries: {
        with: { values: { with: { field: true } } },
      },
    },
  });

  await exportEntriesAsZip(journals, "entries.zip", i18n.t("settings.exportAllEntries"));
};

/**
 * 指定日のエントリーをジャーナルごとにフォルダ分けして zip で書き出すための関数
 * @param entries 指定日のエントリー一覧
 * @param date 対象日
 */
export const exportDayEntries = async (entries: DailyEntryObj[], date: Date): Promise<void> => {
  const byJournal = new Map<string, { name: string; entries: EntryDetailObj[] }>();
  for (const entry of entries) {
    const group = byJournal.get(entry.journal.id);
    if (group) group.entries.push(entry);
    else byJournal.set(entry.journal.id, { name: entry.journal.name, entries: [entry] });
  }

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  await exportEntriesAsZip(
    [...byJournal.values()],
    `${y}-${m}-${d}_entries.zip`,
    i18n.t("entry.exportDayEntries"),
  );
};
