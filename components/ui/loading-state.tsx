import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingState({
  message = "Loading energy telemetry...",
  className,
  size = "md",
}: LoadingStateProps) {
  const iconSize = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 space-y-3 text-slate-500",
        className
      )}
    >
      <Loader2 className={cn("animate-spin text-brand-800", iconSize)} />
      {message && <p className="text-xs font-medium text-slate-500">{message}</p>}
    </div>
  );
}

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/80", className)}
      {...props}
    />
  );
}
