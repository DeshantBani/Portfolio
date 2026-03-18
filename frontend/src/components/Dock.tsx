"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import type { WindowId, WindowState } from "@/lib/types";

/* ---- Icons ---- */
const I = "w-full h-full";

function CortexIcon() {
  return (
    <svg className={I} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="url(#cg)" />
      <defs>
        <radialGradient id="cg" cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="13" r="5" stroke="white" strokeWidth="1.5" fill="none" />
      <path d="M11 22c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="16" cy="13" r="2" fill="white" opacity="0.6" />
    </svg>
  );
}
function AboutIcon() {
  return (
    <svg className={I} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="url(#ag)" />
      <defs>
        <radialGradient id="ag" cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="12" r="4.5" stroke="white" strokeWidth="1.5" fill="none" />
      <path d="M8 26c0-4.42 3.58-8 8-8s8 3.58 8 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
function ExpIcon() {
  return (
    <svg className={I} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="url(#eg)" />
      <defs>
        <linearGradient id="eg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect x="7" y="13" width="18" height="13" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
      <path d="M12 13V11a2 2 0 012-2h4a2 2 0 012 2v2" stroke="white" strokeWidth="1.5" fill="none" />
      <line x1="16" y1="17" x2="16" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="13.5" y1="19.5" x2="18.5" y2="19.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function ProjectsIcon() {
  return (
    <svg className={I} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="url(#pg)" />
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <path d="M7 12a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H9a2 2 0 01-2-2V12z" stroke="white" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
function SkillsIcon() {
  return (
    <svg className={I} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="url(#sg)" />
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <polygon points="16,7 18.5,13.5 25.5,13.5 20,17.5 22,24 16,20 10,24 12,17.5 6.5,13.5 13.5,13.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </svg>
  );
}
function ContactIcon() {
  return (
    <svg className={I} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="url(#mg)" />
      <defs>
        <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      </defs>
      <rect x="7" y="10" width="18" height="13" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
      <polyline points="7,11 16,18 25,11" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function AchievementsIcon() {
  return (
    <svg className={I} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="url(#achg)" />
      <defs>
        <linearGradient id="achg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="13" r="6" stroke="white" strokeWidth="1.5" fill="none" />
      <polyline points="12,18 10,26 16,23 22,26 20,18" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

interface DockItem {
  id: WindowId;
  label: string;
  icon: ReactNode;
}

const DOCK_ITEMS: DockItem[] = [
  { id: "cortex.ai", label: "Cortex AI", icon: <CortexIcon /> },
  { id: "about.me", label: "About", icon: <AboutIcon /> },
  { id: "experience.log", label: "Experience", icon: <ExpIcon /> },
  { id: "projects.exe", label: "Projects", icon: <ProjectsIcon /> },
  { id: "skills.sys", label: "Skills", icon: <SkillsIcon /> },
  { id: "achievements.dat", label: "Achievements", icon: <AchievementsIcon /> },
  { id: "comms.link", label: "Contact", icon: <ContactIcon /> },
];

const BASE = 48;
const MAGNIFIED = 64;

interface Props {
  windows: WindowState[];
  onToggleWindow: (id: WindowId) => void;
}

export default function Dock({ windows, onToggleWindow }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const getScale = (idx: number) => {
    if (hoveredIdx === null) return 1;
    const dist = Math.abs(idx - hoveredIdx);
    if (dist === 0) return MAGNIFIED / BASE;
    if (dist === 1) return (BASE + (MAGNIFIED - BASE) * 0.5) / BASE;
    return 1;
  };

  const getTooltipY = (idx: number) => {
    if (hoveredIdx === null) return "0px";
    const dist = Math.abs(idx - hoveredIdx);
    if (dist === 0) return "-8px";
    if (dist === 1) return "-4px";
    return "0px";
  };

  return (
    <motion.div
      className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 flex items-end gap-1.5 px-3 pb-1.5 pt-1"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 22 }}
      style={{
        background: "rgba(30, 30, 30, 0.65)",
        backdropFilter: "blur(28px) saturate(200%)",
        WebkitBackdropFilter: "blur(28px) saturate(200%)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "18px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {DOCK_ITEMS.map((item, idx) => {
        const win = windows.find((w) => w.id === item.id);
        const isOpen = win?.isOpen && !win.isMinimized;
        const scale = getScale(idx);
        const yOff = getTooltipY(idx);

        return (
          <div
            key={item.id}
            className="relative flex flex-col items-center"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{ transform: `translateY(${yOff})`, transition: "transform 0.15s ease" }}
          >
            {/* Tooltip */}
            {hoveredIdx === idx && (
              <div
                className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] text-white whitespace-nowrap pointer-events-none"
                style={{
                  background: "rgba(30,30,30,0.85)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                {item.label}
              </div>
            )}

            {/* Icon */}
            <button
              onClick={() => onToggleWindow(item.id)}
              className="relative"
              style={{
                width: BASE * scale,
                height: BASE * scale,
                transition: "width 0.15s ease, height 0.15s ease",
              }}
            >
              {item.icon}

              {/* Open indicator dot */}
              {isOpen && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/60" />
              )}
            </button>
          </div>
        );
      })}
    </motion.div>
  );
}
