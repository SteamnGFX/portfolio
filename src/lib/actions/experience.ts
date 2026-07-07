"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/actions/guard";
import { experienceSchema, educationSchema } from "@/lib/validations";
import { uploadIfPresent, deleteBlobSafe } from "@/lib/blob";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function createExperience(formData: FormData) {
  await requireAdmin();
  const parsed = experienceSchema.parse({
    company: formData.get("company"),
    role: formData.get("role"),
    location: formData.get("location"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || null,
    description: formData.get("description"),
  });
  const logoUrl = await uploadIfPresent(formData.get("logo"), "logos");
  const count = await prisma.experience.count();
  await prisma.experience.create({
    data: { ...parsed, location: parsed.location || null, logoUrl: logoUrl ?? null, order: count },
  });
  refresh();
}

export async function updateExperience(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = experienceSchema.parse({
    company: formData.get("company"),
    role: formData.get("role"),
    location: formData.get("location"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || null,
    description: formData.get("description"),
  });
  const current = await prisma.experience.findUnique({ where: { id } });
  const logoUrl = await uploadIfPresent(formData.get("logo"), "logos");
  if (logoUrl && current?.logoUrl) await deleteBlobSafe(current.logoUrl);

  await prisma.experience.update({
    where: { id },
    data: {
      ...parsed,
      location: parsed.location || null,
      ...(logoUrl && { logoUrl }),
    },
  });
  refresh();
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  const current = await prisma.experience.findUnique({ where: { id } });
  await prisma.experience.delete({ where: { id } });
  await deleteBlobSafe(current?.logoUrl);
  refresh();
}

export async function createEducation(formData: FormData) {
  await requireAdmin();
  const parsed = educationSchema.parse({
    institution: formData.get("institution"),
    degree: formData.get("degree"),
    startDate: formData.get("startDate") || null,
    endDate: formData.get("endDate") || null,
  });
  const count = await prisma.education.count();
  await prisma.education.create({ data: { ...parsed, order: count } });
  refresh();
}

export async function updateEducation(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = educationSchema.parse({
    institution: formData.get("institution"),
    degree: formData.get("degree"),
    startDate: formData.get("startDate") || null,
    endDate: formData.get("endDate") || null,
  });
  await prisma.education.update({ where: { id }, data: parsed });
  refresh();
}

export async function deleteEducation(id: string) {
  await requireAdmin();
  await prisma.education.delete({ where: { id } });
  refresh();
}
