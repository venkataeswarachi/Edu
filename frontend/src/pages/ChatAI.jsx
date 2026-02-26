import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { aiApi } from "../services/api";
import ReactMarkdown from "react-markdown";
import { Send, Bot, User, Sparkles, Trash2 } from "lucide-react";

const TypingIndicator = () => (
    <div className="flex items-start gap-3 animate-fade-up">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
            <Bot size={15} />
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <div className="flex gap-1.5 items-center h-5">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
            </div>
        </div>
    </div>
);

const ChatAI = () => {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);
    const textareaRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/");
    }, [navigate]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, loading]);

    const handleSend = async () => {
        const userMessage = message.trim();
        if (!userMessage || loading) return;
        const newHistory = [...chatHistory, { role: "user", text: userMessage }];
        setChatHistory(newHistory);
        setMessage("");
        setLoading(true);
        try {
            const res = await aiApi.post("/chat", { message: userMessage });
            const reply = res.data?.reply?.trim() || "I couldn't generate a response. Please try again.";
            setChatHistory([...newHistory, { role: "ai", text: reply }]);
        } catch (err) {
            const msg = err.code === "ECONNABORTED"
                ? "Request timed out — the AI is taking too long. Please try again."
                : err.response?.status === 500
                    ? "The AI service encountered an error. Please check that ai-service is running and the GROQ_API_KEY is valid."
                    : "Unable to reach the AI service. Make sure it's running on port 8000.";
            setChatHistory([...newHistory, { role: "ai", text: msg }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                        <Sparkles size={18} className="text-white" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-lg font-black text-slate-900 flex items-center">
                            <span>DEVIKA</span>
                            <span className="ml-1 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI</span>
                        </h1>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs text-emerald-600 font-semibold">Online · Ready to help</span>
                        </div>
                    </div>
                </div>
                {chatHistory.length > 0 && (
                    <button
                        onClick={() => setChatHistory([])}
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl hover:border-red-200 transition-all"
                    >
                        <Trash2 size={13} />
                        Clear chat
                    </button>
                )}
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto py-6 px-6 space-y-4">
                {chatHistory.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-full text-center gap-4 pb-12">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-200 mb-2">
                            <Sparkles size={34} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800">Hey, I'm DEVIKA!</h2>
                        <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
                            Your AI-powered learning assistant. Ask me anything — study tips, career guidance, coding help, or just chat.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 max-w-md w-full">
                            {[
                                "What domains should I focus on for AI careers?",
                                "Explain neural networks in simple terms",
                                "How do I prepare for GATE exams?",
                                "What are the trending technologies in 2025?",
                            ].map((prompt) => (
                                <button
                                    key={prompt}
                                    onClick={() => { setMessage(prompt); textareaRef.current?.focus(); }}
                                    className="text-left text-xs bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all font-medium"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {chatHistory.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex items-start gap-3 animate-fade-up ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                        {/* Avatar */}
                        <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === "user"
                                ? "bg-gradient-to-br from-slate-700 to-slate-900 text-white"
                                : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                                }`}
                        >
                            {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                        </div>

                        {/* Bubble */}
                        <div
                            className={`max-w-lg group relative ${msg.role === "user"
                                ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-md shadow-indigo-100"
                                : "bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm"
                                }`}
                        >
                            {msg.role === "ai" ? (
                                <div className="prose prose-sm max-w-none prose-p:my-1 prose-p:text-slate-700 prose-headings:text-slate-900 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm">
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                            ) : (
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                            )}
                        </div>
                    </div>
                ))}

                {loading && <TypingIndicator />}
                <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div className="bg-white border-t border-slate-200 px-6 py-4">
                <div className="max-w-4xl mx-auto flex gap-3 items-end">
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask DEVIKA anything… (Enter to send)"
                            rows={1}
                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 pr-12 text-sm text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 focus:bg-white transition-all"
                            style={{ maxHeight: 120, minHeight: 48 }}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!message.trim() || loading}
                        className="mb-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all hover:scale-105"
                    >
                        <Send size={17} />
                    </button>
                </div>
                <p className="text-center text-[10px] text-slate-400 mt-2">
                    <kbd className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px]">Enter</kbd> to send · <kbd className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px]">Shift+Enter</kbd> for new line
                </p>
            </div>
        </div>
    );
};

export default ChatAI;
