export interface ProjectImage {
  src: string;
  alt: string;
}

export interface ProjectSection {
  heading: string;
  body: string;
  image?: ProjectImage;
}

export interface Project {
  slug: string;
  title: string;
  /** Folder colour on the homepage */
  color: string;
  summary: string;
  meta: {
    role: string;
    stack: string;
    duration: string;
  };
  /** First three are fanned out of the folder */
  images: ProjectImage[];
  sections: ProjectSection[];
  /** Drafts show up in development only */
  draft?: boolean;
}

const img = (slug: string, n: number, alt: string): ProjectImage => ({
  src: `/images/projects/${slug}-${n}.svg`,
  alt,
});

const placeholderSections = (slug: string): ProjectSection[] => [
  {
    heading: "The problem",
    body: "Why this product exists, who it is for and what was not working before. Replace this with the real context of the project.",
    image: img(slug, 1, "Overview of the project"),
  },
  {
    heading: "Research & early concepts",
    body: "Sketches, interviews and the first ideas that were explored before committing to a direction. Show what was thrown away and why.",
    image: img(slug, 2, "Early sketches and concepts"),
  },
  {
    heading: "Frontend architecture",
    body: "Components, state and data flow. Explain the important technical decisions, the trade-offs, and how accessibility and performance were handled.",
    image: img(slug, 3, "Component structure"),
  },
  {
    heading: "Result & reflection",
    body: "What changed because of this work, what feedback came in, and what I would do differently next time.",
    image: img(slug, 4, "Final result"),
  },
];

const allProjects: Project[] = [
  {
    slug: "hiccupviews",
    title: "HiccupViews",
    color: "#C1121F",
    summary: "Placeholder summary for HiccupViews.",
    meta: { role: "Frontend developer", stack: "React, TypeScript, CSS", duration: "6 weeks" },
    images: [1, 2, 3, 4].map((n) => img("hiccupviews", n, `HiccupViews screen ${n}`)),
    sections: placeholderSections("hiccupviews"),
  },
  {
    slug: "joinus",
    title: "JoinUs",
    color: "#003049",
    summary: "Placeholder summary for JoinUs.",
    meta: { role: "Frontend developer", stack: "HTML, CSS, JavaScript", duration: "4 weeks" },
    images: [1, 2, 3, 4].map((n) => img("joinus", n, `JoinUs screen ${n}`)),
    sections: placeholderSections("joinus"),
  },
  {
    slug: "smarthome",
    title: "SmartHome",
    color: "#669BBC",
    summary: "Placeholder summary for SmartHome.",
    meta: { role: "Frontend developer", stack: "React, REST API", duration: "5 weeks" },
    images: [1, 2, 3, 4].map((n) => img("smarthome", n, `SmartHome screen ${n}`)),
    sections: placeholderSections("smarthome"),
  },
  {
    slug: "new-project-1",
    title: "New PR 1",
    color: "#780000",
    summary: "Open slot for the next project.",
    meta: { role: "—", stack: "—", duration: "—" },
    images: [1, 2, 3, 4].map((n) => img("new-project-1", n, `New project 1 image ${n}`)),
    sections: placeholderSections("new-project-1"),
    draft: true,
  },
  {
    slug: "new-project-2",
    title: "New PR 2",
    color: "#D9A441",
    summary: "Open slot for the next project.",
    meta: { role: "—", stack: "—", duration: "—" },
    images: [1, 2, 3, 4].map((n) => img("new-project-2", n, `New project 2 image ${n}`)),
    sections: placeholderSections("new-project-2"),
    draft: true,
  },
];

export const projects: Project[] =
  process.env.NODE_ENV === "production"
    ? allProjects.filter((project) => !project.draft)
    : allProjects;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
