import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { HideOnHome } from "@/components/hide-on-home";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["800"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Eugene Chivurayise · Frontend Developer",
    template: "%s · Eugene Chivurayise",
  },
  description:
    "Showcase portfolio of Eugene Chivurayise, a frontend developer building expressive, accessible web experiences.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${barlowCondensed.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Nav />
        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>
        <HideOnHome>
          <Footer />
        </HideOnHome>
      </body>
    </html>
  );
}
