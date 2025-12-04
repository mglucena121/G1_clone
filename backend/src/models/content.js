// src/models/Content.js
import mongoose from "mongoose";

// Criamos o schema do conteúdo
// Esse schema representa uma "notícia" ou "post"
const ContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // título é obrigatório
    },
    text: {
      type: String,
      required: true, // o texto virá em formato HTML do editor rich text
    },
    image: {
      type: String, 
      required: false, // imagem é opcional
      // Aqui não salvamos a imagem, apenas o NOME ou CAMINHO dela
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // quem criou (admin ou user)
    },
    subtitle: {
      type: String,
      required: false,
        },
  },
  {
    timestamps: true, // cria automaticamente createdAt e updatedAt
  }
);

// Exportamos o model
export default mongoose.model("Content", ContentSchema);
