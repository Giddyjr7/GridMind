import Link from "next/link";
import { GridMindLogo } from "@/components/brand/gridmind-logo";

const footerGroups = [
  {
    title: "Platform",
    links: [
      ["Overview", "#product"],
      ["How it works", "#how-it-works"],
      ["Live simulator", "#simulator-preview"],
      ["Operational console", "/dashboard"],
    ],
  },
  {
    title: "Solutions",
    links: [
      ["Cold chain", "#solutions"],
      ["Healthcare", "#solutions"],
      ["Retail", "#solutions"],
      ["Light industry", "#solutions"],
    ],
  },
  {
    title: "Access",
    links: [
      ["Sign in", "/login"],
      ["Create workspace", "/signup"],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#060807] text-slate-500">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm">
            <Link href="/" aria-label="GridMind home">
              <GridMindLogo inverse markClassName="h-9 w-9" />
            </Link>
            <p className="mt-5 text-sm leading-6 text-slate-500">
              A clearer operating layer for commercial energy continuity.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Simulation environment online
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-semibold text-slate-300">{group.title}</h3>
                <ul className="mt-5 space-y-3">
                  {group.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-xs transition hover:text-white">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/[0.07] pt-6 text-[11px] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GridMind. All rights reserved.</p>
          <p>Human-led energy operations · synthetic demo data</p>
        </div>
      </div>
    </footer>
  );
}
