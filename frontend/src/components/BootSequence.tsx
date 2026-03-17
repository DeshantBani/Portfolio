"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "> initializing agent_os...",
  "> loading interface...",
  "> indexing experience... [infogain, carpm, jio, c&s electric]",
  "> mounting capabilities... [langgraph, rag, multi-agent, fastapi]",
  "> connecting voice module... elevenlabs ready",
  "> system ready. launching cortex.",
];

interface Props {
  onComplete: () => void;
  onLineComplete?: (lineIndex: number) => void;
}

export default function BootSequence({ onComplete, onLineComplete }: Props) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isDone, setIsDone] = useState(false);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((v) => !v), 500);
    return () => clearInterval(interval);
  }, []);

  // Token streaming effect
  useEffect(() => {
    if (currentLine >= BOOT_LINES.length) {
      setTimeout(() => setIsDone(true), 400);
      setTimeout(onComplete, 1200);
      return;
    }

    const line = BOOT_LINES[currentLine];
    if (currentChar >= line.length) {
      onLineComplete?.(currentLine);
      setTimeout(() => {
        setLines((prev) => [...prev, line]);
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 200 + Math.random() * 200);
      return;
    }

    const speed = line[currentChar] === "." ? 60 : 15 + Math.random() * 15;
    const timer = setTimeout(() => setCurrentChar((c) => c + 1), speed);
    return () => clearTimeout(timer);
  }, [currentLine, currentChar, onComplete, onLineComplete]);

  const activeText =
    currentLine < BOOT_LINES.length
      ? BOOT_LINES[currentLine].slice(0, currentChar)
      : "";

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full max-w-2xl px-6 font-mono text-sm md:text-base">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-blue-400/80 mb-1"
              >
                {line}
              </motion.div>
            ))}
            {currentLine < BOOT_LINES.length && (
              <div className="text-blue-400 mb-1">
                {activeText}
                <span
                  className={`inline-block w-2 h-4 ml-0.5 bg-blue-400 align-middle ${
                    showCursor ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
