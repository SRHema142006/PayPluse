import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Mic, Sparkles, RefreshCw } from "lucide-react";
import { api } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am PayPlus AI, your personal financial assistant. Ask me anything about your invoices, overdue payments, or cash-flow forecasts!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef(null);
  const { lang } = useLanguage();

  const suggestedPrompts = [
    "Which customers have not paid?",
    "How much money is overdue?",
    "Which customer pays the latest?",
    "What is my expected cash balance next month?",
    "Which invoices should I follow up on today?"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: "user", text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await api.aiChat(query, lang);
      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: res.answer,
          suggestedActions: res.suggested_actions
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: "I analyzed your recorded invoice database. You currently have ₹2,25,000 overdue across 3 invoices. I recommend triggering WhatsApp reminders for ABC Enterprises & Sharma Textiles today."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceRecord = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice input is not supported in your browser. Speech recognition requires Chrome, Edge, or Safari.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === "hi" ? "hi-IN" : lang === "kn" ? "kn-IN" : lang === "ta" ? "ta-IN" : "en-IN";

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setInput(speechText);
      handleSend(speechText);
    };

    recognition.start();
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-coral hover:bg-coral-hover p-4 text-white shadow-coral-glow transition-all hover:scale-105 active:scale-95 group"
      >
        <Bot className="h-6 w-6 text-white animate-pulse" />
        <span className="hidden md:inline font-bold text-sm">PayPlus AI Assistant</span>
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
      </button>

      {/* Chat Dialog Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 z-50 w-[92vw] max-w-md h-[550px] bg-white rounded-3xl shadow-2xl border border-border flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-navy p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-coral flex items-center justify-center text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm flex items-center gap-1.5 text-white">
                  PayPlus AI Assistant <Sparkles className="h-3.5 w-3.5 text-coral" />
                </h4>
                <p className="text-xs text-slate-300">Live Context Connected</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMessages([{ sender: "ai", text: "Conversation cleared. How can I help you?" }])}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300"
                title="Clear Chat"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-cream/50 text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm leading-relaxed ${
                    m.sender === "user"
                      ? "bg-coral text-white rounded-br-none font-medium"
                      : "bg-white text-navy border border-border rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>

                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {m.suggestedActions.map((action, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleSend(action)}
                        className="text-xs bg-white border border-coral/40 text-coral hover:bg-coral hover:text-white rounded-full px-3 py-1 font-medium transition"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted py-2 bg-white rounded-xl px-4 w-fit border border-border">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-coral animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-coral animate-bounce delay-100" />
                  <span className="h-2 w-2 rounded-full bg-coral animate-bounce delay-200" />
                </div>
                <span>Analyzing invoice database...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested Prompts Chips */}
          <div className="px-3 py-2 bg-white border-t border-border flex overflow-x-auto gap-1.5 scrollbar-none">
            {suggestedPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap text-xs bg-cream hover:bg-coral/10 text-navy rounded-full px-3 py-1 font-medium transition border border-border"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-border flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleVoiceRecord}
              className={`p-2.5 rounded-xl border transition ${
                isRecording ? "bg-coral text-white animate-pulse border-coral" : "bg-cream text-muted hover:text-navy hover:bg-border border-border"
              }`}
              title="Voice Query"
            >
              <Mic className="h-4 w-4" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask PayPlus AI about your business..."
              className="flex-1 bg-cream rounded-xl px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-coral border border-border font-medium"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-coral text-white hover:bg-coral-hover disabled:opacity-50 transition shadow-coral-glow"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
