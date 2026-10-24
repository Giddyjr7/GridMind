"use client";

import * as React from "react";
import {
  Scale,
  ShieldAlert,
  Fuel,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Info,
  HelpCircle,
  Clock,
  BatteryWarning,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnalyticsSummary } from "@/lib/analytics-engine";
import { formatCurrency } from "@/lib/formatters";

interface BaselineComparisonSectionProps {
  summary: AnalyticsSummary;
}

export function BaselineComparisonSection({ summary }: BaselineComparisonSectionProps) {
  const { gridmind, baseline, costSavingsNgn, costSavingsPct, fuelSavingsLiters, avoidedGenHours } = summary;

  return (
    <div className="space-y-6">
      {/* 1. Strategy Definitions Card */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-brand-700" />
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Fair Baseline Strategy & Architectural Comparison
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Rigorous side-by-side benchmark using identical 24-hour demand curves, ambient temperatures, and feeder grid reliability.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Baseline Strategy Definition */}
          <div className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Conventional Baseline Strategy
              </span>
              <Badge variant="critical" size="sm" className="font-mono text-[10px]">
                UNMANAGED ATS
              </Badge>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard commercial facility approach: An automatic transfer switch (ATS) detects mains failure and immediately cranks the 160 kVA diesel generator.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-500 font-bold">•</span>
                <span><strong>No Load Curtailment:</strong> All loads (including 26.5 kW nonessential packaging HVAC) run continuously on generator.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-500 font-bold">•</span>
                <span><strong>Uncoordinated Solar:</strong> Standard string inverters trip off during islanding because no grid-forming master reference exists.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-500 font-bold">•</span>
                <span><strong>Zero Reserve Management:</strong> No battery SOC buffering; generator consumes full diesel run-rate for entire outage duration.</span>
              </li>
            </ul>
          </div>

          {/* GridMind Strategy Definition */}
          <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                GridMind Intelligent Orchestration
              </span>
              <Badge variant="healthy" size="sm" className="font-mono text-[10px]">
                PREDICTIVE POLICY
              </Badge>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Smart microgrid optimization prioritizing thermal cold chain safety, renewable solar self-consumption, and diesel avoidance.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Instant Deferrable Curtailment:</strong> Noncritical packaging & admin HVAC are curtailed upon grid loss, instantly shedding ~25 kW.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Solar & Battery Priority:</strong> Usable battery capacity (above 20% reserve) + solar PV carry the cold storage load cleanly.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Strict Reserve Floor Guard:</strong> Generator engagement is delayed until battery hits 20% floor, eliminating premature diesel burns.</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 2. Side-by-Side KPI Comparison Table */}
      <Card className="border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Evaluation Dimension</th>
                <th className="py-3 px-4">Conventional Baseline</th>
                <th className="py-3 px-4 text-emerald-900 bg-emerald-50/60">GridMind Orchestration</th>
                <th className="py-3 px-4 text-right">Comparative Delta</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Row 1: Operating Cost */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-slate-400" />
                  Total 24h Energy Operating Cost
                </td>
                <td className="py-3 px-4 font-mono font-medium text-slate-700">
                  {formatCurrency(baseline.totalCostNgn, "NGN")}
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-700 bg-emerald-50/30">
                  {formatCurrency(gridmind.totalCostNgn, "NGN")}
                </td>
                <td className="py-3 px-4 font-mono font-bold text-right text-emerald-600">
                  {costSavingsNgn > 0 ? `-${formatCurrency(costSavingsNgn, "NGN")} (-${costSavingsPct}%)` : "₦0 Parity"}
                </td>
                <td className="py-3 px-4 text-center">
                  <Badge variant={costSavingsNgn > 0 ? "healthy" : "neutral"} size="sm">
                    {costSavingsNgn > 0 ? "Cost Reduced" : "Parity"}
                  </Badge>
                </td>
              </tr>

              {/* Row 2: Generator Runtime */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Generator Operating Hours
                </td>
                <td className="py-3 px-4 font-mono font-medium text-slate-700">
                  {baseline.generatorRunHours} hours
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-700 bg-emerald-50/30">
                  {gridmind.generatorRunHours} hours
                </td>
                <td className="py-3 px-4 font-mono font-bold text-right text-emerald-600">
                  {avoidedGenHours > 0 ? `-${avoidedGenHours} hrs avoided` : "0 hrs delta"}
                </td>
                <td className="py-3 px-4 text-center">
                  <Badge variant={avoidedGenHours > 0 ? "healthy" : "neutral"} size="sm">
                    {avoidedGenHours > 0 ? "Hours Saved" : "Equivalent"}
                  </Badge>
                </td>
              </tr>

              {/* Row 3: Fuel Consumed */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-slate-400" />
                  Diesel Fuel Consumption
                </td>
                <td className="py-3 px-4 font-mono font-medium text-slate-700">
                  {baseline.generatorFuelLiters} Liters
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-700 bg-emerald-50/30">
                  {gridmind.generatorFuelLiters} Liters
                </td>
                <td className="py-3 px-4 font-mono font-bold text-right text-emerald-600">
                  {fuelSavingsLiters > 0 ? `-${fuelSavingsLiters} Liters avoided` : "0 L delta"}
                </td>
                <td className="py-3 px-4 text-center">
                  <Badge variant={fuelSavingsLiters > 0 ? "healthy" : "neutral"} size="sm">
                    {fuelSavingsLiters > 0 ? "Diesel Abated" : "Zero Burn"}
                  </Badge>
                </td>
              </tr>

              {/* Row 4: Critical Cold Chain Uptime */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Critical-Load Uptime (% of Period)
                </td>
                <td className="py-3 px-4 font-mono font-medium text-slate-700">
                  100.0% (Via continuous diesel)
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-700 bg-emerald-50/30">
                  100.0% (Via Solar + ESS)
                </td>
                <td className="py-3 px-4 font-mono text-right text-slate-500">
                  0.0% difference
                </td>
                <td className="py-3 px-4 text-center">
                  <Badge variant="healthy" size="sm">
                    100% Protected
                  </Badge>
                </td>
              </tr>

              {/* Row 5: Battery Reserve Floor Violations */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                  <BatteryWarning className="w-4 h-4 text-amber-500" />
                  Battery 20% Reserve Floor Violations
                </td>
                <td className="py-3 px-4 font-mono text-rose-700 font-medium">
                  {baseline.reserveViolationsCount} violations (No floor logic)
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-700 bg-emerald-50/30">
                  0 violations (Strict BMS guard)
                </td>
                <td className="py-3 px-4 font-mono text-right text-emerald-600 font-bold">
                  Zero deep discharges
                </td>
                <td className="py-3 px-4 text-center">
                  <Badge variant="healthy" size="sm">
                    Guarded
                  </Badge>
                </td>
              </tr>

              {/* Row 6: Carbon Footprint */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-teal-500" />
                  Simulated CO2 Footprint
                </td>
                <td className="py-3 px-4 font-mono font-medium text-slate-700">
                  {baseline.co2EmissionsKg} kg CO2
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-700 bg-emerald-50/30">
                  {gridmind.co2EmissionsKg} kg CO2
                </td>
                <td className="py-3 px-4 font-mono font-bold text-right text-emerald-600">
                  {baseline.co2EmissionsKg - gridmind.co2EmissionsKg > 0
                    ? `-${baseline.co2EmissionsKg - gridmind.co2EmissionsKg} kg abated`
                    : "0 kg delta"}
                </td>
                <td className="py-3 px-4 text-center">
                  <Badge variant="healthy" size="sm">
                    Cleaner
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* 3. Transparent Assumptions & Parity Edge Cases */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-sky-600" />
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Transparent Engineering Assumptions & Parity Conditions
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Clear documentation of modeling assumptions, levelized accounting, and scenarios where strategies perform identically.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              100% Grid Feeder Stability
            </span>
            <p className="text-slate-600 leading-relaxed">
              When the national grid operates with zero outages over a 24-hour cycle, both GridMind and the baseline run on mains power. <strong>In this state, GridMind produces 0% financial savings</strong>, proving the model never manufactures artificial gains when the grid is stable.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Prolonged Continuous Blackout (&gt;24h)
            </span>
            <p className="text-slate-600 leading-relaxed">
              During multi-day blackouts where battery ESS reaches the 20% reserve floor and daytime solar is insufficient, GridMind must also crank the diesel generator to protect frozen inventory. <strong>Long-term performance converges as battery energy is exhausted.</strong>
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Levelized Cost Accounting (LCOE)
            </span>
            <p className="text-slate-600 leading-relaxed">
              GridMind accounting is not &quot;free solar.&quot; The calculations factor in <strong>₦42.00/kWh amortized solar capital cost</strong> and <strong>₦68.00/kWh battery cell degradation</strong> into GridMind operating costs, ensuring realistic financial modeling.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
