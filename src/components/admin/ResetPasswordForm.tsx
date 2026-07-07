"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPassword } from "@/lib/actions/security";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(resetPassword, undefined);

  if (state?.success) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-foreground/90" role="status">
          Tu contraseña se actualizó correctamente.
        </p>
        <Link href="/admin/login">
          <Button className="w-full">Ir a iniciar sesión</Button>
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <Label htmlFor="newPassword">Nueva contraseña</Label>
        <PasswordInput id="newPassword" name="newPassword" required autoFocus autoComplete="new-password" />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <PasswordInput id="confirmPassword" name="confirmPassword" required autoComplete="new-password" />
      </div>
      {state?.error && (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Guardando..." : "Restablecer contraseña"}
      </Button>
    </form>
  );
}
