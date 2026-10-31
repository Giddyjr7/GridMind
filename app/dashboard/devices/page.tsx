"use client";

import * as React from "react";
import {
  Zap,
  Sun,
  Battery,
  Fuel,
} from "lucide-react";
import { useScenario } from "@/context/scenario-context";
import { RegisteredEquipment } from "@/components/dashboard/registered-equipment";
import { ConfiguredSources } from "@/components/dashboard/configured-sources";

export default function DevicesPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-slate-400">Loading devices...</div>}>
      <DevicesContent />
    </React.Suspense>
  );
}

function DevicesContent() {
  // Equipment lives in RegisteredEquipment, which reads the backend inventory.
  // This page keeps only the configured supply assets beneath it.
  const { inputs, outputs } = useScenario();

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      <RegisteredEquipment />

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Connected Devices & Sources
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor prioritized equipment loads and operational microgrid supply assets
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Zap className="h-3.5 w-3.5 text-blue-400" />
          <span>Power Sources (4)</span>
        </div>
      </div>

      <ConfiguredSources />

      {/* Add Device Modal */}
    </div>
  );
}
