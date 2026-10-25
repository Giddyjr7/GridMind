"use client";

import * as React from "react";
import Link from "next/link";
import { Zap, ArrowLeft, ShieldCheck, Sun, BatteryCharging, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AuthLayoutProps {
  children: React.ReactNode;
  heading: string;
  supportingText: string;
}

export function AuthLayout({ children, heading, supportingText }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* ========================================================= */}
      {/* LEFT COLUMN: BRANDED VISUAL PANEL (Desktop Only)          */}
      {/* ========================================================= */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-950 text-white relative overflow-hidden flex-col justify-between p-12 select-none">
        {/* Background decorative subtle microgrid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.18),rgba(255,255,255,0))] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e372d_1px,transparent_1px),linear-gradient(to_bottom,#1e372d_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-20 pointer-events-none" />

        {/* Top: Brand Header & Return Link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 fill-emerald-400/20" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-white tracking-tight">GridMind</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                Intelligence
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Public Website
          </Link>
        </div>

        {/* Center: Hero Branding & Microgrid Telemetry Preview */}
        <div className="relative z-10 space-y-8 my-auto py-8">
          <div className="space-y-3 max-w-lg">
            <Badge variant="healthy" size="sm" className="bg-emerald-950 text-emerald-400 border-emerald-800">
              Commercial Energy Intelligence
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-snug">
              Uninterrupted Power for Critical Commercial Infrastructure.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              GridMind balances national grid, diesel generators, rooftop solar, and LiFePO4 batteries so cold rooms, pharmacies, and supermarkets stay running at lowest operating cost.
            </p>
          </div>

          {/* Micro Telemetry Status Card */}
          <div className="rounded-xl border border-brand-800/80 bg-brand-900/40 p-4 backdrop-blur-sm max-w-md space-y-3">
            <div className="flex items-center justify-between border-b border-brand-800/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-200">
                  Krystal Ice Cold Storage, Ikeja Industrial
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">DEMO BENCHMARK</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded bg-brand-950/60 border border-brand-800/40">
                <span className="text-[10px] text-slate-400 block">Utility Grid</span>
                <span className="font-bold text-white font-mono">42.5 kW</span>
                <span className="text-[9px] text-emerald-400 block">Band A Stable</span>
              </div>

              <div className="p-2 rounded bg-brand-950/60 border border-brand-800/40">
                <span className="text-[10px] text-slate-400 block">Solar PV</span>
                <span className="font-bold text-white font-mono">38.4 kW</span>
                <span className="text-[9px] text-amber-400 block">Peak Irradiance</span>
              </div>

              <div className="p-2 rounded bg-brand-950/60 border border-brand-800/40">
                <span className="text-[10px] text-slate-400 block">Battery ESS</span>
                <span className="font-bold text-white font-mono">68% SOC</span>
                <span className="text-[9px] text-emerald-400 block">81.6 kWh Stored</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Blast Freezers (-21.4°C): Protected
              </span>
              <span className="text-emerald-400 font-mono">Clean Run: 5h 20m</span>
            </div>
          </div>
        </div>

        {/* Bottom: Prototype Environment Disclaimer */}
        <div className="relative z-10 pt-4 border-t border-brand-900/80 flex items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} GridMind Platform.</p>
          <span className="text-[11px] font-mono text-slate-500">
            Phase 2 Authentication UI
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: FOCUSED AUTHENTICATION FORM                 */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-16 overflow-y-auto">
        {/* Mobile Header */}
        <div className="flex items-center justify-between lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-950 flex items-center justify-center text-white">
              <Zap className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="font-bold text-base text-slate-900">GridMind</span>
          </Link>
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            Back to Home
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {heading}
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              {supportingText}
            </p>
          </div>

          {/* Form Content */}
          {children}
        </div>

        {/* Bottom Security / Terms Footer */}
        <div className="w-full max-w-md mx-auto mt-8 pt-6 border-t border-slate-200/80 text-center text-xs text-slate-500 space-y-1">
          <p className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Encrypted transmission & decoupled session layer</span>
          </p>
          <p className="text-[11px] text-slate-400">
            By accessing GridMind, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-slate-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-slate-700">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
