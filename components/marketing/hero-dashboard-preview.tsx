"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  BatteryCharging,
  Check,
  CircleGauge,
  Cpu,
  Lightbulb,
  RotateCcw,
  Sun,
  Zap,
} from "lucide-react";

const scenes = [
  {
    label: "Normal operation",
    time: "14:32",
    status: "System stable",
    statusTone: "text-emerald-300 bg-emerald-400/10",
    runtime: "5h 20m",
    runtimeLabel: "Clean backup window",
    runtimeWidth: "72%",
    grid: ["42.5", "kW", "Band A · stable"],
    solar: ["38.4", "kW", "68% of demand"],
    battery: ["68", "%", "81.6 kWh stored"],
    generator: ["0.0", "kW", "Standby"],
    recommendation: "Pre-cool during the solar surplus window",
    explanation: "Build a thermal buffer before the predicted 16:00 feeder interruption.",
    impact: "Estimated diesel avoided · ₦18,500",
    alert: false,
  },
  {
    label: "Outage detected",
    time: "16:01",
    status: "Feeder offline",
    statusTone: "text-amber-300 bg-amber-400/10",
    runtime: "4h 08m",
    runtimeLabel: "Reserve under review",
    runtimeWidth: "58%",
    grid: ["0.0", "kW", "Utility interrupted"],
    solar: ["26.8", "kW", "Cloud cover"],
    battery: ["51", "%", "Discharging"],
    generator: ["0.0", "kW", "Held in reserve"],
    recommendation: "Protect refrigeration and defer comfort loads",
    explanation: "The current solar and battery mix can support all critical circuits without diesel.",
    impact: "Packaging HVAC deferred · 16 kW saved",
    alert: true,
  },
  {
    label: "Loads protected",
    time: "16:04",
    status: "Policy applied",
    statusTone: "text-cyan-300 bg-cyan-400/10",
    runtime: "5h 02m",
    runtimeLabel: "Runtime extended",
    runtimeWidth: "69%",
    grid: ["0.0", "kW", "Utility interrupted"],
    solar: ["25.9", "kW", "Supporting load"],
    battery: ["48", "%", "22.9 kW output"],
    generator: ["0.0", "kW", "Zero fuel burn"],
    recommendation: "Critical-load policy confirmed",
    explanation: "Blast freezers and cold storage remain fully protected while nonessential demand stays off.",
    impact: "Critical coverage · 100%",
    alert: false,
  },
  {
    label: "Grid recovery",
    time: "18:17",
    status: "Supply restored",
    statusTone: "text-emerald-300 bg-emerald-400/10",
    runtime: "Charging",
    runtimeLabel: "Reserve recovery",
    runtimeWidth: "84%",
    grid: ["44.1", "kW", "Voltage stabilized"],
    solar: ["8.2", "kW", "Evening output"],
    battery: ["56", "%", "Recharging"],
    generator: ["0.0", "kW", "Standby"],
    recommendation: "Restore deferred loads in sequence",
    explanation: "Grid quality is stable. Recover battery reserve before returning comfort loads.",
    impact: "No generator start required",
    alert: false,
  },
];

const sourceIcons = [Zap, Sun, BatteryCharging, Cpu];
const sourceLabels = ["Grid", "Solar", "Battery", "Generator"];
const sourceAccents = ["text-emerald-300", "text-amber-300", "text-cyan-300", "text-slate-400"];

export function HeroDashboardPreview() {
  const [activeScene, setActiveScene] = React.useState(0);
  const scene = scenes[activeScene];

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveScene((current) => (current + 1) % scenes.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, []);

  const sources = [scene.grid, scene.solar, scene.battery, scene.generator];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.13] bg-[#080c0b]/95 shadow-[0_28px_90px_rgba(0,0,0,.55)] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-emerald-400 text-[#06110c]">
            <Zap className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-white">Krystal Ice · Energy operations</p>
            <p className="text-[9px] text-slate-600">Uyo facility · live simulation</p>
          </div>
        </div>
        <div className="hidden items-center gap-5 text-[9px] text-slate-600 sm:flex">
          <span className="text-slate-300">Overview</span>
          <span>Assets</span>
          <span>Decisions</span>
          <span>Reports</span>
        </div>
      </div>

      <div key={activeScene} className="hero-film-frame p-4 sm:p-5" aria-live="polite">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              {scene.alert ? (
                <AlertTriangle className="h-3.5 w-3.5 text-amber-300" />
              ) : (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
              )}
              <p className="text-xs font-semibold text-white">{scene.label}</p>
            </div>
            <p className="mt-1 pl-4 font-mono text-[9px] text-slate-600">{scene.time} WAT · automatic sequence</p>
          </div>
          <span className={`w-fit rounded-md px-2 py-1 font-mono text-[9px] uppercase tracking-wider ${scene.statusTone}`}>
            {scene.status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {sources.map(([value, unit, detail], index) => {
            const Icon = sourceIcons[index];
            return (
              <div key={sourceLabels[index]} className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">{sourceLabels[index]}</span>
                  <Icon className={`h-3.5 w-3.5 ${sourceAccents[index]}`} />
                </div>
                <div className="mt-4">
                  <span className="font-mono text-xl font-semibold tracking-tight text-white">{value}</span>
                  <span className="ml-1 text-[10px] text-slate-500">{unit}</span>
                </div>
                <p className="mt-1 text-[9px] text-slate-600">{detail}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.045] p-4">
            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-emerald-300">
              <CircleGauge className="h-3.5 w-3.5" />
              {scene.runtimeLabel}
            </div>
            <p className="mt-4 font-mono text-2xl font-semibold tracking-tight text-white sm:text-3xl">{scene.runtime}</p>
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-emerald-400 transition-[width] duration-700"
                style={{ width: scene.runtimeWidth }}
              />
            </div>
            <p className="mt-3 text-[9px] leading-4 text-slate-500">
              Runtime updates as supply and active demand change.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] uppercase tracking-[0.14em] text-slate-500">Priority dispatch</p>
              <span className="font-mono text-[9px] text-slate-600">Critical first</span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["Blast freezer A", "29.8 kW", "bg-emerald-400"],
                ["Cold storage B", "21.5 kW", "bg-emerald-400"],
                ["Warehouse lighting", "4.6 kW", "bg-amber-400"],
              ].map(([label, value, dot]) => (
                <div key={label} className="flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-2 text-slate-400">
                    <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                    {label}
                  </span>
                  <span className="font-mono text-slate-300">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3 text-[10px]">
              <span className="text-slate-600">Packaging HVAC</span>
              <span className="flex items-center gap-1 text-amber-300">
                <Check className="h-3 w-3" /> {activeScene === 0 ? "Scheduled" : "Deferred"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-emerald-400/20 bg-[#0d1813] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400 text-[#06110c]">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold text-white">{scene.recommendation}</p>
                <span className="font-mono text-[9px] text-emerald-300">Live guidance</span>
              </div>
              <p className="mt-2 text-[10px] leading-4 text-slate-400">{scene.explanation}</p>
              <div className="mt-3 flex items-center justify-between border-t border-emerald-400/10 pt-3">
                <span className="text-[10px] font-medium text-emerald-300">{scene.impact}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.08] px-4 py-3 sm:px-5">
        <div className="flex flex-1 gap-2">
          {scenes.map((item, index) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveScene(index)}
              className="group flex flex-1 flex-col gap-1.5 text-left"
              aria-label={`Show ${item.label}`}
              aria-current={activeScene === index ? "step" : undefined}
            >
              <span className={`h-0.5 w-full rounded-full transition ${activeScene === index ? "bg-emerald-400" : "bg-white/10 group-hover:bg-white/20"}`} />
              <span className={`hidden text-[8px] sm:block ${activeScene === index ? "text-slate-300" : "text-slate-600"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setActiveScene(0)}
          className="ml-4 hidden items-center gap-1 text-[9px] text-slate-600 transition hover:text-slate-300 sm:flex"
          aria-label="Restart product sequence"
        >
          <RotateCcw className="h-3 w-3" />
          Replay
        </button>
      </div>
    </div>
  );
}
