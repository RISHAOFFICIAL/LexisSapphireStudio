import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouter,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lexis Sapphire Studio — Boutique Web Development" },
      {
        name: "description",
        content:
          "Premium boutique web development studio crafting polished, upscale websites with personality. Bridging the gap between 'it works' and 'it wows.'",
      },
      { name: "og:title", content: "Lexis Sapphire Studio" },
      {
        name: "og:description",
        content:
          "Premium boutique web development — websites with personality.",
      },
      { name: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="text-center">
        <h1 className="font-heading text-4xl text-sapphire-800">404</h1>
        <p className="mt-2 text-sapphire-500">Page not found</p>
      </div>
    </div>
  ),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* Navigation */}
        <nav className="fixed top-0 right-0 left-0 z-50 backdrop-blur-md bg-cream/85 border-b border-sapphire-100/50">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, "hero")}
              className="font-heading text-xl font-bold tracking-wide text-sapphire-800 transition-colors hover:text-gold-500"
            >
              Lexis Sapphire
              <span className="text-gold-400"> Studio</span>
            </a>
            <div className="hidden items-center gap-8 sm:flex">
              {[
                ["About", "about"],
                ["Portfolio", "portfolio"],
                ["Services", "services"],
                ["Contact", "contact"],
              ].map(([label, id]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => handleNavClick(e, id)}
                  className="text-sm font-medium tracking-wide text-sapphire-600 transition-colors duration-200 hover:text-gold-500"
                >
                  {label}
                </a>
              ))}
            </div>
            {/* Mobile menu trigger - simple anchor */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="rounded-full bg-sapphire-800 px-4 py-2 text-xs font-semibold tracking-wider text-white uppercase transition-all duration-300 hover:bg-gold-500 sm:text-sm"
            >
              Get in Touch
            </a>
          </div>
        </nav>

        {children}

        {/* Footer */}
        <footer className="border-t border-sapphire-100/50 bg-sapphire-950 text-sapphire-300">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
            <div className="grid gap-12 md:grid-cols-3">
              <div>
                <h3 className="font-heading text-xl font-bold text-white">
                  Lexis Sapphire
                  <span className="text-gold-400"> Studio</span>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-sapphire-400">
                  Premium boutique web development. Every site is crafted to tell
                  a story — not sold off a template.
                </p>
              </div>
              <div>
                <h4 className="mb-4 text-xs font-semibold tracking-widest text-gold-400 uppercase">
                  Services
                </h4>
                <ul className="space-y-2 text-sm text-sapphire-400">
                  <li>Web Design & Development</li>
                  <li>E-commerce Solutions</li>
                  <li>Brand Identity Integration</li>
                  <li>Maintenance & Support</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 text-xs font-semibold tracking-widest text-gold-400 uppercase">
                  Connect
                </h4>
                <ul className="space-y-2 text-sm text-sapphire-400">
                  <li>hello@lexissapphire.studio</li>
                  <li>Detroit, MI</li>
                </ul>
              </div>
            </div>
            <div className="mt-12 border-t border-sapphire-800 pt-8 text-center text-xs text-sapphire-500">
              &copy; {new Date().getFullYear()} Lexis Sapphire Studio. All
              rights reserved.
            </div>
          </div>
        </footer>

        <Scripts />
      </body>
    </html>
  );
}