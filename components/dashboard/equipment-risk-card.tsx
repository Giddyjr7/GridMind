"use client";

import * as React from "react";
import { Battery, Fuel, RefreshCw, Snowflake, Wrench } from "lucide-react";
import { energyService } from "@/services";
import type { EquipmentRiskAsset, EquipmentRiskBand, EquipmentRiskReport } from "@/types/energy";

const bandStyles: Record<EquipmentRiskBand, string> = {
  normal: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  watch: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
  elevated: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  critical: "border-rose-500/20 bg-rose-500/10 text-rose-300",
};

const assetIcon: Record<EquipmentRiskAsset["assetType"], React.ElementType> = {
  battery: Battery,
  generator: Fuel,
  appliance: Snowflake,
};

export function EquipmentRiskCard() {
  const [report, setReport] = React.useState<EquipmentRiskReport | null>(null);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    try {
      setError(false);
      setReport(await energyService.getEquipmentRisk());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 60_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  if (loading) {
    return <div className="h-32 rounded-2xl border border-white/[0.08] bg-white/[0.02] animate-pulse" />;
  }

  if (!report || error) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">Equipment risk unavailable</p>
          <p className="text-xs text-slate-400 mt-1">The condition scorer could not be reached.</p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          aria-label="Retry equipment risk"
          className="p-2 rounded-lg border border-white/10 text-slate-300 hover:text-white"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Assets arrive sorted worst-first; a clean site shows the headline only.
  const flagged = report.assets.filter((asset) => asset.band !== "normal").slice(0, 3);

  // Nothing registered is a different state from nothing wrong, and showing a
  // risk score for an empty inventory reads as a reassurance nobody earned.
  if (report.assetsAssessed === 0) {
    return (
      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5" aria-labelledby="equipment-risk-heading">
        <div className="flex gap-4">
          <div className="h-11 w-11 shrink-0 rounded-xl border border-slate-500/20 bg-slate-500/10 text-slate-400 flex items-center justify-center">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h2 id="equipment-risk-heading" className="text-sm font-semibold text-white">Equipment risk</h2>
            <p className="mt-1 text-xs text-slate-400 max-w-2xl">
              No equipment or energy sources are registered yet, so there is nothing to assess. Add your
              loads and declare your solar, battery and generator to start condition monitoring.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5" aria-labelledby="equipment-risk-heading">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-4 min-w-0">
          <div className={`h-11 w-11 shrink-0 rounded-xl border flex items-center justify-center ${bandStyles[report.highestBand]}`}>
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="equipment-risk-heading" className="text-sm font-semibold text-white">Equipment risk</h2>
              <span className={`text-[10px] uppercase tracking-wider rounded-full border px-2 py-0.5 ${bandStyles[report.highestBand]}`}>
                {report.highestBand}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400 max-w-2xl">
              Condition trends across your own assets: battery charge ceiling, generator proving, cold-chain setpoints and telemetry silence.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-400">
              <span>{report.assetsAssessed} assets assessed</span>
              <span>{report.observedDays} days of history</span>
              <span>{report.horizonDays}-day horizon</span>
            </div>
          </div>
        </div>

        <div className="lg:text-right shrink-0">
          <div className="text-4xl font-mono font-bold text-white">{report.assetsAtRisk}</div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">needing attention</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {flagged.length === 0 ? (
          <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3.5">
            <p className="text-xs text-slate-300">
              Nothing in the telemetry looks wrong. That is not the same as an inspection.
            </p>
          </div>
        ) : (
          flagged.map((asset) => {
            const Icon = assetIcon[asset.assetType];
            return (
              <div key={asset.assetId} className="rounded-xl border border-white/[0.06] bg-black/20 p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <Icon className="h-4 w-4 shrink-0 mt-0.5 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white">{asset.assetName}</p>
                      {asset.findings.map((finding) => (
                        <p key={finding.code} className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                          {finding.label} <span className="font-mono">+{finding.contribution}pts</span>: {finding.detail}
                        </p>
                      ))}
                      <p className="text-[11px] text-slate-500 mt-1.5">{asset.recommendedCheck}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 text-[10px] font-mono rounded-full border px-2 py-0.5 ${bandStyles[asset.band]}`}>
                    {asset.probabilityPct}%
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">{report.limitations[0]}</p>
    </section>
  );
}
