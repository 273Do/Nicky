import * as Crypto from "expo-crypto";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { JournalDetail } from "@/db/queries/journals";

const SIGNING_SECRET = process.env.EXPO_PUBLIC_SIGNING_SECRET!;

/**
 * データの署名を生成する
 * <秘密鍵 + データの SHA-256> ハッシュ
 */
const generateSignature = async (data: string): Promise<string> => {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${SIGNING_SECRET}:${data}`);
};

/**
 * 既存のジャーナルを ID を変えて署名付きで共有するための関数
 * @param journal エクスポートするジャーナルの元データ
 */
export const exportJournal = async (journal: JournalDetail) => {
  try {
    const file = new File(Paths.document, `${journal.name} template.json`);

    if (file.exists) {
      file.delete();
    }

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

    const signedExport = {
      data: exported,
      signature,
    };

    file.create();
    file.write(JSON.stringify(signedExport, null, 2));

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/json",
        dialogTitle: "Export journal template",
        UTI: "public.json",
      });
    }
  } catch (error) {
    console.error("Export failed:", error);
  }
};
