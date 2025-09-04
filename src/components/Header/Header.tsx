import { useTheme } from "../../theme";
import { useTranslation } from "react-i18next";
import "./Header.css";

export default function Header() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("ru") ? "ru" : "en";
/*   const nextLang = lang === "ru" ? "en" : "ru"; */
  const nextLangName = nextLang === "ru" ? t("header.lang_ru") : t("header.lang_en");

  return (
    <header className="topbar">
      <h1 className="brand">{t("header.title")}</h1>
      <div className="topbar-actions">
        <button
          className="btn btn--secondary"
          onClick={() => i18n.changeLanguage(nextLang)}
          aria-label={t("header.switch_language", { langName: nextLangName })}
          title={nextLang.toUpperCase()}
        >
          {lang.toUpperCase()}
        </button>
        <button
          className="btn btn--secondary"
          onClick={toggle}
          aria-label={isDark ? t("header.switch_to_light") : t("header.switch_to_dark")}
          title={isDark ? t("header.light") : t("header.dark")}
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
