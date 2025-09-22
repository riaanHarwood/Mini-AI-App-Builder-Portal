import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Password reset instructions sent to ${email}`);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-1000 to-orange-800">
      <form 
          onSubmit={handleSubmit} 
          className="bg-black/50 p-8 rounded-xl shadow-lg space-y-6 w-full max-w-sm 
                    border border-gray-500"
        >
        <h1 className="text-2xl text-center text-orange-400">Reset Password</h1>
        <input 
          className="w-full p-2 rounded bg-neutral-800 text-white"
          placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="w-full py-2 bg-orange-600 hover:bg-orange-700 rounded text-white font-semibold">
          Send Reset Link
        </button>

        {/* Back Button - I've implemented this for both the Registration form and ForgotPassword page*/}
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
