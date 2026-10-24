"use client";

import * as React from "react";
import {
  Activity,
  Zap,
  Sun,
  BatteryCharging,
  Power,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Coins,
  ArrowRight,
  TrendingDown,
  AlertOctagon,
  Info,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSimulation } from "@/context/simulation-context";
import { formatPower, formatEnergy, formatCurrency } from "@/lib/formatters";

export function LiveEnergyStatus() {
  const { params, flows } = useSimulation();

  const getRuntimeBadgeVariant = () => {
    if (params.gridAvailable) return "healthy";
    if (flows.estimatedBackupRuntimeHours === null) return "healthy";
    if (flows.estimatedBackupRuntimeHours >= 3.0) return "healthy";
    if (flows.estimatedBackupRuntimeHours >= 1.0) return "warning";
    return "critical";
  };

  const getCriticalBadgeVariant = () => {
    if (flows.criticalLoadStatusText === "protected") return "healthy";
    if (flows.criticalLoadStatusText === "at_risk") return "warning";
    return "critical";
  };

  return (
    <div className="space-y-4">
      {/* 1. Primary Calculated KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Active Load */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-600" />
              Active Load
            </span>
            <Badge variant="neutral" size="sm" className="font-mono text-[10px]">
              Demand
            </Badge>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatPower(flows.totalActiveDemandKw)}
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Critical: {formatPower(flows.criticalDemandKw)} | Deferrable: {formatPower(flows.deferrableDemandKw)}
          </p>
        </div>

        {/* Battery Usable Energy */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
              Usable Battery
            </span>
            <Badge
              variant={params.batterySocPct > 20 ? "healthy" : "warning"}
              size="sm"
              className="font-mono text-[10px]"
            >
              {params.batterySocPct}% SOC
            </Badge>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatEnergy(flows.batteryUsableKwh)}
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Raw: {formatEnergy(flows.batteryRawStoredKwh)} (24 kWh reserve floor)
          </p>
        </div>

        {/* Estimated Backup Runtime */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Backup Runtime
            </span>
            <Badge variant={getRuntimeBadgeVariant()} size="sm" className="font-mono text-[10px]">
              {params.gridAvailable ? "Mains" : "Islanded"}
            </Badge>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight truncate">
            {flows.runtimeDisplayString}
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            {params.gridAvailable
              ? "Continuous feeder connection"
              : flows.batteryContributionKw > 0
              ? `Derived from ${flows.batteryUsableKwh} kWh / ${flows.batteryContributionKw} kW`
              : "Solar or generator supported"}
          </p>
        </div>

        {/* Operating Cost Rate */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              Run Cost Rate
            </span>
            <Badge variant="neutral" size="sm" className="font-mono text-[10px]">
              Hourly
            </Badge>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(flows.hourlyOperatingCostNgn, "NGN")}/hr
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            {flows.generatorContributionKw > 0
              ? `Includes ${flows.generatorFuelBurnRateLph} L/hr diesel burn`
              : params.gridAvailable
              ? "Band A grid tariff (₦206/kWh)"
              : "Levelized battery + solar amortization"}
          </p>
        </div>

        {/* Critical Cold Chain Status */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Cold Chain Safe
            </span>
            <Badge variant={getCriticalBadgeVariant()} size="sm" className="font-mono text-[10px] uppercase">
              {flows.criticalLoadStatusText}
            </Badge>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight capitalize">
            {flows.criticalLoadsCovered ? "100% Protected" : "Deficit Warning"}
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            {flows.criticalLoadsCovered
              ? "Freezers & vaccines within thermal limits"
              : "Deficit may compromise refrigeration"}
          </p>
        </div>
      </div>

      {/* 2. Microgrid Live Source Dispatch Balance Card */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Live Source Dispatch Balance
            </span>
            <Badge variant="outline" size="sm" className="font-mono text-[10px]">
              Sum: {formatPower(flows.totalActiveDemandKw)} Demand
            </Badge>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Deterministic rule: Solar PV → Battery → Genset → Load Shedding
          </span>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {/* Dispatch Sources Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {/* Grid Supply */}
            <div className={`p-3 rounded-lg border transition-colors ${
              flows.gridContributionKw > 0
                ? "bg-blue-50/70 border-blue-200"
                : "bg-slate-50 border-slate-200 opacity-60"
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-blue-600" />
                  Grid
                </span>
                <span className="text-[10px] uppercase font-mono">
                  {params.gridAvailable ? "Mains" : "Off"}
                </span>
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {formatPower(flows.gridContributionKw)}
              </div>
              <p className="text-[10px] text-slate-500">
                {params.gridAvailable ? "₦206/kWh" : "0V Offline"}
              </p>
            </div>

            {/* Solar Supply */}
            <div className={`p-3 rounded-lg border transition-colors ${
              flows.solarContributionKw > 0
                ? "bg-amber-50/70 border-amber-200"
                : "bg-slate-50 border-slate-200 opacity-60"
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1">
                  <Sun className="w-3 h-3 text-amber-500" />
                  Solar PV
                </span>
                <span className="text-[10px] uppercase font-mono">
                  {flows.solarContributionKw > 0 ? "Active" : "0 kW"}
                </span>
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {formatPower(flows.solarContributionKw)}
              </div>
              <p className="text-[10px] text-slate-500">
                Free daytime kWh
              </p>
            </div>

            {/* Battery Net Flow */}
            <div className={`p-3 rounded-lg border transition-colors ${
              flows.batteryContributionKw > 0
                ? "bg-emerald-50/70 border-emerald-200"
                : flows.batteryContributionKw < 0
                ? "bg-teal-50/70 border-teal-200"
                : "bg-slate-50 border-slate-200 opacity-60"
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1">
                  <BatteryCharging className="w-3 h-3 text-emerald-600" />
                  Battery Bank
                </span>
                <span className="text-[10px] uppercase font-mono">
                  {flows.batteryContributionKw > 0
                    ? "Discharge"
                    : flows.batteryContributionKw < 0
                    ? "Charging"
                    : "Holding"}
                </span>
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {flows.batteryContributionKw < 0
                  ? `-${formatPower(Math.abs(flows.batteryContributionKw))}`
                  : formatPower(flows.batteryContributionKw)}
              </div>
              <p className="text-[10px] text-slate-500">
                {params.batterySocPct}% ({flows.batteryUsableKwh} kWh)
              </p>
            </div>

            {/* Generator Supply */}
            <div className={`p-3 rounded-lg border transition-colors ${
              flows.generatorContributionKw > 0
                ? "bg-amber-100/70 border-amber-300"
                : "bg-slate-50 border-slate-200 opacity-60"
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1">
                  <Power className="w-3 h-3 text-amber-700" />
                  Generator
                </span>
                <span className="text-[10px] uppercase font-mono">
                  {flows.generatorContributionKw > 0 ? "Engaged" : "Standby"}
                </span>
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {formatPower(flows.generatorContributionKw)}
              </div>
              <p className="text-[10px] text-slate-500">
                {flows.generatorFuelBurnRateLph > 0
                  ? `${flows.generatorFuelBurnRateLph} L/hr diesel`
                  : "0 L/hr"}
              </p>
            </div>

            {/* Deficit / Unmet Load */}
            <div className={`p-3 rounded-lg border transition-colors col-span-2 sm:col-span-1 ${
              flows.unmetDemandKw > 0
                ? "bg-rose-50 border-rose-300"
                : "bg-slate-50 border-slate-200 opacity-60"
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1">
                  <AlertOctagon className={`w-3 h-3 ${flows.unmetDemandKw > 0 ? "text-rose-600" : "text-slate-400"}`} />
                  Unmet Deficit
                </span>
                <span className="text-[10px] uppercase font-mono">
                  {flows.unmetDemandKw > 0 ? "Overload" : "0 kW"}
                </span>
              </div>
              <div className={`text-lg font-bold mt-1 ${flows.unmetDemandKw > 0 ? "text-rose-700" : "text-slate-900"}`}>
                {formatPower(flows.unmetDemandKw)}
              </div>
              <p className="text-[10px] text-slate-500">
                {flows.unmetDemandKw > 0 ? "Requires load shedding" : "Zero deficit"}
              </p>
            </div>
          </div>

          {/* System Status Summary Banner */}
          <div className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
            flows.criticalLoadStatusText === "protected"
              ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
              : flows.criticalLoadStatusText === "at_risk"
              ? "bg-amber-50/70 border-amber-200 text-amber-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}>
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span className="font-semibold">{flows.systemStatusSummary}</span>
            </div>
            <span className="text-[10px] font-mono uppercase font-semibold">
              GridMind Realtime Engine
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
