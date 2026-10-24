import * as React from "react";
import {
  Zap,
  Activity,
  Layers,
  Sparkles,
  Server,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Gauge,
  Cpu,
  Coins,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/metric-card";
import { energyService, applianceService, recommendationService } from "@/services";
import { envConfig } from "@/config/env";
import {
  formatPower,
  formatEnergy,
  formatCurrency,
  formatPercentage,
  formatTariff,
} from "@/lib/formatters";

export default async function DashboardPage() {
  // Consuming domain data exclusively via typed service interfaces
  const [metrics, appliances, recommendations] = await Promise.all([
    energyService.getDashboardMetrics(),
    applianceService.getAppliances(),
    recommendationService.getRecommendations(),
  ]);

  const { site, telemetry, grid, solar, battery, generator, cost } = metrics;

  return (
    <div className="space-y-6">
      {/* Foundation Status Banner */}
      <div className="rounded-xl border border-brand-200 bg-brand-50/70 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <h2 className="text-base font-semibold text-brand-950">
                Operational Foundation Console
              </h2>
              <Badge variant="healthy" size="sm">
                Production Ready
              </Badge>
            </div>
            <p className="text-xs text-brand-900/80 max-w-2xl leading-relaxed">
              Real-time telemetry and energy asset orchestration for Nigerian commercial cold storage infrastructure.
              Operating in {envConfig.dataMode.toUpperCase()} mode.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-brand-950">Data Mode: {envConfig.dataMode.toUpperCase()}</p>
              <p className="text-[10px] text-brand-800">FastAPI backend toggleable</p>
            </div>
            <Badge
              variant={envConfig.isMock ? "warning" : "healthy"}
              size="md"
              className="uppercase font-mono text-[11px]"
            >
              {envConfig.dataMode} Mode
            </Badge>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Foundation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Active Site Load"
          value={telemetry.currentLoadKw.toFixed(1)}
          unit="kW"
          subValue={`Contracted limit: ${formatPower(site.contractedDemandKw)}`}
          badgeText="Normal"
          badgeVariant="healthy"
          icon={<Gauge className="h-4 w-4" />}
        />

        <MetricCard
          label="Solar PV Generation"
          value={solar.currentPowerKw.toFixed(1)}
          unit="kW"
          subValue={`Installed: ${formatPower(solar.installedCapacityKwp)}p`}
          badgeText={solar.status.toUpperCase()}
          badgeVariant="healthy"
          icon={<Zap className="h-4 w-4" />}
        />

        <MetricCard
          label="Battery State of Charge"
          value={battery.stateOfChargePct}
          unit="%"
          subValue={`Stored: ${formatEnergy(battery.currentStoredKwh)}`}
          badgeText={`${battery.mode.toUpperCase()}`}
          badgeVariant="info"
          icon={<Cpu className="h-4 w-4" />}
        />

        <MetricCard
          label="Effective Hourly Cost"
          value={formatCurrency(cost.todayTotalCost / 12, "NGN", 0)}
          unit="/hr"
          subValue={`Grid Tariff: ${formatTariff(grid.tariffPerKwh)}`}
          badgeText="Grid Active"
          badgeVariant="healthy"
          icon={<Coins className="h-4 w-4" />}
        />
      </div>

      {/* Two Column Architectural Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Site & Asset Specifications */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Benchmark Facility</CardTitle>
                  <CardDescription>
                    Fictional commercial benchmark profile for testing optimization algorithms
                  </CardDescription>
                </div>
                <Badge variant="outline" size="sm">
                  Synthetic Dataset
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Facility Name:</span>
                    <span className="font-semibold text-slate-800">{site.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Location:</span>
                    <span className="font-semibold text-slate-800">
                      {site.location.city}, {site.location.state}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Utility / Tariff:</span>
                    <span className="font-semibold text-slate-800">{site.tariffBand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Contracted Demand:</span>
                    <span className="font-semibold text-slate-800">{formatPower(site.contractedDemandKw)}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Solar Array:</span>
                    <span className="font-semibold text-slate-800">{formatPower(solar.installedCapacityKwp)}p Monocrystalline</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Storage Capacity:</span>
                    <span className="font-semibold text-slate-800">{formatEnergy(battery.totalCapacityKwh)} LiFePO4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Backup Generator:</span>
                    <span className="font-semibold text-slate-800">{generator.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Diesel Fuel Cost:</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(generator.fuelCostPerLiter)}/L</span>
                  </div>
                </div>
              </div>

              {/* Connected Appliances Verification */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                  Appliance Priority Hierarchy (Sample of {appliances.length} Assets)
                </h4>
                <div className="space-y-2">
                  {appliances.slice(0, 4).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-white hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            app.priority === "critical"
                              ? "bg-red-500"
                              : app.priority === "important"
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{app.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {formatPower(app.currentPowerKw)} active · Rated {formatPower(app.ratedPowerKw)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            app.priority === "critical"
                              ? "critical"
                              : app.priority === "important"
                              ? "warning"
                              : "healthy"
                          }
                          size="sm"
                          className="capitalize text-[10px]"
                        >
                          {app.priority}
                        </Badge>
                        <Badge variant="outline" size="sm" className="capitalize text-[10px]">
                          {app.state}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Phase Roadmap & Integration Readiness */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Architecture Status</CardTitle>
              <CardDescription>Engineering deliverables completed in Phase 0</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Next.js App Router & Strict TypeScript</p>
                  <p className="text-slate-500">Zero `any` types; explicit kW, kWh, NGN, % units.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Dual Mode Service Abstraction</p>
                  <p className="text-slate-500">Seamless toggle between Mock Mode & FastAPI backend.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Tailwind Design Tokens</p>
                  <p className="text-slate-500">Deep forest green (#0e1f18), emerald accents, dark slate text.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Domain-Specific Mocks</p>
                  <p className="text-slate-500">Realistic Nigerian industrial cold storage benchmark profile.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
