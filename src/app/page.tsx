import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocalizedHomeData } from "@/lib/localize";
import { getLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { ExperienceTimeline } from "@/components/site/ExperienceTimeline";
import { SkillsGrid } from "@/components/site/SkillsGrid";
import { ProjectsGrid } from "@/components/site/ProjectsGrid";
import { ContactSection } from "@/components/site/ContactSection";
import { Footer } from "@/components/site/Footer";
import { PageViewTracker } from "@/components/site/PageViewTracker";
import { IntroSplash } from "@/components/site/IntroSplash";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { profile } = await getLocalizedHomeData(locale);
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
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const { profile, experiences, educations, skills, projects } = await getLocalizedHomeData(locale);

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
      <IntroSplash />
      <Navbar name={profile.name} dict={dict} locale={locale} />
      <main>
        <Hero
          name={profile.name}
          title={profile.title}
          location={profile.location}
          avatarUrl={profile.avatarUrl}
          cvUrl={profile.cvUrl}
          dict={dict}
        />
        <About summary={profile.summary} dict={dict} />
        <ExperienceTimeline experiences={experiences} educations={educations} dict={dict} locale={locale} />
        <SkillsGrid skills={skills} dict={dict} locale={locale} />
        <ProjectsGrid projects={projects} dict={dict} />
        <ContactSection
          email={profile.email}
          linkedinUrl={profile.linkedinUrl}
          githubUrl={profile.githubUrl}
          dict={dict}
        />
      </main>
      <Footer name={profile.name} dict={dict} />
    </>
  );
}
