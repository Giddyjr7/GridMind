"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  Settings,
  LogOut,
  Layers,
  ArrowLeft,
  X,
  ExternalLink,
  Activity,
} from "lucide-react";
import { useScenario } from "@/context/scenario-context";
import { useWorkspace } from "@/context/workspace-context";

interface HeaderProps {
  onOpenMobileSidebar?: () => void;
}

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Overview",
    subtitle: "Real-time energy continuity and asset telemetry",
  },
  "/dashboard/simulator": {
    title: "Scenarios",
    subtitle: "What-if outage stress-testing and load shedding",
  },
  "/dashboard/decisions": {
    title: "Decisions & History",
    subtitle: "Operator actions, dispatch guidance, and verified audit log",
  },
  "/dashboard/devices": {
    title: "Devices & Sources",
    subtitle: "Active power sources and prioritized facility loads",
  },
  "/dashboard/analytics": {
    title: "Analytics",
    subtitle: "Continuous tariff efficiency, fuel avoidance, and cost modeling",
  },
  "/dashboard/settings": {
    title: "Settings",
    subtitle: "Tariff rules, baseline assumptions, and telemetry endpoints",
  },
};

export function Header({ onOpenMobileSidebar }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { outputs, transportStatus, auditTrail } = useScenario();
  const { profile, signOut } = useWorkspace();

  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const routeInfo = routeTitles[pathname] || {
    title: "Operations Console",
    subtitle: "Commercial energy continuity management",
  };

  const isGridAvailable = outputs.dispatch.gridKw > 0 || (outputs.riskLevel !== "critical" && outputs.backupRuntimeHours === null);
  const userInitials = profile?.firstName && profile?.lastName
    ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
    : "OP";

  const handleSignOut = () => {
    signOut();
    router.push("/login");
  };

  return (
    <>
      <header className="h-16 border-b border-white/[0.08] bg-[#070c0a]/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 select-none">
        {/* Left: Mobile Sidebar Toggle & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          {onOpenMobileSidebar && (
            <button
              type="button"
              onClick={onOpenMobileSidebar}
              className="md:hidden p-2 -ml-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/[0.06] transition-colors"
              aria-label="Open navigation sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight leading-none truncate">
              {routeInfo.title}
            </h1>
            <p className="text-[11px] text-slate-400 mt-1 hidden sm:block truncate">
              {routeInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Data Transport Chip, Notifications & Profile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Data Source Chip */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs">
            <span className="relative flex h-2 w-2">
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  transportStatus === "digital_twin_connected"
                    ? "bg-emerald-400 animate-pulse"
                    : transportStatus === "digital_twin_offline"
                    ? "bg-amber-400"
                    : "bg-emerald-500"
                }`}
              />
            </span>
            <span className="text-[11px] text-slate-300 font-medium">
              {transportStatus === "digital_twin_connected"
                ? "Digital twin connected"
                : transportStatus === "digital_twin_offline"
                ? "Digital twin offline"
                : "Simulated"}
            </span>
          </div>

          {/* Grid Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px]">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                outputs.dispatch.gridKw > 0 || outputs.backupRuntimeHours === null
                  ? "bg-emerald-400"
                  : "bg-rose-400"
              }`}
            />
            <span className="text-slate-300 font-medium">
              {outputs.dispatch.gridKw > 0 || outputs.backupRuntimeHours === null
                ? "Grid Online"
                : "Grid Outage"}
            </span>
          </div>

          {/* Notifications Drawer Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded-lg transition-colors"
              aria-label="View recent operational alerts"
            >
              <Bell className="h-4 w-4" />
              {outputs.riskLevel !== "normal" && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
              )}
            </button>
          </div>

          {/* Profile Dropdown Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 hover:bg-white/[0.06] rounded-xl transition-colors border border-transparent hover:border-white/[0.08]"
            >
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-semibold text-xs">
                {userInitials}
              </div>
              <div className="hidden xl:block text-left pr-1">
                <p className="text-xs font-medium text-slate-200 truncate max-w-[120px]">
                  {profile?.displayName || "Operator"}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  Facility Lead
                </p>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0c1410] border border-white/[0.1] shadow-2xl py-1 z-40 text-xs animate-in fade-in-50 zoom-in-95">
                  <div className="px-3 py-2 border-b border-white/[0.08]">
                    <p className="font-medium text-white truncate">
                      {profile?.displayName || "Facility Operator"}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {profile?.email || "operator@gridmind.internal"}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      <Settings className="h-4 w-4 text-slate-400" />
                      <span>Settings</span>
                    </Link>

                    <Link
                      href="/workspace"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      <Layers className="h-4 w-4 text-slate-400" />
                      <span>Workspace Devices</span>
                    </Link>

                    <Link
                      href="/twin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      <Activity className="h-4 w-4 text-emerald-400" />
                      <span>Digital Twin Console</span>
                    </Link>

                    <Link
                      href="/"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4 text-slate-400" />
                      <span>Public Landing Page</span>
                    </Link>
                  </div>

                  <div className="border-t border-white/[0.08] pt-1">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Notifications Slide-over Drawer */}
      {notificationsOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setNotificationsOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-[#0c1410] border-l border-white/[0.1] shadow-2xl flex flex-col">
              {/* Header */}
              <div className="h-16 px-4 border-b border-white/[0.08] flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Operational Alerts
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Active conditions and recommendations
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/[0.06]"
                  aria-label="Close notifications"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Active Advisory Card */}
                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">
                      {outputs.recommendation.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Advisory
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {outputs.recommendation.reason}
                  </p>
                  <Link
                    href="/dashboard/decisions"
                    onClick={() => setNotificationsOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 pt-1 font-medium"
                  >
                    <span>Review in Decisions</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                {/* Audit Trail List */}
                <div className="pt-2">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Recent Operator Decisions
                  </p>
                  <div className="space-y-2">
                    {auditTrail.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg bg-black/40 border border-white/[0.05] space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-200 truncate">
                            {item.title}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded capitalize ${
                              item.actionTaken === "approved"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-rose-500/10 text-rose-400"
                            }`}
                          >
                            {item.actionTaken}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          by {item.actor}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-white/[0.08]">
                <Link
                  href="/dashboard/decisions"
                  onClick={() => setNotificationsOpen(false)}
                  className="w-full flex items-center justify-center p-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 rounded-lg hover:bg-emerald-500/10 transition-colors"
                >
                  View Full Audit Log
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
