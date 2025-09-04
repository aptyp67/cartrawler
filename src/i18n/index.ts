import i18n, { type InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en/common.json";
import ru from "../locales/ru/common.json";

function detectInitialLanguage(): "en" | "ru" {
  const stored = (localStorage.getItem("lang") || "").toLowerCase();
  if (stored === "ru" || stored === "en") return stored as "en" | "ru";
  const nav = (navigator.language || navigator.languages?.[0] || "en").toLowerCase();
  if (nav.startsWith("ru")) return "ru";
  return "en";
}

const resources = {
  en: { common: en },
  ru: { common: ru },
} as const;

const options: InitOptions = {
  resources,
  lng: detectInitialLanguage(),
  fallbackLng: "en",
  supportedLngs: ["en", "ru"],
  ns: ["common"],
  defaultNS: "common",
  interpolation: { escapeValue: false },
  returnEmptyString: false,
};

i18n.use(initReactI18next).init(options).then(() => {
  const { language } = i18n;
  document.documentElement.lang = language.startsWith("ru") ? "ru" : "en";
  localStorage.setItem("lang", document.documentElement.lang);
});

i18n.on("languageChanged", (lng) => {
  const lang = lng.startsWith("ru") ? "ru" : "en";
  document.documentElement.lang = lang;
  localStorage.setItem("lang", lang);
});

export default i18n;

