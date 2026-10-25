import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge, BadgeVariant } from "./badge";

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  badgeText?: string;
  badgeVariant?: BadgeVariant;
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
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="text-slate-600 p-1.5 rounded-lg bg-slate-100 border border-slate-200">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-semibold text-slate-600">
            {unit}
          </span>
        )}
      </div>

      {(subValue || badgeText) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2 gap-2">
          <span className="truncate">{subValue}</span>
          {badgeText && (
            <Badge variant={badgeVariant} size="sm" className="shrink-0 font-medium">
              {badgeText}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
