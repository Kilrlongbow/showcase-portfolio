import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

const channels = [
  { label: "Email", value: "euchivurayise@gmail.com", href: "mailto:euchivurayise@gmail.com" },
  { label: "GitHub", value: "github.com/Kilrlongbow", href: "https://github.com/Kilrlongbow" },
  { label: "LinkedIn", value: "Add your LinkedIn URL", href: "https://www.linkedin.com/" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-8 md:py-20">
      <h1 className="font-heading text-6xl sm:text-8xl">Contact</h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed">
        Looking for an intern or junior frontend developer, or want to talk about a project? Get in touch.
      </p>
      <ul className="mt-12 divide-y divide-border border-y border-border">
        {channels.map((channel) => (
          <li key={channel.label}>
            <a
              href={channel.href}
              className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <span className="font-heading text-4xl group-hover:text-flag sm:text-5xl">{channel.label}</span>
              <span className="text-muted-foreground group-hover:text-foreground">{channel.value}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
