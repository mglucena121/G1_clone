import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 🔹 Importamos o middleware que verifica se o usuário enviou um token válido
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza login do administrador
 *     tags: [Auth]
 *     description: Verifica email e senha, valida no banco e retorna JWT + dados do usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       400:
 *         description: Usuário não encontrado ou senha incorreta
 *       500:
 *         description: Erro no servidor
 */

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email e senha são obrigatórios" });

    // 🔹 Busca o usuário pelo email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Usuário não encontrado" });

    // 🔹 Compara a senha enviada com o hash salvo
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid)
      return res.status(400).json({ error: "Senha incorreta" });

    // 🔹 Cria o token JWT contendo dados básicos do usuário
    const token = jwt.sign(
      { id: user._id, 
        role: user.role,
        name: user.name,
        email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Autenticado com sucesso",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

/**
 * 🔥 ROTA PROTEGIDA — /me
 * Essa rota só funciona se o usuário enviar um token válido.
 * O objetivo dela é retornar os dados do usuário logado usando o TOKEN.
 *
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Retorna os dados do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário autenticado
 *       401:
 *         description: Token inválido ou ausente
 */

// GET /api/auth/me  → retorna o usuário logado
router.get("/me", authRequired, (req, res) => {
  // 🔹 O middleware authRequired coloca dentro de req.user
  //     as informações contidas no token (id, email, role)
  return res.json({
    user: req.user,
  });
});

export default router;
