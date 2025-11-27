import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

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

  // Função de logout: limpa credenciais e redireciona para /login
  const handleLogout = () => {
    // 1) Remove o token salvo (se existir)
    localStorage.removeItem("token");

    // 2) Remove os dados do usuário
    localStorage.removeItem("user");

    // 3) (Opcional) Se você definiu Authorization global no axios, limpe também:
    // import axios from 'axios' no topo do arquivo e descomente a linha abaixo:
    // delete axios.defaults.headers.common['Authorization'];

    // 4) Redireciona para a página de login
    navigate("/login", { replace: true });
  };

   return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200">
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow">
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
