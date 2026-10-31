"use client";

import * as React from "react";
import { Check, ArrowRight, Info, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { AuthCard, AuthCardBody, AuthCardFooter } from "@/components/auth/auth-card";
import {
  DEVICE_CATALOGUE,
  DeviceCatalogueItem,
  CATEGORY_LABELS,
} from "@/lib/device-catalogue";
import { ConnectedDevice, DeviceCategory, DevicePriority } from "@/types/energy";
import { cn } from "@/lib/utils";

interface Step3DevicesProps {
  initialDevices: ConnectedDevice[];
  onNext: (devices: ConnectedDevice[]) => void;
  onSkip: () => void;
}

export function Step3Devices({
  initialDevices,
  onNext,
  onSkip,
}: Step3DevicesProps) {
  // Store selected device state as a map of typeId -> ConnectedDevice
  const [selectedMap, setSelectedMap] = React.useState<Record<string, ConnectedDevice>>(
    () => {
      const map: Record<string, ConnectedDevice> = {};
      initialDevices.forEach((dev) => {
        map[dev.deviceTypeId] = dev;
      });
      return map;
    }
  );

  const [expandedTypeId, setExpandedTypeId] = React.useState<string | null>(null);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  // Group catalogue items by category
  const categories: DeviceCategory[] = [
    "cooling",
    "power_sources",
    "climate",
    "operations",
  ];

  const handleToggleSelect = (item: DeviceCatalogueItem) => {
    setSelectedMap((prev) => {
      const copy = { ...prev };
      if (copy[item.typeId]) {
        delete copy[item.typeId];
        if (expandedTypeId === item.typeId) {
          setExpandedTypeId(null);
        }
      } else {
        const newDevice: ConnectedDevice = {
          id: `dev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: item.name,
          deviceTypeId: item.typeId,
          category: item.category,
          ratedPowerKw: item.defaultPowerKw,
          priority: item.defaultPriority,
          connectionState: "simulated",
          source: "onboarding",
          createdAt: new Date().toISOString(),
        };
        copy[item.typeId] = newDevice;
        setExpandedTypeId(item.typeId);
      }
      return copy;
    });
    setValidationError(null);
  };

  const handleUpdateDevice = (
    typeId: string,
    updates: Partial<ConnectedDevice>
  ) => {
    setSelectedMap((prev) => {
      if (!prev[typeId]) return prev;
      return {
        ...prev,
        [typeId]: {
          ...prev[typeId],
          ...updates,
        },
      };
    });
  };

  const selectedCount = Object.keys(selectedMap).length;

  const handleContinue = () => {
    const devicesList = Object.values(selectedMap);

    // Validate that all selected devices have positive rated power
    for (const d of devicesList) {
      if (typeof d.ratedPowerKw !== "number" || isNaN(d.ratedPowerKw) || d.ratedPowerKw <= 0) {
        setValidationError(`"${d.name}" must have a rated power greater than 0 kW.`);
        setExpandedTypeId(d.deviceTypeId);
        return;
      }
      if (!d.name.trim()) {
        setValidationError("Device name cannot be blank.");
        setExpandedTypeId(d.deviceTypeId);
        return;
      }
    }

    onNext(devicesList);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <AuthCard>
        <AuthCardBody className="p-5 sm:p-7 space-y-6">
          {/* Honest Simulation Helper Notice */}
          <div className="p-3 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-start gap-2.5 text-xs text-slate-400">
            <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Devices begin in simulation. Live readings start only after a validated site gateway publishes telemetry.
            </p>
          </div>

          {validationError && (
            <div
              role="alert"
              className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Grouped Category Grids */}
          <div className="space-y-6">
            {categories.map((category) => {
              const items = DEVICE_CATALOGUE.filter((c) => c.category === category);
              if (items.length === 0) return null;

              return (
                <div key={category} className="space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    {CATEGORY_LABELS[category]}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {items.map((item) => {
                      const isSelected = Boolean(selectedMap[item.typeId]);
                      const Icon = item.icon;

                      return (
                        <div key={item.typeId} className="space-y-2">
                          <button
                            type="button"
                            onClick={() => handleToggleSelect(item)}
                            aria-pressed={isSelected}
                            className={cn(
                              "w-full p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[104px] relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070c0a]",
                              isSelected
                                ? "bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30"
                                : "bg-white/[0.02] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
                            )}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span
                                className={cn(
                                  "h-9 w-9 rounded-xl flex items-center justify-center border transition-colors",
                                  item.accentColor,
                                  item.accentBorder,
                                  item.iconColor
                                )}
                              >
                                <Icon className="h-4.5 w-4.5" />
                              </span>

                              {isSelected ? (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold">
                                  <Check className="h-3 w-3 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="h-4 w-4 rounded-full border border-white/20" />
                              )}
                            </div>

                            <span className="text-xs font-medium text-white line-clamp-2 leading-snug pt-2">
                              {item.name}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inline Editor Drawer for Selected Devices */}
          {selectedCount > 0 && (
            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Configure Selected Devices ({selectedCount})
                </span>
                <span className="text-[11px] text-slate-500">
                  Illustrative defaults, edit to match your equipment
                </span>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {Object.values(selectedMap).map((dev) => {
                  const isExpanded = expandedTypeId === dev.deviceTypeId;

                  return (
                    <div
                      key={dev.deviceTypeId}
                      className="p-3 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-3 transition-colors"
                    >
                      <div
                        onClick={() =>
                          setExpandedTypeId(isExpanded ? null : dev.deviceTypeId)
                        }
                        className="flex items-center justify-between cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </span>
                          <span className="text-xs font-medium text-white">
                            {dev.name}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {dev.ratedPowerKw} kW
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-slate-300">
                            {dev.priority}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/[0.04]">
                          {/* Name edit */}
                          <div className="space-y-1">
                            <label className="text-[11px] text-slate-400 block">
                              Name
                            </label>
                            <input
                              type="text"
                              value={dev.name}
                              onChange={(e) =>
                                handleUpdateDevice(dev.deviceTypeId, {
                                  name: e.target.value,
                                })
                              }
                              className="h-9 w-full rounded-lg border border-white/10 bg-[#080f0b] px-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>

                          {/* Rated power in kW */}
                          <div className="space-y-1">
                            <label className="text-[11px] text-slate-400 block">
                              Rated Power (kW)
                            </label>
                            <input
                              type="number"
                              min="0.1"
                              step="0.5"
                              value={dev.ratedPowerKw}
                              onChange={(e) =>
                                handleUpdateDevice(dev.deviceTypeId, {
                                  ratedPowerKw: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="h-9 w-full rounded-lg border border-white/10 bg-[#080f0b] px-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>

                          {/* Priority */}
                          <div className="space-y-1">
                            <label className="text-[11px] text-slate-400 block">
                              Priority
                            </label>
                            <select
                              value={dev.priority}
                              onChange={(e) =>
                                handleUpdateDevice(dev.deviceTypeId, {
                                  priority: e.target.value as DevicePriority,
                                })
                              }
                              className="h-9 w-full rounded-lg border border-white/10 bg-[#080f0b] px-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                              <option value="critical" className="bg-[#0c1410]">
                                Critical
                              </option>
                              <option value="important" className="bg-[#0c1410]">
                                Important
                              </option>
                              <option value="nonessential" className="bg-[#0c1410]">
                                Nonessential
                              </option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleContinue}
              className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-sm flex items-center justify-center gap-2 transition-all duration-150 shadow-[0_1px_15px_rgba(16,185,129,0.25)] hover:shadow-[0_1px_25px_rgba(16,185,129,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070c0a]"
            >
              <span>
                {selectedCount > 0
                  ? `Continue with ${selectedCount} ${selectedCount === 1 ? "device" : "devices"}`
                  : "Continue to team invite"}
              </span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </AuthCardBody>

        {/* Skip for now option */}
        <AuthCardFooter>
          <div className="text-center">
            <button
              type="button"
              onClick={onSkip}
              className="text-xs text-slate-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              Skip device selection for now
            </button>
            <p className="text-[11px] text-slate-500 mt-1">
              Monitoring requires at least one connected device, but you can add devices at any time.
            </p>
          </div>
        </AuthCardFooter>
      </AuthCard>
    </div>
  );
}
