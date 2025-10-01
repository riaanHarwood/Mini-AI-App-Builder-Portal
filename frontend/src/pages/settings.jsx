import { useState } from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");
  const navigate = useNavigate(); // initialize navigate

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-800 to-orange-500 flex flex-col items-center justify-center p-4 relative">
      
      {/* Back Button */}
      <button
          onClick={() => navigate("/chat")}
          className="absolute top-4 left-4 w-12 h-12 flex items-center justify-center bg-orange-600 text-white rounded-full hover:bg-orange-500 transition border border-white"
          >
          &larr;
      </button>

      {/* Page Title */}
      <h1 className="text-4xl sm:text-6xl leading-tight sm:leading-snug font-light bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent text-center mb-8">
        Settings
    </h1>
      <div className="flex w-full max-w-5xl bg-neutral-950/60 rounded-2xl shadow-lg overflow-hidden min-h-[500px]">
        {/* Sidebar */}
        <div className="w-1/4 flex flex-col border-r border-neutral-700 space-y-5">
          {[
            { id: "account", label: "Account" },
            { id: "privacy", label: "Privacy & Security" },
            { id: "notifications", label: "Notifications" },
            { id: "support", label: "FAQ’s & Support" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-left text-xl transition-colors ${
                activeTab === tab.id
                  ? "bg-orange-600 text-white"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 text-neutral-200">
          {activeTab === "account" && (
            <div>
              <h2 className="text-5xl font-semibold mb-15 text-center">Account Settings</h2>
              <ul className="space-y-10 text-2xl text-left">
                <li>Update profile information</li>
                <li>Change password</li>
                <li>Linked accounts</li>
                <li>Delete account</li>
              </ul>
            </div>
          )}

          {activeTab === "privacy" && (
            <div>
              <h2 className="text-5xl font-semibold mb-15 text-center">Privacy & Security</h2>
              <ul className="space-y-10 text-2xl text-left">
                <li>Manage data & permissions</li>
                <li>Two-factor authentication</li>
                <li>Clear chat history</li>
                <li>Export/download data</li>
              </ul>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h2 className="text-5xl font-semibold mb-15 text-center">Notifications</h2>
              <ul className="space-y-10 text-2xl text-left">
                <li>Email notifications</li>
                <li>Push notifications</li>
                <li>Feature updates</li>
                <li>Activity reminders</li>
              </ul>
            </div>
          )}

          {activeTab === "support" && (
            <div>
              <h2 className="text-5xl font-semibold mb-15 text-center">FAQ’s & Support</h2>
              <ul className="space-y-10 text-2xl text-left">
                <li>Browse FAQ’s</li>
                <li>Contact support</li>
                <li>Report a bug</li>
                <li>Community forum</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
