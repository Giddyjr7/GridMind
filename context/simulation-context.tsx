"use client";

import * as React from "react";
import {
  Appliance,
  ApplianceState,
  DashboardMetrics,
  EnergyEventRecord,
  EnergyRecommendation,
} from "@/types/energy";
import {
  MOCK_APPLIANCES,
  MOCK_RECOMMENDATIONS,
  MOCK_ENERGY_EVENTS,
  MOCK_SITE_PROFILE,
  MOCK_GRID_SOURCE,
  MOCK_SOLAR_SOURCE,
  MOCK_BATTERY_STATUS,
  MOCK_GENERATOR_SOURCE,
  MOCK_COST_BREAKDOWN,
} from "@/mocks/demo-business";
import {
  SimulationParams,
  DEFAULT_SIMULATION_PARAMS,
  EnergyDispatchFlows,
  computeSimulationDispatch,
} from "@/lib/simulation-engine";

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
  isSimulating: boolean;
  lastSimulatedTick: string;
  feedbackMessage: string | null;

  // Working simulator actions
  triggerGridOutage: () => void;
  restoreGrid: () => void;
  setBatterySoc: (socPct: number) => void;
  setSolarEnabled: (enabled: boolean) => void;
  setSolarGenerationKw: (kw: number) => void;
  setGeneratorMode: (mode: SimulationParams["generatorMode"]) => void;
  setApplianceState: (id: string, state: ApplianceState, isManual?: boolean) => void;
  setAppliancePower: (id: string, powerKw: number) => void;
  applyAiRecommendation: (recId: string) => void;
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
  const [isSimulating, setIsSimulating] = React.useState<boolean>(false);
  const [lastSimulatedTick, setLastSimulatedTick] = React.useState<string>(
    new Date().toISOString()
  );
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);

  const clearFeedback = React.useCallback(() => {
    setFeedbackMessage(null);
  }, []);

  const notifyFeedback = (msg: string) => {
    setFeedbackMessage(msg);
  };

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

  // Compute deterministic flows in real-time
  const flows = React.useMemo(() => {
    return computeSimulationDispatch(appliances, params);
  }, [appliances, params]);

  // Actions
  const triggerGridOutage = React.useCallback(() => {
    setParams((p) => ({ ...p, gridAvailable: false }));
    addEvent({
      category: "grid_event",
      severity: "critical",
      title: "[SIMULATED] 11kV Feeder Outage Triggered",
      details: "National grid voltage dropped to 0V. Microgrid islanded to Solar PV + LiFePO4 battery bank.",
      sourceAsset: "grid",
      resolved: false,
    });
    notifyFeedback("⚡ Grid outage triggered! Islanded to Solar PV & Battery.");
  }, [addEvent]);

  const restoreGrid = React.useCallback(() => {
    setParams((p) => ({ ...p, gridAvailable: true }));
    addEvent({
      category: "grid_event",
      severity: "info",
      title: "[SIMULATED] National Grid Feeder Restored",
      details: "Ikeja 11kV utility supply synchronized (402V, 50.0 Hz). Band A tariff active.",
      sourceAsset: "grid",
      resolved: true,
      resolvedAt: new Date().toISOString(),
    });
    notifyFeedback("🔌 National Grid power restored. Feeder synchronized.");
  }, [addEvent]);

  const setBatterySoc = React.useCallback((socPct: number) => {
    const bounded = Math.max(0, Math.min(100, Math.round(socPct)));
    setParams((p) => ({ ...p, batterySocPct: bounded }));
    addEvent({
      category: "battery_event",
      severity: bounded <= 20 ? "warning" : "info",
      title: `[SIMULATED] Battery SOC Set to ${bounded}%`,
      details: `Battery capacity adjusted to ${bounded}%. Usable reserve updated.`,
      sourceAsset: "battery",
      resolved: bounded > 20,
    });
    notifyFeedback(`🔋 Battery SOC adjusted to ${bounded}%.`);
  }, [addEvent]);

  const setSolarEnabled = React.useCallback((enabled: boolean) => {
    setParams((p) => ({ ...p, solarEnabled: enabled }));
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
    notifyFeedback(enabled ? "☀️ Solar PV generation enabled." : "🌙 Solar PV disconnected (0 kW).");
  }, [addEvent]);

  const setSolarGenerationKw = React.useCallback((kw: number) => {
    const bounded = Math.max(0, Math.min(75, Math.round(kw * 10) / 10));
    setParams((p) => ({ ...p, solarGenerationKw: bounded, solarEnabled: bounded > 0 }));
    notifyFeedback(`☀️ Solar generation set to ${bounded} kW.`);
  }, []);

  const setGeneratorMode = React.useCallback((mode: SimulationParams["generatorMode"]) => {
    setParams((p) => ({ ...p, generatorMode: mode }));
    addEvent({
      category: "generator_event",
      severity: mode === "running" ? "warning" : "info",
      title: `[SIMULATED] Generator Mode: ${mode.toUpperCase()}`,
      details: `Cummins 160kVA generator transitioned to ${mode} mode.`,
      sourceAsset: "generator",
      resolved: true,
    });
    notifyFeedback(`⚙️ Generator mode switched to ${mode}.`);
  }, [addEvent]);

  const setApplianceState = React.useCallback((
    id: string,
    state: ApplianceState,
    isManual: boolean = true
  ) => {
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
        severity: state === "curtailed" ? "info" : "info",
        title: `[SIMULATED] ${target.name} set to ${state.toUpperCase()}`,
        details: `${isManual ? "Manual operator override" : "Automated policy"}: ${target.name} now ${state}.`,
        applianceId: id,
        resolved: true,
      });
      notifyFeedback(`⚙️ ${target.name} set to ${state}.`);
    }
  }, [appliances, addEvent]);

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

  const applyAiRecommendation = React.useCallback((recId: string) => {
    const rec = recommendations.find((r) => r.id === recId);
    if (!rec) return;

    if (rec.actionType === "curtail_deferrable" && rec.targetApplianceId) {
      setApplianceState(rec.targetApplianceId, "curtailed", false);
    } else if (rec.actionType === "pre_cool_cold_room" && rec.targetApplianceId) {
      // Pre-cool freezer
      setAppliances((prev) =>
        prev.map((app) =>
          app.id === rec.targetApplianceId
            ? {
                ...app,
                state: "running",
                currentPowerKw: Math.min(app.ratedPowerKw, 38.0),
                isManualOverride: false,
              }
            : app
        )
      );
    }

    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === recId
          ? { ...r, status: "approved", appliedAt: new Date().toISOString() }
          : r
      )
    );

    addEvent({
      category: "ai_recommendation",
      severity: "info",
      title: `[SIMULATED] AI Policy Approved: ${rec.title}`,
      details: `Dispatched AI optimization: ${rec.suggestedAction}`,
      resolved: true,
    });
    notifyFeedback(`🤖 AI Recommendation "${rec.title}" applied.`);
  }, [recommendations, setApplianceState, addEvent]);

  const toggleSimulationRunning = React.useCallback(() => {
    setIsSimulating((prev) => !prev);
    notifyFeedback(!isSimulating ? "▶ Simulation ticker started." : "⏸ Simulation paused.");
  }, [isSimulating]);

  const stepSimulationHour = React.useCallback(() => {
    setParams((p) => {
      let nextSoc = p.batterySocPct;
      if (!p.gridAvailable && flows.batteryContributionKw > 0) {
        // Discharging by (kW * 1 hr / totalCapacityKwh) * 100
        const dischargePct = Math.round((flows.batteryContributionKw / 120) * 100);
        nextSoc = Math.max(p.batteryReserveFloorPct, nextSoc - dischargePct);
      } else if (p.gridAvailable && flows.batteryContributionKw < 0) {
        // Charging by solar excess
        const chargePct = Math.round((Math.abs(flows.batteryContributionKw) / 120) * 100);
        nextSoc = Math.min(100, nextSoc + chargePct);
      }
      return { ...p, batterySocPct: nextSoc };
    });
    setLastSimulatedTick(new Date().toISOString());
    notifyFeedback("⏩ Stepped simulation forward 1 hour.");
  }, [flows.batteryContributionKw]);

  const resetToDefaultScenario = React.useCallback(() => {
    setParams(DEFAULT_SIMULATION_PARAMS);
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
    setLastSimulatedTick(new Date().toISOString());
    addEvent({
      category: "system_security",
      severity: "info",
      title: "[SIMULATED] Simulation Scenario Reset",
      details: "Restored baseline benchmark: Grid connected, 68% battery SOC, 48kW Solar, default appliances.",
      resolved: true,
    });
    notifyFeedback("🔄 Reset scenario to initial demo baseline.");
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
      pendingRecommendationsCount: recommendations.filter((r) => r.status === "pending").length,
      lastTelemetryTimestamp: lastSimulatedTick,
    };
  }, [params, flows, events, recommendations, lastSimulatedTick]);

  return (
    <SimulationContext.Provider
      value={{
        params,
        appliances,
        flows,
        events,
        recommendations,
        isSimulating,
        lastSimulatedTick,
        feedbackMessage,
        triggerGridOutage,
        restoreGrid,
        setBatterySoc,
        setSolarEnabled,
        setSolarGenerationKw,
        setGeneratorMode,
        setApplianceState,
        setAppliancePower,
        applyAiRecommendation,
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
