import { getSkills } from "@/lib/data";
import { SkillsManager } from "@/components/admin/SkillsManager";

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-xl font-semibold text-foreground">Skills</h1>
      <p className="mb-8 text-sm text-muted">Agrupa por categoría (ej. Backend, Frontend, DevOps). Click en un tag para eliminarlo.</p>
      <SkillsManager skills={skills} />
    </div>
  );
}
