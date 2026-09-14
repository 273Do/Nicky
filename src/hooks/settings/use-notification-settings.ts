import { setSetting, useSettingsQuery } from "@/db/queries/settings";

const KEY = "notification_enabled";

/**
 * グローバル通知設定を読み書きするフック
 */
export const useNotificationSettings = () => {
  const { data: rows } = useSettingsQuery();

  const notificationEnabled = (rows.find((r) => r.key === KEY)?.value ?? "true") === "true";

  const setNotificationEnabled = async (enabled: boolean) => {
    await setSetting(KEY, String(enabled));
  };

  return { notificationEnabled, setNotificationEnabled } as const;
};
