import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { dark } = useTheme();

  return (
    <footer
      className={`mt-10 py-6 rounded-2xl text-center border-t
      ${
        dark
          ? "bg-gray-800 border-gray-700 text-gray-300"
          : "bg-white border-gray-200 text-gray-600"
      }`}
    >
      <h2 className="text-lg font-semibold">
        💰 Personal Finance Tracker
      </h2>

      <p className="text-sm mt-2">
        Track your income, expenses, and savings easily.
      </p>

      <div className="mt-4 flex justify-center gap-6 text-xl">
        <span>📊</span>
        <span>💵</span>
        <span>📈</span>
      </div>

      <p className="mt-4 text-xs opacity-70">
        © 2026 Prerna Singh. All rights reserved.
      </p>
    </footer>
  );
}