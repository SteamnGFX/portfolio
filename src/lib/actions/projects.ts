"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/actions/guard";
import { projectSchema } from "@/lib/validations";
import { uploadMultiple, deleteBlobSafe } from "@/lib/blob";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

function parseProjectForm(formData: FormData) {
  return projectSchema.parse({
    title: formData.get("title"),
    description: formData.get("description"),
    techStack: String(formData.get("techStack") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    repoUrl: formData.get("repoUrl") || "",
    demoUrl: formData.get("demoUrl") || "",
    featured: formData.get("featured") === "on",
  });
}

export async function createProject(formData: FormData) {
  await requireAdmin();
  const parsed = parseProjectForm(formData);
  const images = await uploadMultiple(formData.getAll("images"), "projects");
  const count = await prisma.project.count();

  await prisma.project.create({
    data: {
      ...parsed,
      repoUrl: parsed.repoUrl || null,
      demoUrl: parsed.demoUrl || null,
      images,
      order: count,
    },
  });
  refresh();
}

export async function updateProject(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = parseProjectForm(formData);
  const current = await prisma.project.findUnique({ where: { id } });

  const keptImages = formData.getAll("existingImages").map(String);
  const newImages = await uploadMultiple(formData.getAll("images"), "projects");
  const removedImages = (current?.images ?? []).filter((url) => !keptImages.includes(url));

  await Promise.all(removedImages.map(deleteBlobSafe));

  await prisma.project.update({
    where: { id },
    data: {
      ...parsed,
      repoUrl: parsed.repoUrl || null,
      demoUrl: parsed.demoUrl || null,
      images: [...keptImages, ...newImages],
    },
  });
  refresh();
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const current = await prisma.project.findUnique({ where: { id } });
  await prisma.project.delete({ where: { id } });
  await Promise.all((current?.images ?? []).map(deleteBlobSafe));
  refresh();
}
