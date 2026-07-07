"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Phase = "enter" | "hold" | "zoom" | "done";

const EASE = [0.76, 0, 0.24, 1] as const;

export function IntroSplash() {
  const [phase, setPhase] = useState<Phase>("done");

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("intro-shown");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (alreadyShown || prefersReduced) return;

    sessionStorage.setItem("intro-shown", "1");
    document.body.style.overflow = "hidden";
    // El estado inicial debe ser "done" para coincidir con el SSR (evita un
    // mismatch de hidratación); este efecto recién arranca la secuencia una
    // vez montado en el cliente, que es exactamente para lo que es un efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase("enter");

    const toHold = setTimeout(() => setPhase("hold"), 550);
    const toZoom = setTimeout(() => setPhase("zoom"), 950);
    const toDone = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, 1550);

    return () => {
      clearTimeout(toHold);
      clearTimeout(toZoom);
      clearTimeout(toDone);
      document.body.style.overflow = "";
    };
  }, []);

  function skip() {
    setPhase("done");
    document.body.style.overflow = "";
  }

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="bg-grid fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          onClick={skip}
          role="presentation"
        >
          <div className="orb left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 bg-accent/10" aria-hidden />

          <div className="relative flex items-center font-mono text-6xl font-bold tracking-tight sm:text-8xl">
            <motion.span
              className="inline-block text-foreground"
              initial={{ opacity: 0, x: -24 }}
              animate={
                phase === "zoom" ? { opacity: 0, x: -24 } : { opacity: 1, x: 0 }
              }
              transition={{ duration: 0.4, ease: EASE }}
            >
              &lt;
            </motion.span>

            <motion.span
              className="text-gradient inline-block"
              initial={{ opacity: 0, y: 12 }}
              animate={
                phase === "zoom"
                  ? { opacity: 0, scale: 32, y: 0 }
                  : { opacity: 1, scale: 1, y: 0 }
              }
              transition={
                phase === "zoom"
                  ? { duration: 0.65, ease: EASE }
                  : { duration: 0.45, delay: 0.12, ease: EASE }
              }
            >
              /
            </motion.span>

            <motion.span
              className="inline-block text-foreground"
              initial={{ opacity: 0, x: 24 }}
              animate={
                phase === "zoom" ? { opacity: 0, x: 24 } : { opacity: 1, x: 0 }
              }
              transition={{ duration: 0.4, ease: EASE }}
            >
              &gt;
            </motion.span>

            {phase === "hold" && (
              <span className="cursor-blink absolute -right-3 top-1/2 h-10 w-1 -translate-y-1/2 bg-accent sm:h-14" />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
