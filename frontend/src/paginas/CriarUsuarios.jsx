import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function CriarUsuarios() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");

  // NOVO → estado para acompanhar se a sidebar está aberta
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/admin/create-user",
        {
          name,
          email,
          password,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Usuário criado com sucesso!");
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
    } catch (err) {
      console.error(err);
      setMessage("Erro ao criar usuário.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-200">

      {/* Sidebar */}
      <Sidebar onToggle={setSidebarOpen} />

      {/* Conteúdo */}
      <div
        className={`
          transition-all duration-300 p-8
          ${sidebarOpen ? "ml-64" : "ml-16"}
        `}
      >
        <h1 className="text-3xl font-bold mb-6">Criar Usuário</h1>

        {message && (
          <div className="mb-4 p-3 bg-green-200 border border-green-400 text-green-800 rounded">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg"
        >

          <label className="block mb-2 font-semibold">Nome</label>
          <input
            type="text"
            className="w-full p-2 border rounded mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block mb-2 font-semibold">Senha</label>
          <input
            type="password"
            className="w-full p-2 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="block mb-2 font-semibold">Tipo de Usuário</label>
          <select
            className="w-full p-2 border rounded mb-4"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">Usuário comum</option>
            <option value="admin">Administrador</option>
          </select>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Criar Usuário
          </button>
        </form>
      </div>
    </div>
  );
}
