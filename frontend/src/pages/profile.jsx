// Profile.jsx
import { useState, useEffect } from "react";
import { User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState("Disabled");
  const [linkedAccounts, setLinkedAccounts] = useState("Google, Apple");

  // Fetch logged-in user info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5050/api/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.id) {
          const userRes = await fetch(`http://localhost:5050/api/users/${data.id}`);
          const userData = await userRes.json();
          setFullName(`${userData.firstName} ${userData.lastName}`);
          setEmail(userData.email);
          setPhone(userData.phone || "");
          setUsername(userData.username || "");
        }
      })
      .catch((err) => console.error("❌ Failed to load user info:", err));
  }, []);

  // Handle Save
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ");

    try {
      const res = await fetch("http://localhost:5050/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          username,
          password: password || undefined, // only update if provided
          twoFactor,
          linkedAccounts,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      alert("✅ Profile updated successfully");
      setEditing(false);
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("❌ Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-800 to-orange-800 flex flex-col items-center justify-start p-6 gap-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/chat")}
        className="absolute top-4 left-4 w-12 h-12 flex items-center justify-center bg-orange-600 text-white rounded-full hover:bg-orange-500 transition"
      >
        &larr;
      </button>
      {/* Page Title */}
      <h1 className="text-6xl sm:text-7xl font-light bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent text-center">
        Profile
      </h1>

      <div className="w-full max-w-5xl flex flex-col gap-6">
        {/* Personal Information */}
        <div className="bg-neutral-900/60 rounded-2xl shadow-lg p-6 flex flex-col gap-4">
          <h2 className="text-3xl font-semibold text-orange-400 flex items-center gap-2">
            <User size={28} /> Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-neutral-400 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!editing}
                className="bg-neutral-800 text-white p-2 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-neutral-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!editing}
                className="bg-neutral-800 text-white p-2 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-neutral-400 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!editing}
                className="bg-neutral-800 text-white p-2 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-neutral-400 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!editing}
                className="bg-neutral-800 text-white p-2 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Account & Security */}
        <div className="bg-neutral-900/60 rounded-2xl shadow-lg p-6 flex flex-col gap-4">
          <h2 className="text-3xl font-semibold text-orange-400 flex items-center gap-2">
            <Lock size={28} /> Account & Security
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-neutral-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                disabled={!editing}
                className="bg-neutral-800 text-white p-2 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-neutral-400 mb-1">Two-Factor Authentication</label>
              <select
                value={twoFactor}
                onChange={(e) => setTwoFactor(e.target.value)}
                disabled={!editing}
                className="bg-neutral-800 text-white p-2 rounded-lg"
              >
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-neutral-400 mb-1">Linked Accounts</label>
              <input
                type="text"
                value={linkedAccounts}
                onChange={(e) => setLinkedAccounts(e.target.value)}
                disabled={!editing}
                className="bg-neutral-800 text-white p-2 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
