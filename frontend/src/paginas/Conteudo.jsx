import { useState } from "react";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";

// ADICIONADO
import Sidebar from "../components/Sidebar";

export default function Conteudo() {
  // Estados do conteúdo
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  // Preview visual
  const [previewImage, setPreviewImage] = useState(null);

  // Mensagem de feedback
  const [message, setMessage] = useState("");

  // ADICIONADO → controla recuo dependendo da sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Submit do formulário
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("text", text);
      formData.append("subtitle", subtitle);
      formData.append("image", image); // arquivo real

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/conteudo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,   // ✔ ÚNICO HEADER CORRETO
          },
        }
      );

      setMessage("Conteúdo criado com sucesso!");

      // Limpar os campos
      setTitle("");
      setSubtitle("");
      setText("");
      setImage(null);
      setPreviewImage(null);

      console.log(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar conteúdo.");
    }
  }

  // Quando escolhe imagem
  function handleImage(e) {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ADICIONADO — Sidebar */}
      <Sidebar onToggle={setSidebarOpen} />

      {/* ADICIONADO — container que recua conforme sidebar */}
      <div
        className={`transition-all duration-300 w-full p-6
        ${sidebarOpen ? "ml-64" : "ml-16"}`}
      >
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-10">

          {/* FORMULÁRIO */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Criar Novo Conteúdo
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Título */}
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

              {/* Subtítulo */}
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

              {/* Imagem */}
              <div>
                <label className="font-semibold text-gray-700">Imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="block mt-2"
                  required
                />
              </div>

              {/* Editor TinyMCE */}
              <div>
                <label className="font-semibold text-gray-700 mb-1 block">
                  Conteúdo (Rich Text)
                </label>
                <Editor
                  apiKey= "aa8jodr16nus7m7zo3n70nupdln2l48nw85tnh09g2jkyamu"
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
                Publicar Conteúdo
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
