import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Editor } from "@tinymce/tinymce-react";

export default function Conteudo() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("text", text);
    if (image) formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/api/content", formData);
      alert("Notícia criada com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar notícia");
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo da página */}
      <div className="flex-1 p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Formulário */}
          <div className="bg-white p-8 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-6">Criar Novo Conteúdo</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-semibold">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border rounded-lg mt-1"
                />
              </div>

              <div>
                <label className="font-semibold">Subtítulo</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-3 border rounded-lg mt-1"
                />
              </div>

              <div>
                <label className="font-semibold">Imagem</label>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="font-semibold">Conteúdo (Rich Text)</label>
                <Editor
                  apiKey="aa8jodr16nus7m7zo3n70nupdln2l48nw85tnh09g2jkyamu"
                  init={{
                    height: 300,
                    menubar: true,
                    plugins: "link image code lists table",
                    toolbar:
                      "undo redo | bold italic underline | bullist numlist | link image | code",
                  }}
                  onEditorChange={(content) => setText(content)}
                />
              </div>

              <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg w-full">
                Publicar Notícia
              </button>
            </form>
          </div>

          {/* Prévia */}
          <div className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Prévia do Conteúdo</h2>

            <h1 className="text-xl font-bold">{title || "O título aparecerá aqui"}</h1>
            <p className="text-gray-600 mt-1">
              {subtitle || "O subtítulo aparecerá aqui"}
            </p>

            <div
              className="prose mt-4"
              dangerouslySetInnerHTML={{
                __html: text || "<p>O conteúdo aparecerá aqui conforme você escrever.</p>",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
