import { getExperiences, getEducations } from "@/lib/data";
import { ExperienceManager } from "@/components/admin/ExperienceManager";
import { EducationManager } from "@/components/admin/EducationManager";

export default async function AdminExperiencePage() {
  const [experiences, educations] = await Promise.all([getExperiences(), getEducations()]);

  return (
    <div className="max-w-2xl space-y-12">
      <div>
        <h1 className="mb-1 text-xl font-semibold text-foreground">Experiencia</h1>
        <p className="mb-6 text-sm text-muted">Historial laboral mostrado en la línea de tiempo.</p>
        <ExperienceManager experiences={experiences} />
      </div>

      <div>
        <h2 className="mb-1 text-xl font-semibold text-foreground">Educación</h2>
        <p className="mb-6 text-sm text-muted">Estudios mostrados debajo de la experiencia.</p>
        <EducationManager educations={educations} />
      </div>
    </div>
  );
}
