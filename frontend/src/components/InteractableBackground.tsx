"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  opacity?: number;
}

// Pastel blob colors (soft greens, blues, lavender, yellow, pink) — blend into dark at edges
const BLOB_COLORS = [
  "rgba(168, 230, 207, 0.22)",  // mint
  "rgba(180, 212, 231, 0.2)",   // pale blue
  "rgba(201, 184, 232, 0.18)",  // lavender
  "rgba(245, 230, 163, 0.15)",  // soft yellow
  "rgba(248, 180, 196, 0.14)",  // pink
  "rgba(165, 218, 232, 0.16)", // light cyan
];

export default function InteractableBackground({ opacity = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    let w = window.innerWidth;
    let h = window.innerHeight;
    let animationId: number;

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

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / w, y: e.clientY / h };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Blob positions and phases for smooth, organic motion
    const blobs = BLOB_COLORS.map((_, i) => ({
      phaseX: i * 1.2,
      phaseY: i * 0.9,
      speedX: 0.15 + (i % 3) * 0.05,
      speedY: 0.12 + (i % 2) * 0.06,
      radius: 0.45 + (i % 4) * 0.12,
      mouseInfluence: 0.08 + (i % 2) * 0.04,
    }));

    let time = 0;
    const draw = () => {
      time += 0.004;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Clear with dark base (blends with app bg)
      ctx.fillStyle = "rgba(8, 8, 12, 0.92)";
      ctx.fillRect(0, 0, w, h);

      // Draw overlapping pastel blobs — swirling, fluid-like
      for (let i = 0; i < BLOB_COLORS.length; i++) {
        const b = blobs[i];
        const cx = w * (0.5 + Math.sin(time * b.speedX + b.phaseX) * 0.35 + (mx - 0.5) * b.mouseInfluence);
        const cy = h * (0.45 + Math.cos(time * b.speedY + b.phaseY) * 0.3 + (my - 0.5) * b.mouseInfluence);
        const r = Math.max(w, h) * b.radius;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        gradient.addColorStop(0, BLOB_COLORS[i]);
        gradient.addColorStop(0.5, BLOB_COLORS[i].replace(/[\d.]+\)$/, "0.06)"));
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      // Vignette: fade to dark at edges so it sits nicely on dark theme
      const vg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.85);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(0.6, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(8,8,12,0.7)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [opacity, mounted]);

  if (!mounted) {
    return (
      <div
        className="fixed inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 100% 80% at 50% 40%, #1a1a24 0%, #0c0c0e 100%)",
          opacity,
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full"
      style={{ opacity }}
    />
  );
}
