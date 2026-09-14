import * as Notifications from "expo-notifications";

import i18n from "@/i18n";

const NOTIFICATION_ID_PREFIX = "journal-reminder-";

/** ジャーナルの通知識別子を生成 */
const getNotificationId = (journalId: string) => `${NOTIFICATION_ID_PREFIX}${journalId}`;

/**
 * 通知の権限をリクエストする
 * @returns 許可されたかどうか
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  });

  return status === "granted";
};

/**
 * フォアグラウンド時の通知表示ハンドラーを設定
 */
export const setupNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
};

/**
 * ジャーナルの通知本文を返す
 */
const getNotificationBody = (journalName: string): string => {
  if (i18n.language === "ja") {
    return `今日の${journalName}を記録しましょう。`;
  }
  return `Time to write in ${journalName}.`;
};

/**
 * ジャーナルの日次通知をスケジュールする
 * @param journalId ジャーナルID
 * @param journalName ジャーナル名
 * @param notificationTime 通知時刻
 */
export const scheduleJournalNotification = async (
  journalId: string,
  journalName: string,
  notificationTime: number,
): Promise<void> => {
  // 既存の通知をキャンセル
  await cancelJournalNotification(journalId);

  const date = new Date(notificationTime);

  await Notifications.scheduleNotificationAsync({
    identifier: getNotificationId(journalId),
    content: {
      title: "Nicky",
      body: getNotificationBody(journalName),
      data: { journalId, journalName },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: date.getHours(),
      minute: date.getMinutes(),
    },
  });
};

/**
 * ジャーナルの通知をキャンセルする
 * @param journalId ジャーナルID
 */
export const cancelJournalNotification = async (journalId: string): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(getNotificationId(journalId));
};

/**
 * すべてのジャーナル通知をキャンセルする
 */
export const cancelAllJournalNotifications = async (): Promise<void> => {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduled) {
    if (notification.identifier.startsWith(NOTIFICATION_ID_PREFIX)) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
};
