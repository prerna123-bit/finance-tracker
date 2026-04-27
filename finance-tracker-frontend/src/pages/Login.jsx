import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
 useEffect(() => {
  setForm({
    email: "",
    password: "",
  });
}, [location.pathname]);

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);

      // token save
      login({
        token: res.data.token,
        ...res.data.user
      });
      alert("Login success ✅");

      setForm({
        email: "",
        password: "",
      });

      navigate("/dashboard");

    } catch (err) {
      console.log(err.response?.data);   // 👈 ADD THIS
      alert("Login failed ❌");
    }
  };
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          autoComplete="off"
          className="w-full p-2 mb-2 border rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          autoComplete="off"
          className="w-full p-2 mb-2 border rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>
        <p className="mt-3 text-sm text-center">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}