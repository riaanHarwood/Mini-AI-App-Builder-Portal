import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5050/api/register", { email, password });
      alert("Registered successfully! You can now log in.");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-orange-800">
      <form onSubmit={handleSubmit} className="bg-black/50 p-8 rounded-xl shadow-lg space-y-6 w-full max-w-sm">
        <h1 className="text-2xl text-center text-orange-400">Register</h1>
        <input 
          className="w-full p-2 rounded bg-neutral-800 text-white"
          placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input 
          className="w-full p-2 rounded bg-neutral-800 text-white"
          placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full py-2 bg-orange-600 hover:bg-orange-700 rounded text-white font-semibold">
          Register
        </button>
      </form>
    </div>
  );
}
