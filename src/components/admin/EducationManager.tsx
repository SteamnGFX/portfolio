"use client";

import { useState } from "react";
import type { Education } from "@prisma/client";
import { createEducation, updateEducation, deleteEducation } from "@/lib/actions/experience";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

function toDateInput(date: Date | null | undefined) {
  return date ? new Date(date).toISOString().slice(0, 10) : "";
}

function EducationFields({ edu }: { edu?: Education }) {
  return (
    <>
      <div>
        <Label>Institución</Label>
        <Input name="institution" defaultValue={edu?.institution} required />
      </div>
      <div>
        <Label>Título/Grado</Label>
        <Input name="degree" defaultValue={edu?.degree} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Inicio (opcional)</Label>
          <Input name="startDate" type="date" defaultValue={toDateInput(edu?.startDate)} />
        </div>
        <div>
          <Label>Fin (opcional)</Label>
          <Input name="endDate" type="date" defaultValue={toDateInput(edu?.endDate)} />
        </div>
      </div>
    </>
  );
}

function EducationRow({ edu }: { edu: Education }) {
  const [editing, setEditing] = useState(false);
  const boundUpdate = updateEducation.bind(null, edu.id);

  if (editing) {
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
            <EducationFields edu={edu} />
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
        <div>
          <p className="font-semibold text-foreground">{edu.degree}</p>
          <p className="text-xs text-muted">{edu.institution}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
            Editar
          </Button>
          <form action={deleteEducation.bind(null, edu.id)}>
            <Button type="submit" size="sm" variant="danger">
              Eliminar
            </Button>
          </form>
        </div>
      </CardBody>
    </Card>
  );
}

export function EducationManager({ educations }: { educations: Education[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-4">
      {educations.map((edu) => (
        <EducationRow key={edu.id} edu={edu} />
      ))}

      {adding ? (
        <Card>
          <CardBody className="space-y-4">
            <form
              action={async (formData) => {
                await createEducation(formData);
                setAdding(false);
              }}
              className="space-y-4"
            >
              <EducationFields />
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
          + Agregar educación
        </Button>
      )}
    </div>
  );
}
