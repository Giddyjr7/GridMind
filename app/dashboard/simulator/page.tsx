"use client";

import * as React from "react";
import {
  RotateCcw,
  Zap,
  Sun,
  Battery,
  Fuel,
  CheckCircle,
  XCircle,
  HelpCircle,
  Sliders,
  Check,
} from "lucide-react";
import { useScenario } from "@/context/scenario-context";
import { EnergyFlowDiagram } from "@/components/dashboard/energy-flow-diagram";
import { WhyRecommendationDrawer } from "@/components/dashboard/why-recommendation-drawer";

export default function SimulatorPage() {
  const {
    inputs,
    outputs,
    activePresetId,
    applyPreset,
    setGridAvailable,
    setBatterySoc,
    setSolarOutput,
    setSolarEnabled,
    setGeneratorMode,
    approveRecommendation,
    rejectRecommendation,
    resetToDemoDefaults,
  } = useScenario();

  const [whyDrawerOpen, setWhyDrawerOpen] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const presets = [
    {
      id: "preset_normal",
      name: "Normal Grid",
      desc: "Grid active with solar supplement and idle ESS",
    },
    {
      id: "preset_outage_battery",
      name: "Outage with Battery",
      desc: "Grid failure active, ESS discharging to cover loads",
    },
    {
      id: "preset_critical_floor",
      name: "Reserve Floor Alert",
      desc: "Battery at 15% reserve floor, generator required",
    },
    {
      id: "preset_solar_peak",
      name: "Surplus Solar Peak",
      desc: "Solar exceeding site demand, charging battery bank",
    },
  ];

  const handleApprove = () => {
    approveRecommendation(outputs.recommendation);
    setFeedback("Recommendation approved and logged in Decisions audit trail.");
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleReject = () => {
    rejectRecommendation(outputs.recommendation);
    setFeedback("Recommendation dismissed by operator.");
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Scenarios & Outage Modeling
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate microgrid resilience under synthetic grid disturbances and generation changes
          </p>
        </div>
        <button
          type="button"
          onClick={resetToDemoDefaults}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 border border-white/[0.08] transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* 2-Column Responsive Layout: Left Controls, Right Live Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Simulation Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Preset Selector */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 space-y-3">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Scenario Presets
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {presets.map((p) => {
                const isSelected = activePresetId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500/30 text-white ring-1 ring-emerald-500/30"
                        : "bg-black/30 border-white/[0.05] text-slate-300 hover:border-white/[0.12] hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{p.name}</span>
                      {isSelected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                      {p.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Feeder Toggle */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-semibold text-white">
                  National Grid Feeder (11kV)
                </span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase ${
                  inputs.grid.isAvailable
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {inputs.grid.isAvailable ? "Online" : "Outage Active"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGridAvailable(true)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors border ${
                  inputs.grid.isAvailable
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-black/30 border-white/[0.06] text-slate-400 hover:text-white"
                }`}
              >
                Feeder Restored
              </button>
              <button
                type="button"
                onClick={() => setGridAvailable(false)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors border ${
                  !inputs.grid.isAvailable
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                    : "bg-black/30 border-white/[0.06] text-slate-400 hover:text-white"
                }`}
              >
                Trigger Outage
              </button>
            </div>
          </div>

          {/* Battery Storage Slider */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-semibold text-white">
                  LiFePO4 Battery ESS (120 kWh)
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-white">
                {inputs.battery.stateOfChargePct}% SoC
              </span>
            </div>

            <div className="space-y-1">
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={inputs.battery.stateOfChargePct}
                onChange={(e) => setBatterySoc(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-white/[0.08] h-2 rounded-lg cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                <span>0% Empty</span>
                <span className="text-amber-400">
                  {inputs.battery.reserveFloorPct}% Reserve Floor
                </span>
                <span>100% Full</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.04] text-[11px] text-slate-300 flex items-center justify-between">
              <span>Usable Reserve Available</span>
              <span className="font-mono text-emerald-400 font-semibold">
                {outputs.usableBatteryKwh} kWh
              </span>
            </div>
          </div>

          {/* Solar Generation Slider & Toggle */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-semibold text-white">
                  Rooftop Solar PV Array (75 kWp)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSolarEnabled(!inputs.solar.isEnabled)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase ${
                  inputs.solar.isEnabled
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-white/[0.04] text-slate-400 border-white/[0.08]"
                }`}
              >
                {inputs.solar.isEnabled ? "Enabled" : "Disabled"}
              </button>
            </div>

            {inputs.solar.isEnabled && (
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="75"
                  step="0.5"
                  value={inputs.solar.currentOutputKw}
                  onChange={(e) => setSolarOutput(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-white/[0.08] h-2 rounded-lg cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                  <span>0 kW (Night/Overcast)</span>
                  <span className="text-amber-300 font-semibold">
                    {inputs.solar.currentOutputKw} kW Output
                  </span>
                  <span>75 kW Peak</span>
                </div>
              </div>
            )}
          </div>

          {/* Diesel Generator Mode Selector */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fuel className="h-4 w-4 text-orange-400" />
                <span className="text-xs font-semibold text-white">
                  Prime Diesel Generator (160 kVA)
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {inputs.generator.fuelCurrentLiters}L Fuel
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["standby", "running", "disabled", "out_of_fuel"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setGeneratorMode(m)}
                  className={`py-2 px-2 rounded-xl text-[11px] font-medium capitalize border transition-colors ${
                    inputs.generator.mode === m
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-black/30 border-white/[0.06] text-slate-400 hover:text-white"
                  }`}
                >
                  {m.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Sticky Results & Action (5 cols) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
          {/* 3 Hero Metrics */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Load
              </span>
              <span className="text-lg font-bold font-mono text-white">
                {outputs.totalLoadKw}
              </span>
              <span className="text-[10px] text-slate-500 block font-mono">kW</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Usable ESS
              </span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                {outputs.usableBatteryKwh}
              </span>
              <span className="text-[10px] text-slate-500 block font-mono">kWh</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Runtime
              </span>
              <span className="text-lg font-bold font-mono text-white">
                {outputs.backupRuntimeFormatted}
              </span>
              <span className="text-[10px] text-slate-500 block font-mono">est</span>
            </div>
          </div>

          {/* Energy Flow Diagram */}
          <EnergyFlowDiagram
            dispatch={outputs.dispatch}
            totalLoadKw={outputs.totalLoadKw}
          />

          {/* Strategy Cost Comparison */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Cost Benchmark</span>
              <span className="text-emerald-400 font-mono text-[11px]">
                {outputs.baselineComparison.savingsPct}% lower
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.04]">
                <span className="text-[10px] text-slate-400 block">
                  Unmanaged Baseline
                </span>
                <span className="font-mono text-slate-300 font-semibold">
                  ₦{outputs.baselineComparison.baselineHourlyCostNgn.toLocaleString()}/hr
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.04]">
                <span className="text-[10px] text-slate-400 block">
                  Managed Dispatch
                </span>
                <span className="font-mono text-emerald-400 font-semibold">
                  ₦{outputs.baselineComparison.proposedHourlyCostNgn.toLocaleString()}/hr
                </span>
              </div>
            </div>
          </div>

          {/* Live Recommendation Card */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                {outputs.recommendation.category.replace(/_/g, " ")}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Rule-triggered
              </span>
            </div>

            <h4 className="text-sm font-semibold text-white">
              {outputs.recommendation.title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {outputs.recommendation.reason}
            </p>

            {feedback ? (
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0" />
                <span>{feedback}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleApprove}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>{outputs.recommendation.actionLabel}</span>
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  className="py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs transition-colors border border-white/[0.06] flex items-center justify-center gap-1.5"
                >
                  <XCircle className="h-3.5 w-3.5 text-slate-400" />
                  <span>Dismiss</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setWhyDrawerOpen(true)}
              className="w-full py-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Why this recommendation?</span>
            </button>
          </div>
        </div>
      </div>

      {/* Why This Recommendation Explainability Drawer */}
      <WhyRecommendationDrawer
        isOpen={whyDrawerOpen}
        onClose={() => setWhyDrawerOpen(false)}
        inputs={inputs}
        outputs={outputs}
      />
    </div>
  );
}
