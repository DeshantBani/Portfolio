"use client";

import { motion } from "framer-motion";
import type { ProjectEntry } from "@/lib/types";

interface Props {
  data: ProjectEntry[];
}

export default function ProjectsWindow({ data }: Props) {
  return (
    <div className="space-y-4">
      {data.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15, duration: 0.5 }}
          className="bg-[#111]/80 border border-emerald-500/10 rounded-lg p-4 hover:border-emerald-500/25 transition-colors"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-emerald-400 font-mono text-sm font-semibold">
              {project.title}
            </h3>
            <span className="text-emerald-500/50 text-xs font-mono whitespace-nowrap">
              {project.date}
            </span>
          </div>

          <p className="text-gray-300 text-xs leading-relaxed mb-3">
            {project.description}
          </p>

          {/* Metrics */}
          {project.metrics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {project.metrics.map((metric, j) => (
                <span
                  key={j}
                  className="px-2 py-1 text-[10px] font-mono rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 font-semibold"
                >
                  {metric}
                </span>
              ))}
            </div>
          )}

          {/* Stack */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#1a1a1a] text-gray-400 border border-emerald-500/10"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-3">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-emerald-400/70 hover:text-emerald-400 transition-colors"
              >
                [GitHub →]
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-emerald-400/70 hover:text-emerald-400 transition-colors"
              >
                [Live Demo →]
              </a>
            )}
          </div>
        </motion.div>
      ))}

      {data.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 font-mono text-sm">
            Projects loading... Check back soon.
          </p>
        </div>
      )}
    </div>
  );
}
