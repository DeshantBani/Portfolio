"use client";

import { useEffect, useState } from "react";

interface Props {
  isSpeaking?: boolean;
  size?: number;
}

export default function AvatarCharacter({ isSpeaking = false, size = 220 }: Props) {
  const [blinking, setBlinking] = useState(false);

  // Random blink timing
  useEffect(() => {
    const schedule = () => {
      const delay = 2500 + Math.random() * 4000;
      return setTimeout(() => {
        setBlinking(true);
        setTimeout(() => {
          setBlinking(false);
          schedule();
        }, 180);
      }, delay);
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  const eyeScaleY = blinking ? 0.06 : 1;

  return (
    <div
      className="relative inline-block select-none"
      style={{ animation: "avatarFloat 3.8s ease-in-out infinite", willChange: "transform" }}
    >
      <svg
        width={size}
        height={size * 1.15}
        viewBox="0 0 220 252"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 20px 40px rgba(0,80,255,0.3)) drop-shadow(0 0 60px rgba(100,0,255,0.15))" }}
      >
        <defs>
          <radialGradient id="faceGrad" cx="42%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#EDC09A" />
            <stop offset="55%" stopColor="#D4885A" />
            <stop offset="100%" stopColor="#B86030" />
          </radialGradient>
          <radialGradient id="irisL" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#5B8FD4" />
            <stop offset="60%" stopColor="#2C4A8C" />
            <stop offset="100%" stopColor="#1A2E60" />
          </radialGradient>
          <radialGradient id="irisR" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#5B8FD4" />
            <stop offset="60%" stopColor="#2C4A8C" />
            <stop offset="100%" stopColor="#1A2E60" />
          </radialGradient>
          <radialGradient id="headGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(80,140,255,0.15)" />
            <stop offset="100%" stopColor="rgba(80,140,255,0)" />
          </radialGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Neck */}
        <rect x="88" y="188" width="44" height="40" rx="6" fill="#C87040" />

        {/* Shirt / collar */}
        <path d="M 30 230 L 110 205 L 190 230 L 220 252 L 0 252 Z" fill="#131928" />
        <path d="M 110 205 L 94 228 L 110 222 L 126 228 Z" fill="#0a1020" />

        {/* Hair (back) */}
        <ellipse cx="110" cy="88" rx="82" ry="88" fill="#0F0600" />

        {/* Forehead extra volume */}
        <path d="M 35 85 Q 110 20 185 85" fill="#0F0600" />

        {/* Face */}
        <ellipse cx="110" cy="115" rx="78" ry="86" fill="url(#faceGrad)" />

        {/* Ambient head glow */}
        <ellipse cx="110" cy="115" rx="82" ry="90" fill="url(#headGlow)" />

        {/* Ears */}
        <ellipse cx="32" cy="112" rx="11" ry="15" fill="#D4885A" />
        <ellipse cx="188" cy="112" rx="11" ry="15" fill="#D4885A" />
        <ellipse cx="32" cy="112" rx="6.5" ry="10" fill="#C07040" />
        <ellipse cx="188" cy="112" rx="6.5" ry="10" fill="#C07040" />

        {/* Hair (front) */}
        <path
          d="M 30 90 Q 38 32 110 28 Q 182 32 190 90 Q 170 55 110 52 Q 50 55 30 90 Z"
          fill="#0F0600"
        />
        {/* Side hair strands */}
        <path d="M 30 92 Q 22 70 25 55 Q 34 42 36 62 Z" fill="#0F0600" />
        <path d="M 190 92 Q 198 70 195 55 Q 186 42 184 62 Z" fill="#0F0600" />

        {/* Eyebrows */}
        <path
          d="M 68 88 Q 84 82 96 85"
          stroke="#1A0800"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 124 85 Q 136 82 152 88"
          stroke="#1A0800"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Left eye */}
        <g
          style={{
            transformOrigin: "82px 110px",
            transform: `scaleY(${eyeScaleY})`,
            transition: "transform 0.06s ease-in-out",
          }}
        >
          <ellipse cx="82" cy="110" rx="15" ry="17" fill="white" />
          <circle cx="82" cy="112" r="11" fill="url(#irisL)" />
          <circle cx="82" cy="112" r="5.5" fill="#060A14" />
          <circle cx="76" cy="107" r="4" fill="white" opacity="0.9" />
          <circle cx="83" cy="109" r="1.8" fill="white" opacity="0.5" />
        </g>

        {/* Right eye */}
        <g
          style={{
            transformOrigin: "138px 110px",
            transform: `scaleY(${eyeScaleY})`,
            transition: "transform 0.06s ease-in-out",
          }}
        >
          <ellipse cx="138" cy="110" rx="15" ry="17" fill="white" />
          <circle cx="138" cy="112" r="11" fill="url(#irisR)" />
          <circle cx="138" cy="112" r="5.5" fill="#060A14" />
          <circle cx="132" cy="107" r="4" fill="white" opacity="0.9" />
          <circle cx="139" cy="109" r="1.8" fill="white" opacity="0.5" />
        </g>

        {/* Nose */}
        <path
          d="M 104 130 Q 110 140 116 130"
          stroke="#B06030"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="102" cy="136" rx="4" ry="3" fill="#B86030" opacity="0.45" />
        <ellipse cx="118" cy="136" rx="4" ry="3" fill="#B86030" opacity="0.45" />

        {/* Mouth */}
        {isSpeaking ? (
          <>
            {/* Speaking: open mouth with teeth */}
            <path d="M 88 155 Q 110 172 132 155" fill="#4A1010" />
            <path d="M 88 155 Q 110 160 132 155" fill="#F0EDE8" />
            <path d="M 88 155 L 132 155 L 130 162 Q 110 165 90 162 Z" fill="#F0EDE8" opacity="0.9" />
          </>
        ) : (
          <path
            d="M 88 156 Q 110 170 132 156"
            fill="none"
            stroke="#8A3A18"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        {/* Cheek blush */}
        <ellipse cx="66" cy="130" rx="14" ry="9" fill="#E8705A" opacity="0.12" />
        <ellipse cx="154" cy="130" rx="14" ry="9" fill="#E8705A" opacity="0.12" />

        {/* Forehead highlight */}
        <ellipse cx="110" cy="78" rx="24" ry="14" fill="white" opacity="0.07" />

        {/* Subtle blue tech glow ring */}
        <ellipse
          cx="110"
          cy="115"
          rx="82"
          ry="90"
          fill="none"
          stroke="rgba(80,140,255,0.2)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Speaking pulse ring */}
      {isSpeaking && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "transparent",
            boxShadow: "0 0 0 6px rgba(80,140,255,0.15), 0 0 0 12px rgba(80,140,255,0.08)",
            animation: "speakPulse 0.8s ease-in-out infinite",
            borderRadius: "50%",
            top: "5%",
            left: "10%",
            right: "10%",
            bottom: "20%",
          }}
        />
      )}
    </div>
  );
}
