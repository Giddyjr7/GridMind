import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, disabled, checked, defaultChecked, onChange, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className="space-y-1">
        <label
          htmlFor={checkboxId}
          className={cn(
            "flex items-start gap-2.5 text-xs text-slate-700 select-none cursor-pointer",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              type="checkbox"
              id={checkboxId}
              ref={ref}
              disabled={disabled}
              checked={checked}
              defaultChecked={defaultChecked}
              onChange={onChange}
              className={cn(
                "peer h-4 w-4 shrink-0 rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed",
                error
                  ? "border-red-400 checked:bg-red-600 checked:border-red-600"
                  : "border-slate-300 checked:bg-brand-950 checked:border-brand-950 hover:border-slate-400",
                className
              )}
              {...props}
            />
            <Check className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity stroke-[3]" />
          </div>
          {label && <span className="leading-snug">{label}</span>}
        </label>
        {error && (
          <p className="text-[11px] font-medium text-red-600 pl-6 animate-in fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
