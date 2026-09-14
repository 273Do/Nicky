import { useEffect, useRef } from "react";

import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { getJournalsQuery } from "@/db/queries/journals";
import { useNotificationSettings } from "@/hooks/settings/use-notification-settings";
import {
  cancelAllJournalNotifications,
  requestNotificationPermission,
  scheduleJournalNotification,
  setupNotificationHandler,
} from "@/utils/notification";

/**
 * ジャーナルの通知をスケジュール・同期するフック
 *
 * - グローバル通知設定が ON かつジャーナルに notificationTime が設定されている場合にスケジュール
 * - ジャーナルの変更やグローバル設定の変更に応じて自動的に再同期
 */
export const useJournalNotifications = () => {
  const { notificationEnabled } = useNotificationSettings();
  const { data: journals } = useLiveQuery(getJournalsQuery);
  const syncing = useRef(false);

  useEffect(() => {
    if (syncing.current) return;
    syncing.current = true;

    (async () => {
      try {
        if (!notificationEnabled) {
          await cancelAllJournalNotifications();
          return;
        }

        const granted = await requestNotificationPermission();
        if (!granted) return;

        setupNotificationHandler();

        // すべてのジャーナル通知をキャンセルしてから再スケジュール
        await cancelAllJournalNotifications();

        for (const journal of journals) {
          if (journal.notificationTime != null) {
            await scheduleJournalNotification(journal.id, journal.name, journal.notificationTime);
          }
        }
      } catch (e) {
        console.warn("[journal-notifications]", e);
      } finally {
        syncing.current = false;
      }
    })();
  }, [notificationEnabled, journals]);
};
