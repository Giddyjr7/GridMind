"use client";

import * as React from "react";
import { Zap, Sun, BatteryCharging, Power, Activity, ShieldCheck, ShieldAlert } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSimulation } from "@/context/simulation-context";
import { formatPower, formatEnergy, formatPercentage, formatCurrency } from "@/lib/formatters";

export default function EnergySourcesPage() {
  const { derivedDashboardMetrics, params, flows } = useSimulation();
  const { grid, solar, battery, generator } = derivedDashboardMetrics;

  return (
    <PageContainer>
      <SectionHeading
        title="Energy Sources & Storage Assets"
        description="Real-time physical asset monitoring across the national utility feeder, rooftop solar array, battery storage bank, and diesel backup."
        badge={
          <Badge variant="healthy" size="sm" className="font-mono text-[10px]">
            4 ASSETS SYNCHRONIZED
          </Badge>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* National Grid */}
        <Card className={!params.gridAvailable ? "border-rose-200 bg-rose-50/20" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className={`h-5 w-5 ${params.gridAvailable ? "text-blue-600" : "text-rose-600"}`} />
                <CardTitle>{grid.name}</CardTitle>
              </div>
              <Badge
                variant={params.gridAvailable ? "healthy" : "critical"}
                size="sm"
                className="font-mono uppercase text-[10px]"
              >
                {params.gridAvailable ? "Online (Band A)" : "Blackout / Offline"}
              </Badge>
            </div>
            <CardDescription>Ikeja Electric 11kV Dedicated Industrial Feeder</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Active Import</span>
                <span className="text-base font-bold text-slate-900">{formatPower(flows.gridContributionKw)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Grid Voltage</span>
                <span className="text-base font-bold text-slate-900">{params.gridAvailable ? "402 V" : "0 V"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Utility Tariff</span>
                <span className="text-base font-bold text-emerald-700">₦{grid.tariffPerKwh}/kWh</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solar PV Array */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-amber-500" />
                <CardTitle>{solar.name}</CardTitle>
              </div>
              <Badge
                variant={params.solarEnabled && flows.solarContributionKw > 0 ? "healthy" : "neutral"}
                size="sm"
                className="font-mono uppercase text-[10px]"
              >
                {params.solarEnabled && flows.solarContributionKw > 0 ? "Active Generating" : "Standby / Night"}
              </Badge>
            </div>
            <CardDescription>Rooftop Commercial Monocrystalline Array</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Generation</span>
                <span className="text-base font-bold text-amber-600">{formatPower(flows.solarContributionKw)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Capacity</span>
                <span className="text-base font-bold text-slate-900">75.0 kWp</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Status</span>
                <span className="text-base font-bold text-emerald-700">
                  {params.solarEnabled ? "Surplus Mode" : "Off"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Battery ESS */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BatteryCharging className="h-5 w-5 text-emerald-600" />
                <CardTitle>{battery.name}</CardTitle>
              </div>
              <Badge
                variant={params.batterySocPct > 20 ? "healthy" : "warning"}
                size="sm"
                className="font-mono uppercase text-[10px]"
              >
                {params.batterySocPct}% SOC
              </Badge>
            </div>
            <CardDescription>120 kWh High-C-Rate Lithium Iron Phosphate (LiFePO4)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Usable Energy</span>
                <span className="text-base font-bold text-emerald-700">{formatEnergy(flows.batteryUsableKwh)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Flow Rate</span>
                <span className="text-base font-bold text-slate-900">{formatPower(flows.batteryContributionKw)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Remaining Runtime</span>
                <span className="text-base font-bold text-blue-700">{flows.runtimeDisplayString}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diesel Generator */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Power className="h-5 w-5 text-amber-600" />
                <CardTitle>{generator.name}</CardTitle>
              </div>
              <Badge
                variant={flows.generatorContributionKw > 0 ? "warning" : "neutral"}
                size="sm"
                className="font-mono uppercase text-[10px]"
              >
                {flows.generatorContributionKw > 0 ? "Running / Supplying" : params.generatorMode}
              </Badge>
            </div>
            <CardDescription>Cummins 160 kVA Prime Industrial Genset</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Active Output</span>
                <span className="text-base font-bold text-slate-900">{formatPower(flows.generatorContributionKw)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Burn Rate</span>
                <span className="text-base font-bold text-amber-700">{flows.generatorFuelBurnRateLph} L/hr</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Fuel Level</span>
                <span className="text-base font-bold text-slate-900">73.8% (480 L)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
