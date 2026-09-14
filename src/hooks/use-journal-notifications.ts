import { useEffect, useRef } from "react";

import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

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
 * - 通知タップ時にエントリー作成画面へ遷移
 */
export const useJournalNotifications = () => {
  const { notificationEnabled } = useNotificationSettings();
  const { data: journals } = useLiveQuery(getJournalsQuery);
  const syncing = useRef(false);
  const router = useRouter();

  // 通知タップ時はエントリー作成画面に遷移
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const { journalId, journalName } = response.notification.request.content.data as {
        journalId?: string;
        journalName?: string;
      };
      if (journalId && journalName) {
        router.push({
          pathname: "/entry/create",
          params: { journalId, journalName },
        });
      }
    });

    return () => subscription.remove();
  }, [router]);

  // 通知スケジュールの同期
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
