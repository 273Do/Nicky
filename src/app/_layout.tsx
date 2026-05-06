import React from "react";

import AppTabs from "@/components/app-tabs";
import { DrizzleProvider } from "@/components/drizzle-provider";

export default function RootLayout() {
  return (
    <DrizzleProvider>
      <AppTabs />
    </DrizzleProvider>
  );
}
