"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import type { WindowId, WindowState, PortfolioContent } from "@/lib/types";
import InteractableBackground from "./InteractableBackground";
import BootSequence from "./BootSequence";
import FloatingWindow from "./FloatingWindow";
import Dock from "./Dock";
import JarvisWindow from "./windows/JarvisWindow";
import ExperienceWindow from "./windows/ExperienceWindow";
import ProjectsWindow from "./windows/ProjectsWindow";
import SkillsWindow from "./windows/SkillsWindow";
import AchievementsWindow from "./windows/AchievementsWindow";
import CommsWindow from "./windows/CommsWindow";

interface Props {
  content: PortfolioContent;
}

const INITIAL_WINDOWS: WindowState[] = [
  {
    id: "cortex.ai",
    title: "cortex.ai",
    isOpen: true,
    isMinimized: false,
    zIndex: 10,
    position: { x: 0, y: 0 },
    size: { width: 420, height: 520 },
  },
  {
    id: "experience.log",
    title: "experience.log",
    isOpen: false,
    isMinimized: false,
    zIndex: 5,
    position: { x: 0, y: 0 },
    size: { width: 520, height: 500 },
  },
  {
    id: "projects.exe",
    title: "projects.exe",
    isOpen: false,
    isMinimized: false,
    zIndex: 5,
    position: { x: 0, y: 0 },
    size: { width: 480, height: 460 },
  },
  {
    id: "skills.sys",
    title: "skills.sys",
    isOpen: false,
    isMinimized: false,
    zIndex: 5,
    position: { x: 0, y: 0 },
    size: { width: 440, height: 480 },
  },
  {
    id: "achievements.dat",
    title: "achievements.dat",
    isOpen: false,
    isMinimized: false,
    zIndex: 5,
    position: { x: 0, y: 0 },
    size: { width: 400, height: 400 },
  },
  {
    id: "comms.link",
    title: "comms.link",
    isOpen: false,
    isMinimized: false,
    zIndex: 5,
    position: { x: 0, y: 0 },
    size: { width: 380, height: 440 },
  },
];

function getWindowPosition(id: WindowId, index: number, isMobile: boolean): { x: number; y: number } {
  if (isMobile) return { x: 0, y: 0 };
  const w = typeof window !== "undefined" ? window.innerWidth : 1200;
  const h = typeof window !== "undefined" ? window.innerHeight : 800;

  if (id === "cortex.ai") {
    return { x: Math.max(20, w / 2 - 210), y: Math.max(20, h / 2 - 300) };
  }
  // Cascade other windows
  const offset = index * 30;
  return {
    x: Math.min(w - 500, 60 + offset),
    y: Math.min(h - 500, 40 + offset),
  };
}

export default function Desktop({ content }: Props) {
  const [booted, setBooted] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [bgOpacity, setBgOpacity] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [maxZ, setMaxZ] = useState(10);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Initialize window positions after mount
  useEffect(() => {
    setWindows(
      INITIAL_WINDOWS.map((w, i) => ({
        ...w,
        position: getWindowPosition(w.id, i, isMobile),
        size: isMobile
          ? { width: window.innerWidth, height: window.innerHeight - 80 }
          : w.size,
      }))
    );
  }, [isMobile]);

  const handleBootLineComplete = useCallback((lineIndex: number) => {
    setBgOpacity((lineIndex + 1) / 6);
  }, []);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
    setBgOpacity(1);
  }, []);

  const toggleWindow = useCallback((id: WindowId) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (!w.isOpen) {
          const newZ = maxZ + 1;
          setMaxZ(newZ);
          return {
            ...w,
            isOpen: true,
            isMinimized: false,
            zIndex: newZ,
            position: isMobile
              ? { x: 0, y: 0 }
              : w.position,
            size: isMobile
              ? { width: window.innerWidth, height: window.innerHeight - 80 }
              : w.size,
          };
        }
        if (w.isMinimized) {
          const newZ = maxZ + 1;
          setMaxZ(newZ);
          return { ...w, isMinimized: false, zIndex: newZ };
        }
        return { ...w, isMinimized: true };
      })
    );
  }, [maxZ, isMobile]);

  const closeWindow = useCallback((id: WindowId) => {
    if (id === "cortex.ai") {
      // Cortex can only be minimized, not closed
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
      );
      return;
    }
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w))
    );
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    const newZ = maxZ + 1;
    setMaxZ(newZ);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: newZ } : w))
    );
  }, [maxZ]);

  const handleCortexAction = useCallback(
    (action: Record<string, string>) => {
      if (action.action === "open_window" && action.window) {
        const windowId = action.window as WindowId;
        setWindows((prev) =>
          prev.map((w) => {
            if (w.id !== windowId) return w;
            const newZ = maxZ + 1;
            setMaxZ(newZ);
            return {
              ...w,
              isOpen: true,
              isMinimized: false,
              zIndex: newZ,
              position: isMobile
                ? { x: 0, y: 0 }
                : w.position,
            };
          })
        );
      }
    },
    [maxZ, isMobile]
  );

  const getWindowState = (id: WindowId) => windows.find((w) => w.id === id)!;

  // Mobile: render as stacked panels
  if (isMobile && booted) {
    const openWindow = windows.find((w) => w.isOpen && !w.isMinimized && w.id !== "cortex.ai");

    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col">
        <InteractableBackground opacity={0.3} />

        {/* Main content area */}
        <div className="flex-1 relative z-10 overflow-hidden">
          {openWindow ? (
            <div className="absolute inset-0 bg-[#0d0d0d]/95 backdrop-blur-xl overflow-y-auto p-4 pb-20 custom-scrollbar">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-emerald-400/70">
                  {openWindow.title}
                </span>
                <button
                  onClick={() => closeWindow(openWindow.id)}
                  className="text-xs font-mono text-gray-500 hover:text-gray-300 px-2 py-1"
                >
                  ✕ close
                </button>
              </div>
              {renderWindowContent(openWindow.id)}
            </div>
          ) : (
            <div className="absolute inset-0 bg-[#0d0d0d]/90 backdrop-blur-xl overflow-hidden pb-20">
              <JarvisWindow onAction={handleCortexAction} content={content} />
            </div>
          )}
        </div>

        {/* Mobile dock */}
        <Dock windows={windows} onToggleWindow={toggleWindow} />
      </div>
    );
  }

  function renderWindowContent(id: WindowId) {
    switch (id) {
      case "cortex.ai":
        return <JarvisWindow onAction={handleCortexAction} content={content} />;
      case "experience.log":
        return <ExperienceWindow data={content.experience} />;
      case "projects.exe":
        return <ProjectsWindow data={content.projects} />;
      case "skills.sys":
        return <SkillsWindow data={content.technologies} />;
      case "achievements.dat":
        return <AchievementsWindow data={content.achievements} />;
      case "comms.link":
        return <CommsWindow data={content.contact} />;
      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] overflow-hidden">
      <InteractableBackground opacity={booted ? 1 : bgOpacity} />

      {/* Boot sequence */}
      {!booted && (
        <BootSequence
          onComplete={handleBootComplete}
          onLineComplete={handleBootLineComplete}
        />
      )}

      {/* Desktop with windows */}
      {booted && (
        <>
          <AnimatePresence>
            {windows.map(
              (w) =>
                w.isOpen &&
                !w.isMinimized && (
                  <FloatingWindow
                    key={w.id}
                    windowState={w}
                    onClose={() => closeWindow(w.id)}
                    onMinimize={() => minimizeWindow(w.id)}
                    onFocus={() => focusWindow(w.id)}
                  >
                    {renderWindowContent(w.id)}
                  </FloatingWindow>
                )
            )}
          </AnimatePresence>

          {/* Dock */}
          <Dock windows={windows} onToggleWindow={toggleWindow} />
        </>
      )}
    </div>
  );
}
