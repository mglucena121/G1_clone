import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { BarChart3, Newspaper, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [name, setName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [totalNoticias, setTotalNoticias] = useState(0);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      
      // Permite acesso para `admin` e `user`
      if (user.role !== "admin" && user.role !== "user") {
        navigate("/login", { replace: true });
        return;
      }
      
      setName(user.name);
    } catch (error) {
      console.error("Erro ao ler usuário:", error);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/conteudo");
        const noticias = response.data;

        setTotalNoticias(noticias.length);

        // Contar noticias por categoria
        const categoriasCount = {};
        const cores = {
          "esporte": "bg-green-500",
          "evento": "bg-purple-500",
          "novidades": "bg-indigo-500",
        };

        noticias.forEach((noticia) => {
          const cat = noticia.category || "Sem categoria";
          categoriasCount[cat] = (categoriasCount[cat] || 0) + 1;
        });

        const categoriasArray = Object.entries(categoriasCount).map(
          ([name, count]) => ({
            name,
            count,
            color: cores[name] || "bg-gray-500",
          })
        );

        setCategorias(categoriasArray);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar notícias:", err);
        setError("Erro ao carregar dados do dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* MENU LATERAL */}
      <Sidebar onToggle={setSidebarOpen} />

      {/* CONTEÚDO PRINCIPAL */}
      <div
        className={`
          transition-all duration-300 p-6 sm:p-8
          ${sidebarOpen ? "ml-64" : "ml-16"}
        `}
      >
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-white">
              Dashboard
            </h1>
            <p className="text-gray-300 mt-2">
              Bem-vindo{name ? `, ${name}` : ""}!
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
          >
            Sair
          </button>
        </div>

        {/* CONTEÚDO DO DASHBOARD */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block mb-4 p-4 bg-indigo-500/20 rounded-full">
                <BarChart3 className="text-indigo-400 animate-spin" size={40} />
              </div>
              <p className="text-gray-300 text-lg">Carregando dashboard...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 flex items-center gap-4">
            <AlertCircle className="text-red-400" size={28} />
            <p className="text-red-200">{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* CARD PRINCIPAL - TOTAL DE NOTÍCIAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total de notícias */}
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-8 shadow-xl border border-indigo-500/30 hover:border-indigo-500/60 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-indigo-200 text-sm font-semibold uppercase tracking-wide">
                      Total de Notícias
                    </p>
                    <h2 className="text-5xl font-black text-white mt-3">
                      {totalNoticias}
                    </h2>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg backdrop-blur">
                    <Newspaper className="text-indigo-200" size={32} />
                  </div>
                </div>
                <div className="mt-6 flex items-center text-indigo-200 text-sm">
                  <TrendingUp size={16} className="mr-2" />
                  <span>Conteúdo publicado</span>
                </div>
              </div>

              {/* Estatísticas rápidas */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-8 shadow-xl border border-purple-500/30 hover:border-purple-500/60 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-semibold uppercase tracking-wide">
                      Categorias Ativas
                    </p>
                    <h2 className="text-5xl font-black text-white mt-3">
                      {categorias.length}
                    </h2>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg backdrop-blur">
                    <BarChart3 className="text-purple-200" size={32} />
                  </div>
                </div>
                <div className="mt-6 text-purple-200 text-sm">
                  Tipos de conteúdo
                </div>
              </div>

              {/* Média por categoria */}
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-8 shadow-xl border border-green-500/30 hover:border-green-500/60 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-green-200 text-sm font-semibold uppercase tracking-wide">
                      Média por Categoria
                    </p>
                    <h2 className="text-5xl font-black text-white mt-3">
                      {categorias.length > 0
                        ? Math.round(totalNoticias / categorias.length)
                        : 0}
                    </h2>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg backdrop-blur">
                    <TrendingUp className="text-green-200" size={32} />
                  </div>
                </div>
                <div className="mt-6 text-green-200 text-sm">
                  Notícias por categoria
                </div>
              </div>
            </div>

            {/* DETALHAMENTO POR CATEGORIA */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <BarChart3 className="text-indigo-400" />
                Notícias por Categoria
              </h3>

              {categorias.length > 0 ? (
                <div className="space-y-4">
                  {categorias
                    .sort((a, b) => b.count - a.count)
                    .map((cat, idx) => (
                      <div key={idx} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`${cat.color} w-3 h-3 rounded-full`}
                            ></div>
                            <span className="text-gray-100 font-semibold capitalize">
                              {cat.name}
                            </span>
                          </div>
                          <span className="text-white font-bold text-xl">
                            {cat.count}
                          </span>
                        </div>

                        {/* Barra de progresso */}
                        <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                          <div
                            className={`${cat.color} h-full rounded-full transition-all duration-500 group-hover:brightness-110`}
                            style={{
                              width: `${(cat.count / totalNoticias) * 100}%`,
                            }}
                          ></div>
                        </div>

                        {/* Porcentagem */}
                        <div className="mt-2 text-right text-xs text-gray-400">
                          {Math.round((cat.count / totalNoticias) * 100)}% do
                          total
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">
                    Nenhuma notícia encontrada
                  </p>
                </div>
              )}
            </div>

            {/* RODAPÉ DO DASHBOARD */}
            <div className="text-center pt-8 border-t border-slate-700/50">
              <p className="text-gray-400 text-sm">
                Dashboard atualizado em {new Date().toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
