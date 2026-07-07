import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Requerido"),
  title: z.string().min(1, "Requerido"),
  location: z.string().min(1, "Requerido"),
  summary: z.string().min(1, "Requerido"),
  email: z.string().email("Correo inválido"),
  linkedinUrl: z.string().url("URL inválida"),
  githubUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

export const experienceSchema = z.object({
  company: z.string().min(1, "Requerido"),
  role: z.string().min(1, "Requerido"),
  location: z.string().optional().or(z.literal("")),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  description: z.string().min(1, "Requerido"),
});

export const educationSchema = z.object({
  institution: z.string().min(1, "Requerido"),
  degree: z.string().min(1, "Requerido"),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Requerido"),
  category: z.string().optional().or(z.literal("")),
});

export const newPasswordSchema = z
  .string()
  .min(8, "Debe tener al menos 8 caracteres");

export const projectSchema = z.object({
  title: z.string().min(1, "Requerido"),
  description: z.string().min(1, "Requerido"),
  techStack: z.array(z.string()).default([]),
  repoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  demoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  featured: z.boolean().default(false),
});
