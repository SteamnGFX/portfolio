import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOrBootstrapCredentials, LOCKOUT_THRESHOLD, LOCKOUT_DURATION_MS } from "@/lib/adminCredentials";
import { getAuthConfig } from "@/lib/auth.config";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials";
}

class AccountLockedError extends CredentialsSignin {
  code = "account_locked";
}

class NotConfiguredError extends CredentialsSignin {
  code = "not_configured";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...getAuthConfig(),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) throw new InvalidCredentialsError();
        const { email, password } = parsed.data;

        const creds = await getOrBootstrapCredentials();
        if (!creds) throw new NotConfiguredError();

        if (creds.lockedUntil && creds.lockedUntil.getTime() > Date.now()) {
          throw new AccountLockedError();
        }

        const emailMatches = email.toLowerCase() === creds.email.toLowerCase();
        const passwordMatches = await bcrypt.compare(password, creds.passwordHash);

        if (!emailMatches || !passwordMatches) {
          const attempts = creds.failedAttempts + 1;
          const lockingOut = attempts >= LOCKOUT_THRESHOLD;
          await prisma.adminCredentials.update({
            where: { id: 1 },
            data: {
              failedAttempts: lockingOut ? 0 : attempts,
              lockedUntil: lockingOut ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null,
            },
          });
          if (lockingOut) throw new AccountLockedError();
          throw new InvalidCredentialsError();
        }

        await prisma.adminCredentials.update({
          where: { id: 1 },
          data: { failedAttempts: 0, lockedUntil: null },
        });

        return { id: "admin", email: creds.email, name: "Admin" };
      },
    }),
  ],
});
