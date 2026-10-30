"use client";

import * as React from "react";
import { Zap, Sun, BatteryCharging, Fuel, Building2 } from "lucide-react";
import { DispatchSummary } from "@/lib/calculation-engine";

interface EnergyFlowDiagramProps {
  dispatch: DispatchSummary;
  totalLoadKw: number;
}

export function EnergyFlowDiagram({ dispatch, totalLoadKw }: EnergyFlowDiagramProps) {
  const isBatteryDischarging = dispatch.batteryKw > 0;
  const isBatteryCharging = dispatch.batteryKw < 0;
  const batteryFlowAbs = Math.abs(dispatch.batteryKw);

  return (
    <div className="w-full rounded-2xl bg-white/[0.02] border border-white/[0.08] p-4 sm:p-5 relative overflow-hidden select-none">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Real-Time Energy Flow
          </h3>
          <p className="text-[11px] text-slate-500">
            Dynamic microgrid bus dispatch & source balance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-mono text-emerald-400 uppercase">
            Active Balancing
          </span>
        </div>
      </div>

      {/* SVG Animated Circuit Canvas */}
      <div className="relative py-2">
        <svg
          className="w-full h-32 sm:h-36 overflow-visible"
          viewBox="0 0 600 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="solarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="batteryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="genGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <style>
              {`
                @keyframes flowRight {
                  0% { stroke-dashoffset: 40; }
                  100% { stroke-dashoffset: 0; }
                }
                @keyframes flowLeft {
                  0% { stroke-dashoffset: 0; }
                  100% { stroke-dashoffset: 40; }
                }
                .flow-active-right {
                  animation: flowRight 1.4s linear infinite;
                }
                .flow-active-left {
                  animation: flowLeft 1.4s linear infinite;
                }
                .flow-fast {
                  animation-duration: 0.8s;
                }
                .flow-slow {
                  animation-duration: 2.2s;
                }
              `}
            </style>
          </defs>

          {/* Grid Flow Path (x: 50 -> 300) */}
          <path
            d="M 50 25 C 160 25, 220 60, 300 60"
            stroke={dispatch.gridKw > 0 ? "url(#gridGrad)" : "#1f2937"}
            strokeWidth={dispatch.gridKw > 0 ? Math.min(5, Math.max(2, dispatch.gridKw / 12)) : 1.5}
            strokeDasharray={dispatch.gridKw > 0 ? "6 6" : "none"}
            className={dispatch.gridKw > 0 ? "flow-active-right" : ""}
            strokeOpacity={dispatch.gridKw > 0 ? 0.9 : 0.3}
          />

          {/* Solar Flow Path (x: 50 -> 300) */}
          <path
            d="M 50 50 C 160 50, 220 60, 300 60"
            stroke={dispatch.solarKw > 0 ? "url(#solarGrad)" : "#1f2937"}
            strokeWidth={dispatch.solarKw > 0 ? Math.min(5, Math.max(2, dispatch.solarKw / 10)) : 1.5}
            strokeDasharray={dispatch.solarKw > 0 ? "6 6" : "none"}
            className={dispatch.solarKw > 0 ? "flow-active-right" : ""}
            strokeOpacity={dispatch.solarKw > 0 ? 0.9 : 0.3}
          />

          {/* Battery Flow Path (x: 50 -> 300) */}
          <path
            d="M 50 75 C 160 75, 220 60, 300 60"
            stroke={batteryFlowAbs > 0 ? "url(#batteryGrad)" : "#1f2937"}
            strokeWidth={batteryFlowAbs > 0 ? Math.min(5, Math.max(2, batteryFlowAbs / 10)) : 1.5}
            strokeDasharray={batteryFlowAbs > 0 ? "6 6" : "none"}
            className={isBatteryDischarging ? "flow-active-right" : isBatteryCharging ? "flow-active-left" : ""}
            strokeOpacity={batteryFlowAbs > 0 ? 0.9 : 0.3}
          />

          {/* Generator Flow Path (x: 50 -> 300) */}
          <path
            d="M 50 100 C 160 100, 220 60, 300 60"
            stroke={dispatch.generatorKw > 0 ? "url(#genGrad)" : "#1f2937"}
            strokeWidth={dispatch.generatorKw > 0 ? Math.min(5, Math.max(2, dispatch.generatorKw / 12)) : 1.5}
            strokeDasharray={dispatch.generatorKw > 0 ? "6 6" : "none"}
            className={dispatch.generatorKw > 0 ? "flow-active-right" : ""}
            strokeOpacity={dispatch.generatorKw > 0 ? 0.9 : 0.3}
          />

          {/* Main Bus to Site Load Path (x: 300 -> 550) */}
          <path
            d="M 300 60 L 550 60"
            stroke="#10b981"
            strokeWidth={totalLoadKw > 0 ? Math.min(6, Math.max(2.5, totalLoadKw / 15)) : 2}
            strokeDasharray={totalLoadKw > 0 ? "8 6" : "none"}
            className={totalLoadKw > 0 ? "flow-active-right" : ""}
            strokeOpacity={0.95}
          />

          {/* Central Bus Junction Node */}
          <circle cx="300" cy="60" r="7" fill="#10b981" className="shadow-lg" />
          <circle cx="300" cy="60" r="14" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.4" />
        </svg>

        {/* DOM Overlay Node Labels */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-between text-xs px-2">
          {/* Left Column: 4 Sources */}
          <div className="space-y-1 sm:space-y-1.5 -ml-1 text-left">
            {/* Grid */}
            <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-white/[0.08] px-2 py-1 rounded-md">
              <Zap className={`h-3 w-3 ${dispatch.gridKw > 0 ? "text-blue-400" : "text-slate-600"}`} />
              <span className="text-[11px] text-slate-300 font-mono">
                Grid: {dispatch.gridKw} kW
              </span>
            </div>

            {/* Solar */}
            <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-white/[0.08] px-2 py-1 rounded-md">
              <Sun className={`h-3 w-3 ${dispatch.solarKw > 0 ? "text-amber-400" : "text-slate-600"}`} />
              <span className="text-[11px] text-slate-300 font-mono">
                Solar: {dispatch.solarKw} kW
              </span>
            </div>

            {/* Battery */}
            <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-white/[0.08] px-2 py-1 rounded-md">
              <BatteryCharging
                className={`h-3 w-3 ${batteryFlowAbs > 0 ? "text-emerald-400" : "text-slate-600"}`}
              />
              <span className="text-[11px] text-slate-300 font-mono">
                ESS: {isBatteryDischarging ? `+${dispatch.batteryKw} kW` : isBatteryCharging ? `${dispatch.batteryKw} kW` : "0 kW"}
              </span>
            </div>

            {/* Generator */}
            <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-white/[0.08] px-2 py-1 rounded-md">
              <Fuel className={`h-3 w-3 ${dispatch.generatorKw > 0 ? "text-orange-400" : "text-slate-600"}`} />
              <span className="text-[11px] text-slate-300 font-mono">
                Gen: {dispatch.generatorKw} kW
              </span>
            </div>
          </div>

          {/* Central Bus Label */}
          <div className="bg-black/80 border border-emerald-500/30 px-2 py-1 rounded-md text-center transform -translate-x-1">
            <span className="text-[9px] font-mono text-emerald-300 block uppercase">
              Microgrid Bus
            </span>
            <span className="text-[11px] font-bold text-white font-mono">
              {totalLoadKw} kW
            </span>
          </div>

          {/* Right Column: Site Facility Load */}
          <div className="bg-black/70 backdrop-blur-sm border border-emerald-500/30 px-2.5 py-2 rounded-lg text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <Building2 className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[11px] font-semibold text-slate-200">Facility Load</span>
            </div>
            <p className="text-sm font-bold text-emerald-300 font-mono mt-0.5">
              {totalLoadKw} kW
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
