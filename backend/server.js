import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";


import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import conteudoRoutes from "./src/routes/conteudo.js";  
import seedAdmin from "./src/utils/seedAdmin.js";
import { swaggerDocs } from "./config/swagger.js";
import noticiaRoutes from "./src/routes/noticia.routes.js";

dotenv.config();
const app = express();

// Necessário para usar __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 GARANTE QUE A PASTA /uploads EXISTA
// -----------------------------------------------------
const uploadsPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

app.use(cors());
app.use(express.json());

// -----------------------------------------------------
// 🔥 SERVE A PASTA /uploads PUBLICAMENTE
// -----------------------------------------------------
app.use("/uploads", express.static(uploadsPath));

// -----------------------------------------------------
// 🔥 SWAGGER
// -----------------------------------------------------
swaggerDocs(app);

// -----------------------------------------------------
// 🔥 ROTAS
// -----------------------------------------------------
app.use("/api/auth", authRoutes);       // rotas públicas
app.use("/api/admin", adminRoutes);     // rotas admin
app.use("/api/users", userRoutes);      // rotas usuário
app.use("/api/conteudo", conteudoRoutes); // rota para upload e conteúdo
app.use("/api/noticias", noticiaRoutes); // rota de notícias


// rota teste
app.get("/", (req, res) => res.json({ ok: true }));

// -----------------------------------------------------
// 🔥 MONGODB
// -----------------------------------------------------
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB conectado");
    await seedAdmin(); // cria admin padrão se não existir

    app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  });
  })
  .catch((err) => {
    console.error("Erro conectando ao MongoDB:", err);
  });
