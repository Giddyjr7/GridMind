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
  StrategyComparisonCard,
} from "@/components/simulator";
import { AgentPipelineWorkflow } from "@/components/workflow";
import { useSimulation } from "@/context/simulation-context";

export default function SimulatorPage() {
  const { strategyComparison, agentPipeline } = useSimulation();

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header with Title, Badges and Actions */}
        <SectionHeading
          title="Energy Crisis Simulator"
          description="Test outages and see how GridMind protects critical loads."
          badge={
            <Badge variant="neutral" size="sm">
              Demo
            </Badge>
          }
          actions={
            <div className="flex items-center gap-2">
              <Badge variant="healthy" size="sm">
                Engine active
              </Badge>
            </div>
          }
        />

        {/* 1. Live Energy Status & Dispatch Balance */}
        <LiveEnergyStatus />

        {/* 2. Before-and-After Strategy Comparison */}
        {strategyComparison && (
          <details className="group rounded-2xl border border-slate-200/80 bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Compare GridMind with the baseline</h3>
                <p className="mt-1 text-xs text-slate-500">Open the detailed cost and runtime comparison</p>
              </div>
              <Badge variant="healthy" size="sm">{strategyComparison.costReductionPercentage}% lower cost</Badge>
            </summary>
            <div className="border-t border-slate-100 p-4">
              <StrategyComparisonCard comparison={strategyComparison} />
            </div>
          </details>
        )}

        {/* 3. 5-Stage Agent Decision Pipeline */}
        {agentPipeline && (
          <AgentPipelineWorkflow pipeline={agentPipeline} />
        )}

        {/* 4. Simulation Control Panel (Presets + Controls) */}
        <SimulationControlPanel />

        {/* 5. Main Two-Column Layout: Appliances & Events */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Appliance Priority & Load Dispatch */}
          <div className="lg:col-span-7 space-y-6">
            <ApplianceControlPanel />
          </div>

          {/* Right Column (5 cols): Events Audit Log & Benchmark Info */}
          <div className="lg:col-span-5 space-y-6">
            <SimulationEventsLog />

            {/* Benchmark Site Parameters Card */}
            <details className="rounded-2xl border border-slate-200/80 bg-white">
              <summary className="cursor-pointer list-none px-4 py-3 text-xs font-semibold text-slate-700">
                Facility technical details
              </summary>
            <Card className="rounded-none border-0 border-t border-slate-100 shadow-none">
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
            </details>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
