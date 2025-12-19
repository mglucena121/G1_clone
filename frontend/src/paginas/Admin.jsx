import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Admin() {
  const [name, setName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // estado da sidebar
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
          transition-all duration-300 p-4 sm:p-6 md:p-8 pl-14 md:pl-0
          ${sidebarOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-16"}
        `}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Bem-vindo{ name ? `, ${name}` : "" }!
          </h1>

          <button
            onClick={handleLogout}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm sm:text-base whitespace-nowrap"
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
