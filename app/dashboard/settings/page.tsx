"use client";

import * as React from "react";
import Link from "next/link";
import {
  Settings,
  Database,
  Sliders,
  RotateCcw,
  Check,
  Activity,
  ExternalLink,
  Shield,
} from "lucide-react";
import { useScenario } from "@/context/scenario-context";
import { useWorkspace } from "@/context/workspace-context";
import { DEFAULT_ENGINE_CONFIG } from "@/lib/calculation-engine";
import { NotificationControls } from "@/components/pwa/notification-controls";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { PowerSourceSettings } from "@/components/dashboard/power-source-settings";

export default function SettingsPage() {
  const {
    config,
    transportStatus,
    updateEngineConfig,
    resetToDemoDefaults,
  } = useScenario();
  const { workspace } = useWorkspace();

  const [tariff, setTariff] = React.useState(config.gridTariffNgnPerKwh.toString());
  const [dieselPrice, setDieselPrice] = React.useState(config.dieselPriceNgnPerLiter.toString());
  const [reserveFloor, setReserveFloor] = React.useState(config.batteryReserveFloorPct.toString());
  const [efficiency, setEfficiency] = React.useState((config.batteryRoundtripEfficiency * 100).toString());

  const [saveFeedback, setSaveFeedback] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateEngineConfig({
      gridTariffNgnPerKwh: Math.max(1, Number(tariff) || 206),
      dieselPriceNgnPerLiter: Math.max(1, Number(dieselPrice) || 1250),
      batteryReserveFloorPct: Math.min(50, Math.max(5, Number(reserveFloor) || 15)),
      batteryRoundtripEfficiency: Math.min(1, Math.max(0.5, (Number(efficiency) || 92) / 100)),
    });
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 3000);
  };

  const handleReset = () => {
    resetToDemoDefaults();
    setTariff(DEFAULT_ENGINE_CONFIG.gridTariffNgnPerKwh.toString());
    setDieselPrice(DEFAULT_ENGINE_CONFIG.dieselPriceNgnPerLiter.toString());
    setReserveFloor(DEFAULT_ENGINE_CONFIG.batteryReserveFloorPct.toString());
    setEfficiency((DEFAULT_ENGINE_CONFIG.batteryRoundtripEfficiency * 100).toString());
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
        <h2 className="text-base font-semibold text-white tracking-tight">
          System Settings & Calculation Parameters
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure baseline financial assumptions, telemetry transport, and site metadata
        </p>
      </div>

      <InstallPrompt />

      <NotificationControls />

      <PowerSourceSettings />

      {/* Section 1: Data Source & Telemetry */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-emerald-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Telemetry Transport & Source
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.04] space-y-1">
            <span className="text-[10px] text-slate-400 block">Current Transport Mode</span>
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  transportStatus === "digital_twin_connected"
                    ? "bg-emerald-400 animate-pulse"
                    : transportStatus === "digital_twin_offline"
                    ? "bg-amber-400"
                    : "bg-emerald-500"
                }`}
              />
              <span className="font-medium text-white capitalize">
                {transportStatus === "digital_twin_connected"
                  ? "Digital Twin Connected"
                  : transportStatus === "digital_twin_offline"
                  ? "Digital Twin Offline"
                  : "Simulated Telemetry"}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Deterministic calculations driven by local simulation engine or live MQTT broker.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.04] space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">Digital Twin Console</span>
              <p className="text-slate-300 text-xs">
                Launch the twin control console to publish live edge telemetry over WebSockets.
              </p>
            </div>
            <Link
              href="/twin"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium pt-1"
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Open Digital Twin Console</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Section 2: Financial & Physical Calculation Engine Parameters */}
      <form onSubmit={handleSave} className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Deterministic Engine Inputs
            </h3>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Demo Defaults</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Grid Tariff */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">
              Grid Tariff (₦/kWh)
            </label>
            <input
              type="number"
              value={tariff}
              onChange={(e) => setTariff(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white font-mono focus:outline-none focus:border-emerald-500/50"
            />
            <p className="text-[10px] text-slate-500">
              PHED Band A benchmark rate (default ₦206/kWh)
            </p>
          </div>

          {/* Diesel Fuel Price */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">
              Diesel Fuel Price (₦/Liter)
            </label>
            <input
              type="number"
              value={dieselPrice}
              onChange={(e) => setDieselPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white font-mono focus:outline-none focus:border-emerald-500/50"
            />
            <p className="text-[10px] text-slate-500">
              Bulk AGO depot procurement rate (default ₦1,250/L)
            </p>
          </div>

          {/* Battery Reserve Floor */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">
              Battery Reserve Floor (%)
            </label>
            <input
              type="number"
              min="5"
              max="50"
              value={reserveFloor}
              onChange={(e) => setReserveFloor(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white font-mono focus:outline-none focus:border-emerald-500/50"
            />
            <p className="text-[10px] text-slate-500">
              Minimum capacity reserved for cold-chain safety cutoff (default 15%)
            </p>
          </div>

          {/* Round-trip Efficiency */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">
              Round-trip Efficiency (%)
            </label>
            <input
              type="number"
              min="50"
              max="100"
              value={efficiency}
              onChange={(e) => setEfficiency(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white font-mono focus:outline-none focus:border-emerald-500/50"
            />
            <p className="text-[10px] text-slate-500">
              LiFePO4 battery and hybrid inverter combined efficiency (default 92%)
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Changes immediately update all dashboard metrics, charts, and recommendations.
          </p>
          <div className="flex items-center gap-2">
            {saveFeedback && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <Check className="h-3.5 w-3.5" />
                <span>Saved successfully</span>
              </span>
            )}
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors"
            >
              Save Parameters
            </button>
          </div>
        </div>
      </form>

      {/* Section 3: Facility Metadata */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Facility Metadata
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 block">Workspace Name</span>
            <span className="text-white font-medium">{workspace?.name || "Krystal Ice Cold Storage Ltd."}</span>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 block">Location</span>
            <span className="text-white font-medium">{workspace?.location || "Uyo Industrial Layout, Akwa Ibom"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
