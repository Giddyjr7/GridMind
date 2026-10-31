import { envConfig } from "@/config/env";

/** Priorities the backend inventory accepts. */
export type SitePriority = "critical" | "important" | "deferrable";

/**
 * Equipment as the backend stores it. Deliberately looser than the dashboard's
 * `Appliance` type: category is free text there so a site can register
 * equipment the built-in catalogue never anticipated.
 */
export interface SiteAppliance {
  id: string;
  siteId: string;
  name: string;
  category: string;
  priority: SitePriority;
  state: "running" | "curtailed" | "off" | "standby";
  ratedPowerKw: number;
  currentPowerKw: number;
  dailyConsumptionKwh: number;
  isControllable: boolean;
  notes?: string;
  telemetryStatus?: "online" | "stale" | "offline";
  healthPct?: number;
}

export interface SiteSourceConfig {
  gridTariffPerKwhNgn: number;
  solarCapacityKwp: number;
  batteryCapacityKwh: number;
  batteryReservePct: number;
  generatorCapacityKva: number;
  generatorFuelLiters: number;
  dieselPricePerLiterNgn: number;
  inverterEfficiencyPct: number;
}

export interface SiteApplianceInput {
  name: string;
  category: string;
  priority: SitePriority;
  ratedPowerKw: number;
  isControllable?: boolean;
  notes?: string;
}

export interface SiteRegistration {
  id: string;
  name: string;
  industry: string;
  location: string | null;
  isProvisioned: boolean;
  sources?: SiteSourceConfig;
  appliances: SiteAppliance[];
  updatedAt?: string;
}

export interface ProvisionSiteInput {
  name: string;
  industry?: string;
  location?: string;
  appliances?: SiteApplianceInput[];
  sources?: Partial<SiteSourceConfig>;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${envConfig.apiBaseUrl}${path}`, {
    headers: { "content-type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(body || `Request to ${path} failed with ${response.status}.`);
  }
  return response.json() as Promise<T>;
}

/**
 * The registered site is the single inventory the backend, the MQTT twin and
 * both risk models read. Signup writes here so a business and its equipment
 * survive a browser wipe and actually reach the telemetry pipeline.
 */
export const siteService = {
  getRegistration: () => request<SiteRegistration>("/site/registration"),

  provision: (input: ProvisionSiteInput) =>
    request<SiteRegistration>("/site/provision", { method: "POST", body: JSON.stringify(input) }),

  updateSources: (sources: Partial<SiteSourceConfig>) =>
    request<SiteRegistration>("/site/sources", { method: "PUT", body: JSON.stringify(sources) }),

  addAppliance: (appliance: SiteApplianceInput) =>
    request<SiteAppliance[]>("/site/appliances", { method: "POST", body: JSON.stringify(appliance) }),

  removeAppliance: (id: string) =>
    request<SiteAppliance[]>(`/site/appliances/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
