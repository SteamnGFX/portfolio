export const dictionaries = {
  es: {
    nav: {
      about: "Acerca de",
      experience: "Experiencia",
      skills: "Skills",
      projects: "Proyectos",
      contact: "Contacto",
    },
    hero: {
      viewProjects: "Ver proyectos",
      contact: "Contactar",
      downloadCv: "Descargar CV",
    },
    sections: {
      about: "Acerca de",
      experience: "Experiencia",
      education: "Educación",
      skills: "Skills",
      projects: "Proyectos",
      contact: "Contacto",
    },
    experience: {
      present: "Actualidad",
    },
    projects: {
      repo: "Repositorio",
      demo: "Demo",
    },
    contact: {
      prompt: "¿Tienes un proyecto en mente o quieres platicar sobre alguna oportunidad? Escríbeme.",
    },
    footer: {
      builtWith: "Construido con Next.js, Tailwind CSS y Prisma",
    },
  },
  en: {
    nav: {
      about: "About",
      experience: "Experience",
      skills: "Skills",
      projects: "Projects",
      contact: "Contact",
    },
    hero: {
      viewProjects: "View projects",
      contact: "Contact me",
      downloadCv: "Download CV",
    },
    sections: {
      about: "About",
      experience: "Experience",
      education: "Education",
      skills: "Skills",
      projects: "Projects",
      contact: "Contact",
    },
    experience: {
      present: "Present",
    },
    projects: {
      repo: "Repository",
      demo: "Demo",
    },
    contact: {
      prompt: "Have a project in mind, or want to talk about an opportunity? Reach out.",
    },
    footer: {
      builtWith: "Built with Next.js, Tailwind CSS, and Prisma",
    },
  },
} as const;

export type Locale = keyof typeof dictionaries;
export type Dictionary = (typeof dictionaries)[Locale];

export const LOCALES: Locale[] = ["es", "en"];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
