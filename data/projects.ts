export interface ProjectImage {
  src: string;
  alt: string;
}

export interface ProjectSection {
  heading: string;
  body: string;
  image?: ProjectImage;
}

export const disciplines = [
  {
    id: "ux-research",
    label: "UX research",
    description: "Finding out who a product is for and what is not working: interviews, tests and insights.",
  },
  {
    id: "visual-design",
    label: "UI & visual design",
    description: "Layout, colour, type and the visual identity of an interface.",
  },
  {
    id: "frontend",
    label: "Frontend development",
    description: "Turning designs into fast, accessible, well-structured code.",
  },
  {
    id: "interaction",
    label: "Interaction & motion",
    description: "Animation and interaction that make an interface feel alive and easy to use.",
  },
] as const;

export type DisciplineId = (typeof disciplines)[number]["id"];

export interface Project {
  slug: string;
  title: string;
  /** Folder colour on the homepage */
  color: string;
  /** Text version of `color` with at least 4.5:1 contrast on the page background */
  ink: string;
  /** Main topic the project is filed under on the projects page */
  discipline: DisciplineId;
  /** One sentence: what the project is and who it is for */
  summary: string;
  /** What a visitor finds inside the folder, shown under the active folder */
  contents: string[];
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

/**
 * Case-study skeleton. Every project tells its story in the same four steps,
 * so visitors know where to look. The bodies are writing prompts: replace
 * each one with the real story (TODO(Eugene)).
 */
const placeholderSections = (slug: string): ProjectSection[] => [
  {
    heading: "The problem",
    body: "In two or three sentences: who was this for, what was going wrong for them, and what was the brief or goal? Mention the client or course if there was one.",
    image: img(slug, 1, "Overview of the project"),
  },
  {
    heading: "Research & early concepts",
    body: "What did you find out (interviews, tests, competitor analysis) and which ideas did you sketch? Name one idea you threw away and why.",
    image: img(slug, 2, "Early sketches and concepts"),
  },
  {
    heading: "Frontend build",
    body: "How is it built? Name the main components, how data and state flow, and one technical decision you are proud of. Add what you did for accessibility and performance.",
    image: img(slug, 3, "Component structure"),
  },
  {
    heading: "Result & reflection",
    body: "What did the final product achieve? Include feedback from users or teachers, and finish with what you learned and what you would do differently next time.",
    image: img(slug, 4, "Final result"),
  },
];

const allProjects: Project[] = [
  {
    slug: "hiccupviews",
    title: "HiccupViews",
    color: "#C1121F",
    ink: "#C1121F",
    discipline: "frontend",
    contents: ["Problem", "Research", "Frontend build", "Result"],
    summary: "TODO(Eugene): one sentence on what HiccupViews is and who it is for.",
    meta: { role: "Frontend developer", stack: "React, TypeScript, CSS", duration: "6 weeks" },
    images: [1, 2, 3, 4].map((n) => img("hiccupviews", n, `HiccupViews screen ${n}`)),
    sections: placeholderSections("hiccupviews"),
  },
  {
    slug: "joinus",
    title: "JoinUs",
    color: "#003049",
    ink: "#003049",
    discipline: "visual-design",
    contents: ["Problem", "Research", "Frontend build", "Result"],
    summary: "TODO(Eugene): one sentence on what JoinUs is and who it is for.",
    meta: { role: "Frontend developer", stack: "HTML, CSS, JavaScript", duration: "4 weeks" },
    images: [1, 2, 3, 4].map((n) => img("joinus", n, `JoinUs screen ${n}`)),
    sections: placeholderSections("joinus"),
  },
  {
    slug: "smarthome",
    title: "SmartHome",
    color: "#669BBC",
    ink: "#2F6585",
    discipline: "interaction",
    contents: ["Problem", "Research", "Frontend build", "Result"],
    summary: "TODO(Eugene): one sentence on what SmartHome is and who it is for.",
    meta: { role: "Frontend developer", stack: "React, REST API", duration: "5 weeks" },
    images: [1, 2, 3, 4].map((n) => img("smarthome", n, `SmartHome screen ${n}`)),
    sections: placeholderSections("smarthome"),
  },
  {
    slug: "new-project-1",
    title: "New PR 1",
    color: "#780000",
    ink: "#780000",
    discipline: "ux-research",
    contents: ["Open slot"],
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
    ink: "#8A5A00",
    discipline: "frontend",
    contents: ["Open slot"],
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

/** Text still waiting for real content; hidden on the site, listed in the change log */
export function isPlaceholder(text: string) {
  return text.startsWith("TODO");
}

export function projectsByDiscipline() {
  return disciplines
    .map((discipline) => ({
      ...discipline,
      projects: projects.filter((project) => project.discipline === discipline.id),
    }))
    .filter((group) => group.projects.length > 0);
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
