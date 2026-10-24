"use client";

import * as React from "react";
import {
  ThermometerSnowflake,
  Lightbulb,
  Power,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  Info,
  Save,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Appliance, AppliancePriority, ApplianceState } from "@/types/energy";
import { formatPower } from "@/lib/formatters";
import { PriorityDowngradeWarningModal } from "./priority-downgrade-warning-modal";

interface ApplianceDetailsModalProps {
  appliance: Appliance | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (id: string, updates: Partial<Appliance>) => void;
}

export function ApplianceDetailsModal({
  appliance,
  isOpen,
  onClose,
  onSaveConfig,
}: ApplianceDetailsModalProps) {
  const [priority, setPriority] = React.useState<AppliancePriority>("critical");
  const [ratedPowerKw, setRatedPowerKw] = React.useState<number>(10);
  const [targetTemp, setTargetTemp] = React.useState<number>(-20);
  const [notes, setNotes] = React.useState<string>("");
  const [validationError, setValidationError] = React.useState<string | null>(null);

  // Downgrade warning dialog state
  const [warningModalOpen, setWarningModalOpen] = React.useState<boolean>(false);
  const [pendingPriority, setPendingPriority] = React.useState<"important" | "deferrable">("important");

  // Sync state when appliance opens
  React.useEffect(() => {
    if (appliance) {
      setPriority(appliance.priority);
      setRatedPowerKw(appliance.ratedPowerKw);
      if (appliance.temperatureCritical) {
        setTargetTemp(appliance.temperatureCritical.targetCelsius);
      }
      setNotes(appliance.notes || "");
      setValidationError(null);
    }
  }, [appliance]);

  if (!appliance) return null;

  const isFreezerOrSafe =
    appliance.category === "refrigeration" ||
    appliance.name.toLowerCase().includes("freezer") ||
    appliance.name.toLowerCase().includes("vaccine");

  const handlePrioritySelect = (newPriority: AppliancePriority) => {
    // If it's a freezer and currently critical, and user selects non-critical: prompt warning
    if (isFreezerOrSafe && appliance.priority === "critical" && newPriority !== "critical") {
      setPendingPriority(newPriority as "important" | "deferrable");
      setWarningModalOpen(true);
      return;
    }
    setPriority(newPriority);
  };

  const handleSave = () => {
    // Form validation
    if (isNaN(ratedPowerKw) || ratedPowerKw <= 0 || ratedPowerKw > 150) {
      setValidationError("Rated power must be a positive number up to 150 kW.");
      return;
    }

    const updates: Partial<Appliance> = {
      priority,
      ratedPowerKw: Math.round(ratedPowerKw * 10) / 10,
      notes,
    };

    if (appliance.temperatureCritical) {
      updates.temperatureCritical = {
        ...appliance.temperatureCritical,
        targetCelsius: targetTemp,
      };
    }

    onSaveConfig(appliance.id, updates);
    onClose();
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        title={`Asset Specifications: ${appliance.name}`}
        description={`Circuit ID: ${appliance.id} • Category: ${appliance.category.toUpperCase()}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-5 text-xs text-slate-700 max-h-[75vh] overflow-y-auto pr-1">
          {/* Validation Error banner */}
          {validationError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Current Operating Status Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/70 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Circuit State</span>
              <span className="font-bold text-slate-900 capitalize">{appliance.state}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Current Load</span>
              <span className="font-bold text-slate-900">{formatPower(appliance.currentPowerKw)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Rated Capacity</span>
              <span className="font-bold text-slate-900">{formatPower(appliance.ratedPowerKw)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Daily Energy</span>
              <span className="font-bold text-slate-900">{appliance.dailyConsumptionKwh} kWh</span>
            </div>
          </div>

          {/* Thermal Cold Chain Telemetry (if applicable) */}
          {appliance.temperatureCritical && (
            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950 uppercase tracking-wide flex items-center gap-1.5">
                  <ThermometerSnowflake className="w-4 h-4 text-blue-600" />
                  Thermal Refrigeration Telemetry
                </span>
                <span className="text-xs font-mono font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                  Current: {appliance.temperatureCritical.currentTempCelsius}°C
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1 text-slate-600">
                <div>
                  Min Allowed: <strong>{appliance.temperatureCritical.minAllowedCelsius}°C</strong>
                </div>
                <div>
                  Max Allowed: <strong>{appliance.temperatureCritical.maxAllowedCelsius}°C</strong>
                </div>
                <div>
                  Target Setpoint: <strong>{appliance.temperatureCritical.targetCelsius}°C</strong>
                </div>
              </div>
            </div>
          )}

          {/* Configuration Form */}
          <div className="space-y-4 pt-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              Editable Technical Configuration
            </h4>

            {/* Priority Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Dispatch Priority Tier:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handlePrioritySelect("critical")}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    priority === "critical"
                      ? "bg-rose-50 border-rose-300 text-rose-950 font-bold shadow-2xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-xs flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    Critical
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                    Zero curtailment tolerance
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePrioritySelect("important")}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    priority === "important"
                      ? "bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-2xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    Important
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                    Essential operations
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePrioritySelect("deferrable")}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    priority === "deferrable"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-2xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-xs flex items-center gap-1">
                    <Power className="w-3.5 h-3.5 text-emerald-600" />
                    Deferrable
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                    Sheddable during outage
                  </div>
                </button>
              </div>
            </div>

            {/* Rated Power Demand & Temperature Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label
                  htmlFor="rated-power-kw"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Rated Power Demand (kW):
                </label>
                <input
                  id="rated-power-kw"
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="120"
                  value={ratedPowerKw}
                  onChange={(e) => setRatedPowerKw(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
                />
                <span className="text-[10px] text-slate-400">
                  Bounds: 0.5 kW – 120.0 kW
                </span>
              </div>

              {appliance.temperatureCritical && (
                <div className="space-y-1">
                  <label
                    htmlFor="target-setpoint"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Target Setpoint (°C):
                  </label>
                  <input
                    id="target-setpoint"
                    type="number"
                    step="0.5"
                    min="-30"
                    max="15"
                    value={targetTemp}
                    onChange={(e) => setTargetTemp(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
                  />
                  <span className="text-[10px] text-slate-400">
                    Safe range: {appliance.temperatureCritical.minAllowedCelsius}°C to {appliance.temperatureCritical.maxAllowedCelsius}°C
                  </span>
                </div>
              )}
            </div>

            {/* Circuit Notes */}
            <div className="space-y-1">
              <label
                htmlFor="circuit-notes"
                className="block text-xs font-semibold text-slate-700"
              >
                Circuit Operating Notes:
              </label>
              <textarea
                id="circuit-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Operational protocol notes..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setPriority(appliance.priority);
              setRatedPowerKw(appliance.ratedPowerKw);
              if (appliance.temperatureCritical) {
                setTargetTemp(appliance.temperatureCritical.targetCelsius);
              }
              setNotes(appliance.notes || "");
            }}
            className="text-xs text-slate-500"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Defaults
          </Button>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Save Configuration
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Downgrade Warning Dialog */}
      <PriorityDowngradeWarningModal
        appliance={appliance}
        newPriority={pendingPriority}
        isOpen={warningModalOpen}
        onClose={() => setWarningModalOpen(false)}
        onConfirmDowngrade={() => {
          setPriority(pendingPriority);
          setWarningModalOpen(false);
        }}
      />
    </>
  );
}
