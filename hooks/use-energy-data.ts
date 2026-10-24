"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardMetrics } from "@/types/energy";
import { energyService } from "@/services";
import { envConfig } from "@/config/env";

export interface UseEnergyDataState {
  data: DashboardMetrics | null;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
}

/**
 * Reusable hook to fetch and optionally poll energy dashboard metrics
 * via the active service layer (Mock or FastAPI).
 */
export function useEnergyData(autoRefresh = false): UseEnergyDataState {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const metrics = await energyService.getDashboardMetrics();
      setData(metrics);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error("Failed to load telemetry"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      fetchData();
    }, envConfig.refreshIntervalMs);

    return () => clearInterval(intervalId);
  }, [fetchData, autoRefresh]);

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refetch: fetchData,
  };
}
