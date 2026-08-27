import { Alert } from "react-native";

import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
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

    const validated = importFileSchema.safeParse(parsed);

    if (!validated.success) {
      Alert.alert(i18n.t("error.importFailed"), i18n.t("error.importInvalidFormat"));
      return null;
    }

    const { data: parsedData, signature } = validated.data;

    const expected = await generateSignature(JSON.stringify(parsedData));

    // HMAC
    if (expected !== signature) {
      Alert.alert(i18n.t("error.importFailed"), i18n.t("error.importCannotImport"));
      return null;
    }

    return parsedData;
  } catch (error) {
    Alert.alert(i18n.t("error.importFailed"), i18n.t("error.importFailedMessage"));
    console.error("Import Failed:", error);
    return null;
  }
};
