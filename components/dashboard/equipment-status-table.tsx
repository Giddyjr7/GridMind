"use client";

import * as React from "react";
import Link from "next/link";
import {
  ThermometerSnowflake,
  Lightbulb,
  Power,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Appliance } from "@/types/energy";
import { formatPower } from "@/lib/formatters";

interface EquipmentStatusTableProps {
  appliances: Appliance[];
}

export function EquipmentStatusTable({ appliances }: EquipmentStatusTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>Equipment Priority & Circuit Status</CardTitle>
            <CardDescription>
              Continuous load monitoring and automated shedding safeguards across facility assets
            </CardDescription>
          </div>
          <Link
            href="/dashboard/equipment"
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 shrink-0"
          >
            Manage Hierarchy
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        <div className="divide-y divide-slate-100">
          {appliances.map((app) => {
            // Determine operational safeguarding status
            const isProtected = app.priority === "critical";
            const isCurtailed = app.state === "curtailed";

            return (
              <div
                key={app.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors px-2 rounded-lg"
              >
                {/* Equipment Identity & Category Icon */}
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                      app.category === "refrigeration"
                        ? "bg-blue-50 text-blue-600 border border-blue-200/80"
                        : app.category === "lighting"
                        ? "bg-amber-50 text-amber-600 border border-amber-200/80"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
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
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {app.name}
                      </h4>
                      {app.temperatureCritical && (
                        <span className="font-mono text-[10px] font-bold text-sky-950 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                          {app.temperatureCritical.currentTempCelsius}°C
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm truncate">
                      {app.notes || `Rated at ${formatPower(app.ratedPowerKw)}`}
                    </p>
                  </div>
                </div>

                {/* Demand & Safeguard Badges */}
                <div className="flex items-center gap-3.5 text-xs shrink-0 pl-12 sm:pl-0">
                  {/* Power Reading */}
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900">
                      {formatPower(app.currentPowerKw)}
                    </span>
                    <span className="text-slate-400 text-[10px] block">
                      Rated: {formatPower(app.ratedPowerKw)}
                    </span>
                  </div>

                  {/* Priority Tier */}
                  <Badge
                    variant={
                      app.priority === "critical"
                        ? "critical"
                        : app.priority === "important"
                        ? "warning"
                        : "healthy"
                    }
                    size="sm"
                    className="capitalize font-mono text-[10px] min-w-[70px] justify-center"
                  >
                    {app.priority}
                  </Badge>

                  {/* Safeguard Status */}
                  <div className="min-w-[90px] text-right">
                    {isProtected ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-950">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                        Protected
                      </span>
                    ) : isCurtailed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-950 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        Shed Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                        Running
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
