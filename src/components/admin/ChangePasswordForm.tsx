"use client";

import { useActionState } from "react";
import { changePassword } from "@/lib/actions/security";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePassword, undefined);
  const error = typeof state === "string" ? state : undefined;
  const success = typeof state === "object" && state?.success;

  return (
    <form action={formAction} className="max-w-sm space-y-4">
      <div>
        <Label htmlFor="currentPassword">Contraseña actual</Label>
        <PasswordInput id="currentPassword" name="currentPassword" required autoComplete="current-password" />
      </div>
      <div>
        <Label htmlFor="newPassword">Nueva contraseña</Label>
        <PasswordInput id="newPassword" name="newPassword" required autoComplete="new-password" />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
        <PasswordInput id="confirmPassword" name="confirmPassword" required autoComplete="new-password" />
      </div>
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-accent-secondary" role="status">
          Contraseña actualizada correctamente.
        </p>
      )}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Cambiar contraseña"}
      </Button>
    </form>
  );
}
