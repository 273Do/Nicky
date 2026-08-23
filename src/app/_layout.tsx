import "@/i18n";
import "@/polyfills";
import React, { useEffect } from "react";

import { downloadModel } from "@react-native-ai/llama";

import AppTabs from "@/components/app-tabs";
import { DrizzleProvider } from "@/components/drizzle-provider";
import { AI_MODEL } from "@/constants/ai-models";
import { useAutoReflection } from "@/hooks/settings/use-auto-reflection";

function AppContent() {
  useAutoReflection();

  useEffect(() => {
    downloadModel(AI_MODEL.gguf).catch((e) => console.warn("[model-download]", e));
  }, []);

  return <AppTabs />;
}

export default function RootLayout() {
  return (
    <DrizzleProvider>
      <AppContent />
    </DrizzleProvider>
  );
}
