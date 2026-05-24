import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { getJournalsQuery } from "@/db/queries/journals";
import { chunkArray } from "@/utils/chunk-array";

/**
 * ジャーナル一覧を取得し、2列グリッド用に行分割するフック
 */
export const useJournalList = () => {
  const { data } = useLiveQuery(getJournalsQuery);
  const journals = data ?? [];
  const rows = chunkArray(journals, 2);
  return { rows };
};
