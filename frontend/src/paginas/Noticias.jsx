import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    async function fetchNoticias() {
      try {
        const res = await axios.get("http://localhost:5000/api/conteudo");
        setNoticias(res.data);
      } catch (err) {
        console.error("Erro ao buscar notícias:", err);
      }
    }

    fetchNoticias();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Últimas Notícias
        </h1>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {noticias.map((noticia) => (
            <Link
              key={noticia._id}
              to={`/noticia/${noticia._id}`}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* IMAGEM */}
              <img
                src={`http://localhost:5000${noticia.image}`}
                alt={noticia.title}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* TEXTOS */}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-1 text-gray-800 line-clamp-2">
                  {noticia.title}
                </h2>

                {noticia.subtitle && (
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {noticia.subtitle}
                  </p>
                )}

                <span className="block mt-4 text-blue-600 font-medium text-sm">
                  Ler mais →
                </span>
              </div>
            </Link>
          ))}

        </div>
      </div>
    </div>
  );
}
