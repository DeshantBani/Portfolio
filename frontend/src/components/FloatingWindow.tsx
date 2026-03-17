"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";
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
  const [isDragging, setIsDragging] = useState(false);

  if (!windowState.isOpen || windowState.isMinimized) return null;

  return (
    <>
      {/* Invisible constraints container */}
      <div ref={constraintsRef} className="fixed inset-0 z-0 pointer-events-none" />

      <motion.div
        className={`fixed flex flex-col rounded-lg border border-emerald-500/20 bg-[#0d0d0d]/95 backdrop-blur-xl shadow-2xl shadow-emerald-500/5 overflow-hidden ${className}`}
        style={{
          zIndex: windowState.zIndex,
          width: windowState.size.width,
          height: windowState.size.height,
        }}
        initial={{ opacity: 0, scale: 0.9, x: windowState.position.x, y: windowState.position.y }}
        animate={{ opacity: 1, scale: 1, x: windowState.position.x, y: windowState.position.y }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        drag
        dragMomentum={false}
        dragElastic={0}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        onPointerDown={onFocus}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-3 py-2 bg-[#111]/90 border-b border-emerald-500/10 cursor-grab active:cursor-grabbing select-none shrink-0"
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors"
              />
              <button
                onClick={(e) => { e.stopPropagation(); onMinimize(); }}
                className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors"
              />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="ml-2 text-xs font-mono text-emerald-400/70">
              {windowState.title}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
          {children}
        </div>
      </motion.div>
    </>
  );
}
