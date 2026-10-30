"use client";

import * as React from "react";
import {
  Lightbulb,
  TrendingDown,
  Clock,
  Leaf,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowRight,
  Layers,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnergyRecommendation } from "@/types/energy";
import { formatCurrency, formatDateTime } from "@/lib/formatters";

interface RecommendationCardProps {
  recommendation: EnergyRecommendation;
  onInspect: (rec: EnergyRecommendation) => void;
  onRequestApprove: (rec: EnergyRecommendation) => void;
  onRequestReject: (rec: EnergyRecommendation) => void;
  onDismiss: (id: string) => void;
}

export function RecommendationCard({
  recommendation,
  onInspect,
  onRequestApprove,
  onRequestReject,
  onDismiss,
}: RecommendationCardProps) {
  const isPending = recommendation.status === "pending";
  const isApproved = recommendation.status === "approved";
  const isRejected = recommendation.status === "rejected";

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return <Badge variant="critical">Critical Priority</Badge>;
      case "warning":
        return <Badge variant="warning">High Leverage</Badge>;
      case "advisory":
      default:
        return <Badge variant="neutral">Advisory</Badge>;
    }
  };

  return (
    <Card className={`border transition-all ${
      isApproved
        ? "border-emerald-200 bg-emerald-50/20"
        : isRejected
        ? "border-slate-200 bg-slate-50/40 opacity-75"
        : "border-slate-200 bg-white hover:border-slate-300 shadow-xs"
    }`}>
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
              isApproved
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                : isRejected
                ? "bg-slate-100 text-slate-600"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}>
              <Lightbulb className="w-4 h-4" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                  {recommendation.title}
                </CardTitle>
                <Badge variant="neutral" size="sm">
                  Rules-based
                </Badge>
              </div>
              <CardDescription suppressHydrationWarning className="text-xs text-slate-500 mt-0.5">
                Target Asset: <strong className="text-slate-700">{recommendation.targetApplianceName}</strong>
                {" • "}
                Generated {formatDateTime(recommendation.createdAt)}
              </CardDescription>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {getUrgencyBadge(recommendation.urgency)}
            <Badge
              variant={
                isApproved ? "healthy" : isRejected ? "critical" : "warning"
              }
              size="sm"
              className="capitalize font-mono font-bold"
            >
              {recommendation.status === "approved"
                ? "Approved & Active"
                : recommendation.status === "rejected"
                ? "Declined"
                : "Pending Authorization"}
            </Badge>
            <span className="text-xs font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-300 shadow-2xs">
              {recommendation.confidencePct}% Confidence
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Proposed Action Box */}
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Proposed Action: </span>
            <span className="font-normal text-slate-800">{recommendation.suggestedAction}</span>
          </div>
          <div className="text-slate-600 text-xs leading-relaxed pl-5">
            <strong className="text-slate-800">Operational Reason: </strong>
            {recommendation.reasoning}
          </div>
        </div>

        {/* Quantified Impact Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-brand-700 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                Financial Savings
              </span>
              <span className="text-xs font-bold font-mono text-slate-900">
                +{formatCurrency(recommendation.estimatedSavingsNgn, "NGN")}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-700 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                Runtime Extension
              </span>
              <span className="text-xs font-bold font-mono text-slate-900">
                {recommendation.runtimeImpactHours
                  ? `+${recommendation.runtimeImpactHours} hrs backup`
                  : "Thermal Buffer"}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2 col-span-2 sm:col-span-1">
            <Leaf className="w-4 h-4 text-brand-700 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                Emissions Avoidance
              </span>
              <span className="text-xs font-bold font-mono text-slate-900">
                {recommendation.co2ReductionKg || 0} kg CO₂e
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry Input Chips */}
        {recommendation.relevantInputs && recommendation.relevantInputs.length > 0 && (
          <details className="pt-1">
            <summary className="cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-700">View inputs used</summary>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              {recommendation.relevantInputs.map((input) => (
                <span
                  key={`${input.label}-${input.value}`}
                  className="text-[11px] font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-medium"
                >
                  <strong className="text-slate-700">{input.label}:</strong> {input.value}
                </span>
              ))}
            </div>
          </details>
        )}

        {/* Rejection Note (if rejected) */}
        {isRejected && recommendation.rejectionReason && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Declined by Operator:</strong>
              <span>{recommendation.rejectionReason}</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-slate-50/60 border-t border-slate-100 py-3 px-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onInspect(recommendation)}
          className="text-xs h-8 text-slate-700 border-slate-200 hover:bg-white w-full sm:w-auto"
        >
          <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
          Inspect Decision Details & Calculations
        </Button>

        {isPending ? (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDismiss(recommendation.id)}
              className="text-xs h-8 text-slate-500 hover:text-slate-700"
            >
              Dismiss
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRequestReject(recommendation)}
              className="text-xs h-8 text-rose-700 border-rose-200 hover:bg-rose-50"
            >
              <XCircle className="w-3.5 h-3.5 mr-1" />
              Decline
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => onRequestApprove(recommendation)}
              className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Approve Action
            </Button>
          </div>
        ) : (
          <div className="text-xs font-semibold flex items-center gap-1.5 text-slate-500">
            {isApproved ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Active in Simulator Dispatch Engine
              </span>
            ) : (
              <span className="text-slate-500 flex items-center gap-1">
                <XCircle className="w-4 h-4 text-slate-400" />
                Preserved in Operational Audit Trail
              </span>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
