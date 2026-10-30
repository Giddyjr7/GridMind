"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PremiumInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  isValidated?: boolean;
}

export const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightElement,
      isValidated,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-slate-300 select-none tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            className={cn(
              "flex h-11 w-full rounded-xl border bg-[#080f0b] px-3.5 py-2 text-sm text-white placeholder:text-slate-500 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-10",
              (rightElement || isValidated) && "pr-11",
              error
                ? "border-rose-500/70 focus-visible:ring-rose-500 focus-visible:border-rose-500"
                : "border-white/[0.08] hover:border-white/20",
              className
            )}
            {...props}
          />

          {/* Right Icon / Validated Check / Custom Element */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
            {isValidated && !error && (
              <span
                aria-hidden="true"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              >
                <Check className="h-3 w-3 stroke-[3]" />
              </span>
            )}
            {rightElement}
          </div>
        </div>

        {/* Fixed-height container to avoid layout shift when validation errors appear */}
        <div className="min-h-[18px]">
          {error ? (
            <p
              id={`${inputId}-error`}
              role="alert"
              aria-live="polite"
              className="text-[12px] font-medium text-rose-400 animate-in fade-in duration-150"
            >
              {error}
            </p>
          ) : helperText ? (
            <p id={`${inputId}-helper`} className="text-[11px] text-slate-400">
              {helperText}
            </p>
          ) : null}
        </div>
      </div>
    );
  }
);

PremiumInput.displayName = "PremiumInput";
