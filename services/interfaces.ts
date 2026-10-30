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

import { IAuthService } from "@/types/auth";
export type { IAuthService };

export interface IEnergyDataService {
  getSiteProfile(): Promise<BusinessSite>;
  getDashboardMetrics(): Promise<DashboardMetrics>;
  getTelemetryHistory(limit?: number): Promise<EnergyReading[]>;
  getDayForecast(): Promise<DayForecast>;
}

export interface IApplianceService {
  getAppliances(): Promise<Appliance[]>;
  updateApplianceState(id: string, state: ApplianceState): Promise<Appliance>;
}

export interface IRecommendationService {
  evaluate(input?: Record<string, unknown>): Promise<{ recommendation: EnergyRecommendation | null }>;
  getRecommendations(): Promise<EnergyRecommendation[]>;
  approveRecommendation(
    id: string,
    approver: string,
    notes?: string
  ): Promise<ApprovalRecord>;
  rejectRecommendation(
    id: string,
    approver: string,
    reason?: string
  ): Promise<ApprovalRecord>;
  dismissRecommendation(id: string): Promise<EnergyRecommendation>;
  getApprovalHistory(): Promise<ApprovalRecord[]>;
}

export interface IDeviceService {
  getGatewayStatus(): Promise<DeviceGatewayStatus>;
  getCommands(): Promise<DeviceCommand[]>;
  getCommand(id: string): Promise<DeviceCommand>;
  cancelCommand(id: string, cancelledBy: string): Promise<DeviceCommand>;
}

export interface IAuditService {
  getEvents(limit?: number): Promise<EnergyEventRecord[]>;
}

export interface IWorkspaceService {
  getWorkspaceState(): Promise<WorkspaceState>;
  saveWorkspaceState(state: WorkspaceState): Promise<boolean>;
}

export interface IGridMindServices {
  energy: IEnergyDataService;
  appliances: IApplianceService;
  recommendations: IRecommendationService;
  audit: IAuditService;
  devices: IDeviceService;
  auth: IAuthService;
  workspace: IWorkspaceService;
}
