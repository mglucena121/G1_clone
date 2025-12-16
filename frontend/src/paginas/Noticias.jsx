import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Noticias() {
  const [noticiasAll, setNoticiasAll] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function fetchNoticias() {
      try {
        const res = await axios.get("http://localhost:5000/api/conteudo");
        setNoticiasAll(res.data);
        setNoticias(res.data);
      } catch (err) {
        console.error("Erro ao buscar notícias:", err);
      }
    }

    fetchNoticias();
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setNoticias(noticiasAll);
    } else {
      setNoticias(noticiasAll.filter((n) => n.category === selectedCategory));
    }
  }, [selectedCategory, noticiasAll]);

  const categories = [
    { key: "", label: "Todas" },
    { key: "esporte", label: "Esporte" },
    { key: "evento", label: "Evento" },
    { key: "novidades", label: "Novidades" },
  ];

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
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
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
          {noticias.map((noticia) => (
            <Link
              key={noticia._id}
              to={`/noticia/${noticia._id}`}
              className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              {/* IMAGEM */}
              {noticia.image ? (
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={`http://localhost:5000${noticia.image}`}
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
      </div>
    </div>
  );
}
