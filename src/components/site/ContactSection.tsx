"use client";

import { SectionHeading } from "@/components/site/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/site/Reveal";
import { trackEvent } from "@/lib/actions/analytics";
import type { Dictionary } from "@/lib/dictionary";

interface ContactProps {
  email: string;
  linkedinUrl: string;
  githubUrl: string | null;
  dict: Dictionary;
}

export function ContactSection({ email, linkedinUrl, githubUrl, dict }: ContactProps) {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <SectionHeading eyebrow="05" title={dict.sections.contact} />
      </Reveal>
      <Reveal delay={0.1} className="max-w-2xl">
        <p className="text-[15px] leading-relaxed text-muted">{dict.contact.prompt}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <LinkButton href={`mailto:${email}`} variant="primary" onClick={() => trackEvent("email_click")}>
            {email}
          </LinkButton>
          <LinkButton
            href={linkedinUrl}
            variant="secondary"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("linkedin_click")}
          >
            LinkedIn
          </LinkButton>
          {githubUrl && (
            <LinkButton
              href={githubUrl}
              variant="secondary"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("github_click")}
            >
              GitHub
            </LinkButton>
          )}
        </div>
      </Reveal>
    </section>
  );
}
