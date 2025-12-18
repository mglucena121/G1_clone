import Content from "../models/content.js";

/**
 * ==============================
 * LISTAR TODAS AS NOTÍCIAS (público)
 * ==============================
 */
export async function listarNoticias(req, res) {
  try {
    const noticias = await Content.find().sort({ createdAt: -1 });
    res.status(200).json(noticias);
  } catch (err) {
    console.error("Erro ao listar notícias:", err);
    res.status(500).json({ error: "Erro ao listar notícias" });
  }
}

/**
 * ==============================
 * OBTER UMA NOTÍCIA PELO ID (público)
 * ==============================
 */
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

/**
 * ==============================
 * CRIAR NOTÍCIA (autenticado)
 * ==============================
 * ⚠️ IMPORTANTE:
 * - A imagem vem de req.file (multer)
 * - Nunca usar req.body.image
 */
export async function criarNoticia(req, res) {
  try {
    const { title, text, subtitle, category } = req.body;

    // Validação básica
    if (!title || !text || !category) {
      return res.status(400).json({
        error: "Campos obrigatórios: title, text, category",
      });
    }

    // Validação da imagem
    if (!req.file) {
      return res.status(400).json({
        error: "Imagem é obrigatória",
      });
    }

    // Caminho REAL da imagem
    const imagePath = `/uploads/${req.file.filename}`;

    const novaNoticia = new Content({
      title,
      text,
      subtitle,
      category,
      image: imagePath,
      author: req.user.id,
    });

    await novaNoticia.save();
    res.status(201).json(novaNoticia);
  } catch (err) {
    console.error("Erro ao criar notícia:", err);
    res.status(500).json({ error: "Erro ao criar notícia" });
  }
}

/**
 * ==============================
 * ATUALIZAR NOTÍCIA (autenticado)
 * ==============================
 * - Upload de imagem é opcional
 * - Se não enviar imagem, mantém a antiga
 */
export async function atualizarNoticia(req, res) {
  try {
    const { id } = req.params;
    const noticia = await Content.findById(id);

    if (!noticia) {
      return res.status(404).json({ error: "Notícia não encontrada" });
    }

    // Permissão: admin ou autor
    if (
      req.user.role !== "admin" &&
      noticia.author.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const { title, text, subtitle, category } = req.body;

    if (title) noticia.title = title;
    if (text) noticia.text = text;
    if (subtitle !== undefined) noticia.subtitle = subtitle;
    if (category) noticia.category = category;

    // 🔥 Se veio nova imagem
    if (req.file) {
      noticia.image = `/uploads/${req.file.filename}`;
    }

    await noticia.save();
    res.status(200).json(noticia);
  } catch (err) {
    console.error("Erro ao atualizar notícia:", err);
    res.status(500).json({ error: "Erro ao atualizar notícia" });
  }
}

/**
 * ==============================
 * DELETAR NOTÍCIA (autenticado)
 * ==============================
 */
export async function deletarNoticia(req, res) {
  try {
    const { id } = req.params;
    const noticia = await Content.findById(id);

    if (!noticia) {
      return res.status(404).json({ error: "Notícia não encontrada" });
    }

    // Permissão: admin ou autor
    if (
      req.user.role !== "admin" &&
      noticia.author.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    await Content.findByIdAndDelete(id);
    res.status(200).json({ message: "Notícia deletada com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar notícia:", err);
    res.status(500).json({ error: "Erro ao deletar notícia" });
  }
}
