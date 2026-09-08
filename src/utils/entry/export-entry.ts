import { Alert } from "react-native";

import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { EntryDetailObj } from "@/db/queries/entries";
import i18n from "@/i18n";

import { formatFieldValue } from "./preview";

/**
 * エントリーをテキスト形式で書き出すための関数
 * @param entry エクスポートするエントリーの元データ
 * @param journalName ジャーナル名
 */
export const exportEntry = async (entry: EntryDetailObj, journalName: string): Promise<void> => {
  try {
    const lines = [...entry.values]
      .sort((a, b) => a.field.sortOrder - b.field.sortOrder)
      .map((v) => `${v.field.label}: ${formatFieldValue(v.value, v.field.type)}`)
      .join("\n");

    const date = new Date(entry.createdAt).toLocaleDateString();
    const content = `[${journalName}] ${date}\n\n${lines}`;

    const fileName = `${journalName}_${date.replace(/\//g, "-")}.txt`;
    const file = new File(Paths.document, fileName);

    if (file.exists) file.delete();
    file.create();
    file.write(content);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: "text/plain",
        UTI: "public.plain-text",
      });
    }
  } catch (error) {
    Alert.alert(i18n.t("error.exportFailed"), i18n.t("error.exportFailedMessage"));
    console.error("Export Entry Failed:", error);
  }
};
