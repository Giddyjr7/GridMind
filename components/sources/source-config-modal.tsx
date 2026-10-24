"use client";

import * as React from "react";
import { Sliders, Save, RotateCcw, AlertTriangle, Zap, Sun, BatteryCharging, Power } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SimulationParams } from "@/lib/simulation-engine";
import { formatCurrency } from "@/lib/formatters";

interface SourceConfigModalProps {
  sourceType: "grid" | "solar" | "battery" | "generator" | null;
  params: SimulationParams;
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (
    source: "grid" | "solar" | "battery" | "generator",
    updates: Partial<SimulationParams>
  ) => void;
}

export function SourceConfigModal({
  sourceType,
  params,
  isOpen,
  onClose,
  onSaveConfig,
}: SourceConfigModalProps) {
  // Local state for all editable parameters
  const [gridTariff, setGridTariff] = React.useState<number>(params.gridTariffPerKwhNgn);
  const [contractedDemand, setContractedDemand] = React.useState<number>(
    params.contractedDemandLimitKw ?? 150
  );

  const [solarCapacity, setSolarCapacity] = React.useState<number>(
    params.solarInstalledCapacityKwp ?? 75
  );

  const [batteryFloor, setBatteryFloor] = React.useState<number>(
    params.batteryReserveFloorPct
  );
  const [inverterEfficiency, setInverterEfficiency] = React.useState<number>(
    params.inverterEfficiencyPct
  );

  const [fuelCost, setFuelCost] = React.useState<number>(params.fuelCostPerLiterNgn);
  const [generatorCapacity, setGeneratorCapacity] = React.useState<number>(
    params.generatorRatedCapacityKw ?? 128
  );

  const [error, setError] = React.useState<string | null>(null);

  // Sync state when opened
  React.useEffect(() => {
    if (isOpen) {
      setGridTariff(params.gridTariffPerKwhNgn);
      setContractedDemand(params.contractedDemandLimitKw ?? 150);
      setSolarCapacity(params.solarInstalledCapacityKwp ?? 75);
      setBatteryFloor(params.batteryReserveFloorPct);
      setInverterEfficiency(params.inverterEfficiencyPct);
      setFuelCost(params.fuelCostPerLiterNgn);
      setGeneratorCapacity(params.generatorRatedCapacityKw ?? 128);
      setError(null);
    }
  }, [isOpen, params]);

  if (!sourceType) return null;

  const handleSave = () => {
    setError(null);

    if (sourceType === "grid") {
      if (gridTariff <= 0 || gridTariff > 1000) {
        setError("Grid tariff must be between ₦1.00 and ₦1,000.00 / kWh.");
        return;
      }
      if (contractedDemand <= 0 || contractedDemand > 500) {
        setError("Contracted demand must be between 10 kW and 500 kW.");
        return;
      }
      onSaveConfig("grid", {
        gridTariffPerKwhNgn: Math.round(gridTariff * 100) / 100,
        contractedDemandLimitKw: Math.round(contractedDemand),
      });
    } else if (sourceType === "solar") {
      if (solarCapacity <= 0 || solarCapacity > 500) {
        setError("Solar capacity must be between 5 kWp and 500 kWp.");
        return;
      }
      onSaveConfig("solar", {
        solarInstalledCapacityKwp: Math.round(solarCapacity),
      });
    } else if (sourceType === "battery") {
      if (batteryFloor < 5 || batteryFloor > 50) {
        setError("Emergency reserve floor must be configured between 5% and 50% SOC.");
        return;
      }
      if (inverterEfficiency < 75 || inverterEfficiency > 99) {
        setError("Inverter efficiency must be between 75% and 99%.");
        return;
      }
      onSaveConfig("battery", {
        batteryReserveFloorPct: Math.round(batteryFloor),
        inverterEfficiencyPct: Math.round(inverterEfficiency),
      });
    } else if (sourceType === "generator") {
      if (fuelCost <= 0 || fuelCost > 5000) {
        setError("Diesel price must be between ₦100 and ₦5,000 per liter.");
        return;
      }
      if (generatorCapacity <= 0 || generatorCapacity > 500) {
        setError("Generator rated capacity must be between 20 kW and 500 kW.");
        return;
      }
      onSaveConfig("generator", {
        fuelCostPerLiterNgn: Math.round(fuelCost),
        generatorRatedCapacityKw: Math.round(generatorCapacity),
      });
    }

    onClose();
  };

  const getDialogTitle = () => {
    switch (sourceType) {
      case "grid":
        return "Configure Utility Grid Parameters";
      case "solar":
        return "Configure Solar PV Array Parameters";
      case "battery":
        return "Configure Battery Storage (ESS) Parameters";
      case "generator":
        return "Configure Diesel Generator Parameters";
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={getDialogTitle()}
      description="Adjust technical parameters and commercial tariffs. Modifications instantly update microgrid calculations across the dashboard and simulator."
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs text-slate-700 pt-1">
        {error && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Grid Configuration */}
        {sourceType === "grid" && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="grid-tariff" className="block text-xs font-semibold text-slate-700">
                Utility Tariff Rate (₦/kWh):
              </label>
              <input
                id="grid-tariff"
                type="number"
                step="1"
                min="50"
                max="800"
                value={gridTariff}
                onChange={(e) => setGridTariff(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <span className="text-[10px] text-slate-400">
                Current baseline: ₦206.00/kWh (NERC Band A 11kV Feeder)
              </span>
            </div>

            <div className="space-y-1">
              <label htmlFor="contracted-demand" className="block text-xs font-semibold text-slate-700">
                Contracted Max Demand Limit (kW):
              </label>
              <input
                id="contracted-demand"
                type="number"
                step="5"
                min="50"
                max="300"
                value={contractedDemand}
                onChange={(e) => setContractedDemand(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <span className="text-[10px] text-slate-400">
                Substation fused capacity limit
              </span>
            </div>
          </div>
        )}

        {/* 2. Solar Configuration */}
        {sourceType === "solar" && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="solar-installed-kwp" className="block text-xs font-semibold text-slate-700">
                Installed Solar PV Capacity (kWp):
              </label>
              <input
                id="solar-installed-kwp"
                type="number"
                step="5"
                min="10"
                max="250"
                value={solarCapacity}
                onChange={(e) => setSolarCapacity(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <span className="text-[10px] text-slate-400">
                Rooftop monocrystalline array nameplate rating
              </span>
            </div>
          </div>
        )}

        {/* 3. Battery Configuration */}
        {sourceType === "battery" && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="battery-reserve-floor" className="block text-xs font-semibold text-slate-700">
                Emergency Reserve Floor (% SOC):
              </label>
              <input
                id="battery-reserve-floor"
                type="number"
                step="1"
                min="5"
                max="40"
                value={batteryFloor}
                onChange={(e) => setBatteryFloor(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <span className="text-[10px] text-slate-400">
                Minimum SOC reserved exclusively for vaccine & critical freezers (default: 20%)
              </span>
            </div>

            <div className="space-y-1">
              <label htmlFor="inverter-efficiency" className="block text-xs font-semibold text-slate-700">
                Inverter Round-Trip Conversion Efficiency (%):
              </label>
              <input
                id="inverter-efficiency"
                type="number"
                step="1"
                min="80"
                max="98"
                value={inverterEfficiency}
                onChange={(e) => setInverterEfficiency(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <span className="text-[10px] text-slate-400">
                Accounts for DC-AC and battery internal resistance losses (default: 92%)
              </span>
            </div>
          </div>
        )}

        {/* 4. Generator Configuration */}
        {sourceType === "generator" && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="diesel-price-per-liter" className="block text-xs font-semibold text-slate-700">
                Diesel Fuel Price (₦/Liter):
              </label>
              <input
                id="diesel-price-per-liter"
                type="number"
                step="10"
                min="500"
                max="2500"
                value={fuelCost}
                onChange={(e) => setFuelCost(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <span className="text-[10px] text-slate-400">
                Current local pump rate (default: ₦1,250/L)
              </span>
            </div>

            <div className="space-y-1">
              <label htmlFor="gen-rated-capacity" className="block text-xs font-semibold text-slate-700">
                Genset Prime Capacity (kW):
              </label>
              <input
                id="gen-rated-capacity"
                type="number"
                step="5"
                min="50"
                max="250"
                value={generatorCapacity}
                onChange={(e) => setGeneratorCapacity(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <span className="text-[10px] text-slate-400">
                Cummins 160kVA alternator = 128 kW prime @ 0.8 power factor
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setGridTariff(206);
              setContractedDemand(150);
              setSolarCapacity(75);
              setBatteryFloor(20);
              setInverterEfficiency(92);
              setFuelCost(1250);
              setGeneratorCapacity(128);
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
              Apply Settings
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
