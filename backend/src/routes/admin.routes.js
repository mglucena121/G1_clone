import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { authRequired, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rota para listar todos os usuários — SOMENTE ADMIN
router.get("/users", authRequired, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash"); // remove senha

    res.status(200).json({ users });
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// Rota para atualizar usuário — SOMENTE ADMIN
router.put("/users/:id", authRequired, adminOnly, async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true } // retorna objeto atualizado
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json({
      message: "Usuário atualizado com sucesso",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// ROTA DELETE - remover usuário — SOMENTE ADMIN
router.delete("/users/:id", authRequired, adminOnly, async (req, res) => {
  try {
    const userId = req.params.id;

    const deleted = await User.findByIdAndDelete(userId);

    if (!deleted) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar usuário:", err);
    return res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});


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
