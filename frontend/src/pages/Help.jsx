import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom"; 

export default function Help() {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I update my profile information?",
      answer:
        "Go to your Profile page from the sidebar. There you can edit your name, email, phone number, and password. Make sure to save changes when finished."
    },
    {
      question: "Is my data secure with this app?",
      answer:
        "Yes. Your data is encrypted both in transit and at rest. We also offer two-factor authentication in the Settings page for extra protection."
    },
    {
      question: "How can I reset my password?",
      answer:
        "If you forget your password, click on 'Forgot Password' from the login screen or your profile page. You’ll receive a reset link via email."
    },
    {
      question: "How do I contact support?",
      answer:
        "Navigate to Settings > FAQ’s & Support. From there, you can send us a message or browse community forums."
    },
    {
      question: "Can I export my chat history?",
      answer:
        "Yes. Go to Settings > Privacy & Security, and you’ll find an option to export or download your chat data."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-800 to-orange-800 flex flex-col items-center justify-start p-6 gap-15">
      <h1 className="text-6xl sm:text-7xl font-light bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent text-center">
        Help & FAQ’s
      </h1>

      {/* Back Button */}
      <button
            onClick={() => navigate("/chat")}
            className="absolute top-4 left-4 w-12 h-12 flex items-center justify-center bg-orange-600 text-white rounded-full hover:bg-orange-500 transition"
             >
         &larr;
      </button>

      <div className="w-full max-w-3xl flex flex-col gap-5">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-neutral-900/70 rounded-xl shadow-lg p-4 cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            {/* Question row */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-orange-400">
                {faq.question}
              </h2>
              {openIndex === index ? (
                <ChevronUp className="text-orange-400" />
              ) : (
                <ChevronDown className="text-orange-400" />
              )}
            </div>

            {/* Answer */}
            {openIndex === index && (
              <p className="mt-3 text-neutral-200 text-lg leading-relaxed">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

