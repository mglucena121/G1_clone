import { Routes, Route } from "react-router-dom";
import Login from "./paginas/Login";
import Admin from "./paginas/Admin";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
