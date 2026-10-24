"use client";

import * as React from "react";
import { XCircle, AlertTriangle, ShieldX } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EnergyRecommendation } from "@/types/energy";

interface RejectModalProps {
  recommendation: EnergyRecommendation | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string, reason: string) => void;
}

export function RejectModal({
  recommendation,
  isOpen,
  onClose,
  onConfirm,
}: RejectModalProps) {
  const [rejectReason, setRejectReason] = React.useState("");

  if (!recommendation) return null;

  const handleConfirm = () => {
    onConfirm(recommendation.id, rejectReason);
    setRejectReason("");
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Decline Recommendation"
      description={`Decline action: "${recommendation.title}"`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs text-slate-700 pt-1">
        <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-rose-900 text-xs">
            <ShieldX className="w-4 h-4 text-rose-600" />
            System State Preservation Notice:
          </div>
          <p className="text-slate-800 leading-relaxed text-[11px]">
            Declining this recommendation keeps the physical simulated microgrid state completely unchanged. No equipment will be curtailed or setpoints modified.
          </p>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="reject-reason"
            className="block text-xs font-semibold text-slate-700"
          >
            Reason for Declining (Required for Audit Trail):
          </label>
          <textarea
            id="reject-reason"
            rows={2}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Deferred due to incoming frozen seafood shipment; freezer door activity expected."
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
          />
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button size="sm" variant="outline" onClick={onClose}>
            Back
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleConfirm}
            className="border-rose-300 text-rose-700 hover:bg-rose-50"
          >
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Confirm Decline
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
