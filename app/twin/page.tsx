"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  Zap,
  Sun,
  Battery,
  Fuel,
  Sliders,
  Radio,
  Send,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  ArrowLeft,
  Power,
} from "lucide-react";
import { GridMindLogo } from "@/components/brand/gridmind-logo";
import { getTwinTransport, topicFor } from "@/lib/twin/transport";
import { TelemetryPayload } from "@/lib/twin/schema";
import { BackendIngestBridge, type BackendLinkStatus } from "@/lib/twin/backend-ingest";

interface TwinLoadItem {
  id: string;
  name: string;
  priority: "critical" | "important" | "deferrable";
  state: "running" | "curtailed" | "off" | "standby";
  currentPowerKw: number;
}

export default function TwinConsolePage() {
  const [sessionCode, setSessionCode] = React.useState("GM-DEMO");
  const [copied, setCopied] = React.useState(false);
  const [connectionStatus, setConnectionStatus] = React.useState<
    "simulated" | "digital_twin_connected" | "digital_twin_offline"
  >("digital_twin_connected");

  // Twin Edge State
  const [gridAvailable, setGridAvailable] = React.useState(true);
  const [solarKw, setSolarKw] = React.useState(42.5);
  const [batterySoc, setBatterySoc] = React.useState(72);
  const [genMode, setGenMode] = React.useState<"standby" | "running" | "disabled" | "out_of_fuel">("standby");
  const [genFuel, setGenFuel] = React.useState(480);
  const [autoPublish, setAutoPublish] = React.useState(true);
  const [lastPublished, setLastPublished] = React.useState<TelemetryPayload | null>(null);
  const [publishFeedback, setPublishFeedback] = React.useState(false);
  const [backendLink, setBackendLink] = React.useState<BackendLinkStatus>("idle");
  const bridge = React.useRef(new BackendIngestBridge());

  // Monitored Loads
  const [loads, setLoads] = React.useState<TwinLoadItem[]>([
    { id: "dev_cold_chain_a", name: "Blast Freezer Alpha", priority: "critical", state: "running", currentPowerKw: 38.5 },
    { id: "dev_cold_room_b", name: "Cold Room Storage Bay 2", priority: "critical", state: "running", currentPowerKw: 26.8 },
    { id: "dev_ice_maker", name: "Industrial Flake Ice Maker", priority: "important", state: "running", currentPowerKw: 18.2 },
    { id: "dev_hvac_office", name: "Admin Block HVAC Chiller", priority: "deferrable", state: "running", currentPowerKw: 11.5 },
  ]);

  // Initialize transport and load session
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const querySession = urlParams.get("session");
      const stored = localStorage.getItem("gridmind_twin_session");
      const activeCode = querySession || stored || "GM-DEMO";
      setSessionCode(activeCode);
      localStorage.setItem("gridmind_twin_session", activeCode);

      const transport = getTwinTransport();
      transport.connect(activeCode);

      const unsub = transport.onStatusChange((status) => {
        setConnectionStatus(status);
      });

      return () => {
        unsub();
      };
    }
  }, []);

  const buildPayload = React.useCallback((): TelemetryPayload => {
    return {
      version: "1.0",
      sessionCode,
      timestamp: new Date().toISOString(),
      grid: {
        isAvailable: gridAvailable,
        tariffPerKwh: 206,
        voltageV: gridAvailable ? 408.2 : 0,
        frequencyHz: gridAvailable ? 49.85 : 0,
      },
      solar: {
        currentOutputKw: solarKw,
        isEnabled: solarKw > 0,
      },
      battery: {
        stateOfChargePct: batterySoc,
        totalCapacityKwh: 120,
        reserveFloorPct: 15,
      },
      generator: {
        fuelCurrentLiters: genFuel,
        mode: genMode,
      },
      loads,
    };
  }, [sessionCode, gridAvailable, solarKw, batterySoc, genFuel, genMode, loads]);

  const publishNow = React.useCallback(
    (force = false) => {
      const transport = getTwinTransport();
      const payload = buildPayload();
      transport.publish(sessionCode, payload);
      setLastPublished(payload);
      setPublishFeedback(true);
      setTimeout(() => setPublishFeedback(false), 800);

      // The broadcast above only reaches browser tabs. This is what drives the
      // backend outage-risk model and the operator notifications.
      void bridge.current.forward(payload, force).then((result) => {
        if (!result) return;
        setBackendLink(result);
        if (result === "linked" && !payload.grid.isAvailable) {
          void bridge.current.requestNotificationScan();
        }
      });
    },
    [buildPayload, sessionCode]
  );

  // Auto-publish pulse every 3 seconds if enabled
  React.useEffect(() => {
    if (!autoPublish) return;
    publishNow();
    const timer = setInterval(() => {
      publishNow();
    }, 3000);
    return () => clearInterval(timer);
  }, [autoPublish, publishNow]);

  const toggleLoad = (id: string) => {
    setLoads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, state: l.state === "running" ? "curtailed" : "running" } : l))
    );
  };

  const copySessionLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/dashboard?session=${sessionCode}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateNewSession = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "GM-";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSessionCode(code);
    if (typeof window !== "undefined") {
      localStorage.setItem("gridmind_twin_session", code);
    }
  };

  return (
    <div className="min-h-screen bg-[#070c0a] text-slate-100 flex flex-col relative selection:bg-emerald-500/20 selection:text-emerald-300 select-none">
      {/* Background radial glow */}
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(16,185,129,0.08),transparent_70%)]"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="h-16 border-b border-white/[0.08] bg-[#0c1410]/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <GridMindLogo markClassName="h-7 w-7" />
          <div className="hidden sm:block">
            <span className="text-xs font-semibold text-white">Digital Twin Edge Console</span>
            <span className="text-[10px] text-slate-400 block font-mono">MQTT Telemetry Publisher</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Transport status: reports the real transport, not a fixed label */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs">
            <span className="relative flex h-2 w-2">
              {connectionStatus === "digital_twin_connected" && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  connectionStatus === "digital_twin_connected"
                    ? "bg-emerald-500"
                    : connectionStatus === "simulated"
                    ? "bg-amber-400"
                    : "bg-rose-500"
                }`}
              />
            </span>
            <span className="text-[11px] text-slate-300 font-medium font-mono">
              {connectionStatus === "digital_twin_connected"
                ? "Broker Connected"
                : connectionStatus === "simulated"
                ? "Local Channel Only"
                : "Transport Offline"}
            </span>
          </div>

          {/* API link: whether pulses are reaching the backend risk model */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs">
            <span
              className={`inline-flex rounded-full h-2 w-2 ${
                backendLink === "linked"
                  ? "bg-emerald-500"
                  : backendLink === "unreachable"
                  ? "bg-rose-500"
                  : "bg-slate-500"
              }`}
            />
            <span className="text-[11px] text-slate-300 font-medium font-mono">
              {backendLink === "linked"
                ? "API Linked"
                : backendLink === "unreachable"
                ? "API Unreachable"
                : "API Pending"}
            </span>
          </div>

          <Link
            href="/dashboard"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-200 border border-white/[0.08] transition-colors"
          >
            <span>Open Dashboard</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Console Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-5 relative z-10">
        {/* Session Code Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
          <div className="flex items-center gap-3">
            <Radio className="h-4 w-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Edge Channel Session Code
              </span>
              <span className="text-base font-bold font-mono text-white tracking-wider">
                {sessionCode}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copySessionLink}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 border border-white/[0.08] transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Link Copied" : "Copy Dashboard Link"}</span>
            </button>
            <button
              type="button"
              onClick={generateNewSession}
              className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
              title="Generate New Session Code"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 2-Column Controls & Packet Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Physical Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Grid Outage Switch */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Grid Feeder (11kV)</p>
                  <p className="text-[11px] text-slate-400">Toggle live utility outage event</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGridAvailable(!gridAvailable)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                  gridAvailable
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                }`}
              >
                {gridAvailable ? "Online (408V)" : "Outage Triggered"}
              </button>
            </div>

            {/* Solar Irradiance Slider */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sun className="h-5 w-5 text-amber-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">Solar Generation</p>
                    <p className="text-[11px] text-slate-400">Canopy PV inverter output</p>
                  </div>
                </div>
                <span className="text-sm font-mono font-bold text-amber-400">
                  {solarKw} kW
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="75"
                step="0.5"
                value={solarKw}
                onChange={(e) => setSolarKw(Number(e.target.value))}
                className="w-full accent-amber-500 bg-white/[0.08] h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Battery SoC Slider */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Battery className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">Battery State of Charge</p>
                    <p className="text-[11px] text-slate-400">LiFePO4 ESS battery capacity</p>
                  </div>
                </div>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {batterySoc}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={batterySoc}
                onChange={(e) => setBatterySoc(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-white/[0.08] h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Diesel Generator Mode */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Fuel className="h-5 w-5 text-orange-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">Diesel Generator Mode</p>
                    <p className="text-[11px] text-slate-400">160kVA prime backup controller</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">{genFuel}L Fuel</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["standby", "running", "disabled", "out_of_fuel"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setGenMode(m)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-medium capitalize border transition-colors ${
                      genMode === m
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-black/30 border-white/[0.06] text-slate-400 hover:text-white"
                    }`}
                  >
                    {m.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Monitored Loads Toggles */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Physical Load Switches
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {loads.reduce((acc, l) => acc + (l.state === "running" ? l.currentPowerKw : 0), 0).toFixed(1)} kW active
                </span>
              </div>
              <div className="space-y-2">
                {loads.map((l) => (
                  <div
                    key={l.id}
                    className="p-2.5 rounded-xl bg-black/40 border border-white/[0.04] flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-medium text-white">{l.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {l.currentPowerKw} kW · {l.priority}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleLoad(l.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase border transition-colors ${
                        l.state === "running"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-white/[0.04] text-slate-400 border-white/[0.08]"
                      }`}
                    >
                      {l.state}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pulse Actions & Packet Inspector (5 cols) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
            {/* Publisher Actions */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Auto Broadcast</span>
                <button
                  type="button"
                  onClick={() => setAutoPublish(!autoPublish)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase ${
                    autoPublish
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-white/[0.04] text-slate-400 border-white/[0.08]"
                  }`}
                >
                  {autoPublish ? "3s Pulse Active" : "Paused"}
                </button>
              </div>

              <button
                type="button"
                onClick={() => publishNow(true)}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                  publishFeedback
                    ? "bg-emerald-400 text-slate-950 scale-[0.98]"
                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                }`}
              >
                <Send className="h-3.5 w-3.5" />
                <span>{publishFeedback ? "Telemetry Sent!" : "Publish Single Telemetry Pulse"}</span>
              </button>
            </div>

            {/* Packet Inspector */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Live MQTT Payload Inspector
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  Topic: {topicFor(sessionCode)}
                </span>
              </div>
              <pre className="p-3 rounded-xl bg-black/60 border border-white/[0.04] text-[10px] font-mono text-emerald-300 overflow-x-auto max-h-72 leading-relaxed">
                {lastPublished ? JSON.stringify(lastPublished, null, 2) : "// Waiting for initial pulse..."}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
