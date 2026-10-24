import { apiAuthService } from "./auth-service";
import { envConfig } from "@/config/env";
import {
  IEnergyDataService,
  IApplianceService,
  IRecommendationService,
  IAuditService,
  IGridMindServices,
} from "./interfaces";
import {
  BusinessSite,
  DashboardMetrics,
  EnergyReading,
  DayForecast,
  Appliance,
  ApplianceState,
  EnergyRecommendation,
  ApprovalRecord,
  EnergyEventRecord,
} from "@/types/energy";

/**
 * ApiEnergyService is the future integration layer targeting the FastAPI backend.
 * Endpoints are stubbed to safely notify engineers until contracts are signed off.
 */

class ApiServiceBase {
  protected baseUrl: string;

  constructor() {
    this.baseUrl = envConfig.apiBaseUrl;
  }

  protected async fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
    if (!envConfig.isApi) {
      throw new Error(
        `API mode is disabled. Current mode is "${envConfig.dataMode}". Set NEXT_PUBLIC_DATA_MODE=api to enable real backend requests.`
      );
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`Backend API error (${response.status}): ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      const error = err as Error;
      throw new Error(
        `FastAPI Backend Request Failed [${endpoint}]: ${error.message}. Verify that the backend is running at ${this.baseUrl} and CORS is configured.`
      );
    }
  }
}

export class ApiEnergyDataService extends ApiServiceBase implements IEnergyDataService {
  async getSiteProfile(): Promise<BusinessSite> {
    return this.fetchJson<BusinessSite>("/site/profile");
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.fetchJson<DashboardMetrics>("/telemetry/dashboard-metrics");
  }

  async getTelemetryHistory(limit = 24): Promise<EnergyReading[]> {
    return this.fetchJson<EnergyReading[]>(`/telemetry/history?limit=${limit}`);
  }

  async getDayForecast(): Promise<DayForecast> {
    return this.fetchJson<DayForecast>("/forecast/today");
  }
}

export class ApiApplianceService extends ApiServiceBase implements IApplianceService {
  async getAppliances(): Promise<Appliance[]> {
    return this.fetchJson<Appliance[]>("/appliances");
  }

  async updateApplianceState(id: string, state: ApplianceState): Promise<Appliance> {
    return this.fetchJson<Appliance>(`/appliances/${id}/state`, {
      method: "PATCH",
      body: JSON.stringify({ state }),
    });
  }
}

export class ApiRecommendationService extends ApiServiceBase implements IRecommendationService {
  async getRecommendations(): Promise<EnergyRecommendation[]> {
    return this.fetchJson<EnergyRecommendation[]>("/recommendations");
  }

  async approveRecommendation(
    id: string,
    approver: string,
    notes?: string
  ): Promise<ApprovalRecord> {
    return this.fetchJson<ApprovalRecord>(`/recommendations/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ approver, notes }),
    });
  }

  async rejectRecommendation(
    id: string,
    approver: string,
    reason?: string
  ): Promise<ApprovalRecord> {
    return this.fetchJson<ApprovalRecord>(`/recommendations/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ approver, reason }),
    });
  }

  async getApprovalHistory(): Promise<ApprovalRecord[]> {
    return this.fetchJson<ApprovalRecord[]>("/recommendations/history");
  }
}

export class ApiAuditService extends ApiServiceBase implements IAuditService {
  async getEvents(limit = 10): Promise<EnergyEventRecord[]> {
    return this.fetchJson<EnergyEventRecord[]>(`/audit/events?limit=${limit}`);
  }
}

export const apiServices: IGridMindServices = {
  energy: new ApiEnergyDataService(),
  appliances: new ApiApplianceService(),
  recommendations: new ApiRecommendationService(),
  audit: new ApiAuditService(),
  auth: apiAuthService,
};
