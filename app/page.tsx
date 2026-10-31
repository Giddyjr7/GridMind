import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BatteryCharging,
  Check,
  Clock3,
  Factory,
  FileCheck2,
  Hospital,
  Layers3,
  ShieldCheck,
  ShoppingBasket,
  Snowflake,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { HeroDashboardPreview } from "@/components/marketing/hero-dashboard-preview";
import { InteractiveSimulatorPreview } from "@/components/marketing/interactive-preview";

const capabilities = [
  {
    icon: Layers3,
    title: "One view of every source",
    body: "See grid, solar, battery, generator and facility demand together—without reconciling separate dashboards.",
    meta: "Live source visibility",
  },
  {
    icon: Clock3,
    title: "Know your real backup window",
    body: "Model runtime against actual critical loads, reserve policy and current battery state before an outage becomes a crisis.",
    meta: "Continuity forecasting",
  },
  {
    icon: Sparkles,
    title: "Act on clear recommendations",
    body: "Turn operating conditions into practical actions with the reason, expected savings and affected equipment shown upfront.",
    meta: "Explainable guidance",
  },
  {
    icon: FileCheck2,
    title: "Keep every decision accountable",
    body: "Maintain a clear record of recommendations, operator approvals and outcomes for operational review.",
    meta: "Decision audit trail",
  },
];

const workflow = [
  ["01", "Connect", "Map power sources, storage capacity and the equipment that must stay online."],
  ["02", "Prioritize", "Group loads by operational importance, cost and safe deferral windows."],
  ["03", "Respond", "Review live forecasts and apply the best continuity action for the moment."],
  ["04", "Improve", "Compare outcomes, avoided fuel spend and recurring operating patterns."],
];

const industries = [
  {
    icon: Snowflake,
    title: "Cold chain",
    body: "Protect freezers and cold rooms while reducing unnecessary generator runtime.",
  },
  {
    icon: Hospital,
    title: "Healthcare",
    body: "Keep temperature-sensitive inventory and essential clinical equipment online.",
  },
  {
    icon: ShoppingBasket,
    title: "Retail",
    body: "Balance refrigeration, lighting and back-office demand during costly outages.",
  },
  {
    icon: Factory,
    title: "Light industry",
    body: "Sequence production loads around available power and reserve constraints.",
  },
];

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070a09] text-white selection:bg-emerald-400 selection:text-[#06110c]">
      <Navbar />

      <main>
        <section className="border-b border-white/[0.07] px-3 pb-16 pt-24 sm:px-5 md:pb-24 md:pt-28">
          <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[28px] border border-white/[0.1] bg-[#0b1713]">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 0%, rgba(52,211,153,.20), transparent 36%), radial-gradient(circle at 14% 42%, rgba(20,184,166,.12), transparent 24%), radial-gradient(circle at 86% 48%, rgba(74,222,128,.10), transparent 22%), linear-gradient(180deg, rgba(5,16,12,.05), rgba(4,9,7,.82))",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-45"
              style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,.42) .7px, transparent .7px)",
                backgroundSize: "26px 26px",
                maskImage: "linear-gradient(to bottom, black, transparent 78%)",
              }}
            />
            <div className="pointer-events-none absolute -left-28 top-48 h-80 w-80 rounded-full border border-emerald-300/[0.08]" />
            <div className="pointer-events-none absolute -right-32 top-24 h-[28rem] w-[28rem] rounded-full border border-emerald-300/[0.07]" />

            <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 pt-20 text-center sm:px-8 sm:pt-24">
              <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-300">
                Intelligent energy continuity
              </div>
              <h1 className="mt-6 text-[3.25rem] font-medium leading-[0.96] tracking-[-0.06em] text-white sm:text-6xl lg:text-[5.15rem]">
                Keep every critical
                <span className="block text-emerald-200">operation running.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300/80 sm:text-lg sm:leading-8">
                See supply, demand and reserve in one place. GridMind turns changing power
                conditions into clear actions your team can trust.
              </p>

              <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-6 text-sm font-semibold text-[#06110c] transition hover:bg-emerald-200"
                >
                  Start with GridMind
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-white/20 bg-black/10 px-6 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/[0.07]"
                >
                  Open live console
                </Link>
              </div>
            </div>

            <div className="relative z-10 mx-auto mt-16 max-w-5xl px-4 sm:mt-20 sm:px-10 lg:px-0">
              <HeroDashboardPreview />
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.07] bg-[#0a0e0c] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-400">
                  The operating reality
                </p>
                <h2 className="mt-5 max-w-xl text-3xl font-medium leading-tight tracking-[-0.035em] text-white sm:text-5xl">
                  Power decisions should not live in spreadsheets and phone calls.
                </h2>
              </div>

              <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
                {[
                  { icon: Zap, title: "Unstable supply", body: "Grid availability changes faster than most teams can coordinate." },
                  { icon: BatteryCharging, title: "Hidden reserve risk", body: "Battery percentages say little about what can safely stay online." },
                  { icon: Sun, title: "Underused assets", body: "Solar and storage often operate without a shared dispatch strategy." },
                  { icon: BarChart3, title: "Unclear cost impact", body: "Fuel spend and downtime risk are rarely visible in the same decision." },
                ].map(({ icon: ItemIcon, title, body }) => (
                  <article key={title} className="bg-[#0d1210] p-7 sm:p-8">
                    <ItemIcon className="h-5 w-5 text-emerald-400" />
                    <h3 className="mt-7 text-base font-semibold text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="product" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-400">The platform</p>
                <h2 className="mt-4 max-w-2xl text-3xl font-medium tracking-[-0.035em] text-white sm:text-5xl">
                  Everything needed to operate with confidence.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-500">
                A focused operating layer for facilities balancing unreliable supply,
                expensive backup generation and equipment that cannot fail.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {capabilities.map((capability, index) => {
                const Icon = capability.icon;
                return (
                  <article
                    key={capability.title}
                    className={`group rounded-2xl border border-white/[0.09] bg-white/[0.025] p-7 transition hover:border-emerald-400/30 hover:bg-white/[0.04] sm:p-9 ${index === 0 ? "md:row-span-2" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.16em] text-slate-600">
                        {capability.meta}
                      </span>
                    </div>
                    <h3 className={`mt-10 font-medium tracking-[-0.025em] text-white ${index === 0 ? "text-3xl" : "text-xl"}`}>
                      {capability.title}
                    </h3>
                    <p className={`mt-4 leading-7 text-slate-500 ${index === 0 ? "max-w-md text-base" : "text-sm"}`}>
                      {capability.body}
                    </p>
                    {index === 0 && (
                      <div className="mt-12 space-y-3 border-t border-white/[0.08] pt-6 text-sm text-slate-400">
                        {["Grid and generator state", "Solar and battery flow", "Critical and deferrable demand"].map((item) => (
                          <div key={item} className="flex items-center gap-3">
                            <Check className="h-4 w-4 text-emerald-400" />
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-white/[0.07] bg-[#0a0e0c] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-400">How it works</p>
              <h2 className="mt-4 text-3xl font-medium tracking-[-0.035em] text-white sm:text-5xl">
                From live conditions to a defensible action.
              </h2>
            </div>

            <div className="mt-14 grid gap-0 border-y border-white/10 md:grid-cols-4">
              {workflow.map(([number, title, body], index) => (
                <article
                  key={number}
                  className={`py-8 md:px-7 ${index > 0 ? "border-t border-white/10 md:border-l md:border-t-0" : ""}`}
                >
                  <span className="font-mono text-xs text-emerald-400">{number}</span>
                  <h3 className="mt-12 text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <InteractiveSimulatorPreview />

        <section id="solutions" className="border-t border-white/[0.07] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-400">Built for continuity</p>
                <h2 className="mt-4 text-3xl font-medium tracking-[-0.035em] text-white sm:text-5xl">
                  Where every minute of uptime matters.
                </h2>
                <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
                  GridMind is designed for operating environments where power quality,
                  fuel cost and equipment protection are business-critical.
                </p>
              </div>

              <div className="divide-y divide-white/10 border-y border-white/10">
                {industries.map((industry) => {
                  const Icon = industry.icon;
                  return (
                    <article key={industry.title} className="grid gap-4 py-6 sm:grid-cols-[48px_150px_1fr] sm:items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.04] text-emerald-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-semibold text-white">{industry.title}</h3>
                      <p className="text-sm leading-6 text-slate-500">{industry.body}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="why-gridmind" className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-emerald-400/20 bg-[#0d1511] px-6 py-14 sm:px-12 sm:py-16 lg:px-16">
            <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-400/[0.08] blur-3xl" />
            <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-sm text-emerald-300">
                  <ShieldCheck className="h-4 w-4" />
                  Built for human-led operations
                </div>
                <h2 className="mt-5 text-3xl font-medium leading-tight tracking-[-0.04em] text-white sm:text-5xl">
                  Make the next power decision with the full picture.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
                  Start with a guided workspace or explore the operational console using a realistic facility model.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-6 text-sm font-semibold text-[#06110c] transition hover:bg-emerald-300"
                >
                  Create a workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-white/15 px-6 text-sm font-medium text-white transition hover:bg-white/[0.05]"
                >
                  View demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
