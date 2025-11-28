import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // importa o menu

export default function Admin() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-200">

      {/* MENU LATERAL */}
      <Sidebar />

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Bem-vindo{ name ? `, ${name}` : "" }!
          </h1>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Sair
          </button>
        </div>

        <p className="text-sm text-gray-600">
          Você está na área administrativa.
        </p>

        {/* Aqui você vai colocar o conteúdo do CRUD futuramente */}
      </div>
    </div>
  );
}
