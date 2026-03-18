"use client";

import { useEffect, useState } from "react";

function AppleLogo() {
  return (
    <svg width="13" height="16" viewBox="0 0 814 1000" fill="currentColor">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.5-57.8-155.8-127.4C46 411.3 0 302.7 0 199.3c0-170.6 111.4-261 220.8-261 56.8 0 104.1 37.1 139.3 37.1 33.6 0 86.5-39.5 151.1-39.5 24.3 0 108.2 2.6 168.1 80.3zm-326.6-72.4c-12.9-60.9 21-123.1 59.5-162 43.2-45.3 109.4-73.8 165.9-73.8 3.8 35.8-11.6 70.9-55.2 114.5-40.1 40.8-103.1 73.2-170.2 121.3z" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
      <path d="M7.5 2.5C9.3 2.5 10.9 3.2 12.1 4.3L13.3 3.1C11.7 1.7 9.7 0.8 7.5 0.8C5.3 0.8 3.3 1.7 1.7 3.1L2.9 4.3C4.1 3.2 5.7 2.5 7.5 2.5Z" opacity="0.5"/>
      <path d="M7.5 5C8.7 5 9.8 5.5 10.6 6.3L11.8 5.1C10.6 4.0 9.1 3.3 7.5 3.3C5.9 3.3 4.4 4.0 3.2 5.1L4.4 6.3C5.2 5.5 6.3 5 7.5 5Z" opacity="0.7"/>
      <circle cx="7.5" cy="9" r="1.5"/>
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
      <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="currentColor" strokeOpacity="0.6"/>
      <rect x="2" y="2" width="13" height="7" rx="1.5" fill="currentColor"/>
      <path d="M20 3.5V7.5C20.8 7.2 21.5 6.3 21.5 5.5C21.5 4.7 20.8 3.8 20 3.5Z" fill="currentColor" fillOpacity="0.4"/>
    </svg>
  );
}

interface Props {
  title?: string;
}

export default function MacMenuBar({ title = "Portfolio" }: Props) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
      setDate(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }));
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-7 flex items-center px-3 select-none"
      style={{
        background: "rgba(20, 20, 20, 0.82)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Left: Apple logo + menu items */}
      <div className="flex items-center gap-4">
        <button className="text-white/80 hover:text-white transition-colors flex items-center">
          <AppleLogo />
        </button>
        <span className="text-white text-[13px] font-semibold" style={{ fontFamily: "system-ui, -apple-system" }}>
          {title}
        </span>
        {["File", "View", "Window", "Help"].map((item) => (
          <span
            key={item}
            className="text-white/70 text-[13px] hover:text-white/90 transition-colors cursor-default"
            style={{ fontFamily: "system-ui, -apple-system" }}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Right: status icons + clock */}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-white/60 flex items-center"><WifiIcon /></span>
        <span className="text-white/60 flex items-center"><BatteryIcon /></span>
        <span className="text-white/70 text-[12px]" style={{ fontFamily: "system-ui, -apple-system" }}>
          {date}
        </span>
        <span className="text-white text-[13px] font-medium tabular-nums" style={{ fontFamily: "system-ui, -apple-system" }}>
          {time}
        </span>
      </div>
    </div>
  );
}
