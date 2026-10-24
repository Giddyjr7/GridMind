"use client";

import * as React from "react";
import { Sliders, ThermometerSnowflake, Lightbulb, Shield, Power, User, Cpu, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSimulation } from "@/context/simulation-context";
import { formatPower } from "@/lib/formatters";

export default function EquipmentPage() {
  const { appliances, setApplianceState, params } = useSimulation();

  return (
    <PageContainer>
      <SectionHeading
        title="Equipment & Load Hierarchy"
        description="Establish operational dispatch priorities. In the event of a grid failure, nonessential deferrable equipment is automatically shed to preserve battery life for critical cold chains."
        badge={
          <Badge variant="healthy" size="sm" className="font-mono text-[10px]">
            {appliances.length} ASSETS SYNCHRONIZED
          </Badge>
        }
      />

      <div className="grid grid-cols-1 gap-3">
        {appliances.map((app) => (
          <Card key={app.id} className="p-4 hover:border-slate-300 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                    app.priority === "critical"
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : app.priority === "important"
                      ? "bg-amber-50 text-amber-600 border border-amber-200"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  }`}
                >
                  {app.category === "refrigeration" ? (
                    <ThermometerSnowflake className="h-5 w-5" />
                  ) : app.category === "lighting" ? (
                    <Lightbulb className="h-5 w-5" />
                  ) : (
                    <Power className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {app.name}
                    </h4>
                    {app.temperatureCritical && (
                      <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60">
                        {app.temperatureCritical.currentTempCelsius}°C
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {app.notes || "Standard operational load profile"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs shrink-0 flex-wrap">
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Demand</span>
                  <span className="font-mono font-bold text-slate-800">
                    {formatPower(app.currentPowerKw)}
                  </span>
                  <span className="text-slate-400 text-[10px] block">
                    Rated {formatPower(app.ratedPowerKw)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Priority Tier</span>
                  <Badge
                    variant={
                      app.priority === "critical"
                        ? "critical"
                        : app.priority === "important"
                        ? "warning"
                        : "healthy"
                    }
                    size="sm"
                    className="capitalize text-[10px]"
                  >
                    {app.priority}
                  </Badge>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Circuit State</span>
                  <div className="flex items-center gap-1">
                    <Badge
                      variant={
                        app.state === "running"
                          ? "healthy"
                          : app.state === "curtailed"
                          ? "critical"
                          : "neutral"
                      }
                      size="sm"
                      className="capitalize text-[10px]"
                    >
                      {app.state}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setApplianceState(
                        app.id,
                        app.state === "running" ? "curtailed" : "running",
                        true
                      )
                    }
                    className="text-xs px-2.5 py-1 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 font-medium text-slate-700 transition-colors"
                  >
                    {app.state === "running" ? "Curtail" : "Engage"}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
