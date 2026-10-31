"use client";

import * as React from "react";
import { GridMindLogo } from "@/components/brand/gridmind-logo";
import { ArrowRight } from "lucide-react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centred Card with a restrained brand glow */}
      <div className="relative w-full max-w-md rounded-[24px] border border-white/10 bg-[#0c1410] p-8 text-center text-white shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Soft radial emerald glow behind logo */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(16,185,129,0.2),transparent_65%)]"
          aria-hidden="true"
        />

        {/* Centred Logo */}
        <div className="relative mx-auto flex items-center justify-center mb-6">
          <div className="p-3.5 rounded-2xl bg-[#080f0b] border border-white/10 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
            <GridMindLogo compact inverse markClassName="h-10 w-10" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3 relative z-10">
          <h2 id="welcome-modal-title" className="text-2xl font-medium tracking-tight">
            Welcome to <span className="text-emerald-400 font-semibold">GridMind</span>
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
            GridMind provides decision support and continuity intelligence for energy management, helping your facility balance solar, batteries, and backup power without automated equipment takeover.
          </p>
        </div>

        {/* Call to action */}
        <div className="pt-8 relative z-10">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-sm flex items-center justify-center gap-2 transition-all duration-150 shadow-[0_1px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_1px_30px_rgba(16,185,129,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <span>Get started</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
