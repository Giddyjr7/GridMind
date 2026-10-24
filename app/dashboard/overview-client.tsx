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
import { energyService, applianceService, recommendationService, auditService } from "@/services";

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
  const [metrics, setMetrics] = React.useState<DashboardMetrics>(initialMetrics);
  const [appliances, setAppliances] = React.useState<Appliance[]>(initialAppliances);
  const [recommendations, setRecommendations] =
    React.useState<EnergyRecommendation[]>(initialRecommendations);
  const [telemetry, setTelemetry] = React.useState<EnergyReading[]>(initialTelemetry);
  const [events, setEvents] = React.useState<EnergyEventRecord[]>(initialEvents);
  const [lastUpdated, setLastUpdated] = React.useState<string>(
    initialMetrics.lastTelemetryTimestamp
  );
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [newMetrics, newAppliances, newRecommendations, newTelemetry, newEvents] =
        await Promise.all([
          energyService.getDashboardMetrics(),
          applianceService.getAppliances(),
          recommendationService.getRecommendations(),
          energyService.getTelemetryHistory(24),
          auditService.getEvents(10),
        ]);

      setMetrics(newMetrics);
      setAppliances(newAppliances);
      setRecommendations(newRecommendations);
      setTelemetry(newTelemetry);
      setEvents(newEvents);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error("Failed to refresh simulated telemetry:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const pendingRecommendationsCount = recommendations.filter(
    (r) => r.status === "pending"
  ).length;

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* 1. Dashboard Header */}
        <DashboardHeader
          site={metrics.site}
          grid={metrics.grid}
          lastUpdated={lastUpdated}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* 2. Key Metric Cards */}
        <MetricCardsRow metrics={metrics} />

        {/* 3. Power Source Overview */}
        <PowerSourcesOverview
          grid={metrics.grid}
          solar={metrics.solar}
          battery={metrics.battery}
          generator={metrics.generator}
          totalLoadKw={metrics.telemetry.currentLoadKw}
        />

        {/* 4. Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Energy Usage Chart & Equipment Status */}
          <div className="lg:col-span-8 space-y-6">
            <EnergyUsageChart telemetry={telemetry} />
            <EquipmentStatusTable appliances={appliances} />
          </div>

          {/* Right Column (4 cols): AI Recommendation & Active Alerts */}
          <div className="lg:col-span-4 space-y-6">
            {recommendations.length > 0 && (
              <CurrentRecommendationCard
                initialRecommendation={recommendations[0]}
                totalPendingCount={pendingRecommendationsCount}
              />
            )}
            <ActiveAlertsCard initialAlerts={events} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
