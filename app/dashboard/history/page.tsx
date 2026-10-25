"use client";

import * as React from "react";
import {
  History,
  CheckCircle2,
  XCircle,
  User,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Coins,
  FileText,
  Activity,
  Download,
  Search,
  Filter,
  X,
  Zap,
  Layers,
  BatteryCharging,
  Fuel,
  Info,
} from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useSimulation } from "@/context/simulation-context";
import { formatDateTime, formatCurrency } from "@/lib/formatters";
import { exportDecisionHistoryToCsv } from "@/lib/csv-export";
import { ApprovalRecord, EnergyEventRecord } from "@/types/energy";

type ViewMode = "all" | "approvals" | "events";

export default function HistoryPage() {
  const { events, approvalHistory, recommendations } = useSimulation();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [viewMode, setViewMode] = React.useState<ViewMode>("all");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = React.useState<string>("all");
  const [selectedTimeRange, setSelectedTimeRange] = React.useState<"all" | "today" | "24h">("all");
  const [isExporting, setIsExporting] = React.useState<boolean>(false);

  // Filter Approvals
  const filteredApprovals = React.useMemo(() => {
    return approvalHistory.filter((appr) => {
      // Category filter
      if (selectedCategory !== "all" && selectedCategory !== "approvals") {
        if (selectedCategory === "approved" && appr.actionTaken !== "approve") return false;
        if (selectedCategory === "declined" && appr.actionTaken !== "reject") return false;
        if (selectedCategory !== "approved" && selectedCategory !== "declined") return false;
      }

      // Severity filter
      if (selectedSeverity !== "all") {
        if (selectedSeverity === "approved" && appr.actionTaken !== "approve") return false;
        if (selectedSeverity === "declined" && appr.actionTaken !== "reject") return false;
        if (selectedSeverity !== "approved" && selectedSeverity !== "declined") return false;
      }

      // Time range filter
      if (selectedTimeRange !== "all") {
        const itemDate = new Date(appr.timestamp).getTime();
        const now = new Date("2024-10-24T12:00:00Z").getTime(); // benchmark time
        const diffHours = (now - itemDate) / (1000 * 60 * 60);
        if (selectedTimeRange === "today" && diffHours > 24) return false;
        if (selectedTimeRange === "24h" && diffHours > 24) return false;
      }

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const targetRec = recommendations.find((r) => r.id === appr.recommendationId);
        const titleMatch = targetRec?.title.toLowerCase().includes(query) ?? false;
        const notesMatch = appr.notes?.toLowerCase().includes(query) ?? false;
        const userMatch = appr.performedBy.toLowerCase().includes(query);
        const idMatch = appr.recommendationId.toLowerCase().includes(query) || appr.id.toLowerCase().includes(query);

        if (!titleMatch && !notesMatch && !userMatch && !idMatch) {
          return false;
        }
      }

      return true;
    });
  }, [approvalHistory, recommendations, selectedCategory, selectedSeverity, selectedTimeRange, searchQuery]);

  // Filter Disturbance Events
  const filteredEvents = React.useMemo(() => {
    return events.filter((evt) => {
      // Category filter
      if (selectedCategory !== "all") {
        if (selectedCategory === "approvals" || selectedCategory === "approved" || selectedCategory === "declined") {
          return false;
        }
        if (selectedCategory !== evt.category) return false;
      }

      // Severity filter
      if (selectedSeverity !== "all") {
        if (selectedSeverity === "approved" || selectedSeverity === "declined") return false;
        if (selectedSeverity !== evt.severity) return false;
      }

      // Time range filter
      if (selectedTimeRange !== "all") {
        const itemDate = new Date(evt.timestamp).getTime();
        const now = new Date("2024-10-24T12:00:00Z").getTime();
        const diffHours = (now - itemDate) / (1000 * 60 * 60);
        if (selectedTimeRange === "today" && diffHours > 24) return false;
        if (selectedTimeRange === "24h" && diffHours > 24) return false;
      }

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = evt.title.toLowerCase().includes(query);
        const detailsMatch = evt.details.toLowerCase().includes(query);
        const assetMatch = evt.sourceAsset?.toLowerCase().includes(query) ?? false;
        const appMatch = evt.applianceId?.toLowerCase().includes(query) ?? false;
        const idMatch = evt.id.toLowerCase().includes(query);

        if (!titleMatch && !detailsMatch && !assetMatch && !appMatch && !idMatch) {
          return false;
        }
      }

      return true;
    });
  }, [events, selectedCategory, selectedSeverity, selectedTimeRange, searchQuery]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedSeverity !== "all" ||
    selectedTimeRange !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSeverity("all");
    setSelectedTimeRange("all");
  };

  const handleExportCsv = () => {
    setIsExporting(true);
    try {
      exportDecisionHistoryToCsv(filteredEvents, filteredApprovals);
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  const totalFilteredCount =
    (viewMode === "all" || viewMode === "approvals" ? filteredApprovals.length : 0) +
    (viewMode === "all" || viewMode === "events" ? filteredEvents.length : 0);

  return (
    <PageContainer>
      {/* Page Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <SectionHeading
          title="Decision History & Operational Audit Trail"
          description="Immutable chronological record of every operator authorization, human override, load-shedding event, and grid disturbance in the simulated microgrid."
          badge={
            <Badge variant="healthy" size="sm" className="font-mono text-[10px]">
              AUDITED LOGS
            </Badge>
          }
        />

        {/* Export CSV Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-xs flex items-center gap-2 active:scale-98"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isExporting ? "Exporting CSV..." : "Export Audit Log (CSV)"}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <Card className="border-slate-200">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit trail by action title, operator memo, asset, or ID..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("all")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  viewMode === "all"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Records ({filteredApprovals.length + filteredEvents.length})
              </button>
              <button
                type="button"
                onClick={() => setViewMode("approvals")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                  viewMode === "approvals"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileText className="w-3 h-3 text-emerald-600" />
                <span>Approvals ({filteredApprovals.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("events")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                  viewMode === "events"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Activity className="w-3 h-3 text-blue-600" />
                <span>Disturbances ({filteredEvents.length})</span>
              </button>
            </div>
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filter by:</span>
            </div>

            {/* Category Selector */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="all">All Event Categories</option>
              <option value="approvals">Operator Decisions (All)</option>
              <option value="approved">Authorized & Applied Only</option>
              <option value="declined">Declined by Operator Only</option>
              <option value="grid_event">Grid Feeder Events</option>
              <option value="generator_event">Generator Events</option>
              <option value="battery_event">Battery Energy Storage</option>
              <option value="ai_recommendation">AI Policy Triggers</option>
              <option value="system_security">Security & Scenario Events</option>
            </select>

            {/* Severity / Status Selector */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="all">All Severities / Statuses</option>
              <option value="critical">Critical Only</option>
              <option value="warning">Warning Only</option>
              <option value="info">Info / Routine Only</option>
              <option value="approved">Status: Authorized</option>
              <option value="declined">Status: Declined</option>
            </select>

            {/* Time Preset */}
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as "all" | "today" | "24h")}
              className="py-1 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="all">Time: All Simulated History</option>
              <option value="today">Time: Today Only</option>
              <option value="24h">Time: Past 24 Hours</option>
            </select>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="ml-auto text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 hover:underline text-xs"
              >
                <X className="w-3 h-3" />
                Clear Filters
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Entries List */}
      <div className="space-y-3">
        {totalFilteredCount === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="p-10">
              <EmptyState
                icon={<History className="h-6 w-6 text-slate-400" />}
                title="No Matching Audit Trail Records"
                description={
                  hasActiveFilters
                    ? "No events or authorizations match your current search terms and filter criteria."
                    : "No operational history recorded yet."
                }
                action={
                  hasActiveFilters ? (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-3 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      Reset All Filters
                    </button>
                  ) : undefined
                }
              />
            </CardContent>
          </Card>
        ) : (
          <>
            {/* 1. Operator Approval Records */}
            {(viewMode === "all" || viewMode === "approvals") &&
              filteredApprovals.map((record) => {
                const targetRec = recommendations.find((r) => r.id === record.recommendationId);
                const isApproved = record.actionTaken === "approve";

                return (
                  <Card
                    key={record.id}
                    className={`p-4 border transition-colors ${
                      isApproved
                        ? "border-emerald-200/90 bg-emerald-50/20 hover:border-emerald-300"
                        : "border-rose-200/90 bg-rose-50/20 hover:border-rose-300"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isApproved
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {isApproved ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <XCircle className="h-5 w-5" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-900">
                              {targetRec ? targetRec.title : `Action ${record.recommendationId}`}
                            </span>
                            <Badge
                              variant={isApproved ? "healthy" : "critical"}
                              size="sm"
                              className="capitalize font-mono text-[10px] font-bold"
                            >
                              {isApproved ? "Authorized & Applied" : "Declined by Operator"}
                            </Badge>
                            <span className="text-[10px] font-mono text-slate-500 font-semibold">
                              Ref: {record.recommendationId}
                            </span>
                            <Badge variant="warning" size="sm" className="font-mono text-[9px] uppercase font-bold">
                              [SIMULATED]
                            </Badge>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            <strong className="text-slate-800">Operator Audit Memo: </strong>
                            {record.notes || "Executed by authorized facility supervisor."}
                          </p>

                          <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 flex-wrap">
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                              <User className="w-3 h-3 text-slate-400" />
                              {record.performedBy}
                            </span>

                            {record.savingsRealizedEstimateNgn && isApproved && (
                              <span className="flex items-center gap-1 text-emerald-700 font-mono font-bold">
                                <Coins className="w-3 h-3" />
                                +{formatCurrency(record.savingsRealizedEstimateNgn, "NGN")} savings realized
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        suppressHydrationWarning
                        className="flex items-center gap-1.5 text-xs text-slate-400 font-mono shrink-0"
                      >
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDateTime(record.timestamp)}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}

            {/* 2. System Disturbance & Telemetry Events */}
            {(viewMode === "all" || viewMode === "events") &&
              filteredEvents.map((record) => {
                const isCritical = record.severity === "critical";
                const isWarning = record.severity === "warning";

                return (
                  <Card key={record.id} className="p-4 hover:border-slate-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isCritical
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : isWarning
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {isCritical ? (
                            <AlertTriangle className="h-5 w-5" />
                          ) : isWarning ? (
                            <AlertTriangle className="h-5 w-5" />
                          ) : (
                            <CheckCircle2 className="h-5 w-5" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-900">
                              {record.title}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 font-semibold">
                              ID: {record.id}
                            </span>
                            <Badge variant="neutral" size="sm" className="text-[9px] font-mono uppercase">
                              {record.category.replace("_", " ")}
                            </Badge>
                            <Badge variant="warning" size="sm" className="font-mono text-[9px] uppercase font-bold">
                              [SIMULATED]
                            </Badge>
                            {record.sourceAsset && (
                              <Badge variant="neutral" size="sm" className="capitalize text-[9px]">
                                Source: {record.sourceAsset}
                              </Badge>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {record.details}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                            <span className="font-medium text-slate-600">
                              Status: {record.resolved ? "Resolved / Mitigated" : "Active Advisory"}
                            </span>
                            {record.resolvedAt && (
                              <span suppressHydrationWarning>
                                • Cleared at {formatDateTime(record.resolvedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        suppressHydrationWarning
                        className="flex items-center gap-1.5 text-xs text-slate-400 font-mono shrink-0"
                      >
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDateTime(record.timestamp)}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
          </>
        )}
      </div>
    </PageContainer>
  );
}
