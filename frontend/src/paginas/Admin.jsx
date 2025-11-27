import { useEffect, useState } from "react";

export default function Admin() {
  const [name, setName] = useState("");

  useEffect(() => {
    // Pegando o "name" salvo no localStorage após o login
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setName(user.name);
      } catch (error) {
        console.error("Erro ao ler usuário:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200">
      <h1 className="text-3xl font-bold">
        Bem-vindo{ name ? `, ${name}` : "" }!
      </h1>
    </div>
  );
}
