"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EnergyEventRecord } from "@/types";
import { formatDateTime } from "@/lib/formatters";

interface ActiveAlertsCardProps {
  initialAlerts: EnergyEventRecord[];
}

export function ActiveAlertsCard({ initialAlerts }: ActiveAlertsCardProps) {
  const [alerts, setAlerts] = React.useState<EnergyEventRecord[]>(initialAlerts);
  const [selectedAlert, setSelectedAlert] = React.useState<EnergyEventRecord | null>(null);
  const [filter, setFilter] = React.useState<"active" | "all">("active");

  const displayedAlerts = React.useMemo(() => {
    if (filter === "active") {
      return alerts.filter((a) => !a.resolved);
    }
    return alerts;
  }, [alerts, filter]);

  const activeCount = alerts.filter((a) => !a.resolved).length;

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, resolved: true, resolvedAt: new Date().toISOString() }
          : a
      )
    );
    if (selectedAlert && selectedAlert.id === alertId) {
      setSelectedAlert((prev) =>
        prev
          ? { ...prev, resolved: true, resolvedAt: new Date().toISOString() }
          : null
      );
    }
  };

  const getSeverityBadge = (severity: EnergyEventRecord["severity"]) => {
    switch (severity) {
      case "critical":
        return <Badge variant="critical">Critical</Badge>;
      case "warning":
        return <Badge variant="warning">Warning</Badge>;
      case "info":
      default:
        return <Badge variant="neutral">Advisory</Badge>;
    }
  };

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case "grid":
        return <Zap className="w-3.5 h-3.5 text-blue-600" />;
      case "generator":
        return <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />;
      case "solar":
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case "battery":
        return <Zap className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Info className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <>
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                Operational Alerts
                {activeCount > 0 ? (
                  <Badge variant="critical" size="sm" className="font-bold">
                    {activeCount} Active
                  </Badge>
                ) : (
                  <Badge variant="healthy" size="sm" className="font-bold">
                    All Clear
                  </Badge>
                )}
              </CardTitle>
              <p className="text-xs text-slate-500">
                Feeder telemetry, asset warnings and threshold breaches
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-300 text-xs">
            <button
              type="button"
              onClick={() => setFilter("active")}
              className={`px-2.5 py-1 rounded font-bold transition-colors ${
                filter === "active"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                  : "text-slate-700 hover:text-slate-950 font-semibold"
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded font-bold transition-colors ${
                filter === "all"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                  : "text-slate-700 hover:text-slate-950 font-semibold"
              }`}
            >
              All ({alerts.length})
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 divide-y divide-slate-100 overflow-y-auto max-h-[360px]">
          {displayedAlerts.length === 0 ? (
            <div className="py-10 text-center px-4">
              <CheckCircle2 className="w-9 h-9 text-emerald-500 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-slate-800">
                No active operational alerts
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
                All microgrid telemetry, feeder voltages and cold storage thermal thresholds are within safe bounds.
              </p>
            </div>
          ) : (
            displayedAlerts.map((alert) => (
              <button
                key={alert.id}
                type="button"
                onClick={() => setSelectedAlert(alert)}
                className="w-full text-left p-3.5 hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-3 group focus:outline-none focus:bg-slate-50"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getSeverityBadge(alert.severity)}
                    {alert.sourceAsset && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60 uppercase">
                        {getSourceIcon(alert.sourceAsset)}
                        {alert.sourceAsset}
                      </span>
                    )}
                    {alert.resolved && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Resolved
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-800 transition-colors truncate">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {alert.details}
                  </p>
                </div>

                <div className="flex flex-col items-end shrink-0 gap-1 text-slate-400">
                  <span suppressHydrationWarning className="text-[11px] flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    {formatDateTime(alert.timestamp)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))
          )}
        </CardContent>

        <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Click any event to inspect resolution instructions</span>
          <Link
            href="/dashboard/history"
            className="text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1 hover:underline"
          >
            Full Audit Log
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </Card>

      {/* Alert Details Dialog */}
      <Dialog
        isOpen={Boolean(selectedAlert)}
        onClose={() => setSelectedAlert(null)}
        title={selectedAlert?.title || "Alert Details"}
        description={
          selectedAlert
            ? `Logged at ${formatDateTime(selectedAlert.timestamp)} | Event ID: ${selectedAlert.id}`
            : undefined
        }
      >
        {selectedAlert && (
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Severity:</span>
              {getSeverityBadge(selectedAlert.severity)}
              <span className="text-xs text-slate-500 font-medium ml-2">Source:</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded uppercase">
                {getSourceIcon(selectedAlert.sourceAsset)}
                {selectedAlert.sourceAsset || "System"}
              </span>
              <span className="text-xs text-slate-500 font-medium ml-auto">
                Status:{" "}
                {selectedAlert.resolved ? (
                  <span className="text-emerald-600 font-semibold">Resolved</span>
                ) : (
                  <span className="text-rose-600 font-semibold">Active Action Required</span>
                )}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
              <h5 className="font-semibold text-slate-900 mb-1">Telemetry Description:</h5>
              {selectedAlert.details}
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200/70 p-3 rounded-lg text-xs space-y-1">
              <h5 className="font-semibold text-emerald-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-700" />
                Recommended Operator Protocol:
              </h5>
              <p className="text-emerald-800 leading-relaxed">
                Ensure Blast Freezer doors remain sealed during peak tariff transitions. If the Ikeja Feeder disconnects, GridMind automated ATS prioritization will safeguard medical biologics and cold room freezers while shedding deferrable packaging ACs.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <Link
                href="/dashboard/simulator"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                onClick={() => setSelectedAlert(null)}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Simulate Feeder Outage Scenario
              </Link>

              <div className="flex items-center gap-2">
                {!selectedAlert.resolved && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolveAlert(selectedAlert.id)}
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Acknowledge & Clear
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setSelectedAlert(null)}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
