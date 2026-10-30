"use client";

import * as React from "react";
import Link from "next/link";
import {
  Lightbulb,
  TrendingDown,
  Leaf,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnergyRecommendation } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import { useSimulation } from "@/context/simulation-context";

interface CurrentRecommendationCardProps {
  initialRecommendation: EnergyRecommendation;
  totalPendingCount?: number;
}

export function CurrentRecommendationCard({
  initialRecommendation,
  totalPendingCount = 1,
}: CurrentRecommendationCardProps) {
  const {
    recommendations,
    approveRecommendation,
    rejectRecommendation,
    resetToDefaultScenario,
  } = useSimulation();

  // Pick up-to-date recommendation from shared state if available
  const recommendation =
    recommendations.find((r) => r.id === initialRecommendation.id) ||
    initialRecommendation;

  const [actionFeedback, setActionFeedback] = React.useState<string | null>(null);

  const handleApprove = () => {
    approveRecommendation(recommendation.id, "Approved from Overview Command Console.");
    setActionFeedback("Recommendation approved & dispatched in microgrid engine!");
  };

  const handleDismiss = () => {
    rejectRecommendation(recommendation.id, "Declined from Overview Command Console.");
    setActionFeedback("Recommendation declined by operator.");
  };

  const isApproved = recommendation.status === "approved";
  const isRejected = recommendation.status === "rejected";
  const isPending = recommendation.status === "pending";

  return (
    <Card className="flex flex-col h-full border-emerald-200/80 bg-gradient-to-b from-emerald-50/30 to-white">
      <CardHeader className="pb-3 border-b border-emerald-100 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800">
            <Lightbulb className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold text-slate-900">
                Recommended Action
              </CardTitle>
              <Badge variant="healthy" size="sm" className="font-bold">
                AI Optimization
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              Continuous tariff and thermal storage optimization
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-300 shadow-xs">
            {recommendation.confidencePct}% Confidence
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
        {/* Recommendation Title & Target */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-900 leading-snug">
              {recommendation.title}
            </h4>
            {isPending && (
              <Badge variant="warning">
                Action Pending
              </Badge>
            )}
            {isApproved && (
              <Badge variant="healthy">
                <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                Approved & Active
              </Badge>
            )}
            {isRejected && (
              <Badge variant="neutral">
                <XCircle className="w-3 h-3 mr-1 inline" />
                Dismissed
              </Badge>
            )}
          </div>

          <div className="bg-white rounded-lg p-3 border border-slate-200/80 text-xs text-slate-700 space-y-1.5 shadow-2xs">
            <div>
              <span className="font-semibold text-slate-900">Suggested Action: </span>
              {recommendation.suggestedAction}
            </div>
            <div className="text-slate-500 pt-1 border-t border-slate-100 text-[11px] leading-relaxed">
              <span className="font-medium text-slate-700">Reasoning: </span>
              {recommendation.reasoning}
            </div>
          </div>
        </div>

        {/* Impact Badges */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-emerald-200/60 flex items-center justify-center shrink-0 text-emerald-800">
              <TrendingDown className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-emerald-800 tracking-wider">
                Projected Savings
              </div>
              <div className="text-xs font-bold text-emerald-900">
                +{formatCurrency(recommendation.estimatedSavingsNgn, "NGN")}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-sky-50/70 border border-sky-200 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-sky-200/60 flex items-center justify-center shrink-0 text-sky-800">
              <Leaf className="w-4 h-4 text-sky-700" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-sky-800 tracking-wider">
                CO₂ Reduction
              </div>
              <div className="text-xs font-bold text-sky-900">
                {recommendation.co2ReductionKg || 0} kg CO₂e
              </div>
            </div>
          </div>
        </div>

        {/* Action Feedback Alert */}
        {actionFeedback && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Working Actions Bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          {isPending ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDismiss}
                className="text-xs text-slate-600 hover:text-slate-900"
              >
                Dismiss
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleApprove}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                  Approve Optimization
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Policy applied to microgrid controller
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  resetToDefaultScenario();
                  setActionFeedback(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Reset Demo
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      <div className="p-3 bg-emerald-50/40 border-t border-emerald-100 flex items-center justify-between text-xs text-slate-600">
        <span className="text-[11px] text-slate-500">
          Target Asset: <strong className="text-slate-700">{recommendation.targetApplianceName}</strong>
        </span>
        <Link
          href="/dashboard/recommendations"
          className="text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-1 hover:underline"
        >
          View All Recommendations ({totalPendingCount})
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
