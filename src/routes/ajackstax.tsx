import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { execute } from "~/db";

// Server function to submit a lead from the tax service page
const submitTaxLead = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { name: string; email: string; message: string } }) => {
    execute(
      "INSERT INTO leads (name, email, project_type, message) VALUES (?, ?, ?, ?)",
      [data.name, data.email, "Tax Service Inquiry", `[A Jack's Tax Service] ${data.message}`],
    );
    return { ok: true };
  },
);

export const Route = createFileRoute("/ajackstax")({
  component: AJackstaxPage,
});

const SERVICES = [
  {
    title: "Individual Tax Returns",
    description:
      "Expert preparation for federal and state individual tax returns. We handle everything from simple filings to complex returns with investments, deductions, and credits.",
    icon: "📋",
  },
  {
    title: "Business Taxes",
    description:
      "Comprehensive tax services for small businesses, including corporate returns, partnership filings, and self-employment tax preparation.",
    icon: "🏢",
  },
  {
    title: "Year-Round Bookkeeping",
    description:
      "Keep your finances in order all year long. We offer ongoing bookkeeping services to track income, expenses, and prepare you for tax season.",
    icon: "📊",
  },
  {
    title: "Rapid Refunds",
    description:
      "Get your refund fast — up to $7,000. Our rapid refund processing ensures you receive your maximum refund as quickly as possible.",
    icon: "⚡",
  },
  {
    title: "Same-Day Processing",
    description:
      "Need your taxes done today? Our same-day processing service gets your return prepared, reviewed, and filed — all in one visit.",
    icon: "📅",
  },
];

function AJackstaxPage() {
  return (
    <main>
      {/* ===== HERO ===== */}
      <section
        id="hero"
        className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pt-20"
      >
        {/* Decorative gradient background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] h-[60%] w-[50%] rounded-full bg-emerald-100/40 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-amber-100/30 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="animate-fade-in mb-6 flex items-center justify-center gap-3">
            <img
              src="https://files.manuscdn.com/user_upload_by_module/web_dev_logo/110433228/ibYujiRLVNrymYHl.png"
              alt="A Jack's Tax Service"
              className="h-12 w-12 rounded-lg object-contain"
            />
            <span className="animate-fade-in inline-block rounded-full border border-emerald-200/60 bg-white/60 px-4 py-1.5 text-xs font-medium tracking-wider text-emerald-700 uppercase backdrop-blur-sm">
              BBB Accredited Business
            </span>
          </div>

          <h1 className="animate-fade-in-up mt-4 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Expert Tax Preparation{" "}
            <span className="text-emerald-600">You Can Trust</span>
          </h1>

          <p className="animate-fade-in-up animate-delay-200 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            Serving Ferndale and the greater Detroit area with professional tax
            preparation, bookkeeping, and financial services — all at
            convenient evening hours.
          </p>

          <div className="animate-fade-in-up animate-delay-300 mt-4 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
              ⚡ Rapid Refunds up to $7,000
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700">
              📅 Same-Day Processing
            </span>
          </div>

          <div className="animate-fade-in-up animate-delay-400 mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:313-427-4856"
              className="rounded-full bg-emerald-700 px-10 py-4 text-base font-bold tracking-wider text-white shadow-lg shadow-emerald-900/30 transition-all duration-300 hover:bg-emerald-600 hover:shadow-emerald-600/40 hover:-translate-y-0.5"
            >
              📞 Call (313) 427-4856
            </a>
            <a
              href="#contact"
              className="rounded-full border border-slate-300/60 bg-white/60 px-8 py-3.5 text-sm font-semibold tracking-wider text-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-slate-300 hover:bg-white hover:-translate-y-0.5"
            >
              Visit Our Office
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in animate-delay-600 absolute bottom-8 flex flex-col items-center gap-2">
          <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
            Scroll
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-slate-300 to-transparent" />
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section
        id="about"
        className="mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32"
      >
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <span className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">
              About Us
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              Professional tax service with a personal touch
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
              <p>
                At A Jack's Tax Service, we believe that quality tax preparation
                shouldn't be complicated or stressful. Located in the heart of
                Ferndale, we've been helping individuals and small businesses
                navigate their taxes with confidence and ease.
              </p>
              <p>
                As a <strong>BBB Accredited Business</strong>, we're committed
                to the highest standards of professionalism, accuracy, and
                integrity. Whether you're filing your annual return, starting a
                business, or need year-round bookkeeping, we're here to help.
              </p>
              <p>
                We understand that your time is valuable — that's why we offer
                evening hours (Monday through Friday, 4-8 PM) and same-day
                processing to fit your schedule. Your financial peace of mind is
                just a visit away.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                ✅ BBB Accredited
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                📍 Ferndale, MI
              </span>
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                ⭐ 5-Star Service
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-emerald-100 via-emerald-50 to-amber-50 p-8 shadow-xl shadow-slate-900/5">
              <div className="flex h-full flex-col items-center justify-center text-center">
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/web_dev_logo/110433228/ibYujiRLVNrymYHl.png"
                  alt="A Jack's Tax Service"
                  className="mb-4 h-16 w-16 rounded-xl object-contain"
                />
                <span className="font-heading text-4xl font-bold text-slate-800">
                  A Jack's
                </span>
                <span className="font-heading text-3xl font-bold text-emerald-600">
                  Tax Service
                </span>
                <div className="mt-4 h-px w-12 bg-amber-400" />
                <p className="mt-4 max-w-xs text-sm text-slate-600">
                  1938 Burdette, Ferndale, MI 48220
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Mon-Fri 4:00 PM - 8:00 PM
                </p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 -z-10 h-24 w-24 rounded-full border-2 border-amber-300/40" />
            <div className="absolute -bottom-4 -left-4 -z-10 h-16 w-16 rounded-full bg-emerald-100/60" />
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section
        id="services"
        className="bg-slate-50/60 px-6 py-24 sm:px-8 sm:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">
              Our Services
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              Everything you need, all in one place
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
              From individual returns to business taxes and bookkeeping — we've
              got you covered year-round.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="group rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5"
              >
                <span className="text-3xl">{service.icon}</span>
                <h3 className="mt-4 font-heading text-xl font-bold text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section
        id="contact"
        className="px-6 py-24 sm:px-8 sm:py-32"
      >
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">
              Contact Us
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              Get in touch with A Jack's Tax Service
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
              Stop by our office, give us a call, or send us an email. We're
              here to help with all your tax needs.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {/* Contact info */}
            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="font-heading text-xl font-bold text-slate-900">
                Visit Our Office
              </h3>
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-lg">📍</span>
                  <div>
                    <p className="font-medium text-slate-800">Address</p>
                    <p className="text-sm text-slate-500">
                      1938 Burdette
                      <br />
                      Ferndale, MI 48220
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-lg">📞</span>
                  <div>
                    <p className="font-medium text-slate-800">Phone</p>
                    <a
                      href="tel:313-427-4856"
                      className="text-sm text-slate-500 transition-colors hover:text-emerald-600"
                    >
                      (313) 427-4856
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-lg">✉️</span>
                  <div>
                    <p className="font-medium text-slate-800">Email</p>
                    <a
                      href="mailto:ajackstaxservice@gmail.com"
                      className="text-sm text-slate-500 transition-colors hover:text-emerald-600"
                    >
                      ajackstaxservice@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-lg">🕐</span>
                  <div>
                    <p className="font-medium text-slate-800">Hours</p>
                    <p className="text-sm text-slate-500">
                      Monday - Friday
                      <br />
                      4:00 PM - 8:00 PM
                    </p>
                  </div>
                </div>
              </div>
              <a
                href="tel:313-427-4856"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald-700 px-8 py-4 text-base font-bold tracking-wider text-white shadow-lg shadow-emerald-900/30 transition-all duration-300 hover:bg-emerald-600 hover:shadow-emerald-600/40 hover:-translate-y-0.5"
              >
                📞 Call (313) 427-4856
              </a>
            </div>

            {/* Quick contact form */}
            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="font-heading text-xl font-bold text-slate-900">
                Send Us a Message
              </h3>
              <form
                className="mt-6 space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  try {
                    await submitTaxLead({
                      data: {
                        name: formData.get("name") as string,
                        email: formData.get("email") as string,
                        message: formData.get("message") as string,
                      },
                    });
                    alert(
                      "Thank you for reaching out! We'll get back to you soon.",
                    );
                    form.reset();
                  } catch {
                    alert(
                      "Something went wrong. Please call us at (313) 427-4856.",
                    );
                  }
                }}
              >
                <input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Your email"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                />
                <textarea
                  name="message"
                  rows={4}
                  placeholder="How can we help you?"
                  required
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold tracking-wider text-white shadow-lg shadow-emerald-900/20 transition-all duration-300 hover:bg-emerald-600 hover:shadow-emerald-600/30 hover:-translate-y-0.5"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-slate-200/50 bg-slate-900 text-slate-300">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/web_dev_logo/110433228/ibYujiRLVNrymYHl.png"
                  alt="A Jack's Tax Service"
                  className="h-8 w-8 rounded-lg object-contain"
                />
                <h3 className="font-heading text-xl font-bold text-white">
                  A Jack's
                  <span className="text-emerald-400"> Tax Service</span>
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Professional tax preparation and bookkeeping services in
                Ferndale, MI. BBB Accredited.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold tracking-widest text-emerald-400 uppercase">
                Hours
              </h4>
              <p className="text-sm text-slate-400">
                Monday - Friday
                <br />
                4:00 PM - 8:00 PM
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Evening hours for your convenience
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold tracking-widest text-emerald-400 uppercase">
                Contact
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>1938 Burdette, Ferndale, MI 48220</li>
                <li>
                  <a
                    href="tel:313-427-4856"
                    className="transition-colors hover:text-emerald-400"
                  >
                    (313) 427-4856
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:ajackstaxservice@gmail.com"
                    className="transition-colors hover:text-emerald-400"
                  >
                    ajackstaxservice@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} A Jack's Tax Service. All rights
            reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}