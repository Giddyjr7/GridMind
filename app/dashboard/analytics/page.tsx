"use client";

import * as React from "react";
import {
  TrendingDown,
  DollarSign,
  Battery,
  Leaf,
  ChevronDown,
  ChevronUp,
  Sliders,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useScenario } from "@/context/scenario-context";

export default function AnalyticsPage() {
  const { inputs, outputs, config, activePresetId, applyPreset } = useScenario();
  const [chartTab, setChartTab] = React.useState<"cost" | "dispatch" | "battery">("cost");
  const [assumptionsOpen, setAssumptionsOpen] = React.useState(false);

  // Dynamic chart data across 24h cycle
  const chartData = React.useMemo(() => {
    const hours = [
      "00:00", "02:00", "04:00", "06:00", "08:00", "10:00",
      "12:00", "14:00", "16:00", "18:00", "20:00", "22:00",
    ];

    return hours.map((h, i) => {
      const solarFactor = Math.max(0, Math.sin(((i - 3) / 6) * Math.PI));
      const solarKw = inputs.solar.isEnabled ? Number((inputs.solar.installedCapacityKwp * 0.85 * solarFactor).toFixed(1)) : 0;
      const loadKw = Number((outputs.totalLoadKw * (0.85 + 0.15 * Math.sin(i / 2))).toFixed(1));
      const baselineCost = Math.round(loadKw * (inputs.grid.tariffPerKwh || 206) * 1.4);
      const managedCost = Math.round(Math.max(0, loadKw - solarKw) * (inputs.grid.tariffPerKwh || 206));

      return {
        time: h,
        baselineCost,
        managedCost,
        loadKw,
        solarKw,
        gridKw: Math.max(0, loadKw - solarKw),
        soc: Math.round(inputs.battery.stateOfChargePct + Math.sin(i) * 10),
      };
    });
  }, [inputs, outputs]);

  const co2AbatementKgPerHour = Number(
    (outputs.dispatch.solarKw * 0.42).toFixed(1)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Top Header & Scenario Presets Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Continuous Energy Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational tariff efficiency, generator avoidance modeling, and carbon savings
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 bg-black/40 border border-white/[0.08] p-1 rounded-xl text-xs">
          {[
            { id: "preset_normal", label: "Grid Baseline" },
            { id: "preset_outage_battery", label: "Outage ESS Run" },
            { id: "preset_solar_peak", label: "Solar Maximized" },
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activePresetId === preset.id
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider text-[11px] font-medium">Hourly Cost</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">
            ₦{outputs.costs.totalHourlyCostNgn.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 truncate">
            Grid: ₦{outputs.costs.gridCostPerHourNgn} · Diesel: ₦{outputs.costs.dieselCostPerHourNgn}
          </p>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider text-[11px] font-medium">Diesel Avoidance</span>
            <TrendingDown className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400">
            ₦{outputs.baselineComparison.hourlySavingsNgn.toLocaleString()}/hr
          </p>
          <p className="text-[11px] text-slate-400 truncate">
            {outputs.baselineComparison.savingsPct}% reduction vs unmanaged run
          </p>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider text-[11px] font-medium">Usable Storage</span>
            <Battery className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">
            {outputs.usableBatteryKwh} kWh
          </p>
          <p className="text-[11px] text-slate-400 truncate">
            {outputs.backupRuntimeFormatted} runtime autonomy
          </p>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider text-[11px] font-medium">CO2 Abatement</span>
            <Leaf className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400">
            {co2AbatementKgPerHour} kg/hr
          </p>
          <p className="text-[11px] text-slate-400 truncate">
            Offset through rooftop solar generation
          </p>
        </div>
      </div>

      {/* Primary Analytics Chart with Tabs */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Operational Time-Series Analysis
            </h3>
            <p className="text-[11px] text-slate-400">
              Projected 24-hour cycle performance based on current dispatch parameters
            </p>
          </div>

          <div className="flex items-center gap-1 bg-black/40 border border-white/[0.06] p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setChartTab("cost")}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
                chartTab === "cost"
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Cost Profile
            </button>
            <button
              type="button"
              onClick={() => setChartTab("dispatch")}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
                chartTab === "dispatch"
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Dispatch Balance
            </button>
            <button
              type="button"
              onClick={() => setChartTab("battery")}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
                chartTab === "battery"
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Battery SoC
            </button>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartTab === "cost" ? (
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="managedCostGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="baselineCostGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg bg-[#0c1410] border border-white/[0.1] p-2.5 shadow-xl text-xs space-y-1">
                          <p className="text-[10px] text-slate-400 font-mono mb-1">{label}</p>
                          <p className="text-emerald-400 font-mono">Managed: ₦{payload[0].value?.toLocaleString()}/hr</p>
                          <p className="text-rose-400 font-mono">Baseline: ₦{payload[1].value?.toLocaleString()}/hr</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="managedCost" stroke="#10b981" strokeWidth={2} fill="url(#managedCostGrad)" />
                <Area type="monotone" dataKey="baselineCost" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#baselineCostGrad)" />
              </AreaChart>
            ) : chartTab === "dispatch" ? (
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}kW`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg bg-[#0c1410] border border-white/[0.1] p-2.5 shadow-xl text-xs space-y-1">
                          <p className="text-[10px] text-slate-400 font-mono mb-1">{label}</p>
                          {payload.map((e, idx) => (
                            <p key={idx} style={{ color: e.color }} className="font-mono text-[11px]">
                              {e.name}: {e.value} kW
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="solarKw" name="Solar PV" fill="#f59e0b" stackId="a" radius={[2, 2, 0, 0]} />
                <Bar dataKey="gridKw" name="Grid Supply" fill="#3b82f6" stackId="a" radius={[2, 2, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="socGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg bg-[#0c1410] border border-white/[0.1] p-2 shadow-xl text-xs">
                          <p className="text-[10px] text-slate-400 font-mono">{label}</p>
                          <p className="text-emerald-400 font-mono font-semibold">State of Charge: {payload[0].value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="soc" stroke="#10b981" strokeWidth={2} fill="url(#socGrad)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Strategy Benchmark Matrix
          </h3>
          <p className="text-[11px] text-slate-400">
            Unmanaged baseline run vs GridMind smart prioritized dispatch
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400 text-[11px]">
              <tr>
                <th className="p-3.5 pl-5">Metric</th>
                <th className="p-3.5">Baseline (Unmanaged)</th>
                <th className="p-3.5">Managed Dispatch</th>
                <th className="p-3.5 pr-5">Projected Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300 font-mono">
              <tr>
                <td className="p-3.5 pl-5 font-sans text-white">Hourly Operating Cost</td>
                <td className="p-3.5">₦{outputs.baselineComparison.baselineHourlyCostNgn.toLocaleString()}/hr</td>
                <td className="p-3.5 text-emerald-400">₦{outputs.baselineComparison.proposedHourlyCostNgn.toLocaleString()}/hr</td>
                <td className="p-3.5 pr-5 text-emerald-400">-{outputs.baselineComparison.savingsPct}%</td>
              </tr>
              <tr>
                <td className="p-3.5 pl-5 font-sans text-white">Diesel Burn Rate</td>
                <td className="p-3.5">25.6 L/h</td>
                <td className="p-3.5 text-emerald-400">{outputs.costs.dieselFuelBurnRateLph} L/h</td>
                <td className="p-3.5 pr-5 text-emerald-400">-{(25.6 - outputs.costs.dieselFuelBurnRateLph).toFixed(1)} L/h</td>
              </tr>
              <tr>
                <td className="p-3.5 pl-5 font-sans text-white">Backup Autonomy</td>
                <td className="p-3.5">2.2h</td>
                <td className="p-3.5 text-white">{outputs.backupRuntimeFormatted}</td>
                <td className="p-3.5 pr-5 text-emerald-400">+{outputs.recommendation.projectedRuntimeExtensionHours}h</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Collapsed Assumptions Drawer */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] overflow-hidden">
        <button
          type="button"
          onClick={() => setAssumptionsOpen(!assumptionsOpen)}
          className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-white">
              Calculation Parameters & Assumptions
            </span>
          </div>
          {assumptionsOpen ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {assumptionsOpen && (
          <div className="p-4 pt-0 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04]">
              <span className="text-[10px] text-slate-400 block">Grid Tariff (Band A)</span>
              <span className="font-mono text-white font-medium">₦{config.gridTariffNgnPerKwh}/kWh</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04]">
              <span className="text-[10px] text-slate-400 block">Diesel Fuel Price</span>
              <span className="font-mono text-white font-medium">₦{config.dieselPriceNgnPerLiter}/Liter</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04]">
              <span className="text-[10px] text-slate-400 block">Battery Safety Floor</span>
              <span className="font-mono text-white font-medium">{config.batteryReserveFloorPct}%</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04]">
              <span className="text-[10px] text-slate-400 block">Round-trip Efficiency</span>
              <span className="font-mono text-white font-medium">{(config.batteryRoundtripEfficiency * 100).toFixed(0)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
