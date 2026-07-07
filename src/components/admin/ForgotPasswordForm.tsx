"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/lib/actions/security";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, undefined);

  if (state?.message) {
    return (
      <p className="text-sm text-foreground/90" role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="email">Correo</Label>
        <Input id="email" name="email" type="email" required autoFocus />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Enviando..." : "Enviar enlace de recuperación"}
      </Button>
    </form>
  );
}
