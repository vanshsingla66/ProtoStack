import { useState } from "react";
import { Send } from "lucide-react";

export default function RoadmapPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi 👋 Tell me what you want to learn, and I'll generate a roadmap for you."
    }
  ]);
  const [input, setInput] = useState("");

  const generateRoadmap = (query) => {
    // Dummy AI response (replace with backend later)
    return `
📍 Roadmap for ${query}:

1. Basics
- Learn fundamentals
- Practice simple problems

2. Intermediate
- Build projects
- Learn frameworks

3. Advanced
- Optimize performance
- Work on real-world apps

🚀 Keep consistency and build projects!
`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const aiMessage = {
      role: "assistant",
      content: generateRoadmap(input)
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-24">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-2xl ${
              msg.role === "user" ? "ml-auto text-right" : ""
            }`}
          >
            <div
              className={`inline-block px-4 py-3 rounded-xl text-sm whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 md:left-[220px] bg-stone-50 border-t p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for a roadmap (e.g., 'Backend Developer')..."
            className="flex-1 border rounded-lg px-4 py-2 text-sm outline-none focus:border-black"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={handleSend}
            className="bg-black text-white p-2 rounded-lg hover:bg-neutral-800"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}