import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/en/translation.json";
import translationID from "./locales/id/translation.json";
import translationJP from "./locales/jp/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  id: {
    translation: translationID,
  },
  jp: {
    translation: translationJP,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
