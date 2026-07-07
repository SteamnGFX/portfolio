import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfile, getExperiences, getEducations, getSkills, getProjects } from "@/lib/data";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { ExperienceTimeline } from "@/components/site/ExperienceTimeline";
import { SkillsGrid } from "@/components/site/SkillsGrid";
import { ProjectsGrid } from "@/components/site/ProjectsGrid";
import { ContactSection } from "@/components/site/ContactSection";
import { Footer } from "@/components/site/Footer";
import { PageViewTracker } from "@/components/site/PageViewTracker";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  if (!profile) return {};

  const description = profile.summary.split("\n")[0].slice(0, 160);

  return {
    title: `${profile.name} — ${profile.title}`,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title: profile.name,
      description,
      url: "/",
      images: ["/opengraph-image"],
    },
    twitter: {
      title: profile.name,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function Home() {
  const [profile, experiences, educations, skills, projects] = await Promise.all([
    getProfile(),
    getExperiences(),
    getEducations(),
    getSkills(),
    getProjects(),
  ]);

  if (!profile) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.summary.split("\n")[0],
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location,
    },
    image: profile.avatarUrl ?? undefined,
    sameAs: [profile.linkedinUrl, profile.githubUrl].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageViewTracker />
      <Navbar name={profile.name} />
      <main>
        <Hero
          name={profile.name}
          title={profile.title}
          location={profile.location}
          avatarUrl={profile.avatarUrl}
          cvUrl={profile.cvUrl}
        />
        <About summary={profile.summary} />
        <ExperienceTimeline experiences={experiences} educations={educations} />
        <SkillsGrid skills={skills} />
        <ProjectsGrid projects={projects} />
        <ContactSection email={profile.email} linkedinUrl={profile.linkedinUrl} githubUrl={profile.githubUrl} />
      </main>
      <Footer name={profile.name} />
    </>
  );
}
