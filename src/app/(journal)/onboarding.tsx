import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlatformColor } from "react-native";

import {
  Button,
  HStack,
  Host,
  Image,
  ProgressView,
  ScrollView,
  Text,
  Toggle,
  VStack,
} from "@expo/ui/swift-ui";
import {
  buttonStyle,
  controlSize,
  disabled,
  font,
  foregroundStyle,
  frame,
  padding,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { downloadModel } from "@react-native-ai/llama";
import { useRouter } from "expo-router";

import { AI_MODEL } from "@/constants/ai-models";
import { setSetting } from "@/db/queries/settings";
import { useAIReflectionSettings } from "@/hooks/settings/use-ai-reflection-settings";

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setAIReflectionEnabled } = useAIReflectionSettings();

  const [aiEnabled, setAiEnabled] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleToggle = async (enabled: boolean) => {
    setAiEnabled(enabled);
    await setAIReflectionEnabled(enabled);
    if (enabled) {
      setDownloading(true);
      try {
        await downloadModel(AI_MODEL.gguf, (p) => setProgress(p.percentage));
      } catch (e) {
        console.warn("[model-download]", e);
      }
      setDownloading(false);
    }
  };

  const handleGetStarted = async () => {
    await setSetting("onboarding_completed", "true");
    router.back();
  };

  return (
    <Host
      style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
      useViewportSizeMeasurement
    >
      <VStack modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 })]}>
        <ScrollView modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 })]}>
          <VStack alignment="center" modifiers={[padding({ top: 60, bottom: 24, horizontal: 32 })]}>
            <Image
              systemName="book.fill"
              modifiers={[
                foregroundStyle({ type: "color", color: PlatformColor("systemIndigo") }),
                font({ size: 56 }),
                padding({ bottom: 16 }),
              ]}
            />
            <Text modifiers={[font({ size: 34, weight: "bold" }), padding({ bottom: 8 })]}>
              {t("onboarding.welcome")}
            </Text>
            <Text
              modifiers={[
                foregroundStyle({ type: "color", color: PlatformColor("secondaryLabel") }),
                font({ size: 17 }),
              ]}
            >
              {t("onboarding.welcomeDesc")}
            </Text>
          </VStack>

          <VStack alignment="leading" modifiers={[padding({ horizontal: 32, top: 16 })]}>
            <HStack alignment="top" modifiers={[padding({ bottom: 24 })]}>
              <Image
                systemName="book.fill"
                modifiers={[
                  foregroundStyle({ type: "color", color: PlatformColor("systemIndigo") }),
                  font({ size: 28 }),
                  frame({ width: 40, height: 40 }),
                ]}
              />
              <VStack alignment="leading" modifiers={[padding({ leading: 12 })]}>
                <Text modifiers={[font({ size: 17, weight: "semibold" }), padding({ bottom: 2 })]}>
                  {t("onboarding.journalTitle")}
                </Text>
                <Text
                  modifiers={[
                    foregroundStyle({ type: "color", color: PlatformColor("secondaryLabel") }),
                    font({ size: 15 }),
                  ]}
                >
                  {t("onboarding.journalDesc")}
                </Text>
              </VStack>
            </HStack>

            <HStack alignment="top" modifiers={[padding({ bottom: 24 })]}>
              <Image
                systemName="sparkles"
                modifiers={[
                  foregroundStyle({ type: "color", color: PlatformColor("systemOrange") }),
                  font({ size: 28 }),
                  frame({ width: 40, height: 40 }),
                ]}
              />
              <VStack alignment="leading" modifiers={[padding({ leading: 12 })]}>
                <Text modifiers={[font({ size: 17, weight: "semibold" }), padding({ bottom: 2 })]}>
                  {t("onboarding.reflectionTitle")}
                </Text>
                <Text
                  modifiers={[
                    foregroundStyle({ type: "color", color: PlatformColor("secondaryLabel") }),
                    font({ size: 15 }),
                  ]}
                >
                  {t("onboarding.reflectionDesc")}
                </Text>
              </VStack>
            </HStack>

            <HStack alignment="top" modifiers={[padding({ bottom: 24 })]}>
              <Image
                systemName="magnifyingglass"
                modifiers={[
                  foregroundStyle({ type: "color", color: PlatformColor("systemTeal") }),
                  font({ size: 28 }),
                  frame({ width: 40, height: 40 }),
                ]}
              />
              <VStack alignment="leading" modifiers={[padding({ leading: 12 })]}>
                <Text modifiers={[font({ size: 17, weight: "semibold" }), padding({ bottom: 2 })]}>
                  {t("onboarding.searchTitle")}
                </Text>
                <Text
                  modifiers={[
                    foregroundStyle({ type: "color", color: PlatformColor("secondaryLabel") }),
                    font({ size: 15 }),
                  ]}
                >
                  {t("onboarding.searchDesc")}
                </Text>
              </VStack>
            </HStack>
          </VStack>

          <VStack modifiers={[padding({ horizontal: 32, top: 8 })]}>
            <Toggle
              isOn={aiEnabled}
              onIsOnChange={handleToggle}
              label={t("onboarding.enableReflection")}
              modifiers={[tint(PlatformColor("systemIndigo"))]}
            />
            {downloading ? (
              <VStack modifiers={[padding({ top: 8 })]}>
                <ProgressView value={progress / 100} />
                <Text
                  modifiers={[
                    foregroundStyle({ type: "color", color: PlatformColor("secondaryLabel") }),
                    font({ size: 13 }),
                    padding({ top: 4 }),
                  ]}
                >
                  {`${t("onboarding.downloadingModel")} ${Math.round(progress)}%`}
                </Text>
              </VStack>
            ) : null}
          </VStack>
        </ScrollView>

        <VStack modifiers={[padding({ horizontal: 32, bottom: 40, top: 16 })]}>
          <Button
            label={t("onboarding.getStarted")}
            onPress={handleGetStarted}
            modifiers={[
              buttonStyle("borderedProminent"),
              controlSize("large"),
              tint(PlatformColor("systemIndigo")),
              frame({ maxWidth: 9999 }),
              disabled(downloading),
            ]}
          />
        </VStack>
      </VStack>
    </Host>
  );
}
