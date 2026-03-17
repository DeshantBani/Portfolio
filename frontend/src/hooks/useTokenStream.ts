"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export function useTokenStream(text: string, speed: number = 20, autoStart: boolean = true) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const start = useCallback(() => {
    indexRef.current = 0;
    setDisplayed("");
    setIsDone(false);

    const tick = () => {
      if (indexRef.current >= text.length) {
        setIsDone(true);
        return;
      }
      indexRef.current++;
      setDisplayed(text.slice(0, indexRef.current));
      timerRef.current = setTimeout(tick, speed + Math.random() * speed * 0.5);
    };
    tick();
  }, [text, speed]);

  useEffect(() => {
    if (autoStart && text) start();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [autoStart, text, start]);

  return { displayed, isDone, start };
}
