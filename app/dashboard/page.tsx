import * as React from "react";
import { energyService, applianceService, recommendationService, auditService } from "@/services";
import { OverviewClient } from "./overview-client";

export const metadata = {
  title: "Energy Command Dashboard | GridMind",
  description:
    "Real-time microgrid telemetry, backup runtime forecasting, and critical load protection for commercial refrigeration facilities.",
};

export default async function DashboardPage() {
  // Fetch initial domain telemetry and business state via modular typed services
  const [metrics, appliances, recommendations, telemetry, events] = await Promise.all([
    energyService.getDashboardMetrics(),
    applianceService.getAppliances(),
    recommendationService.getRecommendations(),
    energyService.getTelemetryHistory(24),
    auditService.getEvents(10),
  ]);

  return (
    <OverviewClient
      initialMetrics={metrics}
      initialAppliances={appliances}
      initialRecommendations={recommendations}
      initialTelemetry={telemetry}
      initialEvents={events}
    />
  );
}
