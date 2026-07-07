import { getProjects } from "@/lib/data";
import { ProjectsManager } from "@/components/admin/ProjectsManager";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-xl font-semibold text-foreground">Proyectos</h1>
      <p className="mb-8 text-sm text-muted">Se muestran en la sección &quot;Proyectos&quot; del sitio público.</p>
      <ProjectsManager projects={projects} />
    </div>
  );
}
