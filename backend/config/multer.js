import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Necessário para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura onde e como os arquivos serão salvos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // pasta /uploads na raiz do projeto
    cb(null, path.join(__dirname, "../uploads"));
  },

  filename: (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const baseName = path.basename(file.originalname, ext);

  const safeName = baseName
    .toLowerCase()
    .normalize("NFD")                  // remove acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")              // espaços → -
    .replace(/[^a-z0-9-]/g, "");       // remove resto

  cb(null, `${Date.now()}-${safeName}${ext}`);
  },
});

// Aceitar apenas imagens
function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Tipo de arquivo não suportado."), false);
  }

  cb(null, true);
}

// Exporta a configuração completa
const upload = multer({ storage, fileFilter });

export default upload;
