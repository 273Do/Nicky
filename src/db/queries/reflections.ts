import { eq } from "drizzle-orm";
import * as Crypto from "expo-crypto";

import type { ReflectionResult } from "@/constants/reflection";
import { db } from "@/db/client";
import { reflections } from "@/db/schemas";
import { startOfDayTimestamp } from "@/utils/date";

/**
 * 指定日の振り返りを取得するクエリ（useLiveQuery 用）
 */
export const getReflectionByDateQuery = (date: Date) =>
  db.query.reflections.findFirst({
    where: eq(reflections.date, startOfDayTimestamp(date)),
  });

/**
 * 振り返りを保存する (upsert)
 */
export const storeReflection = async (date: Date, result: ReflectionResult): Promise<void> => {
  await db.transaction(async (tx) => {
    await tx
      .insert(reflections)
      .values({
        id: Crypto.randomUUID(),
        date: startOfDayTimestamp(date),
        title: result.title,
        firstCategory: result.items[0].category,
        firstContent: result.items[0].content,
        secondCategory: result.items[1].category,
        secondContent: result.items[1].content,
      })
      .onConflictDoUpdate({
        target: reflections.date,
        set: {
          title: result.title,
          firstCategory: result.items[0].category,
          firstContent: result.items[0].content,
          secondCategory: result.items[1].category,
          secondContent: result.items[1].content,
        },
      });
  });
};

/**
 * 指定日の振り返りを削除する
 */
export const deleteReflection = async (date: Date): Promise<void> => {
  await db.transaction(async (tx) => {
    await tx.delete(reflections).where(eq(reflections.date, startOfDayTimestamp(date)));
  });
};
