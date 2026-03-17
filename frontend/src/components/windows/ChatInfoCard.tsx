"use client";

import { motion } from "framer-motion";
import type { PortfolioContent } from "@/lib/types";

type BlockType = "about" | "projects" | "skills" | "experience" | "contact" | "achievements";

interface Props {
  type: BlockType;
  content: PortfolioContent;
}

export default function ChatInfoCard({ type, content }: Props) {
  if (type === "about") {
    const { about } = content;
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 rounded-xl bg-white/5 border border-white/10 overflow-hidden max-w-sm"
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 shrink-0 flex items-center justify-center text-blue-400 text-lg font-semibold">
              {about.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white text-sm">{about.name}</h3>
              <p className="text-blue-400/90 text-xs mt-0.5">{about.headline}</p>
              <p className="text-gray-400 text-xs mt-1.5">{about.oneLiner}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {about.personalityTags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-white/5 text-gray-300 text-[10px] border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === "projects") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 space-y-2 max-w-sm"
      >
        {content.projects.slice(0, 3).map((p) => (
          <div
            key={p.id}
            className="rounded-xl bg-white/5 border border-white/10 p-3"
          >
            <p className="font-medium text-white text-xs">{p.title}</p>
            <p className="text-gray-400 text-[10px] mt-0.5 line-clamp-2">{p.description}</p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {p.metrics.slice(0, 2).map((m) => (
                <span key={m} className="text-[9px] text-blue-400/80">
                  {m}
                </span>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  if (type === "skills") {
    const flat = [
      ...content.technologies.genAiAgents,
      ...content.technologies.backend,
      ...content.technologies.cloudDevOps,
    ].slice(0, 12);
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 rounded-xl bg-white/5 border border-white/10 p-3 max-w-sm"
      >
        <p className="text-gray-400 text-[10px] mb-2">Tech stack</p>
        <div className="flex flex-wrap gap-1">
          {flat.map((s) => (
            <span
              key={s}
              className="px-1.5 py-0.5 rounded bg-white/5 text-gray-300 text-[9px] border border-white/10"
            >
              {s}
            </span>
          ))}
        </div>
      </motion.div>
    );
  }

  if (type === "experience") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 space-y-2 max-w-sm"
      >
        {content.experience.slice(0, 3).map((e) => (
          <div
            key={e.id}
            className="rounded-xl bg-white/5 border border-white/10 p-3"
          >
            <p className="font-medium text-white text-xs">{e.role}</p>
            <p className="text-blue-400/80 text-[10px]">{e.company}</p>
            <p className="text-gray-500 text-[9px] mt-0.5">
              {e.startDate} – {e.endDate}
            </p>
          </div>
        ))}
      </motion.div>
    );
  }

  if (type === "achievements") {
    const { achievements } = content;
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 rounded-xl bg-white/5 border border-white/10 p-3 max-w-sm"
      >
        <p className="text-gray-400 text-[10px] mb-2">Achievements</p>
        <div className="space-y-1.5">
          {achievements.certifications.map((c, i) => (
            <p key={i} className="text-white text-[10px]">
              {c.name} ({c.year})
            </p>
          ))}
          {achievements.por.map((p, i) => (
            <p key={i} className="text-gray-300 text-[10px]">
              {p.role} · {p.period}
            </p>
          ))}
        </div>
      </motion.div>
    );
  }

  if (type === "contact") {
    const c = content.contact;
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 rounded-xl bg-white/5 border border-white/10 p-3 max-w-sm"
      >
        <p className="text-gray-400 text-[10px] mb-2">Reach out</p>
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://wa.me/91${c.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-blue-400 hover:underline"
          >
            WhatsApp
          </a>
          <a
            href={`mailto:${c.email}`}
            className="text-[10px] text-blue-400 hover:underline"
          >
            Email
          </a>
          <a
            href={c.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-blue-400 hover:underline"
          >
            LinkedIn
          </a>
          <a
            href={c.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-blue-400 hover:underline"
          >
            GitHub
          </a>
        </div>
      </motion.div>
    );
  }

  return null;
}

export type { BlockType };
