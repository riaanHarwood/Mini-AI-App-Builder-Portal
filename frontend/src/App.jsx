import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Chat from "./pages/Chat";
import Settings from "./pages/settings";
import Profile from "./pages/Profile";
import Help from "./pages/Help";


function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  return (
    <Router>
      <Routes>
        {/* Default route - opens to Chat page initially */}
        <Route path="/" element={<Login />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login onLogin={() => setIsAuth(true)} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Main pages */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />  
        <Route path="/Profile" element={<Profile />} /> 
        <Route path="/Help" element={<Help />} /> 
      </Routes>
    </Router>
  );
}

export default App;

