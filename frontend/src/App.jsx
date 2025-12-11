import Login from "./paginas/Login";
import Admin from "./paginas/Admin";
import CriarUsuarios from "./paginas/CriarUsuarios";
import Noticia from "./paginas/Noticia";
import Conteudo from "./paginas/Conteudo";
import Noticias from "./paginas/Noticias";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* ROTAS ADMIN */}
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/criar-usuarios" element={<CriarUsuarios />} />
      <Route path="/admin/conteudo" element={<Conteudo />} />
      <Route path="/noticias" element={<Noticias />} />
      <Route path="/noticia/:id" element={<Noticia />} />
    </Routes>
  );
}

export default App;
