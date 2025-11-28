export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="w-64 bg-slate-800 text-white h-screen p-6">
      <h2 className="text-xl font-bold mb-6">Menu</h2>

      {/* Todos podem ver */}
      <a href="/admin" className="block mb-3 hover:text-gray-300">Dashboard</a>     

      {/* Só ADMIN vê */}
      {user?.role === "admin" && (
        <a href="/admin/criar-usuarios" className="block mb-3 hover:text-gray-300">
         Criar Usuários
      </a>
      )}

      {/* Outros papéis */}
      {user?.role === "editor" && (
        <a href="/admin/noticias" className="block mb-3 hover:text-gray-300">
          Gerenciar Notícias
        </a>
      )}
    </div>
  );
}
