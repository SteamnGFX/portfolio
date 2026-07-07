"use client";

import { useState } from "react";
import Image from "next/image";
import type { Project } from "@prisma/client";
import { createProject, updateProject, deleteProject } from "@/lib/actions/projects";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

function ProjectFields({ project }: { project?: Project }) {
  const [keptImages, setKeptImages] = useState<string[]>(project?.images ?? []);

  return (
    <>
      <div>
        <Label>Título</Label>
        <Input name="title" defaultValue={project?.title} required />
      </div>
      <div>
        <Label>Descripción</Label>
        <Textarea name="description" rows={3} defaultValue={project?.description} required />
      </div>
      <div>
        <Label>Stack (separado por comas)</Label>
        <Input name="techStack" defaultValue={project?.techStack.join(", ")} placeholder="Java, Spring Boot, Angular" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Repositorio (opcional)</Label>
          <Input name="repoUrl" defaultValue={project?.repoUrl ?? ""} placeholder="https://github.com/..." />
        </div>
        <div>
          <Label>Demo (opcional)</Label>
          <Input name="demoUrl" defaultValue={project?.demoUrl ?? ""} placeholder="https://..." />
        </div>
      </div>

      <div>
        <Label>Imágenes (puedes elegir varias — se muestran como carrusel)</Label>

        {keptImages.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {keptImages.map((url) => (
              <div key={url} className="group relative h-16 w-16">
                <input type="hidden" name="existingImages" value={url} />
                <Image
                  src={url}
                  alt=""
                  fill
                  className="rounded-md border border-border object-cover"
                />
                <button
                  type="button"
                  onClick={() => setKeptImages((prev) => prev.filter((u) => u !== url))}
                  aria-label="Quitar imagen"
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <Input name="images" type="file" accept="image/*" multiple />
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground/90">
        <input type="checkbox" name="featured" defaultChecked={project?.featured} className="h-4 w-4 rounded border-border accent-cyan-400" />
        Destacado
      </label>
    </>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const [editing, setEditing] = useState(false);
  const boundUpdate = updateProject.bind(null, project.id);

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
            <ProjectFields project={project} />
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
        <div className="flex gap-4">
          {project.images[0] && (
            <Image
              src={project.images[0]}
              alt={project.title}
              width={64}
              height={64}
              className="h-16 w-16 rounded-md border border-border object-cover"
            />
          )}
          <div>
            <p className="font-semibold text-foreground">
              {project.title} {project.featured && <span className="text-xs text-accent">★ destacado</span>}
              {project.images.length > 1 && (
                <span className="ml-2 text-xs text-muted">{project.images.length} imágenes</span>
              )}
            </p>
            <p className="mt-1 max-w-md text-sm text-muted">{project.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
            Editar
          </Button>
          <form action={deleteProject.bind(null, project.id)}>
            <Button type="submit" size="sm" variant="danger">
              Eliminar
            </Button>
          </form>
        </div>
      </CardBody>
    </Card>
  );
}

export function ProjectsManager({ projects }: { projects: Project[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <ProjectRow key={project.id} project={project} />
      ))}

      {adding ? (
        <Card>
          <CardBody className="space-y-4">
            <form
              action={async (formData) => {
                await createProject(formData);
                setAdding(false);
              }}
              className="space-y-4"
            >
              <ProjectFields />
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
          + Agregar proyecto
        </Button>
      )}
    </div>
  );
}
