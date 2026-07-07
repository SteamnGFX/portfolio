"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { LOCKOUT_THRESHOLD } from "@/lib/adminCredentials";

const ERROR_MESSAGES: Record<string, string> = {
  account_locked: `Demasiados intentos fallidos (${LOCKOUT_THRESHOLD}). Tu cuenta se bloqueó 15 minutos por seguridad.`,
  not_configured: "El panel de administración no está configurado todavía.",
  invalid_credentials: "Correo o contraseña incorrectos.",
};

export async function authenticate(_prevState: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const code = (error as AuthError & { code?: string }).code;
      return ERROR_MESSAGES[code ?? ""] ?? "Correo o contraseña incorrectos.";
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
}
