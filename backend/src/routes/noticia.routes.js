import express from "express";
import { 
  listarNoticias, 
  obterNoticia,
  criarNoticia,
  atualizarNoticia,
  deletarNoticia
} from "../controllers/noticiaController.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

// ROTAS PÚBLICAS (leitura)
router.get("/", listarNoticias);                    // GET /api/noticias
router.get("/:id", obterNoticia);                   // GET /api/noticias/:id

// ROTAS PROTEGIDAS (autenticado)
router.post("/", authRequired, criarNoticia);       // POST /api/noticias
router.put("/:id", authRequired, atualizarNoticia); // PUT /api/noticias/:id
router.delete("/:id", authRequired, deletarNoticia);// DELETE /api/noticias/:id

export default router;