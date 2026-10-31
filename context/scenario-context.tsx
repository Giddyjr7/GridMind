"use client";

import * as React from "react";
import {
  calculateEnergyState,
  EngineInputs,
  EngineOutputs,
  EngineConfig,
  DEFAULT_ENGINE_CONFIG,
  EngineLoadDevice,
  SingleRecommendation,
} from "@/lib/calculation-engine";
import { useWorkspace } from "./workspace-context";
import { getTwinTransport } from "@/lib/twin/transport";
import { siteService } from "@/services/site-service";
import { TelemetryPayload } from "@/lib/twin/schema";

export interface DecisionRecord {
  id: string;
  recommendationId: string;
  title: string;
  category: string;
  actionTaken: "approved" | "rejected";
  timestamp: string;
  actor: string;
  projectedSavingsNgnPerHour: number;
  projectedRuntimeExtensionHours: number;
  systemContext: string;
}

export interface ScenarioContextType {
  inputs: EngineInputs;
  outputs: EngineOutputs;
  config: EngineConfig;
  activePresetId: string | null;
  transportStatus: "simulated" | "digital_twin_connected" | "digital_twin_offline";
  auditTrail: DecisionRecord[];
  
  // Actions
  applyPreset: (presetId: string) => void;
  setGridAvailable: (available: boolean) => void;
  setBatterySoc: (soc: number) => void;
  setSolarOutput: (kw: number) => void;
  setSolarEnabled: (enabled: boolean) => void;
  setGeneratorMode: (mode: "standby" | "running" | "disabled" | "out_of_fuel") => void;
  toggleLoadState: (loadId: string) => void;
  approveRecommendation: (rec: SingleRecommendation) => void;
  rejectRecommendation: (rec: SingleRecommendation) => void;
  updateEngineConfig: (updates: Partial<EngineConfig>) => void;
  resetToDemoDefaults: () => void;
  setTransportStatus: (status: "simulated" | "digital_twin_connected" | "digital_twin_offline") => void;
  setTelemetryOverride: (override: Partial<EngineInputs>) => void;
}

const DEFAULT_LOADS: EngineLoadDevice[] = [
  {
    id: "dev_cold_chain_a",
    name: "Blast Freezer Alpha",
    priority: "critical",
    state: "running",
    ratedPowerKw: 45,
    currentPowerKw: 38.5,
  },
  {
    id: "dev_cold_room_b",
    name: "Cold Room Storage Bay 2",
    priority: "critical",
    state: "running",
    ratedPowerKw: 32,
    currentPowerKw: 26.8,
  },
  {
    id: "dev_ice_maker",
    name: "Industrial Flake Ice Maker",
    priority: "important",
    state: "running",
    ratedPowerKw: 22,
    currentPowerKw: 18.2,
  },
  {
    id: "dev_hvac_office",
    name: "Admin Block HVAC Chiller",
    priority: "deferrable",
    state: "running",
    ratedPowerKw: 14,
    currentPowerKw: 11.5,
  },
  {
    id: "dev_security_lighting",
    name: "Depot Perimeter Security Lights",
    priority: "important",
    state: "running",
    ratedPowerKw: 6,
    currentPowerKw: 5.2,
  },
  {
    id: "dev_water_borehole",
    name: "Main Borehole Booster Pump",
    priority: "deferrable",
    state: "running",
    ratedPowerKw: 8,
    currentPowerKw: 7.0,
  },
];

const INITIAL_INPUTS: EngineInputs = {
  grid: {
    isAvailable: true,
    tariffPerKwh: 206,
    voltageV: 408.2,
    frequencyHz: 49.85,
  },
  solar: {
    installedCapacityKwp: 75,
    currentOutputKw: 38.4,
    isEnabled: true,
  },
  battery: {
    totalCapacityKwh: 120,
    stateOfChargePct: 68,
    reserveFloorPct: 15,
    dischargeLimitKw: 55,
    chargeLimitKw: 40,
    efficiency: 0.92,
  },
  generator: {
    ratedCapacityKw: 128,
    fuelCurrentLiters: 480,
    fuelCostPerLiter: 1250,
    fuelConsumptionRateLitersPerHour: 28.5,
    mode: "standby",
  },
  loads: DEFAULT_LOADS,
  config: DEFAULT_ENGINE_CONFIG,
};

const INITIAL_AUDIT_TRAIL: DecisionRecord[] = [
  {
    id: "dec_init_01",
    recommendationId: "rec_curtail_deferrable",
    title: "Curtail Admin HVAC Chiller During Peak Outage",
    category: "load_shedding",
    actionTaken: "approved",
    timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(),
    actor: "Engr. T. Adeyemi",
    projectedSavingsNgnPerHour: 2369,
    projectedRuntimeExtensionHours: 1.4,
    systemContext: "Grid outage active. Battery was at 42% SoC.",
  },
  {
    id: "dec_init_02",
    recommendationId: "rec_absorb_solar",
    title: "Absorb Afternoon Solar Surplus into LiFePO4 ESS",
    category: "solar_prioritization",
    actionTaken: "approved",
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    actor: "System Auto-Dispatch (Manual Rule)",
    projectedSavingsNgnPerHour: 7910,
    projectedRuntimeExtensionHours: 0,
    systemContext: "Solar generation exceeded site load by 38.4 kW.",
  },
];

const ScenarioContext = React.createContext<ScenarioContextType | null>(null);

export function ScenarioProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useWorkspace();
  const [config, setConfig] = React.useState<EngineConfig>(DEFAULT_ENGINE_CONFIG);
  const [inputs, setInputs] = React.useState<EngineInputs>(INITIAL_INPUTS);
  const [activePresetId, setActivePresetId] = React.useState<string | null>("preset_normal");
  const [transportStatus, setTransportStatus] = React.useState<
    "simulated" | "digital_twin_connected" | "digital_twin_offline"
  >("simulated");
  const [auditTrail, setAuditTrail] = React.useState<DecisionRecord[]>(INITIAL_AUDIT_TRAIL);

  // Connect to digital twin transport layer (MQTT + BroadcastChannel fallback)
  React.useEffect(() => {
    const transport = getTwinTransport();
    const sessionCode =
      typeof window !== "undefined"
        ? localStorage.getItem("gridmind_twin_session") || "GM-DEMO"
        : "GM-DEMO";

    transport.connect(sessionCode);

    const unsubStatus = transport.onStatusChange((status) => {
      setTransportStatus(status);
    });

    const unsubMsg = transport.subscribe(sessionCode, (payload: TelemetryPayload) => {
      setTransportStatus("digital_twin_connected");
      setInputs((prev) => ({
        ...prev,
        grid: {
          ...prev.grid,
          isAvailable: payload.grid.isAvailable,
          tariffPerKwh: payload.grid.tariffPerKwh ?? prev.grid.tariffPerKwh,
        },
        // Telemetry reports readings for assets that exist. It must not create
        // them: the twin publishes its own reference equipment, and letting
        // that replace the inventory put four devices and 95 kW on the
        // dashboard of a site that had registered nothing.
        solar: {
          ...prev.solar,
          ...(prev.solar.installedCapacityKwp > 0 && {
            currentOutputKw: payload.solar.currentOutputKw,
            isEnabled: payload.solar.isEnabled,
          }),
        },
        battery: {
          ...prev.battery,
          ...(prev.battery.totalCapacityKwh > 0 && {
            stateOfChargePct: payload.battery.stateOfChargePct,
          }),
        },
        generator: {
          ...prev.generator,
          ...(prev.generator.mode !== "disabled" && {
            fuelCurrentLiters: payload.generator.fuelCurrentLiters,
            mode: payload.generator.mode,
          }),
        },
        loads: prev.loads.map((load) => {
          const reading = payload.loads?.find((item) => item.id === load.id);
          return reading
            ? { ...load, state: reading.state, currentPowerKw: reading.currentPowerKw }
            : load;
        }),
      }));
    });

    return () => {
      unsubStatus();
      unsubMsg();
    };
  }, []);

  /**
   * The registered site is the single inventory. These loads and source
   * ratings used to come from browser state and a hardcoded fallback, which
   * meant the dashboard could show equipment the backend had never heard of.
   * If the API is unreachable the built-in reference values stay in place.
   */
  React.useEffect(() => {
    let cancelled = false;

    void siteService
      .getRegistration()
      .then((registration) => {
        if (cancelled || !registration.isProvisioned) return;

        setInputs((prev) => ({
          ...prev,
          loads: registration.appliances.map((appliance) => ({
            id: appliance.id,
            name: appliance.name,
            priority: appliance.priority,
            state: appliance.state === "running" ? ("running" as const) : ("curtailed" as const),
            ratedPowerKw: appliance.ratedPowerKw,
            currentPowerKw: appliance.currentPowerKw,
          })),
          ...(registration.sources && {
            grid: { ...prev.grid, tariffPerKwh: registration.sources.gridTariffPerKwhNgn },
            // A source with no declared capacity does not exist, so its runtime
            // values are zeroed too. Leaving the defaults in place produced a
            // state of charge for a battery nobody owns and a dispatch figure
            // for an inverter that was never installed.
            solar: {
              ...prev.solar,
              installedCapacityKwp: registration.sources.solarCapacityKwp,
              isEnabled: registration.sources.solarCapacityKwp > 0 && prev.solar.isEnabled,
              currentOutputKw:
                registration.sources.solarCapacityKwp > 0 ? prev.solar.currentOutputKw : 0,
            },
            battery: {
              ...prev.battery,
              totalCapacityKwh: registration.sources.batteryCapacityKwh,
              reserveFloorPct: registration.sources.batteryReservePct,
              stateOfChargePct:
                registration.sources.batteryCapacityKwh > 0 ? prev.battery.stateOfChargePct : 0,
            },
            generator: {
              ...prev.generator,
              fuelCurrentLiters: registration.sources.generatorFuelLiters,
              fuelCostPerLiter: registration.sources.dieselPricePerLiterNgn,
              mode: registration.sources.generatorCapacityKva > 0 ? prev.generator.mode : "disabled",
            },
          }),
        }));
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  // Recalculate outputs deterministically via pure calculation engine
  const outputs = React.useMemo(() => {
    return calculateEnergyState({
      ...inputs,
      config,
    });
  }, [inputs, config]);

  const applyPreset = React.useCallback((presetId: string) => {
    setActivePresetId(presetId);
    if (presetId === "preset_normal") {
      setInputs((prev) => ({
        ...prev,
        grid: { ...prev.grid, isAvailable: true },
        battery: { ...prev.battery, stateOfChargePct: 75 },
        solar: { ...prev.solar, isEnabled: true, currentOutputKw: 42.0 },
        generator: { ...prev.generator, mode: "standby" },
        loads: prev.loads.map((l) => ({ ...l, state: "running" })),
      }));
    } else if (presetId === "preset_outage_battery") {
      setInputs((prev) => ({
        ...prev,
        grid: { ...prev.grid, isAvailable: false },
        battery: { ...prev.battery, stateOfChargePct: 58 },
        solar: { ...prev.solar, isEnabled: true, currentOutputKw: 28.0 },
        generator: { ...prev.generator, mode: "standby" },
      }));
    } else if (presetId === "preset_critical_floor") {
      setInputs((prev) => ({
        ...prev,
        grid: { ...prev.grid, isAvailable: false },
        battery: { ...prev.battery, stateOfChargePct: 15 },
        solar: { ...prev.solar, isEnabled: true, currentOutputKw: 12.0 },
        generator: { ...prev.generator, mode: "running" },
      }));
    } else if (presetId === "preset_solar_peak") {
      setInputs((prev) => ({
        ...prev,
        grid: { ...prev.grid, isAvailable: true },
        battery: { ...prev.battery, stateOfChargePct: 88 },
        solar: { ...prev.solar, isEnabled: true, currentOutputKw: 68.5 },
        generator: { ...prev.generator, mode: "standby" },
      }));
    }
  }, []);

  const setGridAvailable = React.useCallback((isAvailable: boolean) => {
    setActivePresetId(null);
    setInputs((prev) => ({
      ...prev,
      grid: { ...prev.grid, isAvailable },
    }));
  }, []);

  const setBatterySoc = React.useCallback((stateOfChargePct: number) => {
    setActivePresetId(null);
    setInputs((prev) => ({
      ...prev,
      battery: { ...prev.battery, stateOfChargePct },
    }));
  }, []);

  const setSolarOutput = React.useCallback((currentOutputKw: number) => {
    setActivePresetId(null);
    setInputs((prev) => ({
      ...prev,
      solar: { ...prev.solar, currentOutputKw },
    }));
  }, []);

  const setSolarEnabled = React.useCallback((isEnabled: boolean) => {
    setActivePresetId(null);
    setInputs((prev) => ({
      ...prev,
      solar: { ...prev.solar, isEnabled },
    }));
  }, []);

  const setGeneratorMode = React.useCallback(
    (mode: "standby" | "running" | "disabled" | "out_of_fuel") => {
      setActivePresetId(null);
      setInputs((prev) => ({
        ...prev,
        generator: { ...prev.generator, mode },
      }));
    },
    []
  );

  const toggleLoadState = React.useCallback((loadId: string) => {
    setInputs((prev) => ({
      ...prev,
      loads: prev.loads.map((l) => {
        if (l.id === loadId) {
          const nextState = l.state === "running" ? "curtailed" : "running";
          return { ...l, state: nextState };
        }
        return l;
      }),
    }));
  }, []);

  const approveRecommendation = React.useCallback(
    (rec: SingleRecommendation) => {
      const record: DecisionRecord = {
        id: `dec_${Date.now()}`,
        recommendationId: rec.id,
        title: rec.title,
        category: rec.category,
        actionTaken: "approved",
        timestamp: new Date().toISOString(),
        actor: profile?.displayName || "Operator",
        projectedSavingsNgnPerHour: rec.projectedSavingsNgnPerHour,
        projectedRuntimeExtensionHours: rec.projectedRuntimeExtensionHours,
        systemContext: outputs.riskSummary,
      };

      setAuditTrail((prev) => [record, ...prev]);

      // If curtailment approved, curtail deferrable loads
      if (rec.category === "load_shedding") {
        setInputs((prev) => ({
          ...prev,
          loads: prev.loads.map((l) =>
            l.priority === "deferrable" ? { ...l, state: "curtailed" } : l
          ),
        }));
      } else if (rec.category === "generator_optimization") {
        setInputs((prev) => ({
          ...prev,
          generator: { ...prev.generator, mode: "running" },
        }));
      }
    },
    [profile, outputs.riskSummary]
  );

  const rejectRecommendation = React.useCallback(
    (rec: SingleRecommendation) => {
      const record: DecisionRecord = {
        id: `dec_${Date.now()}`,
        recommendationId: rec.id,
        title: rec.title,
        category: rec.category,
        actionTaken: "rejected",
        timestamp: new Date().toISOString(),
        actor: profile?.displayName || "Operator",
        projectedSavingsNgnPerHour: 0,
        projectedRuntimeExtensionHours: 0,
        systemContext: outputs.riskSummary,
      };

      setAuditTrail((prev) => [record, ...prev]);
    },
    [profile, outputs.riskSummary]
  );

  const updateEngineConfig = React.useCallback((updates: Partial<EngineConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetToDemoDefaults = React.useCallback(() => {
    setConfig(DEFAULT_ENGINE_CONFIG);
    setInputs(INITIAL_INPUTS);
    setActivePresetId("preset_normal");
    setTransportStatus("simulated");
  }, []);

  const setTelemetryOverride = React.useCallback((override: Partial<EngineInputs>) => {
    setInputs((prev) => ({
      ...prev,
      ...override,
    }));
  }, []);

  const value = React.useMemo(
    () => ({
      inputs,
      outputs,
      config,
      activePresetId,
      transportStatus,
      auditTrail,
      applyPreset,
      setGridAvailable,
      setBatterySoc,
      setSolarOutput,
      setSolarEnabled,
      setGeneratorMode,
      toggleLoadState,
      approveRecommendation,
      rejectRecommendation,
      updateEngineConfig,
      resetToDemoDefaults,
      setTransportStatus,
      setTelemetryOverride,
    }),
    [
      inputs,
      outputs,
      config,
      activePresetId,
      transportStatus,
      auditTrail,
      applyPreset,
      setGridAvailable,
      setBatterySoc,
      setSolarOutput,
      setSolarEnabled,
      setGeneratorMode,
      toggleLoadState,
      approveRecommendation,
      rejectRecommendation,
      updateEngineConfig,
      resetToDemoDefaults,
      setTransportStatus,
      setTelemetryOverride,
    ]
  );

  return <ScenarioContext.Provider value={value}>{children}</ScenarioContext.Provider>;
}

export function useScenario() {
  const ctx = React.useContext(ScenarioContext);
  if (!ctx) {
    throw new Error("useScenario must be used within a ScenarioProvider");
  }
  return ctx;
}
