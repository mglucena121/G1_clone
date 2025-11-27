import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./src/routes/authRoutes.js";
import seedAdmin from "./src/utils/seedAdmin.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// rotas públicas
app.use("/api/auth", authRoutes);

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
