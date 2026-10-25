"use client";

import * as React from "react";
import {
  ThermometerSnowflake,
  Lightbulb,
  Power,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Sparkles,
  Info,
  User,
  Cpu,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSimulation, ApplianceWithSimMetadata } from "@/context/simulation-context";
import { AppliancePriority, ApplianceState } from "@/types/energy";
import { formatPower } from "@/lib/formatters";

export function ApplianceControlPanel() {
  const { appliances, setApplianceState, setAppliancePower, params } = useSimulation();

  // Group appliances by priority
  const criticalAppliances = appliances.filter((a) => a.priority === "critical");
  const importantAppliances = appliances.filter((a) => a.priority === "important");
  const deferrableAppliances = appliances.filter((a) => a.priority === "deferrable");

  const renderApplianceRow = (app: ApplianceWithSimMetadata) => {
    const isRunning = app.state === "running";
    const isCurtailed = app.state === "curtailed";
    const isOff = app.state === "off";
    const isStandby = app.state === "standby";

    const aiSuggestedState =
      !params.gridAvailable && app.priority === "deferrable"
        ? "curtailed"
        : app.priority === "critical"
        ? "running"
        : "running";

    const hasDivergedFromAi = app.state !== aiSuggestedState;

    return (
      <div
        key={app.id}
        className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Asset Identity */}
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                app.priority === "critical"
                  ? "bg-rose-100 text-rose-900 border border-rose-300"
                  : app.priority === "important"
                  ? "bg-amber-100 text-amber-950 border border-amber-300"
                  : "bg-emerald-100 text-emerald-950 border border-emerald-300"
              }`}
            >
              {app.category === "refrigeration" ? (
                <ThermometerSnowflake className="w-4 h-4" />
              ) : app.category === "lighting" ? (
                <Lightbulb className="w-4 h-4" />
              ) : (
                <Power className="w-4 h-4" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {app.name}
                </h4>
                {app.temperatureCritical && (
                  <span className="text-[10px] font-mono font-bold text-sky-950 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                    {app.temperatureCritical.currentTempCelsius}°C
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Rated: {formatPower(app.ratedPowerKw)} | Current:{" "}
                <strong className="text-slate-800">{formatPower(app.currentPowerKw)}</strong>
              </p>
            </div>
          </div>

          {/* Mode & Attribution Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {app.isManualOverride ? (
              <Badge variant="outline" size="sm" className="text-[10px] bg-slate-100 text-slate-900 border-slate-300 font-semibold flex items-center gap-1">
                <User className="w-3 h-3 text-slate-700" />
                Manual Override
              </Badge>
            ) : (
              <Badge variant="healthy" size="sm" className="text-[10px] flex items-center gap-1 font-semibold">
                <Cpu className="w-3 h-3 text-emerald-900" />
                Automated Policy
              </Badge>
            )}

            {hasDivergedFromAi && (
              <button
                type="button"
                onClick={() => setApplianceState(app.id, aiSuggestedState, false)}
                className="text-[10px] font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-full border border-emerald-300 transition-colors inline-flex items-center gap-1 shadow-2xs"
                title={`Click to apply AI recommendation: ${aiSuggestedState}`}
              >
                <Sparkles className="w-3 h-3 text-emerald-800" />
                AI Suggests: {aiSuggestedState}
              </button>
            )}
          </div>
        </div>

        {/* Operating State Buttons */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-slate-600 mr-1 hidden sm:inline">
              State:
            </span>
            <button
              type="button"
              onClick={() => setApplianceState(app.id, "running", true)}
              className={`px-3 py-1 text-xs rounded-md font-bold transition-colors ${
                isRunning
                  ? "bg-emerald-700 text-white border border-emerald-800 shadow-xs"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300"
              }`}
            >
              Running
            </button>
            <button
              type="button"
              onClick={() => setApplianceState(app.id, "standby", true)}
              className={`px-3 py-1 text-xs rounded-md font-bold transition-colors ${
                isStandby
                  ? "bg-amber-500 text-slate-950 border border-amber-600 shadow-xs"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300"
              }`}
            >
              Standby
            </button>
            <button
              type="button"
              onClick={() => setApplianceState(app.id, "curtailed", true)}
              className={`px-3 py-1 text-xs rounded-md font-bold transition-colors ${
                isCurtailed
                  ? "bg-rose-700 text-white border border-rose-800 shadow-xs"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300"
              }`}
            >
              Curtailed
            </button>
            <button
              type="button"
              onClick={() => setApplianceState(app.id, "off", true)}
              className={`px-3 py-1 text-xs rounded-md font-bold transition-colors ${
                isOff
                  ? "bg-slate-900 text-white border border-slate-950 shadow-xs"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300"
              }`}
            >
              Off
            </button>
          </div>

          {/* Power Demand Micro-slider */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono">
              Adjust:
            </span>
            <input
              type="range"
              min="0"
              max={Math.round(app.ratedPowerKw * 1.2)}
              step="0.5"
              value={app.currentPowerKw}
              onChange={(e) => setAppliancePower(app.id, Number(e.target.value))}
              className="w-24 accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              aria-label={`Adjust ${app.name} power`}
            />
            <span className="text-xs font-mono font-bold text-slate-700 w-12 text-right">
              {app.currentPowerKw.toFixed(1)} kW
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <CardTitle className="text-base font-bold text-slate-900">
            Simulated Equipment & Load Dispatch
          </CardTitle>
          <p className="text-xs text-slate-500">
            Control individual appliance operating states. Manual overrides are strictly respected and never silently replaced.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Classification:</span>
          <Badge variant="critical" size="sm">Critical</Badge>
          <Badge variant="warning" size="sm">Important</Badge>
          <Badge variant="healthy" size="sm">Deferrable</Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-6">
        {/* 1. Critical Appliances */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              Critical Cold Chain Equipment (Zero Curtailment Tolerance)
            </h5>
            <span className="text-[11px] font-mono text-slate-500">
              Subtotal: {formatPower(criticalAppliances.reduce((s, a) => s + (a.state === "running" ? a.currentPowerKw : 0), 0))}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {criticalAppliances.map(renderApplianceRow)}
          </div>
        </div>

        {/* 2. Important Appliances */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              Important Infrastructure (Lighting & IT CCTV)
            </h5>
            <span className="text-[11px] font-mono text-slate-500">
              Subtotal: {formatPower(importantAppliances.reduce((s, a) => s + (a.state === "running" ? a.currentPowerKw : 0), 0))}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {importantAppliances.map(renderApplianceRow)}
          </div>
        </div>

        {/* 3. Deferrable Appliances */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <Power className="w-3.5 h-3.5 text-emerald-600" />
              Deferrable Air Conditioning & HVAC (Sheddable during Grid Outage)
            </h5>
            <span className="text-[11px] font-mono text-slate-500">
              Subtotal: {formatPower(deferrableAppliances.reduce((s, a) => s + (a.state === "running" ? a.currentPowerKw : 0), 0))}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {deferrableAppliances.map(renderApplianceRow)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
