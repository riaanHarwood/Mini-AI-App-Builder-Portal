import { useState } from "react";
import { Plus, Settings, User, History } from "lucide-react"; // icons

export default function Chat() {
  const [active, setActive] = useState("chat");

  return (
    // Menu Bar Options
    //
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

        {/* Bottom section - Profile & Settings Options */}
        <div className="space-y-6 pl-6">
          <button
            onClick={() => setActive("profile")}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition"
          >
            <User className="w-5 h-5 text-orange-400" />
            <span className="text-white">Profile</span>
          </button>

          <button
            onClick={() => setActive("settings")}
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
        <p className="mt-6 text-neutral-300 text-lg">
          {active === "chat" && "Start chatting with your AI assistant."}
          {active === "new" && "Create a brand new chat."}
          {active === "history" && "Here’s your chat history."}
          {active === "profile" && "Manage your profile settings here."}
          {active === "settings" && "Customize your app experience."}
        </p>
      </div>
    </div>
  );
}
