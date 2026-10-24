import * as React from "react";
import { Metadata } from "next";
import { Cpu, Play, Sliders, AlertTriangle, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InteractiveSimulatorPreview } from "@/components/marketing/interactive-preview";

export const metadata: Metadata = {
  title: "Energy Simulator — GridMind Console",
  description: "Simulate utility outage scenarios and evaluate backup runtime.",
};

export default function SimulatorPage() {
  return (
    <PageContainer>
      <SectionHeading
        title="Energy Crisis Simulator"
        description="Model what-if utility feeder drops, derate solar generation, and test automated load-shedding policies."
        badge={
          <Badge variant="healthy" size="sm" className="font-mono text-[10px]">
            ACTIVE BENCHMARK
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="sm" className="font-mono text-[10px]">
              DETERMINISTIC SIMULATION
            </Badge>
          </div>
        }
      />

      {/* Simulator Module Wrapper */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <InteractiveSimulatorPreview />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <Card>
          <CardHeader>
            <CardTitle>Continuous Thermal Storage</CardTitle>
            <CardDescription>Blast Freezer Room A (-21.4°C)</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>
              Freezer thermal inertia allows a 90-minute grace window if pre-cooled to -25°C before utility load-shedding windows.
            </p>
            <div className="pt-2 flex justify-between font-mono text-[11px]">
              <span className="text-slate-400">Target Temp:</span>
              <span className="font-bold text-slate-800">-22.0°C</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diesel Avoidance Benchmark</CardTitle>
            <CardDescription>Cummins 160kVA Prime Generator</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>
              Curtailing 16 kW Packaging Floor HVAC avoids 4.5 liters of diesel per hour, saving ₦5,625/hr during daytime battery support.
            </p>
            <div className="pt-2 flex justify-between font-mono text-[11px]">
              <span className="text-slate-400">Fuel Cost:</span>
              <span className="font-bold text-slate-800">₦1,250/L</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Battery Reserve Threshold</CardTitle>
            <CardDescription>120 kWh LiFePO4 ESS Bank</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2">
            <p>
              Configured with a 20% emergency reserve floor (24 kWh) dedicated exclusively to vaccine refrigeration and IT telemetry.
            </p>
            <div className="pt-2 flex justify-between font-mono text-[11px]">
              <span className="text-slate-400">Current SOC:</span>
              <span className="font-bold text-emerald-700">68% Healthy</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
