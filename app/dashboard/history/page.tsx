import * as React from "react";
import { Metadata } from "next";
import { History, CheckCircle2, XCircle, User, Clock, ShieldCheck } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { recommendationService } from "@/services";
import { formatCurrency } from "@/lib/formatters";

export const metadata: Metadata = {
  title: "Decision History — GridMind Console",
  description: "Audit trail of operator decisions, approvals, and realized fuel savings.",
};

export default async function HistoryPage() {
  const history = await recommendationService.getApprovalHistory();

  return (
    <PageContainer>
      <SectionHeading
        title="Decision History & Operational Audit Trail"
        description="Immutable record of every AI dispatch recommendation, human operator action, and realized energy savings."
        badge={
          <Badge variant="healthy" size="sm" className="font-mono text-[10px]">
            {history.length} AUDITED ACTIONS
          </Badge>
        }
      />

      <div className="space-y-3">
        {history.map((record) => (
          <Card key={record.id} className="p-4 hover:border-slate-300 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                    record.actionTaken === "approve"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {record.actionTaken === "approve" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 capitalize">
                      {record.actionTaken === "approve" ? "Recommendation Approved" : "Recommendation Declined"}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ID: {record.recommendationId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {record.notes}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs shrink-0">
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Authorized By</span>
                  <span className="font-medium text-slate-800">{record.performedBy}</span>
                </div>

                {record.savingsRealizedEstimateNgn && (
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Realized Savings</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {formatCurrency(record.savingsRealizedEstimateNgn)}
                    </span>
                  </div>
                )}

                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Timestamp</span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {new Date(record.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
