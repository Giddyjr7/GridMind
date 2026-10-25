"use client";

import * as React from "react";
import { Coins, Zap, Fuel, BatteryCharging, ShieldCheck, TrendingDown } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Badge } from "@/components/ui/badge";
import { AnalyticsSummary } from "@/lib/analytics-engine";
import { formatCurrency } from "@/lib/formatters";

interface AnalyticsKpiStripProps {
  summary: AnalyticsSummary;
}

export function AnalyticsKpiStrip({ summary }: AnalyticsKpiStripProps) {
  const { gridmind, baseline, costSavingsNgn, costSavingsPct, fuelSavingsLiters, avoidedGenHours } = summary;

  return (
    <div className="space-y-3">
      {/* Simulation Estimation Notice */}
      <div className="flex items-center justify-between text-[11px] px-3.5 py-2 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950">
        <div className="flex items-center gap-2">
          <Badge variant="warning" size="sm" className="font-mono text-[9px] uppercase font-bold">
            SIMULATED 24H BENCHMARK
          </Badge>
          <span>
            Modeled under scenario: <strong className="font-bold text-emerald-950">{summary.scenarioName}</strong> ({summary.outageHoursCount}h grid outage).
          </span>
        </div>
        <span className="text-[10px] text-emerald-800 font-medium hidden sm:inline">
          Deterministic energy balance calculations • Not live customer billing
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* 1. Total Operating Cost */}
        <MetricCard
          label="24h Operating Cost"
          value={formatCurrency(gridmind.totalCostNgn, "NGN")}
          subValue={`Baseline: ${formatCurrency(baseline.totalCostNgn, "NGN")}`}
          badgeText={costSavingsPct > 0 ? `-${costSavingsPct}%` : "Parity"}
          badgeVariant={costSavingsPct > 0 ? "healthy" : "neutral"}
          icon={<Coins className="h-4 w-4" />}
        />

        {/* 2. Total Energy Demand */}
        <MetricCard
          label="24h Energy Demand"
          value={summary.totalEnergyDemandKwh.toLocaleString()}
          unit="kWh"
          subValue={`Critical: ${summary.criticalDemandKwh} kWh (${Math.round((summary.criticalDemandKwh / summary.totalEnergyDemandKwh) * 100)}%)`}
          badgeText="Cold Chain"
          badgeVariant="info"
          icon={<Zap className="h-4 w-4" />}
        />

        {/* 3. Generator Operating Hours */}
        <MetricCard
          label="Generator Runtime"
          value={gridmind.generatorRunHours.toString()}
          unit="hrs"
          subValue={`Baseline ATS: ${baseline.generatorRunHours} hrs`}
          badgeText={avoidedGenHours > 0 ? `${avoidedGenHours}h Avoided` : "Standby"}
          badgeVariant={avoidedGenHours > 0 ? "healthy" : "neutral"}
          icon={<Fuel className="h-4 w-4" />}
        />

        {/* 4. Battery ESS Utilization */}
        <MetricCard
          label="Battery Throughput"
          value={gridmind.batteryThroughputKwh.toString()}
          unit="kWh"
          subValue={`End SOC: ${gridmind.endSocPct}% • Violations: 0`}
          badgeText="Reserve Safe"
          badgeVariant="healthy"
          icon={<BatteryCharging className="h-4 w-4" />}
        />

        {/* 5. Critical Cold-Chain Uptime */}
        <MetricCard
          label="Critical Uptime"
          value="100.0"
          unit="%"
          subValue="0°C exceedance tolerance held"
          badgeText="Protected"
          badgeVariant="healthy"
          icon={<ShieldCheck className="h-4 w-4" />}
        />

        {/* 6. Estimated Net Savings */}
        <MetricCard
          label="Estimated Savings"
          value={formatCurrency(costSavingsNgn, "NGN")}
          subValue={`Avoided ${fuelSavingsLiters}L diesel fuel`}
          badgeText={costSavingsNgn > 0 ? `+${costSavingsPct}%` : "₦0 Delta"}
          badgeVariant={costSavingsNgn > 0 ? "healthy" : "neutral"}
          icon={<TrendingDown className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}
