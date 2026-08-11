import { Alert } from "react-native";

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

    const parsedData: JournalDetail = parsed.data;
    const signature: string = parsed.signature;

    if (!parsedData || !signature) {
      Alert.alert("Import Failed", "Invalid file format.");
      return null;
    }

    const expected = await generateSignature(JSON.stringify(parsedData));

    // HMAC
    if (expected !== signature) {
      Alert.alert("Import Failed", "This file cannot be imported.");
      return null;
    }

    return parsedData;
  } catch (error) {
    Alert.alert("Import Failed", "An error occurred while importing the journal.");
    console.error("Import Failed:", error);
    return null;
  }
};
