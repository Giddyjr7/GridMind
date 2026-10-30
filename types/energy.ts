/**
 * GridMind Core Domain Types
 * Defines comprehensive data structures for microgrid telemetry, asset control,
 * predictive forecasting, AI recommendations, and operational audit records.
 */

// ==========================================
// 1. BUSINESS & SITE INFORMATION
// ==========================================

export type CurrencyCode = "NGN" | "USD" | "EUR" | "GBP";

export interface GeoLocation {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  timezone: string;
}

export interface BusinessSite {
  id: string;
  name: string;
  industry: "cold_storage" | "retail" | "healthcare" | "manufacturing" | "hospitality";
  facilityType: string;
  location: GeoLocation;
  currency: CurrencyCode;
  gridProvider: string;
  tariffBand: string; // e.g. "Band A (20h+ daily target)"
  contractedDemandKw: number;
  installedSolarCapacityKwp: number;
  installedBatteryCapacityKwh: number;
  generatorCapacityKva: number;
  isFictionalDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 2. ENERGY SOURCES & ASSETS
// ==========================================

export type EnergySourceType = "grid" | "solar" | "battery" | "generator";

export type AssetOperationalStatus = "online" | "standby" | "offline" | "fault" | "maintenance";

export interface EnergySourceBase {
  id: string;
  type: EnergySourceType;
  name: string;
  status: AssetOperationalStatus;
  currentPowerKw: number;
  ratedCapacityKw: number;
}

export interface GridSource extends EnergySourceBase {
  type: "grid";
  voltageV: number;
  frequencyHz: number;
  powerFactor: number;
  tariffPerKwh: number; // in site currency (e.g., NGN)
  isAvailable: boolean;
  lastOutageStart?: string;
  estimatedRestorationTime?: string;
}

export interface SolarSource extends EnergySourceBase {
  type: "solar";
  installedCapacityKwp: number;
  irradianceWm2: number;
  inverterEfficiencyPct: number;
  dailyGenerationKwh: number;
}

export type BatteryMode = "charging" | "discharging" | "idle" | "holding";

export interface BatteryStatus extends EnergySourceBase {
  type: "battery";
  mode: BatteryMode;
  stateOfChargePct: number; // 0 - 100%
  totalCapacityKwh: number;
  usableCapacityKwh: number;
  currentStoredKwh: number;
  chargeRateLimitKw: number;
  dischargeRateLimitKw: number;
  estimatedRemainingRuntimeHours: number;
  temperatureCelsius: number;
  cycleCount: number;
  healthPct: number; // State of Health (SOH)
}

export interface GeneratorSource extends EnergySourceBase {
  type: "generator";
  fuelType: "diesel" | "gas" | "petrol";
  fuelCapacityLiters: number;
  fuelCurrentLiters: number;
  fuelLevelPct: number;
  fuelConsumptionRateLitersPerHour: number;
  fuelCostPerLiter: number; // in site currency
  effectiveCostPerKwh: number; // in site currency
  isRunning: boolean;
  engineRunHours: number;
  coolingTempCelsius: number;
  oilPressureKpa: number;
}

// ==========================================
// 3. APPLIANCES & PRIORITIES
// ==========================================

export type AppliancePriority = "critical" | "important" | "deferrable";

export type ApplianceState = "running" | "curtailed" | "off" | "standby";

export interface Appliance {
  id: string;
  name: string;
  siteId: string;
  category: "refrigeration" | "cooling_hvac" | "lighting" | "water_pumping" | "it_security" | "general_processing";
  priority: AppliancePriority;
  state: ApplianceState;
  ratedPowerKw: number;
  currentPowerKw: number;
  dailyConsumptionKwh: number;
  isControllable: boolean;
  minRunTimeMinutes?: number;
  maxDeferralMinutes?: number;
  temperatureCritical?: {
    currentTempCelsius: number;
    minAllowedCelsius: number;
    maxAllowedCelsius: number;
    targetCelsius: number;
  };
  notes?: string;
  telemetryStatus?: "online" | "stale" | "offline";
  lastTelemetryAt?: string;
  healthPct?: number;
}

// ==========================================
// 4. ENERGY READINGS & TELEMETRY
// ==========================================

export interface EnergyReading {
  id: string;
  siteId: string;
  timestamp: string; // ISO 8601
  totalLoadKw: number;
  gridPowerKw: number;
  solarPowerKw: number;
  batteryPowerKw: number; // positive = discharging, negative = charging
  generatorPowerKw: number;
  batterySocPct: number;
  gridAvailable: boolean;
  activeTariffPerKwh: number;
  estimatedHourlyCost: number;
  co2EmissionsKgPerHour: number;
}

export interface TelemetrySummary {
  currentLoadKw: number;
  gridImportKw: number;
  solarGenerationKw: number;
  batteryFlowKw: number;
  generatorOutputKw: number;
  batterySocPct: number;
  primaryActiveSource: EnergySourceType;
  gridOnline: boolean;
  generatorOnline: boolean;
}

// ==========================================
// 5. ENERGY COST & TARIFFS
// ==========================================

export interface EnergyCostBreakdown {
  currency: CurrencyCode;
  gridCostPerKwh: number;
  generatorEffectiveCostPerKwh: number;
  solarLevelizedCostPerKwh: number;
  batteryLevelizedCostPerKwh: number;
  todayTotalCost: number;
  yesterdayTotalCost: number;
  projectedMonthCost: number;
  estimatedSavingsMonth: number;
}

// ==========================================
// 6. FORECAST & UNCERTAINTY
// ==========================================

export interface UncertaintyRange {
  p10: number; // conservative lower bound
  p50: number; // expected median
  p90: number; // optimistic upper bound
}

export interface HourlyForecastPoint {
  timestamp: string;
  hour: number;
  solarExpectedKw: UncertaintyRange;
  loadExpectedKw: UncertaintyRange;
  gridOutageProbabilityPct: number;
  optimalRecommendedSource: EnergySourceType;
  expectedCostPerKwh: number;
}

export interface DayForecast {
  siteId: string;
  generatedAt: string;
  forecastDate: string;
  hourlyPoints: HourlyForecastPoint[];
  peakSolarHour: number;
  totalExpectedSolarKwh: UncertaintyRange;
  highestRiskOutagePeriod: {
    startHour: number;
    endHour: number;
    probabilityPct: number;
  };
}

// ==========================================
// 7. RECOMMENDATIONS & APPROVAL
// ==========================================

export type RecommendationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "executed"
  | "expired";

export type RecommendationUrgency = "critical" | "warning" | "advisory";

export type RecommendationActionType =
  | "curtail_deferrable"
  | "pre_cool_cold_room"
  | "charge_battery_solar"
  | "switch_to_battery"
  | "delay_generator_start"
  | "optimize_generator_load";

export interface AlternativeOption {
  option: string;
  costOrImpact: string;
  rejectionReason: string;
}

export interface RecommendationTelemetryInput {
  label: string;
  value: string;
}

export interface EnergyRecommendation {
  id: string;
  siteId: string;
  title: string;
  description: string;
  actionType: RecommendationActionType;
  urgency: RecommendationUrgency;
  targetApplianceId?: string;
  targetApplianceName?: string;
  suggestedAction: string;
  reasoning: string;
  estimatedSavingsNgn: number;
  co2ReductionKg?: number;
  powerReductionKw?: number;
  runtimeImpactHours?: number;
  status: RecommendationStatus;
  createdAt: string;
  expiresAt: string;
  appliedAt?: string;
  rejectionReason?: string;
  confidencePct: number;
  uncertaintyMarginPct?: number;
  affectedSources?: EnergySourceType[];
  affectedAppliances?: string[];
  relevantInputs?: RecommendationTelemetryInput[];
  constraintsRespected?: string[];
  benefitsAndTradeoffs?: {
    benefits: string[];
    tradeoffs: string[];
  };
  alternativesConsidered?: AlternativeOption[];
  dataLimitations?: string;
  isMockGenerated?: boolean;
}

export interface ApprovalRecord {
  id: string;
  recommendationId: string;
  actionTaken: "approve" | "reject";
  performedBy: string; // e.g. "Facility Manager" or "Automated Policy Engine"
  timestamp: string;
  notes?: string;
  savingsRealizedEstimateNgn?: number;
  deviceCommandId?: string;
}

export type DeviceCommandStatus =
  | "queued"
  | "validating"
  | "dispatched"
  | "acknowledged"
  | "active"
  | "completed"
  | "failed"
  | "cancelled";

export interface DeviceCommand {
  id: string;
  recommendationId: string;
  applianceId: string;
  applianceName: string;
  commandType: "set_temperature_setpoint";
  protocol: "virtual" | "modbus" | "mqtt";
  status: DeviceCommandStatus;
  requestedBy: string;
  requestedAt: string;
  activatedAt?: string;
  completedAt?: string;
  durationMinutes: number;
  targetSetpointCelsius: number;
  previousSetpointCelsius: number;
  currentTemperatureCelsius: number;
  restoreAt: string;
  gatewayId: string;
  gatewayMessage?: string;
  error?: string;
  isSimulation: true;
}

export interface DeviceGatewayStatus {
  id: string;
  name: string;
  protocol: "virtual" | "modbus" | "mqtt";
  connection: "online" | "offline";
  mode: "digital_twin";
  lastHeartbeatAt: string;
  connectedApplianceIds: string[];
  connectedAssetIds: string[];
  activeCommandCount: number;
}

// ==========================================
// 8. SIMULATION STATE & SCENARIOS
// ==========================================

export interface SimulationParameters {
  gridOutageDurationHours: number;
  solarDeratingFactor: number; // 0.0 - 1.2 (weather cloud cover)
  ambientTempOffsetCelsius: number; // ambient heat spike
  curtailDeferrableLoads: boolean;
  batteryReserveLimitPct: number; // minimum battery SOC to protect
  dieselPricePerLiter: number;
}

export interface SimulationResultPoint {
  hourOffset: number;
  gridStatus: boolean;
  solarPowerKw: number;
  batterySocPct: number;
  generatorPowerKw: number;
  unmetLoadKw: number;
  hourlyCostNgn: number;
}

export interface SimulationState {
  scenarioId: string;
  scenarioName: string;
  parameters: SimulationParameters;
  isSimulating: boolean;
  projectedCostNgn: number;
  projectedDieselBurnedLiters: number;
  estimatedBatteryEndSocPct: number;
  criticalAppliancesSafeguarded: boolean;
  results: SimulationResultPoint[];
}

// ==========================================
// 9. ENERGY EVENT & AUDIT RECORD
// ==========================================

export type EventSeverity = "info" | "warning" | "critical";

export type EventCategory =
  | "grid_event"
  | "generator_event"
  | "battery_event"
  | "appliance_state"
  | "ai_recommendation"
  | "system_security";

export interface EnergyEventRecord {
  id: string;
  siteId: string;
  timestamp: string;
  category: EventCategory;
  severity: EventSeverity;
  title: string;
  details: string;
  sourceAsset?: EnergySourceType;
  applianceId?: string;
  resolved: boolean;
  resolvedAt?: string;
}

// ==========================================
// 10. DASHBOARD METRICS SUMMARY
// ==========================================

export interface DashboardMetrics {
  site: BusinessSite;
  telemetry: TelemetrySummary;
  grid: GridSource;
  solar: SolarSource;
  battery: BatteryStatus;
  generator: GeneratorSource;
  cost: EnergyCostBreakdown;
  activeAlertsCount: number;
  pendingRecommendationsCount: number;
  lastTelemetryTimestamp: string;
}

// ==========================================
// 11. USER PROFILE, WORKSPACE & CONNECTED DEVICES
// ==========================================

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  avatarDataUrl?: string;
  role?: string;
  createdAt: string;
}

export type BusinessTypeOption =
  | "cold_storage"
  | "pharmacy"
  | "supermarket"
  | "clinic"
  | "other";

export interface Workspace {
  id: string;
  name: string;
  handle: string;
  businessType: BusinessTypeOption;
  businessTypeLabel?: string;
  location: string;
  logoDataUrl?: string;
  createdAt: string;
}

export type DevicePriority = "critical" | "important" | "nonessential";

export type DeviceCategory =
  | "cooling"
  | "power_sources"
  | "climate"
  | "operations";

export interface ConnectedDevice {
  id: string;
  name: string;
  deviceTypeId: string;
  category: DeviceCategory;
  ratedPowerKw: number;
  priority: DevicePriority;
  connectionState: "simulated" | "not_connected";
  source: "onboarding" | "manual" | "demo";
  createdAt: string;
  notes?: string;
}

export interface WorkspaceState {
  profile: UserProfile | null;
  workspace: Workspace | null;
  devices: ConnectedDevice[];
  invitedMembers?: { email: string; role: "member" | "admin" }[];
  welcomeDismissed: boolean;
  version: number;
}
