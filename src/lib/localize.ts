import { cache } from "react";
import { getProfile, getExperiences, getEducations, getSkills, getProjects } from "@/lib/data";
import { translateAllToEnglish } from "@/lib/translate";
import type { Locale } from "@/lib/dictionary";

/**
 * Envuelto en cache() para que generateMetadata() y el componente de la
 * página compartan el mismo fetch + traducción dentro de un mismo request,
 * en vez de traducir todo por duplicado.
 */
export const getLocalizedHomeData = cache(async (locale: Locale) => {
  const [profile, experiences, educations, skills, projects] = await Promise.all([
    getProfile(),
    getExperiences(),
    getEducations(),
    getSkills(),
    getProjects(),
  ]);

  if (!profile || locale === "es") {
    return {
      profile,
      experiences,
      educations,
      skills,
      projects,
    };
  }

  const roleTexts = experiences.map((e) => e.role);
  const descriptionTexts = experiences.map((e) => e.description);
  const degreeTexts = educations.map((e) => e.degree);
  const projectTitleTexts = projects.map((p) => p.title);
  const projectDescriptionTexts = projects.map((p) => p.description);

  const allTexts = [
    profile.title,
    profile.summary,
    ...roleTexts,
    ...descriptionTexts,
    ...degreeTexts,
    ...projectTitleTexts,
    ...projectDescriptionTexts,
  ];

  const translated = await translateAllToEnglish(allTexts);

  let cursor = 0;
  const title = translated[cursor++];
  const summary = translated[cursor++];
  const roles = translated.slice(cursor, cursor + roleTexts.length);
  cursor += roleTexts.length;
  const descriptions = translated.slice(cursor, cursor + descriptionTexts.length);
  cursor += descriptionTexts.length;
  const degrees = translated.slice(cursor, cursor + degreeTexts.length);
  cursor += degreeTexts.length;
  const projectTitles = translated.slice(cursor, cursor + projectTitleTexts.length);
  cursor += projectTitleTexts.length;
  const projectDescriptions = translated.slice(cursor, cursor + projectDescriptionTexts.length);

  return {
    profile: {
      ...profile,
      title,
      summary,
      // El CV en inglés es un archivo aparte que subes tú; si no existe, se
      // ofrece el de español como respaldo en vez de no mostrar nada.
      cvUrl: profile.cvUrlEn || profile.cvUrl,
    },
    experiences: experiences.map((e, i) => ({ ...e, role: roles[i], description: descriptions[i] })),
    educations: educations.map((e, i) => ({ ...e, degree: degrees[i] })),
    skills,
    projects: projects.map((p, i) => ({ ...p, title: projectTitles[i], description: projectDescriptions[i] })),
  };
});
