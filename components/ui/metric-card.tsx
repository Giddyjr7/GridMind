import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  badgeText?: string;
  badgeVariant?: "healthy" | "warning" | "critical" | "info" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  subValue,
  badgeText,
  badgeVariant = "neutral",
  icon,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/90 bg-white p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="text-slate-400 p-1 rounded-md bg-slate-50">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-slate-500">
            {unit}
          </span>
        )}
      </div>

      {(subValue || badgeText) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-50 pt-2">
          <span>{subValue}</span>
          {badgeText && (
            <Badge variant={badgeVariant} size="sm">
              {badgeText}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
