export interface GraphNode {
  id: string;
  label: string;
  group: string;
  size: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Education {
  institution: string;
  degree: string;
  specialization: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface AboutData {
  name: string;
  headline: string;
  oneLiner: string;
  bio: string;
  photoUrl: string;
  education: Education;
  personalityTags: string[];
  quote: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
  techTags: string[];
}

export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  metrics: string[];
  stack: string[];
  repoUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  date: string;
}

export interface Achievements {
  certifications: { name: string; year: string; url: string | null }[];
  por: { role: string; period: string }[];
}

export interface Technologies {
  genAiAgents: string[];
  mlDl: string[];
  backend: string[];
  frontend: string[];
  cloudDevOps: string[];
  databases: string[];
  tools: string[];
}

export interface ContactData {
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  resumeUrl: string | null;
  calendlyUrl: string | null;
  ctaText: string;
}

export interface PortfolioContent {
  about: AboutData;
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  achievements: Achievements;
  technologies: Technologies;
  contact: ContactData;
}

export type WindowId =
  | "jarvis.ai"
  | "experience.log"
  | "projects.exe"
  | "skills.sys"
  | "achievements.dat"
  | "comms.link";

export interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}
