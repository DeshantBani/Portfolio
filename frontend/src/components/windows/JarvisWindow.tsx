"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  onAction?: (action: Record<string, string>) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function JarvisWindow({ onAction }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showWaveform, setShowWaveform] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasGreeted = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messages, scrollToBottom]);

  // Initial JARVIS greeting
  useEffect(() => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;
    streamResponse(
      "Hey — I'm Deshant's AI. I know everything about his work, his projects, and his skills. Ask me anything, or say 'give me the tour.' You can also type.",
      true
    );
  }, []);

  async function streamResponse(text: string, isGreeting = false) {
    setIsStreaming(true);
    setShowWaveform(true);

    const newMsg: ChatMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, newMsg]);

    let full = "";
    for (let i = 0; i < text.length; i++) {
      full += text[i];
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: full };
        return updated;
      });
      await new Promise((r) => setTimeout(r, 15 + Math.random() * 10));
    }

    // Check for action JSON at end
    const actionMatch = full.match(/\{[^{}]*"action"[^{}]*\}\s*$/);
    if (actionMatch) {
      try {
        const action = JSON.parse(actionMatch[0]);
        onAction?.(action);
        const cleanContent = full.replace(actionMatch[0], "").trim();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: cleanContent };
          return updated;
        });
      } catch { /* not valid JSON, ignore */ }
    }

    setIsStreaming(false);
    setShowWaveform(false);
  }

  async function sendMessage() {
    const msg = input.trim();
    if (!msg || isStreaming) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok || !res.body) {
        await streamResponse(
          "I'm having trouble connecting to my backend. Make sure the FastAPI server is running!"
        );
        return;
      }

      setIsStreaming(true);
      setShowWaveform(true);

      const newMsg: ChatMessage = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, newMsg]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.done) continue;
            if (data.token) {
              full += data.token;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: full };
                return updated;
              });
            }
          } catch { /* skip malformed lines */ }
        }
      }

      // Check for action
      const actionMatch = full.match(/\{[^{}]*"action"[^{}]*\}\s*$/);
      if (actionMatch) {
        try {
          const action = JSON.parse(actionMatch[0]);
          onAction?.(action);
          const cleanContent = full.replace(actionMatch[0], "").trim();
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: cleanContent };
            return updated;
          });
        } catch { /* ignore */ }
      }

      setIsStreaming(false);
      setShowWaveform(false);
    } catch {
      await streamResponse(
        "Hmm, I can't reach my backend right now. The FastAPI server might not be running."
      );
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* JARVIS Waveform */}
      <div className="flex items-center justify-center py-3 border-b border-emerald-500/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`flex items-center gap-0.5 h-8 ${showWaveform ? "animate-pulse" : ""}`}>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 bg-emerald-400 rounded-full"
                  animate={{
                    height: showWaveform
                      ? [4, 8 + Math.random() * 20, 4]
                      : [3, 5, 3],
                  }}
                  transition={{
                    duration: 0.4 + Math.random() * 0.3,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400/50">
            {isStreaming ? "speaking..." : "ready"}
          </span>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`text-xs px-2 py-1 rounded font-mono transition-colors ${
              isMuted
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            }`}
          >
            {isMuted ? "🔇 muted" : "🔊 audio"}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-3 py-2 rounded-lg text-sm font-mono ${
                  msg.role === "user"
                    ? "bg-emerald-500/20 text-emerald-100 border border-emerald-500/20"
                    : "bg-[#151515] text-gray-300 border border-emerald-500/10"
                }`}
              >
                {msg.content}
                {i === messages.length - 1 && isStreaming && msg.role === "assistant" && (
                  <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-emerald-400 animate-pulse align-middle" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-emerald-500/10">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask JARVIS anything..."
            disabled={isStreaming}
            className="flex-1 bg-[#151515] border border-emerald-500/20 rounded-lg px-3 py-2 text-sm text-gray-200 font-mono placeholder-emerald-500/30 focus:outline-none focus:border-emerald-500/40 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={isStreaming || !input.trim()}
            className="px-3 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-mono hover:bg-emerald-500/30 transition-colors disabled:opacity-30"
          >
            ↵
          </button>
        </div>
      </div>
    </div>
  );
}
