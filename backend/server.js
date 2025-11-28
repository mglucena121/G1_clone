import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import seedAdmin from "./src/utils/seedAdmin.js";

import { swaggerDocs } from "./config/swagger.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Ativa SWAGGER aqui:
swaggerDocs(app);

// rotas públicas
app.use("/api/auth", authRoutes);

// rotas admin
app.use("/api/admin", adminRoutes);

// rotas user
app.use("/api/users", userRoutes);

// rota teste
app.get("/", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB conectado");
    await seedAdmin(); // cria admin se não existir
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("Erro conectando ao MongoDB:", err);
  });
