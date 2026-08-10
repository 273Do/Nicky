import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";

import { JournalDetail } from "@/db/queries/journals";
import { generateSignature } from "@/utils/days/export-journal";

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

    const parsed = JSON.parse(content);

    if (!parsed.data || !parsed.signature) {
      console.error("インポート失敗: 無効なファイル形式");
      return null;
    }

    const expected = await generateSignature(JSON.stringify(parsed.data));

    // HMAC
    if (expected !== parsed.signature) {
      console.error("インポート失敗: 署名が一致しません");
      return null;
    }

    return parsed.data as JournalDetail;
  } catch (error) {
    console.error("インポート失敗:", error);
    return null;
  }
};
