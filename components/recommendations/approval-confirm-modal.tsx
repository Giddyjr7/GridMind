"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, Coins } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EnergyRecommendation } from "@/types/energy";
import { formatCurrency } from "@/lib/formatters";

interface ApprovalConfirmModalProps {
  recommendation: EnergyRecommendation | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string, notes: string) => void;
}

export function ApprovalConfirmModal({
  recommendation,
  isOpen,
  onClose,
  onConfirm,
}: ApprovalConfirmModalProps) {
  const [operatorNotes, setOperatorNotes] = React.useState("");

  if (!recommendation) return null;

  const handleConfirm = () => {
    onConfirm(recommendation.id, operatorNotes);
    setOperatorNotes("");
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Dispatch Authorization"
      description={`Authorizing automated microgrid dispatch: "${recommendation.title}"`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs text-slate-700 pt-1">
        <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Proposed Action to Apply:
          </div>
          <p className="text-slate-800 font-semibold leading-relaxed">
            {recommendation.suggestedAction}
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-emerald-100 font-mono">
            <span className="text-slate-500">Target Asset:</span>
            <span className="font-bold text-slate-800">
              {recommendation.targetApplianceName}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">Projected Benefit:</span>
            <span className="font-bold text-emerald-700">
              +{formatCurrency(recommendation.estimatedSavingsNgn, "NGN")} savings
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="operator-memo"
            className="block text-xs font-semibold text-slate-700"
          >
            Operator Approval Memo (Optional Audit Note):
          </label>
          <textarea
            id="operator-memo"
            rows={2}
            value={operatorNotes}
            onChange={(e) => setOperatorNotes(e.target.value)}
            placeholder="e.g. Authorized automated pre-cooling routine during solar window."
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>

        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500">
          ℹ️ Approving will update simulated appliance status, adjust runtime models, and record an immutable entry in the Decision Audit Trail.
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handleConfirm}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Confirm & Dispatch
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
