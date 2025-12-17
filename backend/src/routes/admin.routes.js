import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Content from "../models/content.js";
import { authRequired, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ...existing code... (usuários)

// ============================================
// ROTAS DE NOTÍCIAS
// ============================================

// GET /admin/noticias — listar notícias (admin vê todas, user vê só as suas)
router.get("/noticias", authRequired, async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { author: req.user.id };
    const noticias = await Content.find(filter)
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(noticias);
  } catch (err) {
    console.error("Erro ao listar notícias:", err);
    res.status(500).json({ error: "Erro ao listar notícias" });
  }
});

// PUT /admin/noticias/:id — atualizar notícia (validação no controller)
router.put("/noticias/:id", authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const noticia = await Content.findById(id);

    if (!noticia) {
      return res.status(404).json({ error: "Notícia não encontrada" });
    }

    // Validar permissão: só admin ou autor
    if (req.user.role !== "admin" && noticia.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const { title, text, image, subtitle, category } = req.body;
    if (title) noticia.title = title;
    if (text) noticia.text = text;
    if (image !== undefined) noticia.image = image;
    if (subtitle !== undefined) noticia.subtitle = subtitle;
    if (category) noticia.category = category;

    await noticia.save();
    res.status(200).json(noticia);
  } catch (err) {
    console.error("Erro ao atualizar notícia:", err);
    res.status(500).json({ error: "Erro ao atualizar notícia" });
  }
});

// DELETE /admin/noticias/:id — deletar notícia (validação no controller)
router.delete("/noticias/:id", authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const noticia = await Content.findById(id);

    if (!noticia) {
      return res.status(404).json({ error: "Notícia não encontrada" });
    }

    // Validar permissão: só admin ou autor
    if (req.user.role !== "admin" && noticia.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    await Content.findByIdAndDelete(id);
    res.status(200).json({ message: "Notícia deletada com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar notícia:", err);
    res.status(500).json({ error: "Erro ao deletar notícia" });
  }
});

export default router;