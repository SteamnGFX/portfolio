"use server";

import { cookies } from "next/headers";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { LOCKOUT_THRESHOLD } from "@/lib/adminCredentials";

const SESSION_COOKIE_NAMES = ["authjs.session-token", "__Secure-authjs.session-token"];

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
  try {
    await signOut({ redirect: false });
  } catch {
    // sigue abajo: borramos la cookie de sesión manualmente de todas formas
  }

  // signOut() de esta versión de next-auth no limpia la cookie cuando se
  // combina con un redirect en la misma respuesta de un Server Action, así
  // que la borramos explícitamente. La navegación a /admin/login la hace el
  // cliente después (ver LogoutButton), separada de esta mutación.
  const cookieStore = await cookies();
  for (const name of SESSION_COOKIE_NAMES) {
    cookieStore.delete(name);
  }
}
