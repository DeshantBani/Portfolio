"use client";

import { motion } from "framer-motion";
import type { ContactData } from "@/lib/types";

interface Props {
  data: ContactData;
}

const CONTACT_ITEMS = (data: ContactData) => [
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Message directly on WhatsApp",
    icon: "💬",
    href: `https://wa.me/91${data.phone}`,
    accent: "bg-green-500/15 border-green-500/25 hover:bg-green-500/25",
    textColor: "text-green-400",
  },
  {
    id: "email",
    label: "Email",
    description: data.email,
    icon: "📧",
    href: `mailto:${data.email}?subject=Reaching out from your portfolio`,
    accent: "bg-emerald-500/15 border-emerald-500/25 hover:bg-emerald-500/25",
    textColor: "text-emerald-400",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    description: "Connect on LinkedIn",
    icon: "🔗",
    href: data.linkedin,
    accent: "bg-blue-500/15 border-blue-500/25 hover:bg-blue-500/25",
    textColor: "text-blue-400",
  },
  {
    id: "github",
    label: "GitHub",
    description: "Check out the code",
    icon: "🐙",
    href: data.github,
    accent: "bg-gray-500/15 border-gray-500/25 hover:bg-gray-500/25",
    textColor: "text-gray-300",
  },
  ...(data.resumeUrl
    ? [
        {
          id: "resume",
          label: "Resume",
          description: "Download PDF resume",
          icon: "📄",
          href: data.resumeUrl,
          accent: "bg-emerald-500/15 border-emerald-500/25 hover:bg-emerald-500/25",
          textColor: "text-emerald-400",
        },
      ]
    : []),
  ...(data.calendlyUrl
    ? [
        {
          id: "calendly",
          label: "Book a Call",
          description: "Schedule a meeting",
          icon: "📅",
          href: data.calendlyUrl,
          accent: "bg-purple-500/15 border-purple-500/25 hover:bg-purple-500/25",
          textColor: "text-purple-400",
        },
      ]
    : []),
];

export default function CommsWindow({ data }: Props) {
  const items = CONTACT_ITEMS(data);

  return (
    <div className="space-y-3">
      <div className="text-center mb-4">
        <h3 className="text-emerald-400 font-mono text-sm font-semibold">
          {data.ctaText}
        </h3>
        <p className="text-gray-500 text-xs font-mono mt-1">
          One click. Zero friction. Pick your channel.
        </p>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <motion.a
            key={item.id}
            href={item.href}
            target={item.id === "email" ? undefined : "_blank"}
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${item.accent}`}
          >
            <span className="text-2xl">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-mono font-semibold ${item.textColor}`}>
                {item.label}
              </p>
              <p className="text-gray-500 text-[10px] font-mono truncate">
                {item.description}
              </p>
            </div>
            <span className="text-gray-600 text-xs">→</span>
          </motion.a>
        ))}
      </div>

      <div className="text-center pt-3">
        <p className="text-gray-600 text-[10px] font-mono">
          📍 {data.location} · Available for opportunities
        </p>
      </div>
    </div>
  );
}
