"use client";

import * as React from "react";
import Link from "next/link";
import {
  Zap,
  Sun,
  BatteryCharging,
  Cpu,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Sliders,
  Lightbulb,
  Layers,
  ThermometerSnowflake,
  Pill,
  ShoppingBag,
  Stethoscope,
  Wrench,
  ChevronRight,
  TrendingUp,
  Flame,
  FileCheck2,
} from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { HeroDashboardPreview } from "@/components/marketing/hero-dashboard-preview";
import { InteractiveSimulatorPreview } from "@/components/marketing/interactive-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-[#fcfdfc] text-slate-900 selection:bg-brand-100 selection:text-brand-950 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================= */}
        {/* HERO SECTION                                             */}
        {/* ========================================================= */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          {/* Subtle ambient background glow */}
          <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-20 left-10 -z-10 w-72 h-72 bg-brand-50/60 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Core Positioning Copy & CTAs */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-300 bg-brand-100 text-brand-950 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  AI-Assisted Energy Continuity Intelligence
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                  Take Control of <span className="text-brand-950 underline decoration-emerald-500/40 decoration-4">Every Watt.</span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-xl">
                  GridMind helps your business make smarter energy decisions, balance operating costs and protect the equipment that matters most.
                </p>

                {/* Subtitle tag */}
                <p className="text-xs uppercase tracking-wider font-semibold text-emerald-800">
                  Smarter Energy. Uninterrupted Business.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto bg-brand-950 hover:bg-brand-900 text-white font-medium shadow-md shadow-brand-950/10">
                      Explore GridMind
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>

                  <a href="#how-it-works">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-300 text-slate-800 hover:bg-slate-100">
                      See How It Works
                    </Button>
                  </a>

                  <Link href="/dashboard">
                    <Button variant="ghost" size="lg" className="w-full sm:w-auto text-brand-900 hover:text-brand-950 hover:bg-brand-50/70">
                      View Demo Console
                    </Button>
                  </Link>
                </div>

                {/* Micro trust indicators (factual, no fake claims) */}
                <div className="pt-4 border-t border-slate-200/70 grid grid-cols-3 gap-4 text-xs text-slate-500">
                  <div>
                    <span className="block font-bold text-slate-800">Multi-Source</span>
                    <span>Grid, Solar, Battery, Gen</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800">Rule-Based</span>
                    <span>Prioritized Load Shedding</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800">Transparent</span>
                    <span>Explainable AI Guidance</span>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Fidelity Energy Operations Visual */}
              <div className="lg:col-span-6 relative">
                <HeroDashboardPreview />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* PROBLEM SECTION                                          */}
        {/* ========================================================= */}
        <section className="py-20 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="outline" size="md" className="mb-3 text-slate-700 bg-white border-slate-300">
                The Operational Reality
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Operating a Business When Electricity Isn&apos;t Guaranteed
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Businesses managing critical cold chains and sensitive commercial operations face constant trade-offs between staggering diesel costs and the devastating financial risk of equipment failure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Problem 1 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm space-y-4 transition-all hover:border-slate-300">
                <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Unpredictable Grid Availability
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Utility feeders drop without warning, voltage spikes endanger machinery, and manual changeovers cause jarring interruptions. Operators lack visibility into when utility power is actually expected to return.
                </p>
                <div className="pt-2 text-xs text-amber-800 font-medium">
                  Impact: Unscheduled downtime and operational uncertainty
                </div>
              </div>

              {/* Problem 2 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm space-y-4 transition-all hover:border-slate-300">
                <div className="h-12 w-12 rounded-xl bg-red-50 border border-red-200/80 flex items-center justify-center text-red-600">
                  <Flame className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Expensive Backup Power
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Generators burn through expensive diesel fuel (₦1,200+/liter), often running at inefficient partial loads or powering empty rooms, while rooftop solar and battery storage sit underutilized or mismanaged.
                </p>
                <div className="pt-2 text-xs text-red-700 font-medium">
                  Impact: Severe cash flow erosion from avoidable fuel bills
                </div>
              </div>

              {/* Problem 3 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm space-y-4 transition-all hover:border-slate-300">
                <div className="h-12 w-12 rounded-xl bg-brand-50 border border-brand-200/80 flex items-center justify-center text-brand-900">
                  <ThermometerSnowflake className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Critical Equipment You Cannot Switch Off
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Blast freezers, medical vaccine safes, and server racks must stay energized at all costs. Yet during an outage, nonessential air conditioners frequently compete for the exact same battery reserve.
                </p>
                <div className="pt-2 text-xs text-brand-900 font-medium">
                  Impact: Product spoilage liabilities and safety risks
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* PRODUCT VALUE SECTION                                    */}
        {/* ========================================================= */}
        <section id="product" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="healthy" size="md" className="mb-3">
                Core Platform Capabilities
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Complete Energy Intelligence Built for Commercial Operations
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Designed to unify your facility&apos;s physical power sources with smart load prioritization and transparent, explainable recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature A */}
              <div className="p-7 rounded-2xl border border-slate-200/90 bg-[#fdfefe] space-y-3.5 hover:shadow-md transition-shadow">
                <div className="h-11 w-11 rounded-xl bg-brand-950 text-emerald-400 flex items-center justify-center">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  A. Unified Energy Visibility
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Monitor the real-time status of your national grid connection, solar PV array, battery ESS charge, and generator output all in one cohesive, intuitive control pane.
                </p>
              </div>

              {/* Feature B */}
              <div className="p-7 rounded-2xl border border-slate-200/90 bg-[#fdfefe] space-y-3.5 hover:shadow-md transition-shadow">
                <div className="h-11 w-11 rounded-xl bg-brand-950 text-emerald-400 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  B. Intelligent Backup Planning
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Know exact backup runtimes down to the hour. Evaluate how shifting or reducing nonessential loads immediately extends battery protection for vital assets.
                </p>
              </div>

              {/* Feature C */}
              <div className="p-7 rounded-2xl border border-slate-200/90 bg-[#fdfefe] space-y-3.5 hover:shadow-md transition-shadow">
                <div className="h-11 w-11 rounded-xl bg-brand-950 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  C. Critical-Load Prioritization
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Group your facility equipment into strict tiers: Critical (blast freezers, medical fridges), Important (warehouse lighting, IT), and Deferrable (packaging HVAC, comfort cooling).
                </p>
              </div>

              {/* Feature D */}
              <div className="p-7 rounded-2xl border border-slate-200/90 bg-[#fdfefe] space-y-3.5 hover:shadow-md transition-shadow">
                <div className="h-11 w-11 rounded-xl bg-brand-950 text-emerald-400 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  D. AI-Assisted Recommendations
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Receive proactive dispatch suggestions before crises occur, such as pre-cooling cold storage using surplus solar power prior to an afternoon grid outage window.
                </p>
              </div>

              {/* Feature E */}
              <div className="p-7 rounded-2xl border border-slate-200/90 bg-[#fdfefe] space-y-3.5 hover:shadow-md transition-shadow">
                <div className="h-11 w-11 rounded-xl bg-brand-950 text-emerald-400 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  E. Cost and Energy Analytics
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Track dynamic run-rates in local currency (NGN) comparing effective generator generation costs (₦350+/kWh) against grid tariffs (₦206/kWh) and solar amortizations.
                </p>
              </div>

              {/* Feature F */}
              <div className="p-7 rounded-2xl border border-slate-200/90 bg-[#fdfefe] space-y-3.5 hover:shadow-md transition-shadow">
                <div className="h-11 w-11 rounded-xl bg-brand-950 text-emerald-400 flex items-center justify-center">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  F. Decision Transparency & Auditing
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Never wonder why an automated action was taken. Maintain a clear, human-in-the-loop record of every suggestion, operator approval, and verified fuel-saving outcome.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* HOW IT WORKS                                              */}
        {/* ========================================================= */}
        <section id="how-it-works" className="py-24 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="outline" size="md" className="mb-3 text-slate-700 bg-white border-slate-300">
                Operational Workflow
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Four Steps to Resilient Energy Continuity
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                How GridMind bridges asset monitoring, algorithmic forecasting, and human decision-making.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Step 1 */}
              <div className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-950 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div className="h-0.5 flex-1 bg-slate-200 hidden md:block" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Connect & Configure
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Map your utility feeder, generator size, solar capacity, and battery storage. Assign priority tags to all site appliances.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-950 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div className="h-0.5 flex-1 bg-slate-200 hidden md:block" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Monitor Real-Time Flow
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Track power balance, battery charge level, voltage quality, and active load demand across every operational circuit.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-950 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div className="h-0.5 flex-1 bg-slate-200 hidden md:block" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Evaluate AI Guidance
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  GridMind models solar forecasts and outage risks to generate cost-saving dispatch recommendations with explicit reasoning.
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-950 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Approve & Audit
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Operators review and approve recommendations. Outcomes and avoided fuel costs are logged into an immutable operational audit trail.
                </p>
              </div>
            </div>

            {/* Hardware disclaimer requirement */}
            <div className="mt-14 rounded-xl border border-slate-200 bg-white p-4 max-w-2xl mx-auto text-center text-xs text-slate-500">
              <strong className="text-slate-800">Note:</strong> Actual electrical device switching and circuit control depend on compatible future hardware relay integrations and certified site safety mechanisms.
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* INTERACTIVE PRODUCT PREVIEW                               */}
        {/* ========================================================= */}
        <InteractiveSimulatorPreview />

        {/* ========================================================= */}
        {/* BUSINESS USE CASES                                        */}
        {/* ========================================================= */}
        <section id="solutions" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="outline" size="md" className="mb-3 text-slate-700 bg-white border-slate-300">
                Tailored Solutions
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Engineered for High-Stakes Commercial Operations
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Explore how GridMind brings tailored continuity intelligence to specific sectors dependent on uninterrupted refrigeration and power.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Use Case 1 */}
              <div className="rounded-2xl border border-slate-200/90 p-6 bg-[#fbfcfb] space-y-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ThermometerSnowflake className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Cold Rooms & Frozen-Food Storage
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Maintain stringent sub-zero storage thresholds for perishable seafood and meat. Optimize thermal pre-cooling before peak tariff windows and prevent catastrophic spoilage liabilities during prolonged feeder outages.
                </p>
              </div>

              {/* Use Case 2 */}
              <div className="rounded-2xl border border-slate-200/90 p-6 bg-[#fbfcfb] space-y-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Pill className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Pharmacies & Vaccine Depots
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Protect sensitive biologics, vaccines, and insulin that require continuous +2°C to +8°C climate control. Dedicated battery dispatch rules ensure zero downtime for critical cooling circuits.
                </p>
              </div>

              {/* Use Case 3 */}
              <div className="rounded-2xl border border-slate-200/90 p-6 bg-[#fbfcfb] space-y-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Supermarkets & Food Retailers
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Balance high customer checkout lighting and open display chillers with expensive generator costs. Automate shedding of back-office and warehouse cooling during backup generator hours.
                </p>
              </div>

              {/* Use Case 4 */}
              <div className="rounded-2xl border border-slate-200/90 p-6 bg-[#fbfcfb] space-y-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Small Clinics & Diagnostic Labs
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ensure uninterruptible operation for blood banking units, centrifuges, imaging machinery, and patient emergency lighting without noisy, inefficient continuous generator idling.
                </p>
              </div>

              {/* Use Case 5 */}
              <div className="rounded-2xl border border-slate-200/90 p-6 bg-[#fbfcfb] space-y-3 md:col-span-2 lg:col-span-2">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Wrench className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Solar Installers & Energy-as-a-Service EPCs
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Provide your commercial clients with an intelligent software layer on top of your solar inverter and battery installations. Offer continuous operational monitoring, quantified runtime predictions, and verified energy cost comparisons.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* WHY GRIDMIND                                              */}
        {/* ========================================================= */}
        <section id="why-gridmind" className="py-24 bg-slate-50 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="healthy" size="md" className="mb-3">
                Product Principles
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Why Commercial Operators Trust GridMind
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Five foundational tenets guiding every recommendation and calculation we provide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-xs">
              <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
                <span className="font-bold text-brand-950 text-sm block">1. Business-First</span>
                <p className="text-slate-600 leading-relaxed">
                  Decisions are evaluated against financial and commercial impact, not abstract engineering metrics.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
                <span className="font-bold text-brand-950 text-sm block">2. Critical Loads First</span>
                <p className="text-slate-600 leading-relaxed">
                  Spoliage risks and vital refrigeration are strictly protected before nonessential comforts are powered.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
                <span className="font-bold text-brand-950 text-sm block">3. Cost & Continuity</span>
                <p className="text-slate-600 leading-relaxed">
                  We balance the trade-off: avoiding costly diesel burn without compromising system uptime.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
                <span className="font-bold text-brand-950 text-sm block">4. Explainable AI</span>
                <p className="text-slate-600 leading-relaxed">
                  Every recommendation shows its underlying rationale, solar forecast, and estimated financial return.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
                <span className="font-bold text-brand-950 text-sm block">5. Auditable Decisions</span>
                <p className="text-slate-600 leading-relaxed">
                  Full operator sign-off and historical logs ensure complete organizational accountability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* FINAL CALL TO ACTION                                      */}
        {/* ========================================================= */}
        <section className="py-24 bg-brand-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_50%)]" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <Badge variant="healthy" size="md" className="font-bold">
              Get Started with GridMind
            </Badge>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Your Energy. Your Decisions. More Confidence.
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explore how intelligent load shedding, multi-source orchestration, and predictive AI transform chaotic energy environments into reliable, cost-effective operations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 shadow-lg shadow-emerald-500/20">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-600 text-slate-200 hover:bg-slate-900 hover:text-white px-8">
                  Explore the Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
