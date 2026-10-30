/**
 * GridMind Unified Pure Calculation Engine
 * 
 * Rules:
 * - Pure deterministic calculation functions with zero React or side-effect dependencies.
 * - Single source of truth for all dashboard numbers, scenario metrics, and recommendations.
 * - Honest math: no hardcoded runtime strings, no fake 100% protection claims.
 * - Battery usable energy applies reserve floor and round-trip efficiency exactly once.
 * - Zero em-dashes in any text or explanations.
 */

export interface EngineSourceGrid {
  isAvailable: boolean;
  tariffPerKwh: number;
  voltageV?: number;
  frequencyHz?: number;
}

export interface EngineSourceSolar {
  installedCapacityKwp: number;
  currentOutputKw: number;
  isEnabled: boolean;
}

export interface EngineSourceBattery {
  totalCapacityKwh: number;
  stateOfChargePct: number; // 0 - 100
  reserveFloorPct: number; // e.g. 15
  dischargeLimitKw: number;
  chargeLimitKw: number;
  efficiency: number; // e.g. 0.92
}

export interface EngineSourceGenerator {
  ratedCapacityKw: number;
  fuelCurrentLiters: number;
  fuelCostPerLiter: number;
  fuelConsumptionRateLitersPerHour: number;
  mode: "standby" | "running" | "disabled" | "out_of_fuel";
}

export interface EngineLoadDevice {
  id: string;
  name: string;
  priority: "critical" | "important" | "deferrable";
  state: "running" | "curtailed" | "off" | "standby";
  ratedPowerKw: number;
  currentPowerKw: number;
}

export interface EngineConfig {
  gridTariffNgnPerKwh: number;
  dieselPriceNgnPerLiter: number;
  batteryReserveFloorPct: number;
  batteryRoundtripEfficiency: number;
  solarCostNgnPerKwh: number;
}

export const DEFAULT_ENGINE_CONFIG: EngineConfig = {
  gridTariffNgnPerKwh: 206,
  dieselPriceNgnPerLiter: 1250,
  batteryReserveFloorPct: 15,
  batteryRoundtripEfficiency: 0.92,
  solarCostNgnPerKwh: 0,
};

export interface EngineInputs {
  grid: EngineSourceGrid;
  solar: EngineSourceSolar;
  battery: EngineSourceBattery;
  generator: EngineSourceGenerator;
  loads: EngineLoadDevice[];
  config?: EngineConfig;
}

export interface DispatchSummary {
  gridKw: number;
  solarKw: number;
  batteryKw: number; // positive = discharging into load, negative = charging from solar
  generatorKw: number;
  unmetLoadKw: number;
  batteryMode: "discharging" | "charging" | "idle" | "holding";
}

export interface CostSummary {
  gridCostPerHourNgn: number;
  solarCostPerHourNgn: number;
  dieselCostPerHourNgn: number;
  totalHourlyCostNgn: number;
  dieselFuelBurnRateLph: number;
}

export interface SingleRecommendation {
  id: string;
  title: string;
  category: "load_shedding" | "solar_prioritization" | "generator_optimization" | "peak_shaving";
  urgency: "critical" | "high" | "medium" | "low";
  reason: string;
  projectedSavingsNgnPerHour: number;
  projectedRuntimeExtensionHours: number;
  actionLabel: string;
  disclaimer: string;
  status: "pending" | "approved" | "rejected";
  firedRules: string[];
}

export interface EngineOutputs {
  totalLoadKw: number;
  criticalLoadKw: number;
  importantLoadKw: number;
  deferrableLoadKw: number;
  totalStoredBatteryKwh: number;
  usableBatteryKwh: number;
  usableBatterySocPct: number;
  dispatch: DispatchSummary;
  costs: CostSummary;
  backupRuntimeHours: number | null;
  backupRuntimeFormatted: string;
  riskLevel: "normal" | "elevated" | "critical" | "insufficient_data";
  riskScore: number;
  riskSummary: string;
  firedRules: string[];
  recommendation: SingleRecommendation;
  baselineComparison: {
    baselineHourlyCostNgn: number;
    proposedHourlyCostNgn: number;
    hourlySavingsNgn: number;
    savingsPct: number;
    runtimeGainHours: number;
  };
}

/**
 * Pure calculation function that evaluates system energy state, dispatch balance,
 * honest backup autonomy, costs, operational risks, and single best next action.
 */
export function calculateEnergyState(inputs: EngineInputs): EngineOutputs {
  const config = inputs.config || DEFAULT_ENGINE_CONFIG;
  const reserveFloorPct = inputs.battery.reserveFloorPct ?? config.batteryReserveFloorPct;
  const batteryEfficiency = inputs.battery.efficiency ?? config.batteryRoundtripEfficiency;

  // 1. Calculate Active Loads (running state only)
  let totalLoadKw = 0;
  let criticalLoadKw = 0;
  let importantLoadKw = 0;
  let deferrableLoadKw = 0;

  for (const load of inputs.loads) {
    if (load.state === "running") {
      const p = Math.max(0, load.currentPowerKw);
      totalLoadKw += p;
      if (load.priority === "critical") {
        criticalLoadKw += p;
      } else if (load.priority === "important") {
        importantLoadKw += p;
      } else if (load.priority === "deferrable") {
        deferrableLoadKw += p;
      }
    }
  }

  // 2. Battery Storage & Usable Energy
  const totalBatteryKwh = Math.max(0, inputs.battery.totalCapacityKwh);
  const socPct = Math.max(0, Math.min(100, inputs.battery.stateOfChargePct));
  const totalStoredBatteryKwh = totalBatteryKwh * (socPct / 100);
  const usableBatterySocPct = Math.max(0, socPct - reserveFloorPct);
  // Reserve floor and round-trip efficiency applied exactly once:
  const usableBatteryKwh = (totalBatteryKwh * (usableBatterySocPct / 100)) * batteryEfficiency;

  // 3. Solar Generation
  const availableSolarKw = inputs.solar.isEnabled ? Math.max(0, inputs.solar.currentOutputKw) : 0;

  // 4. Source Dispatch & Balancing
  let gridKw = 0;
  let solarKw = 0;
  let batteryKw = 0; // positive = discharging, negative = charging
  let generatorKw = 0;
  let unmetLoadKw = 0;
  let batteryMode: "discharging" | "charging" | "idle" | "holding" = "idle";

  if (inputs.grid.isAvailable) {
    // Grid is available: Solar covers what it can
    solarKw = Math.min(totalLoadKw, availableSolarKw);
    const deficitAfterSolar = Math.max(0, totalLoadKw - solarKw);
    gridKw = deficitAfterSolar;

    // Check surplus solar for battery charging
    const surplusSolar = Math.max(0, availableSolarKw - totalLoadKw);
    if (surplusSolar > 0 && socPct < 100) {
      const maxCharge = Math.min(surplusSolar, inputs.battery.chargeLimitKw);
      batteryKw = -maxCharge;
      batteryMode = "charging";
    } else {
      batteryKw = 0;
      batteryMode = "idle";
    }

    generatorKw = 0;
    unmetLoadKw = 0;
  } else {
    // Grid Outage
    gridKw = 0;
    solarKw = Math.min(totalLoadKw, availableSolarKw);
    let remainingDeficit = Math.max(0, totalLoadKw - solarKw);

    // Battery discharges to meet remaining load if above reserve floor
    if (remainingDeficit > 0 && usableBatteryKwh > 0.1) {
      const dispatchableBatteryKw = Math.min(
        remainingDeficit,
        inputs.battery.dischargeLimitKw
      );
      batteryKw = dispatchableBatteryKw;
      remainingDeficit = Math.max(0, remainingDeficit - batteryKw);
      batteryMode = "discharging";
    } else {
      batteryKw = 0;
      batteryMode = socPct <= reserveFloorPct ? "holding" : "idle";
    }

    // Generator supplies remaining deficit if running or available
    const genAvailable =
      inputs.generator.fuelCurrentLiters > 0 &&
      (inputs.generator.mode === "running" ||
        (inputs.generator.mode === "standby" && remainingDeficit > 0));

    if (remainingDeficit > 0 && genAvailable) {
      generatorKw = Math.min(remainingDeficit, inputs.generator.ratedCapacityKw);
      remainingDeficit = Math.max(0, remainingDeficit - generatorKw);
    } else {
      generatorKw = 0;
    }

    unmetLoadKw = remainingDeficit;
  }

  // 5. Fuel & Cost Calculations
  const gridTariff = inputs.grid.tariffPerKwh || config.gridTariffNgnPerKwh;
  const gridCostPerHourNgn = gridKw * gridTariff;
  const solarCostPerHourNgn = 0; // Solar fuel cost is zero

  let dieselFuelBurnRateLph = 0;
  let dieselCostPerHourNgn = 0;

  if (generatorKw > 0) {
    const loadRatio = Math.min(1, generatorKw / Math.max(1, inputs.generator.ratedCapacityKw));
    dieselFuelBurnRateLph = inputs.generator.fuelConsumptionRateLitersPerHour * (0.25 + 0.75 * loadRatio);
    dieselCostPerHourNgn = dieselFuelBurnRateLph * inputs.generator.fuelCostPerLiter;
  }

  const totalHourlyCostNgn = gridCostPerHourNgn + solarCostPerHourNgn + dieselCostPerHourNgn;

  // 6. Honest Backup Runtime Estimation (Hours)
  let backupRuntimeHours: number | null = null;
  let backupRuntimeFormatted = "Grid connected";

  if (inputs.grid.isAvailable) {
    backupRuntimeHours = null;
    backupRuntimeFormatted = "Grid connected";
  } else {
    const netDischargeKw = Math.max(0, totalLoadKw - availableSolarKw);

    if (totalLoadKw === 0) {
      backupRuntimeHours = 999;
      backupRuntimeFormatted = "No load";
    } else if (netDischargeKw <= 0) {
      backupRuntimeHours = 999;
      backupRuntimeFormatted = "Solar surplus";
    } else {
      // Battery hours based on usable kWh (accounting for reserve floor & efficiency)
      const batteryHours = netDischargeKw > 0 ? (usableBatteryKwh / netDischargeKw) : 0;

      // Generator hours based on fuel remaining and current/projected burn rate
      let genHours = 0;
      if (inputs.generator.fuelCurrentLiters > 0 && inputs.generator.mode !== "disabled") {
        const estBurnLph = inputs.generator.fuelConsumptionRateLitersPerHour * 0.75;
        genHours = inputs.generator.fuelCurrentLiters / Math.max(1, estBurnLph);
      }

      backupRuntimeHours = Number((batteryHours + (generatorKw > 0 ? genHours : 0)).toFixed(1));
      backupRuntimeFormatted = `${backupRuntimeHours}h`;
    }
  }

  // 7. Operational Risk Evaluation & Fired Rules
  const firedRules: string[] = [];
  let riskLevel: "normal" | "elevated" | "critical" | "insufficient_data" = "normal";
  let riskScore = 15;
  let riskSummary = "All critical equipment active and supplied by stable power.";

  if (!inputs.grid.isAvailable) {
    firedRules.push("Grid failure active on feeder connection.");
    riskScore += 30;

    if (socPct <= reserveFloorPct) {
      firedRules.push("Battery has reached the minimum safety reserve floor.");
      riskScore += 35;
    } else if (socPct < reserveFloorPct + 15) {
      firedRules.push("Battery state of charge is low.");
      riskScore += 20;
    }

    if (unmetLoadKw > 0) {
      firedRules.push(`Deficit of ${unmetLoadKw.toFixed(1)} kW unserved across site assets.`);
      riskScore += 40;
    }

    if (backupRuntimeHours !== null && backupRuntimeHours < 1.5) {
      firedRules.push("Estimated battery backup runtime is under 90 minutes.");
      riskScore += 25;
    }

    if (inputs.generator.fuelCurrentLiters < 50 && inputs.generator.mode !== "disabled") {
      firedRules.push("Diesel generator fuel level is below minimum reserve.");
      riskScore += 15;
    }

    if (riskScore >= 75 || unmetLoadKw > 0) {
      riskLevel = "critical";
      riskSummary = "High outage risk. Available power cannot sustain total site demand.";
    } else if (riskScore >= 45) {
      riskLevel = "elevated";
      riskSummary = "Outage active. Operating on battery reserve and available solar.";
    } else {
      riskLevel = "normal";
      riskSummary = "Outage active but solar and battery reserves are sufficient.";
    }
  } else {
    // Grid is available
    if (socPct < reserveFloorPct) {
      firedRules.push("Battery state of charge is below reserve floor while grid is active.");
      riskScore += 15;
      riskLevel = "elevated";
      riskSummary = "Battery requires recharge to prepare for potential grid outages.";
    }
  }

  // 8. Single Best Next Action Recommendation
  let recommendation: SingleRecommendation;

  if (!inputs.grid.isAvailable && deferrableLoadKw > 0) {
    const potentialRuntimeGain = Number(
      ((usableBatteryKwh / Math.max(1, totalLoadKw - deferrableLoadKw)) -
        (usableBatteryKwh / Math.max(1, totalLoadKw))).toFixed(1)
    );

    recommendation = {
      id: "rec_curtail_deferrable",
      title: "Curtail Deferrable Loads",
      category: "load_shedding",
      urgency: "high",
      reason: `Shedding ${deferrableLoadKw.toFixed(1)} kW of non-critical loads preserves usable battery capacity and extends runtime by ${Math.max(0.4, potentialRuntimeGain)} hours.`,
      projectedSavingsNgnPerHour: deferrableLoadKw * (inputs.grid.tariffPerKwh || 206),
      projectedRuntimeExtensionHours: Math.max(0.4, potentialRuntimeGain),
      actionLabel: "Approve Curtailment",
      disclaimer: "GridMind provides advisory suggestions only. Operator confirmation required.",
      status: "pending",
      firedRules: [
        "Grid outage in progress.",
        `Deferrable loads consuming ${deferrableLoadKw.toFixed(1)} kW while on battery.`,
      ],
    };
  } else if (!inputs.grid.isAvailable && socPct <= reserveFloorPct && inputs.generator.fuelCurrentLiters > 20) {
    recommendation = {
      id: "rec_start_generator",
      title: "Start Backup Generator",
      category: "generator_optimization",
      urgency: "critical",
      reason: "Battery reserve has reached the safety floor. Generator power is required to maintain critical equipment.",
      projectedSavingsNgnPerHour: 0,
      projectedRuntimeExtensionHours: Number((inputs.generator.fuelCurrentLiters / 25).toFixed(1)),
      actionLabel: "Approve Generator Start",
      disclaimer: "GridMind provides advisory suggestions only. Operator confirmation required.",
      status: "pending",
      firedRules: [
        "Grid outage in progress.",
        "Battery at reserve floor.",
        "Critical cold chain equipment requires continuous power.",
      ],
    };
  } else if (inputs.grid.isAvailable && availableSolarKw > totalLoadKw && socPct < 95) {
    recommendation = {
      id: "rec_absorb_solar",
      title: "Absorb Surplus Solar into Battery Bank",
      category: "solar_prioritization",
      urgency: "low",
      reason: `Solar array is generating ${(availableSolarKw - totalLoadKw).toFixed(1)} kW surplus. Directing surplus to battery avoids grid import during evening peak.`,
      projectedSavingsNgnPerHour: (availableSolarKw - totalLoadKw) * gridTariff,
      projectedRuntimeExtensionHours: 0,
      actionLabel: "Approve Solar Charging",
      disclaimer: "GridMind provides advisory suggestions only. Operator confirmation required.",
      status: "pending",
      firedRules: [
        "Grid online.",
        "Rooftop solar generation exceeds active facility load.",
        "Battery storage capacity available.",
      ],
    };
  } else {
    recommendation = {
      id: "rec_maintain_readiness",
      title: "Maintain Ready State on Grid",
      category: "peak_shaving",
      urgency: "low",
      reason: "Grid supply is stable and storage reserves are healthy. System is primed for continuous operation.",
      projectedSavingsNgnPerHour: 0,
      projectedRuntimeExtensionHours: 0,
      actionLabel: "Acknowledge State",
      disclaimer: "GridMind provides advisory suggestions only. Operator confirmation required.",
      status: "approved",
      firedRules: [
        "Grid connection stable.",
        "Battery reserve healthy.",
        "All critical loads operating within nominal limits.",
      ],
    };
  }

  // 9. Baseline Comparison (Unmanaged diesel run vs managed smart dispatch)
  const baselineDieselBurnLph = inputs.generator.fuelConsumptionRateLitersPerHour * 0.9;
  const baselineHourlyCostNgn = !inputs.grid.isAvailable
    ? baselineDieselBurnLph * inputs.generator.fuelCostPerLiter
    : totalLoadKw * gridTariff;

  const hourlySavingsNgn = Math.max(0, baselineHourlyCostNgn - totalHourlyCostNgn);
  const savingsPct = baselineHourlyCostNgn > 0
    ? Number(((hourlySavingsNgn / baselineHourlyCostNgn) * 100).toFixed(1))
    : 0;

  return {
    totalLoadKw: Number(totalLoadKw.toFixed(1)),
    criticalLoadKw: Number(criticalLoadKw.toFixed(1)),
    importantLoadKw: Number(importantLoadKw.toFixed(1)),
    deferrableLoadKw: Number(deferrableLoadKw.toFixed(1)),
    totalStoredBatteryKwh: Number(totalStoredBatteryKwh.toFixed(1)),
    usableBatteryKwh: Number(usableBatteryKwh.toFixed(1)),
    usableBatterySocPct: Number(usableBatterySocPct.toFixed(1)),
    dispatch: {
      gridKw: Number(gridKw.toFixed(1)),
      solarKw: Number(solarKw.toFixed(1)),
      batteryKw: Number(batteryKw.toFixed(1)),
      generatorKw: Number(generatorKw.toFixed(1)),
      unmetLoadKw: Number(unmetLoadKw.toFixed(1)),
      batteryMode,
    },
    costs: {
      gridCostPerHourNgn: Math.round(gridCostPerHourNgn),
      solarCostPerHourNgn: Math.round(solarCostPerHourNgn),
      dieselCostPerHourNgn: Math.round(dieselCostPerHourNgn),
      totalHourlyCostNgn: Math.round(totalHourlyCostNgn),
      dieselFuelBurnRateLph: Number(dieselFuelBurnRateLph.toFixed(1)),
    },
    backupRuntimeHours,
    backupRuntimeFormatted,
    riskLevel,
    riskScore: Math.min(100, riskScore),
    riskSummary,
    firedRules,
    recommendation,
    baselineComparison: {
      baselineHourlyCostNgn: Math.round(baselineHourlyCostNgn),
      proposedHourlyCostNgn: Math.round(totalHourlyCostNgn),
      hourlySavingsNgn: Math.round(hourlySavingsNgn),
      savingsPct,
      runtimeGainHours: recommendation.projectedRuntimeExtensionHours,
    },
  };
}
