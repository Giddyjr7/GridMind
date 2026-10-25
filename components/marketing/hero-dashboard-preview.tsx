"use client";

import * as React from "react";
import {
  Zap,
  Sun,
  BatteryCharging,
  Cpu,
  Clock,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroDashboardPreview() {
  return (
    <div className="relative rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]">
      {/* Top Console Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-slate-800">
            Krystal Ice Cold Storage, Ikeja Industrial
          </span>
          <Badge variant="outline" size="sm" className="text-[10px] bg-white font-bold text-slate-900 border-slate-300">
            SIMULATED BENCHMARK
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="healthy" size="sm" className="font-mono text-[10px]">
            GRID STABLE (Band A)
          </Badge>
        </div>
      </div>

      {/* Main Operational Metrics Grid */}
      <div className="p-5 space-y-4">
        {/* Source Flow Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {/* Grid Source */}
          <div className="p-3 rounded-xl border border-slate-200/70 bg-slate-50/60 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-medium text-[11px]">Grid Feeder</span>
              <Zap className="h-3.5 w-3.5 text-brand-700" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-slate-900 tracking-tight">42.5</span>
              <span className="text-[11px] font-medium text-slate-500 ml-1">kW</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium mt-1">₦206/kWh</span>
          </div>

          {/* Solar Source */}
          <div className="p-3 rounded-xl border border-slate-200/70 bg-slate-50/60 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-medium text-[11px]">Solar PV</span>
              <Sun className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-slate-900 tracking-tight">38.4</span>
              <span className="text-[11px] font-medium text-slate-500 ml-1">kW</span>
            </div>
            <span className="text-[10px] text-amber-700 font-medium mt-1">685 W/m² peak</span>
          </div>

          {/* Battery ESS */}
          <div className="p-3 rounded-xl border border-slate-200/70 bg-slate-50/60 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-medium text-[11px]">Battery Bank</span>
              <BatteryCharging className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-slate-900 tracking-tight">68%</span>
              <span className="text-[11px] font-medium text-slate-500 ml-1">SOC</span>
            </div>
            <span className="text-[10px] text-slate-600 font-medium mt-1">81.6 kWh stored</span>
          </div>

          {/* Backup Generator */}
          <div className="p-3 rounded-xl border border-slate-200/70 bg-slate-50/60 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-medium text-[11px]">Diesel Gen</span>
              <Cpu className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-slate-500 tracking-tight">0.0</span>
              <span className="text-[11px] font-medium text-slate-400 ml-1">kW</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium mt-1">Standby · 480L fuel</span>
          </div>
        </div>

        {/* Continuity Runtime & Critical Load Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Estimated Runtime Banner */}
          <div className="rounded-xl border border-brand-200 bg-brand-50/80 p-3.5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-brand-950">
                <Clock className="h-4 w-4 text-brand-800" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Backup Runtime Est.
                </span>
              </div>
              <p className="text-2xl font-bold text-brand-950 mt-1 tracking-tight">
                5h 20m
              </p>
              <p className="text-[11px] text-brand-800">
                Guaranteed coverage for Freezers Room A & B
              </p>
            </div>
            <div className="text-right">
              <Badge variant="healthy" size="sm">
                Safe Buffer
              </Badge>
              <p className="text-[10px] text-slate-500 mt-1">Curtailed non-essentials</p>
            </div>
          </div>

          {/* Critical Equipment Hierarchy */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-3 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 text-[11px]">
              <span className="font-semibold text-slate-700">Appliance Priority Dispatch</span>
              <span className="text-slate-400">Total: 80.9 kW</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="font-medium text-slate-800 text-[11px]">Blast Freezer A (-21.4°C)</span>
                </div>
                <span className="font-semibold text-slate-700 text-[11px]">29.8 kW</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="font-medium text-slate-800 text-[11px]">Cold Storage B (-4.2°C)</span>
                </div>
                <span className="font-semibold text-slate-700 text-[11px]">21.5 kW</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="font-medium text-slate-800 text-[11px]">Warehouse LED High-Bay</span>
                </div>
                <span className="font-semibold text-slate-700 text-[11px]">4.6 kW</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  <span className="line-through text-[11px]">Packaging HVAC 1 & 2</span>
                </div>
                <span className="text-[10px] font-bold text-amber-950 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded">
                  Curtailed (Saved ₦14,200/h)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live AI Recommendation Card */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-emerald-600 text-white">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-bold text-emerald-950">
                AI Optimization Recommendation
              </span>
            </div>
            <Badge variant="healthy" size="sm" className="text-[10px]">
              94% Confidence
            </Badge>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            <strong className="text-slate-900">Pre-Cool Blast Freezer during Peak Solar Window:</strong> Solar PV is producing 38.4 kW.
            Overcooling Freezer A now builds a thermal buffer before the 4:00 PM grid outage window.
          </p>

          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="text-emerald-800 font-semibold">
              Estimated Avoided Diesel: ₦18,500
            </span>
            <span className="text-slate-500 text-[10px]">
              Expires in 42 mins
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
