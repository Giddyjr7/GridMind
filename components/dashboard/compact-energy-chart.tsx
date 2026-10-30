"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CompactEnergyChartProps {
  currentLoadKw: number;
  solarKw: number;
  gridKw: number;
}

export function CompactEnergyChart({
  currentLoadKw,
  solarKw,
  gridKw,
}: CompactEnergyChartProps) {
  const [range, setRange] = React.useState<"6h" | "12h">("6h");

  // Generate smooth historical curve based on current operational anchor
  const data = React.useMemo(() => {
    const pointsCount = range === "6h" ? 7 : 13;
    const result = [];
    const now = new Date();

    for (let i = pointsCount - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      // Realistic variation around current values
      const progressFactor = (pointsCount - i) / pointsCount;
      const loadVal = Math.max(15, currentLoadKw + Math.sin(progressFactor * Math.PI * 2) * 8);
      const solarVal = Math.max(0, solarKw + Math.cos(progressFactor * Math.PI) * 10);
      const gridVal = Math.max(0, gridKw + Math.sin(progressFactor * Math.PI) * 6);

      result.push({
        time: hourStr,
        load: Number(loadVal.toFixed(1)),
        solar: Number(solarVal.toFixed(1)),
        grid: Number(gridVal.toFixed(1)),
      });
    }
    return result;
  }, [range, currentLoadKw, solarKw, gridKw]);

  return (
    <div className="w-full rounded-2xl bg-white/[0.02] border border-white/[0.08] p-4 sm:p-5 select-none">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Demand & Generation Profile
          </h3>
          <p className="text-[11px] text-slate-500">
            Real-time power balancing over recent hours
          </p>
        </div>

        {/* 6h / 12h Switcher */}
        <div className="flex items-center gap-1 bg-black/40 border border-white/[0.06] p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setRange("6h")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              range === "6h"
                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            6 Hours
          </button>
          <button
            type="button"
            onClick={() => setRange("12h")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              range === "12h"
                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            12 Hours
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-44 sm:h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="loadArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="solarArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="gridArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}kW`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg bg-[#0c1410] border border-white/[0.1] p-2.5 shadow-xl text-xs space-y-1">
                      <p className="text-[10px] text-slate-400 font-mono mb-1">{label}</p>
                      {payload.map((entry, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-3 text-[11px]">
                          <span
                            className="font-medium"
                            style={{ color: entry.color }}
                          >
                            {entry.name === "load"
                              ? "Load Demand"
                              : entry.name === "solar"
                              ? "Solar PV"
                              : "Grid Import"}
                            :
                          </span>
                          <span className="font-mono text-white font-semibold">
                            {entry.value} kW
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="load"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#loadArea)"
            />
            <Area
              type="monotone"
              dataKey="solar"
              stroke="#f59e0b"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#solarArea)"
            />
            <Area
              type="monotone"
              dataKey="grid"
              stroke="#3b82f6"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#gridArea)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-white/[0.04] text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-slate-300">Total Load Demand</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="text-slate-300">Solar Generation</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          <span className="text-slate-300">Grid Import</span>
        </div>
      </div>
    </div>
  );
}
