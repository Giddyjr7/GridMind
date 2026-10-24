import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Telemetry Feed Unavailable",
  message = "An error occurred while connecting to the energy telemetry service. Please verify your connection or try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-red-200 bg-red-50/60 p-6 text-center flex flex-col items-center justify-center space-y-3",
        className
      )}
    >
      <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-semibold text-red-950">{title}</h4>
        <p className="text-xs text-red-800 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="border-red-300 text-red-800 hover:bg-red-100/80 gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry Connection
        </Button>
      )}
    </div>
  );
}
