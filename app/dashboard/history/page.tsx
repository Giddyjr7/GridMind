"use client";

import * as React from "react";
import { History, CheckCircle2, XCircle, User, Clock, ShieldCheck, AlertTriangle } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSimulation } from "@/context/simulation-context";
import { formatDateTime } from "@/lib/formatters";

export default function HistoryPage() {
  const { events } = useSimulation();

  return (
    <PageContainer>
      <SectionHeading
        title="Decision History & Operational Audit Trail"
        description="Immutable record of every AI dispatch recommendation, human operator action, disturbance event, and realized energy savings."
        badge={
          <Badge variant="healthy" size="sm" className="font-mono text-[10px]">
            {events.length} AUDITED EVENTS
          </Badge>
        }
      />

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
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {record.details}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs shrink-0 text-slate-400 font-mono">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{formatDateTime(record.timestamp)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
