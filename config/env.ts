/**
 * GridMind Environment & Application Configuration
 * Centralizes runtime environment variables and provides typed fallbacks.
 */

export type DataMode = "mock" | "api";

export interface AppConfig {
  appName: string;
  version: string;
  dataMode: DataMode;
  apiBaseUrl: string;
  isMock: boolean;
  isApi: boolean;
  refreshIntervalMs: number;
  /** VAPID public key for Web Push; empty disables the notification controls. */
  vapidPublicKey: string;
}

export const envConfig: AppConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "GridMind Intelligence",
  version: process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0-alpha",
  dataMode: (process.env.NEXT_PUBLIC_DATA_MODE as DataMode) || "mock",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1",
  get isMock(): boolean {
    return this.dataMode === "mock";
  },
  get isApi(): boolean {
    return this.dataMode === "api";
  },
  refreshIntervalMs: Number(process.env.NEXT_PUBLIC_REFRESH_INTERVAL_MS) || 15000,
  vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
};
