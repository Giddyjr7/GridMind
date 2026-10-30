import { z } from "zod";

export const TelemetryPayloadSchema = z.object({
  version: z.literal("1.0"),
  sessionCode: z.string().min(4).max(10),
  timestamp: z.string(),
  grid: z.object({
    isAvailable: z.boolean(),
    tariffPerKwh: z.number().nonnegative(),
    voltageV: z.number().optional(),
    frequencyHz: z.number().optional(),
  }),
  solar: z.object({
    currentOutputKw: z.number().nonnegative(),
    isEnabled: z.boolean(),
  }),
  battery: z.object({
    stateOfChargePct: z.number().min(0).max(100),
    totalCapacityKwh: z.number().positive(),
    reserveFloorPct: z.number().min(0).max(100),
  }),
  generator: z.object({
    fuelCurrentLiters: z.number().nonnegative(),
    mode: z.enum(["standby", "running", "disabled", "out_of_fuel"]),
  }),
  loads: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      state: z.enum(["running", "curtailed", "off", "standby"]),
      currentPowerKw: z.number().nonnegative(),
      priority: z.enum(["critical", "important", "deferrable"]),
    })
  ).optional(),
});

export type TelemetryPayload = z.infer<typeof TelemetryPayloadSchema>;
