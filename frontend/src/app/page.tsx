import Desktop from "@/components/Desktop";
import contentData from "../../data/content.json";
import graphData from "../../data/graph.json";
import type { PortfolioContent, GraphData } from "@/lib/types";

export default function Home() {
  return (
    <Desktop
      content={contentData as PortfolioContent}
      graphData={graphData as GraphData}
    />
  );
}
