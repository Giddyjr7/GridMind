"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart3, Clock, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { EnergyReading } from "@/types/energy";
import { formatPower, formatCurrency } from "@/lib/formatters";

interface EnergyUsageChartProps {
  telemetry: EnergyReading[];
}

export function EnergyUsageChart({ telemetry }: EnergyUsageChartProps) {
  const [timeRange, setTimeRange] = React.useState<"6h" | "12h" | "24h">("24h");

  // Filter based on selected time range
  const filteredData = React.useMemo(() => {
    if (!telemetry || telemetry.length === 0) return [];
    const count = timeRange === "6h" ? 4 : timeRange === "12h" ? 7 : telemetry.length;
    return telemetry.slice(Math.max(0, telemetry.length - count)).map((item) => ({
      ...item,
      timeLabel: new Date(item.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  }, [telemetry, timeRange]);

  if (!telemetry || telemetry.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Energy Demand & Generation Trend</CardTitle>
          <CardDescription>Telemetry history</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<BarChart3 className="h-6 w-6" />}
            title="No Telemetry Data Recorded"
            description="Historical energy demand and solar generation curves will appear here once telemetry is collected."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle>Energy Demand & Generation Trend</CardTitle>
            <CardDescription>
              Comparing facility total load against rooftop solar PV generation and grid import
            </CardDescription>
          </div>

          {/* Time Range Selector */}
          <div className="inline-flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs">
            {(["6h", "12h", "24h"] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md font-bold transition-colors uppercase ${
                  timeRange === range
                    ? "bg-white text-slate-950 shadow-xs border border-slate-300"
                    : "text-slate-700 hover:text-slate-950"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Chart View */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#166534" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#166534" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

              <XAxis
                dataKey="timeLabel"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />

              <YAxis
                unit=" kW"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />

              <RechartsTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as EnergyReading & { timeLabel: string };
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1.5 font-sans min-w-[170px]">
                        <p className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                          {data.timeLabel} WAT
                        </p>
                        <div className="space-y-1 font-mono">
                          <div className="flex justify-between text-slate-700">
                            <span>Total Load:</span>
                            <span className="font-bold">{formatPower(data.totalLoadKw)}</span>
                          </div>
                          <div className="flex justify-between text-amber-700">
                            <span>Solar Output:</span>
                            <span className="font-bold">{formatPower(data.solarPowerKw)}</span>
                          </div>
                          <div className="flex justify-between text-brand-900">
                            <span>Grid Import:</span>
                            <span className="font-bold">{formatPower(data.gridPowerKw)}</span>
                          </div>
                          <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-100">
                            <span>Hourly Run:</span>
                            <span className="font-bold text-emerald-700">
                              {formatCurrency(data.estimatedHourlyCost)}/h
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Area
                type="monotone"
                dataKey="totalLoadKw"
                name="Total Facility Load"
                stroke="#0f172a"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorLoad)"
              />

              <Area
                type="monotone"
                dataKey="solarPowerKw"
                name="Solar PV Generation"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSolar)"
              />

              <Area
                type="monotone"
                dataKey="gridPowerKw"
                name="Utility Grid Import"
                stroke="#166534"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorGrid)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
            <span className="font-medium text-slate-700">Total Facility Load (kW)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="font-medium text-slate-700">Rooftop Solar PV (kW)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-700" />
            <span className="font-medium text-slate-700">National Grid Import (kW)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
