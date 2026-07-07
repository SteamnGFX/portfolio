"use client";

import Link from "next/link";
import { useActionState } from "react";
import { authenticate } from "@/lib/actions/auth";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="email">Correo</Label>
        <Input id="email" name="email" type="email" required autoFocus autoComplete="username" />
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <Label htmlFor="password">Contraseña</Label>
          <Link href="/admin/forgot-password" className="mb-1.5 text-xs text-accent hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <PasswordInput id="password" name="password" required autoComplete="current-password" />
      </div>
      {errorMessage && (
        <p className="text-sm text-red-400" role="alert">
          {errorMessage}
        </p>
      )}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}
