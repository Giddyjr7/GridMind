"use client";

import * as React from "react";
import {
  Gauge,
  BatteryCharging,
  Clock,
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { DashboardMetrics } from "@/types/energy";
import { formatEnergy } from "@/lib/formatters";

interface MetricCardsRowProps {
  metrics: DashboardMetrics;
}

export function MetricCardsRow({ metrics }: MetricCardsRowProps) {
  const { site, telemetry, battery } = metrics;

  // Calculate percentage of contracted limit utilized
  const loadPercentage = Math.round((telemetry.currentLoadKw / site.contractedDemandKw) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* 1. Current Total Load */}
      <MetricCard
        label="Energy in use"
        value={telemetry.currentLoadKw.toFixed(1)}
        unit="kW"
        subValue={`${loadPercentage}% of available capacity`}
        badgeText="Normal"
        badgeVariant="healthy"
        icon={<Gauge className="h-4 w-4" />}
      />

      {/* 2. Battery State of Charge */}
      <MetricCard
        label="Battery available"
        value={battery.stateOfChargePct}
        unit="%"
        subValue={`Usable: ${formatEnergy(battery.currentStoredKwh)}`}
        badgeText="Ready"
        badgeVariant="info"
        icon={<BatteryCharging className="h-4 w-4" />}
      />

      {/* 3. Estimated Remaining Backup Runtime */}
      <MetricCard
        label="Backup time"
        value="5.3"
        unit="Hours"
        subValue="Critical equipment protected"
        badgeText="Safe"
        badgeVariant="healthy"
        icon={<Clock className="h-4 w-4" />}
      />

    </div>
  );
}
