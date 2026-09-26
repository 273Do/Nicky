import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, PlatformColor, useColorScheme } from "react-native";

import {
  Button,
  HStack,
  Host,
  Image,
  Link,
  Picker,
  ProgressView,
  ScrollView,
  Text,
  VStack,
} from "@expo/ui/swift-ui";
import {
  buttonStyle,
  clipShape,
  controlSize,
  disabled,
  font,
  foregroundStyle,
  frame,
  padding,
  pickerStyle,
  resizable,
  tag,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { Paths } from "expo-file-system";
import { useRouter } from "expo-router";

import { PRIVACY_URL, TERMS_URL } from "@/constants/legal";
import { FREE_ENTRY_LIMIT, FREE_JOURNAL_LIMIT, type PlanKey } from "@/constants/purchases";
import { useOfferings } from "@/hooks/purchases/use-offerings";
import { purchasePackage, restorePurchases } from "@/utils/purchases/purchase";

import { PaywallFeatureRow } from "./paywall-feature-row";

/**
 * Nicky Pro のペイウォール
 *
 * 価格はすべて RevenueCat から取得した priceString を表示する。
 */
export function PaywallView() {
  const { t } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const appIconUri = `${Paths.bundle.uri}${isDark ? "Nicky-app-icon-dark.png" : "Nicky-app-icon.png"}`;

  const { monthly, annual, loading, failed, reload } = useOfferings();
  const [plan, setPlan] = useState<PlanKey>("yearly");
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef(false);

  const selected = plan === "yearly" ? annual : monthly;

  const handlePurchase = async () => {
    if (processingRef.current || !selected) return;
    processingRef.current = true;
    setProcessing(true);
    try {
      if (await purchasePackage(selected)) router.back();
    } finally {
      processingRef.current = false;
      setProcessing(false);
    }
  };

  const handleRestore = async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    setProcessing(true);
    try {
      const restored = await restorePurchases();
      Alert.alert(
        restored ? t("purchases.restoredTitle") : t("purchases.restoredNoneTitle"),
        restored ? t("purchases.restoredMessage") : t("purchases.restoredNoneMessage"),
      );
      if (restored) router.back();
    } finally {
      processingRef.current = false;
      setProcessing(false);
    }
  };

  return (
    <Host
      style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
      useViewportSizeMeasurement
    >
      <ScrollView modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 })]}>
        <VStack alignment="center" modifiers={[padding({ top: 24, bottom: 28, horizontal: 32 })]}>
          <Image
            uiImage={appIconUri}
            modifiers={[
              resizable(),
              frame({ width: 72, height: 72 }),
              clipShape("roundedRectangle", 16),
              padding({ bottom: 16 }),
            ]}
          />
          <Text modifiers={[font({ size: 34, weight: "bold" }), padding({ bottom: 8 })]}>
            {t("purchases.title")}
          </Text>
          <Text
            modifiers={[
              foregroundStyle({ type: "color", color: PlatformColor("secondaryLabel") }),
              font({ size: 17 }),
            ]}
          >
            {t("purchases.subtitle")}
          </Text>
        </VStack>

        <VStack alignment="leading" modifiers={[padding({ horizontal: 32 })]}>
          <PaywallFeatureRow
            systemName="infinity"
            title={t("purchases.featureUnlimitedTitle")}
            description={t("purchases.featureUnlimitedDesc", {
              journals: FREE_JOURNAL_LIMIT,
              entries: FREE_ENTRY_LIMIT,
            })}
          />
          <PaywallFeatureRow
            systemName="checklist"
            title={t("purchases.featureFieldsTitle")}
            description={t("purchases.featureFieldsDesc")}
          />
          <PaywallFeatureRow
            systemName="paintpalette.fill"
            title={t("purchases.featureIconsTitle")}
            description={t("purchases.featureIconsDesc")}
          />
          <PaywallFeatureRow
            systemName="slider.horizontal.3"
            title={t("purchases.featureOptionsTitle")}
            description={t("purchases.featureOptionsDesc")}
          />
        </VStack>

        <VStack modifiers={[padding({ horizontal: 32, top: 8 })]}>
          {loading ? (
            <ProgressView modifiers={[tint(PlatformColor("systemIndigo"))]} />
          ) : failed ? (
            <VStack>
              <Text
                modifiers={[
                  foregroundStyle({ type: "color", color: PlatformColor("secondaryLabel") }),
                  font({ size: 15 }),
                  padding({ bottom: 8 }),
                ]}
              >
                {t("purchases.unavailable")}
              </Text>
              <Button
                label={t("purchases.retry")}
                onPress={() => void reload()}
                modifiers={[tint(PlatformColor("systemIndigo"))]}
              />
            </VStack>
          ) : (
            <VStack>
              <Picker
                selection={plan}
                onSelectionChange={setPlan}
                modifiers={[pickerStyle("segmented"), tint(PlatformColor("systemIndigo"))]}
              >
                {annual ? (
                  <Text modifiers={[tag("yearly")]}>
                    {`${t("purchases.yearly")} ${annual.product.priceString}`}
                  </Text>
                ) : null}
                {monthly ? (
                  <Text modifiers={[tag("monthly")]}>
                    {`${t("purchases.monthly")} ${monthly.product.priceString}`}
                  </Text>
                ) : null}
              </Picker>
            </VStack>
          )}
        </VStack>

        <VStack modifiers={[padding({ horizontal: 32, top: 20 })]}>
          <Button
            label={processing ? t("purchases.processing") : t("purchases.subscribe")}
            onPress={handlePurchase}
            modifiers={[
              buttonStyle("borderedProminent"),
              controlSize("large"),
              tint(PlatformColor("systemIndigo")),
              frame({ maxWidth: 9999 }),
              disabled(processing || !selected),
            ]}
          />
          <Button
            label={t("purchases.restore")}
            onPress={handleRestore}
            modifiers={[
              buttonStyle("plain"),
              foregroundStyle({ type: "color", color: PlatformColor("systemIndigo") }),
              font({ size: 15 }),
              padding({ top: 16 }),
              disabled(processing),
            ]}
          />
        </VStack>

        <VStack alignment="center" modifiers={[padding({ horizontal: 32, top: 20, bottom: 40 })]}>
          <Text
            modifiers={[
              foregroundStyle({ type: "color", color: PlatformColor("tertiaryLabel") }),
              font({ size: 12 }),
              padding({ bottom: 10 }),
            ]}
          >
            {t("purchases.autoRenewDesc")}
          </Text>
          <HStack>
            <Link
              label={t("support.termsOfService")}
              destination={TERMS_URL}
              modifiers={[
                foregroundStyle({ type: "color", color: PlatformColor("secondaryLabel") }),
                font({ size: 12 }),
              ]}
            />
            <Text
              modifiers={[
                foregroundStyle({ type: "color", color: PlatformColor("tertiaryLabel") }),
                font({ size: 12 }),
                padding({ horizontal: 6 }),
              ]}
            >
              {"|"}
            </Text>
            <Link
              label={t("support.privacyPolicy")}
              destination={PRIVACY_URL}
              modifiers={[
                foregroundStyle({ type: "color", color: PlatformColor("secondaryLabel") }),
                font({ size: 12 }),
              ]}
            />
          </HStack>
        </VStack>
      </ScrollView>
    </Host>
  );
}
