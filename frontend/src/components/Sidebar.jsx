import { useState } from "react";
import { Menu, X, Home, Users, BarChart3, FilePlus, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom" ;

export default function Sidebar({ onToggle }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const setSidebar = (next) => {
    setOpen(next);
    if (onToggle) onToggle(next);
  };

  const toggleSidebar = () => setSidebar(!open);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Botão Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-slate-800 p-2 rounded-lg text-white"
        onClick={toggleSidebar}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div
        onMouseEnter={() => setSidebar(true)}
        onMouseLeave={() => setSidebar(false)}
        className={`
          fixed top-0 left-0 h-screen bg-slate-900 text-white transition-all duration-300
          flex flex-col z-40
          ${open ? "w-64 p-6" : "w-16 p-4"}
        `}
      >
        <div className="flex items-center justify-between mb-10">
          {open && <h2 className="text-xl font-semibold">Menu Admin</h2>}
          <button className="hidden md:block" onClick={toggleSidebar}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Dashboard — admin e user */}
        {(user?.role === "admin" || user?.role === "user") && (
          <Link
            to="/admin"
            className="flex items-center gap-3 mb-4 hover:bg-slate-700 p-2 rounded-lg transition"
          >
            <BarChart3 size={20} />
            {open && <span>Dashboard</span>}
          </Link>
        )}

        {/* CRUD de usuários — apenas admin */}
        {user?.role === "admin" && (
          <Link
            to="/admin/criar-usuarios"
            className="flex items-center gap-3 mb-4 hover:bg-slate-700 p-2 rounded-lg transition"
          >
            <Users size={20} />
            {open && <span>Usuários</span>}
          </Link>
        )}

        {/* Cria conteúdo — admin e user */}
        {(user?.role === "admin" || user?.role === "user") && (
          <Link
            to="/admin/conteudo"
            className="flex items-center gap-3 mb-4 hover:bg-slate-700 p-2 rounded-lg transition"
          >
            <FilePlus size={20} />
            {open && <span>Criar-Conteúdo</span>}
          </Link>
        )}

        {/* Ver noticias — apenas admin */}
        {(user?.role === "admin" || user?.role === "user") && (
          <Link
            to="/admin/noticias"
            className="flex items-center gap-3 mb-4 hover:bg-slate-700 p-2 rounded-lg transition"
          >
            <Home size={20} />
            {open && <span>Ver Notícias</span>}
          </Link>
        )}
        
        {/* Logout */}
        <div className="mt-auto">
          {open ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
            >
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="mx-auto p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition duration-200 shadow-lg"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
