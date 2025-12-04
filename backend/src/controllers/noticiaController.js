import Content from "../models/content.js";

// LISTAR TODAS AS NOTÍCIAS (público)
export async function listarNoticias(req, res) {
  try {
    const noticias = await Content.find().sort({ createdAt: -1 });

    res.status(200).json(noticias);
  } catch (err) {
    console.error("Erro ao listar notícias:", err);
    res.status(500).json({ error: "Erro ao listar notícias" });
  }
}

// PEGAR UMA NOTÍCIA PELO ID (público)
export async function obterNoticia(req, res) {
  try {
    const noticia = await Content.findById(req.params.id);

    if (!noticia) {
      return res.status(404).json({ error: "Notícia não encontrada" });
    }

    res.status(200).json(noticia);
  } catch (err) {
    console.error("Erro ao buscar notícia:", err);
    res.status(500).json({ error: "Erro ao buscar notícia" });
  }
}
