"use client";

import type { PortfolioContent } from "@/lib/types";

interface Props {
  content: PortfolioContent;
}

const STACK_TAGS = ["LangGraph", "FastAPI", "RAG", "Multi-agent", "ChromaDB", "Python", "GPT-4o", "ElevenLabs"];
const FOCUS_TAGS = ["Agent Systems", "Document Intelligence", "LLM Engineering"];

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[12px] text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
    >
      {label}
    </a>
  );
}

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/3 border border-white/[0.07]">
      <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium">{label}</span>
      <span className="text-[13px] text-white/80 font-medium leading-snug">{value}</span>
      {sub && <span className="text-[11px] text-white/40">{sub}</span>}
    </div>
  );
}

export default function AboutWindow({ content }: Props) {
  const about = content.about;
  const contact = content.contact;

  return (
    <div className="h-full flex flex-col gap-4 text-white">
      {/* Top: identity + bio */}
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="shrink-0 w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500/20 to-purple-500/10 border border-white/10 flex items-center justify-center">
          <span className="text-3xl font-black text-white/60 select-none" style={{ fontFamily: "system-ui" }}>D</span>
        </div>

        {/* Name + role + bio */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-white leading-tight tracking-tight">{about.name}</h1>
          <p className="text-[13px] text-blue-400 font-medium mt-0.5">AI / ML Engineer</p>
          <p className="text-[12px] text-white/50 mt-2 leading-relaxed line-clamp-2">{about.headline}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-[12px] text-white/45 leading-relaxed">
        {about.bio.slice(0, 220)}...
      </p>

      {/* Stack tags */}
      <div className="flex flex-wrap gap-1.5">
        {STACK_TAGS.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-500/10 text-blue-300/80 border border-blue-500/15"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Info cards grid */}
      <div className="grid grid-cols-3 gap-2">
        <Card label="Role" value="AI / ML Engineer" sub="2+ yrs experience" />
        <Card label="Focus" value={FOCUS_TAGS[0]} sub={FOCUS_TAGS[1]} />
        <Card label="Location" value={about.education.location.split(",")[1]?.trim() ?? "India"} sub="Open to Remote" />
        <Card
          label="Education"
          value="IIIT Nagpur"
          sub={`B.Tech CS + AI · ${about.education.endDate}`}
        />
        <Card
          label="Companies"
          value="Infogain · CaRPM"
          sub="Jio · C&S Electric"
        />
        <Card
          label="Status"
          value="Open to work"
          sub="Full-time / Internship"
        />
      </div>

      {/* Action links */}
      <div className="flex items-center gap-2 mt-auto pt-1">
        <ExternalLink href={contact.github} label="GitHub" />
        <ExternalLink href={contact.linkedin} label="LinkedIn" />
        {contact.resumeUrl && <ExternalLink href={contact.resumeUrl} label="Resume" />}
        <a
          href={`mailto:${contact.email}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/25 text-[12px] text-blue-300 hover:bg-blue-500/25 transition-all ml-auto"
        >
          {contact.email}
        </a>
      </div>
    </div>
  );
}
