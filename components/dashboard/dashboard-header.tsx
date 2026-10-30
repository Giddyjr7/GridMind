"use client";

import Link from "next/link";
import { MapPin, RefreshCw } from "lucide-react";
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
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-xl font-bold tracking-tight text-slate-950">{site.name}</h2>
          <Badge variant={grid.isAvailable ? "healthy" : "critical"} size="sm">
            <span className={grid.isAvailable ? "h-1.5 w-1.5 rounded-full bg-emerald-500" : "h-1.5 w-1.5 rounded-full bg-rose-500"} />
            {grid.isAvailable ? "Grid online" : "Grid outage"}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {site.location.city}, {site.location.state}
          </span>
          <span className="text-xs text-slate-400" suppressHydrationWarning>Updated {lastUpdated}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
          {onRefresh && (
            <Tooltip content="Refresh telemetry">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="gap-1.5"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-brand-800" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </Tooltip>
          )}

          <Link href="/dashboard/simulator">
            <Button size="sm" className="bg-brand-950 hover:bg-brand-900 text-white font-medium">
              Run a scenario
            </Button>
          </Link>
      </div>
    </div>
  );
}
