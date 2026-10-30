"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  SlidersHorizontal,
  LogOut,
  ArrowRight,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { GridMindLogo } from "@/components/brand/gridmind-logo";
import { WelcomeModal } from "@/components/workspace/welcome-modal";
import { AddDeviceModal } from "@/components/workspace/add-device-modal";
import { DeviceDetailSheet } from "@/components/workspace/device-detail-sheet";
import { useWorkspace } from "@/context/workspace-context";
import { DEVICE_CATALOGUE } from "@/lib/device-catalogue";
import { ConnectedDevice } from "@/types/energy";
import { cn } from "@/lib/utils";

export function WorkspaceClient() {
  const router = useRouter();
  const {
    profile,
    workspace,
    devices,
    welcomeDismissed,
    isHydrated,
    dismissWelcome,
    addDevice,
    updateDevice,
    removeDevice,
    signOut,
  } = useWorkspace();

  // Search filter
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modals / Sheets
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [selectedDevice, setSelectedDevice] = React.useState<ConnectedDevice | null>(null);

  // Route guard: if signed-in user has no workspace, route to signup business step
  React.useEffect(() => {
    if (isHydrated && !workspace) {
      router.push("/signup?step=business");
    }
  }, [isHydrated, workspace, router]);

  // Formatted date for the user's locale
  const [formattedDate, setFormattedDate] = React.useState("");
  React.useEffect(() => {
    try {
      const now = new Date();
      setFormattedDate(
        new Intl.DateTimeFormat(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        }).format(now)
      );
    } catch {
      setFormattedDate(new Date().toDateString());
    }
  }, []);

  // Filtered devices
  const filteredDevices = React.useMemo(() => {
    if (!searchQuery.trim()) return devices;
    const q = searchQuery.toLowerCase().trim();
    return devices.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.priority.toLowerCase().includes(q)
    );
  }, [devices, searchQuery]);

  // Workspace avatar letter
  const workspaceLetter = (workspace?.name || "G").charAt(0).toUpperCase();

  const handleSignOut = () => {
    signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#070c0a] text-slate-100 flex flex-col relative selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(16,185,129,0.08),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0e1f18_1px,transparent_1px),linear-gradient(to_bottom,#0e1f18_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_20%,transparent_100%)] opacity-30"
        aria-hidden="true"
      />

      {/* Top Bar */}
      <header className="relative z-20 w-full border-b border-white/[0.06] bg-[#070c0a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Workspace chip */}
          <div className="flex items-center gap-3">
            <Link href="/workspace" className="flex items-center gap-2 group">
              <GridMindLogo inverse markClassName="h-8 w-8" />
            </Link>

            <span className="text-white/10 select-none hidden sm:inline">•</span>

            {/* Workspace Chip */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs">
              <span className="h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center">
                {workspaceLetter}
              </span>
              <span className="text-slate-300 font-medium truncate max-w-[150px] sm:max-w-[200px]">
                {workspace?.name || "Krystal Ice Cold Storage"}
              </span>
            </div>
          </div>

          {/* Right actions: Add device button & Sign out */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-xs transition-colors shadow-[0_1px_15px_rgba(16,185,129,0.25)]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add device</span>
            </button>

            {/* Sign out */}
            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Sign out"
              title="Sign out of GridMind"
              className="h-9 px-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-8">
        {/* Centre Greeting & Date */}
        <div className="text-center space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
            Hi 👋, {profile?.displayName || "Facility Engineer"}
          </h1>
          {formattedDate && (
            <p className="text-xs sm:text-sm text-slate-400 capitalize">
              {formattedDate}
            </p>
          )}
        </div>

        {/* Thin divider with monospace label */}
        <div className="relative flex items-center justify-center py-2">
          <div className="border-t border-white/[0.08] w-full" />
          <span className="bg-[#070c0a] px-4 text-xs font-mono uppercase tracking-widest text-slate-400 whitespace-nowrap">
            Connected devices
          </span>
          <div className="border-t border-white/[0.08] w-full" />
        </div>

        {/* Search & Manage devices row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-white/10 bg-[#0c1410] pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>
              Showing {filteredDevices.length} of {devices.length} devices
            </span>
          </div>
        </div>

        {/* Centred Device Tiles Grid */}
        {filteredDevices.length === 0 ? (
          // Empty State
          <div className="rounded-[20px] border border-white/[0.08] bg-[#0c1410]/70 p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-400">
              <Zap className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-medium text-white">
                {searchQuery ? "No devices match your search" : "No devices connected yet"}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery
                  ? "Try searching with a different equipment name or category."
                  : "Connect your refrigeration, energy sources, or comfort cooling equipment to monitor load continuity."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add your first device</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
            {filteredDevices.map((device) => {
              const catalogueItem = DEVICE_CATALOGUE.find(
                (c) => c.typeId === device.deviceTypeId
              );
              const Icon = catalogueItem?.icon || Zap;

              return (
                <button
                  key={device.id}
                  type="button"
                  onClick={() => setSelectedDevice(device)}
                  className="group relative p-4 rounded-2xl border border-white/[0.08] bg-[#0c1410] hover:bg-[#0f1b14] hover:border-emerald-500/40 text-left transition-all duration-200 flex flex-col justify-between min-h-[140px] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  {/* Top squircle icon & priority badge */}
                  <div className="flex items-start justify-between w-full">
                    <span
                      className={cn(
                        "h-11 w-11 rounded-2xl flex items-center justify-center border transition-all duration-200 group-hover:scale-105",
                        catalogueItem?.accentColor || "bg-emerald-500/15",
                        catalogueItem?.accentBorder || "border-emerald-500/30",
                        catalogueItem?.iconColor || "text-emerald-400"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-slate-400 group-hover:text-slate-300">
                      {device.ratedPowerKw} kW
                    </span>
                  </div>

                  {/* Device Name and Status */}
                  <div className="space-y-1.5 pt-3">
                    <h3 className="text-xs sm:text-sm font-medium text-white line-clamp-1 leading-snug group-hover:text-emerald-300 transition-colors">
                      {device.name}
                    </h3>

                    {/* Status dot + Simulated text */}
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-[11px] text-slate-400 font-medium">
                        Simulated
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* "Add device" final tile */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="p-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.01] hover:bg-white/[0.03] hover:border-emerald-500/40 text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[140px] space-y-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                <Plus className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                Add device
              </span>
            </button>
          </div>
        )}

        {/* Clear Primary Call to Action: Open Energy Dashboard */}
        <div className="pt-6 pb-12 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-sm transition-all duration-150 shadow-[0_1px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_1px_30px_rgba(16,185,129,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <span>Open energy dashboard</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </Link>
          <p className="text-[11px] text-slate-500 mt-2">
            View real-time telemetry orchestration, outage simulations, and algorithmic recommendations.
          </p>
        </div>
      </main>

      {/* First-visit Welcome Modal */}
      <WelcomeModal
        isOpen={isHydrated && !welcomeDismissed}
        onClose={dismissWelcome}
      />

      {/* Add Device Modal */}
      <AddDeviceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addDevice}
      />

      {/* Device Detail & Edit Sheet */}
      <DeviceDetailSheet
        device={selectedDevice}
        isOpen={Boolean(selectedDevice)}
        onClose={() => setSelectedDevice(null)}
        onUpdate={updateDevice}
        onRemove={removeDevice}
      />
    </div>
  );
}
