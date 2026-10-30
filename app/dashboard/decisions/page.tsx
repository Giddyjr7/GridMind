"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  History,
  CheckCircle,
  XCircle,
  HelpCircle,
  Download,
  AlertTriangle,
  Clock,
  TrendingDown,
  Check,
} from "lucide-react";
import { useScenario, DecisionRecord } from "@/context/scenario-context";
import { WhyRecommendationDrawer } from "@/components/dashboard/why-recommendation-drawer";

export default function DecisionsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-slate-400">Loading decisions...</div>}>
      <DecisionsContent />
    </React.Suspense>
  );
}

function DecisionsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "history" ? "history" : "pending";
  const [tab, setTab] = React.useState<"pending" | "history">(initialTab);

  const {
    inputs,
    outputs,
    auditTrail,
    approveRecommendation,
    rejectRecommendation,
  } = useScenario();

  const [whyDrawerOpen, setWhyDrawerOpen] = React.useState(false);
  const [actionFeedback, setActionFeedback] = React.useState<string | null>(null);

  const { recommendation, baselineComparison } = outputs;

  const handleApprove = () => {
    approveRecommendation(recommendation);
    setActionFeedback("Action approved and added to decision audit trail.");
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleReject = () => {
    rejectRecommendation(recommendation);
    setActionFeedback("Action rejected by operator.");
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Title", "Category", "Action", "Timestamp", "Actor", "Savings (NGN/h)", "Runtime Gain (h)"];
    const rows = auditTrail.map((d) => [
      d.id,
      `"${d.title.replace(/"/g, '""')}"`,
      d.category,
      d.actionTaken,
      d.timestamp,
      `"${d.actor}"`,
      d.projectedSavingsNgnPerHour,
      d.projectedRuntimeExtensionHours,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gridmind_decisions_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Decisions & Audit History
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Operator-in-the-loop dispatch approvals and timestamped decision accountability
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-black/40 border border-white/[0.08] p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setTab("pending")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              tab === "pending"
                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Pending Advisory</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("history")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              tab === "history"
                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <History className="h-3.5 w-3.5 text-slate-400" />
            <span>Audit Trail ({auditTrail.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Pending Advisory Decision */}
      {tab === "pending" && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                {recommendation.category.replace(/_/g, " ")}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Urgency: {recommendation.urgency.toUpperCase()}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white tracking-tight">
                {recommendation.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mt-2 max-w-3xl">
                {recommendation.reason}
              </p>
            </div>

            {/* Impact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.05]">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Cost Impact</span>
                </div>
                <p className="text-lg font-bold font-mono text-emerald-400">
                  ₦{recommendation.projectedSavingsNgnPerHour.toLocaleString()}/hr
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Savings vs unmanaged diesel run
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.05]">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Clock className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Autonomy Extension</span>
                </div>
                <p className="text-lg font-bold font-mono text-white">
                  +{recommendation.projectedRuntimeExtensionHours}h
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Additional battery reserve window
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.05]">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  <span>Cost Efficiency</span>
                </div>
                <p className="text-lg font-bold font-mono text-white">
                  {baselineComparison.savingsPct}%
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Baseline: ₦{baselineComparison.baselineHourlyCostNgn.toLocaleString()}/hr
                </p>
              </div>
            </div>

            {/* Fired Rules */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/[0.04] space-y-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Deterministic Triggers
              </span>
              <ul className="space-y-1">
                {recommendation.firedRules.map((r, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions Bar */}
            <div className="pt-2 border-t border-white/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setWhyDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors py-2"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Why this recommendation? (5-stage explainability)</span>
              </button>

              {actionFeedback ? (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{actionFeedback}</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleReject}
                    className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium border border-white/[0.08] transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="h-4 w-4 text-slate-400" />
                    <span>Dismiss</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>{recommendation.actionLabel}</span>
                  </button>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-500">
              {recommendation.disclaimer}
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Decision History & Audit Trail */}
      {tab === "history" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Chronological ledger of operational recommendations and operator responses
            </p>
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 border border-white/[0.08] transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] overflow-hidden">
            <div className="divide-y divide-white/[0.06]">
              {auditTrail.map((record) => (
                <div
                  key={record.id}
                  className="p-4 sm:p-5 hover:bg-white/[0.01] transition-colors space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase border ${
                          record.actionTaken === "approved"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {record.actionTaken}
                      </span>
                      <h4 className="text-sm font-semibold text-white">
                        {record.title}
                      </h4>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(record.timestamp).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Context: {record.systemContext}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-400 font-mono">
                    <span>Actor: {record.actor}</span>
                    {record.projectedSavingsNgnPerHour > 0 && (
                      <span className="text-emerald-400">
                        Savings: ₦{record.projectedSavingsNgnPerHour.toLocaleString()}/hr
                      </span>
                    )}
                    {record.projectedRuntimeExtensionHours > 0 && (
                      <span className="text-slate-300">
                        Runtime Gain: +{record.projectedRuntimeExtensionHours}h
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Why This Recommendation Explainability Drawer */}
      <WhyRecommendationDrawer
        isOpen={whyDrawerOpen}
        onClose={() => setWhyDrawerOpen(false)}
        inputs={inputs}
        outputs={outputs}
      />
    </div>
  );
}
