"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import type { WindowId, WindowState } from "@/lib/types";

const iconClass = "w-5 h-5 md:w-6 md:h-6 text-blue-400/80";

const CortexIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h4z" />
    <path d="M8 16a4 4 0 0 1-4 4v1a4 4 0 0 1 4 4h4a4 4 0 0 1 4-4v-1a4 4 0 0 1-4-4H8z" />
    <path d="M16 8h1a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-1" />
    <path d="M8 8H7a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h1" />
  </svg>
);
const ExperienceIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const ProjectsIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <line x1="12" y1="11" x2="12" y2="17" />
    <line x1="9" y1="14" x2="15" y2="14" />
  </svg>
);
const SkillsIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const AchievementsIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);
const CommsIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

interface DockItem {
  id: WindowId;
  label: string;
  icon: ReactNode;
}

const DOCK_ITEMS: DockItem[] = [
  { id: "cortex.ai", label: "cortex.ai", icon: <CortexIcon /> },
  { id: "experience.log", label: "experience.log", icon: <ExperienceIcon /> },
  { id: "projects.exe", label: "projects.exe", icon: <ProjectsIcon /> },
  { id: "skills.sys", label: "skills.sys", icon: <SkillsIcon /> },
  { id: "achievements.dat", label: "achievements.dat", icon: <AchievementsIcon /> },
  { id: "comms.link", label: "comms.link", icon: <CommsIcon /> },
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
      <div className="flex items-center gap-1 px-3 py-2 bg-[#111]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl shadow-black/20">
        {DOCK_ITEMS.map((item) => {
          const win = windows.find((w) => w.id === item.id);
          const isOpen = win?.isOpen && !win.isMinimized;

          return (
            <motion.button
              key={item.id}
              onClick={() => onToggleWindow(item.id)}
              className={`relative flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl transition-all ${
                isOpen
                  ? "bg-blue-500/15 border border-blue-500/30"
                  : "hover:bg-blue-500/10 border border-transparent"
              }`}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center justify-center">{item.icon}</span>
              <span className="text-[8px] md:text-[9px] font-heading text-gray-400 mt-0.5 truncate max-w-full px-1">
                {item.label}
              </span>
              {isOpen && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-blue-400" />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
