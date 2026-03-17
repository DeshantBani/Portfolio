import type { PortfolioContent, GraphData } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetchContent(): Promise<PortfolioContent> {
  if (API_URL) {
    const res = await fetch(`${API_URL}/api/content`);
    if (res.ok) return res.json();
  }
  const { default: data } = await import("../../data/content.json");
  return data as PortfolioContent;
}

export async function fetchGraphData(): Promise<GraphData> {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/api/content/graph`);
      if (res.ok) return res.json();
    } catch { /* fall through */ }
  }
  const { default: data } = await import("../../data/graph.json");
  return data as GraphData;
}
