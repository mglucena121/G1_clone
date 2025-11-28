import { Routes, Route } from "react-router-dom";
import Login from "./paginas/Login";
import Admin from "./paginas/Admin";
import CriarUsuarios from "./paginas/CriarUsuarios";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/criar-usuarios" element={<CriarUsuarios />} />
    </Routes>
  );
}

export default App;
