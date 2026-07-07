"use server";

import { randomBytes, createHash } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/actions/guard";
import { getOrBootstrapCredentials } from "@/lib/adminCredentials";
import { newPasswordSchema } from "@/lib/validations";
import { sendPasswordResetEmail } from "@/lib/email";
import { getSiteUrl } from "@/lib/site";

const RESET_TOKEN_TTL_MS = 5 * 60 * 1000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

type ChangePasswordState = string | { readonly success: true } | undefined;

export async function changePassword(_prevState: ChangePasswordState, formData: FormData) {
  await requireAdmin();

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword !== confirmPassword) return "Las contraseñas nuevas no coinciden.";

  const parsed = newPasswordSchema.safeParse(newPassword);
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "Contraseña inválida.";

  const creds = await getOrBootstrapCredentials();
  if (!creds) return "No se encontraron credenciales configuradas.";

  const valid = await bcrypt.compare(currentPassword, creds.passwordHash);
  if (!valid) return "La contraseña actual no es correcta.";

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.adminCredentials.update({
    where: { id: 1 },
    data: { passwordHash, failedAttempts: 0, lockedUntil: null },
  });

  return { success: true } as const;
}

type RequestResetState = { readonly message: string } | undefined;

export async function requestPasswordReset(_prevState: RequestResetState, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const genericMessage = "Si ese correo coincide con el del administrador, te enviamos un enlace para restablecer tu contraseña.";

  const creds = await getOrBootstrapCredentials();
  if (!creds || email.toLowerCase() !== creds.email.toLowerCase()) {
    return { message: genericMessage } as const;
  }

  await prisma.passwordResetToken.deleteMany({ where: { expiresAt: { lt: new Date() } } });

  const token = randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  const resetUrl = `${getSiteUrl()}/admin/reset-password?token=${token}`;

  try {
    await sendPasswordResetEmail(creds.email, resetUrl);
  } catch {
    return { message: "No se pudo enviar el correo. Intenta de nuevo en unos minutos." } as const;
  }

  return { message: genericMessage } as const;
}

type ResetPasswordState = { readonly error: string } | { readonly success: true } | undefined;

export async function resetPassword(_prevState: ResetPasswordState, formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token) return { error: "Token inválido." } as const;
  if (newPassword !== confirmPassword) return { error: "Las contraseñas no coinciden." } as const;

  const parsed = newPasswordSchema.safeParse(newPassword);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Contraseña inválida." } as const;

  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(token) } });

  if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) {
    return { error: "El enlace ya venció o no es válido. Solicita uno nuevo." } as const;
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.adminCredentials.update({
      where: { id: 1 },
      data: { passwordHash, failedAttempts: 0, lockedUntil: null },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return { success: true } as const;
}
