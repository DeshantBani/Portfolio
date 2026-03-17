"use client";

import { motion } from "framer-motion";
import type { Achievements } from "@/lib/types";

interface Props {
  data: Achievements;
}

export default function AchievementsWindow({ data }: Props) {
  return (
    <div className="space-y-5">
      {/* Certifications */}
      <div>
        <h3 className="text-emerald-400/80 font-mono text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>🏆</span> Certifications
        </h3>
        <div className="space-y-2">
          {data.certifications.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-center gap-3 bg-[#111]/80 border border-emerald-500/10 rounded-lg p-3 hover:border-emerald-500/25 transition-colors"
            >
              <div className="w-8 h-8 rounded-md bg-emerald-500/15 flex items-center justify-center shrink-0">
                <span className="text-emerald-400 text-sm">✦</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-200 text-xs font-mono truncate">{cert.name}</p>
                <p className="text-emerald-500/50 text-[10px] font-mono">{cert.year}</p>
              </div>
              {cert.url && (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400/60 text-xs hover:text-emerald-400 transition-colors"
                >
                  [view]
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Positions of Responsibility */}
      <div>
        <h3 className="text-emerald-400/80 font-mono text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>⭐</span> Positions of Responsibility
        </h3>
        <div className="space-y-2">
          {data.por.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.3, duration: 0.4 }}
              className="flex items-center gap-3 bg-[#111]/80 border border-emerald-500/10 rounded-lg p-3 hover:border-emerald-500/25 transition-colors"
            >
              <div className="w-8 h-8 rounded-md bg-emerald-500/15 flex items-center justify-center shrink-0">
                <span className="text-emerald-400 text-sm">◆</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-200 text-xs font-mono">{item.role}</p>
                <p className="text-emerald-500/50 text-[10px] font-mono">{item.period}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
