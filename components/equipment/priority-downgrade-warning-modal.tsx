"use client";

import * as React from "react";
import { AlertTriangle, ShieldAlert, Check, X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Appliance } from "@/types/energy";

interface PriorityDowngradeWarningModalProps {
  appliance: Appliance | null;
  newPriority: "important" | "deferrable";
  isOpen: boolean;
  onClose: () => void;
  onConfirmDowngrade: () => void;
}

export function PriorityDowngradeWarningModal({
  appliance,
  newPriority,
  isOpen,
  onClose,
  onConfirmDowngrade,
}: PriorityDowngradeWarningModalProps) {
  if (!appliance) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Critical Cold Chain Safety Warning"
      description={`Authorization required to downgrade protection tier for "${appliance.name}"`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs text-slate-700 pt-1">
        {/* High-visibility Warning Box */}
        <div className="p-3.5 rounded-xl border border-rose-300 bg-rose-50 space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-900 text-xs">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <span>High Risk of Inventory Spoilage:</span>
          </div>
          <p className="text-rose-950 leading-relaxed text-[11px]">
            You are attempting to downgrade <strong>{appliance.name}</strong> from{" "}
            <span className="font-bold uppercase text-rose-700">Critical</span> to{" "}
            <span className="font-bold uppercase text-amber-700">{newPriority}</span>.
          </p>
          <div className="text-[11px] text-rose-900 space-y-1 pt-1 border-t border-rose-200/80">
            <div>
              • <strong>Outage Shedding Risk:</strong> The microgrid automated controller will be permitted to curtail this refrigeration circuit during a utility blackout to save battery or diesel.
            </div>
            <div>
              • <strong>Thermal Excursion:</strong> If grid power is lost, internal temperatures may breach the -18°C frozen food safety threshold or +6°C biologics safety range.
            </div>
          </div>
        </div>

        <p className="text-slate-600 text-[11px]">
          Please confirm that you have alternative thermal cooling safeguards in place or explicit authorization from the cold storage facility manager.
        </p>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="text-slate-700"
          >
            Cancel (Keep Critical)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onConfirmDowngrade();
              onClose();
            }}
            className="border-rose-400 text-rose-700 hover:bg-rose-100 font-bold"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            Authorize Downgrade
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
