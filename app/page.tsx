import { Hero } from "@/components/hero";
import { projects } from "@/data/projects";

export default function Home() {
  return <Hero projects={projects} />;
}
