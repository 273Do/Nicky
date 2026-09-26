import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, PlatformColor } from "react-native";

import { Button, HStack, Section, Spacer, Text } from "@expo/ui/swift-ui";
import { foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import { useRouter } from "expo-router";

import { useSubscription } from "@/hooks/purchases/use-subscription";
import { openManageSubscription, restorePurchases } from "@/utils/purchases/purchase";

/**
 * Nicky Pro の購読状況セクション
 */
export function Subscription() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isPro, loading } = useSubscription();
  const [restoring, setRestoring] = useState(false);
  const restoringRef = useRef(false);

  const handleRestore = async () => {
    if (restoringRef.current) return;
    restoringRef.current = true;
    setRestoring(true);
    try {
      const restored = await restorePurchases();
      Alert.alert(
        restored ? t("purchases.restoredTitle") : t("purchases.restoredNoneTitle"),
        restored ? t("purchases.restoredMessage") : t("purchases.restoredNoneMessage"),
      );
    } finally {
      restoringRef.current = false;
      setRestoring(false);
    }
  };

  return (
    <Section>
      <Button
        onPress={() => {
          if (isPro) {
            void openManageSubscription();
            return;
          }
          router.navigate("/days/paywall");
        }}
        modifiers={[foregroundStyle({ type: "color", color: PlatformColor("label") })]}
      >
        <HStack>
          <Text>{t("purchases.title")}</Text>
          <Spacer />
          <Text
            modifiers={[foregroundStyle({ type: "color", color: PlatformColor("secondaryLabel") })]}
          >
            {loading ? "" : isPro ? t("purchases.statusActive") : t("purchases.upgrade")}
          </Text>
        </HStack>
      </Button>
      {isPro ? (
        <Button
          onPress={() => void openManageSubscription()}
          modifiers={[foregroundStyle({ type: "color", color: PlatformColor("systemIndigo") })]}
        >
          <Text>{t("purchases.manage")}</Text>
        </Button>
      ) : null}
      <Button
        onPress={handleRestore}
        modifiers={[foregroundStyle({ type: "color", color: PlatformColor("systemIndigo") })]}
      >
        <Text>{restoring ? t("purchases.restoring") : t("purchases.restore")}</Text>
      </Button>
    </Section>
  );
}
