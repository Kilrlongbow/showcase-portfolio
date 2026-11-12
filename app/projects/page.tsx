import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { isPlaceholder, projectsByDiscipline } from "@/data/projects";

export const metadata: Metadata = {
  title: "All Projects",
  description: "Every project in the portfolio, grouped by discipline, with a short explanation of each.",
};

/**
 * The calm way through the portfolio: every project on one page, grouped by
 * discipline, with no animation needed to find or open anything.
 */
export default function ProjectsPage() {
  const groups = projectsByDiscipline();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-8">
      <header className="py-12 sm:py-16">
        <h1 className="font-heading text-6xl sm:text-7xl">All Projects</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Every project in one list, grouped by the kind of work it shows. Prefer something more playful? Browse the
          same projects as folders on the{" "}
          <Link href="/" className="font-semibold text-foreground underline decoration-flag decoration-2 underline-offset-4">
            home page
          </Link>
          .
        </p>

        <nav aria-label="Disciplines" className="mt-8">
          <ul className="flex flex-wrap gap-3">
            {groups.map((group) => (
              <li key={group.id}>
                <a
                  href={`#${group.id}`}
                  className="inline-flex min-h-11 items-center rounded-full border-2 border-space px-4 text-sm font-semibold hover:bg-space hover:text-papaya"
                >
                  {group.label}
                  <span className="ml-2 text-muted-foreground">({group.projects.length})</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="space-y-16">
        {groups.map((group) => (
          <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`} className="scroll-mt-8">
            <div className="border-b-2 border-space pb-3">
              <h2 id={`${group.id}-title`} className="font-heading text-4xl">
                {group.label}
              </h2>
              <p className="mt-1 text-muted-foreground">{group.description}</p>
            </div>

            <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {group.projects.map((project) => (
                <li key={project.slug}>
                  <article
                    className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card focus-within:ring-[3px] focus-within:ring-flag focus-within:ring-offset-2 focus-within:ring-offset-background"
                    style={{ "--ink": project.ink } as CSSProperties}
                  >
                    <div className="relative aspect-[16/9] bg-muted">
                      {project.images[0] && (
                        <Image
                          src={project.images[0].src}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          unoptimized={project.images[0].src.endsWith(".svg")}
                          className="object-cover"
                        />
                      )}
                      <span className="absolute inset-x-0 bottom-0 h-2" style={{ backgroundColor: project.color }} />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-heading text-3xl" style={{ color: "var(--ink)" }}>
                        <Link
                          href={`/projects/${project.slug}`}
                          className="after:absolute after:inset-0 focus-visible:outline-none"
                        >
                          {project.title}
                        </Link>
                      </h3>
                      <p className="mt-2 leading-relaxed">
                        {isPlaceholder(project.summary) ? (
                          <span className="text-muted-foreground italic">Description coming soon.</span>
                        ) : (
                          project.summary
                        )}
                      </p>
                      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                          <dt className="font-semibold text-muted-foreground">Role</dt>
                          <dd>{project.meta.role}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-muted-foreground">Stack</dt>
                          <dd>{project.meta.stack}</dd>
                        </div>
                        <div className="col-span-2">
                          <dt className="font-semibold text-muted-foreground">Inside</dt>
                          <dd>{project.contents.join(" · ")}</dd>
                        </div>
                      </dl>
                      <p
                        className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold"
                        style={{ color: "var(--ink)" }}
                        aria-hidden="true"
                      >
                        Read the case study
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
