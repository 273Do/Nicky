import { initReactI18next } from "react-i18next";

import { getLocales } from "expo-localization";
import i18n from "i18next";

import en from "./locales/en.json";
import ja from "./locales/ja.json";

const deviceLang = getLocales()[0]?.languageCode ?? "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ja: { translation: ja },
  },
  lng: deviceLang === "ja" ? "ja" : "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
