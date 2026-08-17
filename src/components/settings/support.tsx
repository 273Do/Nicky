import { useTranslation } from "react-i18next";

import { Section, Text } from "@expo/ui/swift-ui";
import { padding } from "@expo/ui/swift-ui/modifiers";

export function Support() {
  const { t } = useTranslation();

  return (
    <Section footer={<Text modifiers={[padding({ bottom: 10 })]}>Nicky Version 1.0.0</Text>}>
      <Text>{t("support.support")}</Text>
      <Text>{t("support.rateOnAppStore")}</Text>
      <Text>{t("support.termsOfService")}</Text>
      <Text>{t("support.privacyPolicy")}</Text>
      <Text>{t("support.acknowledgements")}</Text>
    </Section>
  );
}
