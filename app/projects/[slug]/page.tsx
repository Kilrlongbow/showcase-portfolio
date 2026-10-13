import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return project ? { title: project.title, description: project.summary } : {};
}

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

async function ProjectContent({ params }: { params: PageProps<"/projects/[slug]">["params"] }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const previous = projects[(index - 1 + projects.length) % projects.length]!;
  const next = projects[(index + 1) % projects.length]!;

  return (
    <article className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-8">
      <header className="py-12 text-center sm:py-16" style={{ "--folder": project.color } as React.CSSProperties}>
        <h1 className="font-heading text-6xl sm:text-8xl lg:text-9xl">{project.title}</h1>
        <dl className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
          {[
            ["Role", project.meta.role],
            ["Stack", project.meta.stack],
            ["Duration", project.meta.duration],
          ].map(([term, value]) => (
            <div key={term} className="border-t-4 pt-2" style={{ borderColor: project.color }}>
              <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{term}</dt>
              <dd className="mt-1 font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="flex flex-col">
        {project.sections.map((section, i) => (
          <section
            key={section.heading}
            className="grid grid-cols-1 items-center gap-6 py-6 md:grid-cols-2 md:gap-0 md:py-0"
          >
            {section.image && (
              <div
                className={cn(
                  "relative aspect-[4/3] w-full overflow-hidden bg-muted",
                  i % 2 === 1 && "md:order-2",
                )}
              >
                <Image
                  src={section.image.src}
                  alt={section.image.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  unoptimized={section.image.src.endsWith(".svg")}
                  className="object-cover"
                />
              </div>
            )}
            <div className={cn("md:px-10", i % 2 === 1 && "md:order-1")}>
              <h2 className="font-heading text-3xl sm:text-4xl">{section.heading}</h2>
              <p className="mt-3 text-lg leading-relaxed italic font-semibold">{section.body}</p>
            </div>
          </section>
        ))}
      </div>

      <nav aria-label="More projects" className="mt-16 flex justify-between gap-4 border-t border-border pt-8">
        <Link href={`/projects/${previous.slug}`} className="group">
          <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">Previous</span>
          <span className="font-heading text-2xl group-hover:text-flag sm:text-3xl">{previous.title}</span>
        </Link>
        <Link href={`/projects/${next.slug}`} className="group text-right">
          <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">Next</span>
          <span className="font-heading text-2xl group-hover:text-flag sm:text-3xl">{next.title}</span>
        </Link>
      </nav>
    </article>
  );
}
