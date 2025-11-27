import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2) return res.status(401).json({ error: "Formato do token inválido" });

  const scheme = parts[0];
  const token = parts[1];

  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ error: "Formato do token inválido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, email }
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

export function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Não autenticado" });
  if (req.user.role !== "admin") return res.status(403).json({ error: "Acesso negado" });
  next();
}
