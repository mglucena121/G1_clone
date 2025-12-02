import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Admin() {
  const [name, setName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true); // estado da sidebar
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
    <div className="min-h-screen bg-slate-200">

      {/* MENU LATERAL */}
      <Sidebar onToggle={setSidebarOpen} />

      {/* CONTEÚDO PRINCIPAL */}
      <div
        className={`
          transition-all duration-300 p-8
          ${sidebarOpen ? "ml-64" : "ml-16"}
        `}
      >
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
      </div>
    </div>
  );
}
