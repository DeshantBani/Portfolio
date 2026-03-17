"use client";

import { motion } from "framer-motion";
import type { WindowId, WindowState } from "@/lib/types";

interface DockItem {
  id: WindowId;
  label: string;
  icon: string;
}

const DOCK_ITEMS: DockItem[] = [
  { id: "jarvis.ai", label: "jarvis.ai", icon: "🤖" },
  { id: "experience.log", label: "experience.log", icon: "📋" },
  { id: "projects.exe", label: "projects.exe", icon: "🚀" },
  { id: "skills.sys", label: "skills.sys", icon: "⚡" },
  { id: "achievements.dat", label: "achievements.dat", icon: "🏆" },
  { id: "comms.link", label: "comms.link", icon: "📡" },
];

interface Props {
  windows: WindowState[];
  onToggleWindow: (id: WindowId) => void;
}

export default function Dock({ windows, onToggleWindow }: Props) {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-3 px-4"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="flex items-center gap-1 px-3 py-2 bg-[#111]/80 backdrop-blur-xl rounded-2xl border border-emerald-500/15 shadow-lg shadow-emerald-500/5">
        {DOCK_ITEMS.map((item) => {
          const win = windows.find((w) => w.id === item.id);
          const isOpen = win?.isOpen && !win.isMinimized;

          return (
            <motion.button
              key={item.id}
              onClick={() => onToggleWindow(item.id)}
              className={`relative flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl transition-all ${
                isOpen
                  ? "bg-emerald-500/15 border border-emerald-500/30"
                  : "hover:bg-emerald-500/10 border border-transparent"
              }`}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg md:text-xl">{item.icon}</span>
              <span className="text-[8px] md:text-[9px] font-mono text-emerald-400/60 mt-0.5 truncate max-w-full px-1">
                {item.label}
              </span>
              {isOpen && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-emerald-400" />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
