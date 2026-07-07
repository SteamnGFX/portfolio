"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { LinkButton } from "@/components/ui/Button";
import { Typewriter } from "@/components/site/Typewriter";
import { trackEvent } from "@/lib/actions/analytics";
import type { Dictionary } from "@/lib/dictionary";

interface HeroProps {
  name: string;
  title: string;
  location: string;
  avatarUrl: string | null;
  cvUrl: string | null;
  dict: Dictionary;
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

export function Hero({ name, title, location, avatarUrl, cvUrl, dict }: HeroProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <section id="top" className="bg-grid relative overflow-hidden border-b border-border/60">
      <div
        className="orb -left-24 -top-24 h-72 w-72 bg-accent/20"
        aria-hidden
      />
      <div
        className="orb -right-24 top-32 h-80 w-80 bg-accent-secondary/15"
        style={{ animationDelay: "-8s" }}
        aria-hidden
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-24 text-center sm:py-32"
      >
        <motion.div variants={item}>
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              width={112}
              height={112}
              className="h-28 w-28 rounded-full border-2 border-border object-cover"
              priority
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-border bg-surface font-mono text-3xl text-accent">
              {initials}
            </div>
          )}
        </motion.div>

        <motion.div variants={item} className="space-y-3">
          <p className="font-mono text-sm text-accent">
            <span className="text-muted">$</span>{" "}
            <Typewriter text="whoami" speed={70} startDelay={500} />
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {name}
          </h1>
          <p className="text-gradient text-lg font-medium sm:text-xl">{title}</p>
          <p className="text-sm text-muted">{location}</p>
        </motion.div>

        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-3">
          <LinkButton href="#projects" variant="primary">
            {dict.hero.viewProjects}
          </LinkButton>
          <LinkButton href="#contact" variant="secondary">
            {dict.hero.contact}
          </LinkButton>
          {cvUrl && (
            <LinkButton
              href={cvUrl}
              variant="ghost"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("cv_download")}
            >
              {dict.hero.downloadCv}
            </LinkButton>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
