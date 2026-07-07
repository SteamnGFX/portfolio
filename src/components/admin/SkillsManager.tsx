"use client";

import { useState } from "react";
import type { Skill } from "@prisma/client";
import { createSkill, deleteSkill } from "@/lib/actions/skills";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

export function SkillsManager({ skills }: { skills: Skill[] }) {
  const [pending, setPending] = useState(false);

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const key = skill.category ?? "Otros";
    acc[key] = acc[key] ? [...acc[key], skill] : [skill];
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <Card>
        <CardBody>
          <form
            action={async (formData) => {
              setPending(true);
              await createSkill(formData);
              setPending(false);
              (document.getElementById("skill-form") as HTMLFormElement)?.reset();
            }}
            id="skill-form"
            className="flex flex-wrap items-end gap-4"
          >
            <div className="flex-1 min-w-[160px]">
              <Label htmlFor="skill-name">Skill</Label>
              <Input id="skill-name" name="name" required placeholder="ej. Kubernetes" />
            </div>
            <div className="flex-1 min-w-[160px]">
              <Label htmlFor="skill-category">Categoría (opcional)</Label>
              <Input id="skill-category" name="category" placeholder="ej. DevOps" />
            </div>
            <Button type="submit" disabled={pending}>
              {pending ? "Agregando..." : "Agregar"}
            </Button>
          </form>
        </CardBody>
      </Card>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="mb-3 text-sm font-medium text-muted">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {items.map((skill) => (
              <form key={skill.id} action={deleteSkill.bind(null, skill.id)}>
                <button
                  type="submit"
                  className="group inline-flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-accent transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                  title="Eliminar"
                >
                  {skill.name}
                  <span className="text-muted group-hover:text-red-400">×</span>
                </button>
              </form>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
