"use client";

import { motion } from "framer-motion";
import type { Technologies } from "@/lib/types";

interface Props {
  data: Technologies;
}

const CATEGORY_LABELS: Record<keyof Technologies, string> = {
  genAiAgents: "Gen AI & Agents",
  mlDl: "ML / Deep Learning",
  backend: "Backend",
  frontend: "Frontend",
  cloudDevOps: "Cloud & DevOps",
  databases: "Databases",
  tools: "Tools",
};

const CATEGORY_ICONS: Record<keyof Technologies, string> = {
  genAiAgents: "🧠",
  mlDl: "🔬",
  backend: "⚙️",
  frontend: "🖥️",
  cloudDevOps: "☁️",
  databases: "🗄️",
  tools: "🔧",
};

export default function SkillsWindow({ data }: Props) {
  const categories = Object.entries(data) as [keyof Technologies, string[]][];

  return (
    <div className="space-y-4">
      {categories.map(([key, skills], i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span>{CATEGORY_ICONS[key]}</span>
            <h3 className="text-emerald-400/80 font-mono text-xs font-semibold uppercase tracking-wider">
              {CATEGORY_LABELS[key]}
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, j) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + j * 0.03 + 0.2 }}
                className="px-2.5 py-1 text-xs font-mono rounded-md bg-emerald-500/10 text-emerald-300/90 border border-emerald-500/15 hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
