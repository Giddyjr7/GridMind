"use client";

import * as React from "react";
import {
  X,
  Database,
  Calculator,
  ShieldAlert,
  Lightbulb,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { EngineInputs, EngineOutputs } from "@/lib/calculation-engine";

interface WhyRecommendationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: EngineInputs;
  outputs: EngineOutputs;
}

export function WhyRecommendationDrawer({
  isOpen,
  onClose,
  inputs,
  outputs,
}: WhyRecommendationDrawerProps) {
  if (!isOpen) return null;

  const { recommendation, firedRules } = outputs;

  const stages = [
    {
      step: "01",
      title: "Telemetry Data Collection",
      icon: Database,
      summary: "Real-time edge readings synchronized across sources and load sensors.",
      items: [
        { label: "Grid Status", value: inputs.grid.isAvailable ? "Online (11kV Feeder)" : "Outage (0V Active)" },
        { label: "Solar Generation", value: `${inputs.solar.currentOutputKw} kW` },
        { label: "Battery State of Charge", value: `${inputs.battery.stateOfChargePct}% (${outputs.usableBatteryKwh} kWh usable)` },
        { label: "Active Facility Load", value: `${outputs.totalLoadKw} kW` },
      ],
    },
    {
      step: "02",
      title: "Deficit & Energy Balance",
      icon: Calculator,
      summary: "Deterministic balancing of active loads against available generation and storage.",
      items: [
        { label: "Solar Coverage", value: `${outputs.dispatch.solarKw} kW` },
        { label: "Net Facility Deficit", value: `${Math.max(0, outputs.totalLoadKw - outputs.dispatch.solarKw).toFixed(1)} kW` },
        { label: "Battery Contribution", value: `${outputs.dispatch.batteryKw} kW (${outputs.dispatch.batteryMode})` },
        { label: "Backup Autonomy", value: outputs.backupRuntimeFormatted },
      ],
    },
    {
      step: "03",
      title: "Constrained Rules Evaluation",
      icon: ShieldAlert,
      summary: "Safety criteria and battery preservation thresholds triggered by current conditions.",
      items: firedRules.map((rule, idx) => ({
        label: `Rule ${idx + 1}`,
        value: rule,
      })),
    },
    {
      step: "04",
      title: "Algorithmic Recommendation",
      icon: Lightbulb,
      summary: "Synthesized operational action formulated to maximize runtime and avoid diesel burn.",
      items: [
        { label: "Proposed Action", value: recommendation.title },
        { label: "Target Urgency", value: recommendation.urgency.toUpperCase() },
        { label: "Projected Cost Impact", value: `₦${recommendation.projectedSavingsNgnPerHour.toLocaleString()}/hour` },
        { label: "Projected Runtime Gain", value: `+${recommendation.projectedRuntimeExtensionHours} hours` },
      ],
    },
    {
      step: "05",
      title: "Human Operator Approval",
      icon: UserCheck,
      summary: "Final authorization gate required before dispatching or logging operational changes.",
      items: [
        { label: "Policy", value: "Operator-in-the-loop required" },
        { label: "Advisory Clause", value: "GridMind never triggers automated physical switching without operator confirmation." },
        { label: "Audit Compliance", value: "All actions logged with user timestamp and projected outcome." },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-xl bg-[#0c1410] border-l border-white/[0.1] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Decision Intelligence Pipeline
                </span>
              </div>
              <h2 className="text-base font-semibold text-white mt-1">
                Why This Recommendation?
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Full 5-stage explainability trace for &quot;{recommendation.title}&quot;
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
              aria-label="Close explanation drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Stages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {stages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.step}
                  className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                          Stage {stage.step}
                        </span>
                        <h3 className="text-xs font-semibold text-white">
                          {stage.title}
                        </h3>
                      </div>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {stage.summary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-white/[0.04]">
                    {stage.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded bg-black/40 border border-white/[0.04] text-[11px]"
                      >
                        <span className="text-slate-400 block text-[10px]">
                          {item.label}
                        </span>
                        <span className="text-slate-200 font-medium font-mono">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/[0.08] bg-black/30 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Trace verified by deterministic rule-engine
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-slate-200 transition-colors"
            >
              Close Trace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
