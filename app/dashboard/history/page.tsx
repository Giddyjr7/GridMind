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
} from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSimulation } from "@/context/simulation-context";
import { formatDateTime, formatCurrency } from "@/lib/formatters";

export default function HistoryPage() {
  const { events, approvalHistory, recommendations } = useSimulation();
  const [activeTab, setActiveTab] = React.useState<"approvals" | "all_events">("approvals");

  return (
    <PageContainer>
      <SectionHeading
        title="Decision History & Operational Audit Trail"
        description="Immutable record of every AI dispatch recommendation authorization, human operator override, and microgrid disturbance event."
        badge={
          <Badge variant="healthy" size="sm" className="font-mono text-[10px]">
            {approvalHistory.length} AUDITED DECISIONS
          </Badge>
        }
      />

      {/* Tabs Switcher */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("approvals")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "approvals"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-600" />
          Operator Authorization Decisions ({approvalHistory.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("all_events")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "all_events"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-blue-600" />
          Full System Disturbance Log ({events.length})
        </button>
      </div>

      {/* 1. Operator Approval & Rejection Decisions */}
      {activeTab === "approvals" && (
        <div className="space-y-3">
          {approvalHistory.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
              No operator decisions recorded yet. Visit the Recommendations page to evaluate and authorize actions.
            </div>
          ) : (
            approvalHistory.map((record) => {
              const targetRec = recommendations.find(
                (r) => r.id === record.recommendationId
              );
              const isApproved = record.actionTaken === "approve";

              return (
                <Card
                  key={record.id}
                  className={`p-4 border transition-colors ${
                    isApproved
                      ? "border-emerald-200 bg-emerald-50/20"
                      : "border-rose-200 bg-rose-50/20"
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
                            className="capitalize font-mono text-[10px]"
                          >
                            {isApproved ? "Authorized & Applied" : "Declined by Operator"}
                          </Badge>
                          <span className="text-[10px] font-mono text-slate-400">
                            Rec ID: {record.recommendationId}
                          </span>
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

                    <div suppressHydrationWarning className="flex items-center gap-1.5 text-xs text-slate-400 font-mono shrink-0">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatDateTime(record.timestamp)}</span>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* 2. Full System Telemetry & Disturbance Log */}
      {activeTab === "all_events" && (
        <div className="space-y-3">
          {events.map((record) => (
            <Card key={record.id} className="p-4 hover:border-slate-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                      record.severity === "critical"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : record.severity === "warning"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {record.severity === "critical" ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">
                        {record.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        ID: {record.id}
                      </span>
                      <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                        {record.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                        [SIMULATED]
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {record.details}
                    </p>
                  </div>
                </div>

                <div suppressHydrationWarning className="flex items-center gap-2 text-xs shrink-0 text-slate-400 font-mono">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{formatDateTime(record.timestamp)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
