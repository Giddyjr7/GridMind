"use client";

import * as React from "react";
import {
  Bell,
  Activity,
  Sun,
  BatteryCharging,
  Zap,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { envConfig } from "@/config/env";
import { MOCK_DASHBOARD_METRICS } from "@/mocks/demo-business";
import { formatPower, formatPercentage } from "@/lib/formatters";

interface HeaderProps {
  title?: string;
  description?: string;
}

export function Header({
  title = "System Overview",
  description = "Real-time energy continuity & microgrid orchestration",
}: HeaderProps) {
  const { telemetry } = MOCK_DASHBOARD_METRICS;

  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between px-6">
      {/* Page Title & Context */}
      <div>
        <h1 className="text-base font-semibold text-slate-900 leading-none">
          {title}
        </h1>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>

      {/* Live System Quick Status Ribbon */}
      <div className="flex items-center gap-4">
        {/* Quick telemetry indicators */}
        <div className="hidden lg:flex items-center gap-3 pr-4 border-r border-slate-200">
          {/* Grid Status */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/80">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-700">Grid:</span>
            <span className="font-semibold text-slate-900">
              {formatPower(telemetry.gridImportKw)}
            </span>
          </div>

          {/* Solar Generation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/80">
            <Sun className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-medium text-slate-700">Solar:</span>
            <span className="font-semibold text-slate-900">
              {formatPower(telemetry.solarGenerationKw)}
            </span>
          </div>

          {/* Battery SOC */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/80">
            <BatteryCharging className="h-3.5 w-3.5 text-emerald-600" />
            <span className="font-medium text-slate-700">Battery:</span>
            <span className="font-semibold text-slate-900">
              {formatPercentage(telemetry.batterySocPct)}
            </span>
          </div>

          {/* Active Total Load */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/80">
            <Zap className="h-3.5 w-3.5 text-brand-700" />
            <span className="font-medium text-slate-700">Total Load:</span>
            <span className="font-semibold text-slate-900">
              {formatPower(telemetry.currentLoadKw)}
            </span>
          </div>
        </div>

        {/* Demo Data Banner Indicator */}
        <Badge
          variant={envConfig.isMock ? "warning" : "healthy"}
          size="sm"
          className="cursor-default select-none hidden sm:inline-flex"
          title={
            envConfig.isMock
              ? "All values shown are synthetic demonstration metrics. No real load shedding or telemetry is active."
              : "Connected to backend API."
          }
        >
          <Info className="h-3 w-3" />
          {envConfig.isMock ? "MOCK DEMO MODE" : "API CONNECTED"}
        </Badge>

        {/* Alerts Notification Bell */}
        <button
          type="button"
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="Recent System Alerts"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
        </button>

        {/* System Health Pulse */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-900">System Healthy</p>
            <p className="text-[10px] text-slate-400">All assets synced</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Activity className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
