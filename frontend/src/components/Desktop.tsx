"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import type { WindowId, WindowState, PortfolioContent } from "@/lib/types";
import InteractableBackground from "./InteractableBackground";
import BootSequence from "./BootSequence";
import FloatingWindow from "./FloatingWindow";
import Dock from "./Dock";
import MacMenuBar from "./MacMenuBar";
import JarvisWindow from "./windows/JarvisWindow";
import AboutWindow from "./windows/AboutWindow";
import ExperienceWindow from "./windows/ExperienceWindow";
import ProjectsWindow from "./windows/ProjectsWindow";
import SkillsWindow from "./windows/SkillsWindow";
import AchievementsWindow from "./windows/AchievementsWindow";
import CommsWindow from "./windows/CommsWindow";

interface Props {
  content: PortfolioContent;
}

const MENUBAR_H = 28;
const DOCK_H = 72;

const BASE_WINDOWS = [
  { id: "about.me" as WindowId,        title: "about.me",        isOpen: true,  size: { width: 640, height: 490 } },
  { id: "cortex.ai" as WindowId,       title: "cortex.ai",       isOpen: true,  size: { width: 420, height: 560 } },
  { id: "experience.log" as WindowId,  title: "experience.log",  isOpen: false, size: { width: 560, height: 500 } },
  { id: "projects.exe" as WindowId,    title: "projects.exe",    isOpen: false, size: { width: 520, height: 480 } },
  { id: "skills.sys" as WindowId,      title: "skills.sys",      isOpen: false, size: { width: 480, height: 460 } },
  { id: "achievements.dat" as WindowId,title: "achievements.dat",isOpen: false, size: { width: 440, height: 420 } },
  { id: "comms.link" as WindowId,      title: "comms.link",      isOpen: false, size: { width: 400, height: 460 } },
];

function computePositions(vw: number, vh: number): Record<WindowId, { x: number; y: number }> {
  const topY = MENUBAR_H + 12;
  // About on left, Cortex on right of About
  const aboutX = Math.max(16, Math.round((vw - 640 - 420 - 20) / 2));
  const cortexX = aboutX + 640 + 20;

  // Cascade position for secondary windows
  const cascade = (i: number) => ({
    x: Math.min(vw - 520, 80 + i * 30),
    y: Math.min(vh - 500, topY + i * 30),
  });

  return {
    "about.me":        { x: aboutX, y: topY },
    "cortex.ai":       { x: cortexX, y: topY },
    "experience.log":  cascade(0),
    "projects.exe":    cascade(1),
    "skills.sys":      cascade(2),
    "achievements.dat":cascade(3),
    "comms.link":      cascade(4),
  };
}

export default function Desktop({ content }: Props) {
  const [booted, setBooted] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [maxZ, setMaxZ] = useState(10);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Set initial window positions once mounted
  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const positions = computePositions(vw, vh);

    setWindows(
      BASE_WINDOWS.map((bw, i) => ({
        ...bw,
        isMinimized: false,
        zIndex: bw.isOpen ? 10 - i : 5,
        position: isMobile ? { x: 0, y: 0 } : positions[bw.id],
        size: isMobile
          ? { width: vw, height: vh - MENUBAR_H - DOCK_H }
          : bw.size,
      }))
    );
  }, [isMobile]);

  const handleBootComplete = useCallback(() => setBooted(true), []);

  const bringToFront = useCallback((id: WindowId) => {
    setMaxZ((z) => {
      const newZ = z + 1;
      setWindows((prev) => prev.map((w) => w.id === id ? { ...w, zIndex: newZ } : w));
      return newZ;
    });
  }, []);

  const toggleWindow = useCallback((id: WindowId) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (!w.isOpen) {
          const newZ = maxZ + 1;
          setMaxZ(newZ);
          return { ...w, isOpen: true, isMinimized: false, zIndex: newZ };
        }
        if (w.isMinimized) {
          const newZ = maxZ + 1;
          setMaxZ(newZ);
          return { ...w, isMinimized: false, zIndex: newZ };
        }
        return { ...w, isMinimized: true };
      })
    );
  }, [maxZ]);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((prev) =>
      prev.map((w) => w.id === id ? { ...w, isOpen: false } : w)
    );
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) =>
      prev.map((w) => w.id === id ? { ...w, isMinimized: true } : w)
    );
  }, []);

  const handleCortexAction = useCallback((action: Record<string, string>) => {
    if (action.action === "open_window" && action.window) {
      const id = action.window as WindowId;
      setMaxZ((z) => {
        const newZ = z + 1;
        setWindows((prev) =>
          prev.map((w) => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: newZ } : w)
        );
        return newZ;
      });
    }
  }, []);

  function renderContent(id: WindowId) {
    switch (id) {
      case "about.me":        return <AboutWindow content={content} />;
      case "cortex.ai":       return <JarvisWindow onAction={handleCortexAction} content={content} />;
      case "experience.log":  return <ExperienceWindow data={content.experience} />;
      case "projects.exe":    return <ProjectsWindow data={content.projects} />;
      case "skills.sys":      return <SkillsWindow data={content.technologies} />;
      case "achievements.dat":return <AchievementsWindow data={content.achievements} />;
      case "comms.link":      return <CommsWindow data={content.contact} />;
      default:                return null;
    }
  }

  /* ---- Mobile layout ---- */
  if (isMobile && booted) {
    const activeWin = windows.find((w) => w.isOpen && !w.isMinimized);
    return (
      <div className="fixed inset-0 bg-[#080a0f] flex flex-col">
        <InteractableBackground opacity={1} />
        <MacMenuBar title={activeWin?.title ?? "Portfolio"} />

        <div className="absolute inset-0 pt-7 pb-20 overflow-y-auto custom-scrollbar">
          {activeWin ? (
            <div className="p-4">
              <button
                onClick={() => closeWindow(activeWin.id)}
                className="mb-3 text-xs text-white/40 hover:text-white/70"
              >
                ← back
              </button>
              {renderContent(activeWin.id)}
            </div>
          ) : (
            <div className="p-4">
              <AboutWindow content={content} />
            </div>
          )}
        </div>

        <Dock windows={windows} onToggleWindow={toggleWindow} />
      </div>
    );
  }

  /* ---- Desktop layout ---- */
  return (
    <div className="fixed inset-0 bg-[#070810] overflow-hidden">
      <InteractableBackground opacity={booted ? 1 : 0} />

      {/* Boot */}
      {!booted && <BootSequence onComplete={handleBootComplete} />}

      {booted && (
        <>
          <MacMenuBar />

          <AnimatePresence>
            {windows
              .filter((w) => w.isOpen && !w.isMinimized)
              .map((w) => (
                <FloatingWindow
                  key={w.id}
                  windowState={w}
                  onClose={() => closeWindow(w.id)}
                  onMinimize={() => minimizeWindow(w.id)}
                  onFocus={() => bringToFront(w.id)}
                >
                  {renderContent(w.id)}
                </FloatingWindow>
              ))}
          </AnimatePresence>

          <Dock windows={windows} onToggleWindow={toggleWindow} />
        </>
      )}
    </div>
  );
}
