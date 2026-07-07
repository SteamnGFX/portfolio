import Link from "next/link";
import { getProfile, getExperiences, getSkills, getProjects, getAnalyticsSummary } from "@/lib/data";
import { Card, CardBody } from "@/components/ui/Card";
import { DailyVisitsChart } from "@/components/admin/DailyVisitsChart";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [profile, experiences, skills, projects, analytics] = await Promise.all([
    getProfile(),
    getExperiences(),
    getSkills(),
    getProjects(),
    getAnalyticsSummary(),
  ]);

  const contentCards = [
    { href: "/admin/profile", label: "Perfil", value: profile ? "Configurado" : "Sin configurar" },
    { href: "/admin/experience", label: "Experiencia", value: `${experiences.length} registros` },
    { href: "/admin/skills", label: "Skills", value: `${skills.length} registros` },
    { href: "/admin/projects", label: "Proyectos", value: `${projects.length} registros` },
  ];

  const analyticsCards = [
    { label: "Visitas totales", value: analytics.totalViews },
    { label: "Visitas (7 días)", value: analytics.views7d },
    { label: "Clics en LinkedIn", value: analytics.linkedinClicks },
    { label: "CV descargado", value: analytics.cvDownloads },
  ];

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-foreground">Dashboard</h1>
      <p className="mb-8 text-sm text-muted">
        Edita el contenido de tu portafolio. Los cambios se publican de inmediato, sin necesidad de redeploy.
      </p>

      <h2 className="mb-3 font-mono text-sm text-accent">Analítica</h2>
      <div className="mb-4 grid gap-4 sm:grid-cols-4">
        {analyticsCards.map((card) => (
          <Card key={card.label}>
            <CardBody>
              <p className="text-sm text-muted">{card.label}</p>
              <p className="mt-1 font-mono text-2xl text-foreground">{card.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>
      <Card className="mb-10">
        <CardBody>
          <div className="mb-3 flex items-baseline justify-between">
            <p className="text-sm text-muted">Visitas por día (últimos 14 días)</p>
            <p className="font-mono text-xs text-muted">
              {analytics.views30d} en 30 días · {analytics.githubClicks} clics GitHub · {analytics.emailClicks}{" "}
              clics email
            </p>
          </div>
          <DailyVisitsChart data={analytics.daily} />
        </CardBody>
      </Card>

      <h2 className="mb-3 font-mono text-sm text-accent">Contenido</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {contentCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="transition-colors hover:bg-surface-hover">
              <CardBody>
                <p className="text-sm text-muted">{card.label}</p>
                <p className="mt-1 font-mono text-lg text-foreground">{card.value}</p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
