"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/actions/guard";
import { skillSchema } from "@/lib/validations";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

export async function createSkill(formData: FormData) {
  await requireAdmin();
  const parsed = skillSchema.parse({
    name: formData.get("name"),
    category: formData.get("category"),
  });
  const count = await prisma.skill.count();
  await prisma.skill.create({
    data: { name: parsed.name, category: parsed.category || null, order: count },
  });
  refresh();
}

export async function deleteSkill(id: string) {
  await requireAdmin();
  await prisma.skill.delete({ where: { id } });
  refresh();
}
