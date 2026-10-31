/**
 * GridMind Telemetry Transport Layer
 * Provides seamless switching between MQTT over WebSockets and Local BroadcastChannel.
 */

import { TelemetryPayload } from "./schema";

export type TransportStatus =
  | "simulated"
  | "digital_twin_connected"
  | "digital_twin_offline";

export interface TelemetryTransport {
  status: TransportStatus;
  connect(sessionCode: string): Promise<void>;
  disconnect(): void;
  publish(sessionCode: string, payload: TelemetryPayload): void;
  subscribe(sessionCode: string, onMessage: (payload: TelemetryPayload) => void): () => void;
  onStatusChange(callback: (status: TransportStatus) => void): () => void;
}

export class LocalBroadcastTransport implements TelemetryTransport {
  public status: TransportStatus = "digital_twin_connected";
  private channel: BroadcastChannel | null = null;
  private subscribers = new Set<(payload: TelemetryPayload) => void>();
  private statusListeners = new Set<(status: TransportStatus) => void>();

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel("gridmind_twin_channel");
      this.channel.onmessage = (event) => {
        const payload = event.data as TelemetryPayload;
        this.subscribers.forEach((cb) => cb(payload));
      };
    }
  }

  async connect(sessionCode: string): Promise<void> {
    this.status = "digital_twin_connected";
    this.notifyStatus();
  }

  disconnect(): void {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.status = "digital_twin_offline";
    this.notifyStatus();
  }

  publish(sessionCode: string, payload: TelemetryPayload): void {
    if (this.channel) {
      this.channel.postMessage(payload);
    }
    // Also notify internal same-tab subscribers
    this.subscribers.forEach((cb) => cb(payload));
  }

  subscribe(sessionCode: string, onMessage: (payload: TelemetryPayload) => void): () => void {
    this.subscribers.add(onMessage);
    return () => {
      this.subscribers.delete(onMessage);
    };
  }

  onStatusChange(callback: (status: TransportStatus) => void): () => void {
    this.statusListeners.add(callback);
    callback(this.status);
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  private notifyStatus() {
    this.statusListeners.forEach((cb) => cb(this.status));
  }
}

/**
 * Hybrid MQTT Transport with automatic local fallback
 */
/** The topic a published payload lands on, so the UI can name it accurately. */
export function topicFor(sessionCode: string): string {
  return `gridmind/${sessionCode}/system/telemetry`;
}

export class HybridTwinTransport implements TelemetryTransport {
  public status: TransportStatus = "simulated";
  private localFallback = new LocalBroadcastTransport();
  private mqttClient: any = null;
  private currentSessionCode: string = "";
  private statusListeners = new Set<(status: TransportStatus) => void>();
  private messageListeners = new Set<(payload: TelemetryPayload) => void>();

  async connect(sessionCode: string): Promise<void> {
    this.currentSessionCode = sessionCode;

    if (typeof window === "undefined") {
      this.status = "simulated";
      this.notifyStatus();
      return;
    }

    try {
      // Connect local broadcast channel first to guarantee instant cross-tab sync
      await this.localFallback.connect(sessionCode);
      this.localFallback.subscribe(sessionCode, (payload) => {
        this.messageListeners.forEach((cb) => cb(payload));
      });
      this.status = "simulated";
      this.notifyStatus();

      // Try connecting to public WebSocket MQTT broker with timeout
      const mqttModule = await import("mqtt");
      const client = mqttModule.connect("wss://broker.emqx.io:8084/mqtt", {
        connectTimeout: 4000,
        reconnectPeriod: 10000,
        clientId: `gridmind_twin_${sessionCode}_${Math.random().toString(36).substring(2, 6)}`,
      });

      client.on("connect", () => {
        this.status = "digital_twin_connected";
        this.notifyStatus();
        const topic = `gridmind/${sessionCode}/+/telemetry`;
        client.subscribe(topic);
      });

      client.on("close", () => {
        // The local channel still carries messages between tabs, so this is a
        // downgrade to local-only rather than a full outage.
        if (this.status === "digital_twin_connected") {
          this.status = "simulated";
          this.notifyStatus();
        }
      });

      client.on("message", (topic, message) => {
        try {
          const parsed = JSON.parse(message.toString());
          this.messageListeners.forEach((cb) => cb(parsed));
        } catch {
          // ignore invalid JSON
        }
      });

      client.on("error", () => {
        // Fall back to the local channel, and say so: reporting a broker
        // connection that does not exist makes the console untrustworthy.
        this.status = "simulated";
        this.notifyStatus();
      });

      this.mqttClient = client;
    } catch {
      this.status = "simulated";
      this.notifyStatus();
    }
  }

  disconnect(): void {
    if (this.mqttClient) {
      try {
        this.mqttClient.end();
      } catch {
        // ignore
      }
      this.mqttClient = null;
    }
    this.localFallback.disconnect();
    this.status = "digital_twin_offline";
    this.notifyStatus();
  }

  publish(sessionCode: string, payload: TelemetryPayload): void {
    // 1. Publish to local channel for zero-latency local communication
    this.localFallback.publish(sessionCode, payload);

    // 2. Publish to MQTT broker if connected
    if (this.mqttClient && this.mqttClient.connected) {
      this.mqttClient.publish(topicFor(sessionCode), JSON.stringify(payload), { qos: 0 });
    }
  }

  /** True only while a real broker socket is open. */
  get brokerConnected(): boolean {
    return Boolean(this.mqttClient?.connected);
  }

  subscribe(sessionCode: string, onMessage: (payload: TelemetryPayload) => void): () => void {
    this.messageListeners.add(onMessage);
    return () => {
      this.messageListeners.delete(onMessage);
    };
  }

  onStatusChange(callback: (status: TransportStatus) => void): () => void {
    this.statusListeners.add(callback);
    callback(this.status);
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  private notifyStatus() {
    this.statusListeners.forEach((cb) => cb(this.status));
  }
}

let transportInstance: HybridTwinTransport | null = null;

export function getTwinTransport(): HybridTwinTransport {
  if (!transportInstance) {
    transportInstance = new HybridTwinTransport();
  }
  return transportInstance;
}
