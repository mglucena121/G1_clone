import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate(); // necessário para redirecionar
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      // salva o usuário com nome
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // redireciona para a mesma rota; a `Sidebar` controla o que cada role vê
      navigate("/admin");
    } catch (error) {
      alert("Credenciais inválidas!");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-700 to-slate-800"
    >
      {/* container */}
      <div className="w-full max-w-sm p-8 bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <div className="w-8 h-8 bg-white/70 rotate-45"></div>
          </div>
        </div>

        {/* Email */}
        <label className="text-xs text-gray-300">EMAIL ADDRESS</label>
        <input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 mb-4 px-4 py-2 rounded-lg bg-transparent border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
        />

        {/* Password */}
        <label className="text-xs text-gray-300">PASSWORD</label>
        <input
          type="password"
          placeholder="*********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 mb-6 px-4 py-2 rounded-lg bg-transparent border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
        />

        {/* Login Button */}
        <button
          type="submit"
          className="w-full py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
        >
          Login
        </button>
      </div>
    </form>
  );
}
