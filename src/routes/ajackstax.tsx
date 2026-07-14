import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { execute } from "~/db";

const submitTaxLead = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { name: string; email: string; message: string } }) => {
    execute("INSERT INTO leads (name, email, project_type, message) VALUES (?, ?, ?, ?)",
      [data.name, data.email, "Tax Service Inquiry", `[A Jack's Tax Service] ${data.message}`]);
    return { ok: true };
  },
);

export const Route = createFileRoute("/ajackstax")({ component: AJackstaxPage });

/* ---- Hooks ---- */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); o.unobserve(el); } }, { threshold });
    o.observe(el); return () => o.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Counter({ end, suffix = "", label }: { end: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useReveal(0.4);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.max(1, Math.ceil(end / 50));
    const t = setInterval(() => { start += step; if (start >= end) { setCount(end); clearInterval(t); } else setCount(start); }, 30);
    return () => clearInterval(t);
  }, [visible, end]);
  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-4xl font-bold text-sapphire-700 sm:text-5xl">{count}{suffix}</div>
      <div className="mt-1.5 text-xs font-medium tracking-widest text-sapphire-400 uppercase">{label}</div>
    </div>
  );
}

function RefundEstimator() {
  const [income, setIncome] = useState(""); const [dependents, setDependents] = useState("0"); const [result, setResult] = useState<string | null>(null);
  return (
    <div className="rounded-xl border border-sapphire-100 bg-white p-8 shadow-sm">
      <h3 className="font-heading text-xl font-bold text-sapphire-900">Refund Estimator</h3>
      <p className="mt-1 text-xs text-sapphire-400">Quick estimate — actual refund may vary</p>
      <form onSubmit={e => { e.preventDefault(); const inc = Number.parseFloat(income) || 0; const dep = Number.parseInt(dependents) || 0; const est = Math.max(0, inc * 0.12 + dep * 2000 - 500); setResult(`$${Math.round(est * 0.7).toLocaleString()} – $${Math.round(est * 1.3).toLocaleString()}`); }} className="mt-5 space-y-3">
        <div>
          <label className="text-xs font-medium text-sapphire-600">Annual Income</label>
          <input value={income} onChange={e => setIncome(e.target.value)} placeholder="$ e.g. 55,000" className="mt-1 w-full rounded-lg border border-sapphire-200 px-4 py-2.5 text-sm text-sapphire-900 placeholder-sapphire-400 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30" />
        </div>
        <div>
          <label className="text-xs font-medium text-sapphire-600">Dependents</label>
          <select value={dependents} onChange={e => setDependents(e.target.value)} className="mt-1 w-full rounded-lg border border-sapphire-200 px-4 py-2.5 text-sm text-sapphire-900 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30">
            {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <button type="submit" className="w-full rounded-full bg-sapphire-800 px-5 py-2.5 text-sm font-semibold tracking-wider text-white shadow-lg transition-all hover:bg-gold-500 hover:-translate-y-0.5">Estimate Refund</button>
      </form>
      {result && <div className="mt-4 rounded-lg bg-sapphire-50 p-4 text-center"><p className="text-xs text-sapphire-500">Estimated Refund Range</p><p className="font-heading text-2xl font-bold text-sapphire-700">{result}</p></div>}
    </div>
  );
}

const SERVICES = [
  { title: "Individual Tax Returns", desc: "Federal & state returns from simple filings to complex returns with investments, deductions, and credits." },
  { title: "Business Taxes", desc: "Corporate returns, partnership filings, and self-employment tax for small businesses." },
  { title: "Year-Round Bookkeeping", desc: "Ongoing tracking of income, expenses, and financial records to keep you tax-ready." },
  { title: "Rapid Refunds", desc: "Fast refund processing — up to $7,000. Maximum refund, minimum wait." },
  { title: "Same-Day Processing", desc: "Get your return prepared, reviewed, and filed in a single visit." },
];

const TESTIMONIALS = [
  { name: "Maria Gonzalez", text: "Jack made filing my taxes so easy. I got my refund in under a week! The evening hours are a lifesaver for working people." },
  { name: "David Chen", text: "I've been going to A Jack's for 3 years now. Professional, thorough, and they always find me the best refund." },
  { name: "Tamara Wilson", text: "As a small business owner, I need someone who understands business taxes. A Jack's handles everything from my LLC return to quarterly bookkeeping." },
];

function AJackstaxPage() {
  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pt-20 bg-cream">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-15%] right-[-10%] h-[50%] w-[50%] rounded-full bg-sapphire-100/40 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-gold-100/30 blur-[100px]" />
          {/* Geometric decorative pattern */}
          <svg className="absolute top-1/4 left-[5%] h-32 w-32 text-sapphire-100/30" viewBox="0 0 100 100" fill="currentColor"><polygon points="50,0 100,50 50,100 0,50" /><rect x="25" y="25" width="50" height="50" rx="4" /></svg>
          <svg className="absolute bottom-1/4 right-[8%] h-24 w-24 text-gold-200/20" viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="40" /><circle cx="50" cy="50" r="25" fill="white" /></svg>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <Reveal delay={0}>
            <div className="mb-6 flex flex-wrap items-center justify-center gap-4">
              <img src="https://files.manuscdn.com/user_upload_by_module/web_dev_logo/110433228/ibYujiRLVNrymYHl.png" alt="A Jack's Tax Service" className="h-14 w-14 rounded-xl object-contain shadow-lg shadow-sapphire-900/10 ring-1 ring-sapphire-200" />
              <span className="inline-block rounded-full border border-sapphire-200/60 bg-white/70 px-4 py-1.5 text-xs font-medium tracking-wider text-sapphire-600 uppercase backdrop-blur-sm">BBB Accredited</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Expert Tax Preparation{" "}
              <span className="relative inline-block">
                <span className="gradient-text">You Can Trust</span>
                <span className="absolute -bottom-2 left-0 right-0 h-2.5 bg-gold-200/40 -z-10 rounded-full" />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-sapphire-600 sm:text-xl">
              Serving Ferndale and the greater Detroit area with professional tax
              preparation, bookkeeping, and financial services — all at convenient evening hours.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sapphire-100 px-4 py-1.5 text-sm font-medium text-sapphire-700 shadow-sm">⚡ Rapid Refunds up to $7,000</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-4 py-1.5 text-sm font-medium text-gold-700 shadow-sm">📅 Same-Day Processing</span>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href="tel:313-427-4856" className="group relative rounded-full bg-sapphire-800 px-10 py-4 text-base font-bold tracking-wider text-white shadow-lg shadow-sapphire-900/30 transition-all duration-300 hover:bg-gold-500 hover:shadow-gold-500/30 hover:-translate-y-0.5">
                📞 Call (313) 427-4856
              </a>
              <a href="#contact" className="rounded-full border border-sapphire-300/60 bg-white/70 px-8 py-3.5 text-sm font-semibold tracking-wider text-sapphire-700 backdrop-blur-sm transition-all duration-300 hover:border-sapphire-300 hover:bg-white hover:-translate-y-0.5">Visit Our Office</a>
            </div>
          </Reveal>
        </div>

        <div className="animate-fade-in absolute bottom-8 flex flex-col items-center gap-2">
          <span className="text-xs font-medium tracking-wider text-sapphire-400 uppercase">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-sapphire-300 to-transparent" />
        </div>
      </section>

      {/* ===== STATS OVERLAP ===== */}
      <section className="relative -mt-16 px-6">
        <div className="relative z-20 mx-auto max-w-4xl rounded-2xl border border-sapphire-100/80 bg-white/90 p-8 shadow-xl shadow-sapphire-900/5 backdrop-blur-md sm:p-12">
          <div className="grid grid-cols-3 gap-0 sm:gap-4">
            <Counter end={8} suffix="+" label="Years in Business" />
            <div className="hidden h-16 w-px self-center bg-sapphire-200 sm:block" />
            <Counter end={1200} suffix="+" label="Returns Filed" />
            <div className="hidden h-16 w-px self-center bg-sapphire-200 sm:block" />
            <Counter end={850} suffix="+" label="Clients Served" />
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="mx-auto max-w-6xl px-6 pt-32 pb-24 sm:pb-32">
        <div className="grid items-start gap-12 md:grid-cols-5 md:gap-16">
          <div className="md:col-span-3">
            <Reveal>
              <span className="text-xs font-semibold tracking-widest text-gold-500 uppercase">About</span>
              <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-sapphire-900 sm:text-4xl">
                Professional tax service with a <span className="text-gold-500">personal touch</span>
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-sapphire-600">
                <p>At A Jack's Tax Service, we believe quality tax preparation shouldn't be complicated. Located in the heart of Ferndale, we've been helping individuals and small businesses navigate their taxes with confidence and ease.</p>
                <p>As a <strong>BBB Accredited Business</strong>, we're committed to the highest standards of professionalism, accuracy, and integrity — whether filing annual returns, starting a business, or managing year-round bookkeeping.</p>
                <p>We offer evening hours (Mon–Fri, 4–8 PM) and same-day processing to fit your schedule. Your financial peace of mind is just a visit away.</p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-sapphire-100 px-3 py-1 text-xs font-medium text-sapphire-700">✅ BBB Accredited</span>
                <span className="inline-flex items-center rounded-full bg-sapphire-100 px-3 py-1 text-xs font-medium text-sapphire-700">📍 Ferndale, MI</span>
                <span className="inline-flex items-center rounded-full bg-gold-100 px-3 py-1 text-xs font-medium text-gold-700">⭐ 5-Star Service</span>
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-2">
            <Reveal delay={100}>
              <div className="relative">
                <RefundEstimator />
                <div className="absolute -top-3 -right-3 -z-10 h-16 w-16 rounded-full border-2 border-gold-300/40" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="bg-sapphire-50/60 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center">
              <span className="text-xs font-semibold tracking-widest text-gold-500 uppercase">Why Choose Us</span>
              <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-sapphire-900 sm:text-4xl">Trusted by the Ferndale community</h2>
              <div className="mx-auto mt-4 h-px w-16 bg-gold-400" />
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
                <div className="group rounded-xl border border-sapphire-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-lg hover:shadow-gold-500/5">
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="mt-3 font-heading text-base font-bold text-sapphire-900">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-sapphire-500">{item.desc}</p>
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
              <span className="text-xs font-semibold tracking-widest text-gold-500 uppercase">Services</span>
              <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-sapphire-900 sm:text-4xl">
                Everything you need, <span className="text-gold-500">all in one place</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-sapphire-500">From individual returns to business taxes and bookkeeping — year-round.</p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((svc, i) => (
              <Reveal key={svc.title} delay={i * 80}>
                <div className="group relative overflow-hidden rounded-xl border border-sapphire-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-lg hover:shadow-gold-500/5">
                  <div className="absolute top-0 right-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-sapphire-50 transition-all duration-500 group-hover:scale-[6] group-hover:opacity-0" />
                  <div className="relative mb-4 h-10 w-10 rounded-lg bg-sapphire-100 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-sapphire-700" aria-hidden="true">
                      {i === 0 && <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>}
                      {i === 1 && <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h12v2H6v-2zm0 4h8v2H6v-2z"/>}
                      {i === 2 && <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>}
                      {i === 3 && <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.59-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>}
                      {i === 4 && <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-3l-4-4 1.41-1.41L12 14.17l4.59-4.59L18 11z"/>}
                    </svg>
                  </div>
                  <h3 className="relative font-heading text-xl font-bold text-sapphire-900">{svc.title}</h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-sapphire-500">{svc.desc}</p>
                  <div className="relative mt-4 h-px w-0 bg-gold-400 transition-all duration-300 group-hover:w-full" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="bg-sapphire-900 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center">
              <span className="text-xs font-semibold tracking-widest text-gold-400 uppercase">Testimonials</span>
              <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-white sm:text-4xl">What our clients say</h2>
              <div className="mx-auto mt-4 h-px w-16 bg-gold-500" />
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group rounded-xl border border-sapphire-700/50 bg-sapphire-950/50 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/30">
                  <div className="flex gap-0.5 text-gold-400 text-sm">★★★★★</div>
                  <p className="mt-3 text-sm italic leading-relaxed text-sapphire-300">"{t.text}"</p>
                  <div className="mt-4 h-px w-8 bg-gold-500/40" />
                  <p className="mt-3 text-xs font-semibold text-sapphire-200">— {t.name}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="relative overflow-hidden bg-cream px-6 py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-sapphire-100/30 blur-[100px]" />
          <div className="absolute top-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-gold-100/20 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <Reveal>
            <div className="text-center">
              <span className="text-xs font-semibold tracking-widest text-gold-500 uppercase">Contact</span>
              <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-sapphire-900 sm:text-4xl">Get in touch</h2>
              <div className="mx-auto mt-4 h-px w-16 bg-gold-400" />
              <p className="mx-auto mt-4 max-w-xl text-base text-sapphire-500">Stop by our office, give us a call, or send an email.</p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <Reveal delay={0}>
              <div className="rounded-xl border border-sapphire-100 bg-white p-8 shadow-sm">
                <h3 className="font-heading text-xl font-bold text-sapphire-900">Visit Our Office</h3>
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
                        <p className="font-medium text-sapphire-800 text-sm">{label}</p>
                        <p className="text-sm text-sapphire-500 whitespace-pre-line">{val}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="tel:313-427-4856" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sapphire-800 px-8 py-4 text-base font-bold tracking-wider text-white shadow-lg transition-all duration-300 hover:bg-gold-500 hover:-translate-y-0.5">📞 Call (313) 427-4856</a>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="rounded-xl border border-sapphire-100 bg-white p-8 shadow-sm">
                <h3 className="font-heading text-xl font-bold text-sapphire-900">Send a Message</h3>
                <form className="mt-6 space-y-4" onSubmit={async e => {
                  e.preventDefault(); const f = e.currentTarget; const d = new FormData(f);
                  try { await submitTaxLead({ data: { name: d.get("name") as string, email: d.get("email") as string, message: d.get("message") as string } }); alert("Thank you! We'll be in touch soon."); f.reset(); }
                  catch { alert("Please call (313) 427-4856."); }
                }}>
                  <input name="name" type="text" placeholder="Your name" required className="w-full rounded-lg border border-sapphire-200 px-4 py-3 text-sm text-sapphire-900 placeholder-sapphire-400 transition-colors focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30" />
                  <input name="email" type="email" placeholder="Your email" required className="w-full rounded-lg border border-sapphire-200 px-4 py-3 text-sm text-sapphire-900 placeholder-sapphire-400 transition-colors focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30" />
                  <textarea name="message" rows={4} placeholder="How can we help you?" required className="w-full resize-none rounded-lg border border-sapphire-200 px-4 py-3 text-sm text-sapphire-900 placeholder-sapphire-400 transition-colors focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30" />
                  <button type="submit" className="w-full rounded-full bg-sapphire-800 px-6 py-3 text-sm font-semibold tracking-wider text-white shadow-lg transition-all hover:bg-gold-500 hover:-translate-y-0.5">Send Message</button>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-sapphire-100/50 bg-sapphire-950 text-sapphire-300">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <img src="https://files.manuscdn.com/user_upload_by_module/web_dev_logo/110433228/ibYujiRLVNrymYHl.png" alt="" className="h-8 w-8 rounded-lg object-contain" />
                <h3 className="font-heading text-xl font-bold text-white">A Jack's <span className="text-gold-400">Tax Service</span></h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-sapphire-400">Professional tax preparation and bookkeeping in Ferndale, MI.</p>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold tracking-widest text-gold-400 uppercase">Hours</h4>
              <p className="text-sm text-sapphire-400">Monday – Friday<br />4:00 PM – 8:00 PM</p>
              <p className="mt-2 text-xs text-sapphire-500">Evening hours for your convenience</p>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold tracking-widest text-gold-400 uppercase">Contact</h4>
              <ul className="space-y-2 text-sm text-sapphire-400">
                <li>1938 Burdette, Ferndale, MI 48220</li>
                <li><a href="tel:313-427-4856" className="transition-colors hover:text-gold-400">(313) 427-4856</a></li>
                <li><a href="mailto:ajackstaxservice@gmail.com" className="transition-colors hover:text-gold-400">ajackstaxservice@gmail.com</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-sapphire-800 pt-8 text-xs text-sapphire-500 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} A Jack's Tax Service. All rights reserved.</p>
            <p>Powered by <a href="/" className="font-medium text-gold-400 transition-colors hover:text-gold-300">Lexis Sapphire Studio</a></p>
          </div>
        </div>
      </footer>
    </main>
  );
}