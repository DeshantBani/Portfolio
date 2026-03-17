import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deshant Singh Bani | AI/ML Engineer — Agent OS",
  description:
    "AI/ML Engineer specializing in agentic AI systems, LLM-powered products, multi-agent workflows, and RAG. Interactive AI-powered portfolio.",
  keywords: [
    "AI Engineer",
    "ML Engineer",
    "LangGraph",
    "Multi-agent",
    "RAG",
    "FastAPI",
    "Portfolio",
  ],
  openGraph: {
    title: "Deshant Singh Bani | Agent OS",
    description:
      "An AI-native portfolio. Talk to JARVIS — my AI agent that knows everything about my work.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
