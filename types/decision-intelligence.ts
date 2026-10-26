/**
 * GridMind Decision Intelligence & Agent Workflow Types
 * Centralized contracts for operational risk, before-and-after strategy comparisons,
 * scenario presets, and explainable agent pipeline states.
 */

import {
  Appliance,
  EnergyRecommendation,
  EnergySourceType,
  RecommendationStatus,
  RecommendationUrgency,
} from "./energy";

export type OperationalRiskLevel =
  | "normal"
  | "elevated"
  | "critical"
  | "insufficient_data";

export interface OperationalRiskSummary {
  level: OperationalRiskLevel;
  score: number; // 0 - 100 (0 = safe, 100 = emergency failure)
  title: string;
  description: string;
  primaryRiskFactors: string[];
  recommendedAction: string;
  dataQualityIssues: string[];
  criticalLoadsProtectedCount: number;
  totalCriticalLoadsCount: number;
  evaluatedAt: string;
}

export interface StrategyPerformanceMetrics {
  strategyName: string;
  hourlyCostNgn: number;
  backupRuntimeHours: number | null;
  runtimeDisplayString: string;
  dieselFuelBurnRateLph: number;
  activeLoadKw: number;
  criticalLoadStatus: "protected" | "at_risk" | "compromised";
  assumptions: string[];
}

export interface StrategyComparison {
  baseline: StrategyPerformanceMetrics;
  proposed: StrategyPerformanceMetrics;
  costDeltaNgnPerHour: number;
  costReductionPercentage: number; // 0 if baseline is 0
  runtimeGainHours: number;
  criticalCoverageMaintained: boolean;
  verdictSummary: string;
}

export type PipelineStageStatus =
  | "ready"
  | "processing"
  | "completed"
  | "needs_attention"
  | "blocked";

export interface PipelineStageItem {
  name: string;
  status: PipelineStageStatus;
  label: string;
  summary: string;
  provenance: "simulated" | "backend" | "missing" | "stale";
  details: Record<string, string | number | boolean>;
  timestamp: string;
}

export interface AgentWorkflowPipeline {
  overallStatus: PipelineStageStatus;
  statusMessage: string;
  telemetryStage: PipelineStageItem;
  forecastStage: PipelineStageItem;
  decisionStage: PipelineStageItem;
  recommendationStage: PipelineStageItem;
  humanApprovalStage: PipelineStageItem;
  lastEvaluatedAt: string;
}

export interface ScenarioPreset {
  id: string;
  name: string;
  shortDescription: string;
  narrative: string;
  tags: string[];
  params: {
    gridAvailable: boolean;
    batterySocPct: number;
    solarEnabled: boolean;
    solarGenerationKw: number;
    generatorMode: "standby" | "running" | "disabled" | "out_of_fuel";
    batteryReserveFloorPct: number;
    batteryTotalCapacityKwh: number;
  };
  applianceOverrides?: {
    id: string;
    state: "running" | "standby" | "curtailed" | "off";
  }[];
}
