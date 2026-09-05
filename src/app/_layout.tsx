import "@/i18n";
import "@/polyfills";
import React from "react";

import AppTabs from "@/components/app-tabs";
import { DrizzleProvider } from "@/components/drizzle-provider";
import { useAutoReflection } from "@/hooks/settings/use-auto-reflection";

function AppContent() {
  useAutoReflection();

  return <AppTabs />;
}

export default function RootLayout() {
  return (
    <DrizzleProvider>
      <AppContent />
    </DrizzleProvider>
  );
}
