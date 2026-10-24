"use client";

import * as React from "react";
import { PageContainer } from "@/components/ui/page-container";
import {
  DashboardHeader,
  MetricCardsRow,
  PowerSourcesOverview,
  EnergyUsageChart,
  EquipmentStatusTable,
  ActiveAlertsCard,
  CurrentRecommendationCard,
} from "@/components/dashboard";
import {
  DashboardMetrics,
  Appliance,
  EnergyRecommendation,
  EnergyReading,
  EnergyEventRecord,
} from "@/types";
import { useSimulation } from "@/context/simulation-context";

interface OverviewClientProps {
  initialMetrics: DashboardMetrics;
  initialAppliances: Appliance[];
  initialRecommendations: EnergyRecommendation[];
  initialTelemetry: EnergyReading[];
  initialEvents: EnergyEventRecord[];
}

export function OverviewClient({
  initialMetrics,
  initialAppliances,
  initialRecommendations,
  initialTelemetry,
  initialEvents,
}: OverviewClientProps) {
  const {
    derivedDashboardMetrics,
    appliances: simAppliances,
    recommendations: simRecommendations,
    events: simEvents,
    lastSimulatedTick,
    stepSimulationHour,
  } = useSimulation();

  const [telemetry] = React.useState<EnergyReading[]>(initialTelemetry);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);

  // Synchronized state with simulator
  const activeMetrics = derivedDashboardMetrics || initialMetrics;
  const activeAppliances = simAppliances || initialAppliances;
  const activeRecommendations = simRecommendations || initialRecommendations;
  const activeEvents = simEvents || initialEvents;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    stepSimulationHour();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  const pendingRecommendationsCount = activeRecommendations.filter(
    (r) => r.status === "pending"
  ).length;

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* 1. Dashboard Header */}
        <DashboardHeader
          site={activeMetrics.site}
          grid={activeMetrics.grid}
          lastUpdated={lastSimulatedTick}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* 2. Key Metric Cards */}
        <MetricCardsRow metrics={activeMetrics} />

        {/* 3. Power Source Overview */}
        <PowerSourcesOverview
          grid={activeMetrics.grid}
          solar={activeMetrics.solar}
          battery={activeMetrics.battery}
          generator={activeMetrics.generator}
          totalLoadKw={activeMetrics.telemetry.currentLoadKw}
        />

        {/* 4. Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Energy Usage Chart & Equipment Status */}
          <div className="lg:col-span-8 space-y-6">
            <EnergyUsageChart telemetry={telemetry} />
            <EquipmentStatusTable appliances={activeAppliances} />
          </div>

          {/* Right Column (4 cols): AI Recommendation & Active Alerts */}
          <div className="lg:col-span-4 space-y-6">
            {activeRecommendations.length > 0 && (
              <CurrentRecommendationCard
                initialRecommendation={activeRecommendations[0]}
                totalPendingCount={pendingRecommendationsCount}
              />
            )}
            <ActiveAlertsCard initialAlerts={activeEvents} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
