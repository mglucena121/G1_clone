import express from "express";
// import upload from "../../config/multer.js";   // multer não é mais necessário
import {
  criarConteudo,
  listarConteudos,
  obterConteudo,
  deletarConteudo,
  editarConteudo,
} from "../controllers/contentController.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Conteúdo
 *   description: Rotas para criação e listagem de notícias
 */

/**
 * @swagger
 * /api/conteudo:
 *   post:
 *     summary: Cria um novo conteúdo (notícia) com imagem e texto formatado
 *     tags: [Conteúdo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - text
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Título da notícia"
 *               subtitle:
 *                 type: string
 *                 example: "Subtítulo opcional"
 *               text:
 *                 type: string
 *                 example: "<p>Texto formatado em HTML...</p>"
 *               image:
 *                 type: string
 *                 example: "https://firebasestorage.googleapis.com/..."
 *     responses:
 *       201:
 *         description: Conteúdo criado com sucesso
 *       400:
 *         description: Dados inválidos
 */

// 🔥 Criar conteúdo (recebe URL do Firebase)
router.post("/", authRequired, criarConteudo);

/**
 * @swagger
 * /api/conteudo:
 *   get:
 *     summary: Lista todos os conteúdos publicados
 *     tags: [Conteúdo]
 *     responses:
 *       200:
 *         description: Lista de conteúdos retornada com sucesso
 *       500:
 *         description: Erro no servidor
 */
router.get("/", listarConteudos);

/**
 * @swagger
 * /api/conteudo/{id}:
 *   get:
 *     summary: Obtém um conteúdo específico pelo ID
 *     tags: [Conteúdo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do conteúdo
 *     responses:
 *       200:
 *         description: Conteúdo encontrado
 *       404:
 *         description: Conteúdo não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get("/:id", obterConteudo);

/**
 * @swagger
 * /api/conteudo/{id}:
 *   delete:
 *     summary: Deleta um conteúdo pelo ID
 *     tags: [Conteúdo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conteúdo deletado com sucesso
 *       404:
 *         description: Conteúdo não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete("/:id", authRequired, deletarConteudo);

/**
 * @swagger
 * /api/conteudo/{id}:
 *   put:
 *     summary: Edita um conteúdo existente (com upload opcional)
 *     tags: [Conteúdo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               text:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 example: "https://firebasestorage.googleapis.com/..."
 *     responses:
 *       200:
 *         description: Conteúdo atualizado com sucesso
 *       404:
 *         description: Conteúdo não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put("/:id", authRequired, editarConteudo);

export default router;
