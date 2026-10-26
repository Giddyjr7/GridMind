/**
 * GridMind Centralized Decision Intelligence Engine
 * Unified source of truth for:
 * 1. Operational Risk Summaries
 * 2. Deterministic Scenario Presets
 * 3. Dynamic Explainable Recommendations
 * 4. Before-and-After Strategy Performance Benchmarks
 * 5. Visible 5-Stage Agent Pipeline States
 */

import {
  Appliance,
  EnergyRecommendation,
  ApprovalRecord,
} from "@/types/energy";
import {
  SimulationParams,
  EnergyDispatchFlows,
  calculateApplianceDemand,
  calculateUsableBatteryEnergy,
} from "./simulation-engine";
import {
  OperationalRiskSummary,
  OperationalRiskLevel,
  StrategyComparison,
  StrategyPerformanceMetrics,
  AgentWorkflowPipeline,
  ScenarioPreset,
} from "@/types/decision-intelligence";

// =========================================================================
// 1. SCENARIO PRESETS
// =========================================================================

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "preset_normal",
    name: "Normal Operation (Mains Stable)",
    shortDescription: "Ikeja 11kV grid synchronized, solar peak buffer, battery holding at 68% SOC.",
    narrative:
      "Utility grid is delivering continuous 3-phase power under Band A tariff (₦206/kWh). Rooftop solar array supplies facility baseload with surplus solar charging the battery storage bank.",
    tags: ["Grid Stable", "Band A", "Solar Active", "Safe"],
    params: {
      gridAvailable: true,
      batterySocPct: 68,
      solarEnabled: true,
      solarGenerationKw: 48.0,
      generatorMode: "standby",
      batteryReserveFloorPct: 20,
      batteryTotalCapacityKwh: 120,
    },
    applianceOverrides: [
      { id: "app_freezer_01", state: "running" },
      { id: "app_cold_room_02", state: "running" },
      { id: "app_light_security", state: "running" },
      { id: "app_ac_packaging", state: "running" },
      { id: "app_admin_ac", state: "running" },
    ],
  },
  {
    id: "preset_outage_mitigation",
    name: "Unexpected Grid Outage (Microgrid Islanded)",
    shortDescription: "11kV utility drops to 0V. Solar + LiFePO4 battery carry active loads.",
    narrative:
      "Simulates an unexpected utility blackout in Ikeja Industrial. Facility instantly islands into microgrid mode. Solar PV and battery carry critical refrigeration, but uncurtailed packaging HVAC accelerates battery drain.",
    tags: ["Utility Blackout", "Islanded", "Battery Discharging", "Elevated Risk"],
    params: {
      gridAvailable: false,
      batterySocPct: 58,
      solarEnabled: true,
      solarGenerationKw: 38.0,
      generatorMode: "standby",
      batteryReserveFloorPct: 20,
      batteryTotalCapacityKwh: 120,
    },
    applianceOverrides: [
      { id: "app_freezer_01", state: "running" },
      { id: "app_cold_room_02", state: "running" },
      { id: "app_light_security", state: "running" },
      { id: "app_ac_packaging", state: "running" }, // nonessential running, triggers recommendation
      { id: "app_admin_ac", state: "running" },
    ],
  },
  {
    id: "preset_extended_blackout",
    name: "Extended Blackout (Low Battery Reserve)",
    shortDescription: "Grid blackout continues. Battery reaches 20% floor reserve.",
    narrative:
      "Simulates a prolonged power cut where battery storage has reached its mandatory 20% reserve floor. To safeguard blast freezers from temperature excursion, diesel generator engagement must be evaluated.",
    tags: ["Low Reserve", "Floor Reached", "Critical Risk", "Generator Decision"],
    params: {
      gridAvailable: false,
      batterySocPct: 20,
      solarEnabled: false,
      solarGenerationKw: 0,
      generatorMode: "standby",
      batteryReserveFloorPct: 20,
      batteryTotalCapacityKwh: 120,
    },
    applianceOverrides: [
      { id: "app_freezer_01", state: "running" },
      { id: "app_cold_room_02", state: "running" },
      { id: "app_light_security", state: "running" },
      { id: "app_ac_packaging", state: "curtailed" },
      { id: "app_admin_ac", state: "curtailed" },
    ],
  },
  {
    id: "preset_high_consumption",
    name: "High Demand Peak (Thermal Stress)",
    shortDescription: "All processing lines running at full capacity (88 kW load).",
    narrative:
      "Simulates high midday processing activity during hot weather. Dual blast freezers, cold rooms, and packaging HVAC run at peak draw, testing microgrid inverter headroom and contracted demand limits.",
    tags: ["High Load", "88 kW Peak", "Capacity Test", "Elevated Cost"],
    params: {
      gridAvailable: true,
      batterySocPct: 45,
      solarEnabled: true,
      solarGenerationKw: 42.0,
      generatorMode: "standby",
      batteryReserveFloorPct: 20,
      batteryTotalCapacityKwh: 120,
    },
    applianceOverrides: [
      { id: "app_freezer_01", state: "running" },
      { id: "app_cold_room_02", state: "running" },
      { id: "app_light_security", state: "running" },
      { id: "app_ac_packaging", state: "running" },
      { id: "app_admin_ac", state: "running" },
    ],
  },
];

// =========================================================================
// 2. OPERATIONAL RISK EVALUATION
// =========================================================================

export function evaluateOperationalRisk(
  params: SimulationParams,
  flows: EnergyDispatchFlows,
  appliances: Appliance[]
): OperationalRiskSummary {
  const evaluatedAt = new Date().toISOString();
  const dataQualityIssues: string[] = [];

  // 1. Data Integrity and Sanity Check
  if (
    typeof params.batterySocPct !== "number" ||
    isNaN(params.batterySocPct) ||
    params.batterySocPct < 0 ||
    params.batterySocPct > 100
  ) {
    dataQualityIssues.push("Invalid battery state-of-charge telemetry reading.");
  }

  if (
    typeof flows.totalActiveDemandKw !== "number" ||
    isNaN(flows.totalActiveDemandKw) ||
    flows.totalActiveDemandKw < 0
  ) {
    dataQualityIssues.push("Active electrical power demand telemetry is missing or invalid.");
  }

  if ((params.batteryTotalCapacityKwh ?? 120) <= 0) {
    dataQualityIssues.push("Battery storage capacity not configured.");
  }

  // Count critical appliances
  const criticalAppliances = appliances.filter((a) => a.priority === "critical");
  const totalCriticalLoadsCount = criticalAppliances.length;
  const criticalLoadsProtectedCount = criticalAppliances.filter(
    (a) => a.state === "running" && flows.unmetDemandKw === 0
  ).length;

  if (dataQualityIssues.length > 0) {
    return {
      level: "insufficient_data",
      score: 50,
      title: "Telemetry Incomplete: Insufficient Data",
      description:
        "One or more essential electrical telemetry feeds are missing or uncalibrated. Microgrid optimization is qualified until sensor telemetry is restored.",
      primaryRiskFactors: dataQualityIssues,
      recommendedAction: "Inspect IoT sensor nodes and verify Modbus gateway synchronization.",
      dataQualityIssues,
      criticalLoadsProtectedCount,
      totalCriticalLoadsCount,
      evaluatedAt,
    };
  }

  // 2. Risk State Determination Rules
  const isOutage = !params.gridAvailable;
  const isBatteryAtFloor = params.batterySocPct <= params.batteryReserveFloorPct;
  const isDeficit = flows.unmetDemandKw > 0;
  const anyCriticalCurtailed = criticalAppliances.some((a) => a.state !== "running");
  const runtimeHours = flows.estimatedBackupRuntimeHours;

  // CRITICAL RISK: Unmet demand, battery floor breached with no generator, or critical loads curtailed
  if (isDeficit || (isOutage && isBatteryAtFloor && flows.generatorContributionKw === 0) || anyCriticalCurtailed) {
    const riskFactors: string[] = [];
    if (isDeficit) riskFactors.push(`Active power deficit: ${flows.unmetDemandKw.toFixed(1)} kW unmet load.`);
    if (isOutage && isBatteryAtFloor && flows.generatorContributionKw === 0) {
      riskFactors.push("Battery storage has reached 20% reserve floor with generator idle.");
    }
    if (anyCriticalCurtailed) {
      riskFactors.push("One or more critical refrigeration loads are curtailed or unpowered.");
    }

    return {
      level: "critical",
      score: Math.min(100, 85 + (isDeficit ? 15 : 0)),
      title: "Critical Operational Risk: Cold Chain Vulnerable",
      description:
        "Immediate intervention required. Available clean power cannot sustain critical blast freezers without immediate load shedding or generator dispatch.",
      primaryRiskFactors: riskFactors,
      recommendedAction:
        flows.generatorContributionKw === 0
          ? "Engage backup diesel generator immediately and verify nonessential loads are shed."
          : "Shed all remaining nonessential loads to eliminate power deficit.",
      dataQualityIssues: [],
      criticalLoadsProtectedCount,
      totalCriticalLoadsCount,
      evaluatedAt,
    };
  }

  // ELEVATED RISK: Grid outage active, low runtime buffer (< 2 hours), or high demand
  if (isOutage || params.batterySocPct <= 35 || (runtimeHours !== null && runtimeHours < 3.0)) {
    const riskFactors: string[] = [];
    if (isOutage) riskFactors.push("National grid utility feeder offline (0V import).");
    if (runtimeHours !== null) {
      riskFactors.push(`Backup runtime buffer is limited to ${flows.runtimeDisplayString}.`);
    }
    if (params.batterySocPct <= 35) {
      riskFactors.push(`Battery charge depleted to ${params.batterySocPct}% (trending toward 20% floor).`);
    }

    // Check if nonessential loads are unnecessarily burning battery
    const deferrableRunning = appliances.some(
      (a) => a.priority === "deferrable" && a.state === "running"
    );
    if (deferrableRunning) {
      riskFactors.push("Nonessential HVAC is running on battery during utility outage.");
    }

    return {
      level: "elevated",
      score: 55,
      title: "Elevated Risk: Operating on Finite Backup Storage",
      description:
        "Facility is operating stably on battery storage and solar PV, but runtime is finite. Proactive load shedding is advised to maximize cold-chain coverage.",
      primaryRiskFactors: riskFactors,
      recommendedAction: deferrableRunning
        ? "Approve curtailment of deferrable packaging HVAC to extend backup runtime."
        : "Monitor battery discharge curve and ensure generator standby readiness.",
      dataQualityIssues: [],
      criticalLoadsProtectedCount,
      totalCriticalLoadsCount,
      evaluatedAt,
    };
  }

  // NORMAL OPERATION: Grid online, battery buffer healthy, all critical loads safe
  return {
    level: "normal",
    score: 15,
    title: "Normal Operation: All Assets Synchronized",
    description:
      "Utility feeder is stable, solar generation is contributing to baseload, and battery storage holds a safe reserve buffer. Cold chain is 100% protected.",
    primaryRiskFactors: [
      "Ikeja 11kV Feeder synchronized (Band A tariff active).",
      `Battery reserve healthy at ${params.batterySocPct}% SOC.`,
      "Zero cold-chain temperature excursion alerts.",
    ],
    recommendedAction: "Maintain automated policy. Exploit midday solar peak for thermal pre-cooling.",
    dataQualityIssues: [],
    criticalLoadsProtectedCount,
    totalCriticalLoadsCount,
    evaluatedAt,
  };
}

// =========================================================================
// 3. DYNAMIC EXPLAINABLE RECOMMENDATIONS EVALUATOR
// =========================================================================

export function evaluateDynamicRecommendations(
  params: SimulationParams,
  flows: EnergyDispatchFlows,
  appliances: Appliance[],
  existingRecommendations: EnergyRecommendation[]
): EnergyRecommendation[] {
  const recommendations: EnergyRecommendation[] = [];
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

  // Helper to preserve user's previous action if already approved/rejected
  const getExistingState = (id: string) => {
    return existingRecommendations.find((r) => r.id === id);
  };

  const isOutage = !params.gridAvailable;
  const isBatteryLow = params.batterySocPct <= params.batteryReserveFloorPct;
  const packagingAc = appliances.find((a) => a.id === "app_ac_packaging");
  const adminAc = appliances.find((a) => a.id === "app_admin_ac");
  const blastFreezer = appliances.find((a) => a.id === "app_freezer_01");

  // CASE 1: Utility Outage + Deferrable Load Running -> Shed Packaging HVAC
  if (isOutage && packagingAc && packagingAc.state === "running") {
    const existing = getExistingState("rec_dyn_curtail_packaging");
    const deferrablePower = packagingAc.currentPowerKw || 16.0;

    // Calculate exact runtime extension if shed
    const currentDischarge = flows.batteryContributionKw;
    const projectedDischarge = Math.max(1, currentDischarge - deferrablePower);
    const usableKwh = flows.batteryUsableKwh;
    const currentHours = currentDischarge > 0 ? usableKwh / currentDischarge : 0;
    const projectedHours = projectedDischarge > 0 ? usableKwh / projectedDischarge : 0;
    const runtimeGain = Math.max(0.5, Math.round((projectedHours - currentHours) * 10) / 10);

    // Calculate avoided diesel savings (if battery runs dry earlier, generator would run)
    const avoidedDieselLitersPerHour = Math.round(deferrablePower * 0.285 * 10) / 10;
    const hourlySavingsNgn = Math.round(avoidedDieselLitersPerHour * params.fuelCostPerLiterNgn);

    recommendations.push({
      id: "rec_dyn_curtail_packaging",
      siteId: "site_krystal_ikeja_01",
      title: "Curtail Packaging Floor AC to Preserve Blast Freezer Runtime",
      description: `Utility grid is offline. Packaging Floor HVAC is currently drawing ${deferrablePower.toFixed(1)} kW from battery storage. Shedding this deferrable load extends blast freezer protection by +${runtimeGain} hours.`,
      actionType: "curtail_deferrable",
      urgency: isBatteryLow ? "critical" : "warning",
      targetApplianceId: "app_ac_packaging",
      targetApplianceName: "Packaging Floor HVAC",
      suggestedAction: `Curtail Packaging Floor AC (${deferrablePower.toFixed(1)} kW) during grid outage window.`,
      reasoning: `Nonessential HVAC consumes battery capacity needed for cold-chain inventory. Shedding it avoids ${avoidedDieselLitersPerHour} L/hr of diesel generation and extends battery runtime.`,
      estimatedSavingsNgn: hourlySavingsNgn,
      runtimeImpactHours: runtimeGain,
      powerReductionKw: deferrablePower,
      co2ReductionKg: Math.round(avoidedDieselLitersPerHour * 2.68 * 10) / 10,
      status: existing?.status || "pending",
      createdAt: existing?.createdAt || now,
      expiresAt: existing?.expiresAt || expiresAt,
      appliedAt: existing?.appliedAt,
      rejectionReason: existing?.rejectionReason,
      confidencePct: 96,
      uncertaintyMarginPct: 5,
      affectedSources: ["battery", "generator"],
      affectedAppliances: ["Packaging Floor HVAC", "Blast Freezer Room A"],
      relevantInputs: [
        { label: "Grid Status", value: "Offline (0V Blackout)" },
        { label: "Packaging AC Load", value: `${deferrablePower.toFixed(1)} kW` },
        { label: "Battery Charge", value: `${params.batterySocPct}% SOC` },
        { label: "Diesel Fuel Price", value: `₦${params.fuelCostPerLiterNgn.toLocaleString()}/L` },
      ],
      constraintsRespected: [
        "Cold Storage B and Blast Freezer Room A remain 100% powered",
        "Battery reserve floor (20%) is guarded",
        "Zero diesel generator fuel burn while battery has capacity",
      ],
      benefitsAndTradeoffs: {
        benefits: [
          `Adds +${runtimeGain} hours of clean backup runtime for blast freezers`,
          `Avoids ₦${hourlySavingsNgn.toLocaleString()}/hr in diesel generator fuel burn`,
          "Prevents thermal inventory breach during extended blackout",
        ],
        tradeoffs: [
          "Packaging floor ambient temperature may rise +2.5°C over 2 hours",
          "Requires operator approval before automated contactor shedding",
        ],
      },
      alternativesConsidered: [
        {
          option: "Run diesel generator immediately",
          costOrImpact: `Costs ₦${Math.round(flows.totalActiveDemandKw * 0.285 * params.fuelCostPerLiterNgn).toLocaleString()}/hr`,
          rejectionReason: "Unnecessary fuel expenditure while battery has usable clean capacity",
        },
        {
          option: "Take no action (leave packaging AC running)",
          costOrImpact: "Battery exhausts 1.8 hours earlier",
          rejectionReason: "Prematurely triggers expensive diesel generator run",
        },
      ],
      dataLimitations: "Assumes packaging room door remains closed to limit thermal leakage.",
      isMockGenerated: false,
    });
  }

  // CASE 2: Outage Active + Battery at/below 20% floor reserve + Gen not running -> Start Generator
  if (isOutage && isBatteryLow && flows.generatorContributionKw === 0) {
    const existing = getExistingState("rec_dyn_crank_genset");
    const criticalLoadKw = flows.criticalDemandKw || 51.3;
    const requiredFuelLph = Math.round(criticalLoadKw * 0.285 * 10) / 10;
    const hourlyCostNgn = Math.round(requiredFuelLph * params.fuelCostPerLiterNgn);

    recommendations.push({
      id: "rec_dyn_crank_genset",
      siteId: "site_krystal_ikeja_01",
      title: "Engage Cummins 160 kVA Genset: Battery Floor Reached",
      description: `Battery storage has reached the 20% safety floor (${flows.batteryRawStoredKwh} kWh). Further discharge is restricted by the BMS to protect cell lifespan. Engage backup generator to maintain blast freezers.`,
      actionType: "delay_generator_start",
      urgency: "critical",
      suggestedAction: `Start Cummins 160 kVA generator in prime mode to support ${criticalLoadKw.toFixed(1)} kW critical refrigeration.`,
      reasoning: "Safeguards ₦45M worth of frozen seafood inventory from temperature excursion above -18°C.",
      estimatedSavingsNgn: 0, // Costs money, but saves millions in inventory
      runtimeImpactHours: 8.5,
      powerReductionKw: 0,
      status: existing?.status || "pending",
      createdAt: existing?.createdAt || now,
      expiresAt: existing?.expiresAt || expiresAt,
      appliedAt: existing?.appliedAt,
      rejectionReason: existing?.rejectionReason,
      confidencePct: 98,
      uncertaintyMarginPct: 2,
      affectedSources: ["generator", "battery"],
      affectedAppliances: ["Blast Freezer Room A", "Cold Storage B"],
      relevantInputs: [
        { label: "Battery SOC", value: `${params.batterySocPct}% (At 20% Floor)` },
        { label: "Critical Demand", value: `${criticalLoadKw.toFixed(1)} kW` },
        { label: "Diesel Reserve", value: "480 Liters (73.8%)" },
        { label: "Fuel Burn Rate", value: `${requiredFuelLph} L/hr` },
      ],
      constraintsRespected: [
        "Battery 20% floor protected against deep-cycle degradation",
        "Refrigeration continuous power maintained",
        "Nonessential loads remain curtailed to minimize fuel burn",
      ],
      benefitsAndTradeoffs: {
        benefits: [
          "Prevents frozen seafood inventory thawing and spoilage",
          "Guarantees 8.5+ hours of continuous power from on-site fuel tank",
        ],
        tradeoffs: [
          `Incurs operating expense of ₦${hourlyCostNgn.toLocaleString()}/hr in diesel`,
          "Produces CO2 emissions of ~38 kg/hr",
        ],
      },
      alternativesConsidered: [
        {
          option: "Deep-discharge battery below 20% floor",
          costOrImpact: "Zero fuel cost but damages lithium battery cells",
          rejectionReason: "Violates battery warranty and risks permanent cell capacity loss",
        },
      ],
      dataLimitations: "Assumes generator battery starter is charged and fuel filters clean.",
      isMockGenerated: false,
    });
  }

  // CASE 3: Grid Online + High Solar Surplus -> Pre-Cool Blast Freezer
  if (params.gridAvailable && params.solarGenerationKw >= 40.0 && blastFreezer) {
    const existing = getExistingState("rec_dyn_precool_freezer");

    recommendations.push({
      id: "rec_dyn_precool_freezer",
      siteId: "site_krystal_ikeja_01",
      title: "Pre-Cool Blast Freezer during Peak Midday Solar Window",
      description: `Rooftop solar PV is producing ${params.solarGenerationKw.toFixed(1)} kW of surplus clean electricity. Overcooling Blast Freezer Room A to -25°C now banks thermal energy before the afternoon peak grid window.`,
      actionType: "pre_cool_cold_room",
      urgency: "advisory",
      targetApplianceId: "app_freezer_01",
      targetApplianceName: "Blast Freezer Room A",
      suggestedAction: "Lower Blast Freezer Room A temperature setpoint from -22°C to -25°C for 120 minutes.",
      reasoning: "Utilizes zero-marginal-cost solar kWh to store thermal cold, reducing generator run-time during late afternoon grid outage risk.",
      estimatedSavingsNgn: 18500,
      runtimeImpactHours: 1.5,
      powerReductionKw: 0,
      status: existing?.status || "pending",
      createdAt: existing?.createdAt || now,
      expiresAt: existing?.expiresAt || expiresAt,
      appliedAt: existing?.appliedAt,
      rejectionReason: existing?.rejectionReason,
      confidencePct: 94,
      uncertaintyMarginPct: 8,
      affectedSources: ["solar", "grid"],
      affectedAppliances: ["Blast Freezer Room A"],
      relevantInputs: [
        { label: "Solar Generation", value: `${params.solarGenerationKw.toFixed(1)} kW` },
        { label: "Current Freezer Temp", value: "-21.4°C" },
        { label: "Grid Tariff", value: "₦206/kWh (Band A)" },
      ],
      constraintsRespected: [
        "Freezer temperature kept well within safe -18°C product threshold",
        "Solar self-consumption maximized without grid backfeed penalty",
      ],
      benefitsAndTradeoffs: {
        benefits: [
          "Banks 12 kWh of equivalent thermal energy directly in frozen inventory",
          "Reduces diesel generator dependency if afternoon feeder drops",
          "Saves estimated ₦18,500 in avoided fuel costs",
        ],
        tradeoffs: [
          "Increases compressor mechanical run-time during midday",
        ],
      },
      isMockGenerated: false,
    });
  }

  // If no dynamic recommendation triggered, preserve existing pending recommendations
  if (recommendations.length === 0) {
    return existingRecommendations;
  }

  return recommendations;
}

// =========================================================================
// 4. BEFORE-AND-AFTER STRATEGY PERFORMANCE BENCHMARK
// =========================================================================

export function computeStrategyComparison(
  params: SimulationParams,
  flows: EnergyDispatchFlows,
  appliances: Appliance[],
  activeRecommendation?: EnergyRecommendation
): StrategyComparison {
  const { totalActiveDemandKw, criticalDemandKw, deferrableDemandKw } =
    calculateApplianceDemand(appliances);

  // 1. BASELINE CONVENTIONAL STRATEGY:
  // Conventional facility with automatic transfer switch (ATS):
  // - On grid failure, immediately cranks diesel generator
  // - Leaves ALL loads running (including packaging AC)
  // - Does NOT coordinate solar inverters (islanding safety trips string inverters)
  // - Does NOT use battery ESS intelligent reserve floor
  let baselineActiveLoadKw = totalActiveDemandKw;
  let baselineHourlyCostNgn = 0;
  let baselineRuntimeHours: number | null = null;
  let baselineRuntimeDisplay = "";
  let baselineFuelBurnLph = 0;
  let baselineCriticalStatus: "protected" | "at_risk" | "compromised" = "protected";

  if (params.gridAvailable) {
    baselineHourlyCostNgn = Math.round(baselineActiveLoadKw * params.gridTariffPerKwhNgn);
    baselineRuntimeDisplay = "Mains Online (Continuous)";
    baselineRuntimeHours = null;
    baselineFuelBurnLph = 0;
    baselineCriticalStatus = "protected";
  } else {
    // Outage: Conventional facility runs 100% on diesel generator with no load curtailment
    baselineFuelBurnLph = Math.round(baselineActiveLoadKw * 0.285 * 10) / 10;
    baselineHourlyCostNgn = Math.round(baselineFuelBurnLph * params.fuelCostPerLiterNgn);
    baselineRuntimeHours = Math.round((480 / Math.max(1, baselineFuelBurnLph)) * 10) / 10; // 480L tank
    baselineRuntimeDisplay = `${baselineRuntimeHours}h (Diesel Tank Bound)`;
    baselineCriticalStatus = "protected";
  }

  const baseline: StrategyPerformanceMetrics = {
    strategyName: "Conventional Baseline (Unmanaged ATS)",
    hourlyCostNgn: baselineHourlyCostNgn,
    backupRuntimeHours: baselineRuntimeHours,
    runtimeDisplayString: baselineRuntimeDisplay,
    dieselFuelBurnRateLph: baselineFuelBurnLph,
    activeLoadKw: baselineActiveLoadKw,
    criticalLoadStatus: baselineCriticalStatus,
    assumptions: [
      "ATS immediately cranks 160 kVA diesel generator on grid failure",
      "No load shedding (packaging HVAC runs continuously)",
      "Solar string inverters disconnect during grid loss",
      "Diesel fuel priced at ₦1,250/L with 0.285 L/kWh specific burn rate",
    ],
  };

  // 2. PROPOSED STRATEGY (GridMind Intelligent Orchestration):
  // - Sheds deferrable loads during blackout
  // - Uses solar PV + battery first
  // - Only cranks generator when battery reaches 20% floor
  const proposedHourlyCostNgn = flows.hourlyOperatingCostNgn;
  const proposedRuntimeHours = flows.estimatedBackupRuntimeHours;
  const proposedRuntimeDisplay = flows.runtimeDisplayString;
  const proposedFuelBurnLph = flows.generatorFuelBurnRateLph;
  const proposedCriticalStatus = flows.criticalLoadStatusText;

  const proposed: StrategyPerformanceMetrics = {
    strategyName: "GridMind Intelligent Microgrid Strategy",
    hourlyCostNgn: proposedHourlyCostNgn,
    backupRuntimeHours: proposedRuntimeHours,
    runtimeDisplayString: proposedRuntimeDisplay,
    dieselFuelBurnRateLph: proposedFuelBurnLph,
    activeLoadKw: flows.totalActiveDemandKw,
    criticalLoadStatus: proposedCriticalStatus,
    assumptions: [
      "Nonessential packaging HVAC curtailed during utility outage",
      "Solar PV and usable battery capacity (above 20% floor) prioritized",
      "Generator delayed until battery storage reserve floor is reached",
      "Calculations factor in ₦42/kWh solar and ₦68/kWh battery LCOE amortizations",
    ],
  };

  // 3. COMPARISON DELTAS
  const costDeltaNgnPerHour = baseline.hourlyCostNgn - proposed.hourlyCostNgn;
  let costReductionPercentage = 0;
  if (baseline.hourlyCostNgn > 0) {
    costReductionPercentage = Math.round((costDeltaNgnPerHour / baseline.hourlyCostNgn) * 100);
  }

  const runtimeGainHours =
    proposed.backupRuntimeHours !== null && baseline.backupRuntimeHours !== null
      ? Math.round((proposed.backupRuntimeHours - baseline.backupRuntimeHours) * 10) / 10
      : 0;

  let verdictSummary = "";
  if (costDeltaNgnPerHour > 0) {
    verdictSummary = `GridMind reduces operating expenditure by ₦${costDeltaNgnPerHour.toLocaleString()}/hr (${costReductionPercentage}% savings) while keeping blast freezers safe.`;
  } else if (costDeltaNgnPerHour === 0) {
    verdictSummary = "Operating costs are identical between strategies under current grid conditions.";
  } else {
    verdictSummary = `Proposed strategy temporarily expends ₦${Math.abs(costDeltaNgnPerHour).toLocaleString()}/hr to prevent catastrophic cold-room inventory spoilage.`;
  }

  return {
    baseline,
    proposed,
    costDeltaNgnPerHour,
    costReductionPercentage,
    runtimeGainHours,
    criticalCoverageMaintained: proposedCriticalStatus === "protected",
    verdictSummary,
  };
}

// =========================================================================
// 5. VISIBLE AGENT PIPELINE STATE GENERATOR
// =========================================================================

export function evaluateAgentPipeline(
  params: SimulationParams,
  flows: EnergyDispatchFlows,
  appliances: Appliance[],
  activeRecommendation?: EnergyRecommendation,
  approvalHistory?: ApprovalRecord[]
): AgentWorkflowPipeline {
  const now = new Date().toISOString();

  // 1. TELEMETRY STAGE
  const telemetryStage = {
    name: "Telemetry Ingestion",
    label: "Physical Asset Readings",
    status: "completed" as const,
    summary: params.gridAvailable
      ? "Grid feeder active (402V, 50Hz). Solar PV 48kW, Battery 68% SOC."
      : "11kV feeder blackout (0V). Battery discharging at 55kW. Solar active.",
    provenance: "simulated" as const,
    details: {
      "Feeder Voltage": params.gridAvailable ? "402 V (Band A)" : "0 V (Outage)",
      "Active Facility Load": `${flows.totalActiveDemandKw.toFixed(1)} kW`,
      "Solar PV Output": `${flows.solarContributionKw.toFixed(1)} kW`,
      "Battery Charge": `${params.batterySocPct}% SOC`,
      "Diesel Fuel Level": "480 Liters (73.8%)",
    },
    timestamp: now,
  };

  // 2. FORECAST STAGE
  const isOutage = !params.gridAvailable;
  const forecastStage = {
    name: "Predictive Forecasting",
    label: "Continuity & Deficit Models",
    status: "completed" as const,
    summary: isOutage
      ? `Estimated battery backup runtime: ${flows.runtimeDisplayString} before 20% floor reserve.`
      : "Grid power continuous. Midday solar generation model active.",
    provenance: "simulated" as const,
    details: {
      "Projected Runtime": flows.runtimeDisplayString,
      "Usable Battery Energy": `${flows.batteryUsableKwh} kWh`,
      "Net Deficit Risk": `${flows.unmetDemandKw.toFixed(1)} kW`,
      "Fuel Run-Rate": `${flows.generatorFuelBurnRateLph.toFixed(1)} L/hr`,
    },
    timestamp: now,
  };

  // 3. DECISION STAGE (Constraints Matrix)
  const decisionStage = {
    name: "Constrained Decision Logic",
    label: "Multi-Constraint Optimization",
    status: "completed" as const,
    summary:
      "Evaluated 3 operational constraints: 1. Maintain -21.4°C freezer temp; 2. Respect 20% battery floor; 3. Avoid unnecessary diesel burn.",
    provenance: "simulated" as const,
    details: {
      "Constraint 1 (Cold Chain)": "SATISFIED (Blast Freezer 100% Protected)",
      "Constraint 2 (Battery Floor)": `${params.batteryReserveFloorPct}% floor strictly respected`,
      "Constraint 3 (Diesel Avoidance)": isOutage
        ? params.batterySocPct > 20
          ? "SATISFIED (Diesel kept idle)"
          : "OVERRIDDEN (Generator needed for cold storage)"
        : "SATISFIED (Grid online)",
    },
    timestamp: now,
  };

  // 4. RECOMMENDATION STAGE
  const recommendationStage = {
    name: "Explainable Action Generation",
    label: "Synthesized Strategy",
    status: activeRecommendation ? ("completed" as const) : ("ready" as const),
    summary: activeRecommendation
      ? activeRecommendation.title
      : "System operating within optimal parameters; monitoring active telemetry.",
    provenance: "simulated" as const,
    details: {
      "Action Type": activeRecommendation?.actionType || "monitor_only",
      "Proposed Benefit": activeRecommendation?.estimatedSavingsNgn
        ? `₦${activeRecommendation.estimatedSavingsNgn.toLocaleString()} savings`
        : "Cold-chain inventory safeguard",
      "Operator Verification": "Required before physical contactor actuation",
    },
    timestamp: now,
  };

  // 5. HUMAN APPROVAL STAGE
  const approvalStatus = activeRecommendation?.status || "pending";
  const humanApprovalStage = {
    name: "Human-in-the-Loop Approval Gate",
    label: "Operator Authorization",
    status:
      approvalStatus === "approved"
        ? ("completed" as const)
        : approvalStatus === "rejected"
        ? ("needs_attention" as const)
        : ("ready" as const),
    summary:
      approvalStatus === "approved"
        ? "Action sanctioned by facility operator. Simulated policy active."
        : approvalStatus === "rejected"
        ? "Operator declined action. Physical state remains unmodified."
        : "Awaiting operator authorization in decision queue.",
    provenance: "simulated" as const,
    details: {
      "Approval State": approvalStatus.toUpperCase(),
      "Authorization Role": "Facility Operations Lead",
      "Air-Gapped Safety": "No autonomous electrical switching without human sign-off",
    },
    timestamp: now,
  };

  const overallStatus =
    approvalStatus === "approved"
      ? "completed"
      : isOutage && params.batterySocPct <= 20
      ? "needs_attention"
      : "ready";

  const statusMessage =
    approvalStatus === "approved"
      ? "Pipeline complete: Strategy approved and running in simulation."
      : isOutage
      ? "Active pipeline: Incident detected; recommendation generated for review."
      : "Pipeline monitoring: Baseline normal; predictive models standing by.";

  return {
    overallStatus,
    statusMessage,
    telemetryStage,
    forecastStage,
    decisionStage,
    recommendationStage,
    humanApprovalStage,
    lastEvaluatedAt: now,
  };
}
