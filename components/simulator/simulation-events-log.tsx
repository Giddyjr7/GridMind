"use client";

import * as React from "react";
import {
  Clock,
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldAlert,
  Zap,
  Sliders,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSimulation } from "@/context/simulation-context";
import { formatDateTime } from "@/lib/formatters";

export function SimulationEventsLog() {
  const { events } = useSimulation();
  const [filter, setFilter] = React.useState<"all" | "grid" | "battery" | "appliance">("all");

  const filteredEvents = React.useMemo(() => {
    if (filter === "grid") return events.filter((e) => e.category === "grid_event");
    if (filter === "battery") return events.filter((e) => e.category === "battery_event");
    if (filter === "appliance") return events.filter((e) => e.category === "appliance_state");
    return events;
  }, [events, filter]);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="critical">Critical</Badge>;
      case "warning":
        return <Badge variant="warning">Warning</Badge>;
      case "info":
      default:
        return <Badge variant="neutral">Info</Badge>;
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            Simulation Event Audit Log
            <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 uppercase">
              Simulated Telemetry
            </span>
          </CardTitle>
          <p className="text-xs text-slate-500">
            Chronological audit of disturbances, setpoint overrides and policy dispatches
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-2 py-1 rounded font-medium transition-colors ${
              filter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            All ({events.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("grid")}
            className={`px-2 py-1 rounded font-medium transition-colors ${
              filter === "grid" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Grid
          </button>
          <button
            type="button"
            onClick={() => setFilter("battery")}
            className={`px-2 py-1 rounded font-medium transition-colors ${
              filter === "battery" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Battery
          </button>
          <button
            type="button"
            onClick={() => setFilter("appliance")}
            className={`px-2 py-1 rounded font-medium transition-colors ${
              filter === "appliance" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Loads
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 divide-y divide-slate-100 overflow-y-auto max-h-[360px]">
        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No simulation events logged for this filter category.
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div key={evt.id} className="p-3.5 hover:bg-slate-50/70 transition-colors flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {getSeverityBadge(evt.severity)}
                  <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    {evt.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                    [SIMULATED]
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-900">
                  {evt.title}
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {evt.details}
                </p>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0 font-mono">
                <Clock className="w-3 h-3 text-slate-400" />
                {formatDateTime(evt.timestamp)}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
