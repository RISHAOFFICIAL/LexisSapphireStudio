import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { execute } from "~/db";

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

/* ---- Hooks ---- */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); o.unobserve(el); } },
      { threshold },
    );
    o.observe(el);
    return () => o.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---- Animated Counter ---- */
function Counter({ end, suffix = "", label }: { end: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useReveal(0.5);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(end / 60);
    const t = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(t); }
      else setCount(start);
    }, duration / 60);
    return () => clearInterval(t);
  }, [visible, end]);
  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-4xl font-bold text-emerald-600 sm:text-5xl">{count}{suffix}</div>
      <div className="mt-1 text-xs font-medium tracking-wider text-slate-500 uppercase">{label}</div>
    </div>
  );
}

/* ---- Refund Estimator ---- */
function RefundEstimator() {
  const [income, setIncome] = useState("");
  const [dependents, setDependents] = useState("0");
  const [result, setResult] = useState<string | null>(null);
  const calcRefund = (e: React.FormEvent) => {
    e.preventDefault();
    const inc = Number.parseFloat(income) || 0;
    const dep = Number.parseInt(dependents) || 0;
    const est = Math.max(0, inc * 0.12 + dep * 2000 - 500);
    const low = Math.round(est * 0.7);
    const high = Math.round(est * 1.3);
    setResult(`$${low.toLocaleString()} – $${high.toLocaleString()}`);
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h3 className="font-heading text-xl font-bold text-slate-900">Refund Estimator</h3>
      <p className="mt-1 text-xs text-slate-400">Quick estimate — actual refund may vary</p>
      <form onSubmit={calcRefund} className="mt-5 space-y-3">
        <div>
          <label className="text-xs font-medium text-slate-600">Annual Income</label>
          <input value={income} onChange={e => setIncome(e.target.value)} placeholder="$ e.g. 55000" className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Dependents</label>
          <select value={dependents} onChange={e => setDependents(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30">
            {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <button type="submit" className="w-full rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold tracking-wider text-white shadow-lg transition-all hover:bg-emerald-600 hover:-translate-y-0.5">Estimate Refund</button>
      </form>
      {result && (
        <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-center">
          <p className="text-xs text-slate-500">Estimated Refund Range</p>
          <p className="font-heading text-2xl font-bold text-emerald-700">{result}</p>
        </div>
      )}
    </div>
  );
}

/* ---- Services ---- */
const SERVICES = [
  { title: "Individual Tax Returns", desc: "Federal & state returns from simple filings to complex returns with investments, deductions, and credits.", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" },
  { title: "Business Taxes", desc: "Corporate returns, partnership filings, and self-employment tax for small businesses.", icon: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h12v2H6v-2zm0 4h8v2H6v-2z" },
  { title: "Year-Round Bookkeeping", desc: "Ongoing tracking of income, expenses, and financial records to keep you tax-ready.", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" },
  { title: "Rapid Refunds", desc: "Fast refund processing — up to $7,000. Maximum refund, minimum wait.", icon: "M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.59-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" },
  { title: "Same-Day Processing", desc: "Get your return prepared, reviewed, and filed in a single visit.", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-3l-4-4 1.41-1.41L12 14.17l4.59-4.59L18 11z" },
];

function ServiceIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-emerald-600" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

/* ---- Testimonials ---- */
const TESTIMONIALS = [
  { name: "Maria Gonzalez", text: "Jack made filing my taxes so easy. I got my refund in under a week! The evening hours are a lifesaver for working people.", stars: 5 },
  { name: "David Chen", text: "I've been going to A Jack's for 3 years now. Professional, thorough, and they always find me the best refund. Highly recommend!", stars: 5 },
  { name: "Tamara Wilson", text: "As a small business owner, I need someone who understands business taxes. A Jack's handles everything — from my LLC return to quarterly bookkeeping.", stars: 5 },
];

function TestimonialCard({ t, i }: { t: typeof TESTIMONIALS[0]; i: number }) {
  return (
    <Reveal delay={i * 100}>
      <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md">
        <div className="flex gap-0.5 text-amber-400 text-sm">{"★".repeat(t.stars)}{"☆".repeat(5 - t.stars)}</div>
        <p className="mt-3 text-sm italic leading-relaxed text-slate-600">"{t.text}"</p>
        <p className="mt-3 text-xs font-semibold text-slate-800">— {t.name}</p>
      </div>
    </Reveal>
  );
}

/* ---- Main ---- */
function AJackstaxPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pt-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] h-[60%] w-[50%] rounded-full bg-emerald-100/50 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-amber-100/30 blur-[100px]" />
          <div className="absolute top-[30%] right-[15%] h-32 w-32 rounded-full border-2 border-emerald-200/30" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <Reveal delay={0}>
            <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
              <img src="https://files.manuscdn.com/user_upload_by_module/web_dev_logo/110433228/ibYujiRLVNrymYHl.png" alt="A Jack's Tax Service" className="h-12 w-12 rounded-xl object-contain shadow-sm" />
              <span className="inline-block rounded-full border border-emerald-200/60 bg-white/70 px-4 py-1.5 text-xs font-medium tracking-wider text-emerald-700 uppercase backdrop-blur-sm">BBB Accredited Business</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Expert Tax Preparation{" "}
              <span className="relative">
                <span className="text-emerald-600">You Can Trust</span>
                <span className="absolute -bottom-1 left-0 right-0 h-2 bg-amber-200/50 -z-10 rounded-full" />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              Serving Ferndale and the greater Detroit area with professional tax
              preparation, bookkeeping, and financial services — all at convenient evening hours.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 shadow-sm">⚡ Rapid Refunds up to $7,000</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700 shadow-sm">📅 Same-Day Processing</span>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href="tel:313-427-4856" className="group relative inline-flex items-center gap-2 rounded-full bg-emerald-700 px-10 py-4 text-base font-bold tracking-wider text-white shadow-lg shadow-emerald-900/30 transition-all duration-300 hover:bg-emerald-600 hover:shadow-emerald-600/40 hover:-translate-y-0.5">
                📞 Call (313) 427-4856
                <span className="absolute -top-2 -right-2 flex h-5 w-5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-50"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span></span>
              </a>
              <a href="#contact" className="rounded-full border border-slate-300/60 bg-white/70 px-8 py-3.5 text-sm font-semibold tracking-wider text-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-slate-300 hover:bg-white hover:-translate-y-0.5">Visit Our Office</a>
            </div>
          </Reveal>
        </div>

        <div className="animate-fade-in absolute bottom-8 flex flex-col items-center gap-2">
          <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-slate-300 to-transparent" />
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="relative -mt-16 px-6">
        <div className="relative z-20 mx-auto max-w-4xl rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-md sm:p-12">
          <div className="grid grid-cols-3 gap-6 sm:gap-12">
            <Counter end={8} suffix="+" label="Years in Business" />
            <Counter end={1200} suffix="+" label="Returns Filed" />
            <Counter end={850} suffix="+" label="Clients Served" />
          </div>
        </div>
      </section>

      {/* ===== ABOUT + ESTIMATOR ===== */}
      <section id="about" className="mx-auto max-w-6xl px-6 pt-32 pb-24 sm:pb-32">
        <div className="grid items-start gap-12 md:grid-cols-5 md:gap-16">
          <div className="md:col-span-3">
            <Reveal>
              <span className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">About Us</span>
              <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">Professional tax service with a <span className="text-emerald-600">personal touch</span></h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                <p>At A Jack's Tax Service, we believe quality tax preparation shouldn't be complicated. Located in Ferndale, we've been helping individuals and small businesses navigate their taxes with confidence.</p>
                <p>As a <strong>BBB Accredited Business</strong>, we're committed to the highest standards of professionalism, accuracy, and integrity.</p>
                <p>We offer evening hours (Mon–Fri, 4–8 PM) and same-day processing to fit your schedule.</p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">✅ BBB Accredited</span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">📍 Ferndale, MI</span>
                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">⭐ 5-Star Service</span>
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-2">
            <Reveal delay={100}>
              <RefundEstimator />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="bg-slate-50/80 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center">
              <span className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">Why Choose Us</span>
              <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">Trusted by the Ferndale community</h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🏆", title: "BBB Accredited", desc: "Committed to the highest standards of integrity and professionalism." },
              { icon: "⭐", title: "5-Star Rated", desc: "Consistently receive top ratings from our satisfied clients." },
              { icon: "🕐", title: "Evening Hours", desc: "Open 4-8 PM weekdays — we work around your schedule." },
              { icon: "⚡", title: "Fast Processing", desc: "Same-day processing and rapid refunds — get your money fast." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="group rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md">
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="mt-3 font-heading text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center">
              <span className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">Our Services</span>
              <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">Everything you need, <span className="text-emerald-600">all in one place</span></h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">From individual returns to business taxes and bookkeeping — year-round.</p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((svc, i) => (
              <Reveal key={svc.title} delay={i * 80}>
                <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
                  <div className="absolute -top-8 -right-8 h-20 w-20 rounded-full bg-emerald-50 transition-all duration-500 group-hover:scale-[4] group-hover:opacity-5" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                    <ServiceIcon path={svc.icon} />
                  </div>
                  <h3 className="relative mt-4 font-heading text-xl font-bold text-slate-900">{svc.title}</h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-slate-500">{svc.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="bg-emerald-900 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center">
              <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">Testimonials</span>
              <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-white sm:text-4xl">What our clients say</h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} t={t} i={i} />)}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="relative overflow-hidden px-6 py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-emerald-100/30 blur-[100px]" />
          <div className="absolute top-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-amber-100/20 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <Reveal>
            <div className="text-center">
              <span className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">Contact Us</span>
              <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">Get in touch</h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">Stop by, give us a call, or send a message.</p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <Reveal delay={0}>
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="font-heading text-xl font-bold text-slate-900">Visit Our Office</h3>
                <div className="mt-6 space-y-4">
                  {[
                    ["📍", "Address", "1938 Burdette\nFerndale, MI 48220"],
                    ["📞", "Phone", "(313) 427-4856"],
                    ["✉️", "Email", "ajackstaxservice@gmail.com"],
                    ["🕐", "Hours", "Monday – Friday\n4:00 PM – 8:00 PM"],
                  ].map(([emoji, label, val]) => (
                    <div key={label} className="flex items-start gap-3">
                      <span className="mt-0.5 text-lg">{emoji}</span>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{label}</p>
                        <p className="text-sm text-slate-500 whitespace-pre-line">{val}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="tel:313-427-4856" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-8 py-4 text-base font-bold tracking-wider text-white shadow-lg transition-all duration-300 hover:bg-emerald-600 hover:-translate-y-0.5">📞 Call (313) 427-4856</a>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="font-heading text-xl font-bold text-slate-900">Send Us a Message</h3>
                <form className="mt-6 space-y-4" onSubmit={async e => {
                  e.preventDefault();
                  const f = e.currentTarget;
                  const d = new FormData(f);
                  try {
                    await submitTaxLead({ data: { name: d.get("name") as string, email: d.get("email") as string, message: d.get("message") as string } });
                    alert("Thank you! We'll get back to you soon.");
                    f.reset();
                  } catch { alert("Please call us at (313) 427-4856."); }
                }}>
                  <input name="name" type="text" placeholder="Your name" required className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30" />
                  <input name="email" type="email" placeholder="Your email" required className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30" />
                  <textarea name="message" rows={4} placeholder="How can we help you?" required className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30" />
                  <button type="submit" className="w-full rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold tracking-wider text-white shadow-lg transition-all duration-300 hover:bg-emerald-600 hover:-translate-y-0.5">Send Message</button>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-slate-200/50 bg-slate-900 text-slate-300">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <img src="https://files.manuscdn.com/user_upload_by_module/web_dev_logo/110433228/ibYujiRLVNrymYHl.png" alt="A Jack's Tax Service" className="h-8 w-8 rounded-lg object-contain" />
                <h3 className="font-heading text-xl font-bold text-white">A Jack's <span className="text-emerald-400">Tax Service</span></h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">Professional tax preparation and bookkeeping in Ferndale, MI. BBB Accredited.</p>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold tracking-widest text-emerald-400 uppercase">Hours</h4>
              <p className="text-sm text-slate-400">Monday – Friday<br />4:00 PM – 8:00 PM</p>
              <p className="mt-2 text-xs text-slate-500">Evening hours for your convenience</p>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold tracking-widest text-emerald-400 uppercase">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>1938 Burdette, Ferndale, MI 48220</li>
                <li><a href="tel:313-427-4856" className="transition-colors hover:text-emerald-400">(313) 427-4856</a></li>
                <li><a href="mailto:ajackstaxservice@gmail.com" className="transition-colors hover:text-emerald-400">ajackstaxservice@gmail.com</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-xs text-slate-500 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} A Jack's Tax Service. All rights reserved.</p>
            <p>Powered by <a href="/" className="font-medium text-emerald-400 transition-colors hover:text-emerald-300">Lexis Sapphire Studio</a></p>
          </div>
        </div>
      </footer>
    </main>
  );
}