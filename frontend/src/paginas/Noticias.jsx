import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Noticias() {
  const [noticiasAll, setNoticiasAll] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const noticiasPerPage = 9;

  useEffect(() => {
    async function fetchNoticias() {
      try {
        const res = await axios.get(`${API_URL}/api/conteudo`);
        setNoticiasAll(res.data);
        setNoticias(res.data);
      } catch (err) {
        console.error("Erro ao buscar notícias:", err);
      }
    }

    fetchNoticias();
  }, []);

  useEffect(() => {
    let filtered = noticiasAll;
    if (selectedCategory) {
      filtered = noticiasAll.filter((n) => n.category === selectedCategory);
    }
    // Ordena notícias com destaque primeiro
    const sorted = [...filtered].sort((a, b) => {
      if (a.featured === b.featured) return 0;
      return a.featured ? -1 : 1;
    });
    setNoticias(sorted);
    setPage(1);
  }, [selectedCategory, noticiasAll]);

  const categories = [
    { key: "", label: "Todas" },
    { key: "esporte", label: "Esporte" },
    { key: "evento", label: "Evento" },
    { key: "novidades", label: "Novidades" },
  ];

  // Calcula notícias da página atual
  const startIndex = (page - 1) * noticiasPerPage;
  const noticiasExibidas = noticias.slice(startIndex, startIndex + noticiasPerPage);
  const totalPages = Math.ceil(noticias.length / noticiasPerPage);

  function categoryColor(cat) {
    switch (cat) {
      case "esporte":
        return "bg-green-600";
      case "evento":
        return "bg-purple-600";
      case "novidades":
        return "bg-indigo-600";
      default:
        return "bg-gray-600";
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-200 via-slate-100 to-slate-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <header className="flex items-center gap-4 mb-6">
          {/* Botão hambúrguer (esquerda) */}
          <div className="relative">
            {menuOpen && (
              <div className="absolute left-0 mt-3 w-44 bg-white border rounded-md shadow-lg z-20">
                {categories.map((c) => (
                  <button
                    key={c.key || "todas"}
                    onClick={() => {
                      setSelectedCategory(c.key);
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${selectedCategory === c.key ? "bg-gray-50 font-semibold" : ""}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Últimas Notícias</h1>
          </div>
        </header>

        {/* Category chips (visíveis em desktop) */}
        <nav className="hidden sm:flex items-center gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c.key || "todas"}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3 py-1 rounded-full text-sm transition ${selectedCategory === c.key ? "ring-2 ring-offset-2 ring-indigo-300 bg-indigo-50 font-semibold" : "bg-white shadow-sm hover:shadow-md"}`}
            >
              {c.label}
            </button>
          ))}
        </nav>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {noticiasExibidas.map((noticia) => (
            <Link
              key={noticia._id}
              to={`/noticia/${noticia._id}`}
              className="group block bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-2xl hover:border-gray-200 transform hover:-translate-y-1 transition-all duration-300"
            >
              {/* IMAGEM */}
              {noticia.image ? (
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={`${API_URL}${noticia.image}`}
                    alt={noticia.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"></div>
                </div>
              ) : (
                <div className="h-52 bg-gray-100 flex items-center justify-center text-gray-400">Sem imagem</div>
              )}

              {/* TEXTOS */}
              <div className="p-5">
                {/* CATEGORIA*/}
                {noticia.category && (
                  <div className="mb-3">
                    <span className={`${categoryColor(noticia.category)} text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide`}> 
                      {noticia.category}
                    </span>
                  </div>
                )}

                <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{noticia.title}</h2>

                {noticia.subtitle && (
                  <p className="text-gray-500 text-sm line-clamp-2">{noticia.subtitle}</p>
                )}  

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-indigo-600 font-medium text-sm">Ler mais →</span>
                  <span className="text-xs text-gray-400">{new Date(noticia.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-gray-300">
            {/* Botão Anterior */}
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              ← Anterior
            </button>

            {/* Números das páginas */}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-lg font-semibold transition ${
                    page === i + 1
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Botão Próximo */}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Próximo →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
