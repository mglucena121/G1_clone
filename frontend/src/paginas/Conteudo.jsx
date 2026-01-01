import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import Sidebar from "../components/Sidebar";
import { uploadImage } from "../utils/uploadImage";

export default function Conteudo() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);          // File selecionado
  const [category, setCategory] = useState("");
  const [previewImage, setPreviewImage] = useState(null); // URL de prévia (arquivo ou já existente)
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const params = new URLSearchParams(location.search);
  const editingId = params.get("id");

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Reset scroll ao montar o componente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Verificação de autenticação - SÓ UMA VEZ ao montar
  useEffect(() => {
    if (!token || !user) {
      navigate("/login", { replace: true });
    }
  }, []); // Dependência vazia = executa apenas na montagem

  // Carrega notícia para edição quando editingId muda
  useEffect(() => {
    if (!editingId) {
      // Modo criar - limpa tudo
      setTitle("");
      setSubtitle("");
      setText("");
      setCategory("");
      setImage(null);
      setPreviewImage(null);
      return;
    }

    // Modo editar - carrega dados
    setIsLoading(true);
    axios
      .get(`${API}/api/conteudo/${editingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const n = res.data;
        setTitle(n.title || "");
        setSubtitle(n.subtitle || "");
        setText(n.content || n.text || "");
        setCategory(n.category || "");
        setImage(null); // Não carrega o file, apenas a prévia
        
        if (n.image) {
          const isAbsolute = /^https?:\/\//i.test(n.image);
          const base = API.replace(/\/$/, "");
          const path = isAbsolute
            ? n.image
            : n.image.includes("/uploads/")
            ? `${base}${n.image.startsWith("/") ? "" : "/"}${n.image}`
            : `${base}/uploads/${n.image}`;
          setPreviewImage(path);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Erro ao carregar notícia para edição");
        setIsLoading(false);
      });
  }, [editingId]); // Só dispara quando editingId muda

  // Escolha de imagem
  function handleImage(e) {
    const file = e.target.files[0];
    setImage(file || null);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  }

  // Submit: cria ou edita
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      let imageURL = "";

      // Se tiver imagem nova, faz upload para Firebase
      if (image) {
        imageURL = await uploadImage(image, "noticias");
        console.log("Upload Firebase concluído. URL:", imageURL);
      }

      const payload = {
        title,
        content: text, // backend espera campo content/text; enviamos como content
        subtitle,
        category,
      };

      // Envia URL do Firebase se houver imagem nova
      if (imageURL) {
        payload.image = imageURL;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (editingId) {
        // EDITAR
        await axios.put(`${API}/api/conteudo/${editingId}`, payload, {
          headers,
        });
        setMessage("Notícia atualizada com sucesso!");
        // redirecionar após 1.5s
        setTimeout(() => navigate("/admin/noticias"), 1500);
      } else {
        // CRIAR
        await axios.post(`${API}/api/conteudo`, payload, { headers });
        setMessage("Conteúdo criado com sucesso!");
        // limpar campos
        setTitle("");
        setSubtitle("");
        setText("");
        setCategory("");
        setImage(null);
        setPreviewImage(null);
      }
    } catch (error) {
      console.error(error);
      setMessage("Erro ao salvar conteúdo.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Carregando conteúdo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar onToggle={setSidebarOpen} />
      <div
        className={`transition-all duration-300 w-full mt-16 p-4 sm:p-6 pt-10 overflow-x-hidden ml-0 md:ml-16 pl-4 md:pl-6 ${
          sidebarOpen ? "md:!ml-64 md:!pl-8" : ""
        }`}
      >
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-10">
          {/* FORMULÁRIO */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {editingId ? "Editar Conteúdo" : "Criar Novo Conteúdo"}
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="font-semibold text-gray-700">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="Digite o título da notícia"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">Subtítulo</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full mt-1 p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="Digite o subtítulo"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="esporte">Esporte</option>
                  <option value="evento">Evento</option>
                  <option value="novidades">Novidades</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="block mt-2"
                  required={!editingId}   // na edição, opcional
                />
                {previewImage && (
                  <p className="text-sm text-gray-600 mt-1">
                    Prévia abaixo. Se não selecionar nova imagem, mantém a atual.
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold text-gray-700 mb-1 block">
                  Conteúdo (Rich Text)
                </label>
                <Editor
                  apiKey="aa8jodr16nus7m7zo3n70nupdln2l48nw85tnh09g2jkyamu"
                  value={text}
                  onEditorChange={(v) => setText(v)}
                  init={{
                    height: 420,
                    menubar: true,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | bold italic underline | " +
                      "alignleft aligncenter alignright alignjustify | " +
                      "bullist numlist outdent indent | link image | preview fullscreen",
                    content_style:
                      "body { font-family: Inter, Arial, sans-serif; font-size: 14px; }",
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-medium hover:bg-blue-700 transition shadow-sm"
              >
                {editingId ? "Salvar alterações" : "Publicar Conteúdo"}
              </button>

              {message && (
                <p className="text-center text-green-600 font-semibold mt-2">
                  {message}
                </p>
              )}
            </form>
          </div>

          {/* PRÉVIA */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Prévia do Conteúdo
            </h2>

            <div className="w-full">
              {previewImage && (
                <img
                  src={previewImage}
                  className="w-full h-56 object-cover rounded-xl mb-6 shadow"
                  alt="Prévia"
                />
              )}

              <h3 className="text-2xl font-bold text-gray-900">
                {title || "O título aparecerá aqui"}
              </h3>

              <div className="mb-3">
                <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {category || "Categoria"}
                </span>
              </div>

              <p className="text-gray-600 mt-2 italic">
                {subtitle || "O subtítulo aparecerá aqui"}
              </p>

              <div
                className="text-gray-800 mt-4 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    text ||
                    "<p style='opacity: 0.6;'>O conteúdo aparecerá aqui conforme você escrever.</p>",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}