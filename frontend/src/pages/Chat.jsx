import { useState } from "react";
import { User, Settings, LogOut } from "lucide-react";

export default function Chat() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`${
          menuOpen ? "w-40" : "w-18"
        } bg-white border-r border-gray-200 shadow-lg flex flex-col items-center py-6 transition-all duration-300`}
      >
        {/* Toggle button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mb-8 p-2 rounded-lg hover:bg-gray-100"
        >
          <span className="text-gray-600">{menuOpen ? "←" : "☰"}</span>
        </button>

        <div className="flex-1"></div>

        {/* Bottom menu items - Profile, Settings, & Logout buttons*/}
        <div className="flex flex-col gap-6 items-center w-full mb-6">
          {/* Profile */}
          <button className="flex flex-col items-center">
            <User className="text-gray-700 w-6 h-6" />
            {menuOpen && (
              <span className="text-sm text-gray-600 mt-1">Profile</span>
            )}
          </button>

          {/* Settings */}
          <button className="flex flex-col items-center">
            <Settings className="text-gray-700 w-6 h-6" />
            {menuOpen && (
              <span className="text-sm text-gray-600 mt-1">Settings</span>
            )}
          </button>

          {/* Logout */}
          <button className="flex flex-col items-center">
            <LogOut className="text-red-500 w-6 h-6" />
            {menuOpen && (
              <span className="text-sm text-red-500 mt-1">Logout</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-8">
        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-light text-gray-800 text-center drop-shadow-sm mt-8 mb-12">
          Let's start creating!
        </h1>

        {/* Chat container */}
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl border border-gray-200 flex flex-col h-[70vh]">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <p className="text-gray-600 text-center">
              🚀 Welcome to your AI-powered builder portal. Start by chatting below.
            </p>
          </div>

          {/* Messages area */}
          <div className="flex-1 p-6 overflow-y-auto">
            <p className="text-gray-400 text-center">Your messages will appear here...</p>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
