import type { Skill } from "@prisma/client";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/site/Reveal";

export function SkillsGrid({ skills }: { skills: Skill[] }) {
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const key = skill.category ?? "Otros";
    acc[key] = acc[key] ? [...acc[key], skill] : [skill];
    return acc;
  }, {});

  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <SectionHeading eyebrow="03" title="Skills" />
      </Reveal>
      <div className="grid gap-8 sm:grid-cols-2">
        {Object.entries(grouped).map(([category, items], i) => (
          <Reveal key={category} delay={i * 0.1}>
            <h3 className="mb-3 text-sm font-medium text-muted">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <Badge key={skill.id}>{skill.name}</Badge>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
