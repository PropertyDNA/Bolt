import { Link } from "wouter";
import { motion } from "framer-motion";
import { ScanLine, ShieldCheck, Wrench, TrendingUp, ArrowRight, Hop as Home, Zap, Droplets, CircleCheck as CheckCircle2 } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ScoreRing } from "../components/ScoreRing";

const features = [
  {
    icon: ScanLine,
    title: "Property Scan",
    description:
      "Walk through your property with your phone. Our guided scan captures every major system and component in minutes.",
  },
  {
    icon: ShieldCheck,
    title: "Property Score",
    description:
      "Get a component-by-component health score with an overall grade from A to F, weighted by what matters most.",
  },
  {
    icon: Wrench,
    title: "Repair Cost Engine",
    description:
      "AI-powered estimates for every component, with urgency timelines and remaining useful life projections.",
  },
  {
    icon: TrendingUp,
    title: "Risk Assessment",
    description:
      "Understand your property's risk level and get a prioritized action plan before small issues become big bills.",
  },
];

const steps = [
  {
    number: "01",
    title: "Walk & Scan",
    description:
      "Open the app on your phone and walk through each room. The guided scan prompts you to check 10 key components — roof, foundation, HVAC, plumbing, and more.",
  },
  {
    number: "02",
    title: "Score & Analyze",
    description:
      "Rate each component's condition on a simple 1-5 scale. PropertyDNA instantly calculates a weighted overall score and letter grade.",
  },
  {
    number: "03",
    title: "Plan & Act",
    description:
      "Review your estimated repair costs, urgency timeline, and risk level. Know exactly what to fix first and what can wait.",
  },
];

const componentIcons: Record<string, typeof Home> = {
  roof: Home,
  hvac: Zap,
  plumbing: Droplets,
  electrical: Zap,
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="dark" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.08),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-400" />
                <span className="text-sm font-medium text-brand-300">
                  AI-Powered Property Intelligence
                </span>
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Know your home{" "}
                <span className="text-brand-400">inside and out</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-navy-200">
                PropertyDNA gives every property a living digital twin. Run a
                phone walkthrough, get a component-by-component Property Score,
                and let AI estimate repair costs and risk.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/scan"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 hover:shadow-brand-500/40"
                >
                  Start a Property Scan
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-600 bg-navy-800/50 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:border-navy-500 hover:bg-navy-800"
                >
                  View Dashboard
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm text-navy-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-400" />
                  10 components scored
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-400" />
                  Repair cost estimates
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-400" />
                  Risk timeline
                </div>
              </div>
            </motion.div>

            {/* Hero visual: demo score card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="mx-auto max-w-sm rounded-3xl border border-navy-600/50 bg-navy-800/60 p-8 shadow-2xl backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-navy-300">Property Score</p>
                    <p className="text-lg font-semibold text-white">
                      123 Maple Street
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300">
                    Moderate Risk
                  </span>
                </div>
                <div className="flex justify-center py-4">
                  <ScoreRing score={72} size={180} />
                </div>
                <div className="mt-4 space-y-2.5">
                  {[
                    { name: "Roof", score: 4, cost: "$2,400" },
                    { name: "HVAC System", score: 2, cost: "$4,800" },
                    { name: "Foundation", score: 5, cost: "$0" },
                  ].map((c) => {
                    const Icon = componentIcons[c.name.toLowerCase().split(" ")[0]] || Home;
                    return (
                      <div
                        key={c.name}
                        className="flex items-center justify-between rounded-xl bg-navy-700/50 px-4 py-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-brand-400" />
                          <span className="text-sm font-medium text-white">
                            {c.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-navy-300">{c.cost}</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={`h-1.5 w-4 rounded-full ${
                                  i < c.score
                                    ? c.score >= 4
                                      ? "bg-brand-400"
                                      : c.score >= 3
                                        ? "bg-amber-400"
                                        : "bg-red-400"
                                    : "bg-navy-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-navy-600/50 pt-4">
                  <span className="text-sm text-navy-300">Est. Repair Total</span>
                  <span className="text-xl font-bold text-brand-400">$14,200</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              Everything you need to understand your property
            </h2>
            <p className="mt-4 text-lg text-navy-500">
              From first walkthrough to prioritized repair plan — PropertyDNA
              covers the full lifecycle.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition hover:border-brand-200 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 transition group-hover:bg-brand-100">
                  <f.icon className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-navy-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-navy-500">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-navy-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-navy-500">
              Three simple steps from walkthrough to action plan.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative"
              >
                <div className="rounded-2xl bg-white p-8 shadow-sm">
                  <span className="text-5xl font-extrabold text-brand-200">
                    {step.number}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-navy-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm text-navy-500">
                    {step.description}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 md:block">
                    <ArrowRight className="h-6 w-6 text-navy-200" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/scan"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600"
            >
              Try it now — it takes 5 minutes
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Components grid */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              10 components. One complete picture.
            </h2>
            <p className="mt-4 text-lg text-navy-500">
              Every major system in your home, scored and costed.
            </p>
          </div>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { name: "Roof", cat: "Exterior" },
              { name: "Foundation", cat: "Structural" },
              { name: "HVAC", cat: "Mechanical" },
              { name: "Plumbing", cat: "Mechanical" },
              { name: "Electrical", cat: "Mechanical" },
              { name: "Siding", cat: "Exterior" },
              { name: "Windows", cat: "Exterior" },
              { name: "Insulation", cat: "Interior" },
              { name: "Water Heater", cat: "Mechanical" },
              { name: "Garage", cat: "Exterior" },
            ].map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-xl border border-navy-100 bg-white p-4 text-center shadow-sm transition hover:border-brand-200 hover:shadow-md"
              >
                <p className="font-semibold text-navy-800">{c.name}</p>
                <p className="mt-1 text-xs text-navy-400">{c.cat}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-navy-800 to-navy-900 py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to know your property's DNA?
          </h2>
          <p className="mt-4 text-lg text-navy-200">
            Start your first scan in under five minutes. No account required.
          </p>
          <Link
            href="/scan"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-brand-500/30 transition hover:bg-brand-600"
          >
            Start Your Free Scan
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
