// src/routes/noticia.routes.js
import express from "express";
import { listarNoticias, obterNoticia } from "../controllers/noticiaController.js";

const router = express.Router();

// ROTAS PÚBLICAS (não usam auth)
router.get("/", listarNoticias);       // GET /api/noticias
router.get("/:id", obterNoticia);      // GET /api/noticias/:id

export default router;
