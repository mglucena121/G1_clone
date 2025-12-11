import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Noticia() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // <- OBS: rota corrigida para /api/conteudo/:id (pt-BR)
        const res = await axios.get(`http://localhost:5000/api/conteudo/${id}`);
        console.log("Resposta API (noticia):", res.data);
        setNoticia(res.data);
      } catch (err) {
        console.error("Erro ao carregar notícia", err);
        setNoticia(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Carregando notícia...</p>;
  if (!noticia) return <p className="text-center mt-10 text-red-600">Notícia não encontrada.</p>;

  return (
    <div className="w-full min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        {/* IMAGEM: como seu controller salva "/uploads/arquivo", montamos a URL assim */}
        {noticia.image && (
          <img
            src={`http://localhost:5000${noticia.image}`}
            alt={noticia.title}
            className="w-full rounded-xl mb-6 object-cover"
          />
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{noticia.title}</h1>

        {noticia.subtitle && (
          <p className="text-gray-600 text-lg mb-6">{noticia.subtitle}</p>
        )}

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: noticia.text }}
        />
      </div>
    </div>
  );
}
