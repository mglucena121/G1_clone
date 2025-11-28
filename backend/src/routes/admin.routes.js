import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { authRequired, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rota para criar usuário — SOMENTE ADMIN
router.post("/create-user", authRequired, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email já está em uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

export default router;
