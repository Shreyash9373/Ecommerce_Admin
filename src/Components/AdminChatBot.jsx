import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import chatbot from "../assets/chatbot.png";
import mic from "../assets/mic.png";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = "en-US";

const speakText = (text) => {
  if (!window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.pitch = 1;
  utterance.rate = 1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
};

const AdminChatBot = () => {
  const [query, setQuery] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  let isVoiceQuery = false;

  const handleVoiceInput = () => {
    isVoiceQuery = true;
    recognition.start();

    recognition.onstart = () => {
      console.log("Voice recognition started...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript); // Fill the input with recognized speech
      setBotResponse("Listening...");
      handleSend(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      console.log("Voice recognition ended.");
    };
  };

  const promptSuggestions = [
    {
      text: "Show me pending products",
      route: "/manageProducts?status=pending", // update to match your route
    },
    {
      text: "Show me approved products",
      route: "/manageProducts?status=approved", // if applicable
    },
    {
      text: "Show me approved vendors",
      route: "/manageVendor?status=approved",
    },
  ];

  const handleSend = async (customQuery) => {
    const finalQuery = typeof customQuery === "string" ? customQuery : query;

    if (
      !finalQuery ||
      typeof finalQuery !== "string" ||
      finalQuery.trim() === ""
    ) {
      return;
    }

    try {
      setBotResponse("Thinking...");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/chat`,
        { query: finalQuery },
        { withCredentials: true }
      );

      const { intent, message } = res.data.response;
      setBotResponse(message);

      // Speak only if the query was voice triggered
      if (isVoiceQuery) {
        speakText(message);
        isVoiceQuery = false; // reset after speaking
      }

      switch (intent) {
        case "show pending products":
          navigate("/manageProducts?status=pending");
          break;
        case "show approved products":
          navigate("/manageProducts?status=approved");
          break;
        case "show rejected products":
          navigate("/manageProducts?status=rejected");
          break;
        case "show pending Vendors":
          navigate("/manageVendor?status=pending");
          break;
        case "show approved vendors":
          navigate("/manageVendor?status=approved");
          break;
        case "show rejected vendors":
          navigate("/manageVendor?status=rejected");
          break;
        case "show top products":
          const range = res.data.response.parameters?.range || "week";
          const productRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getTopSellingProducts?range=${range}`,
            { withCredentials: true }
          );

          const topProducts = productRes.data.topProducts;
          const list = topProducts
            .map((p, idx) => `${idx + 1}. ${p.name} (${p.totalSold} sold)`)
            .join("\n");

          setBotResponse(`${message}\n\n${list}`);
          break;

        case "show out-of-stock products":
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getOutOfStockProducts`,
              { withCredentials: true }
            );

            const products = response.data.Products;

            if (products.length === 0) {
              setBotResponse("All products are in stock!");
            } else {
              const list = products
                .map((p, idx) => `${idx + 1}. ${p.name} (Stock: ${p.stock})`)
                .join("\n");

              setBotResponse(`Out of stock products:\n\n${list}`);
            }
          } catch (error) {
            console.error("Error fetching out-of-stock products", error);
            setBotResponse("Failed to fetch out-of-stock products.");
          }
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
    // setIsOpen(false);
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <button
        className="fixed bottom-4 right-4  text-black border border-black px-4 py-2 rounded-full shadow-md z-50 hover:bg-gray-300 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          "Close"
        ) : (
          <img src={chatbot} alt="Chatbot" className="w-12 h-12" />
        )}
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
          <div className="flex gap-2">
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white w-full py-2 rounded-md"
            >
              Send
            </button>
            <button
              onClick={handleVoiceInput}
              className=" text-white px-3 rounded-full bg-gray-300"
            >
              <img src={mic} alt="Voice Input" className="w-6 h-6" />
            </button>
          </div>

          {botResponse && (
            <pre className="mt-3 bg-gray-100 p-2 text-sm rounded-md whitespace-pre-wrap break-words max-w-full ">
              {botResponse}
            </pre>
          )}
        </div>
      )}
    </>
  );
};

export default AdminChatBot;
