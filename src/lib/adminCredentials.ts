import { prisma } from "@/lib/prisma";

export const LOCKOUT_THRESHOLD = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

/**
 * Las credenciales viven en la base de datos (no en variables de entorno) para
 * poder cambiarlas/recuperarlas desde la propia app, sin redeploy. La primera
 * vez se siembran desde ADMIN_EMAIL/ADMIN_PASSWORD_HASH.
 */
export async function getOrBootstrapCredentials() {
  const existing = await prisma.adminCredentials.findUnique({ where: { id: 1 } });
  if (existing) return existing;

  const email = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!email || !passwordHash) return null;

  return prisma.adminCredentials.create({
    data: { id: 1, email, passwordHash },
  });
}
