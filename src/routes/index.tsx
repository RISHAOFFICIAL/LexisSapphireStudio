import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";
import { useEffect, useRef, useState } from "react";
import { execute } from "~/db";

// Server function to submit a lead
const submitLead = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { name: string; email: string; projectType: string; message: string } }) => {
    execute(
      "INSERT INTO leads (name, email, project_type, message) VALUES (?, ?, ?, ?)",
      [data.name, data.email, data.projectType, data.message],
    );
    return { ok: true };
  },
);

const getBusinessName = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const cfg = JSON.parse(await readFile("site.json", "utf8")) as {
      businessName?: string;
    };
    return cfg.businessName?.trim() ?? "";
  } catch {
    return "";
  }
});

export const Route = createFileRoute("/")({
  loader: () => getBusinessName(),
  component: Home,
});

/* ---------- Scroll reveal hook ---------- */
function useRevealOnScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function RevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, visible } = useRevealOnScroll();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- Placeholder project data ---------- */
const PROJECTS = [
  {
    title: "Maison Lumière",
    tag: "E-Commerce / Luxury Retail",
    description:
      "A bespoke e-commerce experience for a high-end home fragrance brand. Custom product filtering, seamless checkout, and a rich editorial layout.",
    gradient: "from-sapphire-800 via-sapphire-600 to-gold-500",
  },
  {
    title: "Atelier Verve",
    tag: "Creative Agency Portfolio",
    description:
      "A bold, gallery-style portfolio for a design studio. Full-bleed imagery, subtle micro-interactions, and a case-study narrative flow.",
    gradient: "from-sapphire-900 via-sapphire-700 to-sapphire-400",
  },
  {
    title: "Coast & Caldera",
    tag: "Restaurant & Hospitality",
    description:
      "An immersive, story-driven site for a farm-to-table restaurant. Rich typography, atmospheric photography, and an integrated reservation system.",
    gradient: "from-gold-600 via-sapphire-700 to-sapphire-950",
  },
  {
    title: "Meridian Health",
    tag: "Wellness / Professional Services",
    description:
      "A calm, trust-building site for a holistic health practice. Clean layouts, warm tones, and a thoughtful appointment booking flow.",
    gradient: "from-sapphire-600 via-sapphire-500 to-gold-400",
  },
  {
    title: "Nomad Supply Co.",
    tag: "Subscription / Lifestyle Brand",
    description:
      "A punchy, conversion-focused landing page and dashboard for a travel gear subscription. Animated product showcases and a loyalty rewards section.",
    gradient: "from-sapphire-950 via-sapphire-800 to-gold-600",
  },
  {
    title: "Guild & Grove",
    tag: "Membership / Community",
    description:
      "A warm, inviting platform for a creative co-working space. Member profiles, event calendars, and a rich resource library — all with a handcrafted feel.",
    gradient: "from-gold-500 via-sapphire-600 to-sapphire-900",
  },
];

const SERVICES = [
  {
    title: "Web Design & Development",
    description:
      "Tailored, responsive websites built from the ground up. Every pixel is intentional — crafted to align with your brand and tell your story.",
    icon: "✦",
  },
  {
    title: "E-Commerce Solutions",
    description:
      "Custom online stores that feel as good as they function. From product pages to checkout flows, we design for conversion and delight.",
    icon: "◆",
  },
  {
    title: "Brand Identity Integration",
    description:
      "Your brand deserves a digital home that reflects it. We weave your visual identity into every interaction, from color to typography to tone.",
    icon: "◈",
  },
  {
    title: "Maintenance & Support",
    description:
      "Ongoing care to keep your site fast, secure, and fresh. Monthly updates, performance monitoring, and on-call support when you need it.",
    icon: "◇",
  },
];

/* ---------- Main component ---------- */
function Home() {
  const businessName = Route.useLoaderData();

  return (
    <main>
      {/* ===== HERO ===== */}
      <section
        id="hero"
        className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pt-20"
      >
        {/* Decorative gradient background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] right-[-10%] h-[60%] w-[50%] rounded-full bg-sapphire-100/40 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-gold-100/30 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="animate-fade-in inline-block rounded-full border border-sapphire-200/60 bg-white/60 px-4 py-1.5 text-xs font-medium tracking-wider text-sapphire-600 uppercase backdrop-blur-sm">
            Premium Boutique Web Development
          </span>

          <h1 className="animate-fade-in-up mt-8 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            We build websites{" "}
            <span className="gradient-text">with personality</span>
          </h1>

          <p className="animate-fade-in-up animate-delay-200 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-sapphire-600 sm:text-xl">
            {businessName
              ? `${businessName} bridges the gap between "it works" and "it wows." Every site is crafted to tell a story — not sold off a template.`
              : "Bridging the gap between 'it works' and 'it wows.' Every site is crafted to tell a story — not sold off a template."}
          </p>

          <div className="animate-fade-in-up animate-delay-400 mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#portfolio"
              className="rounded-full bg-sapphire-800 px-8 py-3.5 text-sm font-semibold tracking-wider text-white shadow-lg shadow-sapphire-900/20 transition-all duration-300 hover:bg-gold-500 hover:shadow-gold-500/30 hover:-translate-y-0.5"
            >
              View Our Work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-sapphire-300/60 bg-white/60 px-8 py-3.5 text-sm font-semibold tracking-wider text-sapphire-700 backdrop-blur-sm transition-all duration-300 hover:border-sapphire-300 hover:bg-white hover:-translate-y-0.5"
            >
              Start a Project
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in animate-delay-600 absolute bottom-8 flex flex-col items-center gap-2">
          <span className="text-xs font-medium tracking-wider text-sapphire-400 uppercase">
            Scroll
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-sapphire-300 to-transparent" />
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <RevealSection>
        <section
          id="about"
          className="mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32"
        >
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <span className="text-xs font-semibold tracking-widest text-gold-500 uppercase">
                About
              </span>
              <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-sapphire-900 sm:text-4xl">
                Crafting digital experiences that leave a lasting impression
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-sapphire-600">
                <p>
                  Lexis Sapphire Studio was founded on a simple belief: your
                  website should be as unique as your business. In a world of
                  cookie-cutter templates and rushed deployments, we take the
                  time to understand who you are — and build something that
                  truly reflects it.
                </p>
                <p>
                  With a background in both design and engineering, we bring a
                  rare blend of aesthetic sensibility and technical rigor to
                  every project. The result? Websites that feel as good as they
                  look — fast, accessible, and meticulously crafted.
                </p>
                <p>
                  Whether you're launching a brand, scaling a business, or
                  refreshing an existing presence, we're here to help you make
                  an impression that lasts.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-sapphire-200 via-sapphire-100 to-gold-100 p-8 shadow-xl shadow-sapphire-900/5">
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="font-heading text-6xl font-bold text-sapphire-800">
                    LSS
                  </span>
                  <div className="mt-4 h-px w-12 bg-gold-400" />
                  <p className="mt-4 max-w-xs text-sm italic text-sapphire-600">
                    "Design is not just what it looks like and feels like.
                    Design is how it works."
                  </p>
                  <p className="mt-2 text-xs text-sapphire-400">
                    — Steve Jobs
                  </p>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -top-4 -right-4 -z-10 h-24 w-24 rounded-full border-2 border-gold-300/40" />
              <div className="absolute -bottom-4 -left-4 -z-10 h-16 w-16 rounded-full bg-gold-100/60" />
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ===== PORTFOLIO ===== */}
      <RevealSection>
        <section
          id="portfolio"
          className="bg-sapphire-50/60 px-6 py-24 sm:px-8 sm:py-32"
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <span className="text-xs font-semibold tracking-widest text-gold-500 uppercase">
                Portfolio
              </span>
              <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-sapphire-900 sm:text-4xl">
                Selected work
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-sapphire-500">
                Each project is a partnership. Here are a few of the sites we've
                had the privilege of building.
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {PROJECTS.map((project) => (
                <div
                  key={project.title}
                  className="group relative overflow-hidden rounded-xl bg-white shadow-md shadow-sapphire-900/5 transition-all duration-500 hover:shadow-xl hover:shadow-sapphire-900/10 hover:-translate-y-1"
                >
                  {/* Project card gradient */}
                  <div
                    className={`aspect-[4/3] bg-gradient-to-br ${project.gradient} flex items-center justify-center p-6 transition-transform duration-500 group-hover:scale-105`}
                  >
                    <span className="font-heading text-2xl font-bold tracking-wide text-white/90 drop-shadow-sm">
                      {project.title}
                    </span>
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold tracking-wider text-gold-500 uppercase">
                      {project.tag}
                    </span>
                    <h3 className="mt-2 font-heading text-lg font-bold text-sapphire-900">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-sapphire-500">
                      {project.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-medium text-sapphire-600 transition-colors group-hover:text-gold-500">
                      <span>View Case Study</span>
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ===== SERVICES ===== */}
      <RevealSection>
        <section
          id="services"
          className="mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32"
        >
          <div className="text-center">
            <span className="text-xs font-semibold tracking-widest text-gold-500 uppercase">
              Services
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-sapphire-900 sm:text-4xl">
              What we offer
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-sapphire-500">
              From concept to launch — and beyond. Every service is designed to
              elevate your digital presence.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="group rounded-xl border border-sapphire-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-gold-200 hover:shadow-lg hover:shadow-gold-500/5"
              >
                <span className="font-heading text-3xl text-gold-500 transition-colors group-hover:text-gold-400">
                  {service.icon}
                </span>
                <h3 className="mt-4 font-heading text-xl font-bold text-sapphire-900">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-sapphire-500">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ===== CONTACT / CTA ===== */}
      <RevealSection>
        <section
          id="contact"
          className="bg-gradient-to-br from-sapphire-900 via-sapphire-800 to-sapphire-950 px-6 py-24 sm:px-8 sm:py-32"
        >
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold tracking-widest text-gold-400 uppercase">
              Get in Touch
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-white sm:text-4xl">
              Let's build something extraordinary together
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-sapphire-300">
              Ready to elevate your online presence? Tell us about your project
              — we'd love to hear from you.
            </p>

            <div className="mt-10 mx-auto max-w-lg">
              <form
                className="space-y-4 text-left"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  try {
                    await submitLead({
                      data: {
                        name: formData.get("name") as string,
                        email: formData.get("email") as string,
                        projectType: (formData.get("projectType") as string) || "",
                        message: formData.get("message") as string,
                      },
                    });
                    alert("Thank you! We'll get back to you within 24 hours.");
                    form.reset();
                  } catch {
                    alert("Something went wrong. Please try again or email us directly.");
                  }
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    required
                    className="w-full rounded-lg border border-sapphire-700/50 bg-sapphire-950/50 px-4 py-3 text-sm text-white placeholder-sapphire-400 backdrop-blur-sm transition-colors focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/30"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    required
                    className="w-full rounded-lg border border-sapphire-700/50 bg-sapphire-950/50 px-4 py-3 text-sm text-white placeholder-sapphire-400 backdrop-blur-sm transition-colors focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/30"
                  />
                </div>
                <input
                  name="projectType"
                  type="text"
                  placeholder="Project type (e.g., E-commerce, Portfolio)"
                  className="w-full rounded-lg border border-sapphire-700/50 bg-sapphire-950/50 px-4 py-3 text-sm text-white placeholder-sapphire-400 backdrop-blur-sm transition-colors focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/30"
                />
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us about your project..."
                  required
                  className="w-full resize-none rounded-lg border border-sapphire-700/50 bg-sapphire-950/50 px-4 py-3 text-sm text-white placeholder-sapphire-400 backdrop-blur-sm transition-colors focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/30"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold tracking-wider text-sapphire-950 shadow-lg shadow-gold-500/20 transition-all duration-300 hover:bg-gold-400 hover:shadow-gold-500/40 hover:-translate-y-0.5"
                >
                  Send Inquiry
                </button>
              </form>
              <p className="mt-4 text-xs text-sapphire-500">
                We'll get back to you within 24 hours. No spam, ever.
              </p>
            </div>
          </div>
        </section>
      </RevealSection>
    </main>
  );
}