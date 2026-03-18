"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PortfolioContent } from "@/lib/types";
import ChatInfoCard, { type BlockType } from "./windows/ChatInfoCard";
import AvatarCharacter from "./AvatarCharacter";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  displayBlock?: BlockType;
}

interface Props {
  content: PortfolioContent;
  onOpenWindow?: (action: Record<string, string>) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const QUICK_QUESTIONS: { id: BlockType; label: string; prompt: string; icon: React.ReactNode }[] = [
  {
    id: "about",
    label: "Me",
    prompt: "Tell me about Deshant",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: "projects",
    label: "Projects",
    prompt: "What are his projects?",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    id: "skills",
    label: "Skills",
    prompt: "What's his tech stack?",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: "achievements",
    label: "Fun",
    prompt: "What are his achievements and certifications?",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "contact",
    label: "Contact",
    prompt: "How can I reach him?",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const WINDOW_TO_BLOCK: Record<string, BlockType> = {
  "experience.log": "experience",
  "projects.exe": "projects",
  "skills.sys": "skills",
  "achievements.dat": "achievements",
  "comms.link": "contact",
};

export default function IntegratedCortex({ content, onOpenWindow }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasGreeted = useRef(false);

  const hasMessages = messages.some((m) => m.role === "user");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;
    streamLocal("Hey — I'm Deshant's AI. Ask me anything about his work, projects, and skills.");
  }, []);

  async function streamLocal(text: string) {
    setIsStreaming(true);
    const newMsg: ChatMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, newMsg]);
    let full = "";
    for (let i = 0; i < text.length; i++) {
      full += text[i];
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], content: full };
        return updated;
      });
      await new Promise((r) => setTimeout(r, 14 + Math.random() * 10));
    }
    setIsStreaming(false);
  }

  function handleAction(full: string) {
    const actionMatch = full.match(/\{[^{}]*"action"[^{}]*\}\s*$/);
    if (!actionMatch) return full;
    try {
      const action = JSON.parse(actionMatch[0]);
      onOpenWindow?.(action);
      const blockType = action.window && WINDOW_TO_BLOCK[action.window];
      const clean = full.replace(actionMatch[0], "").trim();
      setMessages((prev) => {
        const updated = [...prev];
        const last = { ...updated[updated.length - 1], content: clean };
        if (blockType) last.displayBlock = blockType;
        updated[updated.length - 1] = last;
        return updated;
      });
    } catch { /* ignore */ }
    return "";
  }

  function sendQuick(prompt: string, blockType: BlockType) {
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    const windowMap: Record<BlockType, string | undefined> = {
      about: undefined, projects: "projects.exe", skills: "skills.sys",
      experience: "experience.log", achievements: "achievements.dat", contact: "comms.link",
    };
    const openWindow = windowMap[blockType];
    if (openWindow) onOpenWindow?.({ action: "open_window", window: openWindow });
    const replies: Record<BlockType, string> = {
      about: "Here's a quick overview of Deshant.",
      projects: "Here are some of his projects.",
      skills: "Here's his tech stack.",
      experience: "Here's his work experience.",
      achievements: "Here are his achievements and certifications.",
      contact: "Here's how you can reach him.",
    };
    setMessages((prev) => [...prev, { role: "assistant", content: replies[blockType], displayBlock: blockType }]);
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
          history: messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok || !res.body) {
        await streamLocal("I can't reach my backend right now. Try the quick questions below.");
        return;
      }
      setIsStreaming(true);
      const newMsg: ChatMessage = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, newMsg]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value, { stream: true }).split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.token) {
              full += data.token;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { ...updated[updated.length - 1], content: full };
                return updated;
              });
            }
          } catch { /* skip */ }
        }
      }
      handleAction(full);
      setIsStreaming(false);
    } catch {
      await streamLocal("Something went wrong. Try the quick questions below.");
    }
  }

  return (
    <div className="relative h-full flex flex-col overflow-hidden">
      {/* Ghost watermark — bottom of page, like reference */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-center overflow-hidden z-0"
        style={{ marginBottom: "-2rem" }}
      >
        <span
          className="font-heading font-black text-transparent select-none"
          style={{
            fontSize: "clamp(5rem, 18vw, 16rem)",
            lineHeight: 1,
            WebkitTextStroke: "1px rgba(255,255,255,0.04)",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          {content?.about?.name?.split(" ")[0] ?? "CORTEX"}
        </span>
      </div>

      {/* ---- HERO VIEW: no messages ---- */}
      <AnimatePresence mode="wait">
        {!hasMessages ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-4 pt-2 gap-2"
          >
            {/* Greeting */}
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-[13px] text-white/40 tracking-widest font-light"
            >
              Hey, I&apos;m Deshant&apos;s AI 👋
            </motion.p>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-heading font-black text-white tracking-tight leading-none text-center"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
            >
              AI / ML Engineer
            </motion.h1>

            {/* Avatar — large, no frame, like reference */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 180, damping: 20 }}
              className="my-2"
            >
              <AvatarCharacter isSpeaking={isStreaming} size={200} />
            </motion.div>

            {/* Input bar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-lg"
            >
              <div className="flex items-center gap-2 rounded-full bg-white/8 border border-white/15 pl-6 pr-2 py-2 backdrop-blur-md focus-within:border-blue-400/50 focus-within:bg-white/12 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask me anything…"
                  disabled={isStreaming}
                  className="flex-1 min-w-0 bg-transparent text-sm text-white/85 placeholder-white/25 outline-none py-1.5"
                />
                <motion.button
                  type="button"
                  onClick={sendMessage}
                  disabled={isStreaming || !input.trim()}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg, #0060ff, #2930cc)" }}
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>

            {/* Quick action cards — reference style grid */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex gap-2 flex-wrap justify-center w-full max-w-lg"
            >
              {QUICK_QUESTIONS.map((q) => (
                <motion.button
                  key={q.id}
                  type="button"
                  onClick={() => sendQuick(q.prompt, q.id)}
                  disabled={isStreaming}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-center gap-1.5 px-5 py-3 rounded-2xl bg-white/8 border border-white/12 text-white/60 hover:bg-white/14 hover:border-blue-400/30 hover:text-white/90 transition-all text-xs font-medium disabled:opacity-50"
                >
                  <span className="text-blue-300/80">{q.icon}</span>
                  {q.label}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          /* ---- CHAT VIEW: after first message ---- */
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 flex-1 flex flex-col min-h-0"
          >
            {/* Compact header */}
            <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-white/8">
              <div className="shrink-0">
                <AvatarCharacter isSpeaking={isStreaming} size={44} />
              </div>
              <div>
                <p className="font-heading font-semibold text-white text-sm leading-tight">Cortex</p>
                <p className="text-[10px] text-blue-300/60 tracking-wider uppercase">
                  {isStreaming ? "typing…" : "AI Agent"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-4 pt-4 pb-2 flex flex-col gap-3">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-2"
                  >
                    <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm shadow-lg ${
                          msg.role === "user"
                            ? "bg-blue-500 text-white rounded-br-md"
                            : "bg-white/10 text-gray-100 border border-white/10 rounded-bl-md"
                        }`}
                      >
                        {msg.content}
                        {i === messages.length - 1 && isStreaming && msg.role === "assistant" && (
                          <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-blue-400 animate-pulse rounded align-middle" />
                        )}
                      </div>
                    </div>
                    {msg.role === "assistant" && msg.displayBlock && content && (
                      <div className="flex justify-start">
                        <ChatInfoCard type={msg.displayBlock} content={content} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Chat input */}
            <div className="shrink-0 px-4 py-3 border-t border-white/8 flex flex-col gap-2">
              <div className="flex items-center gap-2 rounded-full bg-white/8 border border-white/15 pl-5 pr-2 py-1.5 focus-within:border-blue-400/50 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask me anything…"
                  disabled={isStreaming}
                  className="flex-1 min-w-0 bg-transparent text-sm text-white/85 placeholder-white/25 outline-none py-1.5"
                />
                <motion.button
                  type="button"
                  onClick={sendMessage}
                  disabled={isStreaming || !input.trim()}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 transition-all"
                  style={{ background: "linear-gradient(135deg, #0060ff, #2930cc)" }}
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                  </svg>
                </motion.button>
              </div>

              {/* Compact quick pills in chat mode */}
              <div className="flex gap-1.5 flex-wrap">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => sendQuick(q.prompt, q.id)}
                    disabled={isStreaming}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/6 border border-white/10 text-white/50 hover:bg-white/12 hover:text-white/80 text-xs transition-colors disabled:opacity-40"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
