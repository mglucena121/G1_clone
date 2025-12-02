import { useState } from "react";
import { Menu, X, Home, Users } from "lucide-react";

export default function Sidebar({ onToggle }) {
  const [open, setOpen] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  const toggleSidebar = () => {
    setOpen(!open);
    if (onToggle) onToggle(!open); // avisa a página Admin
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
        className={`
        fixed top-0 left-0 h-screen bg-slate-900 text-white transition-all duration-300
        flex flex-col z-40
        ${open ? "w-64 p-6" : "w-16 p-4"}
      `}
      >
        <div className="flex items-center justify-between mb-10">
          {open && <h2 className="text-xl font-semibold">Menu</h2>}
          <button className="hidden md:block" onClick={toggleSidebar}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <a
          href="/admin"
          className="flex items-center gap-3 mb-4 hover:bg-slate-700 p-2 rounded-lg transition"
        >
          <Home size={20} />
          {open && <span>Dashboard</span>}
        </a>

        {user?.role === "admin" && (
          <a
            href="/admin/criar-usuarios"
            className="flex items-center gap-3 mb-4 hover:bg-slate-700 p-2 rounded-lg transition"
          >
            <Users size={20} />
            {open && <span>Criar Usuários</span>}
          </a>
        )}
      </div>
    </>
  );
}
