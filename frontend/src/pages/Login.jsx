import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ onLogin }) {
  const navigate = useNavigate(); // <-- added
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5050/api/login", { email, password });

      // Save token
      localStorage.setItem("token", res.data.token);

      // Save username
      if (res.data.user?.name) {
        localStorage.setItem("username", res.data.user.name);
      }

      onLogin();
      navigate("/"); // Redirect to chat
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
      console.error(err);
    }
  };


  return (      
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-1000 to-orange-800">
      <div className="flex flex-col items-center space-y-6 w-full max-w-sm">
        {/* Title */}
        <h1 className="text-4xl font-bold text-white">AI App Builder Portal</h1>
        {/* Login form */}
        <form 
          onSubmit={handleSubmit} 
          className="bg-black/50 p-8 rounded-xl shadow-lg space-y-6 w-full border border-gray-500"
        >
          <h2 className="text-2xl text-center text-orange-400">Login</h2>

          <input 
            className="w-full p-2 rounded bg-neutral-800 text-white"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input 
            className="w-full p-2 rounded bg-neutral-800 text-white"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button className="w-full py-2 bg-orange-600 hover:bg-orange-700 rounded text-white font-semibold">
            Login
          </button>

          <div className="flex justify-between text-sm text-orange-300 pt-2">
            <Link to="/register" className="hover:underline">Create account</Link>
            <Link to="/forgot-password" className="hover:underline">Forgot password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
