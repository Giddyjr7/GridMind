"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepItem {
  id: string;
  label: string;
}

interface AuthLayoutProps {
  children: React.ReactNode;
  heading?: string;
  supportingText?: string;
  backHref?: string;
  onBack?: () => void;
  steps?: StepItem[];
  currentStepIndex?: number;
}

export function AuthLayout({
  children,
  heading,
  supportingText,
  backHref,
  onBack,
  steps,
  currentStepIndex = 0,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#070c0a] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Subtle radial glow and grid pattern masked out at top */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(16,185,129,0.12),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0e1f18_1px,transparent_1px),linear-gradient(to_bottom,#0e1f18_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_20%,transparent_100%)] opacity-35"
        aria-hidden="true"
      />

      {/* Top bar */}
      <header className="relative z-20 w-full border-b border-white/[0.06] bg-[#070c0a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Back navigation */}
          <div className="flex items-center gap-3">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                aria-label="Go to previous step"
                className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : backHref ? (
              <Link
                href={backHref}
                aria-label="Back"
                className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            ) : null}

          </div>

          {/* Centred slim breadcrumb for multi-step onboarding */}
          {steps && steps.length > 0 && (
            <nav
              aria-label="Progress"
              className="hidden md:flex items-center gap-1.5 text-xs text-slate-400"
            >
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <React.Fragment key={step.id}>
                    <div
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors",
                        isCurrent && "bg-white/[0.06] text-white font-medium border border-white/10",
                        isCompleted && "text-emerald-400",
                        !isCurrent && !isCompleted && "text-slate-500 opacity-60"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-mono",
                          isCompleted && "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40",
                          isCurrent && "bg-white/10 text-white",
                          !isCurrent && !isCompleted && "border border-white/10 text-slate-500"
                        )}
                      >
                        {isCompleted ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : idx + 1}
                      </span>
                      <span>{step.label}</span>
                    </div>
                    {idx < steps.length - 1 && (
                      <span className="text-white/15 select-none font-mono">/</span>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          )}

          {/* Right helper info */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-emerald-400/90 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 hidden sm:inline-block">
              Demo Mode
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area: Centred, Apple/Tesla-grade spacing */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-14 w-full">
        <div className="w-full max-w-[480px] mx-auto space-y-6">
          {(heading || supportingText) && (
            <div className="text-center space-y-2">
              {heading && (
                <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                  {heading}
                </h1>
              )}
              {supportingText && (
                <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                  {supportingText}
                </p>
              )}
            </div>
          )}

          {children}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 py-6 border-t border-white/[0.04] text-center text-xs text-slate-500">
        <div className="max-w-md mx-auto flex items-center justify-center gap-4 text-[12px]">
          <Link href="/terms" className="hover:text-slate-300 transition-colors">
            Terms of Service
          </Link>
          <span className="text-white/10 select-none">•</span>
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-white/10 select-none">•</span>
          <span className="text-slate-500">Data stored on this device</span>
        </div>
      </footer>
    </div>
  );
}
