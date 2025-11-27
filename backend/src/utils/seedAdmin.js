import User from "../models/User.js";
import bcrypt from "bcrypt";

export default async function seedAdmin() {
  try {
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      const defaultEmail = process.env.ADMIN_EMAIL || "admin@admin.com";
      const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";
      const passwordHash = await bcrypt.hash(defaultPassword, 10);

      await User.create({
        name: "Administrador",
        email: defaultEmail,
        passwordHash,
        role: "admin"
      });

      console.log(`Admin criado - email: ${defaultEmail} senha: ${defaultPassword}`);
    } else {
      console.log("Admin já existe.");
    }
  } catch (err) {
    console.error("Erro no seedAdmin:", err);
  }
}
