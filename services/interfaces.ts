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
  getApprovalHistory(): Promise<ApprovalRecord[]>;
}

export interface IAuditService {
  getEvents(limit?: number): Promise<EnergyEventRecord[]>;
}

export interface IGridMindServices {
  energy: IEnergyDataService;
  appliances: IApplianceService;
  recommendations: IRecommendationService;
  audit: IAuditService;
}
