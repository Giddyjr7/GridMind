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
  Lightbulb,
  BookmarkCheck,
  Settings2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSimulation } from "@/context/simulation-context";
import { SCENARIO_PRESETS } from "@/lib/decision-engine";

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
    activePresetId,
    loadScenarioPreset,
    setBatteryCapacityKwh,
    setBatteryReserveFloorPct,
  } = useSimulation();

  const [showAdvancedSettings, setShowAdvancedSettings] = React.useState<boolean>(false);

  // Safe battery constraints
  const handleCapacityChange = (val: number) => {
    const clamped = Math.max(30, Math.min(300, isNaN(val) ? 120 : val));
    setBatteryCapacityKwh(clamped);
  };

  const handleReserveFloorChange = (val: number) => {
    const clamped = Math.max(10, Math.min(50, isNaN(val) ? 20 : val));
    setBatteryReserveFloorPct(clamped);
  };

  const batteryTotalCapacity = params.batteryTotalCapacityKwh ?? 120;
  const batteryReserveFloor = params.batteryReserveFloorPct ?? 20;

  const usableCapacityKwh = Math.max(
    0,
    batteryTotalCapacity * ((params.batterySocPct - batteryReserveFloor) / 100)
  );

  return (
    <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-slate-900">
                Simulation Control Console
              </CardTitle>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                Deterministic Engine
              </span>
            </div>
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
        {/* Scenario Presets Bar */}
        <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <BookmarkCheck className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Scenario Presets:
              </span>
              <span className="text-xs text-slate-500">
                Select a documented scenario for demonstration
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
            >
              <Settings2 className="w-3.5 h-3.5 text-slate-500" />
              {showAdvancedSettings ? "Hide Capacity Config" : "Configure Battery Bank"}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {SCENARIO_PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => loadScenarioPreset(preset.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    isActive
                      ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 text-slate-900 shadow-2xs"
                      : "border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold truncate">
                      {preset.name.split("(")[0]}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                    {preset.shortDescription}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Preset Narrative */}
          {activePresetId && (
            <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900">Active Scenario: </span>
              {
                SCENARIO_PRESETS.find((p) => p.id === activePresetId)
                  ?.narrative
              }
            </div>
          )}

          {/* Expandable Advanced Battery Capacity & Reserve Floor Controls */}
          {showAdvancedSettings && (
            <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
              <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="battery-capacity-input"
                    className="text-xs font-bold text-slate-900"
                  >
                    Battery Total Capacity
                  </label>
                  <span className="text-xs font-bold font-mono text-emerald-800">
                    {params.batteryTotalCapacityKwh} kWh
                  </span>
                </div>
                <input
                  id="battery-capacity-input"
                  type="number"
                  min="30"
                  max="300"
                  step="10"
                  value={params.batteryTotalCapacityKwh}
                  onChange={(e) => handleCapacityChange(Number(e.target.value))}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-slate-900 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                />
                <p className="text-[10px] text-slate-500">
                  LiFePO4 industrial rating: 30 kWh minimum to 300 kWh maximum
                </p>
              </div>

              <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="reserve-floor-slider"
                    className="text-xs font-bold text-slate-900"
                  >
                    Reserve Floor Cutoff
                  </label>
                  <span className="text-xs font-bold font-mono text-amber-700">
                    {params.batteryReserveFloorPct}% Minimum
                  </span>
                </div>
                <input
                  id="reserve-floor-slider"
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={params.batteryReserveFloorPct}
                  onChange={(e) =>
                    handleReserveFloorChange(Number(e.target.value))
                  }
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>10% Low</span>
                  <span>Usable Reserve: {usableCapacityKwh.toFixed(1)} kWh</span>
                  <span>50% High</span>
                </div>
              </div>
            </div>
          )}
        </div>

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
                <span className="text-amber-600 font-semibold">
                  {params.batteryReserveFloorPct}% Reserve
                </span>
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
              Cummins 160kVA prime genset. ₦1,300/L diesel (0.28 L/kWh burn rate).
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
