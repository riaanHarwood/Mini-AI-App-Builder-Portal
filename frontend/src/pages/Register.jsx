import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again");
      return;
    }
    //check for empty field, if so, then ask to fill in all fields. 
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    //Check if email is valid/invalid 
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email");
      return;
    }

    try {
      await axios.post("http://localhost:5050/api/register", { name, email, password, confirmPassword });
      alert("Registered successfully! You can now log in.");
      navigate("/login");
    } 
    catch (err) {
      alert(err.response?.data?.error || "Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-orange-800">
      <form 
          onSubmit={handleSubmit} 
          className="bg-black/50 p-8 rounded-xl shadow-lg space-y-6 w-full max-w-sm 
                    border border-gray-500"
        >

        <h1 className="text-2xl text-center text-orange-400">Register</h1>

        <input
          className="w-full p-2 rounded bg-neutral-800 text-white"
          placeholder="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-2 rounded bg-neutral-800 text-white"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 rounded bg-neutral-800 text-white"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="w-full p-2 rounded bg-neutral-800 text-white"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        


        <button className="w-full py-2 bg-orange-600 hover:bg-orange-700 rounded text-white font-semibold">
          Register
        </button>

        {/* Back to login */}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-2 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-white font-semibold"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}

