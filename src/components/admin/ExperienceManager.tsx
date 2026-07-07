"use client";

import { useState } from "react";
import Image from "next/image";
import type { Experience } from "@prisma/client";
import { createExperience, updateExperience, deleteExperience } from "@/lib/actions/experience";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

function toDateInput(date: Date | null) {
  return date ? new Date(date).toISOString().slice(0, 10) : "";
}

function ExperienceFields({ exp }: { exp?: Experience }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Empresa</Label>
          <Input name="company" defaultValue={exp?.company} required />
        </div>
        <div>
          <Label>Puesto</Label>
          <Input name="role" defaultValue={exp?.role} required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label>Ubicación</Label>
          <Input name="location" defaultValue={exp?.location ?? ""} />
        </div>
        <div>
          <Label>Inicio</Label>
          <Input name="startDate" type="date" defaultValue={toDateInput(exp?.startDate ?? null)} required />
        </div>
        <div>
          <Label>Fin (vacío = actual)</Label>
          <Input name="endDate" type="date" defaultValue={toDateInput(exp?.endDate ?? null)} />
        </div>
      </div>
      <div>
        <Label>Descripción</Label>
        <Textarea name="description" rows={4} defaultValue={exp?.description} required />
      </div>
      <div>
        <Label>Logo de la empresa (opcional)</Label>
        <Input name="logo" type="file" accept="image/*" />
        {exp?.logoUrl && (
          <div className="mt-2 flex items-center gap-2">
            <Image
              src={exp.logoUrl}
              alt={exp.company}
              width={32}
              height={32}
              className="h-8 w-8 rounded-md border border-border bg-white/5 object-contain p-1"
            />
            <p className="text-xs text-muted">Logo actual — sube uno nuevo para reemplazarlo.</p>
          </div>
        )}
      </div>
    </>
  );
}

function ExperienceRow({ exp }: { exp: Experience }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    const boundUpdate = updateExperience.bind(null, exp.id);
    return (
      <Card>
        <CardBody className="space-y-4">
          <form
            action={async (formData) => {
              await boundUpdate(formData);
              setEditing(false);
            }}
            className="space-y-4"
          >
            <ExperienceFields exp={exp} />
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Guardar
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {exp.logoUrl && (
            <Image
              src={exp.logoUrl}
              alt={exp.company}
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-md border border-border bg-white/5 object-contain p-1"
            />
          )}
          <div>
            <p className="font-semibold text-foreground">
              {exp.role} <span className="text-muted">· {exp.company}</span>
            </p>
            <p className="text-xs text-muted">
              {toDateInput(exp.startDate)} — {exp.endDate ? toDateInput(exp.endDate) : "Actualidad"}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
            Editar
          </Button>
          <form action={deleteExperience.bind(null, exp.id)}>
            <Button type="submit" size="sm" variant="danger">
              Eliminar
            </Button>
          </form>
        </div>
      </CardBody>
    </Card>
  );
}

export function ExperienceManager({ experiences }: { experiences: Experience[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-4">
      {experiences.map((exp) => (
        <ExperienceRow key={exp.id} exp={exp} />
      ))}

      {adding ? (
        <Card>
          <CardBody className="space-y-4">
            <form
              action={async (formData) => {
                await createExperience(formData);
                setAdding(false);
              }}
              className="space-y-4"
            >
              <ExperienceFields />
              <div className="flex gap-2">
                <Button type="submit" size="sm">
                  Agregar
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => setAdding(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setAdding(true)}>
          + Agregar experiencia
        </Button>
      )}
    </div>
  );
}
