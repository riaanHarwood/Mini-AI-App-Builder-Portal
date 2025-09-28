import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Chat from "./pages/Chat";


function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  return (
    <Router>
      <Routes>
        {/* Default route - opens to Chat page initially */}
        <Route path="/" element={<Chat />} />

        {/* Auth pages - login + register  - user can sign in / register from chat page*/}
        <Route path="/login" element={<Login onLogin={() => setIsAuth(true)} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/chat" element={<Chat />} />
        
      </Routes>
    </Router>
  );
}

export default App;
