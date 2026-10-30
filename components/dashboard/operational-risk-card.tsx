"use client";

import * as React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  ArrowRight,
  Lightbulb,
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
          bgGradient: "bg-white",
          iconBg: "bg-brand-50 text-brand-800 border-brand-100",
          scoreColor: "text-emerald-700",
          Icon: ShieldCheck,
        };
      case "elevated":
        return {
          label: "ELEVATED RISK",
          badgeVariant: "warning" as const,
          borderClass: "border-amber-200",
          bgGradient: "bg-white",
          iconBg: "bg-amber-100 text-amber-900 border-amber-200",
          scoreColor: "text-amber-700",
          Icon: AlertTriangle,
        };
      case "critical":
        return {
          label: "CRITICAL RISK",
          badgeVariant: "critical" as const,
          borderClass: "border-rose-200",
          bgGradient: "bg-white",
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
          bgGradient: "bg-white",
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
      className={`border-slate-200/80 ${config.bgGradient} ${className}`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {riskSummary.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                {riskSummary.description}
              </p>

              {riskSummary.primaryRiskFactors &&
                riskSummary.primaryRiskFactors.length > 0 && (
                  <details className="pt-1 text-[11px] text-slate-500">
                    <summary className="cursor-pointer font-medium hover:text-slate-700">
                      Why this status
                    </summary>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-600">
                      {riskSummary.primaryRiskFactors.map((factor) => <li key={factor}>{factor}</li>)}
                    </ul>
                  </details>
                )}
            </div>
          </div>

          {/* Right section: Recommended Posture & Fast Navigation */}
          <div className="sm:border-l sm:border-slate-200/80 sm:pl-5 flex flex-col gap-3 shrink-0">
            <p className="text-sm font-medium text-slate-800 max-w-xs leading-snug">
              {riskSummary.recommendedAction}
            </p>

            <div>
              <Link href="/dashboard/recommendations">
                <Button size="sm" className="text-xs h-9 bg-brand-950 hover:bg-brand-900 text-white">
                  <Lightbulb className="w-3.5 h-3.5 mr-1.5 text-emerald-300" />
                  Review recommendation
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
