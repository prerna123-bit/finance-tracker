import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();

  return (
    <div
      className={`flex justify-between items-center px-8 py-4 rounded-2xl mb-6 
      ${
        dark
          ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 shadow-lg"
          : "bg-white border border-gray-200 shadow-lg"
      }`}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full shadow-lg">
          💰
        </div>

        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Finance Tracker
          </h1>
          <p className="text-sm text-gray-400">
            Manage your income & expenses
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div
          className={`px-4 py-2 rounded-xl text-sm font-medium
          ${dark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"}`}
        >
          👤 {user?.role}
        </div>

        <button
          onClick={() => setDark(!dark)}
          className={`px-4 py-2 rounded-xl font-medium transition
          ${
            dark
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}