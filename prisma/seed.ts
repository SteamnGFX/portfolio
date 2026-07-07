import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Angel Roberto Martínez Castro",
      title: "Ingeniero de Software en CoMinVi | Java Spring Boot • Angular • DevOps",
      location: "León, Guanajuato, México",
      summary:
        "Ingeniero de Software con más de 1 año de experiencia especializándome en arquitecturas empresariales y modernización de sistemas para la industria minera. Desarrollo y mantengo aplicaciones full-stack con Java Spring Boot, Angular 17 y bases de datos relacionales y NoSQL, entregando soluciones escalables que soportan operaciones críticas de negocio.\n\nLidero iniciativas de transformación digital incluyendo migraciones cloud a Google Cloud Platform, modernización de aplicaciones Angular legacy (v8 → v17), e implementación de PWAs con capacidades offline para entornos industriales. Mi trabajo abarca sistemas complejos de gestión de inventarios, procesos financieros y validación en tiempo real para operaciones mineras.\n\nCon experiencia sólida en DevOps, implemento pipelines CI/CD con Jenkins, containerización con Docker/Harbor Registry, y sistemas de monitoreo utilizando Grafana y Prometheus para observabilidad completa de microservicios. Manejo integraciones complejas entre SQL Server, MongoDB y Firebird, optimizando queries, stored procedures y pipelines de agregación para máximo rendimiento.\n\nMi stack técnico incluye Java Spring Boot, Python, C#, Angular 17/TypeScript, Flutter, y amplia experiencia en arquitecturas de microservicios. Trabajo con metodologías ágiles (SCRUM), enfocándome en automatización, seguridad y excelencia operacional.",
      email: "angelroberto7777@gmail.com",
      linkedinUrl: "https://www.linkedin.com/in/angelmartinezcastro",
      githubUrl: null,
      cvUrl: null,
    },
  });

  const experiences = [
    {
      company: "CoMinVi",
      role: "Ingeniero de Software",
      location: "León, Guanajuato, México",
      startDate: new Date("2025-01-01"),
      endDate: null,
      description:
        "Desarrollo y mantenimiento de aplicaciones full-stack (Java Spring Boot, Angular 17) para operaciones mineras. Migraciones cloud a GCP, modernización de aplicaciones Angular legacy, PWAs offline, pipelines CI/CD con Jenkins, containerización con Docker/Harbor y observabilidad con Grafana/Prometheus.",
      order: 0,
    },
  ];

  for (const exp of experiences) {
    const existing = await prisma.experience.findFirst({ where: { company: exp.company, role: exp.role } });
    if (!existing) {
      await prisma.experience.create({ data: exp });
    }
  }

  const educations = [
    {
      institution: "Universidad Tecnológica de León",
      degree: "Ingeniería en Desarrollo de Software",
      startDate: null,
      endDate: null,
      order: 0,
    },
  ];

  for (const edu of educations) {
    const existing = await prisma.education.findFirst({ where: { institution: edu.institution } });
    if (!existing) {
      await prisma.education.create({ data: edu });
    }
  }

  const skills: { name: string; category: string; order: number }[] = [
    { name: "Java", category: "Backend", order: 0 },
    { name: "Spring Boot", category: "Backend", order: 1 },
    { name: "Python", category: "Backend", order: 2 },
    { name: "C#", category: "Backend", order: 3 },
    { name: "Angular 17", category: "Frontend", order: 4 },
    { name: "TypeScript", category: "Frontend", order: 5 },
    { name: "JavaScript", category: "Frontend", order: 6 },
    { name: "Flutter", category: "Frontend", order: 7 },
    { name: "Docker", category: "DevOps", order: 8 },
    { name: "Jenkins", category: "DevOps", order: 9 },
    { name: "Grafana", category: "DevOps", order: 10 },
    { name: "Prometheus", category: "DevOps", order: 11 },
    { name: "Google Cloud Platform", category: "DevOps", order: 12 },
    { name: "SQL Server", category: "Datos", order: 13 },
    { name: "MongoDB", category: "Datos", order: 14 },
    { name: "Firebird", category: "Datos", order: 15 },
  ];

  for (const skill of skills) {
    const existing = await prisma.skill.findFirst({ where: { name: skill.name } });
    if (!existing) {
      await prisma.skill.create({ data: skill });
    }
  }

  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.create({
      data: {
        title: "Mi primer proyecto",
        description:
          "Edita este proyecto (o bórralo) desde /admin/projects y agrega los tuyos: descripción, stack usado, imagen, y links a repo/demo.",
        techStack: ["Java", "Spring Boot", "Angular"],
        featured: true,
        order: 0,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
