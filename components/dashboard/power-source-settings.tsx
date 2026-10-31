"use client";

import * as React from "react";
import { Battery, Fuel, Loader2, Sun, Zap } from "lucide-react";
import { siteService, type SiteRegistration, type SiteSourceConfig } from "@/services/site-service";

interface SourceField {
  key: keyof SiteSourceConfig;
  label: string;
  unit: string;
  icon: React.ElementType;
  step: number;
}

const FIELDS: SourceField[] = [
  { key: "solarCapacityKwp", label: "Solar array", unit: "kWp", icon: Sun, step: 0.5 },
  { key: "batteryCapacityKwh", label: "Battery capacity", unit: "kWh", icon: Battery, step: 1 },
  { key: "batteryReservePct", label: "Reserve floor", unit: "%", icon: Battery, step: 1 },
  { key: "generatorCapacityKva", label: "Generator", unit: "kVA", icon: Fuel, step: 5 },
  { key: "generatorFuelLiters", label: "Fuel on site", unit: "L", icon: Fuel, step: 10 },
  { key: "gridTariffPerKwhNgn", label: "Grid tariff", unit: "NGN/kWh", icon: Zap, step: 1 },
];

/**
 * Energy sources were previously hardcoded with no way to declare them. They
 * are now site configuration the backend stores, so a facility's real solar,
 * battery and generator ratings drive the runtime and cost maths.
 */
export function PowerSourceSettings() {
  const [registration, setRegistration] = React.useState<SiteRegistration | null>(null);
  const [draft, setDraft] = React.useState<Partial<SiteSourceConfig>>({});
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ tone: "ok" | "error"; text: string } | null>(null);

  React.useEffect(() => {
    void siteService
      .getRegistration()
      .then((result) => {
        setRegistration(result);
        setDraft(result.sources ?? {});
      })
      .catch(() => setMessage({ tone: "error", text: "Could not load the site configuration." }));
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const result = await siteService.updateSources(draft);
      setRegistration(result);
      setDraft(result.sources ?? {});
      setMessage({ tone: "ok", text: "Energy sources updated." });
    } catch (error) {
      setMessage({
        tone: "error",
        text: error instanceof Error ? error.message : "The update failed.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!registration) {
    return <div className="h-40 rounded-2xl border border-white/[0.08] bg-white/[0.02] animate-pulse" />;
  }

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-emerald-400" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Energy Sources
        </h3>
      </div>

      {!registration.isProvisioned ? (
        <p className="text-xs text-amber-200/90">
          No site is registered, so these are the built-in reference values. Complete signup to configure
          your own.
        </p>
      ) : (
        <p className="text-xs text-slate-400">
          These ratings drive backup runtime, cost comparison and the reserve floor the recommendation
          engine protects.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {FIELDS.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key} className="space-y-1">
              <label htmlFor={field.key} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Icon className="h-3 w-3" />
                {field.label} <span className="text-slate-500">({field.unit})</span>
              </label>
              <input
                id={field.key}
                type="number"
                min={0}
                step={field.step}
                disabled={!registration.isProvisioned}
                value={draft[field.key] ?? 0}
                onChange={(event) =>
                  setDraft((previous) => ({ ...previous, [field.key]: Number(event.target.value) }))
                }
                className="h-10 w-full rounded-xl border border-white/10 bg-[#080f0b] px-3 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={saving || !registration.isProvisioned}
          onClick={() => void save()}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/90 px-3.5 py-2 text-xs font-medium text-[#06130d] hover:bg-emerald-400 transition-colors disabled:opacity-50"
        >
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Save sources
        </button>
        {message && (
          <span className={`text-[11px] ${message.tone === "ok" ? "text-emerald-300" : "text-rose-300"}`} role="status">
            {message.text}
          </span>
        )}
      </div>
    </div>
  );
}
