import { envConfig } from "@/config/env";
import { mockServices } from "./mock-service";
import { apiServices } from "./api-service";
import {
  IGridMindServices,
  IEnergyDataService,
  IApplianceService,
  IRecommendationService,
  IAuditService,
  IAuthService,
} from "./interfaces";

/**
 * Service Factory
 * Returns either mock data providers (default) or real API clients depending
 * on the NEXT_PUBLIC_DATA_MODE environment configuration.
 */
export const services: IGridMindServices = envConfig.isApi ? apiServices : mockServices;

export const energyService: IEnergyDataService = services.energy;
export const applianceService: IApplianceService = services.appliances;
export const recommendationService: IRecommendationService = services.recommendations;
export const auditService: IAuditService = services.audit;
export const authService: IAuthService = services.auth;

export * from "./interfaces";
