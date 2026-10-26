"use client";

import * as React from "react";
import {
  Activity,
  TrendingUp,
  Cpu,
  Sparkles,
  UserCheck,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Database,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AgentWorkflowPipeline,
  PipelineStageItem,
  PipelineStageStatus,
} from "@/types/decision-intelligence";
import { useSimulation } from "@/context/simulation-context";

interface AgentPipelineWorkflowProps {
  pipeline: AgentWorkflowPipeline;
  className?: string;
}

export function AgentPipelineWorkflow({
  pipeline,
  className = "",
}: AgentPipelineWorkflowProps) {
  const [expandedStage, setExpandedStage] = React.useState<number | null>(null);
  const {
    activeRecommendation,
    approveRecommendation,
    rejectRecommendation,
  } = useSimulation();

  const stages: {
    index: number;
    title: string;
    stage: PipelineStageItem;
    icon: React.ElementType;
  }[] = [
    {
      index: 1,
      title: "Telemetry Ingest",
      stage: pipeline.telemetryStage,
      icon: Activity,
    },
    {
      index: 2,
      title: "Predictive Forecast",
      stage: pipeline.forecastStage,
      icon: TrendingUp,
    },
    {
      index: 3,
      title: "Decision Logic",
      stage: pipeline.decisionStage,
      icon: Cpu,
    },
    {
      index: 4,
      title: "AI Recommendation",
      stage: pipeline.recommendationStage,
      icon: Sparkles,
    },
    {
      index: 5,
      title: "Human Approval",
      stage: pipeline.humanApprovalStage,
      icon: UserCheck,
    },
  ];

  const getStatusBadge = (status: PipelineStageStatus) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="healthy" size="sm">
            <CheckCircle2 className="w-3 h-3 mr-1 inline" />
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="info" size="sm">
            <Clock className="w-3 h-3 mr-1 inline animate-spin" />
            Evaluating
          </Badge>
        );
      case "needs_attention":
        return (
          <Badge variant="warning" size="sm">
            <AlertCircle className="w-3 h-3 mr-1 inline" />
            Needs Action
          </Badge>
        );
      case "blocked":
        return (
          <Badge variant="critical" size="sm">
            <ShieldAlert className="w-3 h-3 mr-1 inline" />
            Blocked
          </Badge>
        );
      case "ready":
      default:
        return (
          <Badge variant="neutral" size="sm">
            Ready
          </Badge>
        );
    }
  };

  const getProvenanceBadge = (provenance: string) => {
    switch (provenance) {
      case "backend":
        return (
          <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
            Backend Telemetry
          </span>
        );
      case "simulated":
        return (
          <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
            Simulated Benchmark
          </span>
        );
      case "stale":
      case "missing":
        return (
          <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
            Data Quality Alert
          </span>
        );
      default:
        return null;
    }
  };

  const toggleExpand = (idx: number) => {
    setExpandedStage((prev) => (prev === idx ? null : idx));
  };

  return (
    <Card className={`border-slate-200/90 bg-white shadow-xs ${className}`}>
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-700" />
                Data-to-Decision Agent Pipeline
              </CardTitle>
              <Badge variant="healthy" size="sm" className="font-semibold text-[11px]">
                5-Stage Flow
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              The Data Powering AI Agents: telemetry ingestion, dynamic forecasting, constraint solving, and human dispatch
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">
              Pipeline Status:
            </span>
            {getStatusBadge(pipeline.overallStatus)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* 5-Step Pipeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {stages.map(({ index, title, stage, icon: Icon }) => {
            const isExpanded = expandedStage === index;
            const isAttention = stage.status === "needs_attention";
            const isCompleted = stage.status === "completed";

            return (
              <div
                key={index}
                className={`relative rounded-xl border p-3.5 transition-all cursor-pointer flex flex-col justify-between ${
                  isAttention
                    ? "border-amber-300 bg-amber-50/30 ring-1 ring-amber-200"
                    : isCompleted
                    ? "border-emerald-200/80 bg-emerald-50/20 hover:border-emerald-300"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
                onClick={() => toggleExpand(index)}
              >
                <div>
                  {/* Step header */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                          isAttention
                            ? "bg-amber-100 text-amber-900"
                            : isCompleted
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {index}
                      </div>
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {title}
                      </span>
                    </div>
                    <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  </div>

                  {/* Status badge */}
                  <div className="mb-2">
                    {getStatusBadge(stage.status)}
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {stage.summary}
                  </p>
                </div>

                {/* Footer with provenance & toggle */}
                <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                  <div>{getProvenanceBadge(stage.provenance)}</div>
                  <button
                    type="button"
                    className="text-slate-500 hover:text-slate-800 p-0.5"
                    aria-label={isExpanded ? "Collapse step details" : "Expand step details"}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expandable Details Drawer */}
        {expandedStage !== null && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Stage {expandedStage} Inspection: {stages[expandedStage - 1].title}
                </span>
                {getProvenanceBadge(stages[expandedStage - 1].stage.provenance)}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-slate-600"
                onClick={() => setExpandedStage(null)}
              >
                Close Details
              </Button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {stages[expandedStage - 1].stage.label}: {stages[expandedStage - 1].stage.summary}
            </p>

            {/* Key-Value Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2">
              {Object.entries(stages[expandedStage - 1].stage.details).map(
                ([key, val]) => (
                  <div
                    key={key}
                    className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs"
                  >
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                      {key.replace(/([A-Z])/g, " $1")}
                    </div>
                    <div className="text-xs font-bold text-slate-900 truncate mt-0.5">
                      {typeof val === "boolean"
                        ? val
                          ? "Active / Yes"
                          : "Inactive / No"
                        : String(val)}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Human in the loop action banner when recommendation is pending */}
        {activeRecommendation && activeRecommendation.status === "pending" && (
          <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 text-amber-900">
                <UserCheck className="w-4 h-4 text-amber-800" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Operator Decision Required
                  </span>
                  <Badge variant="warning" size="sm">
                    Stage 5 Gate
                  </Badge>
                </div>
                <p className="text-xs text-slate-700 mt-0.5">
                  Recommendation: {activeRecommendation.suggestedAction}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs border-slate-300 text-slate-700 hover:bg-slate-100"
                onClick={() =>
                  rejectRecommendation(
                    activeRecommendation.id,
                    "Operator declined via Agent Workflow console."
                  )
                }
              >
                Reject Action
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                onClick={() =>
                  approveRecommendation(
                    activeRecommendation.id,
                    "Operator approved via Agent Workflow console."
                  )
                }
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Approve & Dispatch
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
