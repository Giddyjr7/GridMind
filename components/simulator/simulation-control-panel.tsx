"use client";

import * as React from "react";
import {
  Zap,
  ZapOff,
  Battery,
  Sun,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  StepForward,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sliders,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSimulation } from "@/context/simulation-context";

export function SimulationControlPanel() {
  const {
    params,
    isSimulating,
    feedbackMessage,
    clearFeedback,
    triggerGridOutage,
    restoreGrid,
    setBatterySoc,
    setSolarEnabled,
    setSolarGenerationKw,
    setGeneratorMode,
    toggleSimulationRunning,
    stepSimulationHour,
    resetToDefaultScenario,
  } = useSimulation();

  return (
    <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Simulation Control Console
            </CardTitle>
            <p className="text-xs text-slate-500">
              Model grid disturbances, weather changes, and asset parameters in real time
            </p>
          </div>
        </div>

        {/* Global Action Controls: Run, Step, Reset */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={stepSimulationHour}
            className="text-xs h-8 text-slate-700 border-slate-200"
            title="Step simulation forward by 1 hour"
          >
            <StepForward className="w-3.5 h-3.5 mr-1 text-slate-500" />
            +1 Hour
          </Button>

          <Button
            size="sm"
            variant={isSimulating ? "secondary" : "primary"}
            onClick={toggleSimulationRunning}
            className="text-xs h-8"
          >
            {isSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5 mr-1" />
                Pause Ticker
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 mr-1" />
                Play Auto-Tick
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={resetToDefaultScenario}
            className="text-xs h-8 text-rose-700 border-rose-200 hover:bg-rose-50"
            title="Reset to default benchmark scenario"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Baseline
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-5">
        {/* Real-time Feedback Banner */}
        {feedbackMessage && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{feedbackMessage}</span>
            </div>
            <button
              type="button"
              onClick={clearFeedback}
              className="text-[11px] text-emerald-600 hover:underline ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. National Grid Feeder Control */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                Utility Grid
              </span>
              <Badge
                variant={params.gridAvailable ? "healthy" : "critical"}
                size="sm"
                className="text-[10px] uppercase font-mono font-bold"
              >
                {params.gridAvailable ? "Mains Online" : "Outage Active"}
              </Badge>
            </div>

            <p className="text-xs text-slate-500 min-h-[32px]">
              {params.gridAvailable
                ? "Ikeja 11kV Feeder synchronized. Band A ₦206/kWh tariff active."
                : "Utility feeder offline (0V). Facility isolated in microgrid mode."}
            </p>

            <div className="pt-1">
              {params.gridAvailable ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={triggerGridOutage}
                  className="w-full text-xs h-8 border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold"
                >
                  <ZapOff className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
                  Cut Utility Power (Outage)
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={restoreGrid}
                  className="w-full text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  <Zap className="w-3.5 h-3.5 mr-1.5" />
                  Restore National Grid
                </Button>
              )}
            </div>
          </div>

          {/* 2. Battery SOC Control */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Battery className="w-3.5 h-3.5 text-emerald-600" />
                Battery Storage
              </span>
              <span className="text-xs font-bold text-slate-900 font-mono">
                {params.batterySocPct}% SOC
              </span>
            </div>

            <div className="space-y-1.5">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={params.batterySocPct}
                onChange={(e) => setBatterySoc(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                aria-label="Battery State of Charge"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0% Floor</span>
                <span className="text-amber-600 font-semibold">20% Reserve</span>
                <span>100% Full</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-4 gap-1.5 pt-0.5">
              {[20, 50, 68, 90].map((soc) => (
                <button
                  key={soc}
                  type="button"
                  onClick={() => setBatterySoc(soc)}
                  className={`text-[11px] py-1 rounded-md border transition-colors ${
                    params.batterySocPct === soc
                      ? "bg-emerald-700 text-white border-emerald-800 font-bold shadow-xs"
                      : "bg-white text-slate-900 border-slate-300 hover:bg-slate-100 font-semibold"
                  }`}
                >
                  {soc}%
                </button>
              ))}
            </div>
          </div>

          {/* 3. Solar PV Generation Control */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                Solar PV Array
              </span>
              <Badge
                variant={params.solarEnabled && params.solarGenerationKw > 0 ? "healthy" : "neutral"}
                size="sm"
                className="text-[10px] uppercase font-mono font-bold"
              >
                {params.solarEnabled && params.solarGenerationKw > 0
                  ? `${params.solarGenerationKw.toFixed(1)} kW`
                  : "0.0 kW (Off)"}
              </Badge>
            </div>

            <div className="space-y-1.5">
              <input
                type="range"
                min="0"
                max="75"
                step="1"
                value={params.solarEnabled ? params.solarGenerationKw : 0}
                onChange={(e) => setSolarGenerationKw(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                aria-label="Solar Output"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0 kW (Night)</span>
                <span>48 kW (Midday)</span>
                <span>75 kW (Peak)</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-3 gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => setSolarGenerationKw(0)}
                className={`text-[11px] py-1 rounded-md border transition-colors ${
                  params.solarGenerationKw === 0
                    ? "bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs"
                    : "bg-white text-slate-900 border-slate-300 hover:bg-slate-100 font-semibold"
                }`}
              >
                Night (0kW)
              </button>
              <button
                type="button"
                onClick={() => setSolarGenerationKw(24)}
                className={`text-[11px] py-1 rounded-md border transition-colors ${
                  params.solarGenerationKw === 24
                    ? "bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs"
                    : "bg-white text-slate-900 border-slate-300 hover:bg-slate-100 font-semibold"
                }`}
              >
                Overcast (24kW)
              </button>
              <button
                type="button"
                onClick={() => setSolarGenerationKw(48)}
                className={`text-[11px] py-1 rounded-md border transition-colors ${
                  params.solarGenerationKw === 48
                    ? "bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs"
                    : "bg-white text-slate-900 border-slate-300 hover:bg-slate-100 font-semibold"
                }`}
              >
                Clear Sun (48kW)
              </button>
            </div>
          </div>

          {/* 4. Diesel Generator Mode Control */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Generator Mode
              </span>
              <Badge
                variant={
                  params.generatorMode === "running"
                    ? "warning"
                    : params.generatorMode === "disabled"
                    ? "critical"
                    : "neutral"
                }
                size="sm"
                className="text-[10px] uppercase font-mono font-bold"
              >
                {params.generatorMode}
              </Badge>
            </div>

            <p className="text-xs text-slate-500 min-h-[32px]">
              Cummins 160kVA prime genset. ₦1,250/L diesel (0.28 L/kWh burn rate).
            </p>

            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setGeneratorMode("standby")}
                className={`text-[11px] py-1 rounded-md border transition-colors ${
                  params.generatorMode === "standby"
                    ? "bg-slate-900 text-white border-slate-950 font-bold shadow-xs"
                    : "bg-white text-slate-900 border-slate-300 hover:bg-slate-100 font-semibold"
                }`}
              >
                Auto Standby
              </button>
              <button
                type="button"
                onClick={() => setGeneratorMode("running")}
                className={`text-[11px] py-1 rounded-md border transition-colors ${
                  params.generatorMode === "running"
                    ? "bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs"
                    : "bg-white text-slate-900 border-slate-300 hover:bg-slate-100 font-semibold"
                }`}
              >
                Force Run
              </button>
              <button
                type="button"
                onClick={() => setGeneratorMode("disabled")}
                className={`text-[11px] py-1 rounded-md border transition-colors ${
                  params.generatorMode === "disabled"
                    ? "bg-rose-700 text-white border-rose-800 font-bold shadow-xs"
                    : "bg-white text-slate-900 border-slate-300 hover:bg-slate-100 font-semibold"
                }`}
              >
                Lockout
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
