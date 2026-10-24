/**
 * GridMind Deterministic Energy Crisis Simulation Engine
 * Strictly deterministic calculations with transparent physical and financial rules.
 * Handles microgrid power balance, battery runtime, generator fuel consumption,
 * operating costs (NGN), and critical cold storage safeguarding.
 */

import { Appliance, BatteryStatus, GeneratorSource, GridSource, SolarSource } from "@/types/energy";

export interface SimulationParams {
  gridAvailable: boolean;
  batterySocPct: number; // 0 - 100
  solarEnabled: boolean;
  solarGenerationKw: number;
  generatorMode: "standby" | "running" | "disabled" | "out_of_fuel";
  batteryReserveFloorPct: number; // typically 20%
  inverterEfficiencyPct: number; // typically 92%
  fuelCostPerLiterNgn: number; // typically 1,250 NGN/L
  gridTariffPerKwhNgn: number; // typically 206 NGN/kWh (Band A)
  contractedDemandLimitKw?: number;
  solarInstalledCapacityKwp?: number;
  batteryTotalCapacityKwh?: number;
  generatorRatedCapacityKw?: number;
}

export interface EnergyDispatchFlows {
  totalActiveDemandKw: number;
  criticalDemandKw: number;
  importantDemandKw: number;
  deferrableDemandKw: number;
  
  // Power supplied by each source
  solarContributionKw: number;
  gridContributionKw: number;
  batteryContributionKw: number; // positive = discharging, negative = charging
  generatorContributionKw: number;
  unmetDemandKw: number;

  // Battery storage calculations
  batteryUsableKwh: number;
  batteryRawStoredKwh: number;
  batteryReserveKwh: number;
  batteryMaxDischargeKw: number;

  // Runtime and cost
  estimatedBackupRuntimeHours: number | null; // null if infinite/mains online or solar self-sustaining
  runtimeDisplayString: string;
  hourlyOperatingCostNgn: number;
  generatorFuelBurnRateLph: number;

  // Protection health
  criticalLoadsCovered: boolean;
  criticalLoadStatusText: "protected" | "at_risk" | "compromised";
  systemStatusSummary: string;
}

/**
 * Default standard simulation parameters for Krystal Ice Cold Storage Ltd.
 */
export const DEFAULT_SIMULATION_PARAMS: SimulationParams = {
  gridAvailable: true,
  batterySocPct: 68,
  solarEnabled: true,
  solarGenerationKw: 48.0,
  generatorMode: "standby",
  batteryReserveFloorPct: 20,
  inverterEfficiencyPct: 92,
  fuelCostPerLiterNgn: 1250,
  gridTariffPerKwhNgn: 206,
  contractedDemandLimitKw: 150,
  solarInstalledCapacityKwp: 75,
  batteryTotalCapacityKwh: 120,
  generatorRatedCapacityKw: 128,
};

/**
 * Calculate total active demand and breakdown by appliance priority
 */
export function calculateApplianceDemand(appliances: Appliance[]) {
  let totalActive = 0;
  let critical = 0;
  let important = 0;
  let deferrable = 0;

  for (const app of appliances) {
    const isOperating = app.state === "running";
    const demand = isOperating ? app.currentPowerKw : 0;
    
    totalActive += demand;
    if (app.priority === "critical") critical += demand;
    else if (app.priority === "important") important += demand;
    else if (app.priority === "deferrable") deferrable += demand;
  }

  return {
    totalActiveDemandKw: Math.round(totalActive * 10) / 10,
    criticalDemandKw: Math.round(critical * 10) / 10,
    importantDemandKw: Math.round(important * 10) / 10,
    deferrableDemandKw: Math.round(deferrable * 10) / 10,
  };
}

/**
 * Calculate usable battery energy considering reserve floor and conversion losses
 */
export function calculateUsableBatteryEnergy(
  totalCapacityKwh: number,
  socPct: number,
  reserveFloorPct: number = 20,
  inverterEfficiencyPct: number = 92
) {
  const boundedSoc = Math.max(0, Math.min(100, socPct));
  const rawStoredKwh = (boundedSoc / 100) * totalCapacityKwh;
  const reserveFloorKwh = (reserveFloorPct / 100) * totalCapacityKwh;
  
  // Usable energy above reserve floor, adjusted for inverter round-trip conversion efficiency
  const usableKwh = Math.max(
    0,
    (rawStoredKwh - reserveFloorKwh) * (inverterEfficiencyPct / 100)
  );

  return {
    rawStoredKwh: Math.round(rawStoredKwh * 10) / 10,
    reserveFloorKwh: Math.round(reserveFloorKwh * 10) / 10,
    usableKwh: Math.round(usableKwh * 10) / 10,
  };
}

/**
 * Deterministically compute power dispatch flows, battery runtime, and costs
 */
export function computeSimulationDispatch(
  appliances: Appliance[],
  params: SimulationParams,
  batterySpecs = {
    totalCapacityKwh: params.batteryTotalCapacityKwh ?? 120,
    maxDischargeKw: 60,
    maxChargeKw: 40,
  },
  generatorSpecs = {
    ratedCapacityKw: params.generatorRatedCapacityKw ?? 128,
    fuelConsumptionPerKwh: 0.285,
  } // Cummins 160kVA = 128kW @ 0.8pf
): EnergyDispatchFlows {
  const {
    totalActiveDemandKw,
    criticalDemandKw,
    importantDemandKw,
    deferrableDemandKw,
  } = calculateApplianceDemand(appliances);

  const { rawStoredKwh, reserveFloorKwh, usableKwh } = calculateUsableBatteryEnergy(
    batterySpecs.totalCapacityKwh,
    params.batterySocPct,
    params.batteryReserveFloorPct,
    params.inverterEfficiencyPct
  );

  const effectiveSolarKw = params.solarEnabled ? Math.max(0, params.solarGenerationKw) : 0;

  let solarContributionKw = 0;
  let gridContributionKw = 0;
  let batteryContributionKw = 0;
  let generatorContributionKw = 0;
  let unmetDemandKw = 0;
  let generatorFuelBurnRateLph = 0;
  let estimatedBackupRuntimeHours: number | null = null;
  let runtimeDisplayString = "";

  // 1. Solar supplies as much active load as possible first
  solarContributionKw = Math.min(effectiveSolarKw, totalActiveDemandKw);
  let remainingLoadKw = totalActiveDemandKw - solarContributionKw;

  if (params.gridAvailable) {
    // Grid is online: Grid covers whatever remains after solar
    gridContributionKw = remainingLoadKw;
    remainingLoadKw = 0;

    // Solar surplus charges battery if available
    const solarSurplus = effectiveSolarKw - solarContributionKw;
    if (solarSurplus > 0 && params.batterySocPct < 100) {
      // Negative contribution denotes charging
      batteryContributionKw = -Math.min(solarSurplus, batterySpecs.maxChargeKw);
    } else {
      batteryContributionKw = 0;
    }

    generatorContributionKw = 0;
    estimatedBackupRuntimeHours = null;
    runtimeDisplayString = "Mains Online (Continuous)";
  } else {
    // GRID OUTAGE: Microgrid islanded mode
    gridContributionKw = 0;

    // Can battery discharge? Only if usable energy exists above reserve floor
    const batteryCanDischarge = usableKwh > 0 && params.batterySocPct > params.batteryReserveFloorPct;

    if (batteryCanDischarge && remainingLoadKw > 0) {
      // Battery supplies up to its discharge rate
      batteryContributionKw = Math.min(remainingLoadKw, batterySpecs.maxDischargeKw);
      remainingLoadKw -= batteryContributionKw;
    } else {
      batteryContributionKw = 0;
    }

    // If load remains, check generator
    const generatorAvailable =
      params.generatorMode === "running" ||
      (params.generatorMode === "standby" && remainingLoadKw > 0);

    if (generatorAvailable && remainingLoadKw > 0) {
      generatorContributionKw = Math.min(remainingLoadKw, generatorSpecs.ratedCapacityKw);
      remainingLoadKw -= generatorContributionKw;
      generatorFuelBurnRateLph =
        generatorContributionKw * generatorSpecs.fuelConsumptionPerKwh;
    } else {
      generatorContributionKw = 0;
      generatorFuelBurnRateLph = 0;
    }

    // Any remaining demand is unmet (overload or lack of capacity)
    unmetDemandKw = Math.max(0, remainingLoadKw);

    // Calculate battery backup runtime
    if (totalActiveDemandKw <= 0) {
      runtimeDisplayString = "0.0 kW (No Load)";
      estimatedBackupRuntimeHours = null;
    } else if (effectiveSolarKw >= totalActiveDemandKw) {
      runtimeDisplayString = "Solar Sustained (Surplus)";
      estimatedBackupRuntimeHours = null;
    } else if (batteryContributionKw > 0) {
      // Usable kWh / battery discharge kW
      const hours = usableKwh / batteryContributionKw;
      estimatedBackupRuntimeHours = Math.round(hours * 10) / 10;
      
      const wholeHours = Math.floor(hours);
      const wholeMins = Math.round((hours - wholeHours) * 60);
      runtimeDisplayString = `${wholeHours}h ${wholeMins}m`;
    } else if (usableKwh <= 0 && generatorContributionKw > 0) {
      runtimeDisplayString = "Generator Islanded (Fuel Limited)";
      estimatedBackupRuntimeHours = 8.5; // based on 480L reserve / 56 Lph
    } else {
      runtimeDisplayString = "Depleted (0h 0m)";
      estimatedBackupRuntimeHours = 0;
    }
  }

  // Calculate Hourly Operating Cost (NGN/hr)
  const gridCostPerHour = gridContributionKw * params.gridTariffPerKwhNgn;
  const genCostPerHour = generatorFuelBurnRateLph * params.fuelCostPerLiterNgn;
  const solarAmortizedPerHour = solarContributionKw * 42.0;
  const batteryAmortizedPerHour = Math.max(0, batteryContributionKw) * 68.0;

  const hourlyOperatingCostNgn = Math.round(
    gridCostPerHour + genCostPerHour + solarAmortizedPerHour + batteryAmortizedPerHour
  );

  // Critical Loads Coverage Analysis
  let criticalLoadsCovered = true;
  let criticalLoadStatusText: "protected" | "at_risk" | "compromised" = "protected";
  let systemStatusSummary = "";

  if (unmetDemandKw > 0) {
    criticalLoadsCovered = false;
    criticalLoadStatusText = "compromised";
    systemStatusSummary = `Critical Deficit: ${unmetDemandKw.toFixed(1)} kW unmet load`;
  } else if (!params.gridAvailable) {
    if (params.batterySocPct <= params.batteryReserveFloorPct && generatorContributionKw === 0) {
      criticalLoadsCovered = false;
      criticalLoadStatusText = "at_risk";
      systemStatusSummary = "Warning: Battery at 20% floor reserve; generator engagement recommended";
    } else if (estimatedBackupRuntimeHours !== null && estimatedBackupRuntimeHours < 1.0) {
      criticalLoadsCovered = true;
      criticalLoadStatusText = "at_risk";
      systemStatusSummary = `Low Reserve: ${runtimeDisplayString} backup runtime remaining`;
    } else {
      criticalLoadsCovered = true;
      criticalLoadStatusText = "protected";
      systemStatusSummary = `Islanded & Safe: ${runtimeDisplayString} runtime via Solar + LiFePO4`;
    }
  } else {
    criticalLoadsCovered = true;
    criticalLoadStatusText = "protected";
    systemStatusSummary = "Grid Online: Band A Feeder Active, Cold Storage 100% Protected";
  }

  return {
    totalActiveDemandKw: Math.round(totalActiveDemandKw * 10) / 10,
    criticalDemandKw: Math.round(criticalDemandKw * 10) / 10,
    importantDemandKw: Math.round(importantDemandKw * 10) / 10,
    deferrableDemandKw: Math.round(deferrableDemandKw * 10) / 10,
    solarContributionKw: Math.round(solarContributionKw * 10) / 10,
    gridContributionKw: Math.round(gridContributionKw * 10) / 10,
    batteryContributionKw: Math.round(batteryContributionKw * 10) / 10,
    generatorContributionKw: Math.round(generatorContributionKw * 10) / 10,
    unmetDemandKw: Math.round(unmetDemandKw * 10) / 10,
    batteryUsableKwh: usableKwh,
    batteryRawStoredKwh: rawStoredKwh,
    batteryReserveKwh: reserveFloorKwh,
    batteryMaxDischargeKw: batterySpecs.maxDischargeKw,
    estimatedBackupRuntimeHours,
    runtimeDisplayString,
    hourlyOperatingCostNgn,
    generatorFuelBurnRateLph: Math.round(generatorFuelBurnRateLph * 10) / 10,
    criticalLoadsCovered,
    criticalLoadStatusText,
    systemStatusSummary,
  };
}
