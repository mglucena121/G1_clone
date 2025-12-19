import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LogIn, AlertCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/admin", { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || "Credenciais inválidas!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm"
      >
        {/* Container */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 sm:p-10">
          
          {/* Logo com Título */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-lg ring-1 ring-indigo-500/40 bg-white/5">
              <img
                src="/favicon.ico"
                alt="Logo"
                className="w-15 h-15 object-contain"
              />
            </div>
            {/* <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">Admin M1</h1> */}
            <p className="text-sm text-gray-400 mt-2">Painel de Administração</p>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Email */}
          <div className="mb-5">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="w-full mt-2 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-800 transition disabled:opacity-50"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              className="w-full mt-2 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-800 transition disabled:opacity-50"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Entrar
              </>
            )}
          </button>

          {/* Footer Info */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Sistema de Administração M1
          </p>
        </div>
      </form>
    </div>
  );
}
