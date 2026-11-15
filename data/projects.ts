export interface ProjectImage {
  src: string;
  alt: string;
  /** "contain" shows the whole image (diagrams, screenshots); photos fill the frame by default */
  fit?: "contain";
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

const pic = (file: string, alt: string, fit?: "contain"): ProjectImage => ({
  src: `/images/projects/${file}`,
  alt,
  ...(fit && { fit }),
});

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
    discipline: "visual-design",
    contents: ["Problem", "Research", "Brand & website", "Result"],
    summary:
      "My photography brand, grown from an Instagram page into a visual storytelling studio with its own identity and website.",
    meta: { role: "Photographer, designer & developer", stack: "React, TypeScript, Tailwind, Vite", duration: "Spring 2026" },
    images: [
      pic("hiccupviews-1.png", "The HiccupViews logo: a handwritten wordmark with an eye", "contain"),
      pic("hiccupviews-2.jpg", "Hand-drawn wireframes for the HiccupViews website", "contain"),
      pic("hiccupviews-3.jpg", "HiccupViews event photo of two friends at a party"),
      pic("hiccupviews-4.jpg", "HiccupViews portrait of a woman looking at her phone"),
    ],
    sections: [
      {
        heading: "The problem",
        body: "HiccupViews only lived on Instagram. I wanted to turn it into a real brand, with a clear identity and a website that brands and event organisers can book from.",
      },
      {
        heading: "Research & early concepts",
        body: "I studied photography portfolio sites, defined the brand's mission, values and audience, and sketched the site structure on paper first.",
      },
      {
        heading: "Brand & website",
        body: "I designed the logo and built the portfolio site in React and TypeScript, with galleries for events and portraits.",
      },
      {
        heading: "Result & reflection",
        body: "HiccupViews now has a brand and a home outside Instagram. Next I want to explore AR, so a printed photo can open a digital story.",
      },
    ],
  },
  {
    slug: "crow-studio",
    title: "Crow Studio",
    color: "#003049",
    ink: "#003049",
    discipline: "interaction",
    contents: ["Problem", "Research", "Game prototype", "Result"],
    summary:
      "Our student media agency. For the JoinUs Foundation we made an icebreaker game that helps young people start real conversations.",
    meta: { role: "Concept & research (team of 5)", stack: "HTML, CSS, JavaScript", duration: "Spring 2026" },
    images: [
      pic("crow-studio-1.jpg", "Crow Studio brand guide page with the team values and the mascot Crowine", "contain"),
      pic("crow-studio-2.jpg", "JoinUs game: creating your character", "contain"),
      pic("crow-studio-3.jpg", "JoinUs game: picking favourite film genres", "contain"),
      pic("crow-studio-4.jpg", "JoinUs game: drawing a question card", "contain"),
    ],
    sections: [
      {
        heading: "The problem",
        body: "JoinUs fights loneliness among young people, but many visitors at their events find it hard to start a conversation. They asked for a new game for groups of three or four.",
      },
      {
        heading: "Research & early concepts",
        body: "I sketched card-game concepts and researched conversation-starting questions. Our chosen idea pairs players who give the same answer.",
      },
      {
        heading: "Game prototype",
        body: "Players join on their phone, build a character from their interests and draw question cards. The phone stays in the background so the talking happens face to face.",
      },
      {
        heading: "Result & reflection",
        body: "We tested it with players and used their feedback to improve the character builder. I learned I should join planning earlier and ask for feedback more often.",
      },
    ],
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
    slug: "krom-studio",
    title: "Krom Studio",
    color: "#780000",
    ink: "#780000",
    discipline: "ux-research",
    contents: ["Problem", "Research", "Prototype", "Result"],
    summary:
      "Linked: for Krom Studio's brief Who Owns the Night?, a web app that lets someone who feels unsafe on a night out in Eindhoven ask for help in one tap.",
    meta: { role: "Researcher, designer & developer (team of 4)", stack: "HTML, CSS, JavaScript, NFC", duration: "Sep 2026 – Jan 2027" },
    images: [
      pic("krom-studio-1.jpg", "User journey of Sara asking for help during a night out", "contain"),
      pic("krom-studio-2.jpg", "Three concept directions for the help screen, with one-tap chosen", "contain"),
      pic("krom-studio-3.jpg", "Wireframes of the request flow: idle, sent, received and cancelled", "contain"),
      pic("krom-studio-4.jpg", "Flow diagram of a help request", "contain"),
    ],
    sections: [
      {
        heading: "The problem",
        body: "Eindhoven already has night-time support, but people who feel something is wrong often don't know where to go or what will happen if they ask.",
      },
      {
        heading: "Research & early concepts",
        body: "We mapped existing services and user journeys, then compared three help screens and chose the simplest: one big button.",
      },
      {
        heading: "Prototype",
        body: "Linked lets you ask for help, share an approximate location only if you choose, and cancel at any time. An NFC wristband opens it without an app.",
      },
      {
        heading: "Result & reflection",
        body: "The prototype is still being tested with users and volunteers. It taught me to design for people under stress: fewer choices, clear words, no surprises.",
      },
    ],
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

/** A section without its own image shows the project image in the same position */
const withSectionImages = (project: Project): Project => ({
  ...project,
  sections: project.sections.map((section, i) => ({
    ...section,
    image: section.image ?? project.images[i],
  })),
});

export const projects: Project[] = (
  process.env.NODE_ENV === "production"
    ? allProjects.filter((project) => !project.draft)
    : allProjects
).map(withSectionImages);

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
