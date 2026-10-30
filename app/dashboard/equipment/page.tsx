"use client";

import * as React from "react";
import {
  Sliders,
  ThermometerSnowflake,
  Lightbulb,
  Power,
  ShieldCheck,
  ShieldAlert,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EquipmentCard, ApplianceDetailsModal } from "@/components/equipment";
import { useSimulation, ApplianceWithSimMetadata } from "@/context/simulation-context";
import { Appliance } from "@/types/energy";
import { formatPower } from "@/lib/formatters";

export default function EquipmentPage() {
  const {
    appliances,
    setApplianceState,
    updateAppliance,
    flows,
    feedbackMessage,
    clearFeedback,
    resetToDefaultScenario,
  } = useSimulation();

  const [selectedAppliance, setSelectedAppliance] =
    React.useState<ApplianceWithSimMetadata | null>(null);

  // Group appliances by priority
  const criticalAppliances = appliances.filter((a) => a.priority === "critical");
  const importantAppliances = appliances.filter((a) => a.priority === "important");
  const deferrableAppliances = appliances.filter((a) => a.priority === "deferrable");

  const totalRatedKw = appliances.reduce((sum, a) => sum + a.ratedPowerKw, 0);

  const handleToggleState = (id: string, currentState: string) => {
    const nextState = currentState === "running" ? "curtailed" : "running";
    setApplianceState(id, nextState, true);
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Section Heading */}
        <SectionHeading
          title="Equipment & Load Hierarchy"
          description="Set load priorities and control which equipment can be reduced during an outage."
          badge={
            <Badge variant="neutral" size="sm">
              {appliances.length} assets
            </Badge>
          }
          actions={
            <div className="flex items-center gap-2">
              <Badge variant="healthy" size="sm">
                Protection active
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={resetToDefaultScenario}
                className="text-xs h-7 text-slate-600 border-slate-200 hover:bg-slate-50"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset Defaults
              </Button>
            </div>
          }
        />

        {/* Global Action Confirmation Toast */}
        {feedbackMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-in fade-in duration-200 shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{feedbackMessage}</span>
            </div>
            <button
              type="button"
              onClick={clearFeedback}
              className="text-[11px] text-emerald-700 hover:underline font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Summary Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Total Active Demand
            </span>
            <div className="text-xl font-extrabold text-slate-900 font-mono">
              {formatPower(flows.totalActiveDemandKw)}
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Rated: {formatPower(totalRatedKw)}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-none space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              Critical Cold Chain
            </span>
            <div className="text-xl font-extrabold text-slate-900 font-mono">
              {formatPower(flows.criticalDemandKw)}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              3 Assets Protected (0% Spoilage)
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-none space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              Important Infrastructure
            </span>
            <div className="text-xl font-extrabold text-slate-900 font-mono">
              {formatPower(flows.importantDemandKw)}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              2 Assets (Warehouse LED + IT)
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-none space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
              <Power className="w-3 h-3" />
              Sheddable Deferrable
            </span>
            <div className="text-xl font-extrabold text-slate-900 font-mono">
              {formatPower(flows.deferrableDemandKw)}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              HVAC & Admin Air Conditioning
            </p>
          </div>
        </div>

        {/* 1. Critical Refrigeration Appliances */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Critical Refrigeration Circuits (Zero Curtailment Tolerance)
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Subtotal: {formatPower(flows.criticalDemandKw)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {criticalAppliances.map((app) => (
              <EquipmentCard
                key={app.id}
                appliance={app}
                onToggleState={handleToggleState}
                onOpenDetails={(target) => setSelectedAppliance(target)}
              />
            ))}
          </div>
        </div>

        {/* 2. Important Appliances */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              Important Operational Assets (Warehouse Lighting & Security Rack)
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Subtotal: {formatPower(flows.importantDemandKw)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {importantAppliances.map((app) => (
              <EquipmentCard
                key={app.id}
                appliance={app}
                onToggleState={handleToggleState}
                onOpenDetails={(target) => setSelectedAppliance(target)}
              />
            ))}
          </div>
        </div>

        {/* 3. Deferrable Air Conditioners & HVAC */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Power className="w-4 h-4 text-emerald-600" />
              Deferrable Loads (Sheddable during Grid Failure)
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Subtotal: {formatPower(flows.deferrableDemandKw)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {deferrableAppliances.map((app) => (
              <EquipmentCard
                key={app.id}
                appliance={app}
                onToggleState={handleToggleState}
                onOpenDetails={(target) => setSelectedAppliance(target)}
              />
            ))}
          </div>
        </div>

        {/* Equipment Details & Configuration Modal */}
        <ApplianceDetailsModal
          appliance={selectedAppliance}
          isOpen={Boolean(selectedAppliance)}
          onClose={() => setSelectedAppliance(null)}
          onSaveConfig={(id, updates) => updateAppliance(id, updates)}
        />
      </div>
    </PageContainer>
  );
}
