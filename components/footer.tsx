import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto bg-space text-papaya">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 py-12 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-heading text-4xl sm:text-5xl">Let&apos;s build something</p>
          <p className="mt-2 text-papaya/75">Frontend developer, student at Fontys ICT.</p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
          <li>
            <Link href="/contact" className="hover:text-steel">
              Contact
            </Link>
          </li>
          <li>
            <a href="https://github.com/Kilrlongbow" className="hover:text-steel">
              GitHub
            </a>
          </li>
          <li>
            <a href="mailto:euchivurayise@gmail.com" className="hover:text-steel">
              Email
            </a>
          </li>
        </ul>
      </div>
      <p className="border-t border-papaya/15 py-4 text-center text-xs text-papaya/60">
        © <CopyrightYear /> Eugene Chivurayise
      </p>
    </footer>
  );
}

async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}
