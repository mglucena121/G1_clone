// src/pages/Noticias.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    async function fetchNoticias() {
      try {
        const response = await axios.get("http://localhost:5000/api/content");
        setNoticias(response.data);
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      }
    }
    fetchNoticias();
  }, []);

  return (
    <div className="max-w-6xl mx-auto pt-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 border-l-4 border-red-600 pl-3">
        Últimas Notícias
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {noticias.map((item) => (
          <Link key={item._id} to={`/noticias/${item._id}`}>
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group">
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                  alt={item.title}
                />
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold group-hover:text-red-600 transition">
                  {item.title}
                </h2>

                {item.subtitle && (
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {item.subtitle}
                  </p>
                )}

                <p className="text-gray-400 text-xs mt-3">
                  {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
