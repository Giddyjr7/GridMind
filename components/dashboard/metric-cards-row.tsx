"use client";

import * as React from "react";
import {
  Gauge,
  BatteryCharging,
  Clock,
  Coins,
  ShieldCheck,
  TrendingDown,
  Sun,
  Zap,
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { DashboardMetrics } from "@/types/energy";
import {
  formatPower,
  formatEnergy,
  formatPercentage,
  formatCurrency,
  formatTariff,
} from "@/lib/formatters";

interface MetricCardsRowProps {
  metrics: DashboardMetrics;
}

export function MetricCardsRow({ metrics }: MetricCardsRowProps) {
  const { site, telemetry, battery, grid, cost } = metrics;

  // Calculate percentage of contracted limit utilized
  const loadPercentage = Math.round((telemetry.currentLoadKw / site.contractedDemandKw) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Current Total Load */}
      <MetricCard
        label="Current Total Load"
        value={telemetry.currentLoadKw.toFixed(1)}
        unit="kW"
        subValue={`${loadPercentage}% of ${site.contractedDemandKw} kW capacity`}
        badgeText="Balanced"
        badgeVariant="healthy"
        icon={<Gauge className="h-4 w-4" />}
      />

      {/* 2. Battery State of Charge */}
      <MetricCard
        label="Battery Storage (SOC)"
        value={battery.stateOfChargePct}
        unit="%"
        subValue={`Usable: ${formatEnergy(battery.currentStoredKwh)}`}
        badgeText={battery.mode.toUpperCase()}
        badgeVariant="info"
        icon={<BatteryCharging className="h-4 w-4" />}
      />

      {/* 3. Estimated Remaining Backup Runtime */}
      <MetricCard
        label="Backup Runtime Est."
        value="5.3"
        unit="Hours"
        subValue="Blast Freezers Room A & B Protected"
        badgeText="Safe Buffer"
        badgeVariant="healthy"
        icon={<Clock className="h-4 w-4" />}
      />

      {/* 4. Current Operating Cost Run-Rate */}
      <MetricCard
        label="Operating Cost Run-Rate"
        value={formatCurrency(cost.todayTotalCost / 12, "NGN", 0)}
        unit="/hr"
        subValue={`Grid Tariff: ${formatTariff(grid.tariffPerKwh)}`}
        badgeText="Grid Import"
        badgeVariant="healthy"
        icon={<Coins className="h-4 w-4" />}
      />

      {/* 5. Critical Load Status */}
      <MetricCard
        label="Critical Load Health"
        value="100%"
        subValue="Refrigeration Safe (-21.4°C)"
        badgeText="Zero Spoilage Risk"
        badgeVariant="healthy"
        icon={<ShieldCheck className="h-4 w-4 text-emerald-600" />}
      />
    </div>
  );
}
