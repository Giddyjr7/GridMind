"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  Activity,
  Sun,
  BatteryCharging,
  Zap,
  Info,
  CheckCheck,
  AlertTriangle,
  User,
  Settings,
  LogOut,
  Building2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownItem,
  DropdownHeader,
  DropdownDivider,
} from "@/components/ui/dropdown-menu";
import { envConfig } from "@/config/env";
import { MOCK_DASHBOARD_METRICS } from "@/mocks/demo-business";
import { useSimulation } from "@/context/simulation-context";
import { formatPower, formatPercentage } from "@/lib/formatters";

interface HeaderProps {
  onOpenMobileSidebar?: () => void;
}

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "System Overview",
    subtitle: "Real-time energy continuity & microgrid orchestration",
  },
  "/dashboard/simulator": {
    title: "Energy Crisis Simulator",
    subtitle: "What-if grid outage scenario modeling & load shedding",
  },
  "/dashboard/recommendations": {
    title: "AI Energy Recommendations",
    subtitle: "Algorithmic dispatch guidance & operator approvals",
  },
  "/dashboard/equipment": {
    title: "Equipment & Load Hierarchy",
    subtitle: "Critical, important and deferrable asset prioritization",
  },
  "/dashboard/sources": {
    title: "Energy Sources & Storage",
    subtitle: "National grid, solar array, battery ESS & diesel generators",
  },
  "/dashboard/analytics": {
    title: "Cost & Runtime Analytics",
    subtitle: "Tariff efficiency, diesel avoidance & carbon abatement",
  },
  "/dashboard/history": {
    title: "Decision History & Audit Trail",
    subtitle: "Operator actions, approvals, and verified outcomes",
  },
  "/dashboard/settings": {
    title: "Facility Configuration",
    subtitle: "Tariff rules, site metadata and integration preferences",
  },
};

export function Header({ onOpenMobileSidebar }: HeaderProps) {
  const pathname = usePathname();
  const sim = useSimulation();

  const telemetry = sim?.derivedDashboardMetrics?.telemetry ?? MOCK_DASHBOARD_METRICS.telemetry;
  const events = sim?.events ?? [];
  const [unreadCount, setUnreadCount] = React.useState(2);

  const routeInfo = routeTitles[pathname] || {
    title: "Operations Console",
    subtitle: "Commercial microgrid management",
  };

  const markAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile Navigation Button & Page Title / Breadcrumbs */}
      <div className="flex items-center gap-3">
        {onOpenMobileSidebar && (
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Open navigation sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div>
          {/* Breadcrumbs */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-0.5">
            <Link href="/dashboard" className="hover:text-slate-600 transition-colors">
              Console
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-700 font-semibold">{routeInfo.title}</span>
          </div>

          <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-none truncate max-w-xs sm:max-w-md">
            {routeInfo.title}
          </h1>
        </div>
      </div>

      {/* Right: Telemetry Ribbon, Notifications, Site Context & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Real-Time Telemetry Ribbon (Desktop) */}
        <div className="hidden xl:flex items-center gap-2.5 pr-3 border-r border-slate-200">
          {/* Grid Status */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/80">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  telemetry.gridOnline ? "bg-emerald-400" : "bg-rose-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  telemetry.gridOnline ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
            </span>
            <span className="text-slate-500 font-medium">Grid:</span>
            <span className={`font-semibold font-mono ${telemetry.gridOnline ? "text-slate-900" : "text-rose-700"}`}>
              {telemetry.gridOnline ? formatPower(telemetry.gridImportKw) : "OFFLINE"}
            </span>
          </div>

          {/* Solar PV */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/80">
            <Sun className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-slate-500 font-medium">Solar:</span>
            <span className="font-semibold text-slate-900 font-mono">
              {formatPower(telemetry.solarGenerationKw)}
            </span>
          </div>

          {/* Battery ESS */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/80">
            <BatteryCharging
              className={`h-3.5 w-3.5 ${
                telemetry.batterySocPct <= 20 ? "text-rose-600" : "text-emerald-600"
              }`}
            />
            <span className="text-slate-500 font-medium">Battery:</span>
            <span
              className={`font-semibold font-mono ${
                telemetry.batterySocPct <= 20 ? "text-rose-700 font-bold" : "text-slate-900"
              }`}
            >
              {formatPercentage(telemetry.batterySocPct)}
            </span>
          </div>
        </div>

        {/* Environment Badge: Explicitly labeled SIMULATED / DEMO */}
        <Tooltip content="Running on realistic synthetic telemetry for hackathon evaluation">
          <Badge
            variant="warning"
            size="sm"
            className="hidden sm:inline-flex select-none font-mono text-[10px] uppercase font-bold tracking-wider"
          >
            SIMULATED DEMO
          </Badge>
        </Tooltip>

        {/* Notifications Dropdown */}
        <DropdownMenu
          width="w-80 sm:w-96"
          align="right"
          trigger={
            <div
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors select-none"
              title="Recent Operational Alerts"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              )}
            </div>
          }
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">System Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="warning" size="sm" className="text-[10px] py-0 px-1.5">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold"
              >
                Mark read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {events.map((evt) => (
              <div key={evt.id} className="p-3 hover:bg-slate-50/80 transition-colors space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">{evt.title}</span>
                  <Badge
                    variant={evt.severity === "warning" ? "warning" : "info"}
                    size="sm"
                    className="capitalize text-[9px] py-0 px-1"
                  >
                    {evt.severity}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{evt.details}</p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {new Date(evt.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            ))}
          </div>

          <DropdownDivider />
          <div className="p-1">
            <Link
              href="/dashboard/history"
              className="w-full flex items-center justify-center p-2 text-xs font-medium text-emerald-800 hover:text-emerald-950 hover:bg-slate-50 rounded-lg transition-colors"
            >
              View Full Audit Log
            </Link>
          </div>
        </DropdownMenu>

        {/* User / Profile Menu */}
        <DropdownMenu
          width="w-64"
          align="right"
          trigger={
            <div className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-100/80 rounded-lg transition-colors select-none">
              <div className="h-8 w-8 rounded-full bg-brand-950 text-emerald-400 flex items-center justify-center font-bold text-xs shadow-sm ring-1 ring-brand-800">
                TA
              </div>
              <div className="hidden lg:block text-left pr-1">
                <p className="text-xs font-semibold text-slate-900 leading-tight">
                  Engr. T. Adeyemi
                </p>
                <p className="text-[10px] text-slate-500 leading-none">
                  Facility Lead
                </p>
              </div>
            </div>
          }
        >
          <div className="p-3 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-900">Engr. Tunde Adeyemi</p>
            <p className="text-[11px] text-slate-500">operator@krystalice.ng</p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Badge variant="healthy" size="sm" className="text-[9px] py-0 px-1 font-mono">
                FACILITY MANAGER
              </Badge>
              <span className="text-[10px] text-slate-400 font-mono">Demo Session</span>
            </div>
          </div>

          <div className="p-1">
            <Link href="/dashboard/settings">
              <DropdownItem icon={<Settings className="h-4 w-4" />}>
                Facility Configuration
              </DropdownItem>
            </Link>
            <Link href="/dashboard/history">
              <DropdownItem icon={<ShieldCheck className="h-4 w-4" />}>
                Operator Approvals
              </DropdownItem>
            </Link>
          </div>

          <DropdownDivider />

          <div className="p-1">
            <Link href="/login">
              <DropdownItem danger icon={<LogOut className="h-4 w-4" />}>
                Sign Out
              </DropdownItem>
            </Link>
          </div>
        </DropdownMenu>
      </div>
    </header>
  );
}
