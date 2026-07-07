"use client";

import { useActionState } from "react";
import type { Profile } from "@prisma/client";
import { updateProfile } from "@/lib/actions/profile";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [error, formAction, isPending] = useActionState(updateProfile, undefined);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" name="name" defaultValue={profile?.name} required />
        </div>
        <div>
          <Label htmlFor="location">Ubicación</Label>
          <Input id="location" name="location" defaultValue={profile?.location} required />
        </div>
      </div>

      <div>
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" defaultValue={profile?.title} required />
      </div>

      <div>
        <Label htmlFor="summary">Acerca de</Label>
        <Textarea id="summary" name="summary" rows={10} defaultValue={profile?.summary} required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={profile?.email} required />
        </div>
        <div>
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input id="linkedinUrl" name="linkedinUrl" defaultValue={profile?.linkedinUrl} required />
        </div>
      </div>

      <div>
        <Label htmlFor="githubUrl">GitHub URL (opcional)</Label>
        <Input id="githubUrl" name="githubUrl" defaultValue={profile?.githubUrl ?? ""} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="avatar">Foto de perfil</Label>
          <Input id="avatar" name="avatar" type="file" accept="image/*" />
          {profile?.avatarUrl && <p className="mt-1 text-xs text-muted">Ya tienes una foto cargada.</p>}
        </div>
        <div>
          <Label htmlFor="cv">CV (PDF)</Label>
          <Input id="cv" name="cv" type="file" accept="application/pdf" />
          {profile?.cvUrl && (
            <p className="mt-1 text-xs text-muted">
              <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                Ver CV actual
              </a>
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
