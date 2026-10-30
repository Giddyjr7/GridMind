"use client";

import * as React from "react";
import { X, Trash2, Edit2, Zap, AlertTriangle, Check } from "lucide-react";
import { ConnectedDevice, DevicePriority } from "@/types/energy";
import { DEVICE_CATALOGUE } from "@/lib/device-catalogue";
import { cn } from "@/lib/utils";

interface DeviceDetailSheetProps {
  device: ConnectedDevice | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<ConnectedDevice>) => void;
  onRemove: (id: string) => void;
}

export function DeviceDetailSheet({
  device,
  isOpen,
  onClose,
  onUpdate,
  onRemove,
}: DeviceDetailSheetProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState("");
  const [editPower, setEditPower] = React.useState<number>(0);
  const [editPriority, setEditPriority] = React.useState<DevicePriority>("important");
  const [showConfirmRemove, setShowConfirmRemove] = React.useState(false);

  React.useEffect(() => {
    if (device) {
      setEditName(device.name);
      setEditPower(device.ratedPowerKw);
      setEditPriority(device.priority);
      setIsEditing(false);
      setShowConfirmRemove(false);
    }
  }, [device]);

  if (!isOpen || !device) return null;

  const catalogueItem = DEVICE_CATALOGUE.find(
    (c) => c.typeId === device.deviceTypeId
  );
  const Icon = catalogueItem?.icon || Zap;

  const handleSaveEdit = () => {
    if (!editName.trim() || editPower <= 0) return;
    onUpdate(device.id, {
      name: editName.trim(),
      ratedPowerKw: editPower,
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const handleConfirmRemove = () => {
    onRemove(device.id);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Device details"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side Sheet */}
      <div className="relative w-full max-w-md h-full bg-[#0c1410] border-l border-white/10 text-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
        {/* Top bar */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center border",
                catalogueItem?.accentColor || "bg-emerald-500/15",
                catalogueItem?.accentBorder || "border-emerald-500/30",
                catalogueItem?.iconColor || "text-emerald-400"
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-medium text-white truncate max-w-[220px]">
                {device.name}
              </h3>
              <p className="text-xs text-slate-400">
                {catalogueItem?.name || "Connected device"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sheet"
            className="h-8 w-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {isEditing ? (
            <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/[0.08]">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                Edit device details
              </span>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 block">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-white/10 bg-[#080f0b] px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 block">Rated power (kW)</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={editPower}
                  onChange={(e) => setEditPower(parseFloat(e.target.value) || 0)}
                  className="h-10 w-full rounded-xl border border-white/10 bg-[#080f0b] px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 block">Priority</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as DevicePriority)}
                  className="h-10 w-full rounded-xl border border-white/10 bg-[#080f0b] px-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="critical" className="bg-[#0c1410]">
                    Critical
                  </option>
                  <option value="important" className="bg-[#0c1410]">
                    Important
                  </option>
                  <option value="nonessential" className="bg-[#0c1410]">
                    Nonessential
                  </option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="flex-1 h-9 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Save changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 h-9 rounded-lg border border-white/10 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <span className="text-[11px] text-slate-400 block">Status</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-medium text-white">Simulated</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <span className="text-[11px] text-slate-400 block">Rated power</span>
                  <span className="text-xs font-mono font-medium text-white block mt-1">
                    {device.ratedPowerKw} kW
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <span className="text-[11px] text-slate-400 block">Priority</span>
                  <span className="text-xs font-medium capitalize text-white block mt-1">
                    {device.priority}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <span className="text-[11px] text-slate-400 block">Source</span>
                  <span className="text-xs font-medium capitalize text-white block mt-1">
                    {device.source}
                  </span>
                </div>
              </div>

              {catalogueItem?.description && (
                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-xs text-slate-400 leading-relaxed">
                  {catalogueItem.description}
                </div>
              )}
            </div>
          )}

          {/* Remove confirmation section */}
          {showConfirmRemove ? (
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <p>
                  Are you sure you want to remove <strong>{device.name}</strong> from your monitored devices?
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleConfirmRemove}
                  className="px-3 h-8 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition-colors"
                >
                  Yes, remove device
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmRemove(false)}
                  className="px-3 h-8 rounded-lg border border-white/10 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/[0.08] bg-white/[0.02] flex items-center justify-between gap-3">
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl border border-white/10 hover:border-white/20 text-xs font-medium text-white transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5 text-slate-400" />
              <span>Edit</span>
            </button>
          )}

          {!showConfirmRemove && (
            <button
              type="button"
              onClick={() => setShowConfirmRemove(true)}
              className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-xs font-medium text-rose-400 transition-colors ml-auto"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
