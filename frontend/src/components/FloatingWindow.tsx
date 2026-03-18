"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import type { WindowState } from "@/lib/types";

interface Props {
  windowState: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  children: ReactNode;
  className?: string;
}

export default function FloatingWindow({
  windowState,
  onClose,
  onMinimize,
  onFocus,
  children,
  className = "",
}: Props) {
  const constraintsRef = useRef<HTMLDivElement>(null);

  if (!windowState.isOpen || windowState.isMinimized) return null;

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 z-0 pointer-events-none" />

      <motion.div
        className={`fixed flex flex-col overflow-hidden ${className}`}
        style={{
          zIndex: windowState.zIndex,
          width: windowState.size.width,
          height: windowState.size.height,
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(22, 22, 24, 0.88)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.06) inset",
        }}
        initial={{ opacity: 0, scale: 0.93, x: windowState.position.x, y: windowState.position.y }}
        animate={{ opacity: 1, scale: 1,  x: windowState.position.x, y: windowState.position.y }}
        exit={{ opacity: 0, scale: 0.93 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        dragElastic={0}
        onPointerDown={onFocus}
      >
        {/* macOS-style title bar */}
        <div
          className="flex items-center px-3 shrink-0 cursor-grab active:cursor-grabbing select-none"
          style={{
            height: 38,
            background: "rgba(38, 38, 42, 0.9)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Traffic lights */}
          <div className="flex gap-2 mr-3">
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="w-3 h-3 rounded-full flex items-center justify-center group transition-colors"
              style={{ background: "#ff5f57" }}
            >
              <span className="text-[7px] text-black/60 opacity-0 group-hover:opacity-100 font-bold leading-none">✕</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
              className="w-3 h-3 rounded-full flex items-center justify-center group transition-colors"
              style={{ background: "#febc2e" }}
            >
              <span className="text-[7px] text-black/60 opacity-0 group-hover:opacity-100 font-bold leading-none">−</span>
            </button>
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "#27c840" }}
            />
          </div>

          {/* Title — centered */}
          <span
            className="absolute left-1/2 -translate-x-1/2 text-[12px] font-medium text-white/50 pointer-events-none"
            style={{ fontFamily: "system-ui, -apple-system" }}
          >
            {windowState.title}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
          {children}
        </div>
      </motion.div>
    </>
  );
}
