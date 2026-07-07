"use client";

import { motion } from "motion/react";
import type { Project } from "@prisma/client";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/site/Reveal";
import { ImageCarousel } from "@/components/site/ImageCarousel";
import type { Dictionary } from "@/lib/dictionary";

export function ProjectsGrid({ projects, dict }: { projects: Project[]; dict: Dictionary }) {
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <SectionHeading eyebrow="04" title={dict.sections.projects} />
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.1} className="h-full">
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface/60 backdrop-blur-sm hover:border-accent/40 hover:shadow-[0_0_30px_-10px_rgba(34,211,238,0.3)]"
            >
              {project.images.length > 0 && (
                <ImageCarousel images={project.images} alt={project.title} />
              )}
              <CardBody className="flex flex-1 flex-col">
                <h3 className="font-semibold text-foreground">{project.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
                {project.techStack.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                )}
                {(project.repoUrl || project.demoUrl) && (
                  <div className="mt-4 flex gap-4 text-sm">
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-accent hover:underline"
                      >
                        {dict.projects.repo} →
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-accent hover:underline"
                      >
                        {dict.projects.demo} →
                      </a>
                    )}
                  </div>
                )}
              </CardBody>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
