"use client";

import * as React from "react";
import {
  Zap,
  Sun,
  BatteryCharging,
  Power,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GridSource, SolarSource, BatteryStatus, GeneratorSource } from "@/types/energy";
import { formatPower, formatEnergy, formatPercentage } from "@/lib/formatters";

interface PowerSourcesOverviewProps {
  grid: GridSource;
  solar: SolarSource;
  battery: BatteryStatus;
  generator: GeneratorSource;
  totalLoadKw: number;
}

export function PowerSourcesOverview({
  grid,
  solar,
  battery,
  generator,
  totalLoadKw,
}: PowerSourcesOverviewProps) {
  // Proportional power supply calculations
  const gridSharePct = totalLoadKw > 0 ? Math.round((grid.currentPowerKw / totalLoadKw) * 100) : 0;
  const solarSharePct = totalLoadKw > 0 ? Math.round((solar.currentPowerKw / totalLoadKw) * 100) : 0;
  const batterySharePct = totalLoadKw > 0 ? Math.round((Math.max(0, battery.currentPowerKw) / totalLoadKw) * 100) : 0;
  const generatorSharePct = totalLoadKw > 0 ? Math.round((generator.currentPowerKw / totalLoadKw) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>Energy sources</CardTitle>
            <CardDescription>Where the facility&apos;s power is coming from right now</CardDescription>
          </div>
          <Badge variant="outline" size="sm" className="font-mono text-[10px]">
            Total Supply: {formatPower(totalLoadKw)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Visual Supply Distribution Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Instantaneous Generation Mix</span>
            <span className="font-mono text-emerald-800">
              {solarSharePct}% Clean Solar / {gridSharePct}% Grid Utility
            </span>
          </div>

          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            {/* Grid */}
            <div
              style={{ width: `${gridSharePct}%` }}
              className="bg-brand-900 transition-all duration-500"
              title={`Grid Import: ${gridSharePct}% (${formatPower(grid.currentPowerKw)})`}
            />
            {/* Solar */}
            <div
              style={{ width: `${solarSharePct}%` }}
              className="bg-amber-400 transition-all duration-500"
              title={`Solar Generation: ${solarSharePct}% (${formatPower(solar.currentPowerKw)})`}
            />
            {/* Battery Discharge */}
            {batterySharePct > 0 && (
              <div
                style={{ width: `${batterySharePct}%` }}
                className="bg-emerald-500 transition-all duration-500"
                title={`Battery ESS: ${batterySharePct}%`}
              />
            )}
            {/* Generator */}
            {generatorSharePct > 0 && (
              <div
                style={{ width: `${generatorSharePct}%` }}
                className="bg-red-500 transition-all duration-500"
                title={`Diesel Generator: ${generatorSharePct}%`}
              />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-900" />
              Grid Utility: <strong className="text-slate-800 font-mono">{gridSharePct}%</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Rooftop Solar: <strong className="text-slate-800 font-mono">{solarSharePct}%</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Battery ESS: <strong className="text-slate-800 font-mono">{batterySharePct}%</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              Diesel Gen: <strong className="text-slate-400 font-mono">{generatorSharePct}%</strong>
            </span>
          </div>
        </div>

        {/* 4 Source Detail Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. National Grid */}
          <div className="p-3 rounded-xl border border-slate-200/80 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-brand-800" />
                <span className="text-xs font-bold text-slate-900">National Grid</span>
              </div>
              <Badge variant={grid.isAvailable ? "healthy" : "critical"} size="sm" className="font-mono text-[9px] uppercase">
                {grid.status}
              </Badge>
            </div>
            <div>
              <span className="text-2xl font-bold font-mono tracking-tight text-slate-900">
                {grid.currentPowerKw.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 ml-1 font-medium">kW</span>
            </div>
            <div className="hidden">
              <div className="flex justify-between">
                <span>Voltage:</span>
                <span className="font-semibold text-slate-700">{grid.voltageV} V</span>
              </div>
              <div className="flex justify-between">
                <span>Frequency:</span>
                <span className="font-semibold text-slate-700">{grid.frequencyHz} Hz</span>
              </div>
              <div className="flex justify-between">
                <span>Tariff:</span>
                <span className="font-semibold text-emerald-800">₦{grid.tariffPerKwh}/kWh</span>
              </div>
            </div>
          </div>

          {/* 2. Solar PV */}
          <div className="p-3 rounded-xl border border-slate-200/80 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-900">Rooftop Solar</span>
              </div>
              <Badge variant="healthy" size="sm" className="font-mono text-[9px] uppercase">
                {solar.status}
              </Badge>
            </div>
            <div>
              <span className="text-2xl font-bold font-mono tracking-tight text-slate-900">
                {solar.currentPowerKw.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 ml-1 font-medium">kW</span>
            </div>
            <div className="hidden">
              <div className="flex justify-between">
                <span>Irradiance:</span>
                <span className="font-semibold text-slate-700">{solar.irradianceWm2} W/m²</span>
              </div>
              <div className="flex justify-between">
                <span>Inverter Eff.:</span>
                <span className="font-semibold text-slate-700">{solar.inverterEfficiencyPct}%</span>
              </div>
              <div className="flex justify-between">
                <span>Daily Gen:</span>
                <span className="font-semibold text-amber-700">{formatEnergy(solar.dailyGenerationKwh)}</span>
              </div>
            </div>
          </div>

          {/* 3. Battery ESS */}
          <div className="p-3 rounded-xl border border-slate-200/80 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BatteryCharging className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">Battery ESS</span>
              </div>
              <Badge variant="info" size="sm" className="font-mono text-[9px] uppercase">
                {battery.mode}
              </Badge>
            </div>
            <div>
              <span className="text-2xl font-bold font-mono tracking-tight text-slate-900">
                {battery.stateOfChargePct}
              </span>
              <span className="text-xs text-slate-500 ml-1 font-medium">% SOC</span>
            </div>
            <div className="hidden">
              <div className="flex justify-between">
                <span>Stored Energy:</span>
                <span className="font-semibold text-slate-700">{formatEnergy(battery.currentStoredKwh)}</span>
              </div>
              <div className="flex justify-between">
                <span>Net Flow:</span>
                <span className="font-semibold text-slate-700">0.0 kW (Idle)</span>
              </div>
              <div className="flex justify-between">
                <span>Health (SOH):</span>
                <span className="font-semibold text-emerald-800">{battery.healthPct}%</span>
              </div>
            </div>
          </div>

          {/* 4. Diesel Generator */}
          <div className="p-3 rounded-xl border border-slate-200/80 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Power className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-900">Diesel Backup</span>
              </div>
              <Badge variant="neutral" size="sm" className="font-mono text-[9px] uppercase">
                {generator.status}
              </Badge>
            </div>
            <div>
              <span className="text-2xl font-bold font-mono tracking-tight text-slate-400">
                0.0
              </span>
              <span className="text-xs text-slate-400 ml-1 font-medium">kW</span>
            </div>
            <div className="hidden">
              <div className="flex justify-between">
                <span>Fuel Level:</span>
                <span className="font-semibold text-slate-700">{generator.fuelLevelPct}% ({generator.fuelCurrentLiters}L)</span>
              </div>
              <div className="flex justify-between">
                <span>Diesel Cost:</span>
                <span className="font-semibold text-slate-700">₦{generator.fuelCostPerLiter}/L</span>
              </div>
              <div className="flex justify-between">
                <span>Effective LCOE:</span>
                <span className="font-semibold text-slate-500">₦{generator.effectiveCostPerKwh.toFixed(0)}/kWh</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
