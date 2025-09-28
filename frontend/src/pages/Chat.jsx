import { useState, useEffect, useRef } from "react";
import { Plus, Settings, User, History, HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const [active, setActive] = useState("chat");
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-800 to-orange-800 flex">
      {/* Sidebar */}
      <div className="w-64 bg-black/30 backdrop-blur-md p-6 flex flex-col justify-between border-r border-white/10">
        {/* Top section */}
        <div className="space-y-6 pl-6">
          <button
            onClick={() => setActive("new")}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition"
          >
            <Plus className="w-5 h-5 text-orange-400" />
            <span className="text-white">New Chat</span>
          </button>

          <button
            onClick={() => setActive("history")}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition"
          >
            <History className="w-5 h-5 text-orange-400" />
            <span className="text-white">Chat History</span>
          </button>
        </div>

        {/* Bottom section - Profile & Settings */}
        <div className="space-y-6 pl-6 relative" ref={dropdownRef}>
          <div className="relative">
            {/* Profile Dropdown */}
            {showProfileOptions && (
              <div className="absolute bottom-12 left-0 w-40 bg-neutral-900 rounded-lg shadow-lg border border-white/10 z-10">
                <button
                  onClick={() => navigate("/help")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 transition"
                >
                  <HelpCircle className="w-4 h-4 text-orange-400" />
                  Help
                </button>

                 <button
                  onClick={() => navigate("/profile")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 transition"
                >
                  <HelpCircle className="w-4 h-4 text-orange-400" />
                  Profile
                </button>

                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 transition"
                  >
                    <LogOut className="w-4 h-4 text-orange-400" />
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 transition"
                  >
                    <User className="w-4 h-4 text-orange-400" />
                    Sign In
                  </button>
                )}
              </div>
            )}

            {/* Profile Button */}
            <button
              onClick={() => setShowProfileOptions((prev) => !prev)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition"
            >
              <User className="w-5 h-5 text-orange-400" />
              {!user ? (
                <span className="text-white">Profile</span>
              ) : (
                <span className="text-white font-semibold">{user.firstName}</span>
              )}
            </button>
          </div>

          {/* Settings */}
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition"
          >
            <Settings className="w-5 h-5 text-orange-400" />
            <span className="text-white">Settings</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-6xl sm:text-7xl font-light bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent text-center">
          Hi, How can I help you today?
        </h1>
        <div className="mt-6 text-neutral-300 text-lg text-center space-y-4">
          {active === "chat" && <p>Start chatting with your AI assistant.</p>}
        </div>
      </div>
    </div>
  );
}
