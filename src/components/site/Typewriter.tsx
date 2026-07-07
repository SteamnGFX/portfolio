"use client";

import { useEffect, useState } from "react";

export function Typewriter({
  text,
  className,
  speed = 35,
  startDelay = 0,
}: {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
}) {
  const [chars, setChars] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(startTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!started || chars >= text.length) return;
    const timer = setTimeout(() => setChars((c) => c + 1), speed);
    return () => clearTimeout(timer);
  }, [started, chars, text, speed]);

  return (
    <span className={className}>
      {text.slice(0, chars)}
      <span className="cursor-blink text-accent">▌</span>
    </span>
  );
}
