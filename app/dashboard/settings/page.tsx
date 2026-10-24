"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Sliders,
  Database,
  RefreshCw,
  ExternalLink,
  Zap,
  Cpu,
  FileCode2,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { envConfig } from "@/config/env";
import { useSimulation } from "@/context/simulation-context";
import { formatCurrency } from "@/lib/formatters";

export default function SettingsPage() {
  const { params, resetToDefaultScenario, feedbackMessage } = useSimulation();
  const [resetDone, setResetDone] = React.useState(false);

  const handleReset = () => {
    resetToDefaultScenario();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <PageContainer>
      <SectionHeading
        title="Facility Settings & API Integration"
        description="Site registration profile, active microgrid physical thresholds, backend FastAPI endpoint bindings, and hackathon demo reset mechanism."
        badge={
          <Badge variant="healthy" size="sm" className="font-mono text-[10px]">
            ACTIVE CONFIGURATION
          </Badge>
        }
      />

      {feedbackMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Facility Metadata & Profile */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-800" />
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Site Identity & Grid Connection
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Industrial cold chain depot registration metadata
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Facility Name:</span>
                <span className="font-bold text-slate-900">Krystal Ice Cold Storage Ltd.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Industry Classification:</span>
                <span className="font-semibold text-slate-800 uppercase font-mono text-[10px] bg-slate-200/70 px-2 py-0.5 rounded">
                  COLD STORAGE / BLAST FREEZING
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Geographic Location:</span>
                <span className="font-semibold text-slate-800">
                  Ikeja Industrial Zone, Lagos State, Nigeria
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Distribution Feeder:</span>
                <span className="font-semibold text-slate-800">
                  Ikeja Electric (IE) Band A (₦206.00/kWh)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Contracted Maximum Demand:</span>
                <span className="font-mono font-bold text-slate-900">
                  {params.contractedDemandLimitKw ?? 150} kW
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end pt-1">
              <Link
                href="/dashboard/sources"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
              >
                <span>Edit Source Capacities & Tariffs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 2. Operational Thresholds & Simulation Defaults */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-brand-800" />
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Active Simulation Parameters
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Real-time microgrid physics and financial dispatch rules
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Grid Tariff:</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(params.gridTariffPerKwhNgn, "NGN")}/kWh
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Diesel Fuel Rate:</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(params.fuelCostPerLiterNgn, "NGN")}/L
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Battery Reserve Floor:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {params.batteryReserveFloorPct}% SOC (Guarded)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Inverter Efficiency:</span>
                <span className="font-mono font-bold text-slate-900">
                  {params.inverterEfficiencyPct}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Solar Array Capacity:</span>
                <span className="font-mono font-bold text-slate-900">
                  {params.solarInstalledCapacityKwp ?? 75} kWp
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
                className="text-xs h-8 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
              >
                <RotateCcw className={`w-3.5 h-3.5 text-slate-500 ${resetDone ? "animate-spin" : ""}`} />
                <span>{resetDone ? "Benchmark Restored!" : "Reset Demo Benchmark"}</span>
              </Button>

              <Link
                href="/dashboard/simulator"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
              >
                <span>Open Simulator Controls</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 3. Data Mode & API Readiness Boundary */}
        <Card className="border-slate-200 lg:col-span-2">
          <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-brand-800" />
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    FastAPI Backend Readiness & Service Boundary
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Typed service interfaces, environment toggles, and proposed backend integration contracts
                  </CardDescription>
                </div>
              </div>
              <Badge variant={envConfig.isMock ? "warning" : "healthy"} size="sm" className="font-mono text-[10px]">
                MODE: {envConfig.dataMode.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                <span className="text-slate-500 font-medium">Service Architecture:</span>
                <p className="font-bold text-slate-900 font-mono text-[11px]">
                  Decoupled Factory Pattern
                </p>
                <span className="text-[10px] text-slate-400">
                  Swappable mock/API clients via <code>services/index.ts</code>
                </span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                <span className="text-slate-500 font-medium">API Base URL:</span>
                <p className="font-bold text-slate-900 font-mono text-[11px] truncate">
                  {envConfig.apiBaseUrl}
                </p>
                <span className="text-[10px] text-slate-400">
                  Configured via <code>NEXT_PUBLIC_API_BASE_URL</code>
                </span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                <span className="text-slate-500 font-medium">Client Security:</span>
                <p className="font-bold text-emerald-700 font-mono text-[11px]">
                  Zero Secrets Exposed
                </p>
                <span className="text-[10px] text-slate-400">
                  No private keys or tokens bundled in client JS
                </span>
              </div>
            </div>

            {/* Backend Integration Checklist */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/30 space-y-3">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <FileCode2 className="w-4 h-4 text-emerald-600" />
                Backend Engineer Integration Checklist (Proposed Contracts)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><code>GET /site/profile</code>: Returns BusinessSite (name, tariff, capacity).</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><code>GET /telemetry/dashboard-metrics</code>: Returns live load kW, SOC %, grid status.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><code>GET /appliances</code> & <code>PATCH /appliances/:id/state</code>: Circuit control.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><code>GET /recommendations</code> & <code>POST /recommendations/:id/approve</code>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><code>GET /audit/events</code>: System disturbance and operator decision history.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><code>GET /forecast/today</code>: 24h solar potential & outage probability points.</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
