"use client";

import * as React from "react";
import Link from "next/link";
import {
  Zap,
  Battery,
  Clock,
  ArrowRight,
  HelpCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sliders,
  Check,
} from "lucide-react";
import { useScenario } from "@/context/scenario-context";
import { useWorkspace } from "@/context/workspace-context";
import { EnergyFlowDiagram } from "@/components/dashboard/energy-flow-diagram";
import { CompactEnergyChart } from "@/components/dashboard/compact-energy-chart";
import { WhyRecommendationDrawer } from "@/components/dashboard/why-recommendation-drawer";

export function OverviewClient() {
  const {
    inputs,
    outputs,
    approveRecommendation,
    rejectRecommendation,
  } = useScenario();
  const { workspace } = useWorkspace();

  const [whyDrawerOpen, setWhyDrawerOpen] = React.useState(false);
  const [actionFeedback, setActionFeedback] = React.useState<string | null>(null);

  const businessName = workspace?.name || "Krystal Ice Cold Storage Ltd.";
  const businessLocation = workspace?.location || "Ikeja Industrial, Lagos";

  const { recommendation, riskLevel, riskSummary } = outputs;

  const handleApprove = () => {
    approveRecommendation(recommendation);
    setActionFeedback("Action approved and dispatched to audit log.");
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleReject = () => {
    rejectRecommendation(recommendation);
    setActionFeedback("Action rejected by operator.");
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const riskBadgeClass =
    riskLevel === "critical"
      ? "bg-rose-500/10 text-rose-300 border-rose-500/20"
      : riskLevel === "elevated"
      ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
      : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";

  return (
    <div className="space-y-5 max-w-7xl mx-auto select-none">
      {/* 1. Status Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-sm font-semibold text-white tracking-tight">
            {businessName}
          </span>
          <span className="text-slate-500 text-xs">·</span>
          <span className="text-xs text-slate-400">
            {businessLocation}
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider ${riskBadgeClass}`}>
            Risk: {riskLevel}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-normal max-w-2xl">
          {riskSummary}
        </p>
      </div>

      {/* 2. Three Hero Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hero 1: Power in Use */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 relative overflow-hidden group hover:border-white/[0.14] transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase tracking-wider text-[11px] font-medium">
              Power in Use
            </span>
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-white tracking-tight">
              {outputs.totalLoadKw}
            </span>
            <span className="text-sm font-medium text-slate-400 font-mono">
              kW
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            {outputs.criticalLoadKw} kW critical · {outputs.importantLoadKw} kW important · {outputs.deferrableLoadKw} kW deferrable
          </p>
        </div>

        {/* Hero 2: Battery Storage */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 relative overflow-hidden group hover:border-white/[0.14] transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase tracking-wider text-[11px] font-medium">
              Usable Battery Energy
            </span>
            <Battery className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-white tracking-tight">
              {outputs.usableBatteryKwh}
            </span>
            <span className="text-sm font-medium text-slate-400 font-mono">
              kWh
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            {inputs.battery.stateOfChargePct}% SoC ({outputs.usableBatterySocPct}% above {inputs.battery.reserveFloorPct}% reserve floor)
          </p>
        </div>

        {/* Hero 3: Backup Runtime */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 relative overflow-hidden group hover:border-white/[0.14] transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase tracking-wider text-[11px] font-medium">
              Estimated Backup Autonomy
            </span>
            <Clock className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-white tracking-tight">
              {outputs.backupRuntimeFormatted}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            {inputs.grid.isAvailable
              ? "Grid connection active on 11kV primary feeder"
              : `Net discharge deficit: ${Math.max(0, outputs.totalLoadKw - outputs.dispatch.solarKw).toFixed(1)} kW`}
          </p>
        </div>
      </div>

      {/* 3. Energy Flow Diagram & Next Best Action Card (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Energy Flow (7 cols) */}
        <div className="lg:col-span-7">
          <EnergyFlowDiagram
            dispatch={outputs.dispatch}
            totalLoadKw={outputs.totalLoadKw}
          />
        </div>

        {/* Right Column: Single Next Best Action Card (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              {recommendation.category.replace(/_/g, " ")}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Rules-based advisory
            </span>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              {recommendation.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-1.5">
              {recommendation.reason}
            </p>
          </div>

          {/* Impact numbers */}
          <div className="grid grid-cols-2 gap-2.5 py-1">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.05]">
              <span className="text-[10px] text-slate-400 block">
                Projected Savings
              </span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                ₦{recommendation.projectedSavingsNgnPerHour.toLocaleString()}/hr
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.05]">
              <span className="text-[10px] text-slate-400 block">
                Runtime Extension
              </span>
              <span className="text-sm font-bold font-mono text-white">
                +{recommendation.projectedRuntimeExtensionHours}h
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-1">
            {actionFeedback ? (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0" />
                <span>{actionFeedback}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleApprove}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>{recommendation.actionLabel}</span>
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
              className="w-full py-1.5 px-3 rounded-lg text-xs text-slate-400 hover:text-emerald-400 hover:bg-white/[0.02] transition-colors flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Why this recommendation?</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-500 leading-tight border-t border-white/[0.04] pt-2">
            {recommendation.disclaimer}
          </p>
        </div>
      </div>

      {/* 4. Compact Timeline Chart */}
      <CompactEnergyChart
        currentLoadKw={outputs.totalLoadKw}
        solarKw={outputs.dispatch.solarKw}
        gridKw={outputs.dispatch.gridKw}
      />

      {/* 5. Collapsed Devices Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-white">
              {inputs.loads.length} Monitored Loads Active
            </p>
            <p className="text-[11px] text-slate-400">
              {outputs.criticalLoadKw} kW critical priority load under continuous coverage
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/devices"
          className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors w-fit"
        >
          <span>Manage Devices & Loads</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
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
