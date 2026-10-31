import { envConfig } from "@/config/env";
import type { TelemetryPayload } from "./schema";

export type BackendLinkStatus = "idle" | "linked" | "unreachable";

/**
 * Minimum gap between backend writes. The twin broadcasts every 3s for a
 * responsive dashboard, but every ingest call is persisted as a telemetry row,
 * so the heartbeat is throttled. A changed grid state bypasses this: an outage
 * has to reach the risk model immediately, not up to ten seconds late.
 */
const HEARTBEAT_INTERVAL_MS = 10_000;

/** The backend keeps any field we omit, so only what the twin knows is sent. */
function toIngestBody(payload: TelemetryPayload) {
  const generatorRunning = payload.generator.mode === "running";

  return {
    timestamp: payload.timestamp,
    gridAvailable: payload.grid.isAvailable,
    voltageV: payload.grid.voltageV,
    frequencyHz: payload.grid.frequencyHz,
    gridTariffPerKwhNgn: payload.grid.tariffPerKwh,
    solarGenerationKw: payload.solar.currentOutputKw,
    batterySocPct: payload.battery.stateOfChargePct,
    batteryCapacityKwh: payload.battery.totalCapacityKwh,
    batteryReservePct: payload.battery.reserveFloorPct,
    generatorAvailable: payload.generator.mode !== "disabled" && payload.generator.mode !== "out_of_fuel",
    // The console models generator mode, not output, so a running generator
    // leaves the stored kW alone instead of inventing a figure.
    ...(generatorRunning ? {} : { generatorOutputKw: 0 }),
    source: "digital_twin" as const,
  };
}

export class BackendIngestBridge {
  private lastSentAt = 0;
  private lastGridAvailable: boolean | null = null;
  private inFlight = false;

  /**
   * Forwards a twin payload to the API. Returns the resulting link status, or
   * null when this payload was skipped by the throttle.
   */
  async forward(payload: TelemetryPayload, force = false): Promise<BackendLinkStatus | null> {
    const gridChanged = this.lastGridAvailable !== null
      && this.lastGridAvailable !== payload.grid.isAvailable;
    const dueForHeartbeat = Date.now() - this.lastSentAt >= HEARTBEAT_INTERVAL_MS;

    if (!force && !gridChanged && !dueForHeartbeat) {
      this.lastGridAvailable = payload.grid.isAvailable;
      return null;
    }
    // A write already in flight means the API is slow, not that a new one is
    // needed; queueing them would pile up rows and hide the real latency.
    if (this.inFlight) return null;

    this.inFlight = true;
    this.lastSentAt = Date.now();
    this.lastGridAvailable = payload.grid.isAvailable;

    try {
      const response = await fetch(`${envConfig.apiBaseUrl}/telemetry/ingest`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(toIngestBody(payload)),
      });
      return response.ok ? "linked" : "unreachable";
    } catch {
      return "unreachable";
    } finally {
      this.inFlight = false;
    }
  }

  /**
   * Asks the API to run its notification triggers now rather than waiting for
   * the next poll, so a demo outage alerts within a second of the toggle.
   */
  async requestNotificationScan(): Promise<void> {
    await fetch(`${envConfig.apiBaseUrl}/notifications/scan`, { method: "POST" }).catch(
      () => undefined
    );
  }
}
