import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Pencil, Trash2 } from "lucide-react";

export default function CriarUsuarios() {
  // Form (criar/editar)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  // UI & dados
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estado para edição
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showFormPanel, setShowFormPanel] = useState(true); // controla exibição do painel de formulário
  const [showModal, setShowModal] = useState(false); // para edição em modal (opcional)

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Reset scroll ao montar o componente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mensagem temporária
  const flash = (txt, timeout = 3000) => {
    setMessage(txt);
    setTimeout(() => setMessage(""), timeout);
  };

  // Helper: obtém token
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  // Buscar usuários
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/users`, {
        headers: getAuthHeader(),
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err.response?.data || err.message);
      flash("Erro ao buscar usuários.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cria usuário
  const handleCreate = async (e) => {
    e && e.preventDefault();
    try {
      await axios.post(
        `${API}/api/users`,
        { name, email, password, role },
        { headers: getAuthHeader() }
      );
      flash("Usuário criado com sucesso!");
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error(err);
      flash("Erro ao criar usuário.");
    }
  };

  // Atualiza usuário
  const handleUpdate = async (e) => {
    e && e.preventDefault();
    if (!editingUserId) return;
    try {
      const body = { name, email, role };
      if (password) body.password = password; // Só envia senha se foi preenchida

      await axios.put(
        `${API}/api/users/${editingUserId}`,
        body,
        { headers: getAuthHeader() }
      );
      flash("Usuário atualizado com sucesso!");
      resetForm();
      setIsEditMode(false);
      setEditingUserId(null);
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      flash("Erro ao atualizar usuário.");
    }
  };

  // Deleta usuário
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Deseja remover este usuário?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`${API}/api/users/${id}`, {
        headers: getAuthHeader(),
      });
      flash("Usuário removido.");
      fetchUsers();
    } catch (err) {
      console.error(err);
      flash("Erro ao remover usuário.");
    }
  };

  // Abre modo edição (preencher form)
  const startEdit = (user) => {
    setName(user.name || "");
    setEmail(user.email || "");
    setRole(user.role || "user");
    setPassword(""); // senha em branco — só preencher se quiser trocar
    setIsEditMode(true);
    setEditingUserId(user._id || user.id);
    setShowModal(true); // e.g. abrir modal
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("user");
  };

  // Submissão única (criar ou editar)
  const handleSubmit = (e) => {
    if (isEditMode) return handleUpdate(e);
    return handleCreate(e);
  };

  return (
    <div className="min-h-screen bg-slate-200 overflow-x-hidden">
      <Sidebar onToggle={setSidebarOpen} />

      <div
        className={`transition-all duration-300 mt-16 p-4 sm:p-6 md:p-8 pt-10 overflow-x-hidden ml-0 md:ml-16 pl-4 md:pl-6 ${
          sidebarOpen ? "md:!ml-64 md:!pl-8" : ""
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6">
            <h1 className="text-3xl font-bold">Usuários</h1>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  resetForm();
                  setIsEditMode(false);
                  setEditingUserId(null);
                  setShowModal(true);
                }}
                className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition text-sm sm:text-base"
              >
                + Novo usuário
              </button>
              <button
                onClick={fetchUsers}
                className="flex-1 sm:flex-none px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition text-sm sm:text-base"
              >
                Atualizar lista
              </button>
            </div>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-green-200 border border-green-400 text-green-800 rounded">
              {message}
            </div>
          )}

          {/* TABELA */}
          <div className="bg-white rounded-xl shadow-md overflow-visible">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Lista de Usuários</h2>
              <span className="text-sm text-slate-500">
                {loading ? "Carregando..." : `${users.length} usuários`}
              </span>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="min-w-full table-auto text-left text-sm">
                <thead>
                  <tr className="text-sm text-slate-600 border-b">
                    <th className="py-2 px-2 sm:px-3 text-center">Nome</th>
                    <th className="py-2 px-2 sm:px-3 text-center hidden sm:table-cell">Email</th>
                    <th className="py-2 px-2 sm:px-3 text-center hidden md:table-cell">Tipo</th>
                    <th className="py-2 px-2 sm:px-3 text-center hidden lg:table-cell">Criado</th>
                    <th className="py-2 px-2 sm:px-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id || u.id} className="border-b last:border-b-0">
                      <td className="py-2 px-2 sm:px-3 text-xs sm:text-sm text-center">{u.name}</td>
                      <td className="py-2 px-2 sm:px-3 text-xs sm:text-sm text-center hidden sm:table-cell">{u.email}</td>
                      <td className="py-2 px-2 sm:px-3 text-xs sm:text-sm text-center capitalize hidden md:table-cell">{u.role}</td>
                      <td className="py-2 px-2 sm:px-3 text-xs sm:text-sm text-center text-slate-500 hidden lg:table-cell">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-2 px-2 sm:px-3">
                        {/* Desktop e Mobile: ícones centralizados */}
                        <div className="flex gap-2 justify-center items-center">
                          <button
                            onClick={() => startEdit(u)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Editar"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(u._id || u.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                            title="Remover"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && !loading && (
                    <tr>
                      <td colSpan={5} className="py-6 px-3 text-center text-slate-500">
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      {/* PAINEL / MODAL do FORMULÁRIO */}
      {/* Optei por modal flutuante para ficar parecido com admin panels */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pt-20 overflow-y-auto">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setShowModal(false);
              setIsEditMode(false);
              setEditingUserId(null);
            }}
          />
          <form
            onSubmit={handleSubmit}
            className="relative bg-white w-full max-w-md p-6 rounded-xl shadow-xl z-50 my-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {isEditMode ? "Editar Usuário" : "Criar Usuário"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setIsEditMode(false);
                  setEditingUserId(null);
                }}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

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

            <label className="block mb-2 font-semibold">
              Senha {isEditMode && <span className="text-sm text-slate-400"> (preencha apenas para alterar)</span>}
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isEditMode}
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

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {isEditMode ? "Salvar Alterações" : "Criar Usuário"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsEditMode(false);
                  setEditingUserId(null);
                  setShowModal(false);
                }}
                className="py-2 px-3 border rounded"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
