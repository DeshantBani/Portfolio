"use client";

import { motion } from "framer-motion";
import type { ExperienceEntry } from "@/lib/types";

interface Props {
  data: ExperienceEntry[];
}

export default function ExperienceWindow({ data }: Props) {
  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-emerald-500/20" />

      <div className="space-y-6">
        {data.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="relative pl-10"
          >
            {/* Timeline dot */}
            <div className="absolute left-[11px] top-2 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0d0d0d] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />

            <div className="bg-[#111]/80 border border-emerald-500/10 rounded-lg p-4 hover:border-emerald-500/25 transition-colors">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                <div>
                  <h3 className="text-emerald-400 font-mono text-sm font-semibold">
                    {entry.role}
                  </h3>
                  <p className="text-gray-400 text-xs font-mono">
                    {entry.company} · {entry.location}
                  </p>
                </div>
                <span className="text-emerald-500/60 text-xs font-mono whitespace-nowrap">
                  {entry.startDate} – {entry.endDate}
                </span>
              </div>

              {/* Bullets */}
              <ul className="space-y-1.5 mb-3">
                {entry.bullets.map((bullet, j) => (
                  <motion.li
                    key={j}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.15 + j * 0.08 + 0.3 }}
                    className="text-gray-300 text-xs leading-relaxed flex gap-2"
                  >
                    <span className="text-emerald-500/50 mt-0.5 shrink-0">▸</span>
                    <span>{bullet}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5">
                {entry.techTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-400/80 border border-emerald-500/15"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
