"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Clock,
  Zap,
  Play,
  RefreshCw,
  Info,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Cpu,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { BusinessSite, GridSource } from "@/types/energy";

interface DashboardHeaderProps {
  site: BusinessSite;
  grid: GridSource;
  lastUpdated: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function DashboardHeader({
  site,
  grid,
  lastUpdated,
  onRefresh,
  isRefreshing = false,
}: DashboardHeaderProps) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
      {/* Top Bar: Site Context, Badges, and Action Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Site Identity */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              {site.name}
            </h2>
            <Badge
              variant="warning"
              size="sm"
              className="font-mono text-[10px] uppercase font-bold tracking-wider"
            >
              SIMULATED BENCHMARK
            </Badge>
            <Badge
              variant={grid.isAvailable ? "healthy" : "critical"}
              size="sm"
              className="font-mono text-[10px] uppercase font-bold flex items-center gap-1.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {grid.isAvailable ? "GRID FEEDER ONLINE (Band A)" : "FEEDER OUTAGE"}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {site.location.city}, {site.location.state}, {site.location.country}
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="font-medium text-slate-600">
              Contracted Capacity: <strong className="text-slate-800">{site.contractedDemandKw} kW</strong>
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="font-mono text-emerald-950 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-300 font-bold">
              Tariff: ₦{grid.tariffPerKwh}/kWh (IE 11kV Industrial)
            </span>
          </div>
        </div>

        {/* Action Controls: Refresh & Simulator CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onRefresh && (
            <Tooltip content="Poll latest telemetry state">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="gap-1.5 text-slate-600 border-slate-300 hover:bg-slate-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-brand-800" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </Tooltip>
          )}

          <Link href="/dashboard/simulator">
            <Button size="sm" className="bg-brand-950 hover:bg-brand-900 text-white gap-2 font-medium shadow-sm">
              <Cpu className="h-4 w-4 text-emerald-400" />
              Open Energy Simulator
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom Simulated Context Strip */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Info className="h-3.5 w-3.5 text-slate-400" />
          <span>
            Simulated Clock: <strong className="text-slate-700">Thursday, Oct 24, 2024 · 12:45 PM WAT</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
          <span suppressHydrationWarning>Telemetry Sync: {lastUpdated}</span>
          <span>•</span>
          <span className="text-emerald-700 font-semibold">100% Ingest Valid</span>
        </div>
      </div>
    </div>
  );
}
