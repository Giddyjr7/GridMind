"use client";

import * as React from "react";
import {
  Zap,
  Sun,
  BatteryCharging,
  Power,
  Activity,
  ShieldCheck,
  ShieldAlert,
  Coins,
  Clock,
  Sliders,
  Settings,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Lightbulb,
} from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SourceConfigModal } from "@/components/sources";
import { useSimulation } from "@/context/simulation-context";
import { formatPower, formatEnergy, formatPercentage, formatCurrency, formatDateTime } from "@/lib/formatters";

export default function EnergySourcesPage() {
  const {
    derivedDashboardMetrics,
    params,
    flows,
    lastSimulatedTick,
    feedbackMessage,
    clearFeedback,
    updateSourceConfig,
    resetToDefaultScenario,
  } = useSimulation();

  const { grid, solar, battery, generator } = derivedDashboardMetrics;

  const [configSource, setConfigSource] = React.useState<
    "grid" | "solar" | "battery" | "generator" | null
  >(null);

  // Proportional supply calculation
  const totalLoad = flows.totalActiveDemandKw;
  const gridPct = totalLoad > 0 ? Math.round((flows.gridContributionKw / totalLoad) * 100) : 0;
  const solarPct = totalLoad > 0 ? Math.round((flows.solarContributionKw / totalLoad) * 100) : 0;
  const batteryPct = totalLoad > 0 ? Math.round((Math.max(0, flows.batteryContributionKw) / totalLoad) * 100) : 0;
  const genPct = totalLoad > 0 ? Math.round((flows.generatorContributionKw / totalLoad) * 100) : 0;

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Section Heading */}
        <SectionHeading
          title="Energy Sources & Storage Assets"
          description="Monitor grid, solar, battery and generator availability from one place."
          badge={
            <Badge variant="neutral" size="sm">
              4 sources
            </Badge>
          }
          actions={
            <div className="flex items-center gap-2">
              <Badge variant="healthy" size="sm">
                Live telemetry
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={resetToDefaultScenario}
                className="text-xs h-7 text-slate-600 border-slate-200 hover:bg-slate-50"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset Defaults
              </Button>
            </div>
          }
        />

        {/* Global Action Confirmation Toast */}
        {feedbackMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-in fade-in duration-200 shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{feedbackMessage}</span>
            </div>
            <button
              type="button"
              onClick={clearFeedback}
              className="text-[11px] text-emerald-700 hover:underline font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Live Generation Mix Strip */}
        <Card className="p-4 bg-white border-slate-200 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Instantaneous Generation Dispatch Mix
              </span>
              <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                Total: {formatPower(totalLoad)}
              </Badge>
            </div>
            <span className="text-slate-500 text-[11px]">
              Current Run Rate: <strong className="text-emerald-700 font-mono font-bold">{formatCurrency(flows.hourlyOperatingCostNgn, "NGN")}/hr</strong>
            </span>
          </div>

          {/* Proportional Generation Mix Bar */}
          <div className="h-4 rounded-full bg-slate-100 overflow-hidden flex border border-slate-200/60 shadow-inner">
            {gridPct > 0 && (
              <div
                style={{ width: `${gridPct}%` }}
                className="bg-brand-950 h-full transition-all duration-300"
                title={`Grid: ${gridPct}% (${flows.gridContributionKw} kW)`}
              />
            )}
            {solarPct > 0 && (
              <div
                style={{ width: `${solarPct}%` }}
                className="bg-brand-400 h-full transition-all duration-300"
                title={`Solar: ${solarPct}% (${flows.solarContributionKw} kW)`}
              />
            )}
            {batteryPct > 0 && (
              <div
                style={{ width: `${batteryPct}%` }}
                className="bg-brand-600 h-full transition-all duration-300"
                title={`Battery: ${batteryPct}% (${flows.batteryContributionKw} kW)`}
              />
            )}
            {genPct > 0 && (
              <div
                style={{ width: `${genPct}%` }}
                className="bg-slate-500 h-full transition-all duration-300"
                title={`Generator: ${genPct}% (${flows.generatorContributionKw} kW)`}
              />
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1 flex-wrap gap-2">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-950 inline-block" />
                Grid ({gridPct}%)
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-400 inline-block" />
                Solar ({solarPct}%)
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-600 inline-block" />
                Battery ({batteryPct}%)
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />
                Generator ({genPct}%)
              </span>
            </div>

            <div suppressHydrationWarning className="text-[11px] font-mono text-slate-400">
              Synced: {formatDateTime(lastSimulatedTick)}
            </div>
          </div>
        </Card>

        {/* 2. Grid of 4 Detailed Source Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. National Grid */}
          <Card className={`border shadow-xs ${!params.gridAvailable ? "border-rose-200 bg-rose-50/20" : "border-slate-200 bg-white"}`}>
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
                  params.gridAvailable
                    ? "bg-brand-50 text-brand-800 border border-brand-100"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 leading-tight">
                    {grid.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Ikeja Electric 11kV Dedicated Industrial Feeder
                  </CardDescription>
                </div>
              </div>

              <Badge
                variant={params.gridAvailable ? "healthy" : "critical"}
                size="sm"
                className="font-mono uppercase text-[10px] font-bold"
              >
                {params.gridAvailable ? "Online (Band A)" : "Utility Blackout"}
              </Badge>
            </CardHeader>

            <CardContent className="p-4 space-y-3.5">
              <div className="grid grid-cols-3 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Active Import</span>
                  <span className="text-base font-bold text-slate-900">{formatPower(flows.gridContributionKw)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Feeder Voltage</span>
                  <span className="text-base font-bold text-slate-900">{params.gridAvailable ? "402 V (3-ph)" : "0 V (Offline)"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Active Tariff</span>
                  <span className="text-base font-bold text-emerald-700">₦{params.gridTariffPerKwhNgn}/kWh</span>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Contracted Demand Limit:</span>
                  <strong className="text-slate-900 font-mono">{params.contractedDemandLimitKw || 150} kW</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Frequency & Power Factor:</span>
                  <strong className="text-slate-900 font-mono">{params.gridAvailable ? "50.0 Hz • 0.94 PF" : "0.0 Hz"}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Telemetry Ingest Status:</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Modbus Node IE-01 (100% Ingest Valid)
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50/60 border-t border-slate-100 py-3 px-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Hourly Tariff Cost: <strong className="text-slate-800 font-mono">{formatCurrency(flows.gridContributionKw * params.gridTariffPerKwhNgn, "NGN")}/hr</strong>
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfigSource("grid")}
                className="text-xs h-8 text-brand-800 border-brand-200 hover:bg-brand-50"
              >
                <Settings className="w-3.5 h-3.5 mr-1" />
                Configure Feeder
              </Button>
            </CardFooter>
          </Card>

          {/* 2. Solar PV Array */}
          <Card className="border border-slate-200 bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-800 border border-brand-100 flex items-center justify-center shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 leading-tight">
                    {solar.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Commercial Rooftop Monocrystalline Array
                  </CardDescription>
                </div>
              </div>

              <Badge
                variant={params.solarEnabled && flows.solarContributionKw > 0 ? "healthy" : "neutral"}
                size="sm"
                className="font-mono uppercase text-[10px] font-bold"
              >
                {params.solarEnabled && flows.solarContributionKw > 0
                  ? "Active Generating"
                  : "Night Standby (0kW)"}
              </Badge>
            </CardHeader>

            <CardContent className="p-4 space-y-3.5">
              <div className="grid grid-cols-3 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Generation</span>
                  <span className="text-base font-bold text-amber-600">{formatPower(flows.solarContributionKw)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Installed Size</span>
                  <span className="text-base font-bold text-slate-900">{params.solarInstalledCapacityKwp || 75} kWp</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Amortized LCOE</span>
                  <span className="text-base font-bold text-emerald-700">₦42.00/kWh</span>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Plane-of-Array Irradiance:</span>
                  <strong className="text-slate-900 font-mono">
                    {params.solarEnabled && flows.solarContributionKw > 0 ? "780 W/m² (Peak Midday)" : "0 W/m² (Night)"}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Inverter Efficiency & MPPT:</span>
                  <strong className="text-slate-900 font-mono">97.8% (SMA Dual MPPT)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Daily Projected Yield:</span>
                  <strong className="text-slate-900 font-mono">285.0 kWh today</strong>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50/60 border-t border-slate-100 py-3 px-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Capacity Factor: <strong className="text-slate-800 font-mono">{Math.round((flows.solarContributionKw / (params.solarInstalledCapacityKwp || 75)) * 100)}%</strong>
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfigSource("solar")}
                className="text-xs h-8 text-brand-800 border-brand-200 hover:bg-brand-50"
              >
                <Settings className="w-3.5 h-3.5 mr-1" />
                Configure Solar Array
              </Button>
            </CardFooter>
          </Card>

          {/* 3. Battery Storage (LiFePO4 ESS) */}
          <Card className="border border-slate-200 bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-800 border border-brand-100 flex items-center justify-center shrink-0">
                  <BatteryCharging className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 leading-tight">
                    {battery.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    120 kWh High-C Lithium Iron Phosphate (LiFePO4)
                  </CardDescription>
                </div>
              </div>

              <Badge
                variant={params.batterySocPct > 20 ? "healthy" : "warning"}
                size="sm"
                className="font-mono uppercase text-[10px] font-bold"
              >
                {params.batterySocPct}% SOC
              </Badge>
            </CardHeader>

            <CardContent className="p-4 space-y-3.5">
              <div className="grid grid-cols-3 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Usable Energy</span>
                  <span className="text-base font-bold text-emerald-700">{formatEnergy(flows.batteryUsableKwh)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Flow Mode</span>
                  <span className="text-base font-bold text-slate-900 capitalize">
                    {flows.batteryContributionKw > 0 ? "Discharge" : flows.batteryContributionKw < 0 ? "Charging" : "Holding"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Backup Runtime</span>
                  <span className="text-base font-bold text-blue-700 truncate">{flows.runtimeDisplayString}</span>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Raw Stored / Reserve Floor:</span>
                  <strong className="text-slate-900 font-mono">
                    {formatEnergy(flows.batteryRawStoredKwh)} (Floor: {params.batteryReserveFloorPct}%)
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Operating Temperature & SOH:</span>
                  <strong className="text-slate-900 font-mono">30.2°C • 98.4% State of Health</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Cycle Count & Inverter Efficiency:</span>
                  <strong className="text-slate-900 font-mono">412 Cycles • {params.inverterEfficiencyPct}% round-trip</strong>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50/60 border-t border-slate-100 py-3 px-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Discharge C-Rate: <strong className="text-slate-800 font-mono">{(Math.max(0, flows.batteryContributionKw) / 120).toFixed(2)} C</strong>
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfigSource("battery")}
                className="text-xs h-8 text-brand-800 border-brand-200 hover:bg-brand-50"
              >
                <Settings className="w-3.5 h-3.5 mr-1" />
                Configure Battery ESS
              </Button>
            </CardFooter>
          </Card>

          {/* 4. Diesel Generator */}
          <Card className="border border-slate-200 bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-800 border border-brand-100 flex items-center justify-center shrink-0">
                  <Power className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 leading-tight">
                    {generator.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Cummins 160 kVA Prime Industrial Genset
                  </CardDescription>
                </div>
              </div>

              <Badge
                variant={flows.generatorContributionKw > 0 ? "warning" : "neutral"}
                size="sm"
                className="font-mono uppercase text-[10px] font-bold"
              >
                {flows.generatorContributionKw > 0 ? "Running / Supplying" : params.generatorMode}
              </Badge>
            </CardHeader>

            <CardContent className="p-4 space-y-3.5">
              <div className="grid grid-cols-3 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Active Output</span>
                  <span className="text-base font-bold text-slate-900">{formatPower(flows.generatorContributionKw)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Burn Rate</span>
                  <span className="text-base font-bold text-amber-700">{flows.generatorFuelBurnRateLph} L/hr</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Diesel Tank</span>
                  <span className="text-base font-bold text-slate-900">73.8% (480 L)</span>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Effective Generation Cost:</span>
                  <strong className="text-slate-900 font-mono">
                    {formatCurrency(params.fuelCostPerLiterNgn * 0.285, "NGN")}/kWh (at ₦{params.fuelCostPerLiterNgn}/L)
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Prime Capacity & Alternator:</span>
                  <strong className="text-slate-900 font-mono">{params.generatorRatedCapacityKw || 128} kW (160 kVA @ 0.8 PF)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Engine Oil & Coolant Status:</span>
                  <strong className="text-slate-900 font-mono">385 kPa • 84°C (Normal)</strong>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50/60 border-t border-slate-100 py-3 px-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Run-Hours: <strong className="text-slate-800 font-mono">1,248 hrs (DSE-7320)</strong>
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfigSource("generator")}
                className="text-xs h-8 text-brand-800 border-brand-200 hover:bg-brand-50"
              >
                <Settings className="w-3.5 h-3.5 mr-1" />
                Configure Genset
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Source Configuration Dialog Modal */}
        <SourceConfigModal
          sourceType={configSource}
          params={params}
          isOpen={Boolean(configSource)}
          onClose={() => setConfigSource(null)}
          onSaveConfig={(source, updates) => updateSourceConfig(source, updates)}
        />
      </div>
    </PageContainer>
  );
}
