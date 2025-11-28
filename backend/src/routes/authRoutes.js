import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Usuário não encontrado" });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid)
      return res.status(400).json({ error: "Senha incorreta" });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
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

export default router;
