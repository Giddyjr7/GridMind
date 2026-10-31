"use client";

import * as React from "react";
import Link from "next/link";
import { Battery, Fuel, Sun, Zap } from "lucide-react";
import { useScenario } from "@/context/scenario-context";
import { useRegisteredSite } from "@/hooks/use-registered-site";

interface SourceStat {
  label: string;
  value: string;
}

interface SourceCardProps {
  title: string;
  icon: React.ElementType;
  accent: string;
  /** Null when the site has not declared this source. */
  rating: string | null;
  status: { label: string; tone: "ok" | "idle" | "bad" };
  stats: SourceStat[];
}

const toneStyles: Record<SourceCardProps["status"]["tone"], string> = {
  ok: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  idle: "bg-white/[0.04] text-slate-400 border-white/[0.08]",
  bad: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

function SourceCard({ title, icon: Icon, accent, rating, status, stats }: SourceCardProps) {
  const configured = rating !== null;

  return (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 ${accent}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">{title}</h4>
            <p className="text-[11px] text-slate-400 truncate">
              {configured ? rating : "Not configured for this site"}
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase border shrink-0 ${toneStyles[status.tone]}`}>
          {status.label}
        </span>
      </div>

      {configured ? (
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04]">
          {stats.map((stat) => (
            <div key={stat.label} className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
              <span className="text-[10px] text-slate-400 block">{stat.label}</span>
              <span className="text-sm font-mono font-semibold text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="pt-2 border-t border-white/[0.04] text-[11px] text-slate-500">
          Declare its rating in{" "}
          <Link href="/dashboard/settings" className="text-emerald-400 hover:underline">
            Settings
          </Link>{" "}
          to include it in runtime and cost calculations.
        </p>
      )}
    </div>
  );
}

/**
 * Supply assets as the site declared them.
 *
 * These cards used to carry fixed labels — a named generator model, a "75 kWp"
 * canopy — regardless of what the site owned, which left a 75 kWp heading
 * sitting above a 0 kWp reading. Each card now reflects the registration, and
 * says plainly when a source was never configured.
 */
export function ConfiguredSources() {
  const { inputs, outputs } = useScenario();
  const { registration } = useRegisteredSite();
  const sources = registration?.sources;

  const solarKwp = sources?.solarCapacityKwp ?? inputs.solar.installedCapacityKwp;
  const batteryKwh = sources?.batteryCapacityKwh ?? inputs.battery.totalCapacityKwh;
  const generatorKva = sources?.generatorCapacityKva ?? 0;
  const configuredCount = 1 + [solarKwp, batteryKwh, generatorKva].filter((value) => value > 0).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
        <div>
          <h3 className="text-sm font-semibold text-white">Energy sources</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {configuredCount} of 4 configured for {registration?.name ?? "this site"}.
          </p>
        </div>
        <Zap className="h-4 w-4 text-blue-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SourceCard
          title="National Grid Feeder"
          icon={Zap}
          accent="bg-blue-500/10 border-blue-500/20 text-blue-400"
          rating={`Utility supply at ₦${inputs.grid.tariffPerKwh}/kWh`}
          status={
            inputs.grid.isAvailable
              ? { label: "Online", tone: "ok" }
              : { label: "Outage", tone: "bad" }
          }
          stats={[
            { label: "Dispatch", value: `${outputs.dispatch.gridKw} kW` },
            { label: "Tariff Band", value: `₦${inputs.grid.tariffPerKwh}/kWh` },
            { label: "Voltage", value: inputs.grid.isAvailable ? "408V" : "0V" },
          ]}
        />

        <SourceCard
          title="Solar PV Array"
          icon={Sun}
          accent="bg-amber-500/10 border-amber-500/20 text-amber-400"
          rating={solarKwp > 0 ? `${solarKwp} kWp installed capacity` : null}
          status={
            solarKwp > 0 && inputs.solar.isEnabled
              ? { label: "Generating", tone: "ok" }
              : { label: solarKwp > 0 ? "Offline" : "None", tone: "idle" }
          }
          stats={[
            { label: "Output", value: `${inputs.solar.currentOutputKw} kW` },
            { label: "Capacity", value: `${solarKwp} kWp` },
            { label: "Share of load", value: `${outputs.dispatch.solarKw} kW` },
          ]}
        />

        <SourceCard
          title="Battery Storage"
          icon={Battery}
          accent="bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          rating={batteryKwh > 0 ? `${batteryKwh} kWh total capacity` : null}
          status={
            batteryKwh > 0
              ? { label: outputs.dispatch.batteryMode === "discharging" ? "Discharging" : "Idle", tone: "idle" }
              : { label: "None", tone: "idle" }
          }
          stats={[
            { label: "Usable Energy", value: `${outputs.usableBatteryKwh} kWh` },
            { label: "State of Charge", value: `${inputs.battery.stateOfChargePct}%` },
            { label: "Safety Floor", value: `${inputs.battery.reserveFloorPct}%` },
          ]}
        />

        <SourceCard
          title="Backup Generator"
          icon={Fuel}
          accent="bg-orange-500/10 border-orange-500/20 text-orange-400"
          rating={generatorKva > 0 ? `${generatorKva} kVA diesel backup` : null}
          status={
            generatorKva > 0
              ? { label: inputs.generator.mode, tone: inputs.generator.mode === "running" ? "ok" : "idle" }
              : { label: "None", tone: "idle" }
          }
          stats={[
            { label: "Fuel Level", value: `${inputs.generator.fuelCurrentLiters}L` },
            { label: "Output", value: `${outputs.dispatch.generatorKw} kW` },
            { label: "Fuel Cost", value: `₦${inputs.generator.fuelCostPerLiter}/L` },
          ]}
        />
      </div>
    </div>
  );
}
