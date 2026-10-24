"use client";

import * as React from "react";
import {
  Cpu,
  RotateCcw,
  ShieldAlert,
  Info,
  Building2,
  MapPin,
  Flame,
  Battery,
  Sun,
  Zap,
} from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  SimulationControlPanel,
  LiveEnergyStatus,
  ApplianceControlPanel,
  SimulationEventsLog,
} from "@/components/simulator";
import { useSimulation } from "@/context/simulation-context";

export default function SimulatorPage() {
  const { resetToDefaultScenario } = useSimulation();

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header with Title, Badges and Actions */}
        <SectionHeading
          title="Energy Crisis Simulator"
          description="Interactive microgrid resilience testing sandbox. Model national grid disturbances, test peak solar thermal buffering, simulate battery discharge curves, and verify critical refrigeration continuity."
          badge={
            <Badge variant="warning" size="sm" className="font-mono text-[10px] uppercase font-bold">
              Simulated Benchmark
            </Badge>
          }
          actions={
            <div className="flex items-center gap-2">
              <Badge variant="healthy" size="sm" className="font-mono text-[10px] uppercase font-bold">
                Deterministic Engine Active
              </Badge>
            </div>
          }
        />

        {/* 1. Live Energy Status & Dispatch Balance */}
        <LiveEnergyStatus />

        {/* 2. Simulation Control Panel */}
        <SimulationControlPanel />

        {/* 3. Main Two-Column Layout: Appliances & Events */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Appliance Priority & Load Dispatch */}
          <div className="lg:col-span-7 space-y-6">
            <ApplianceControlPanel />
          </div>

          {/* Right Column (5 cols): Events Audit Log & Benchmark Info */}
          <div className="lg:col-span-5 space-y-6">
            <SimulationEventsLog />

            {/* Benchmark Site Parameters Card */}
            <Card className="border-slate-200 shadow-xs bg-slate-50/50">
              <CardHeader className="py-3 px-4 border-b border-slate-100">
                <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  Facility Technical Benchmark
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-xs space-y-2.5 text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    Facility Location:
                  </span>
                  <span className="font-semibold text-slate-800">
                    Krystal Ice Cold Storage, Ikeja, Lagos
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-blue-500" />
                    Contracted Grid Demand:
                  </span>
                  <span className="font-semibold text-slate-800">
                    150.0 kW (Band A 11kV @ ₦206/kWh)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-500" />
                    Solar PV Array:
                  </span>
                  <span className="font-semibold text-slate-800">
                    75.0 kWp Rooftop Monocrystalline
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Battery className="w-3 h-3 text-emerald-500" />
                    Battery Storage Bank:
                  </span>
                  <span className="font-semibold text-slate-800">
                    120.0 kWh LiFePO₄ (60 kW max discharge)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-600" />
                    Backup Genset:
                  </span>
                  <span className="font-semibold text-slate-800">
                    Cummins 160 kVA Prime (650L diesel tank)
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-400 leading-relaxed">
                  ⚠️ <em>Notice: All simulator interactions and calculations are software demonstrations. Never connect to physical equipment without certified ATS isolation.</em>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
