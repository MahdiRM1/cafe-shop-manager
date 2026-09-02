import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="تغییر تم"
      className="w-9 h-9 flex items-center justify-center rounded-lg
      border border-gray-300 dark:border-gray-600
      text-gray-600 dark:text-gray-300
      hover:bg-gray-100 dark:hover:bg-gray-800
      transition-all duration-300"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}