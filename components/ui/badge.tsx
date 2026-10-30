import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "healthy"
  | "healthy-high"
  | "solid-healthy"
  | "warning"
  | "warning-high"
  | "solid-warning"
  | "critical"
  | "critical-high"
  | "solid-critical"
  | "info"
  | "info-high"
  | "solid-info"
  | "neutral"
  | "neutral-high"
  | "solid-neutral"
  | "brand"
  | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    // Brand
    default: "bg-brand-950 text-white border-transparent shadow-xs font-semibold",
    brand: "bg-brand-950 text-white border-brand-800 shadow-xs font-semibold",

    // Success / Protected / Online (Green/Emerald)
    healthy: "bg-brand-50 text-brand-950 border-brand-200 font-semibold",
    "healthy-high": "bg-emerald-700 text-white border-emerald-800 font-semibold shadow-xs",
    "solid-healthy": "bg-emerald-700 text-white border-emerald-800 font-semibold shadow-xs",

    // Warning / Simulation / Benchmark (Amber/Yellow)
    warning: "bg-amber-100 text-amber-950 border-amber-300 font-semibold",
    "warning-high": "bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs",
    "solid-warning": "bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs",

    // Critical / Outage / Hazard (Red/Rose)
    critical: "bg-rose-100 text-rose-950 border-rose-300 font-semibold",
    "critical-high": "bg-rose-700 text-white border-rose-800 font-semibold shadow-xs",
    "solid-critical": "bg-rose-700 text-white border-rose-800 font-semibold shadow-xs",

    // Info / Mode / Status (Sky/Navy)
    info: "bg-slate-100 text-slate-800 border-slate-200 font-semibold",
    "info-high": "bg-sky-800 text-white border-sky-900 font-semibold shadow-xs",
    "solid-info": "bg-sky-800 text-white border-sky-900 font-semibold shadow-xs",

    // Neutral / Standby / Holding (Slate/Zinc)
    neutral: "bg-slate-100 text-slate-700 border-slate-200 font-semibold",
    "neutral-high": "bg-slate-800 text-white border-slate-900 font-semibold shadow-xs",
    "solid-neutral": "bg-slate-800 text-white border-slate-900 font-semibold shadow-xs",

    // Outline
    outline: "bg-white text-slate-900 border-slate-300 font-semibold",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-colors leading-none tracking-normal select-none",
        variantStyles[variant] || variantStyles.default,
        sizeStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
