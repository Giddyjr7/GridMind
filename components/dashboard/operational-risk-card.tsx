"use client";

import * as React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  ArrowRight,
  Sparkles,
  Layers,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OperationalRiskSummary, OperationalRiskLevel } from "@/types/decision-intelligence";
import Link from "next/link";

interface OperationalRiskCardProps {
  riskSummary: OperationalRiskSummary;
  className?: string;
}

export function OperationalRiskCard({
  riskSummary,
  className = "",
}: OperationalRiskCardProps) {
  const getLevelConfig = (level: OperationalRiskLevel) => {
    switch (level) {
      case "normal":
        return {
          label: "NORMAL",
          badgeVariant: "healthy" as const,
          borderClass: "border-emerald-200",
          bgGradient: "from-emerald-50/40 via-white to-white",
          iconBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
          scoreColor: "text-emerald-700",
          Icon: ShieldCheck,
        };
      case "elevated":
        return {
          label: "ELEVATED RISK",
          badgeVariant: "warning" as const,
          borderClass: "border-amber-200",
          bgGradient: "from-amber-50/40 via-white to-white",
          iconBg: "bg-amber-100 text-amber-900 border-amber-200",
          scoreColor: "text-amber-700",
          Icon: AlertTriangle,
        };
      case "critical":
        return {
          label: "CRITICAL RISK",
          badgeVariant: "critical" as const,
          borderClass: "border-rose-200",
          bgGradient: "from-rose-50/40 via-white to-white",
          iconBg: "bg-rose-100 text-rose-900 border-rose-200",
          scoreColor: "text-rose-700",
          Icon: ShieldAlert,
        };
      case "insufficient_data":
      default:
        return {
          label: "DATA PENDING",
          badgeVariant: "neutral" as const,
          borderClass: "border-slate-200",
          bgGradient: "from-slate-50/40 via-white to-white",
          iconBg: "bg-slate-100 text-slate-800 border-slate-200",
          scoreColor: "text-slate-700",
          Icon: Info,
        };
    }
  };

  const config = getLevelConfig(riskSummary.level);
  const IconComponent = config.Icon;

  return (
    <Card
      className={`border ${config.borderClass} bg-gradient-to-r ${config.bgGradient} shadow-xs ${className}`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left section: Icon + Score + Title & Description */}
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${config.iconBg} shadow-2xs`}
            >
              <IconComponent className="w-5 h-5" />
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={config.badgeVariant} size="sm" className="font-bold">
                  {config.label}
                </Badge>
                <span className="text-xs font-semibold text-slate-500">
                  Risk Score:{" "}
                  <span className={`font-bold ${config.scoreColor}`}>
                    {riskSummary.score}/100
                  </span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-slate-100 text-slate-700 border border-slate-200">
                  Demo Simulation
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {riskSummary.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                {riskSummary.description}
              </p>

              {/* Primary Risk Factors */}
              {riskSummary.primaryRiskFactors &&
                riskSummary.primaryRiskFactors.length > 0 && (
                  <div className="pt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-500">
                      Drivers:
                    </span>
                    {riskSummary.primaryRiskFactors.map((factor, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center text-[11px] text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 font-medium"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                )}
            </div>
          </div>

          {/* Right section: Recommended Posture & Fast Navigation */}
          <div className="lg:border-l lg:border-slate-200/80 lg:pl-5 flex flex-col justify-between sm:flex-row lg:flex-col gap-3 shrink-0">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">
                Recommended Action
              </div>
              <p className="text-xs font-medium text-slate-800 max-w-xs leading-snug">
                {riskSummary.recommendedAction}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Link href="/dashboard/simulator">
                <Button size="sm" variant="outline" className="text-xs h-8">
                  <Layers className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                  Open Simulator
                </Button>
              </Link>
              <Link href="/dashboard/recommendations">
                <Button size="sm" className="text-xs h-8 bg-brand-950 hover:bg-brand-900 text-white">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-300" />
                  Review Action
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
