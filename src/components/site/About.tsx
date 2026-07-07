import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import type { Dictionary } from "@/lib/dictionary";

export function About({ summary, dict }: { summary: string; dict: Dictionary }) {
  const paragraphs = summary.split("\n").filter(Boolean);

  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <SectionHeading eyebrow="01" title={dict.sections.about} />
      </Reveal>
      <div className="max-w-3xl space-y-4 text-[15px] leading-relaxed text-muted">
        {paragraphs.map((p, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <p>{p}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
