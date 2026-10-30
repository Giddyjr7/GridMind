import * as React from "react";
import { cn } from "@/lib/utils";
import { BadgeVariant } from "./badge";

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
        "rounded-2xl border border-slate-200/80 bg-white p-4 shadow-none flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="text-brand-800 p-1.5 rounded-lg bg-brand-50">
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
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2 gap-2">
          <span className="truncate">{subValue}</span>
          {badgeText && (
            <span className="shrink-0 text-[11px] font-medium text-slate-500">{badgeText}</span>
          )}
        </div>
      )}
    </div>
  );
}
