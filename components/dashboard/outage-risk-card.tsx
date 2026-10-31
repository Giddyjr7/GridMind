"use client";

import * as React from "react";
import { Activity, AlertTriangle, Radio, RefreshCw, ShieldCheck } from "lucide-react";
import { energyService } from "@/services";
import type { OutageRiskForecast } from "@/types/energy";

const bandStyles: Record<OutageRiskForecast["band"], string> = {
  normal: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  watch: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
  elevated: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  critical: "border-rose-500/20 bg-rose-500/10 text-rose-300",
  outage_active: "border-rose-500/30 bg-rose-500/15 text-rose-200",
};

const provenanceLabel: Record<OutageRiskForecast["provenance"], string> = {
  simulated: "Simulated telemetry",
  digital_twin: "Digital-twin telemetry",
  physical_gateway: "Physical gateway",
  rest_gateway: "REST gateway",
  mixed: "Mixed telemetry sources",
};

export function OutageRiskCard() {
  const [forecast, setForecast] = React.useState<OutageRiskForecast | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    try {
      setError(null);
      setForecast(await energyService.getOutageRiskForecast());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Risk forecast unavailable.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 30_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  if (loading) {
    return <div className="h-36 rounded-2xl border border-white/[0.08] bg-white/[0.02] animate-pulse" />;
  }

  if (!forecast || error) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">Outage risk forecast unavailable</p>
          <p className="text-xs text-slate-400 mt-1">The dashboard is still available, but the telemetry scorer could not be reached.</p>
        </div>
        <button type="button" onClick={() => void refresh()} className="p-2 rounded-lg border border-white/10 text-slate-300 hover:text-white" aria-label="Retry outage forecast">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const isPhysical = forecast.provenance === "physical_gateway" || forecast.provenance === "rest_gateway";
  const topSignals = forecast.signals.filter((signal) => signal.code !== "STALE_DATA").slice(0, 2);

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5" aria-labelledby="outage-risk-heading">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
        <div className="flex gap-4 min-w-0">
          <div className={`h-11 w-11 shrink-0 rounded-xl border flex items-center justify-center ${bandStyles[forecast.band]}`}>
            {forecast.band === "normal" ? <ShieldCheck className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="outage-risk-heading" className="text-sm font-semibold text-white">Next-hour outage risk</h2>
              <span className={`text-[10px] uppercase tracking-wider rounded-full border px-2 py-0.5 ${bandStyles[forecast.band]}`}>
                {forecast.band.replace("_", " ")}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400 max-w-2xl">
              Transparent early warning from feeder voltage, frequency, interruptions and telemetry freshness.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Radio className="h-3.5 w-3.5" />{provenanceLabel[forecast.provenance]}</span>
              <span>{forecast.sampleCount} readings</span>
              <span>{forecast.confidencePct}% confidence</span>
              {!isPhysical && <span className="text-amber-300">Demo—not a live feeder forecast</span>}
            </div>
          </div>
        </div>

        <div className="lg:text-right shrink-0">
          <div className="text-4xl font-mono font-bold text-white">{forecast.probabilityPct}<span className="text-lg text-slate-400">%</span></div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">risk within 60 minutes</p>
          <p className="text-[11px] text-slate-400 mt-1.5 font-mono">
            {forecast.probabilityRangePct.lowPct}-{forecast.probabilityRangePct.highPct}% <span className="font-sans text-slate-500">80% range</span>
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Risk by horizon">
        {forecast.horizons.map((horizon) => (
          <div key={horizon.horizonMinutes} className="rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">next {horizon.horizonMinutes} min</p>
            <p className="text-lg font-mono font-semibold text-white mt-0.5">{horizon.probabilityPct}%</p>
            <p className="text-[10px] text-slate-500 font-mono">{horizon.lowPct}-{horizon.highPct}%</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3.5">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 inline-flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" />Observed signals</p>
          {topSignals.length > 0 ? topSignals.map((signal) => (
            <p key={signal.code} className="text-xs text-slate-300 leading-relaxed">
              {signal.label} <span className="font-mono text-slate-400">+{signal.contribution}pts</span>: <span className="text-slate-400">{signal.detail}</span>
            </p>
          )) : <p className="text-xs text-slate-300">No instability signals detected in the current window.</p>}
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3.5">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Recommended preparation</p>
          <p className="text-xs text-slate-300 leading-relaxed">{forecast.recommendedPreparation[0]}</p>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
        Calibrated against a {forecast.baseRate.ratePct}% hourly interruption rate
        {forecast.baseRate.estimator === "empirical_bayes"
          ? ` measured from ${forecast.baseRate.onsetsObserved} of ${forecast.baseRate.windowsObserved} stored hour${forecast.baseRate.windowsObserved === 1 ? "" : "s"}`
          : " from the stated prior, because this site has no stored history yet"}
        . {forecast.limitations[0]}
      </p>
    </section>
  );
}
