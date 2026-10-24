import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightElement,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={cn(
              "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
              leftIcon && "pl-9",
              rightElement && "pr-10",
              error
                ? "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-400"
                : "border-slate-300 hover:border-slate-400 focus-visible:border-brand-800 focus-visible:ring-brand-700/30",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-[11px] font-medium text-red-600 animate-in fade-in">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-[11px] text-slate-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
