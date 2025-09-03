import { useTheme } from "../theme";
import "./Header.css";

export default function Header() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="topbar">
      <h1 className="brand">Car availability</h1>
      <button
        className="btn btn--secondary"
        onClick={toggle}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        title={isDark ? "Light theme" : "Dark theme"}
      >
        {isDark ? "☀️" : "🌙"}
      </button>
    </header>
  );
}
