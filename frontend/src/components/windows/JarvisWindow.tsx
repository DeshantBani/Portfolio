"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PortfolioContent } from "@/lib/types";
import ChatInfoCard, { type BlockType } from "./ChatInfoCard";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  displayBlock?: BlockType;
}

interface Props {
  onAction?: (action: Record<string, string>) => void;
  content?: PortfolioContent | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const QUICK_QUESTIONS: { id: BlockType; label: string; prompt: string; icon: React.ReactNode }[] = [
  {
    id: "about",
    label: "Me",
    prompt: "Tell me about Deshant",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: "projects",
    label: "Projects",
    prompt: "What are his projects?",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    id: "skills",
    label: "Skills",
    prompt: "What's his tech stack?",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: "achievements",
    label: "Fun",
    prompt: "What are his achievements and certifications?",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "contact",
    label: "Contact",
    prompt: "How can I reach him?",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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

export default function JarvisWindow({ onAction, content }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasGreeted = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;
    streamResponse(
      "Hey — I'm Deshant's AI. I know everything about his work, projects, and skills. Ask me anything or use the quick questions below.",
      true
    );
  }, []);

  async function streamResponse(text: string, isGreeting = false) {
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
      await new Promise((r) => setTimeout(r, 15 + Math.random() * 10));
    }

    const actionMatch = full.match(/\{[^{}]*"action"[^{}]*\}\s*$/);
    if (actionMatch) {
      try {
        const action = JSON.parse(actionMatch[0]);
        onAction?.(action);
        const blockType = action.window && WINDOW_TO_BLOCK[action.window];
        const cleanContent = full.replace(actionMatch[0], "").trim();
        setMessages((prev) => {
          const updated = [...prev];
          const last = { ...updated[updated.length - 1], content: cleanContent };
          if (blockType) last.displayBlock = blockType;
          updated[updated.length - 1] = last;
          return updated;
        });
      } catch { /* ignore */ }
    }

    setIsStreaming(false);
  }

  function sendQuickQuestion(prompt: string, blockType: BlockType) {
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

    const openWindow: string | undefined = {
      about: undefined,
      projects: "projects.exe",
      skills: "skills.sys",
      experience: "experience.log",
      achievements: "achievements.dat",
      contact: "comms.link",
    }[blockType];
    if (openWindow) onAction?.({ action: "open_window", window: openWindow });

    const shortReplies: Record<BlockType, string> = {
      about: "Here's a quick overview of Deshant.",
      projects: "Here are some of his projects.",
      skills: "Here's his tech stack.",
      experience: "Here's his experience.",
      achievements: "Here are his achievements and certifications.",
      contact: "Here's how you can reach him.",
    };

    const newMsg: ChatMessage = {
      role: "assistant",
      content: shortReplies[blockType],
      displayBlock: blockType,
    };
    setMessages((prev) => [...prev, newMsg]);
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
        await streamResponse("I can't reach my backend right now. Try the quick questions or check back later.");
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
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.done) continue;
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

      const actionMatch = full.match(/\{[^{}]*"action"[^{}]*\}\s*$/);
      if (actionMatch) {
        try {
          const action = JSON.parse(actionMatch[0]);
          onAction?.(action);
          const blockType = action.window && WINDOW_TO_BLOCK[action.window];
          const cleanContent = full.replace(actionMatch[0], "").trim();
          setMessages((prev) => {
            const updated = [...prev];
            const last = { ...updated[updated.length - 1], content: cleanContent };
            if (blockType) last.displayBlock = blockType;
            updated[updated.length - 1] = last;
            return updated;
          });
        } catch { /* ignore */ }
      }

      setIsStreaming(false);
    } catch {
      await streamResponse("Something went wrong. Try the quick questions below.");
    }
  }

  const hasUserMessages = messages.some((m) => m.role === "user");
  const showWelcomeLayout = !hasUserMessages;

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Welcome layout: centered avatar, title, input + quick questions (Toukoum / Aaaaby style) */}
      {showWelcomeLayout ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 min-h-0">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-4"
          >
            <p className="text-gray-400 text-sm mb-1">Hey, I&apos;m Deshant&apos;s AI 👋</p>
            <h1 className="font-heading font-bold text-white text-2xl md:text-3xl tracking-tight">Cortex</h1>
            <p className="text-gray-500 text-xs mt-0.5">AI Agent</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[#3b82f6] font-heading font-bold text-2xl mb-6 shadow-lg"
          >
            C
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="w-full max-w-md"
          >
            <div className="flex items-center gap-1 rounded-2xl bg-white/10 border border-white/15 pl-3 pr-1 py-1.5 shadow-inner backdrop-blur-sm">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask me anything..."
                disabled={isStreaming}
                className="flex-1 min-w-0 bg-transparent py-2.5 px-2 text-sm text-white placeholder-gray-400 focus:outline-none"
              />
              <motion.button
                type="button"
                onClick={sendMessage}
                disabled={isStreaming || !input.trim()}
                whileTap={{ scale: 0.92 }}
                className="w-10 h-10 rounded-full bg-[#3b82f6] text-white flex items-center justify-center hover:bg-[#2563eb] transition-colors disabled:opacity-40 shrink-0 shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </motion.button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {QUICK_QUESTIONS.map((q) => (
                <motion.button
                  key={q.id}
                  type="button"
                  onClick={() => sendQuickQuestion(q.prompt, q.id)}
                  disabled={isStreaming}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-gray-200 hover:bg-white/15 hover:border-white/25 text-xs transition-colors disabled:opacity-50"
                >
                  <span className="text-gray-400">{q.icon}</span>
                  <span>{q.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <>
          {/* Header: avatar + title */}
          <header className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-full bg-[#3b82f6]/20 border border-[#3b82f6]/40 flex items-center justify-center text-[#3b82f6] font-semibold text-sm font-heading">
              C
            </div>
            <div>
              <h2 className="font-heading font-semibold text-white text-sm">Cortex</h2>
              <p className="text-[10px] text-gray-500">AI Agent</p>
            </div>
          </header>

          {/* Messages — rounded bubbles */}
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 custom-scrollbar">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`mb-4 ${msg.role === "user" ? "flex justify-end" : ""}`}
            >
              <div className={msg.role === "user" ? "max-w-[85%]" : "max-w-[95%]"}>
                <div
                  className={`inline-block px-4 py-2.5 rounded-2xl text-sm shadow-lg ${
                    msg.role === "user"
                      ? "bg-[#3b82f6] text-white rounded-br-md"
                      : "bg-white/8 text-gray-100 border border-white/10 rounded-bl-md"
                  }`}
                >
                  {msg.content}
                  {i === messages.length - 1 && isStreaming && msg.role === "assistant" && (
                    <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#3b82f6] animate-pulse align-middle rounded" />
                  )}
                </div>
                {msg.role === "assistant" && msg.displayBlock && content && (
                  <ChatInfoCard type={msg.displayBlock} content={content} />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
          </div>

          {/* Voice listening indicator (waveform / orb) */}
      {isVoiceActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center gap-1 py-2"
        >
          {[0, 1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-[#3b82f6] min-h-[8px]"
              animate={{ height: [8, 8 + h * 4, 8] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.05 }}
            />
          ))}
        </motion.div>
      )}

      {/* Quick questions */}
      <div className="px-4 pb-2 shrink-0">
        <button
          type="button"
          onClick={() => setShowQuickQuestions(!showQuickQuestions)}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-400 text-xs mb-2 transition-colors"
        >
          {showQuickQuestions ? "Hide quick questions" : "Show quick questions"}
          <svg
            className={`w-3.5 h-3.5 transition-transform ${showQuickQuestions ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        {showQuickQuestions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2 mb-3"
          >
            {QUICK_QUESTIONS.map((q) => (
              <motion.button
                key={q.id}
                type="button"
                onClick={() => sendQuickQuestion(q.prompt, q.id)}
                disabled={isStreaming}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 text-xs transition-colors disabled:opacity-50"
              >
                <span className="text-gray-400">{q.icon}</span>
                <span>{q.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Input bar — emoji/attach left, input center, mic + send right */}
        <div className="flex items-center gap-1 rounded-2xl bg-[#1a1a1e] border border-white/10 pl-2 pr-1 py-1 shadow-inner">
          <button
            type="button"
            className="p-2 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
            title="Emoji"
            aria-label="Emoji"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            type="button"
            className="p-2 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
            title="Attach"
            aria-label="Attach"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask me anything"
            disabled={isStreaming}
            className="flex-1 min-w-0 bg-transparent py-2.5 px-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none"
          />
          <motion.button
            type="button"
            onClick={() => setIsVoiceActive(!isVoiceActive)}
            whileTap={{ scale: 0.92 }}
            className={`p-2 rounded-xl transition-colors ${
              isVoiceActive ? "text-[#3b82f6] bg-[#3b82f6]/20" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            }`}
            title="Voice chat"
            aria-label="Voice chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </motion.button>
          <motion.button
            type="button"
            onClick={sendMessage}
            disabled={isStreaming || !input.trim()}
            whileTap={{ scale: 0.92 }}
            className="w-9 h-9 rounded-full bg-[#3b82f6] text-white flex items-center justify-center hover:bg-[#2563eb] transition-colors disabled:opacity-40 disabled:hover:bg-[#3b82f6] shrink-0 shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        </div>
        <p className="text-center text-[10px] text-gray-500 mt-2">Ask anything about Deshant's work and experience</p>
          </div>
        </>
      )}
    </div>
  );
}
