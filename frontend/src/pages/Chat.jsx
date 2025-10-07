import { useState, useEffect, useRef } from "react";
import { Plus, Settings, User, History, HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LiveProvider, LivePreview, LiveError } from "react-live";

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [type, setType] = useState("text"); // text | image | ui
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSend = async () => {
      if (!input.trim()) return;

      // Step 1: Add the user's message immediately
      const userMsg = { role: "user", content: input, type };
      setMessages(prev => [...prev, userMsg]);
      setInput("");

      // Step 2: Add a temporary "loading" assistant message
      const loadingMsg = { role: "assistant", content: "⏳ Thinking...", type: "text", loading: true };
      setMessages(prev => [...prev, loadingMsg]);

      try {
        const res = await axios.post("http://localhost:5050/api/ai/", { type, prompt: input });
        const data = res.data;

        // Remove the loading message
        setMessages(prev => prev.filter(msg => !msg.loading));

        // Add the actual assistant message
        if (data.type === "text") {
          setMessages(prev => [...prev, { role: "assistant", content: data.result, type: "text" }]);
        } else if (data.type === "image") {
          setMessages(prev => [...prev, { role: "assistant", imageUrl: data.imageUrl, type: "image" }]);
        } else if (data.type === "ui") {
          setMessages(prev => [...prev, { role: "assistant", code: data.code, type: "ui" }]);
        } else {
          setMessages(prev => [...prev, { role: "assistant", content: "❌ Unexpected response", type: "text" }]);
        }
      } catch (err) {
        console.error("Send error:", err);
        setMessages(prev => [
          ...prev.filter(msg => !msg.loading),
          { role: "assistant", content: "❌ Something went wrong", type: "text" },
      ]);
    }
  };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-orange-500">Mini AI Builder</h1>
          <button onClick={() => window.location.reload()} className="text-gray-500 hover:text-orange-500">
            <Plus />
          </button>
        </div>

       <div className="flex-1 space-y-2">
  <button className="w-full flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
    <History size={18} />
    <span>History</span>
  </button>

        {/* Profile Button */}
        <button
          onClick={() => navigate("/profile")}
          className="w-full flex items-center space-x-2 p-2 rounded hover:bg-gray-100"
        >
          <User size={18} />
          <span>Profile</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => navigate("/settings")}
          className="w-full flex items-center space-x-2 p-2 rounded hover:bg-gray-100"
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>

        {/* Help Button */}
        <button
          onClick={() => navigate("/help")}
          className="w-full flex items-center space-x-2 p-2 rounded hover:bg-gray-100"
        >
          <HelpCircle size={18} />
          <span>Help</span>
        </button>
      </div>


        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 p-2 rounded text-red-500 hover:bg-red-50 mt-4"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-orange-500 text-white"
                    : "bg-white border text-gray-800"
                }`}
              >
                {msg.type === "text" && <div className="whitespace-pre-wrap">{msg.content}</div>}

                {msg.type === "image" && msg.imageUrl && (
                  <img src={msg.imageUrl} alt="Generated" className="rounded-lg" />
                )}

               {msg.type === "ui" && msg.code && (
                  <div className="w-full">
                    <LiveProvider code={msg.code} noInline>
                      <LivePreview className="border rounded-lg p-4 mt-2 bg-gray-50" />
                      <LiveError className="text-red-500 mt-2 whitespace-pre-wrap" />
                    </LiveProvider>
                  </div>
                  )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t flex items-center space-x-2">
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="text">Text</option>
            <option value="ui">UI</option>
            <option value="image">Image</option>
          </select>
          <input
            type="text"
            placeholder="Type your prompt..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            className="flex-1 border rounded px-4 py-2 focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
