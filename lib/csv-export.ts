/**
 * GridMind Client-Side CSV Export Utility
 * 
 * Generates verified, RFC 4180 compliant CSV exports for operational audit logs,
 * baseline comparisons, and 24-hour microgrid dispatch analytics.
 * Executes fully client-side using browser Blob and ObjectURL APIs.
 */

import { AnalyticsSummary } from "./analytics-engine";
import { ApprovalRecord, EnergyEventRecord } from "@/types/energy";

function escapeCsvField(field: unknown): string {
  if (field === null || field === undefined) return '""';
  const stringValue = String(field).replace(/"/g, '""');
  return `"${stringValue}"`;
}

function downloadCsvBlob(filename: string, csvContent: string): void {
  if (typeof window === "undefined") return;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.setAttribute("href", url);
  anchor.setAttribute("download", filename);
  anchor.style.visibility = "hidden";

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Export 24-Hour Analytics & Baseline Comparison to CSV
 */
export function exportAnalyticsToCsv(
  summary: AnalyticsSummary,
  siteName: string = "Krystal Ice Cold Storage Ltd."
): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `gridmind-analytics-${timestamp}.csv`;

  const lines: string[] = [];

  // Metadata Header
  lines.push(escapeCsvField("GRIDMIND ENERGY INTELLIGENCE — 24-HOUR ANALYTICS & BASELINE COMPARISON"));
  lines.push(`Site,${escapeCsvField(siteName)}`);
  lines.push(`GeneratedAt,${escapeCsvField(new Date().toISOString())}`);
  lines.push(`Scenario,${escapeCsvField(summary.scenarioName)}`);
  lines.push(`OutageHours,${summary.outageHoursCount}`);
  lines.push(`Disclaimer,${escapeCsvField("Deterministic simulation estimates for operational evaluation. Not verified customer billing.")}`);
  lines.push("");

  // Summary Metrics Section
  lines.push(escapeCsvField("KPI SUMMARY COMPARISON"));
  lines.push("Metric,GridMind Strategy,Conventional Baseline,Delta Savings,Units");
  lines.push(`Total Operating Cost,${summary.gridmind.totalCostNgn},${summary.baseline.totalCostNgn},${summary.costSavingsNgn},NGN`);
  lines.push(`Percentage Savings,${summary.costSavingsPct}%,0%,${summary.costSavingsPct}%,%`);
  lines.push(`Generator Runtime,${summary.gridmind.generatorRunHours},${summary.baseline.generatorRunHours},${summary.avoidedGenHours},Hours`);
  lines.push(`Diesel Fuel Burned,${summary.gridmind.generatorFuelLiters},${summary.baseline.generatorFuelLiters},${summary.fuelSavingsLiters},Liters`);
  lines.push(`Critical Cold-Chain Uptime,${summary.gridmind.criticalUptimePct}%,${summary.baseline.criticalUptimePct}%,0%,%`);
  lines.push(`Battery Reserve Violations,${summary.gridmind.reserveViolationsCount},${summary.baseline.reserveViolationsCount},${summary.baseline.reserveViolationsCount - summary.gridmind.reserveViolationsCount},Events`);
  lines.push(`Estimated Carbon Footprint,${summary.gridmind.co2EmissionsKg},${summary.baseline.co2EmissionsKg},${summary.baseline.co2EmissionsKg - summary.gridmind.co2EmissionsKg},kg CO2`);
  lines.push("");

  // 24-Hour Time Series Data
  lines.push(escapeCsvField("24-HOUR HOURLY DISPATCH TELEMETRY"));
  lines.push([
    "Hour",
    "TimeLabel",
    "GridAvailable",
    "TotalDemandKw",
    "CriticalDemandKw",
    "DeferrableDemandKw",
    "GM_GridImportKw",
    "GM_SolarUsedKw",
    "GM_BatteryFlowKw",
    "GM_GeneratorKw",
    "GM_BatterySocPct",
    "GM_HourlyCostNgn",
    "GM_DieselLiters",
    "BL_GridImportKw",
    "BL_GeneratorKw",
    "BL_HourlyCostNgn",
    "BL_DieselLiters",
    "HourlySavingsNgn",
  ].join(","));

  for (const pt of summary.hourlyPoints) {
    const row = [
      pt.hour,
      escapeCsvField(pt.timeLabel),
      pt.gridAvailable ? "TRUE" : "FALSE",
      pt.totalDemandKw,
      pt.criticalDemandKw,
      pt.deferrableDemandKw,
      pt.gridmind.gridImportKw,
      pt.gridmind.solarUsedKw,
      pt.gridmind.batteryDischargeKw > 0 ? pt.gridmind.batteryDischargeKw : -pt.gridmind.batteryChargeKw,
      pt.gridmind.generatorKw,
      pt.gridmind.batterySocPct,
      pt.gridmind.hourlyCostNgn,
      pt.gridmind.dieselLiters,
      pt.baseline.gridImportKw,
      pt.baseline.generatorKw,
      pt.baseline.hourlyCostNgn,
      pt.baseline.dieselLiters,
      pt.hourlySavingsNgn,
    ];
    lines.push(row.join(","));
  }

  downloadCsvBlob(filename, lines.join("\r\n"));
}

/**
 * Export Decision History & Disturbance Log to CSV
 */
export function exportDecisionHistoryToCsv(
  events: EnergyEventRecord[],
  approvalHistory: ApprovalRecord[]
): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `gridmind-decision-history-${timestamp}.csv`;

  const lines: string[] = [];

  // Metadata Header
  lines.push(escapeCsvField("GRIDMIND OPERATIONAL AUDIT TRAIL & DECISION HISTORY"));
  lines.push(`GeneratedAt,${escapeCsvField(new Date().toISOString())}`);
  lines.push(`TotalAuditedDecisions,${approvalHistory.length}`);
  lines.push(`TotalDisturbanceEvents,${events.length}`);
  lines.push(`OriginClassification,${escapeCsvField("Synthetic testbed simulation logs & operator authorization audit trail")}`);
  lines.push("");

  // Consolidated Events Table
  lines.push([
    "Timestamp",
    "RecordId",
    "RecordType",
    "Category",
    "SeverityOrStatus",
    "TargetAssetOrAppliance",
    "TitleOrAction",
    "DetailsOrMemo",
    "PerformedByOrEngine",
    "SavingsRealizedNgn",
    "Origin",
  ].join(","));

  // 1. Approvals
  for (const appr of approvalHistory) {
    const row = [
      escapeCsvField(appr.timestamp),
      escapeCsvField(appr.id),
      escapeCsvField("Operator Decision"),
      escapeCsvField("authorization_policy"),
      escapeCsvField(appr.actionTaken === "approve" ? "AUTHORIZED" : "DECLINED"),
      escapeCsvField(appr.recommendationId),
      escapeCsvField(appr.actionTaken === "approve" ? `Authorized Policy ${appr.recommendationId}` : `Declined Policy ${appr.recommendationId}`),
      escapeCsvField(appr.notes || "Executed by authorized facility operator."),
      escapeCsvField(appr.performedBy),
      appr.savingsRealizedEstimateNgn || 0,
      escapeCsvField("SIMULATED"),
    ];
    lines.push(row.join(","));
  }

  // 2. Events & Disturbances
  for (const evt of events) {
    const row = [
      escapeCsvField(evt.timestamp),
      escapeCsvField(evt.id),
      escapeCsvField("System Disturbance"),
      escapeCsvField(evt.category),
      escapeCsvField(evt.severity.toUpperCase()),
      escapeCsvField(evt.sourceAsset || evt.applianceId || "microgrid_bus"),
      escapeCsvField(evt.title),
      escapeCsvField(evt.details),
      escapeCsvField("GridMind Telemetry Daemon"),
      0,
      escapeCsvField("SIMULATED"),
    ];
    lines.push(row.join(","));
  }

  downloadCsvBlob(filename, lines.join("\r\n"));
}
