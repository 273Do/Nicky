import * as LocalAuthentication from "expo-local-authentication";

import i18n from "@/i18n";

/**
 * Face ID / Touch ID で認証を行う
 */
export const authenticate = async (): Promise<boolean> => {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: i18n.t("journal.authPrompt"),
  });
  return result.success;
};
