"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: Props) {
  const [phase, setPhase] = useState<"logo" | "name" | "role" | "bar" | "done">("logo");
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("name"), 500);
    const t2 = setTimeout(() => setPhase("role"), 1200);
    const t3 = setTimeout(() => setPhase("bar"), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    if (phase !== "bar") return;
    let raf: number;
    const start = performance.now();
    const duration = 1400;
    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setBarWidth(p * 100);
      if (p < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setPhase("done");
        setTimeout(onComplete, 600);
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          {/* Center content */}
          <div className="flex flex-col items-center gap-5">
            {/* Monogram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-16 h-16 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-center"
            >
              <span className="text-white text-2xl font-black tracking-tighter select-none" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
                D
              </span>
            </motion.div>

            {/* Name */}
            <AnimatePresence>
              {(phase === "name" || phase === "role" || phase === "bar") && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-white text-lg font-semibold tracking-[0.2em] uppercase"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  Deshant Singh Bani
                </motion.p>
              )}
            </AnimatePresence>

            {/* Role */}
            <AnimatePresence>
              {(phase === "role" || phase === "bar") && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-white/40 text-sm tracking-widest uppercase"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  AI / ML Engineer
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Progress bar — bottom of screen, Apple-style */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48">
            <div className="h-[3px] rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-white/60"
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
