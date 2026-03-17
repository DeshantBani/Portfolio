"use client";

import { useEffect, useRef, useCallback } from "react";
import type { GraphData, GraphNode } from "@/lib/types";

interface Props {
  data: GraphData;
  highlightNode?: string | null;
  opacity?: number;
}

interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function KnowledgeGraph({ data, highlightNode, opacity = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  const initNodes = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    nodesRef.current = data.nodes.map((n) => ({
      ...n,
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));
  }, [data.nodes]);

  useEffect(() => {
    initNodes();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const nodeMap = new Map<string, SimNode>();

    const draw = () => {
      timeRef.current += 0.005;
      const t = timeRef.current;

      const nodes = nodesRef.current;
      nodeMap.clear();
      nodes.forEach((n) => nodeMap.set(n.id, n));

      // Simple physics
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        // Bounce off edges with margin
        if (n.x < 50 || n.x > w - 50) n.vx *= -1;
        if (n.y < 50 || n.y > h - 50) n.vy *= -1;

        n.x = Math.max(30, Math.min(w - 30, n.x));
        n.y = Math.max(30, Math.min(h - 30, n.y));

        // Slight drift variation
        n.vx += (Math.random() - 0.5) * 0.01;
        n.vy += (Math.random() - 0.5) * 0.01;
        n.vx *= 0.999;
        n.vy *= 0.999;
      }

      // Repulsion between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 80) {
            const force = (80 - dist) * 0.002;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            nodes[i].vx -= fx;
            nodes[i].vy -= fy;
            nodes[j].vx += fx;
            nodes[j].vy += fy;
          }
        }
      }

      ctx.clearRect(0, 0, w, h);

      // Draw edges
      for (const edge of data.edges) {
        const s = nodeMap.get(edge.source);
        const tgt = nodeMap.get(edge.target);
        if (!s || !tgt) continue;

        const isHighlighted =
          highlightNode && (edge.source === highlightNode || edge.target === highlightNode);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.strokeStyle = isHighlighted
          ? `rgba(16, 185, 129, ${0.6 * opacity})`
          : `rgba(16, 185, 129, ${0.12 * opacity})`;
        ctx.lineWidth = isHighlighted ? 1.5 : 0.5;
        ctx.stroke();
      }

      // Draw nodes — all nodes get a visible filled circle and a label
      for (const n of nodes) {
        const isHighlighted = highlightNode === n.id;
        const isCenter = n.group === "center";
        // Minimum radius 5 so every node is visibly filled; scale up by size
        const baseRadius = Math.max(5, n.size * (isCenter ? 1.5 : 1.2));
        const pulse = isHighlighted ? Math.sin(t * 4) * 2 + 2 : 0;
        const radius = baseRadius + pulse;

        // Glow for center and highlighted
        if (isHighlighted || isCenter) {
          const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 4);
          gradient.addColorStop(0, `rgba(16, 185, 129, ${0.3 * opacity})`);
          gradient.addColorStop(1, `rgba(16, 185, 129, 0)`);
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius * 4, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Node circle — all nodes filled with visible opacity
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isHighlighted
          ? `rgba(16, 185, 129, ${0.9 * opacity})`
          : isCenter
            ? `rgba(16, 185, 129, ${0.75 * opacity})`
            : `rgba(16, 185, 129, ${0.5 * opacity})`;
        ctx.fill();

        // Optional subtle stroke so nodes don't blend into edges
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 * opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Labels for ALL nodes — smaller font for smaller nodes to reduce clutter
        const fontSize = isHighlighted ? 11 : isCenter ? 10 : n.size >= 4 ? 9 : 8;
        ctx.font = `${fontSize}px system-ui, sans-serif`;
        ctx.fillStyle = `rgba(16, 185, 129, ${(isHighlighted ? 0.95 : isCenter ? 0.85 : 0.6) * opacity})`;
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.x, n.y + radius + fontSize + 2);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [data, highlightNode, opacity, initNodes]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ opacity }}
    />
  );
}
