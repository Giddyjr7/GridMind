"use client";

import * as React from "react";
import {
  TrendingDown,
  Clock,
  Fuel,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  Scale,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StrategyComparison } from "@/types/decision-intelligence";
import { formatCurrency } from "@/lib/formatters";

interface StrategyComparisonCardProps {
  comparison: StrategyComparison;
  className?: string;
}

export function StrategyComparisonCard({
  comparison,
  className = "",
}: StrategyComparisonCardProps) {
  const [showAssumptions, setShowAssumptions] = React.useState<boolean>(false);
  const { baseline, proposed } = comparison;

  const getStatusBadge = (status: "protected" | "at_risk" | "compromised") => {
    switch (status) {
      case "protected":
        return (
          <Badge variant="healthy" size="sm">
            <ShieldCheck className="w-3 h-3 mr-1 inline" />
            Protected
          </Badge>
        );
      case "at_risk":
        return (
          <Badge variant="warning" size="sm">
            <AlertTriangle className="w-3 h-3 mr-1 inline" />
            At Risk
          </Badge>
        );
      case "compromised":
        return (
          <Badge variant="critical" size="sm">
            <ShieldAlert className="w-3 h-3 mr-1 inline" />
            Compromised
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={`border-slate-200/90 bg-white shadow-xs ${className}`}>
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-700" />
                Strategy Comparison: Baseline vs GridMind Intelligent Policy
              </CardTitle>
            </div>
            <p className="text-xs text-slate-500">
              Deterministic benchmark evaluating operating cost, battery runtime, and cold chain protection
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="healthy" size="md" className="font-bold">
              {comparison.costReductionPercentage > 0
                ? `${comparison.costReductionPercentage}% Cost Reduction`
                : "Cost Neutral"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Top Summary Banner */}
        <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-900">
              Intelligence Impact
            </div>
            <p className="text-xs font-semibold text-slate-800">
              {comparison.verdictSummary}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white px-3 py-1.5 rounded-lg border border-emerald-300 text-center shadow-2xs">
              <div className="text-[10px] font-semibold text-slate-500 uppercase">
                Hourly Savings
              </div>
              <div className="text-sm font-bold text-emerald-700">
                {comparison.costDeltaNgnPerHour > 0
                  ? `-${formatCurrency(comparison.costDeltaNgnPerHour, "NGN")}/hr`
                  : "₦0/hr"}
              </div>
            </div>

            <div className="bg-white px-3 py-1.5 rounded-lg border border-emerald-300 text-center shadow-2xs">
              <div className="text-[10px] font-semibold text-slate-500 uppercase">
                Runtime Extension
              </div>
              <div className="text-sm font-bold text-slate-900">
                +{comparison.runtimeGainHours.toFixed(1)} hrs
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Conventional Baseline Strategy */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                  Unmanaged Baseline
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {baseline.strategyName}
                </h4>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                Static ATS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <div className="text-slate-500 text-[11px]">Operating Cost</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  {formatCurrency(baseline.hourlyCostNgn, "NGN")}/hr
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <div className="text-slate-500 text-[11px]">Battery Runtime</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  {baseline.runtimeDisplayString}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <div className="text-slate-500 text-[11px]">Fuel Consumption</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  {baseline.dieselFuelBurnRateLph.toFixed(1)} L/hr
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <div className="text-slate-500 text-[11px]">Active Demand</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  {baseline.activeLoadKw.toFixed(1)} kW
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-600 font-medium">
                Critical Cold Chain:
              </span>
              {getStatusBadge(baseline.criticalLoadStatus)}
            </div>
          </div>

          {/* 2. GridMind Intelligent Strategy */}
          <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/20 space-y-3 ring-1 ring-emerald-200">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
                  Recommended Policy
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {proposed.strategyName}
                </h4>
              </div>
              <Badge variant="healthy" size="sm">
                AI Optimized
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-emerald-200">
                <div className="text-slate-500 text-[11px]">Operating Cost</div>
                <div className="font-bold text-emerald-800 text-sm mt-0.5">
                  {formatCurrency(proposed.hourlyCostNgn, "NGN")}/hr
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-emerald-200">
                <div className="text-slate-500 text-[11px]">Battery Runtime</div>
                <div className="font-bold text-emerald-800 text-sm mt-0.5">
                  {proposed.runtimeDisplayString}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-emerald-200">
                <div className="text-slate-500 text-[11px]">Fuel Consumption</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  {proposed.dieselFuelBurnRateLph.toFixed(1)} L/hr
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-emerald-200">
                <div className="text-slate-500 text-[11px]">Active Demand</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  {proposed.activeLoadKw.toFixed(1)} kW
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-600 font-medium">
                Critical Cold Chain:
              </span>
              {getStatusBadge(proposed.criticalLoadStatus)}
            </div>
          </div>
        </div>

        {/* Assumptions & Limitations Toggle */}
        <div className="pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAssumptions(!showAssumptions)}
            className="w-full text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center gap-1.5 py-1.5 h-8 border border-slate-200"
          >
            <Info className="w-3.5 h-3.5 text-slate-500" />
            {showAssumptions
              ? "Hide Model Assumptions and Limitations"
              : "View Model Assumptions and Limitations"}
            {showAssumptions ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </Button>

          {showAssumptions && (
            <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2.5 animate-in fade-in duration-200">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-700" />
                Mathematical Model Assumptions
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 leading-relaxed">
                <li>
                  <strong>Utility Tariff:</strong> Ikeja Industrial Band A indexed at ₦206.00/kWh during grid availability periods.
                </li>
                <li>
                  <strong>Diesel Generation:</strong> Fuel calculated at ₦1,300/liter based on 0.28 L/kWh specific fuel consumption curve.
                </li>
                <li>
                  <strong>Battery Storage:</strong> LiFePO4 battery model assumes 92% round-trip inverter efficiency and a mandatory 20% minimum state-of-charge reserve floor.
                </li>
                <li>
                  <strong>Thermal Inertia:</strong> Cold room storage maintains product safety between -18°C and -16°C for up to 90 minutes without active cooling.
                </li>
                <li>
                  <strong>Baseline Policy:</strong> Unmanaged automatic transfer switch operates all nonessential air conditioners and loads during blackouts until total battery depletion.
                </li>
              </ul>
              <div className="pt-1 text-[11px] text-slate-500">
                Note: All estimates are simulated for benchmarking purposes and reflect deterministic equations derived from industrial microgrid operations.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
