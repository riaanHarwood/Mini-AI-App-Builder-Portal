import { useState, useEffect, useRef } from "react";
import { Plus, Settings, User, History, HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Chat() {
  const navigate = useNavigate();
  const [active, setActive] = useState("chat");
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const dropdownRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Helper to keep each user's history separate
  const getHistoryKey = (u) => `chatHistory_${u?.id ?? u?.email ?? "default"}`;

  // Load user from localStorage on mount; history is loaded in the user-effect below
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // When user changes (login/logout), load or clear the user's chat history
  useEffect(() => {
    if (user) {
      const key = getHistoryKey(user);
      const storedHistory = localStorage.getItem(key);
      if (storedHistory) {
        try {
          setChatHistory(JSON.parse(storedHistory));
        } catch {
          setChatHistory([]);
        }
      } else {
        setChatHistory([]);
      }
    } else {
      // Not logged in → clear history from state (no persistence)
      setChatHistory([]);
      setCurrentChatId(null);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSignOut = () => {
    // Remove token/user and clear saved history for this user
    if (user) {
      const key = getHistoryKey(user);
      localStorage.removeItem(key);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setChatHistory([]);
    setMessages([]);
    setCurrentChatId(null);
    navigate("/login");
  };

  const handleKeyPress = async (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      setShowWelcome(false);

      const newMessage = { sender: "user", text: query };
      // append user message to the chat canvas
      setMessages((prev) => [...prev, newMessage]);

      // If user is logged in and this is the first message in this chat, create a new chat entry
      if (user && messages.length === 0) {
        const newChat = {
          id: Date.now(),
          title: query.length > 30 ? query.slice(0, 30) + "..." : query,
          messages: [newMessage],
        };
        setChatHistory((prev) => {
          const updated = [...prev, newChat];
          // persist per-user key
          localStorage.setItem(getHistoryKey(user), JSON.stringify(updated));
          return updated;
        });
        setCurrentChatId(newChat.id);
      }

      const currentQuery = query;
      setQuery("");

      // Add placeholder while waiting
      setMessages((prev) => [...prev, { sender: "ai", text: "...thinking" }]);

      try {
        const token = localStorage.getItem("token");

        // naive image-detection
        const isImageRequest =
          currentQuery.toLowerCase().includes("draw") ||
          currentQuery.toLowerCase().includes("image") ||
          currentQuery.toLowerCase().includes("diagram") ||
          currentQuery.toLowerCase().includes("picture");

        const response = await axios.post(
          "http://localhost:5050/api/ai",
          {
            type: isImageRequest ? "image" : "text",
            prompt: currentQuery,
          },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        // Replace placeholder with AI response AND update persisted chat (only if logged in)
        setMessages((prevMessages) => {
          // Remove placeholder
          const withoutPlaceholder = prevMessages.slice(0, -1);

          // Build AI message
          const aiMessage =
            response.data?.type === "image"
              ? { sender: "ai", imageUrl: response.data.imageUrl }
              : { sender: "ai", text: response.data.result };

          const updatedMessages = [...withoutPlaceholder, aiMessage];

          // Update chat history for the current chat (only if user)
          if (user) {
            setChatHistory((prevHistory) => {
              if (!prevHistory || prevHistory.length === 0) {
                // No history yet → nothing to update (shouldn't normally happen if we created a chat earlier)
                return prevHistory;
              }

              // Try to find the chat by currentChatId; fallback to last chat
              const idx = prevHistory.findIndex((c) => c.id === currentChatId);
              const targetIndex = idx !== -1 ? idx : prevHistory.length - 1;

              const updatedChat = {
                ...prevHistory[targetIndex],
                messages: updatedMessages,
              };

              const newHistory = [
                ...prevHistory.slice(0, targetIndex),
                updatedChat,
                ...prevHistory.slice(targetIndex + 1),
              ];

              localStorage.setItem(getHistoryKey(user), JSON.stringify(newHistory));
              return newHistory;
            });
          }

          return updatedMessages;
        });
      } catch (err) {
        console.error("Frontend API error:", err.response?.data || err.message);
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { sender: "ai", text: "❌ Something went wrong. Please try again." },
        ]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-700 to-orange-500 flex">
      {/* Sidebar */}
      <div className="w-64 bg-black/30 backdrop-blur-md p-6 flex flex-col justify-between border-r border-white/10">
        <div className="space-y-6 pl-6">
          <button
            onClick={() => {
              setMessages([]);
              setShowWelcome(true);
              setActive("chat");
              setCurrentChatId(null);
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition"
          >
            <Plus className="w-5 h-5 text-orange-400" />
            <span className="text-white">New Chat</span>
          </button>

          <div>
            <button
              onClick={() => setActive("history")}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition w-full"
            >
              <History className="w-5 h-5 text-orange-400" />
              <span className="text-white">Chat History</span>
            </button>

            {/* Display Chat History */}
            {active === "history" && (
              <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                {chatHistory.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setMessages(chat.messages || []);
                      setShowWelcome(false);
                      setActive("chat");
                      setCurrentChatId(chat.id);
                    }}
                    className="block w-full text-left text-sm text-neutral-300 hover:text-white hover:bg-white/5 px-2 py-1 rounded"
                  >
                    {chat.title}
                  </button>
                ))}
                {!user && (
                  <p className="text-xs text-neutral-500 px-2">(Sign in to save history)</p>
                )}
              </div>
            )}
          </div>
        </div>

      {/* Profile & Settings */}
      <div className="space-y-6 pl-6 relative" ref={dropdownRef}>
        {!user ? (
          // Only show Sign In button when no user
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition"
          >
            <User className="w-5 h-5 text-orange-400" />
            <span className="text-white">Sign In</span>
          </button>
        ) : (
          // Show Profile & Settings when user is signed in
          <>
            <div className="relative">
              {showProfileOptions && (
                <div className="absolute bottom-12 left-0 w-40 bg-neutral-900 rounded-lg shadow-lg border border-white/10 z-10">
                  <button
                    onClick={() => {
                      setShowProfileOptions(false);
                      navigate("/help");
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 transition"
                  >
                    <HelpCircle className="w-4 h-4 text-orange-400" />
                    Help
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileOptions(false);
                      navigate("/profile");
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 transition"
                  >
                    <User className="w-4 h-4 text-orange-400" />
                    Profile
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 transition"
                  >
                    <LogOut className="w-4 h-4 text-orange-400" />
                    Sign Out
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowProfileOptions((prev) => !prev)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition"
              >
                <User className="w-5 h-5 text-orange-400" />
                <span className="text-white font-semibold">{user.firstName}</span>
              </button>
            </div>

            <button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition"
            >
              <Settings className="w-5 h-5 text-orange-400" />
              <span className="text-white">Settings</span>
            </button>
          </>
        )}
      </div>
    </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-8 space-y-4 max-h-[calc(100vh-80px)]">
          {showWelcome && (
            <div className="text-center mt-20">
              <h1 className="text-6xl sm:text-7xl font-light bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                Hi{user ? `, ${user.firstName}` : ""}
              </h1>
              <p className="mt-2 text-2xl text-neutral-300">How can I help you today?</p>
            </div>
          )}

          {!showWelcome &&
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xl px-4 py-3 rounded-xl text-white ${
                    msg.sender === "user" ? "bg-orange-600 text-right" : "bg-black/40 text-left"
                  }`}
                >
                  {msg.text && <span>{msg.text}</span>}
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="AI generated"
                      className="rounded-xl max-w-sm border border-gray-600 mt-2"
                    />
                  )}
                </div>
              </div>
            ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Fixed Search Bar */}
        <div className="Search bar p-6 bg-transparent">
          <div className="max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="w-full p-4 rounded-xl border border-gray-500 bg-black/30 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
