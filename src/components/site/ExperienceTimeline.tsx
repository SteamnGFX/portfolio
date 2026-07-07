"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Experience, Education } from "@prisma/client";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";

const MONTHS_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

// Usa los getters UTC (no toLocaleDateString) para que el resultado sea idéntico
// entre servidor y navegador sin importar su zona horaria — evita mismatches de
// hidratación por formateo de fecha dependiente del entorno.
function formatRange(start: Date | null, end: Date | null) {
  const fmt = (d: Date) => `${MONTHS_ES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  if (!start) return "";
  return `${fmt(start)} — ${end ? fmt(end) : "Actualidad"}`;
}

const listItem = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

export function ExperienceTimeline({
  experiences,
  educations,
}: {
  experiences: Experience[];
  educations: Education[];
}) {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <SectionHeading eyebrow="02" title="Experiencia" />
      </Reveal>
      <ol className="space-y-8 border-l border-border pl-6">
        {experiences.map((exp) => (
          <motion.li
            key={exp.id}
            className="relative"
            variants={listItem}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
            <p className="font-mono text-xs text-muted">
              {formatRange(exp.startDate, exp.endDate)}
            </p>
            <div className="mt-1 flex items-start gap-3">
              {exp.logoUrl && (
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-white/5 p-1.5">
                  <Image
                    src={exp.logoUrl}
                    alt={exp.company}
                    width={28}
                    height={28}
                    className="h-full w-full object-contain"
                  />
                </span>
              )}
              <div>
                <h3 className="font-semibold text-foreground">
                  {exp.role} <span className="text-muted">· {exp.company}</span>
                </h3>
                {exp.location && <p className="text-xs text-muted">{exp.location}</p>}
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{exp.description}</p>
              </div>
            </div>
          </motion.li>
        ))}
      </ol>

      {educations.length > 0 && (
        <div className="mt-16">
          <Reveal>
            <h3 className="mb-6 font-mono text-sm text-accent">Educación</h3>
          </Reveal>
          <ol className="space-y-6 border-l border-border pl-6">
            {educations.map((edu) => (
              <motion.li
                key={edu.id}
                className="relative"
                variants={listItem}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
              >
                <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent-secondary" />
                {(edu.startDate || edu.endDate) && (
                  <p className="font-mono text-xs text-muted">
                    {formatRange(edu.startDate, edu.endDate)}
                  </p>
                )}
                <h4 className="mt-1 font-semibold text-foreground">{edu.degree}</h4>
                <p className="text-sm text-muted">{edu.institution}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
