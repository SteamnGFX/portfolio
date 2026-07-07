"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/actions/guard";
import { profileSchema } from "@/lib/validations";
import { uploadIfPresent, deleteBlobSafe } from "@/lib/blob";

export async function updateProfile(_prevState: string | undefined, formData: FormData) {
  await requireAdmin();

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    title: formData.get("title"),
    location: formData.get("location"),
    summary: formData.get("summary"),
    email: formData.get("email"),
    linkedinUrl: formData.get("linkedinUrl"),
    githubUrl: formData.get("githubUrl"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Datos inválidos";
  }

  const current = await prisma.profile.findUnique({ where: { id: 1 } });

  const newAvatarUrl = await uploadIfPresent(formData.get("avatar"), "avatar");
  const newCvUrl = await uploadIfPresent(formData.get("cv"), "cv");
  const newCvUrlEn = await uploadIfPresent(formData.get("cvEn"), "cv-en");

  if (newAvatarUrl && current?.avatarUrl) await deleteBlobSafe(current.avatarUrl);
  if (newCvUrl && current?.cvUrl) await deleteBlobSafe(current.cvUrl);
  if (newCvUrlEn && current?.cvUrlEn) await deleteBlobSafe(current.cvUrlEn);

  await prisma.profile.upsert({
    where: { id: 1 },
    update: {
      ...parsed.data,
      githubUrl: parsed.data.githubUrl || null,
      ...(newAvatarUrl && { avatarUrl: newAvatarUrl }),
      ...(newCvUrl && { cvUrl: newCvUrl }),
      ...(newCvUrlEn && { cvUrlEn: newCvUrlEn }),
    },
    create: {
      id: 1,
      ...parsed.data,
      githubUrl: parsed.data.githubUrl || null,
      avatarUrl: newAvatarUrl ?? null,
      cvUrl: newCvUrl ?? null,
      cvUrlEn: newCvUrlEn ?? null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/profile");
  return undefined;
}
