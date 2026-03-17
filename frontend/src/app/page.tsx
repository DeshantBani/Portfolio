import Desktop from "@/components/Desktop";
import contentData from "../../data/content.json";
import type { PortfolioContent } from "@/lib/types";

export default function Home() {
  return <Desktop content={contentData as PortfolioContent} />;
}
