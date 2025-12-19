import { useState } from "react";
import { Menu, X, Home, Users, BarChart3, FilePlus, LogOut, User } from "lucide-react";
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

  const handleLinkClick = () => {
    // Fechar sidebar no mobile ao clicar em um link
    if (window.innerWidth < 768) {
      setSidebar(false);
    }
  };

  return (
    <>
      {/* Toolbar - Mobile e Desktop */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-50 shadow-lg border-b border-slate-800">
        <button
          className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 transition"
          onClick={toggleSidebar}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Info do usuário na toolbar */}
        <div className="hidden sm:flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Mobile: nome + avatar */}
        <div className="sm:hidden flex items-center gap-2">
          {user && (
            <>
              <p className="text-sm font-semibold">{user.name}</p>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={18} className="text-white" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Overlay Mobile */}
      {open && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebar(false)}
        ></div>
      )}

      <div
        onMouseEnter={() => window.innerWidth >= 768 && setSidebar(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setSidebar(false)}
        className={`
          fixed top-16 left-0 h-[calc(100vh-64px)] bg-slate-900 text-white transition-all duration-300
          flex flex-col z-40
          w-64 p-6
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16 md:p-4"}
        `}
      >
        <div >
          {open}
        </div>

        {/* Dashboard — admin e user */}
        {(user?.role === "admin" || user?.role === "user") && (
          <Link
            to="/admin"
            onClick={handleLinkClick}
            className="flex items-center gap-3 mb-4 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors duration-200"
          >
            <BarChart3 size={20} className="flex-shrink-0" />
            {open && <span className="whitespace-nowrap text-sm">Dashboard</span>}
          </Link>
        )}

        {/* CRUD de usuários — apenas admin */}
        {user?.role === "admin" && (
          <Link
            to="/admin/criar-usuarios"
            onClick={handleLinkClick}
            className="flex items-center gap-3 mb-4 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors duration-200"
          >
            <Users size={20} className="flex-shrink-0" />
            {open && <span className="whitespace-nowrap text-sm">Usuários</span>}
          </Link>
        )}

        {/* Cria conteúdo — admin e user */}
        {(user?.role === "admin" || user?.role === "user") && (
          <Link
            to="/admin/conteudo"
            onClick={handleLinkClick}
            className="flex items-center gap-3 mb-4 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors duration-200"
          >
            <FilePlus size={20} className="flex-shrink-0" />
            {open && <span className="whitespace-nowrap text-sm">Criar-Conteúdo</span>}
          </Link>
        )}

        {/* Ver noticias — apenas admin */}
        {(user?.role === "admin" || user?.role === "user") && (
          <Link
            to="/admin/noticias"
            onClick={handleLinkClick}
            className="flex items-center gap-3 mb-4 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors duration-200"
          >
            <Home size={20} className="flex-shrink-0" />
            {open && <span className="whitespace-nowrap text-sm">Ver Notícias</span>}
          </Link>
        )}
        
        {/* Logout */}
        <div className="mt-auto">
          {open ? (
            <button
              onClick={() => {
                handleLogout();
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg text-sm"
            >
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          ) : (
            <button
              onClick={() => {
                handleLogout();
              }}
              className="w-full p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 shadow-lg flex justify-center"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
