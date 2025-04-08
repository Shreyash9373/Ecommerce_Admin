import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminChatBot = () => {
  const [query, setQuery] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const promptSuggestions = [
    {
      text: "Show me pending products",
      route: "/manageProducts", // update to match your route
    },
    {
      text: "Show me approved products",
      route: "/manageProduct", // if applicable
    },
    {
      text: "Show me approved vendors",
      route: "/manageVendor",
    },
  ];

  const handleSend = async () => {
    if (!query.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/chat`,
        { query },
        { withCredentials: true }
      );

      const { intent, message } = res.data.response;
      setBotResponse(message);

      switch (intent) {
        case "show pending products":
          navigate("/manageProducts");
          break;
        case "show out-of-stock products":
          navigate("/manageProducts?status=out-of-stock");
          break;
        case "show recent orders":
          navigate("/manageOrder?filter=recent");
          break;
        case "show user statistics":
          navigate("/dashboard");
          break;
        case "unknown":
          break;
        default:
          console.warn("Unhandled intent:", intent);
      }
    } catch (err) {
      console.error(err);
      setBotResponse("Something went wrong. Try again.");
    }
  };

  const handleSuggestionClick = (text, route) => {
    setQuery(text);
    setBotResponse(`You selected: ${text}`);
    navigate(route);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <button
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-md z-50 hover:bg-blue-700 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Close" : "Chat"}
      </button>

      {/* Chatbot Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-xl z-50 p-4">
          <h2 className="text-lg font-semibold mb-2">Hi Admin! 👋</h2>
          <p className="text-sm mb-3 text-gray-600">How can i help you 😊</p>
          <ul className="space-y-2 mb-4">
            {promptSuggestions.map((item, idx) => (
              <li key={idx}>
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => handleSuggestionClick(item.text, item.route)}
                >
                  {item.text}
                </button>
              </li>
            ))}
          </ul>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask something..."
            className="border w-full px-3 py-2 rounded-md text-sm mb-2"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white w-full py-2 rounded-md"
          >
            Send
          </button>

          {botResponse && (
            <div className="mt-3 bg-gray-100 p-2 text-sm rounded-md">
              {botResponse}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AdminChatBot;
