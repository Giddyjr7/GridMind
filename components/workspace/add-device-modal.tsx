"use client";

import * as React from "react";
import { X, Plus, AlertCircle, Info } from "lucide-react";
import {
  DEVICE_CATALOGUE,
  CATEGORY_LABELS,
  DeviceCatalogueItem,
} from "@/lib/device-catalogue";
import { ConnectedDevice, DeviceCategory, DevicePriority } from "@/types/energy";
import { cn } from "@/lib/utils";

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (device: Omit<ConnectedDevice, "id" | "createdAt">) => void;
}

export function AddDeviceModal({
  isOpen,
  onClose,
  onAdd,
}: AddDeviceModalProps) {
  const [selectedItem, setSelectedItem] = React.useState<DeviceCatalogueItem | null>(null);
  const [customName, setCustomName] = React.useState("");
  const [customPower, setCustomPower] = React.useState<number>(10);
  const [customPriority, setCustomPriority] = React.useState<DevicePriority>("important");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedItem(null);
      setCustomName("");
      setCustomPower(10);
      setCustomPriority("important");
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectTemplate = (item: DeviceCatalogueItem) => {
    setSelectedItem(item);
    setCustomName(item.name);
    setCustomPower(item.defaultPowerKw);
    setCustomPriority(item.defaultPriority);
    setError(null);
  };

  const handleSave = () => {
    if (!selectedItem) {
      setError("Please pick a device type from the catalogue.");
      return;
    }

    if (!customName.trim()) {
      setError("Device name is required.");
      return;
    }

    if (isNaN(customPower) || customPower <= 0) {
      setError("Rated power must be a positive number greater than 0 kW.");
      return;
    }

    onAdd({
      name: customName.trim(),
      deviceTypeId: selectedItem.typeId,
      category: selectedItem.category,
      ratedPowerKw: customPower,
      priority: customPriority,
      connectionState: "simulated",
      source: "manual",
    });

    onClose();
  };

  const categories: DeviceCategory[] = [
    "cooling",
    "power_sources",
    "climate",
    "operations",
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-device-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl rounded-[20px] border border-white/10 bg-[#0c1410] text-white shadow-2xl overflow-hidden z-10 my-8">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <h3 id="add-device-title" className="text-base font-medium">
              Connect a new device
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select equipment type and configure monitoring specifications.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="h-8 w-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-5">
          <div className="p-3 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-start gap-2.5 text-xs text-slate-400">
            <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Devices are monitored as simulated assets in this demonstration.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Device catalogue tiles */}
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
              1. Choose equipment type
            </span>

            {categories.map((cat) => {
              const items = DEVICE_CATALOGUE.filter((d) => d.category === cat);
              return (
                <div key={cat} className="space-y-2">
                  <span className="text-[11px] text-slate-500 block">
                    {CATEGORY_LABELS[cat]}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {items.map((item) => {
                      const isSelected = selectedItem?.typeId === item.typeId;
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.typeId}
                          type="button"
                          onClick={() => handleSelectTemplate(item)}
                          className={cn(
                            "p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5",
                            isSelected
                              ? "bg-emerald-950/50 border-emerald-500/60 ring-1 ring-emerald-500/30"
                              : "bg-white/[0.02] border-white/[0.08] hover:border-white/20"
                          )}
                        >
                          <span
                            className={cn(
                              "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border",
                              item.accentColor,
                              item.accentBorder,
                              item.iconColor
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-xs font-medium text-white truncate">
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form fields for the selected device */}
          {selectedItem && (
            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                2. Configure specifications
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block">Device name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="h-10 w-full rounded-xl border border-white/10 bg-[#080f0b] px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block">
                    Rated power (kW)
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={customPower}
                    onChange={(e) => setCustomPower(parseFloat(e.target.value) || 0)}
                    className="h-10 w-full rounded-xl border border-white/10 bg-[#080f0b] px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block">Priority</label>
                  <select
                    value={customPriority}
                    onChange={(e) =>
                      setCustomPriority(e.target.value as DevicePriority)
                    }
                    className="h-10 w-full rounded-xl border border-white/10 bg-[#080f0b] px-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-white/[0.02] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 h-10 rounded-xl border border-white/10 text-xs text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!selectedItem}
            className="px-5 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add device</span>
          </button>
        </div>
      </div>
    </div>
  );
}
