"use client";

import * as React from "react";
import {
  ThermometerSnowflake,
  Lightbulb,
  Power,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  User,
  Cpu,
  Settings,
  ChevronRight,
  Activity,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Appliance } from "@/types/energy";
import { ApplianceWithSimMetadata } from "@/context/simulation-context";
import { formatPower } from "@/lib/formatters";

interface EquipmentCardProps {
  appliance: ApplianceWithSimMetadata;
  onToggleState: (id: string, currentState: string) => void;
  onOpenDetails: (app: ApplianceWithSimMetadata) => void;
}

export function EquipmentCard({
  appliance,
  onToggleState,
  onOpenDetails,
}: EquipmentCardProps) {
  const isCritical = appliance.priority === "critical";
  const isRunning = appliance.state === "running";

  return (
    <Card className="p-4 hover:border-slate-300 transition-all bg-white shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        {/* Left: Identity, Icon & Metadata */}
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
              isCritical
                ? "bg-rose-50 text-rose-600 border border-rose-200"
                : appliance.priority === "important"
                ? "bg-amber-50 text-amber-600 border border-amber-200"
                : "bg-emerald-50 text-emerald-600 border border-emerald-200"
            }`}
          >
            {appliance.category === "refrigeration" ? (
              <ThermometerSnowflake className="w-5 h-5" />
            ) : appliance.category === "lighting" ? (
              <Lightbulb className="w-5 h-5" />
            ) : (
              <Power className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                {appliance.name}
              </h4>
              {isCritical && (
                <Badge variant="critical" size="sm" className="font-mono text-[10px] uppercase font-bold">
                  Zero Spoilage Tolerance
                </Badge>
              )}
              {appliance.temperatureCritical && (
                <span className="text-[10px] font-mono font-bold text-sky-950 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                  {appliance.temperatureCritical.currentTempCelsius}°C (Target: {appliance.temperatureCritical.targetCelsius}°C)
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-snug">
              {appliance.notes || "Standard industrial operational profile"}
            </p>
          </div>
        </div>

        {/* Right: Demand, Status, and Working Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-wrap">
          {/* Power Demand Reading */}
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Demand
            </span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {formatPower(appliance.currentPowerKw)}
            </span>
            <span className="text-slate-400 text-[10px] block font-mono">
              Rated {formatPower(appliance.ratedPowerKw)}
            </span>
          </div>

          {/* Priority Badge */}
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Priority
            </span>
            <Badge
              variant={
                isCritical
                  ? "critical"
                  : appliance.priority === "important"
                  ? "warning"
                  : "healthy"
              }
              size="sm"
              className="capitalize text-[10px] font-mono"
            >
              {appliance.priority}
            </Badge>
          </div>

          {/* Attribution Badge */}
          <div className="text-right hidden md:block">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">
              Control
            </span>
            {appliance.isManualOverride ? (
              <Badge variant="outline" size="sm" className="text-[10px] flex items-center gap-1 bg-slate-100 text-slate-900 border-slate-300 font-semibold">
                <User className="w-3 h-3 text-slate-700" />
                Manual
              </Badge>
            ) : (
              <Badge variant="healthy" size="sm" className="text-[10px] flex items-center gap-1 font-semibold">
                <Cpu className="w-3 h-3 text-emerald-950" />
                AI Policy
              </Badge>
            )}
          </div>

          {/* Circuit Operating State Badge */}
          <div className="text-right">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">
              State
            </span>
            <Badge
              variant={
                isRunning
                  ? "healthy"
                  : appliance.state === "curtailed"
                  ? "critical"
                  : "neutral"
              }
              size="sm"
              className="capitalize text-[10px] font-mono font-bold"
            >
              {appliance.state}
            </Badge>
          </div>

          {/* Working Controls */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={isRunning ? "outline" : "primary"}
              onClick={() => onToggleState(appliance.id, appliance.state)}
              className={`text-xs h-8 font-semibold ${
                isRunning
                  ? "border-slate-300 text-slate-800 hover:bg-slate-100"
                  : "bg-emerald-700 hover:bg-emerald-800 text-white"
              }`}
            >
              {isRunning ? "Curtail" : "Engage"}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenDetails(appliance)}
              className="text-xs h-8 text-emerald-900 border-emerald-300 hover:bg-emerald-50 font-semibold"
            >
              <Settings className="w-3.5 h-3.5 mr-1 text-emerald-700" />
              Configure
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
