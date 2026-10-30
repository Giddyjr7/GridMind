"use client";

import * as React from "react";
import { Download, Sliders, RefreshCw, BarChart3, Info } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { useSimulation } from "@/context/simulation-context";
import {
  compute24HourAnalytics,
  OUTAGE_SCENARIO_PRESETS,
} from "@/lib/analytics-engine";
import { exportAnalyticsToCsv } from "@/lib/csv-export";
import {
  AnalyticsKpiStrip,
  AnalyticsCharts,
  BaselineComparisonSection,
} from "@/components/analytics";

export default function AnalyticsPage() {
  const { params, appliances, derivedDashboardMetrics } = useSimulation();
  const [selectedScenarioIndex, setSelectedScenarioIndex] = React.useState<number>(0);
  const [isExporting, setIsExporting] = React.useState<boolean>(false);

  // Recompute 24-hour analytics dynamically whenever params, appliances, or selected scenario changes
  const summary = React.useMemo(() => {
    return compute24HourAnalytics(params, appliances, selectedScenarioIndex);
  }, [params, appliances, selectedScenarioIndex]);

  const handleExportCsv = React.useCallback(() => {
    setIsExporting(true);
    try {
      exportAnalyticsToCsv(summary, derivedDashboardMetrics.site.name);
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  }, [summary, derivedDashboardMetrics.site.name]);

  return (
    <PageContainer>
      {/* Header with Title and Action Controls */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <SectionHeading
          title="Analytics"
          description="Compare cost, runtime and critical-load protection across outage scenarios."
          badge={
            <Badge variant="neutral" size="sm">
              Simulated data
            </Badge>
          }
        />

        {/* Working CSV Export Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-xs flex items-center gap-2 active:scale-98"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isExporting ? "Generating CSV..." : "Export Analytics (CSV)"}</span>
          </button>
        </div>
      </div>

      {/* Scenario Benchmark Selector */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Sliders className="w-4 h-4 text-brand-700" />
            <span>Simulated Outage Scenario Benchmark</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Select a grid feeder profile to simulate 24-hour performance against baseline ATS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {OUTAGE_SCENARIO_PRESETS.map((preset, idx) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => setSelectedScenarioIndex(idx)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedScenarioIndex === idx
                  ? "border-emerald-600 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-500/20"
                  : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold ${selectedScenarioIndex === idx ? "text-emerald-950" : "text-slate-800"}`}>
                  {preset.name}
                </span>
                {selectedScenarioIndex === idx && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 1. Analytics KPI Strip */}
      <AnalyticsKpiStrip summary={summary} />

      {/* 2. Responsive Recharts Visualizations */}
      <AnalyticsCharts summary={summary} />

      {/* 3. Fair Baseline Comparison Section */}
      <BaselineComparisonSection summary={summary} />
    </PageContainer>
  );
}
