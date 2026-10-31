"use client";

import * as React from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  siteService,
  type SiteAppliance,
  type SiteRegistration,
} from "@/services/site-service";
import { AddDeviceModal } from "@/components/workspace/add-device-modal";
import type { ConnectedDevice } from "@/types/energy";

const priorityStyles: Record<SiteAppliance["priority"], string> = {
  critical: "border-rose-500/20 bg-rose-500/10 text-rose-300",
  important: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  deferrable: "border-slate-500/20 bg-slate-500/10 text-slate-300",
};

const PRIORITY_ORDER: SiteAppliance["priority"][] = ["critical", "important", "deferrable"];

/**
 * The registered inventory, read from the API rather than from browser state.
 * Adding here reaches the backend, so the new item is published by the twin
 * and assessed by both risk models instead of existing only on this screen.
 */
export function RegisteredEquipment() {
  const [registration, setRegistration] = React.useState<SiteRegistration | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      setRegistration(await siteService.getRegistration());
      setError(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not load the inventory.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const handleAdd = async (device: Omit<ConnectedDevice, "id" | "createdAt">) => {
    setAddOpen(false);
    setBusyId("new");
    try {
      await siteService.addAppliance({
        name: device.name,
        category: device.category,
        priority: device.priority === "nonessential" ? "deferrable" : device.priority,
        ratedPowerKw: device.ratedPowerKw,
        notes: device.notes,
      });
      await load();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The equipment could not be registered.");
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (appliance: SiteAppliance) => {
    setBusyId(appliance.id);
    try {
      await siteService.removeAppliance(appliance.id);
      await load();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The equipment could not be removed.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <div className="h-48 rounded-2xl border border-white/[0.08] bg-white/[0.02] animate-pulse" />;
  }

  const appliances = registration?.appliances ?? [];
  const totalKw = appliances.reduce((sum, item) => sum + item.ratedPowerKw, 0);

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5" aria-labelledby="registered-equipment-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="registered-equipment-heading" className="text-sm font-semibold text-white">
            Registered equipment
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {registration?.isProvisioned
              ? `${appliances.length} items, ${totalKw.toFixed(1)} kW rated, monitored for ${registration.name}.`
              : "No site is registered yet, so the built-in reference inventory is shown."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/90 px-3 py-1.5 text-xs font-medium text-[#06130d] hover:bg-emerald-400 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add equipment
        </button>
      </div>

      {error && (
        <p className="mt-3 text-[11px] text-rose-300" role="status">{error}</p>
      )}

      <div className="mt-4 space-y-2">
        {appliances.length === 0 ? (
          <p className="text-xs text-slate-400">No equipment registered yet.</p>
        ) : (
          [...appliances]
            .sort((a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority))
            .map((appliance) => (
              <div
                key={appliance.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-black/20 px-3.5 py-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white truncate">{appliance.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {appliance.ratedPowerKw} kW rated · {appliance.currentPowerKw} kW now
                    {appliance.isControllable ? " · controllable" : " · monitored only"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] uppercase tracking-wider rounded-full border px-2 py-0.5 ${priorityStyles[appliance.priority]}`}>
                    {appliance.priority}
                  </span>
                  <button
                    type="button"
                    disabled={busyId === appliance.id || !registration?.isProvisioned}
                    onClick={() => void handleRemove(appliance)}
                    aria-label={`Remove ${appliance.name}`}
                    className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-rose-300 hover:border-rose-500/30 transition-colors disabled:opacity-40"
                  >
                    {busyId === appliance.id
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
        Equipment registered here is what the digital-twin gateway publishes telemetry for, and what the
        outage and equipment risk models assess.
      </p>

      <AddDeviceModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={(device) => void handleAdd(device)} />
    </section>
  );
}
