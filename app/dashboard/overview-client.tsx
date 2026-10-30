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
  OperationalRiskCard,
} from "@/components/dashboard";
import { AgentPipelineWorkflow } from "@/components/workflow";
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
    riskSummary,
    agentPipeline,
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
      <div className="space-y-5">
        {/* 1. Dashboard Header */}
        <DashboardHeader
          site={activeMetrics.site}
          grid={activeMetrics.grid}
          lastUpdated={lastSimulatedTick}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* Operational Risk Assessment Banner */}
        {riskSummary && (
          <OperationalRiskCard riskSummary={riskSummary} />
        )}

        {/* Essential metrics only */}
        <MetricCardsRow metrics={activeMetrics} />

        {/* The two things an operator needs to act on */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 items-start">
          <div className="lg:col-span-3">
            {activeRecommendations.length > 0 && (
              <CurrentRecommendationCard
                initialRecommendation={activeRecommendations[0]}
                totalPendingCount={pendingRecommendationsCount}
              />
            )}
          </div>
          <div className="lg:col-span-2">
            <ActiveAlertsCard initialAlerts={activeEvents} />
          </div>
        </div>

        {/* Technical information is available without dominating the page */}
        <details className="group rounded-2xl border border-slate-200 bg-white">
          <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-slate-800 flex items-center justify-between">
            <span>System details</span>
            <span className="text-xs font-normal text-slate-500 group-open:hidden">View charts, sources and workflow</span>
            <span className="hidden text-xs font-normal text-slate-500 group-open:inline">Hide details</span>
          </summary>
          <div className="space-y-5 border-t border-slate-100 p-4 sm:p-5">
            <PowerSourcesOverview
              grid={activeMetrics.grid}
              solar={activeMetrics.solar}
              battery={activeMetrics.battery}
              generator={activeMetrics.generator}
              totalLoadKw={activeMetrics.telemetry.currentLoadKw}
            />
            <EnergyUsageChart telemetry={telemetry} />
            <EquipmentStatusTable appliances={activeAppliances} />
            {agentPipeline && <AgentPipelineWorkflow pipeline={agentPipeline} />}
          </div>
        </details>
      </div>
    </PageContainer>
  );
}
