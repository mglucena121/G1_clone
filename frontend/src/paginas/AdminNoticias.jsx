import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!token || !user) {
      navigate("/login", { replace: true });
      return;
    }
    fetchNoticias();
  }, [token, navigate]);

  async function fetchNoticias() {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/admin/noticias`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNoticias(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar notícias");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Deseja realmente deletar esta notícia?")) return;
    try {
      await axios.delete(`${API}/api/admin/noticias/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNoticias((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar notícia");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar />
      <div className="transition-all duration-300 p-6 sm:p-8 ml-64">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Gerenciar Notícias</h1>
          <Link
            to="/admin/conteudo"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Nova Notícia
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-300">Carregando...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : noticias.length === 0 ? (
          <p className="text-gray-300">Nenhuma notícia encontrada.</p>
        ) : (
          <div className="grid gap-4">
            {noticias.map((n) => (
              <div
                key={n._id}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4"
              >
                <div>
                  <h2 className="text-lg text-white font-semibold">{n.title}</h2>
                  {n.subtitle && <p className="text-gray-300">{n.subtitle}</p>}
                  <p className="text-xs text-gray-400 mt-2">
                    {n.author?.name ? `${n.author.name} • ` : ""}
                    {new Date(n.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Editar → vai para Conteudo.jsx com ?id= */}
                  <Link
                    to={`/admin/conteudo?id=${n._id}`}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Editar
                  </Link>

                  {(user?.role === "admin" || n.author?._id === user?.id) && (
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Deletar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}