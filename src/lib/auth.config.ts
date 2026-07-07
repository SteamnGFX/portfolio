import type { NextAuthConfig } from "next-auth";

// Config "ligera", segura para el Edge Runtime del middleware: sin Prisma,
// bcrypt ni providers pesados — solo lo necesario para validar la sesión
// (JWT) ya existente. La lógica real de login vive en auth.ts (Node.js).
//
// Es una función (no un objeto compartido) para que cada NextAuth(...) —
// el del middleware y el completo en auth.ts — reciba su propia copia y no
// se pisen entre sí si NextAuth muta el config que recibe.
export function getAuthConfig(): NextAuthConfig {
  return {
    session: { strategy: "jwt" },
    trustHost: true,
    pages: {
      signIn: "/admin/login",
    },
    providers: [],
  };
}
