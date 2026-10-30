"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Sliders,
  Zap,
  Sun,
  Battery,
  Fuel,
  Plus,
  Power,
  Shield,
  AlertCircle,
  Clock,
  Layers,
} from "lucide-react";
import { useScenario } from "@/context/scenario-context";
import { useWorkspace } from "@/context/workspace-context";
import { AddDeviceModal } from "@/components/workspace/add-device-modal";
import { ConnectedDevice } from "@/types/energy";

export default function DevicesPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-slate-400">Loading devices...</div>}>
      <DevicesContent />
    </React.Suspense>
  );
}

function DevicesContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "sources" ? "sources" : "loads";
  const [tab, setTab] = React.useState<"loads" | "sources">(initialTab);

  const { inputs, outputs, toggleLoadState } = useScenario();
  const { addDevice } = useWorkspace();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const handleDeviceAdded = (newDevice: ConnectedDevice) => {
    setIsAddModalOpen(false);
  };

  const criticalLoads = inputs.loads.filter((l) => l.priority === "critical");
  const importantLoads = inputs.loads.filter((l) => l.priority === "important");
  const deferrableLoads = inputs.loads.filter((l) => l.priority === "deferrable");

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Connected Devices & Sources
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor prioritized equipment loads and operational microgrid supply assets
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tab === "loads" && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Device</span>
            </button>
          )}

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 bg-black/40 border border-white/[0.08] p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setTab("loads")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                tab === "loads"
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sliders className="h-3.5 w-3.5 text-emerald-400" />
              <span>Facility Loads ({inputs.loads.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("sources")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                tab === "sources"
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-blue-400" />
              <span>Power Sources (4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Facility Loads */}
      {tab === "loads" && (
        <div className="space-y-6">
          {/* Priority Group: Critical Loads */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Critical Priority ({criticalLoads.length})
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                {outputs.criticalLoadKw} kW active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {criticalLoads.map((load) => (
                <div
                  key={load.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {load.name}
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {load.state === "running" ? `${load.currentPowerKw} kW active` : "Curtailed"}{" "}
                      (Rated {load.ratedPowerKw} kW)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                        load.state === "running"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-white/[0.04] text-slate-400 border border-white/[0.08]"
                      }`}
                    >
                      {load.state}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleLoadState(load.id)}
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs transition-colors border border-white/[0.06]"
                      title={load.state === "running" ? "Curtail Load" : "Restore Load"}
                    >
                      <Power className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Group: Important Loads */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Important Priority ({importantLoads.length})
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                {outputs.importantLoadKw} kW active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {importantLoads.map((load) => (
                <div
                  key={load.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {load.name}
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {load.state === "running" ? `${load.currentPowerKw} kW active` : "Curtailed"}{" "}
                      (Rated {load.ratedPowerKw} kW)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                        load.state === "running"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-white/[0.04] text-slate-400 border border-white/[0.08]"
                      }`}
                    >
                      {load.state}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleLoadState(load.id)}
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs transition-colors border border-white/[0.06]"
                      title={load.state === "running" ? "Curtail Load" : "Restore Load"}
                    >
                      <Power className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Group: Deferrable Loads */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Deferrable Priority ({deferrableLoads.length})
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                {outputs.deferrableLoadKw} kW active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {deferrableLoads.map((load) => (
                <div
                  key={load.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {load.name}
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {load.state === "running" ? `${load.currentPowerKw} kW active` : "Curtailed"}{" "}
                      (Rated {load.ratedPowerKw} kW)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                        load.state === "running"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-white/[0.04] text-slate-400 border border-white/[0.08]"
                      }`}
                    >
                      {load.state}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleLoadState(load.id)}
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs transition-colors border border-white/[0.06]"
                      title={load.state === "running" ? "Curtail Load" : "Restore Load"}
                    >
                      <Power className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Power Sources */}
      {tab === "sources" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: National Grid */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    National Grid Feeder
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Ikeja Electric 11kV Industrial Dedicated Feeder
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase border ${
                  inputs.grid.isAvailable
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {inputs.grid.isAvailable ? "Online" : "Outage"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04]">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-[10px] text-slate-400 block">Dispatch</span>
                <span className="text-sm font-mono font-semibold text-white">
                  {outputs.dispatch.gridKw} kW
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-[10px] text-slate-400 block">Tariff Band</span>
                <span className="text-sm font-mono font-semibold text-white">
                  ₦{inputs.grid.tariffPerKwh}/kWh
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-[10px] text-slate-400 block">Voltage</span>
                <span className="text-sm font-mono font-semibold text-white">
                  {inputs.grid.isAvailable ? "408V" : "0V"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Rooftop Solar */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sun className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Rooftop Solar PV Array
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Monocrystalline Commercial Depot Canopy (75 kWp)
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase border ${
                  inputs.solar.isEnabled
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-white/[0.04] text-slate-400 border-white/[0.08]"
                }`}
              >
                {inputs.solar.isEnabled ? "Generating" : "Offline"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04]">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-[10px] text-slate-400 block">Output</span>
                <span className="text-sm font-mono font-semibold text-amber-400">
                  {inputs.solar.currentOutputKw} kW
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-[10px] text-slate-400 block">Capacity</span>
                <span className="text-sm font-mono font-semibold text-white">
                  {inputs.solar.installedCapacityKwp} kWp
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-[10px] text-slate-400 block">Daily Est.</span>
                <span className="text-sm font-mono font-semibold text-white">
                  284 kWh
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: LiFePO4 ESS */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Battery className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    LiFePO4 ESS Bank
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Industrial Energy Storage System (120 kWh Total)
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                {outputs.dispatch.batteryMode}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04]">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-[10px] text-slate-400 block">Usable Energy</span>
                <span className="text-sm font-mono font-semibold text-emerald-400">
                  {outputs.usableBatteryKwh} kWh
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-[10px] text-slate-400 block">State of Charge</span>
                <span className="text-sm font-mono font-semibold text-white">
                  {inputs.battery.stateOfChargePct}%
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-[10px] text-slate-400 block">Safety Floor</span>
                <span className="text-sm font-mono font-semibold text-amber-400">
                  {inputs.battery.reserveFloorPct}%
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Prime Diesel Generator */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Fuel className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Cummins Prime Generator
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    160 kVA Prime Diesel Backup Unit
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase border bg-white/[0.04] text-slate-300 border-white/[0.08]">
                {inputs.generator.mode}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04]">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-[10px] text-slate-400 block">Fuel Level</span>
                <span className="text-sm font-mono font-semibold text-white">
                  {inputs.generator.fuelCurrentLiters}L
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-[10px] text-slate-400 block">Burn Rate</span>
                <span className="text-sm font-mono font-semibold text-white">
                  {outputs.costs.dieselFuelBurnRateLph} L/h
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-[10px] text-slate-400 block">Fuel Cost</span>
                <span className="text-sm font-mono font-semibold text-white">
                  ₦{inputs.generator.fuelCostPerLiter}/L
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Device Modal */}
      {isAddModalOpen && (
        <AddDeviceModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={(d) => {
            const added = addDevice(d);
            handleDeviceAdded(added);
          }}
        />
      )}
    </div>
  );
}
