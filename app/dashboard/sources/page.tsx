import * as React from "react";
import { Metadata } from "next";
import { Zap, Sun, BatteryCharging, Power, Activity, ShieldCheck } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { energyService } from "@/services";
import { formatPower, formatEnergy, formatPercentage, formatCurrency } from "@/lib/formatters";

export const metadata: Metadata = {
  title: "Energy Sources — GridMind Console",
  description: "Monitor real-time status across national grid, solar array, battery ESS, and generators.",
};

export default async function EnergySourcesPage() {
  const metrics = await energyService.getDashboardMetrics();
  const { grid, solar, battery, generator } = metrics;

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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-brand-800" />
                <CardTitle>{grid.name}</CardTitle>
              </div>
              <Badge variant="healthy" size="sm" className="font-mono uppercase text-[10px]">
                {grid.status}
              </Badge>
            </div>
            <CardDescription>Ikeja Electric 11kV Dedicated Industrial Feeder</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Active Import</span>
                <span className="text-base font-bold text-slate-900">{formatPower(grid.currentPowerKw)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Grid Voltage</span>
                <span className="text-base font-bold text-slate-900">{grid.voltageV} V</span>
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
              <Badge variant="healthy" size="sm" className="font-mono uppercase text-[10px]">
                {solar.status}
              </Badge>
            </div>
            <CardDescription>75 kWp Rooftop Monocrystalline PV Array</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Generation</span>
                <span className="text-base font-bold text-slate-900">{formatPower(solar.currentPowerKw)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Solar Irradiance</span>
                <span className="text-base font-bold text-slate-900">{solar.irradianceWm2} W/m²</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Today&apos;s Output</span>
                <span className="text-base font-bold text-amber-700">{formatEnergy(solar.dailyGenerationKwh)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Battery ESS Bank */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BatteryCharging className="h-5 w-5 text-emerald-600" />
                <CardTitle>{battery.name}</CardTitle>
              </div>
              <Badge variant="info" size="sm" className="font-mono uppercase text-[10px]">
                {battery.mode}
              </Badge>
            </div>
            <CardDescription>120 kWh LiFePO4 Chemistry · 60 kW Inverter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">State of Charge</span>
                <span className="text-base font-bold text-emerald-700">{formatPercentage(battery.stateOfChargePct)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Stored Energy</span>
                <span className="text-base font-bold text-slate-900">{formatEnergy(battery.currentStoredKwh)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Battery Health (SOH)</span>
                <span className="text-base font-bold text-slate-900">{battery.healthPct}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diesel Generator */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Power className="h-5 w-5 text-slate-500" />
                <CardTitle>{generator.name}</CardTitle>
              </div>
              <Badge variant="outline" size="sm" className="font-mono uppercase text-[10px]">
                {generator.status}
              </Badge>
            </div>
            <CardDescription>Cummins 160kVA Prime Generator · 480L Diesel Stored</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Output Demand</span>
                <span className="text-base font-bold text-slate-500">{formatPower(generator.currentPowerKw)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Fuel Level</span>
                <span className="text-base font-bold text-slate-900">{generator.fuelLevelPct}% (480L)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Generation Cost</span>
                <span className="text-base font-bold text-red-700">₦{generator.effectiveCostPerKwh.toFixed(0)}/kWh</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
