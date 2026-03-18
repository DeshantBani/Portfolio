"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  opacity?: number;
}

const BLOBS = [
  { cx: 0.15, cy: 0.25, ampX: 0.25, ampY: 0.22, freqX: 0.38, freqY: 0.29, phase: 0,    radius: 420, r: 0,   g: 80,  b: 255, a: 0.55, mouseStr: 0.12 },
  { cx: 0.78, cy: 0.60, ampX: 0.20, ampY: 0.28, freqX: 0.27, freqY: 0.33, phase: 1.3,  radius: 380, r: 120, g: 0,   b: 255, a: 0.50, mouseStr: 0.09 },
  { cx: 0.50, cy: 0.12, ampX: 0.32, ampY: 0.18, freqX: 0.48, freqY: 0.40, phase: 2.6,  radius: 360, r: 0,   g: 200, b: 255, a: 0.45, mouseStr: 0.10 },
  { cx: 0.88, cy: 0.82, ampX: 0.14, ampY: 0.22, freqX: 0.57, freqY: 0.24, phase: 3.9,  radius: 320, r: 255, g: 0,   b: 100, a: 0.38, mouseStr: 0.07 },
  { cx: 0.12, cy: 0.78, ampX: 0.18, ampY: 0.20, freqX: 0.33, freqY: 0.47, phase: 5.2,  radius: 340, r: 0,   g: 255, b: 140, a: 0.35, mouseStr: 0.08 },
  { cx: 0.50, cy: 0.94, ampX: 0.38, ampY: 0.08, freqX: 0.43, freqY: 0.55, phase: 1.7,  radius: 280, r: 255, g: 140, b: 0,   a: 0.28, mouseStr: 0.06 },
];

export default function InteractableBackground({ opacity = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const scrollPulseRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    let w = window.innerWidth;
    let h = window.innerHeight;
    let raf: number;

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

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / w, y: e.clientY / h };
    };
    window.addEventListener("mousemove", onMouseMove);

    // Scroll/wheel reaction: give background a speed pulse
    const onWheel = () => {
      scrollPulseRef.current = Math.min(scrollPulseRef.current + 2.5, 5);
    };
    window.addEventListener("wheel", onWheel, { passive: true });

    const onTouch = () => {
      scrollPulseRef.current = Math.min(scrollPulseRef.current + 1.5, 5);
    };
    window.addEventListener("touchmove", onTouch, { passive: true });

    let t = 0;
    function draw() {
      // Decay scroll pulse
      scrollPulseRef.current *= 0.97;
      const speed = 1 + scrollPulseRef.current;
      t += 0.008 * speed;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Fade previous frame — lower = more trail
      ctx.fillStyle = `rgba(5, 8, 18, ${0.07 * opacity})`;
      ctx.fillRect(0, 0, w, h);

      // Draw each vibrant blob
      ctx.filter = "blur(70px)";
      for (const b of BLOBS) {
        // Organic sinusoidal base path
        const baseX = b.cx * w + b.ampX * w * Math.sin(b.freqX * t + b.phase);
        const baseY = b.cy * h + b.ampY * h * Math.cos(b.freqY * t + b.phase);

        // Mouse attraction — pulls each blob toward cursor
        const pullX = (mx - b.cx) * w * b.mouseStr;
        const pullY = (my - b.cy) * h * b.mouseStr;

        const bx = baseX + pullX;
        const by = baseY + pullY;
        const br = b.radius * (1 + scrollPulseRef.current * 0.06);

        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0, `rgba(${b.r},${b.g},${b.b},${b.a * opacity})`);
        g.addColorStop(0.4, `rgba(${b.r},${b.g},${b.b},${b.a * 0.4 * opacity})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.filter = "none";

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [opacity, mounted]);

  if (!mounted) return <div className="fixed inset-0 z-0 bg-[#05080f]" />;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full"
      style={{ opacity }}
    />
  );
}
