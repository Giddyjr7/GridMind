"use client";

import * as React from "react";
import { GridMindLogo } from "@/components/brand/gridmind-logo";
import { cn } from "@/lib/utils";

interface FullScreenTransitionProps {
  heading: string;
  subheading?: string;
  name?: string;
  isGreeting?: boolean;
  onSkip?: () => void;
  className?: string;
}

export function FullScreenTransition({
  heading,
  subheading,
  name,
  isGreeting = false,
  onSkip,
  className,
}: FullScreenTransitionProps) {
  return (
    <div
      onClick={onSkip}
      role="region"
      aria-live="polite"
      aria-label="Transition screen"
      className={cn(
        "fixed inset-0 z-50 bg-[#070c0a] text-white flex flex-col items-center justify-center p-6 select-none cursor-pointer overflow-hidden",
        className
      )}
    >
      {/* Background ambient radial glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(16,185,129,0.15),transparent_60%)] animate-pulse"
        style={{ animationDuration: "3s" }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
        {/* Pulsing GridMind Logo */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-ping opacity-30" />
          <div className="relative p-3 rounded-2xl bg-[#0c1410] border border-white/10 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <GridMindLogo compact inverse markClassName="h-12 w-12" />
          </div>
        </div>

        {/* Text presentation */}
        <div className="space-y-2">
          {isGreeting ? (
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-slate-400">
              {heading}{" "}
              <span className="text-white font-semibold">{name}</span>
            </h2>
          ) : (
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white animate-in fade-in duration-300">
              {heading}
            </h2>
          )}

          {subheading && (
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto animate-in fade-in delay-150 duration-300">
              {subheading}
            </p>
          )}
        </div>

        {/* Small skippable hint */}
        {onSkip && (
          <p className="text-[11px] text-slate-500 hover:text-slate-400 transition-colors pt-4">
            Click anywhere to continue
          </p>
        )}
      </div>
    </div>
  );
}
