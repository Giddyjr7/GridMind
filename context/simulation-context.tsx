"use client";

import * as React from "react";
import {
  Appliance,
  ApplianceState,
  ApprovalRecord,
  DashboardMetrics,
  EnergyEventRecord,
  EnergyRecommendation,
  DeviceCommand,
  DeviceGatewayStatus,
} from "@/types/energy";
import { envConfig } from "@/config/env";
import {
  applianceService,
  auditService,
  deviceService,
  energyService,
  recommendationService,
} from "@/services";
import {
  OperationalRiskSummary,
  StrategyComparison,
  AgentWorkflowPipeline,
  ScenarioPreset,
} from "@/types/decision-intelligence";
import {
  MOCK_APPLIANCES,
  MOCK_RECOMMENDATIONS,
  MOCK_APPROVAL_HISTORY,
  MOCK_ENERGY_EVENTS,
  MOCK_SITE_PROFILE,
  MOCK_GRID_SOURCE,
  MOCK_SOLAR_SOURCE,
  MOCK_BATTERY_STATUS,
  MOCK_GENERATOR_SOURCE,
  MOCK_COST_BREAKDOWN,
  MOCK_DASHBOARD_METRICS,
} from "@/mocks/demo-business";
import {
  SimulationParams,
  DEFAULT_SIMULATION_PARAMS,
  EnergyDispatchFlows,
  computeSimulationDispatch,
} from "@/lib/simulation-engine";
import {
  evaluateOperationalRisk,
  evaluateDynamicRecommendations,
  computeStrategyComparison,
  evaluateAgentPipeline,
  SCENARIO_PRESETS,
} from "@/lib/decision-engine";

export interface ApplianceWithSimMetadata extends Appliance {
  isManualOverride?: boolean;
  aiSuggestedState?: ApplianceState;
}

export interface SimulationContextValue {
  params: SimulationParams;
  appliances: ApplianceWithSimMetadata[];
  flows: EnergyDispatchFlows;
  events: EnergyEventRecord[];
  recommendations: EnergyRecommendation[];
  activeRecommendation: EnergyRecommendation;
  approvalHistory: ApprovalRecord[];
  deviceCommands: DeviceCommand[];
  gatewayStatus: DeviceGatewayStatus | null;
  backendConnectionError: string | null;
  isSimulating: boolean;
  lastSimulatedTick: string;
  feedbackMessage: string | null;

  // Intelligence additions (Feature 1, 2, 3, 4, 5)
  riskSummary: OperationalRiskSummary;
  strategyComparison: StrategyComparison;
  agentPipeline: AgentWorkflowPipeline;
  activePresetId: string | null;
  loadScenarioPreset: (presetId: string) => void;
  setBatteryCapacityKwh: (capacityKwh: number) => void;
  setBatteryReserveFloorPct: (floorPct: number) => void;

  // Working simulator actions
  triggerGridOutage: () => void;
  restoreGrid: () => void;
  setBatterySoc: (socPct: number) => void;
  setSolarEnabled: (enabled: boolean) => void;
  setSolarGenerationKw: (kw: number) => void;
  setGeneratorMode: (mode: SimulationParams["generatorMode"]) => void;
  setApplianceState: (id: string, state: ApplianceState, isManual?: boolean) => void;
  setAppliancePower: (id: string, powerKw: number) => void;
  updateAppliance: (id: string, updates: Partial<Appliance>) => void;
  updateSourceConfig: (
    source: "grid" | "solar" | "battery" | "generator",
    updates: Partial<SimulationParams>
  ) => void;
  applyAiRecommendation: (recId: string) => void;
  approveRecommendation: (id: string, notes?: string) => void;
  rejectRecommendation: (id: string, reason?: string) => void;
  dismissRecommendation: (id: string) => void;
  cancelDeviceCommand: (id: string) => void;
  toggleSimulationRunning: () => void;
  stepSimulationHour: () => void;
  resetToDefaultScenario: () => void;
  addEvent: (event: Partial<EnergyEventRecord>) => void;
  clearFeedback: () => void;

  // Unified derived dashboard metrics for cross-page consistency
  derivedDashboardMetrics: DashboardMetrics;
}

const SimulationContext = React.createContext<SimulationContextValue | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [params, setParams] = React.useState<SimulationParams>(DEFAULT_SIMULATION_PARAMS);
  const [appliances, setAppliances] = React.useState<ApplianceWithSimMetadata[]>(() =>
    MOCK_APPLIANCES.map((app) => ({
      ...app,
      isManualOverride: false,
      aiSuggestedState:
        app.id === "app_admin_ac"
          ? "curtailed"
          : app.id === "app_ac_packaging" && !DEFAULT_SIMULATION_PARAMS.gridAvailable
          ? "curtailed"
          : "running",
    }))
  );
  const [events, setEvents] = React.useState<EnergyEventRecord[]>(MOCK_ENERGY_EVENTS);
  const [recommendations, setRecommendations] =
    React.useState<EnergyRecommendation[]>(MOCK_RECOMMENDATIONS);
  const [approvalHistory, setApprovalHistory] =
    React.useState<ApprovalRecord[]>(MOCK_APPROVAL_HISTORY);
  const [deviceCommands, setDeviceCommands] = React.useState<DeviceCommand[]>([]);
  const [gatewayStatus, setGatewayStatus] = React.useState<DeviceGatewayStatus | null>(null);
  const [backendConnectionError, setBackendConnectionError] = React.useState<string | null>(null);
  const [isSimulating, setIsSimulating] = React.useState<boolean>(false);
  const [lastSimulatedTick, setLastSimulatedTick] = React.useState<string>(
    MOCK_DASHBOARD_METRICS.lastTelemetryTimestamp
  );
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);
  const [activePresetId, setActivePresetId] = React.useState<string | null>("preset_normal");

  const clearFeedback = React.useCallback(() => {
    setFeedbackMessage(null);
  }, []);

  const notifyFeedback = (msg: string) => {
    setFeedbackMessage(msg);
  };

  const refreshBackendState = React.useCallback(async () => {
    if (!envConfig.isApi) return;
    const [backendDashboard, backendRecommendations, backendAppliances, backendApprovals, backendEvents, gateway, commands] =
      await Promise.all([
        energyService.getDashboardMetrics(),
        recommendationService.getRecommendations(),
        applianceService.getAppliances(),
        recommendationService.getApprovalHistory(),
        auditService.getEvents(100),
        deviceService.getGatewayStatus(),
        deviceService.getCommands(),
      ]);
    setRecommendations(backendRecommendations);
    setAppliances(backendAppliances.map((app) => ({ ...app, isManualOverride: false })));
    setApprovalHistory(backendApprovals);
    setEvents(backendEvents);
    setGatewayStatus(gateway);
    setDeviceCommands(commands);
    setParams((current) => ({
      ...current,
      gridAvailable: backendDashboard.telemetry.gridOnline,
      solarGenerationKw: backendDashboard.telemetry.solarGenerationKw,
      batterySocPct: backendDashboard.telemetry.batterySocPct,
      generatorMode: backendDashboard.telemetry.generatorOnline ? "running" : "standby",
    }));
    setLastSimulatedTick(backendDashboard.lastTelemetryTimestamp);
    setBackendConnectionError(null);
  }, []);

  React.useEffect(() => {
    if (!envConfig.isApi) return;
    let active = true;
    const synchronize = async () => {
      try {
        await recommendationService.evaluate({
          gridAvailable: DEFAULT_SIMULATION_PARAMS.gridAvailable,
          batterySocPct: DEFAULT_SIMULATION_PARAMS.batterySocPct,
          solarGenerationKw: DEFAULT_SIMULATION_PARAMS.solarGenerationKw,
        });
        if (active) await refreshBackendState();
      } catch (error) {
        if (active) setBackendConnectionError(error instanceof Error ? error.message : "Backend synchronization failed.");
      }
    };
    void synchronize();
    const interval = window.setInterval(() => {
      void refreshBackendState().catch((error: unknown) => {
        if (active) setBackendConnectionError(error instanceof Error ? error.message : "Backend synchronization failed.");
      });
    }, envConfig.refreshIntervalMs);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [refreshBackendState]);

  const addEvent = React.useCallback((evt: Partial<EnergyEventRecord>) => {
    const newRecord: EnergyEventRecord = {
      id: `evt_sim_${Date.now()}`,
      siteId: "site_krystal_ikeja_01",
      timestamp: new Date().toISOString(),
      category: evt.category || "grid_event",
      severity: evt.severity || "info",
      title: evt.title || "[SIMULATED] System Status Change",
      details: evt.details || "Telemetry update logged in simulation runtime.",
      sourceAsset: evt.sourceAsset,
      applianceId: evt.applianceId,
      resolved: evt.resolved ?? false,
      resolvedAt: evt.resolvedAt,
    };
    setEvents((prev) => [newRecord, ...prev]);
  }, []);

  // 1. Compute deterministic flows in real-time
  const flows = React.useMemo(() => {
    return computeSimulationDispatch(appliances, params);
  }, [appliances, params]);

  // 2. Dynamically re-evaluate explainable recommendations
  const dynamicRecommendations = React.useMemo(() => {
    return envConfig.isApi
      ? recommendations
      : evaluateDynamicRecommendations(params, flows, appliances, recommendations);
  }, [params, flows, appliances, recommendations]);

  // Primary recommendation that drives dashboard & agent pipeline
  const activeRecommendation = React.useMemo(() => {
    const pending = dynamicRecommendations.find((r) => r.status === "pending");
    return pending || dynamicRecommendations[0];
  }, [dynamicRecommendations]);

  // 3. Operational Risk Summary
  const riskSummary = React.useMemo(() => {
    return evaluateOperationalRisk(params, flows, appliances);
  }, [params, flows, appliances]);

  // 4. Before-and-After Strategy Performance Benchmark
  const strategyComparison = React.useMemo(() => {
    return computeStrategyComparison(params, flows, appliances, activeRecommendation);
  }, [params, flows, appliances, activeRecommendation]);

  // 5. Visible 5-Stage Agent Pipeline
  const agentPipeline = React.useMemo(() => {
    return evaluateAgentPipeline(params, flows, appliances, activeRecommendation, approvalHistory);
  }, [params, flows, appliances, activeRecommendation, approvalHistory]);

  // Actions
  const triggerGridOutage = React.useCallback(() => {
    setParams((p) => ({ ...p, gridAvailable: false }));
    setActivePresetId(null);
    addEvent({
      category: "grid_event",
      severity: "critical",
      title: "[SIMULATED] 11kV Feeder Outage Triggered",
      details: "National grid voltage dropped to 0V. Microgrid islanded to Solar PV + LiFePO4 battery bank.",
      sourceAsset: "grid",
      resolved: false,
    });
    notifyFeedback("Grid outage triggered! Islanded to Solar PV and Battery.");
  }, [addEvent]);

  const restoreGrid = React.useCallback(() => {
    setParams((p) => ({ ...p, gridAvailable: true }));
    setActivePresetId("preset_normal");
    addEvent({
      category: "grid_event",
      severity: "info",
      title: "[SIMULATED] National Grid Feeder Restored",
      details: "Ikeja 11kV utility supply synchronized (402V, 50.0 Hz). Band A tariff active.",
      sourceAsset: "grid",
      resolved: true,
      resolvedAt: new Date().toISOString(),
    });
    notifyFeedback("National Grid power restored. Feeder synchronized.");
  }, [addEvent]);

  const setBatterySoc = React.useCallback((socPct: number) => {
    const bounded = Math.max(0, Math.min(100, Math.round(socPct)));
    setParams((p) => ({ ...p, batterySocPct: bounded }));
    setActivePresetId(null);
    addEvent({
      category: "battery_event",
      severity: bounded <= 20 ? "warning" : "info",
      title: `[SIMULATED] Battery SOC Set to ${bounded}%`,
      details: `Battery capacity adjusted to ${bounded}%. Usable reserve updated.`,
      sourceAsset: "battery",
      resolved: bounded > 20,
    });
    notifyFeedback(`Battery SOC adjusted to ${bounded}%.`);
  }, [addEvent]);

  const setBatteryCapacityKwh = React.useCallback((capacityKwh: number) => {
    const bounded = Math.max(10, Math.min(500, Math.round(capacityKwh)));
    setParams((p) => ({ ...p, batteryTotalCapacityKwh: bounded }));
    setActivePresetId(null);
    notifyFeedback(`Battery capacity adjusted to ${bounded} kWh.`);
  }, []);

  const setBatteryReserveFloorPct = React.useCallback((floorPct: number) => {
    const bounded = Math.max(10, Math.min(50, Math.round(floorPct)));
    setParams((p) => ({ ...p, batteryReserveFloorPct: bounded }));
    setActivePresetId(null);
    notifyFeedback(`Battery reserve floor set to ${bounded}%.`);
  }, []);

  const setSolarEnabled = React.useCallback((enabled: boolean) => {
    setParams((p) => ({ ...p, solarEnabled: enabled }));
    setActivePresetId(null);
    addEvent({
      category: "ai_recommendation",
      severity: "info",
      title: `[SIMULATED] Solar PV Array ${enabled ? "Enabled" : "Offline"}`,
      details: enabled
        ? "Solar generation enabled at current irradiance."
        : "Solar generation disconnected or night condition simulated.",
      sourceAsset: "solar",
      resolved: true,
    });
    notifyFeedback(enabled ? "Solar PV generation enabled." : "Solar PV disconnected (0 kW).");
  }, [addEvent]);

  const setSolarGenerationKw = React.useCallback((kw: number) => {
    const bounded = Math.max(0, Math.min(75, Math.round(kw * 10) / 10));
    setParams((p) => ({ ...p, solarGenerationKw: bounded, solarEnabled: bounded > 0 }));
    setActivePresetId(null);
    notifyFeedback(`Solar generation set to ${bounded} kW.`);
  }, []);

  const setGeneratorMode = React.useCallback((mode: SimulationParams["generatorMode"]) => {
    setParams((p) => ({ ...p, generatorMode: mode }));
    setActivePresetId(null);
    addEvent({
      category: "generator_event",
      severity: mode === "running" ? "warning" : "info",
      title: `[SIMULATED] Generator Mode: ${mode.toUpperCase()}`,
      details: `Cummins 160kVA generator transitioned to ${mode} mode.`,
      sourceAsset: "generator",
      resolved: true,
    });
    notifyFeedback(`Generator mode switched to ${mode}.`);
  }, [addEvent]);

  const setApplianceState = React.useCallback((
    id: string,
    state: ApplianceState,
    isManual: boolean = true
  ) => {
    if (envConfig.isApi) {
      void applianceService
        .updateApplianceState(id, state)
        .then(async (updated) => {
          await refreshBackendState();
          notifyFeedback(`${updated.name} set to ${state}.`);
        })
        .catch((error: unknown) => {
          setBackendConnectionError(error instanceof Error ? error.message : "Equipment command failed.");
        });
      return;
    }
    setAppliances((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        const currentPowerKw =
          state === "curtailed" || state === "off"
            ? 0
            : state === "standby"
            ? Math.round(app.ratedPowerKw * 0.1 * 10) / 10
            : Math.round(app.ratedPowerKw * 0.9 * 10) / 10;

        return {
          ...app,
          state,
          currentPowerKw,
          isManualOverride: isManual,
        };
      })
    );

    const target = appliances.find((a) => a.id === id);
    if (target) {
      addEvent({
        category: "appliance_state",
        severity: "info",
        title: `[SIMULATED] ${target.name} set to ${state.toUpperCase()}`,
        details: `${isManual ? "Manual operator override" : "Automated policy"}: ${target.name} now ${state}.`,
        applianceId: id,
        resolved: true,
      });
      notifyFeedback(`${target.name} set to ${state}.`);
    }
  }, [appliances, addEvent, refreshBackendState]);

  const setAppliancePower = React.useCallback((id: string, powerKw: number) => {
    const bounded = Math.max(0, Math.round(powerKw * 10) / 10);
    setAppliances((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              currentPowerKw: bounded,
              state: bounded > 0 ? "running" : "curtailed",
              isManualOverride: true,
            }
          : app
      )
    );
  }, []);

  const updateAppliance = React.useCallback((id: string, updates: Partial<Appliance>) => {
    let updatedName = "";
    setAppliances((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        updatedName = app.name;
        const newRated = updates.ratedPowerKw ?? app.ratedPowerKw;
        const newCurrent =
          app.state === "running"
            ? Math.round(newRated * 0.9 * 10) / 10
            : app.currentPowerKw;

        return {
          ...app,
          ...updates,
          ratedPowerKw: newRated,
          currentPowerKw: newCurrent,
        };
      })
    );

    addEvent({
      category: "appliance_state",
      severity: "info",
      title: `[CONFIG] ${updatedName || "Appliance"} Parameters Updated`,
      details: `Updated parameters: ${Object.entries(updates)
        .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
        .join(", ")}. Recalculating microgrid load model.`,
      applianceId: id,
      resolved: true,
    });
    notifyFeedback(`Updated ${updatedName || "equipment"} configuration.`);
  }, [addEvent]);

  const updateSourceConfig = React.useCallback((
    source: "grid" | "solar" | "battery" | "generator",
    updates: Partial<SimulationParams>
  ) => {
    setParams((prev) => ({
      ...prev,
      ...updates,
    }));

    addEvent({
      category:
        source === "grid"
          ? "grid_event"
          : source === "battery"
          ? "battery_event"
          : source === "generator"
          ? "generator_event"
          : "ai_recommendation",
      severity: "info",
      title: `[CONFIG] ${source.toUpperCase()} Technical Parameters Updated`,
      details: `Applied technical overrides: ${Object.entries(updates)
        .map(([k, v]) => `${k}=${v}`)
        .join(", ")}. Microgrid dispatch flows recalculated.`,
      sourceAsset: source,
      resolved: true,
    });
    notifyFeedback(`Updated ${source.toUpperCase()} parameters.`);
  }, [addEvent]);

  const loadScenarioPreset = React.useCallback((presetId: string) => {
    const preset = SCENARIO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setActivePresetId(preset.id);
    setParams((prev) => ({
      ...prev,
      ...preset.params,
    }));

    if (preset.applianceOverrides && preset.applianceOverrides.length > 0) {
      setAppliances((prev) =>
        prev.map((app) => {
          const override = preset.applianceOverrides?.find((o) => o.id === app.id);
          if (!override) return app;
          const currentPowerKw =
            override.state === "curtailed" || override.state === "off"
              ? 0
              : override.state === "standby"
              ? Math.round(app.ratedPowerKw * 0.1 * 10) / 10
              : Math.round(app.ratedPowerKw * 0.9 * 10) / 10;
          return {
            ...app,
            state: override.state,
            currentPowerKw,
            isManualOverride: false,
          };
        })
      );
    }

    addEvent({
      category: "ai_recommendation",
      severity: "info",
      title: `[PRESET] Loaded Scenario: ${preset.name}`,
      details: preset.narrative,
      resolved: true,
    });
    notifyFeedback(`Loaded preset: ${preset.name}`);
  }, [addEvent]);

  const approveRecommendation = React.useCallback((
    recId: string,
    notes?: string
  ) => {
    const rec = dynamicRecommendations.find((r) => r.id === recId) || recommendations.find((r) => r.id === recId);
    if (!rec) return;

    if (rec.status === "approved") {
      notifyFeedback(`Recommendation "${rec.title}" has already been approved.`);
      return;
    }

    if (envConfig.isApi) {
      void recommendationService
        .approveRecommendation(recId, "Operations Lead", notes)
        .then(async (approval) => {
          await refreshBackendState();
          notifyFeedback(
            approval.deviceCommandId
              ? `Approved and acknowledged by the digital-twin gateway (${approval.deviceCommandId}).`
              : `Approved: "${rec.title}"`,
          );
        })
        .catch((error: unknown) => {
          notifyFeedback(error instanceof Error ? error.message : "Approval failed.");
        });
      return;
    }

    // 1. Apply explicit simulated state changes
    if (rec.actionType === "curtail_deferrable" && rec.targetApplianceId) {
      setApplianceState(rec.targetApplianceId, "curtailed", false);
    } else if (rec.actionType === "pre_cool_cold_room" && rec.targetApplianceId) {
      setAppliances((prev) =>
        prev.map((app) =>
          app.id === rec.targetApplianceId
            ? {
                ...app,
                state: "running",
                currentPowerKw: Math.min(app.ratedPowerKw, 38.0),
                isManualOverride: false,
                notes: "Pre-cooling active via surplus solar PV buffer",
              }
            : app
        )
      );
    } else if (rec.actionType === "delay_generator_start") {
      setParams((p) => ({ ...p, generatorMode: "running" }));
    }

    const appliedTimestamp = new Date().toISOString();

    // 2. Update recommendation status
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === recId
          ? { ...r, status: "approved", appliedAt: appliedTimestamp }
          : r
      )
    );

    // 3. Record in approval audit history
    const approvalRecord: ApprovalRecord = {
      id: `appr_${Date.now()}`,
      recommendationId: recId,
      actionTaken: "approve",
      performedBy: "Operations Lead (Simulated)",
      timestamp: appliedTimestamp,
      notes: notes || "Approved by facility operator from decision queue.",
      savingsRealizedEstimateNgn: rec.estimatedSavingsNgn,
    };
    setApprovalHistory((prev) => [approvalRecord, ...prev]);

    // 4. Log event
    addEvent({
      category: "ai_recommendation",
      severity: "info",
      title: `[APPROVED] ${rec.title}`,
      details: `Operator approved recommendation. ${notes ? `Note: "${notes}". ` : ""}${rec.suggestedAction}`,
      sourceAsset: rec.affectedSources?.[0],
      applianceId: rec.targetApplianceId,
      resolved: true,
      resolvedAt: appliedTimestamp,
    });

    notifyFeedback(`Approved: "${rec.title}"`);
  }, [dynamicRecommendations, recommendations, setApplianceState, addEvent, refreshBackendState]);

  const rejectRecommendation = React.useCallback((
    recId: string,
    reason?: string
  ) => {
    const rec = dynamicRecommendations.find((r) => r.id === recId) || recommendations.find((r) => r.id === recId);
    if (!rec) return;

    if (rec.status === "rejected") {
      notifyFeedback(`Recommendation "${rec.title}" has already been rejected.`);
      return;
    }

    if (envConfig.isApi) {
      void recommendationService
        .rejectRecommendation(recId, "Operations Lead", reason)
        .then(async () => {
          await refreshBackendState();
          notifyFeedback(`Declined: "${rec.title}"`);
        })
        .catch((error: unknown) => {
          notifyFeedback(error instanceof Error ? error.message : "Decline failed.");
        });
      return;
    }

    const rejectedTimestamp = new Date().toISOString();

    // 1. Update recommendation status (system state remains unchanged!)
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === recId
          ? {
              ...r,
              status: "rejected",
              rejectionReason: reason || "Operator manually declined action.",
            }
          : r
      )
    );

    // 2. Record in approval audit history
    const rejectRecord: ApprovalRecord = {
      id: `appr_${Date.now()}`,
      recommendationId: recId,
      actionTaken: "reject",
      performedBy: "Operations Lead (Simulated)",
      timestamp: rejectedTimestamp,
      notes: reason || "Declined by operator; system state unchanged.",
    };
    setApprovalHistory((prev) => [rejectRecord, ...prev]);

    // 3. Log event
    addEvent({
      category: "ai_recommendation",
      severity: "info",
      title: `[DECLINED] ${rec.title}`,
      details: `Operator declined recommendation. Rationale: ${reason || "Declined without notes"}. System physical dispatch state preserved unchanged.`,
      sourceAsset: rec.affectedSources?.[0],
      applianceId: rec.targetApplianceId,
      resolved: true,
    });

    notifyFeedback(`Declined: "${rec.title}"`);
  }, [dynamicRecommendations, recommendations, addEvent, refreshBackendState]);

  const dismissRecommendation = React.useCallback((recId: string) => {
    if (envConfig.isApi) {
      void recommendationService
        .dismissRecommendation(recId)
        .then(async () => {
          await refreshBackendState();
          notifyFeedback("Recommendation dismissed from active queue.");
        })
        .catch((error: unknown) => {
          notifyFeedback(error instanceof Error ? error.message : "Dismissal failed.");
        });
      return;
    }
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === recId ? { ...r, status: "expired" } : r
      )
    );
    notifyFeedback("Recommendation dismissed from active queue.");
  }, [refreshBackendState]);

  const cancelDeviceCommand = React.useCallback((commandId: string) => {
    void deviceService
      .cancelCommand(commandId, "Operations Lead")
      .then(async () => {
        await refreshBackendState();
        notifyFeedback("Device command cancelled and the original setpoint was restored.");
      })
      .catch((error: unknown) => {
        setBackendConnectionError(error instanceof Error ? error.message : "Command cancellation failed.");
      });
  }, [refreshBackendState]);

  const applyAiRecommendation = approveRecommendation;

  const toggleSimulationRunning = React.useCallback(() => {
    setIsSimulating((prev) => !prev);
    notifyFeedback(!isSimulating ? "Simulation ticker started." : "Simulation paused.");
  }, [isSimulating]);

  const stepSimulationHour = React.useCallback(() => {
    setParams((p) => {
      let nextSoc = p.batterySocPct;
      if (!p.gridAvailable && flows.batteryContributionKw > 0) {
        // Discharging by (kW * 1 hr / totalCapacityKwh) * 100
        const dischargePct = Math.round((flows.batteryContributionKw / (p.batteryTotalCapacityKwh || 120)) * 100);
        nextSoc = Math.max(p.batteryReserveFloorPct, nextSoc - dischargePct);
      } else if (p.gridAvailable && flows.batteryContributionKw < 0) {
        // Charging by solar excess
        const chargePct = Math.round((Math.abs(flows.batteryContributionKw) / (p.batteryTotalCapacityKwh || 120)) * 100);
        nextSoc = Math.min(100, nextSoc + chargePct);
      }
      return { ...p, batterySocPct: nextSoc };
    });
    setLastSimulatedTick(new Date().toISOString());
    notifyFeedback("Stepped simulation forward 1 hour.");
  }, [flows.batteryContributionKw]);

  const resetToDefaultScenario = React.useCallback(() => {
    setParams(DEFAULT_SIMULATION_PARAMS);
    setActivePresetId("preset_normal");
    setAppliances(
      MOCK_APPLIANCES.map((app) => ({
        ...app,
        isManualOverride: false,
        aiSuggestedState:
          app.id === "app_admin_ac"
            ? "curtailed"
            : "running",
      }))
    );
    setRecommendations(MOCK_RECOMMENDATIONS);
    setIsSimulating(false);
    setLastSimulatedTick(MOCK_DASHBOARD_METRICS.lastTelemetryTimestamp);
    addEvent({
      category: "system_security",
      severity: "info",
      title: "[SIMULATED] Simulation Scenario Reset",
      details: "Restored baseline benchmark: Grid connected, 68% battery SOC, 48kW Solar, default appliances.",
      resolved: true,
    });
    notifyFeedback("Reset scenario to initial demo baseline.");
  }, [addEvent]);

  // Derived dashboard metrics synchronized across all pages
  const derivedDashboardMetrics: DashboardMetrics = React.useMemo(() => {
    return {
      site: MOCK_SITE_PROFILE,
      telemetry: {
        currentLoadKw: flows.totalActiveDemandKw,
        gridImportKw: flows.gridContributionKw,
        solarGenerationKw: flows.solarContributionKw,
        batteryFlowKw: flows.batteryContributionKw,
        generatorOutputKw: flows.generatorContributionKw,
        batterySocPct: params.batterySocPct,
        primaryActiveSource: params.gridAvailable
          ? "grid"
          : flows.solarContributionKw > 0
          ? "solar"
          : flows.batteryContributionKw > 0
          ? "battery"
          : "generator",
        gridOnline: params.gridAvailable,
        generatorOnline: flows.generatorContributionKw > 0,
      },
      grid: {
        ...MOCK_GRID_SOURCE,
        isAvailable: params.gridAvailable,
        currentPowerKw: flows.gridContributionKw,
        voltageL1: params.gridAvailable ? 230 : 0,
        voltageL2: params.gridAvailable ? 231 : 0,
        voltageL3: params.gridAvailable ? 229 : 0,
        frequencyHz: params.gridAvailable ? 50.0 : 0,
      },
      solar: {
        ...MOCK_SOLAR_SOURCE,
        isAvailable: params.solarEnabled && flows.solarContributionKw > 0,
        currentPowerKw: flows.solarContributionKw,
      },
      battery: {
        ...MOCK_BATTERY_STATUS,
        stateOfChargePct: params.batterySocPct,
        currentStoredKwh: flows.batteryRawStoredKwh,
        usableCapacityKwh: flows.batteryUsableKwh,
        currentPowerKw: flows.batteryContributionKw,
        mode:
          flows.batteryContributionKw > 0
            ? "discharging"
            : flows.batteryContributionKw < 0
            ? "charging"
            : "holding",
        estimatedRemainingRuntimeHours: flows.estimatedBackupRuntimeHours ?? 12.0,
      },
      generator: {
        ...MOCK_GENERATOR_SOURCE,
        isRunning: flows.generatorContributionKw > 0,
        currentPowerKw: flows.generatorContributionKw,
        fuelConsumptionRateLitersPerHour: flows.generatorFuelBurnRateLph,
      },
      cost: {
        ...MOCK_COST_BREAKDOWN,
        todayTotalCost: flows.hourlyOperatingCostNgn * 8, // simulated day projection
      },
      activeAlertsCount: events.filter((e) => !e.resolved).length,
      pendingRecommendationsCount: dynamicRecommendations.filter((r) => r.status === "pending").length,
      lastTelemetryTimestamp: lastSimulatedTick,
    };
  }, [params, flows, events, dynamicRecommendations, lastSimulatedTick]);

  return (
    <SimulationContext.Provider
      value={{
        params,
        appliances,
        flows,
        events,
        recommendations: dynamicRecommendations,
        activeRecommendation,
        approvalHistory,
        deviceCommands,
        gatewayStatus,
        backendConnectionError,
        isSimulating,
        lastSimulatedTick,
        feedbackMessage,
        riskSummary,
        strategyComparison,
        agentPipeline,
        activePresetId,
        loadScenarioPreset,
        setBatteryCapacityKwh,
        setBatteryReserveFloorPct,
        triggerGridOutage,
        restoreGrid,
        setBatterySoc,
        setSolarEnabled,
        setSolarGenerationKw,
        setGeneratorMode,
        setApplianceState,
        setAppliancePower,
        updateAppliance,
        updateSourceConfig,
        applyAiRecommendation,
        approveRecommendation,
        rejectRecommendation,
        dismissRecommendation,
        cancelDeviceCommand,
        toggleSimulationRunning,
        stepSimulationHour,
        resetToDefaultScenario,
        addEvent,
        clearFeedback,
        derivedDashboardMetrics,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = React.useContext(SimulationContext);
  if (!context) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
}
