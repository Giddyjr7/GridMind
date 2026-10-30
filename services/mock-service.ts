import {
  IEnergyDataService,
  IApplianceService,
  IRecommendationService,
  IAuditService,
  IDeviceService,
  IWorkspaceService,
  IGridMindServices,
} from "./interfaces";
import { mockAuthService } from "./auth-service";
import {
  MOCK_SITE_PROFILE,
  MOCK_DASHBOARD_METRICS,
  MOCK_TELEMETRY_SERIES,
  MOCK_DAY_FORECAST,
  MOCK_APPLIANCES,
  MOCK_RECOMMENDATIONS,
  MOCK_APPROVAL_HISTORY,
  MOCK_ENERGY_EVENTS,
} from "@/mocks/demo-business";
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
  DeviceCommand,
  DeviceGatewayStatus,
  WorkspaceState,
} from "@/types/energy";

// Simulated network delay for realistic async behavior in mock mode
const simulateLatency = <T>(data: T, delayMs = 120): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), delayMs));

export class MockEnergyDataService implements IEnergyDataService {
  async getSiteProfile(): Promise<BusinessSite> {
    return simulateLatency(MOCK_SITE_PROFILE);
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return simulateLatency(MOCK_DASHBOARD_METRICS);
  }

  async getTelemetryHistory(limit = 24): Promise<EnergyReading[]> {
    return simulateLatency(MOCK_TELEMETRY_SERIES.slice(0, limit));
  }

  async getDayForecast(): Promise<DayForecast> {
    return simulateLatency(MOCK_DAY_FORECAST);
  }
}

export class MockApplianceService implements IApplianceService {
  private appliances: Appliance[] = [...MOCK_APPLIANCES];

  async getAppliances(): Promise<Appliance[]> {
    return simulateLatency(this.appliances);
  }

  async updateApplianceState(id: string, state: ApplianceState): Promise<Appliance> {
    const target = this.appliances.find((a) => a.id === id);
    if (!target) {
      throw new Error(`Appliance with id "${id}" not found.`);
    }
    target.state = state;
    if (state === "curtailed" || state === "off") {
      target.currentPowerKw = 0;
    } else if (state === "running") {
      target.currentPowerKw = target.ratedPowerKw * 0.9;
    }
    return simulateLatency(target);
  }
}

export class MockRecommendationService implements IRecommendationService {
  private recommendations: EnergyRecommendation[] = [...MOCK_RECOMMENDATIONS];
  private approvalHistory: ApprovalRecord[] = [...MOCK_APPROVAL_HISTORY];

  async evaluate(): Promise<{ recommendation: EnergyRecommendation | null }> {
    return simulateLatency({
      recommendation: this.recommendations.find((item) => item.status === "pending") ?? null,
    });
  }

  async getRecommendations(): Promise<EnergyRecommendation[]> {
    return simulateLatency(this.recommendations);
  }

  async approveRecommendation(
    id: string,
    approver: string,
    notes?: string
  ): Promise<ApprovalRecord> {
    const rec = this.recommendations.find((r) => r.id === id);
    if (!rec) {
      throw new Error(`Recommendation "${id}" not found.`);
    }
    rec.status = "approved";
    rec.appliedAt = new Date().toISOString();

    const record: ApprovalRecord = {
      id: `appr_${Date.now()}`,
      recommendationId: id,
      actionTaken: "approve",
      performedBy: approver,
      timestamp: new Date().toISOString(),
      notes: notes || "Approved via GridMind Console",
      savingsRealizedEstimateNgn: rec.estimatedSavingsNgn,
    };

    this.approvalHistory.unshift(record);
    return simulateLatency(record);
  }

  async rejectRecommendation(
    id: string,
    approver: string,
    reason?: string
  ): Promise<ApprovalRecord> {
    const rec = this.recommendations.find((r) => r.id === id);
    if (!rec) {
      throw new Error(`Recommendation "${id}" not found.`);
    }
    rec.status = "rejected";
    rec.rejectionReason = reason;

    const record: ApprovalRecord = {
      id: `appr_${Date.now()}`,
      recommendationId: id,
      actionTaken: "reject",
      performedBy: approver,
      timestamp: new Date().toISOString(),
      notes: reason || "Rejected by user",
    };

    this.approvalHistory.unshift(record);
    return simulateLatency(record);
  }

  async dismissRecommendation(id: string): Promise<EnergyRecommendation> {
    const rec = this.recommendations.find((item) => item.id === id);
    if (!rec) throw new Error(`Recommendation "${id}" not found.`);
    rec.status = "expired";
    return simulateLatency(rec);
  }

  async getApprovalHistory(): Promise<ApprovalRecord[]> {
    return simulateLatency(this.approvalHistory);
  }
}

export class MockDeviceService implements IDeviceService {
  async getGatewayStatus(): Promise<DeviceGatewayStatus> {
    return simulateLatency({
      id: "gateway_mock_01",
      name: "GridMind Mock Gateway",
      protocol: "virtual",
      connection: "online",
      mode: "digital_twin",
      lastHeartbeatAt: new Date().toISOString(),
      connectedApplianceIds: ["app_freezer_01"],
      connectedAssetIds: ["app_freezer_01", "src_grid_main", "src_solar_rooftop", "src_battery_ess", "src_gen_cummins"],
      activeCommandCount: 0,
    });
  }

  async getCommands(): Promise<DeviceCommand[]> { return simulateLatency([]); }
  async getCommand(): Promise<DeviceCommand> { throw new Error("No mock device command exists."); }
  async cancelCommand(): Promise<DeviceCommand> { throw new Error("No mock device command exists."); }
}

export class MockAuditService implements IAuditService {
  async getEvents(limit = 10): Promise<EnergyEventRecord[]> {
    return simulateLatency(MOCK_ENERGY_EVENTS.slice(0, limit));
  }
}

export class MockWorkspaceService implements IWorkspaceService {
  async getWorkspaceState(): Promise<WorkspaceState> {
    const { loadStoredWorkspaceState } = await import("@/lib/workspace-storage");
    return simulateLatency(loadStoredWorkspaceState());
  }

  async saveWorkspaceState(state: WorkspaceState): Promise<boolean> {
    const { saveStoredWorkspaceState } = await import("@/lib/workspace-storage");
    return simulateLatency(saveStoredWorkspaceState(state));
  }
}

export const mockServices: IGridMindServices = {
  energy: new MockEnergyDataService(),
  appliances: new MockApplianceService(),
  recommendations: new MockRecommendationService(),
  audit: new MockAuditService(),
  devices: new MockDeviceService(),
  auth: mockAuthService,
  workspace: new MockWorkspaceService(),
};


