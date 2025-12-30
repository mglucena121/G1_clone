import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Pencil, Trash2, ExternalLink, Star } from "lucide-react";

export default function AdminNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Reset scroll ao montar o componente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      await axios.patch(
        `${API}/api/admin/noticias/${id}`,
        { featured: !currentFeatured },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNoticias((prev) =>
        prev.map((n) => (n._id === id ? { ...n, featured: !currentFeatured } : n))
      );
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || "Erro ao atualizar destaque da notícia";
      alert(errorMessage);
    }
  };

  // Ordena notícias com destaque primeiro
  const sortedNoticias = [...noticias].sort((a, b) => {
    if (a.featured === b.featured) return 0;
    return a.featured ? -1 : 1;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar onToggle={setSidebarOpen} />
      <div className={`transition-all duration-300 mt-16 p-4 sm:p-6 md:p-8 pt-10 overflow-x-hidden ml-0 md:ml-16 pl-4 md:pl-6 ${sidebarOpen ? "md:!ml-64 md:!pl-8" : ""}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 flex-wrap">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Gerenciar Notícias</h1>
          
          <div className="flex flex-row gap-2 w-full sm:w-auto">
            <Link
              to="/noticias"
              className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-center text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <ExternalLink size={18} />
              Ver Site
            </Link>
            <Link
              to="/admin/conteudo"
              className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-center text-sm sm:text-base"
            >
              Nova Notícia
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-300 text-center py-8">Carregando...</p>
        ) : error ? (
          <p className="text-red-400 text-center py-8">{error}</p>
        ) : noticias.length === 0 ? (
          <p className="text-gray-300 text-center py-8">Nenhuma notícia encontrada.</p>
        ) : (
          <div className="grid gap-4 w-full">
            {sortedNoticias.map((n) => (
              <div
                key={n._id}
                className={`rounded-lg p-4 sm:p-5 transition-colors ${
                  n.featured
                    ? "bg-yellow-900/30 border border-yellow-600/50 hover:bg-yellow-900/40"
                    : "bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70"
                }`}
              >
                {/* Badge de destaque */}
                {n.featured && (
                  <div className="flex items-center gap-1 mb-2 text-yellow-400 text-xs font-semibold">
                    <Star size={14} fill="currentColor" />
                    Destacado
                  </div>
                )}

                {/* Título */}
                <div className="mb-3">
                  <h2 className="text-lg sm:text-xl text-white font-semibold line-clamp-2">{n.title}</h2>
                </div>

                {/* Subtítulo */}
                {n.subtitle && (
                  <p className="text-sm sm:text-base text-gray-300 mb-3 line-clamp-2">{n.subtitle}</p>
                )}

                {/* Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-gray-400 mb-3 pb-3 border-b border-slate-700/30">
                  <span>{n.author?.name ? `${n.author.name}` : "Sem autor"}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{new Date(n.createdAt).toLocaleString("pt-BR")}</span>
                </div>

                {/* Ações no final */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFeatured(n._id, n.featured)}
                    className={`p-2 rounded transition ${
                      n.featured
                        ? "text-yellow-400 hover:bg-yellow-400/20"
                        : "text-gray-500 hover:bg-gray-500/20"
                    }`}
                    title={n.featured ? "Remover destaque" : "Destacar"}
                  >
                    <Star size={18} fill={n.featured ? "currentColor" : "none"} />
                  </button>

                  <Link
                    to={`/admin/conteudo?id=${n._id}`}
                    className="p-2 text-blue-600 hover:bg-blue-600/20 rounded transition"
                    title="Editar"
                  >
                    <Pencil size={18} />
                  </Link>

                  {(user?.role === "admin" || n.author?._id === user?.id) && (
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="p-2 text-red-600 hover:bg-red-600/20 rounded transition"
                      title="Deletar"
                    >
                      <Trash2 size={18} />
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