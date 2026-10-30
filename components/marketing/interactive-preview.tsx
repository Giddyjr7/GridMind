"use client";

import * as React from "react";
import {
  Zap,
  Sun,
  BatteryCharging,
  Power,
  Sliders,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Clock,
  Coins,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function InteractiveSimulatorPreview() {
  // Scenario state
  const [gridOnline, setGridOnline] = React.useState<boolean>(false); // Start with simulated outage for impact!
  const [curtailDeferrable, setCurtailDeferrable] = React.useState<boolean>(true);
  const [batteryReserveHigh, setBatteryReserveHigh] = React.useState<boolean>(false);

  // Deterministic calculation
  const criticalLoadKw = 57.1; // Freezers + Pharma + Emergency Lighting
  const deferrableLoadKw = 16.0; // Packaging HVAC
  const activeLoadKw = curtailDeferrable ? criticalLoadKw : criticalLoadKw + deferrableLoadKw;

  const solarGenerationKw = 38.4;
  const batteryUsableKwh = 81.6;

  // Dispatch logic
  let netDeficitKw = Math.max(0, activeLoadKw - solarGenerationKw);
  let batteryDischargeKw = 0;
  let generatorPowerKw = 0;
  let gridImportKw = 0;
  let hourlyCostNgn = 0;
  let runtimeHours = 0;

  if (gridOnline) {
    gridImportKw = netDeficitKw;
    hourlyCostNgn = gridImportKw * 206.0;
    runtimeHours = 24.0; // Grid unlimited
  } else {
    // Grid outage: Solar + Battery first, then Diesel if needed
    const batteryMaxKw = 55.0;
    if (netDeficitKw <= batteryMaxKw) {
      batteryDischargeKw = netDeficitKw;
      generatorPowerKw = 0;
      hourlyCostNgn = batteryDischargeKw * 45; // Levelized battery amortized cost
      runtimeHours = batteryDischargeKw > 0 ? batteryUsableKwh / batteryDischargeKw : 8.0;
    } else {
      batteryDischargeKw = batteryMaxKw;
      generatorPowerKw = netDeficitKw - batteryMaxKw;
      hourlyCostNgn = generatorPowerKw * 356.25 + batteryDischargeKw * 45;
      runtimeHours = batteryUsableKwh / batteryDischargeKw;
    }
  }

  const roundedRuntime = runtimeHours.toFixed(1);

  return (
    <section id="simulator-preview" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="healthy" size="md" className="mb-3 font-bold">
            Interactive Product Preview
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Experience the Energy Crisis Simulator
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            Test how GridMind responds during a simulated utility feeder drop. Toggle the controls below to see how load prioritization protects critical refrigeration and avoids unnecessary diesel generation.
          </p>
          <p className="text-xs text-slate-400 mt-2 font-mono">
            * Deterministic benchmark demonstration running directly in your browser.
          </p>
        </div>

        {/* Interactive Simulator Shell */}
        <div className="rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl p-6 lg:p-8">
          {/* Top Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Scenario: Outage Mitigation & Load Shedding</span>
                <Badge variant={gridOnline ? "healthy" : "warning"} size="sm" className="font-mono text-xs font-bold">
                  {gridOnline ? "GRID CONNECTED" : "FEEDER DROPPED (OUTAGE)"}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulating: 150 kW Cold Storage Facility with 75 kWp Solar + 120 kWh Battery
              </p>
            </div>

            {/* Quick Reset */}
            <button
              onClick={() => {
                setGridOnline(false);
                setCurtailDeferrable(true);
                setBatteryReserveHigh(false);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Scenario
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            {/* Left Column: Interactive Scenario Controls */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                1. Adjust Operational Controls
              </h3>

              {/* Control 1: Utility Grid State */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">National Grid Feeder</p>
                    <p className="text-xs text-slate-400">Simulate utility blackout or recovery</p>
                  </div>
                  <button
                    onClick={() => setGridOnline(!gridOnline)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      gridOnline ? "bg-emerald-600" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        gridOnline ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                  Status: {gridOnline ? (
                    <span className="text-emerald-400">Band A Feed Online (₦206/kWh)</span>
                  ) : (
                    <span className="text-red-400">Zero Grid Import (Simulated Outage)</span>
                  )}
                </div>
              </div>

              {/* Control 2: Load Curtailment */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Curtail Packaging Floor AC</p>
                    <p className="text-xs text-slate-400">16 kW deferrable HVAC load</p>
                  </div>
                  <button
                    onClick={() => setCurtailDeferrable(!curtailDeferrable)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      curtailDeferrable ? "bg-emerald-600" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        curtailDeferrable ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                  {curtailDeferrable ? (
                    <span className="text-emerald-400">Curtailed · Saves 4.5L diesel/hr</span>
                  ) : (
                    <span className="text-amber-400">Full HVAC Active (+16 kW demand)</span>
                  )}
                </div>
              </div>

              {/* Safeguard Indicators */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Protected Equipment Hierarchy
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Blast Freezer (-21.4°C)</span>
                    <span className="text-emerald-400 font-mono font-medium">PROTECTED (100%)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Vaccine Cold Safe (+3.8°C)</span>
                    <span className="text-emerald-400 font-mono font-medium">PROTECTED (100%)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Packaging AC (16 kW)</span>
                    <span className={curtailDeferrable ? "text-amber-400 font-mono" : "text-slate-300 font-mono"}>
                      {curtailDeferrable ? "DEFERRED (SHED)" : "RUNNING"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column: Live Telemetry Dispatch */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                2. Real-Time Microgrid Dispatch
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {/* Active Demand */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900 flex flex-col justify-between">
                  <span className="text-xs text-slate-400">Facility Load</span>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-white font-mono">{activeLoadKw.toFixed(1)}</span>
                    <span className="text-xs text-slate-400 ml-1">kW</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1">
                    {curtailDeferrable ? "Critical Only" : "Critical + Nonessential"}
                  </span>
                </div>

                {/* Solar Contribution */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900 flex flex-col justify-between">
                  <span className="text-xs text-amber-400 flex items-center gap-1">
                    <Sun className="h-3.5 w-3.5" /> Solar PV
                  </span>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-white font-mono">{solarGenerationKw.toFixed(1)}</span>
                    <span className="text-xs text-slate-400 ml-1">kW</span>
                  </div>
                  <span className="text-[11px] text-amber-500/80 mt-1">Free Clean Power</span>
                </div>

                {/* Battery Discharge */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900 flex flex-col justify-between">
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <BatteryCharging className="h-3.5 w-3.5" /> Battery Flow
                  </span>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-white font-mono">{batteryDischargeKw.toFixed(1)}</span>
                    <span className="text-xs text-slate-400 ml-1">kW</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1">
                    {gridOnline ? "Standby" : "Discharging to Load"}
                  </span>
                </div>

                {/* Diesel Generator Output */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900 flex flex-col justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Power className="h-3.5 w-3.5" /> Diesel Gen
                  </span>
                  <div className="mt-2">
                    <span className={`text-2xl font-bold font-mono ${generatorPowerKw > 0 ? "text-amber-400" : "text-slate-500"}`}>
                      {generatorPowerKw.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">kW</span>
                  </div>
                  <span className={`text-[11px] mt-1 ${generatorPowerKw > 0 ? "text-amber-400" : "text-emerald-500"}`}>
                    {generatorPowerKw > 0 ? "Engaged (Costly)" : "Off (Zero Fuel Burn)"}
                  </span>
                </div>
              </div>

              {/* Backup Runtime Indicator */}
              <div className="p-4 rounded-xl border border-emerald-900/60 bg-emerald-950/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    Estimated Clean Backup Runtime
                  </span>
                  <span className="text-xl font-bold text-emerald-400 font-mono">
                    {gridOnline ? "Unlimited" : `${roundedRuntime} Hours`}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {gridOnline
                    ? "Operating on national grid utility feeder."
                    : curtailDeferrable
                    ? "Solar + Battery fully supports blast freezers without running diesel."
                    : "High load causes faster battery drain. Consider curtailing packaging HVAC."}
                </p>
              </div>
            </div>

            {/* Right Column: AI Actionable Recommendation */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  3. AI Generated Recommendation
                </h3>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-emerald-900/80 text-emerald-300 flex items-center justify-center">
                        <Lightbulb className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-white">Continuity Optimization</span>
                    </div>
                    <Badge variant="healthy" size="sm" className="font-bold">
                      High Confidence
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {curtailDeferrable ? (
                      <>
                        <strong className="text-white">Active Policy Applied:</strong> Packaging Floor HVAC is shed during grid disruption.
                        Blast Freezer temperature is preserved at -21.4°C while keeping diesel generator idle.
                      </>
                    ) : (
                      <>
                        <strong className="text-amber-400">Warning (High Demand):</strong> Packaging AC is adding 16 kW during outage,
                        accelerating battery exhaustion. Click &quot;Curtail Packaging Floor AC&quot; to extend freezer runtime by 1.5+ hours.
                      </>
                    )}
                  </p>

                  <div className="pt-2 border-t border-slate-800 text-xs flex justify-between items-center">
                    <span className="text-slate-400">Estimated Hourly Cost:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      ₦{Math.round(hourlyCostNgn).toLocaleString()}/hr
                    </span>
                  </div>
                </div>
              </div>

              {/* Call to Action to Explore Full Platform */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-center space-y-2">
                <p className="text-xs text-slate-400">
                  Ready to test custom site configurations and load profiles?
                </p>
                <a
                  href="/dashboard"
                  className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg text-xs font-semibold text-white bg-brand-900 hover:bg-brand-800 transition-colors"
                >
                  Open Full Operational Console
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
