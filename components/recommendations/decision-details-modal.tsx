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
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnergyRecommendation } from "@/types/energy";
import { formatCurrency, formatDateTime } from "@/lib/formatters";

interface DecisionDetailsModalProps {
  recommendation: EnergyRecommendation | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function DecisionDetailsModal({
  recommendation,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: DecisionDetailsModalProps) {
  if (!recommendation) return null;

  const isPending = recommendation.status === "pending";
  const isApproved = recommendation.status === "approved";
  const isRejected = recommendation.status === "rejected";

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={recommendation.title}
      description={`Recommendation ID: ${recommendation.id} | Generated: ${formatDateTime(
        recommendation.createdAt
      )}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5 text-xs text-slate-700 max-h-[75vh] overflow-y-auto pr-1">
        {/* Status & Priority Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
              Status:
            </span>
            <Badge
              variant={
                isApproved ? "healthy" : isRejected ? "critical" : "warning"
              }
              size="sm"
              className="capitalize font-mono font-bold"
            >
              {recommendation.status}
            </Badge>

            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] ml-2">
              Urgency:
            </span>
            <Badge
              variant={
                recommendation.urgency === "critical"
                  ? "critical"
                  : recommendation.urgency === "warning"
                  ? "warning"
                  : "neutral"
              }
              size="sm"
              className="capitalize font-mono"
            >
              {recommendation.urgency}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
              {recommendation.confidencePct}% Model Confidence
              {recommendation.uncertaintyMarginPct && (
                <span className="text-emerald-600 font-normal ml-1">
                  (±{recommendation.uncertaintyMarginPct}%)
                </span>
              )}
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
              DETERMINISTIC SIMULATION
            </span>
          </div>
        </div>

        {/* 1. Proposed Action */}
        <div className="space-y-1.5 p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40">
          <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wide">
            <Lightbulb className="w-4 h-4 text-emerald-700" />
            Proposed Action
          </h4>
          <p className="text-slate-800 font-semibold leading-relaxed">
            {recommendation.suggestedAction}
          </p>
          <p className="text-slate-600 leading-relaxed text-[11px] pt-1 border-t border-emerald-100">
            {recommendation.description}
          </p>
        </div>

        {/* 2. System Conditions & Input Readings */}
        {recommendation.relevantInputs && recommendation.relevantInputs.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Observed System Telemetry at Decision Time
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {recommendation.relevantInputs.map((input, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-0.5"
                >
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block truncate">
                    {input.label}
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-900 block truncate">
                    {input.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Why This Action Was Selected (Rationale) */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-700" />
            Algorithmic Selection Rationale
          </h4>
          <div className="p-3 bg-white rounded-xl border border-slate-200 leading-relaxed text-slate-700 space-y-1">
            <p>{recommendation.reasoning}</p>
            <p className="text-[11px] text-slate-500 italic">
              Note: This recommendation was derived strictly from physical energy balances, contracted utility tariffs, and cold chain thermal inertia rules. No black-box statistical guesses were utilized.
            </p>
          </div>
        </div>

        {/* 4. Benefits vs Trade-offs */}
        {recommendation.benefitsAndTradeoffs && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Projected Benefits */}
            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2">
              <h5 className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Projected Benefits
              </h5>
              <ul className="space-y-1 text-[11px] text-emerald-950">
                {recommendation.benefitsAndTradeoffs.benefits.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Operational Trade-offs */}
            <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2">
              <h5 className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Operational Trade-offs & Impact
              </h5>
              <ul className="space-y-1 text-[11px] text-amber-950">
                {recommendation.benefitsAndTradeoffs.tradeoffs.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 5. Alternatives Considered (Computed Benchmarks) */}
        {recommendation.alternativesConsidered &&
          recommendation.alternativesConsidered.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                Deterministic Alternatives Computed
              </h4>
              <div className="space-y-2">
                {recommendation.alternativesConsidered.map((alt, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 text-xs">
                        Option: {alt.option}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Rejection Rationale: {alt.rejectionReason}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 shrink-0">
                      {alt.costOrImpact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* 6. Constraints Respected */}
        {recommendation.constraintsRespected &&
          recommendation.constraintsRespected.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Enforced Operational Constraints
              </h4>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-[11px] space-y-1 text-slate-700">
                {recommendation.constraintsRespected.map((c, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* 7. Data Limitations & Honest Disclaimer */}
        {recommendation.dataLimitations && (
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-100 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-700 block">
              Data Limitations & Sensor Uncertainties:
            </span>
            <p className="leading-relaxed">{recommendation.dataLimitations}</p>
            <p className="text-[10px] text-slate-500 italic pt-0.5">
              ⚠️ Simulated recommendation preview. Never execute automated switching on physical switchgear without human verification and interlocked ATS isolation.
            </p>
          </div>
        )}
      </div>

      {/* Modal Footer with Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        <Button size="sm" variant="outline" onClick={onClose}>
          Close
        </Button>

        {isPending && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onReject(recommendation.id);
                onClose();
              }}
              className="text-rose-700 border-rose-200 hover:bg-rose-50"
            >
              <XCircle className="w-3.5 h-3.5 mr-1" />
              Decline Action
            </Button>

            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                onApprove(recommendation.id);
                onClose();
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Approve & Dispatch Policy
            </Button>
          </div>
        )}

        {isApproved && (
          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            Approved & Dispatched in Simulator
          </span>
        )}

        {isRejected && (
          <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
            <XCircle className="w-4 h-4" />
            Declined by Operator (System state unchanged)
          </span>
        )}
      </div>
    </Dialog>
  );
}
