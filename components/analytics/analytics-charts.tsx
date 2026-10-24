"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  Zap,
  Layers,
  Coins,
  BatteryCharging,
  Fuel,
  BarChart3,
  Calendar,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { AnalyticsSummary, HourlyComparisonPoint } from "@/lib/analytics-engine";
import { formatCurrency, formatPower } from "@/lib/formatters";

interface AnalyticsChartsProps {
  summary: AnalyticsSummary;
}

type ChartViewTab = "consumption" | "sources" | "cost" | "battery" | "generator";

export function AnalyticsCharts({ summary }: AnalyticsChartsProps) {
  const [activeTab, setActiveTab] = React.useState<ChartViewTab>("consumption");

  const data = React.useMemo(() => {
    return summary.hourlyPoints.map((pt) => ({
      time: pt.timeLabel,
      hour: pt.hour,
      totalDemand: pt.totalDemandKw,
      criticalDemand: pt.criticalDemandKw,
      deferrableDemand: pt.deferrableDemandKw,
      // Source contributions
      gridImport: pt.gridmind.gridImportKw,
      solarUsed: pt.gridmind.solarUsedKw,
      batteryDischarge: pt.gridmind.batteryDischargeKw,
      batteryCharge: pt.gridmind.batteryChargeKw,
      generatorOutput: pt.gridmind.generatorKw,
      // Cost
      gmCost: pt.gridmind.hourlyCostNgn,
      blCost: pt.baseline.hourlyCostNgn,
      savings: pt.hourlySavingsNgn,
      // Battery
      gmSoc: pt.gridmind.batterySocPct,
      blSoc: pt.baseline.batterySocPct,
      // Generator
      gmDiesel: pt.gridmind.dieselLiters,
      blDiesel: pt.baseline.dieselLiters,
      gmGenKw: pt.gridmind.generatorKw,
      blGenKw: pt.baseline.generatorKw,
      gridAvailable: pt.gridAvailable,
    }));
  }, [summary]);

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <EmptyState
            icon={<BarChart3 className="h-6 w-6" />}
            title="No Simulation Data Available"
            description="Adjust simulation parameters or select a scenario to view 24-hour analytical charts."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-slate-200">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-slate-900">
                24-Hour Microgrid Dispatch & Performance Visualizations
              </CardTitle>
              <Badge variant="healthy" size="sm" className="font-mono text-[10px]">
                DETERMINISTIC MODEL
              </Badge>
            </div>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Hourly power flow balances, load priority separation, and comparative financial performance
            </CardDescription>
          </div>

          {/* Chart View Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("consumption")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === "consumption"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Energy Demand</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("sources")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === "sources"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Source Mix</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("cost")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === "cost"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-teal-600" />
              <span>Cost Comparison</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("battery")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === "battery"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BatteryCharging className="w-3.5 h-3.5 text-sky-600" />
              <span>Battery SOC</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("generator")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === "generator"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Fuel className="w-3.5 h-3.5 text-rose-600" />
              <span>Generator & Diesel</span>
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* TAB 1: ENERGY CONSUMPTION OVER TIME */}
        {activeTab === "consumption" && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
              <span className="font-medium text-slate-700">
                Facility Load Profile: Continuous Blast Freezing vs Day-Shift Packaging HVAC
              </span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-slate-900 inline-block" /> Total Active (kW)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" /> Critical Cold Chain (kW)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-amber-400 inline-block" /> Deferrable HVAC (kW)
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorDeferrable" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    unit=" kW"
                  />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      const pt = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-800">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1 font-mono font-bold">
                            <span>{label}</span>
                            <span className={pt.gridAvailable ? "text-emerald-400" : "text-amber-400"}>
                              {pt.gridAvailable ? "Mains Online" : "Grid Outage"}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Total Facility Load:</span>
                            <span className="font-mono font-bold text-white">{pt.totalDemand} kW</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-emerald-400">Critical Cold Chain:</span>
                            <span className="font-mono font-bold text-emerald-400">{pt.criticalDemand} kW</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-amber-400">Deferrable HVAC:</span>
                            <span className="font-mono font-bold text-amber-400">{pt.deferrableDemand} kW</span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalDemand"
                    name="Total Demand"
                    stroke="#0f172a"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                  <Area
                    type="monotone"
                    dataKey="criticalDemand"
                    name="Critical Load"
                    stroke="#059669"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCritical)"
                  />
                  <Area
                    type="monotone"
                    dataKey="deferrableDemand"
                    name="Deferrable Load"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#colorDeferrable)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 2: ENERGY SOURCE CONTRIBUTIONS (STACKED AREA) */}
        {activeTab === "sources" && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
              <span className="font-medium text-slate-700">
                GridMind Microgrid Generation Mix by Power Source (kW)
              </span>
              <div className="flex items-center gap-3 text-[11px] flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-slate-700 inline-block" /> Grid Import
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block" /> Solar PV
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-sky-500 inline-block" /> Battery ESS
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" /> Diesel Gen
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#334155" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#334155" stopOpacity={0.4} />
                    </linearGradient>
                    <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.4} />
                    </linearGradient>
                    <linearGradient id="colorBattery" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.4} />
                    </linearGradient>
                    <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e11d48" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    unit=" kW"
                  />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      const pt = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-800">
                          <div className="font-mono font-bold border-b border-slate-800 pb-1">
                            Time: {label}
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-300">National Grid:</span>
                            <span className="font-mono font-bold text-slate-300">{pt.gridImport} kW</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-amber-400">Solar PV:</span>
                            <span className="font-mono font-bold text-amber-400">{pt.solarUsed} kW</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-sky-400">Battery Discharge:</span>
                            <span className="font-mono font-bold text-sky-400">{pt.batteryDischarge} kW</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-rose-400">Diesel Generator:</span>
                            <span className="font-mono font-bold text-rose-400">{pt.generatorOutput} kW</span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="gridImport"
                    name="Grid Import"
                    stackId="1"
                    stroke="#334155"
                    fill="url(#colorGrid)"
                  />
                  <Area
                    type="monotone"
                    dataKey="solarUsed"
                    name="Solar PV"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="url(#colorSolar)"
                  />
                  <Area
                    type="monotone"
                    dataKey="batteryDischarge"
                    name="Battery Discharge"
                    stackId="1"
                    stroke="#0284c7"
                    fill="url(#colorBattery)"
                  />
                  <Area
                    type="monotone"
                    dataKey="generatorOutput"
                    name="Diesel Generator"
                    stackId="1"
                    stroke="#e11d48"
                    fill="url(#colorGen)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 3: OPERATING COST COMPARISON */}
        {activeTab === "cost" && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
              <span className="font-medium text-slate-700">
                Hourly Operating Run-Rate: GridMind Optimized vs Conventional Baseline (NGN/hr)
              </span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" /> GridMind Strategy (₦)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" /> Conventional Baseline (₦)
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(val) => `₦${(val / 1000).toFixed(0)}k`}
                  />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      const pt = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-800">
                          <div className="font-mono font-bold border-b border-slate-800 pb-1">
                            Hour: {label}
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-emerald-400">GridMind Cost:</span>
                            <span className="font-mono font-bold text-emerald-400">{formatCurrency(pt.gmCost, "NGN")}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-rose-400">Baseline ATS Cost:</span>
                            <span className="font-mono font-bold text-rose-400">{formatCurrency(pt.blCost, "NGN")}</span>
                          </div>
                          <div className="flex justify-between gap-4 pt-1 border-t border-slate-800">
                            <span className="text-slate-300">Hour Savings:</span>
                            <span className="font-mono font-bold text-emerald-300">
                              {pt.savings > 0 ? `+${formatCurrency(pt.savings, "NGN")}` : "₦0 Parity"}
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="gmCost" name="GridMind" fill="#059669" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="blCost" name="Baseline ATS" fill="#f43f5e" radius={[4, 4, 0, 0]} opacity={0.65} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 4: BATTERY SOC TRAJECTORY & RESERVE FLOOR */}
        {activeTab === "battery" && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
              <span className="font-medium text-slate-700">
                Battery State of Charge (%) & 20% Cold Chain Reserve Floor Protection
              </span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-sky-600 inline-block" /> GridMind SOC Trajectory
                </span>
                <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
                  <span className="w-3 h-0.5 bg-rose-500 inline-block border-b border-dashed border-rose-500" /> 20% Reserve Floor Threshold
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    unit="%"
                  />
                  <ReferenceLine
                    y={20}
                    stroke="#e11d48"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    label={{
                      value: "20% Reserve Floor",
                      fill: "#e11d48",
                      position: "insideBottomRight",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      const pt = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-800">
                          <div className="font-mono font-bold border-b border-slate-800 pb-1">
                            Hour: {label}
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-sky-400">Battery SOC:</span>
                            <span className="font-mono font-bold text-sky-400">{pt.gmSoc}%</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Reserve Floor Margin:</span>
                            <span className="font-mono font-bold text-emerald-400">
                              {Math.max(0, pt.gmSoc - 20)}% above floor
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 pt-1">
                            {pt.gmSoc <= 20
                              ? "⚠️ At Reserve Floor — Generator engaged to protect cell health"
                              : "✅ Safe buffer maintained for blast freezers"}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gmSoc"
                    name="GridMind Battery SOC"
                    stroke="#0284c7"
                    strokeWidth={3}
                    dot={{ fill: "#0284c7", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 5: GENERATOR RUNTIME & DIESEL AVOIDANCE */}
        {activeTab === "generator" && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
              <span className="font-medium text-slate-700">
                Diesel Fuel Burned (Liters/hr): GridMind Smart Backup vs Conventional ATS
              </span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" /> GridMind Fuel (L/hr)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" /> Conventional Baseline (L/hr)
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    unit=" L"
                  />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      const pt = payload[0].payload;
                      const avoided = Math.max(0, pt.blDiesel - pt.gmDiesel);
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-800">
                          <div className="font-mono font-bold border-b border-slate-800 pb-1">
                            Hour: {label}
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-emerald-400">GridMind Diesel:</span>
                            <span className="font-mono font-bold text-emerald-400">{pt.gmDiesel} Liters</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-rose-400">Baseline ATS Diesel:</span>
                            <span className="font-mono font-bold text-rose-400">{pt.blDiesel} Liters</span>
                          </div>
                          {avoided > 0 && (
                            <div className="flex justify-between gap-4 pt-1 border-t border-slate-800 text-emerald-300">
                              <span>Fuel Avoided:</span>
                              <span className="font-mono font-bold">+{avoided.toFixed(1)} L (₦{(avoided * 1250).toLocaleString()})</span>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="gmDiesel" name="GridMind Diesel" fill="#059669" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="blDiesel" name="Baseline Diesel" fill="#f43f5e" radius={[4, 4, 0, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
