import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Noticia() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // <- OBS: rota corrigida para /api/conteudo/:id (pt-BR)
        const res = await axios.get(`${API_URL}/api/conteudo/${id}`);
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

  if (loading) return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <p className="text-center text-gray-600 text-lg">Carregando notícia...</p>
    </div>
  );
  
  if (!noticia) return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <p className="text-center text-red-500 text-lg">Notícia não encontrada.</p>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate("/noticias")}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Notícias
        </button>

        {/* Card Principal */}
        <article className="bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-200 ring-1 ring-black/5 overflow-hidden transition-shadow duration-300">
          
          {/* IMAGEM: como seu controller salva "/uploads/arquivo", montamos a URL assim */}
          {noticia.image && (
            <div className="relative h-96 w-full overflow-hidden bg-gray-200">
              <img
                src={`${API_URL}${noticia.image}`}
                alt={noticia.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {/* Conteúdo */}
          <div className="p-8 md:p-10">
            
            {/* CATEGORIA - BADGE */}
            {noticia.category && (
              <div className="mb-4 flex items-center gap-2">
                <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                  {noticia.category}
                </span>
              </div>
            )}

            {/* Título */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {noticia.title}
            </h1>

            {/* Subtítulo */}
            {noticia.subtitle && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-blue-600 pl-4">
                {noticia.subtitle}
              </p>
            )}

            {/* Separador */}
            <div className="my-8 border-t-2 border-gray-200"></div>

            {/* Conteúdo principal */}
            <div
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-p:my-4 prose-p:text-gray-700
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-em:text-gray-700"
              dangerouslySetInnerHTML={{ __html: noticia.text }}
            />
          </div>

          {/* Rodapé com botão */}
          {/* <div className="px-8 md:px-10 py-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={() => navigate("/noticias")}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
          </div> */}
        </article>
      </div>
    </div>
  );
}
