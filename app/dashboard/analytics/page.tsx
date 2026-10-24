import * as React from "react";
import { Metadata } from "next";
import { BarChart3, TrendingUp, Coins, Fuel, Leaf } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { Badge } from "@/components/ui/badge";
import { energyService } from "@/services";
import { formatCurrency, formatTariff } from "@/lib/formatters";

export const metadata: Metadata = {
  title: "Analytics & Costs — GridMind Console",
  description: "Operating cost analytics, generator fuel avoidance, and efficiency metrics.",
};

export default async function AnalyticsPage() {
  const metrics = await energyService.getDashboardMetrics();
  const { cost } = metrics;

  return (
    <PageContainer>
      <SectionHeading
        title="Cost & Runtime Analytics"
        description="Comprehensive financial run-rates, levelized cost of energy (LCOE) across sources, and verified diesel avoidance analytics."
        badge={
          <Badge variant="healthy" size="sm" className="font-mono text-[10px]">
            ACTIVE TELEMETRY
          </Badge>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Today's Operational Cost"
          value={formatCurrency(cost.todayTotalCost)}
          subValue="Grid tariff + amortized solar"
          badgeText="-31% vs Yesterday"
          badgeVariant="healthy"
          icon={<Coins className="h-4 w-4" />}
        />

        <MetricCard
          label="Month Projected Savings"
          value={formatCurrency(cost.estimatedSavingsMonth)}
          subValue="Avoided diesel generator run-hours"
          badgeText="Verified Buffer"
          badgeVariant="healthy"
          icon={<TrendingUp className="h-4 w-4" />}
        />

        <MetricCard
          label="Grid vs Diesel Differential"
          value="₦150.25"
          unit="/kWh"
          subValue="Grid: ₦206/kWh vs Gen: ₦356/kWh"
          badgeText="High Leverage"
          badgeVariant="info"
          icon={<Fuel className="h-4 w-4" />}
        />

        <MetricCard
          label="Solar LCOE"
          value="₦42.00"
          unit="/kWh"
          subValue="Amortized equipment capital cost"
          badgeText="Cheapest Source"
          badgeVariant="healthy"
          icon={<Leaf className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <Card>
          <CardHeader>
            <CardTitle>Levelized Cost Comparison by Power Source</CardTitle>
            <CardDescription>Direct operating cost in Nigerian Naira (NGN/kWh)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="space-y-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-800">Rooftop Solar PV</span>
                  <span className="font-mono text-emerald-700 font-bold">₦42.00 / kWh</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "12%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-800">LiFePO4 Battery ESS</span>
                  <span className="font-mono text-sky-700 font-bold">₦68.00 / kWh</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: "19%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-800">National Grid (EKEDC / IE Band A)</span>
                  <span className="font-mono text-slate-700 font-bold">₦206.00 / kWh</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: "58%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-800">Cummins Prime Diesel Generator</span>
                  <span className="font-mono text-red-600 font-bold">₦356.25 / kWh</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historical Load-Shedding Savings</CardTitle>
            <CardDescription>Avoided fuel consumption through smart deferrals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-600">
            <p className="leading-relaxed">
              By proactively shedding the 16 kW Packaging Floor HVAC whenever the generator engages, the facility avoided burning 42.5 liters of diesel over the last 48 hours.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-medium">
              Net Avoided Cost: ₦53,125 saved while maintaining uninterrupted Blast Freezer temperatures.
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
