import { useState, useEffect, useRef } from "react";
import { IoChatbubblesOutline } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import { ChatBotService } from "@/services/API/chatbot.service"; // chỉnh path đúng nếu khác

export default function ChatBot() {
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Xin chào! Bạn cần hỗ trợ gì?", html: "" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (showChat && userId) {
        try {
          const res = await ChatBotService.getHistoryChat(userId);
          const history = res.data?.data || [];
  
          // Sắp xếp theo thời gian tạo (tăng dần)
          history.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  
          // Chuyển đổi dữ liệu thành messages
          const formattedMessages = history.flatMap((item) => {
            const messages = [];
  
            if (item.question) {
              messages.push({
                sender: "user",
                text: item.question,
                html: "",
              });
            }
  
            if (item.answer) {
              const htmlPattern = /<\/?[a-z][\s\S]*?>/i;
              messages.push({
                sender: "bot",
                text: htmlPattern.test(item.answer) ? "" : item.answer,
                html: htmlPattern.test(item.answer) ? item.answer : "",
              });
            }
  
            return messages;
          });
  
          setMessages([
            { sender: "bot", text: "Xin chào! Bạn cần hỗ trợ gì?", html: "" },
            ...formattedMessages,
          ]);
        } catch (error) {
          console.error("❌ Lỗi lấy lịch sử chat:", error);
        }
      }
    };
  
    fetchHistory();
  }, [showChat, userId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Thêm tin nhắn người dùng vào danh sách
    const newMessages = [
      ...messages,
      { sender: "user", text: input, html: "" },
    ];
    setMessages(newMessages);
    setInput("");

    try {
      setLoading(true);
      const payload = {
        question: input,
      };
      
      if (userId) {
        payload.user_id = userId;
      }
      
      const response = await ChatBotService.askChatBot(payload);
      const botReply =
        response.data.data || "Xin lỗi, tôi chưa có câu trả lời.";

      // Regex nhận diện HTML
      const htmlPattern = /<\/?[a-z][\s\S]*?>/i;

      if (htmlPattern.test(botReply)) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "", html: botReply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: botReply, html: "" },
        ]);
      }
    } catch (error) {
      console.error("❌ Lỗi gọi chatbot:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Có lỗi xảy ra. Vui lòng thử lại sau!",
          html: "",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  // console.log("chat", input);

  return (
    <>
      {/* Nút mở chat */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-20 right-6 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg z-50"
        >
          <IoChatbubblesOutline className="w-8 h-8" />
        </button>
      )}

      {/* Chat Box */}
      {showChat && (
        <div className="fixed bottom-20 right-6 bg-white w-[500px] h-[600px] shadow-lg rounded-lg flex flex-col z-50">
          {/* Header */}
          <div className="bg-red-500 text-white p-3 rounded-t-lg flex justify-between items-center">
            <span>Chat Bot</span>
            <button onClick={() => setShowChat(false)}>✕</button>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 p-4 overflow-y-auto text-md text-gray-700 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-96 p-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {/* Nếu có HTML thì render HTML, còn không thì render markdown */}
                  {msg.html ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: msg.html }}
                      className="prose max-w-full"
                    />
                  ) : (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {loading && <p className="text-gray-400 italic">Đang trả lời...</p>}
            <div ref={bottomRef}></div>
          </div>

          {/* Gửi tin nhắn */}
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="border flex-1 rounded px-2 py-1 text-sm focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
