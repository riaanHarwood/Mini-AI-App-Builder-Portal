import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

function Chat() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-orange-800 flex items-center justify-center text-white">
      <h1 className="text-4xl">Welcome to the Mini AI Chat!</h1>
    </div>
  );
}

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuth ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={() => setIsAuth(true)} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
