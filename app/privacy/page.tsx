"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  Lock,
  Cpu,
  Database,
  Globe,
  UserCheck,
  Clock,
  Lightbulb,
  Info,
  Building,
  Mail,
  Scale,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import { LegalPageLayout, TocItem } from "@/components/legal/legal-page-layout";
import { Badge } from "@/components/ui/badge";

const PRIVACY_TOC: TocItem[] = [
  { id: "section-1", number: "1", title: "Introduction and Scope" },
  { id: "section-2", number: "2", title: "Information We May Collect" },
  { id: "section-3", number: "3", title: "How Information Is Used" },
  { id: "section-4", number: "4", title: "Legal Bases for Processing" },
  { id: "section-5", number: "5", title: "AI Processing & Automated Recommendations" },
  { id: "section-6", number: "6", title: "How Information Is Shared" },
  { id: "section-7", number: "7", title: "Google Authentication & OAuth" },
  { id: "section-8", number: "8", title: "Data Retention & Disposal" },
  { id: "section-9", number: "9", title: "Information Security Posture" },
  { id: "section-10", number: "10", title: "International Data Transfers" },
  { id: "section-11", number: "11", title: "Your Privacy Rights" },
  { id: "section-12", number: "12", title: "Nigerian Data Protection (NDPA 2023)" },
  { id: "section-13", number: "13", title: "Children's Privacy" },
  { id: "section-14", number: "14", title: "Changes to This Privacy Policy" },
  { id: "section-15", number: "15", title: "Contact Information & Legal Entity Placeholders" },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      documentType="privacy"
      effectiveDate="October 25, 2026"
      lastUpdated="October 25, 2026"
      version="1.0-DRAFT"
      description="This Privacy Policy transparently describes how the GridMind Energy Continuity Platform handles information, distinguishing our prototype evaluation environment from intended production services."
      tocItems={PRIVACY_TOC}
    >
      {/* Policy Preamble & Verification Notice */}
      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-950 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <Info className="h-4 w-4 text-amber-700 shrink-0" />
          <span>Operational & Legal Status Notice (Hackathon Evaluation Build)</span>
        </div>
        <p className="leading-relaxed">
          GridMind is currently presented as an architectural software demonstration. Telemetry streams, facility configurations, equipment operational models, and financial savings calculations rendered in this prototype utilize synthetic data models for benchmark evaluation. Live industrial telemetry ingestion, physical remote electrical switching, and production database persistence will only occur following deployment on verified, dedicated infrastructure and execution of appropriate commercial agreements.
        </p>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: INTRODUCTION AND SCOPE                        */}
      {/* ========================================================= */}
      <section id="section-1" className="scroll-mt-24 space-y-3 pt-2">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 1
          </span>
          <h2 className="text-xl font-bold text-slate-900">Introduction and Scope</h2>
        </div>

        <p>
          GridMind (referred to as <strong>&quot;GridMind,&quot; &quot;we,&quot; &quot;our,&quot;</strong> or <strong>&quot;us&quot;</strong>) provides an intelligent energy continuity and microgrid decision-support platform designed to help commercial enterprises (particularly cold-storage facilities, frozen-food processors, healthcare clinics, pharmacies, supermarkets, and decentralized energy service operators) monitor, forecast, and optimize multi-source power systems comprising national utility grids, diesel generators, solar photovoltaic (PV) arrays, and battery energy storage systems (BESS).
        </p>

        <p>
          This Privacy Policy governs how personal data and operational business information are handled when individuals or organizations interact with the GridMind software application, websites, simulation modules, and related application programming interfaces (collectively, the <strong>&quot;Platform&quot;</strong>).
        </p>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
          <p className="font-bold text-slate-900">Prototype vs. Production Distinction:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Demonstration Build:</strong> In the current evaluation build, the platform runs in a deterministic simulated environment. It does not collect or store unencrypted customer passwords, real personal credentials, or live utility telemetry.
            </li>
            <li>
              <strong>Production Deployments:</strong> When GridMind is commissioned for live commercial facilities, data processing will encompass real-time Modbus/IoT telemetry, facility load profiles, operator audit logs, and account credentials under formal data controller and processor relationships.
            </li>
          </ul>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: INFORMATION WE MAY COLLECT                    */}
      {/* ========================================================= */}
      <section id="section-2" className="scroll-mt-24 space-y-4 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 2
          </span>
          <h2 className="text-xl font-bold text-slate-900">Information We May Collect</h2>
        </div>

        <p>
          Depending on whether you are using the evaluation prototype or a commissioned production deployment, GridMind may process the following categories of information:
        </p>

        <div className="space-y-4 text-xs">
          {/* Category A */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">A. Account & Profile Information</span>
              <Badge variant="neutral" size="sm">Commercial Account Data</Badge>
            </div>
            <p className="text-slate-600">
              When creating an account or accessing authorized consoles: operator name, work email address, company affiliation, assigned operational role (e.g., Facility Manager, Lead Electrical Engineer, Technician), and encrypted authentication tokens.
            </p>
            <p className="text-slate-500 italic">
              * Current prototype status: The demo interface accepts simulated operator profiles; no persistent user databases or external marketing lists are maintained.
            </p>
          </div>

          {/* Category B */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">B. Business & Facility Metadata</span>
              <Badge variant="neutral" size="sm">Facility Parameters</Badge>
            </div>
            <p className="text-slate-600">
              Facility identifiers, commercial facility name, municipal location (e.g., Ikeja Industrial Estate, Lagos), electrical service feeder classification (e.g., Nigerian Electricity Regulatory Commission Band A/B/C/D), rated generator capacity, solar PV peak rating, battery chemistry specifications, and equipment criticality rankings.
            </p>
          </div>

          {/* Category C */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">C. Energy & Operational Telemetry</span>
              <Badge variant="info" size="sm">Time-Series Telemetry</Badge>
            </div>
            <p className="text-slate-600">
              Time-series electrical metrics including active power demand (kW), cumulative energy consumption (kWh), phase voltage (V), line frequency (Hz), power factor, solar irradiance (W/m²), battery state of charge (SOC %), battery DC bus voltage, diesel generator running status, fuel consumption burn rates (L/hr), cold-storage ambient temperature readings (°C), and load-shedding actuation timestamps.
            </p>
            <p className="text-slate-500 italic">
              * Current prototype status: In this demonstration, all telemetry curves are generated by a deterministic mathematical microgrid simulator and do not reflect actual physical meter hardware.
            </p>
          </div>

          {/* Category D */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">D. User-Submitted Actions & Audit Logs</span>
              <Badge variant="neutral" size="sm">Operator Audit Trail</Badge>
            </div>
            <p className="text-slate-600">
              Records of operator approvals, recommendation rejections, manual appliance priority overrides, simulator parameter modifications, support communications, and explicit optimization feedback submitted through the dashboard.
            </p>
          </div>

          {/* Category E */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">E. Technical Request Metadata & Diagnostics</span>
              <Badge variant="neutral" size="sm">Diagnostic Telemetry</Badge>
            </div>
            <p className="text-slate-600">
              Standard web server logs: client IP address, browser user-agent, operating system platform, routing latency, HTTP status codes, and front-end diagnostic error traces necessary to maintain application reliability.
            </p>
          </div>

          {/* Category F */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">F. Cookies & Local Storage</span>
              <Badge variant="neutral" size="sm">Essential Session Storage</Badge>
            </div>
            <p className="text-slate-600">
              GridMind uses strictly necessary browser storage (such as session tokens and local application state keys) to remember simulation parameters, scenario selections, and interface preferences. <strong>GridMind does not utilize third-party commercial advertising trackers, behavioral profiling cookies, or data-broker pixels.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: HOW INFORMATION IS USED                       */}
      {/* ========================================================= */}
      <section id="section-3" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 3
          </span>
          <h2 className="text-xl font-bold text-slate-900">How Information Is Used</h2>
        </div>

        <p>
          GridMind processes collected information strictly for legitimate commercial, operational, and engineering purposes directly associated with providing energy continuity intelligence:
        </p>

        <ul className="list-disc pl-5 space-y-2 text-xs text-slate-700">
          <li>
            <strong>Providing Microgrid Visibility:</strong> Computing real-time power dispatch balances, battery backup runtime projections, and estimated operating costs across utility, solar, battery, and generator assets.
          </li>
          <li>
            <strong>Generating Optimization Guidance:</strong> Synthesizing load prioritization heuristics (such as recommending curtailment of deferrable packaging HVAC to safeguard perishable frozen food inventory during grid failure).
          </li>
          <li>
            <strong>Maintaining Operational Auditability:</strong> Recording operator authorizations and decision history to establish transparent operational records for commercial accounting and management oversight.
          </li>
          <li>
            <strong>Application Reliability & Security:</strong> Monitoring diagnostic performance, debugging front-end rendering bottlenecks, detecting malicious traffic patterns, and preventing unauthorized access to facility consoles.
          </li>
          <li>
            <strong>Customer Communication:</strong> Responding to authorized support requests, delivering critical operational notices, and providing software upgrade notifications.
          </li>
          <li>
            <strong>Statutory Compliance:</strong> Satisfying applicable accounting, tax, or legal disclosure requirements under Nigerian law.
          </li>
        </ul>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: LEGAL BASES FOR PROCESSING                    */}
      {/* ========================================================= */}
      <section id="section-4" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 4
          </span>
          <h2 className="text-xl font-bold text-slate-900">Legal Bases for Processing</h2>
        </div>

        <p>
          In accordance with the <strong>Nigeria Data Protection Act 2023 (NDPA)</strong> and internationally accepted privacy standards, our processing of personal data relies on specific lawful bases:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Scale className="h-4 w-4 text-emerald-700" />
              Contractual Necessity
            </span>
            <p className="text-slate-600">
              Processing required to deliver GridMind services pursuant to terms agreed upon with your organization (e.g., authenticating users, managing accounts, and delivering energy analytics).
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              Legitimate Interests
            </span>
            <p className="text-slate-600">
              Optimizing application performance, preventing cyber threats, safeguarding critical refrigeration infrastructure against power outages, and verifying model accuracy without overriding your fundamental privacy rights.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-emerald-700" />
              Consent
            </span>
            <p className="text-slate-600">
              Where affirmative consent is specifically requested and granted, such as for voluntary product feedback surveys or participation in beta research programs. Consent may be withdrawn at any time.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Building className="h-4 w-4 text-emerald-700" />
              Legal & Regulatory Obligations
            </span>
            <p className="text-slate-600">
              Processing compelled by statutory obligations, including tax record retention, lawful court orders, or formal regulatory inquiries from authorized supervisory bodies.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 5: AI PROCESSING AND RECOMMENDATIONS             */}
      {/* ========================================================= */}
      <section id="section-5" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 5
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            AI Processing & Automated Recommendations
          </h2>
        </div>

        <p>
          GridMind incorporates deterministic algorithms, energy balance equations, and artificial intelligence models to assist operators in responding to electrical crises. To ensure ethical and transparent processing:
        </p>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-950">
              <Lightbulb className="h-4 w-4 text-emerald-700" />
              <span>Human-in-the-Loop Operational Architecture</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              GridMind is built as an operational decision-support tool, not an uncontrolled automated actuator. Every consequential recommendation (such as curtailing nonessential HVAC or adjusting generator setpoints) presents the underlying telemetry justification and estimated impact. It requires human operator authorization or explicitly configured automatic emergency policy bounds before execution.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <span className="font-bold text-slate-900">Model Estimates & Real-World Uncertainty:</span>
            <p className="text-slate-600 leading-relaxed">
              Energy forecasts, battery runtime projections, and avoided diesel cost estimates are mathematical approximations dependent upon sensor accuracy, ambient weather conditions, and manufacturer nameplate specifications. They do not constitute guaranteed financial returns or infallibility.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <span className="font-bold text-slate-900">Protection of Personal Data in AI Pipelines:</span>
            <p className="text-slate-600 leading-relaxed">
              In accordance with privacy best practices, personal identifiers (such as operator names or private email credentials) are never supplied to machine learning inference engines or external LLM APIs. Only anonymized, structured numerical telemetry (kW, SOC %, temperature) is processed for dispatch calculations.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 6: HOW INFORMATION IS SHARED                     */}
      {/* ========================================================= */}
      <section id="section-6" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 6
          </span>
          <h2 className="text-xl font-bold text-slate-900">How Information Is Shared</h2>
        </div>

        <p className="text-xs text-slate-700">
          <strong>GridMind does not sell, rent, monetize, or trade customer data or operational telemetry to third-party commercial data brokers.</strong> Information may only be disclosed in the following limited circumstances:
        </p>

        <ul className="list-disc pl-5 space-y-2 text-xs text-slate-700">
          <li>
            <strong>Authorized Organization Members:</strong> Facility data and operator action logs are accessible to authorized administrative users within your commercial enterprise based on assigned role permissions.
          </li>
          <li>
            <strong>Infrastructure Service Providers:</strong> Trusted enterprise service vendors acting as data processors under binding contractual privacy commitments (e.g., cloud hosting providers, time-series telemetry databases, transactional email gateways).
          </li>
          <li>
            <strong>Legal and Regulatory Compliance:</strong> When compelled by valid subpoenas, court orders, or applicable statutory mandates issued by competent courts or supervisory authorities in the Federal Republic of Nigeria.
          </li>
          <li>
            <strong>Business Reorganization:</strong> In the event of a merger, acquisition, or restructuring, customer agreements and associated data will transfer subject to continued adherence to this Privacy Policy.
          </li>
        </ul>
      </section>

      {/* ========================================================= */}
      {/* SECTION 7: GOOGLE AUTHENTICATION & OAUTH                 */}
      {/* ========================================================= */}
      <section id="section-7" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 7
          </span>
          <h2 className="text-xl font-bold text-slate-900">Google Authentication & OAuth</h2>
        </div>

        <p className="text-xs text-slate-700">
          The GridMind interface includes visual integration hooks for Google OAuth 2.0 / OpenID Connect authentication to facilitate streamlined single sign-on (SSO) for commercial facility teams.
        </p>

        <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 space-y-2 text-xs text-sky-950">
          <div className="flex items-center gap-2 font-bold text-sky-950">
            <KeyRound className="h-4 w-4 text-sky-700" />
            <span>Implementation Boundary Notice</span>
          </div>
          <p className="leading-relaxed">
            In this demonstration build, Google Sign-In is intentionally unconfigured unless a valid Google Client ID and corresponding backend credentials are supplied. When Google Sign-In is activated in production deployments:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>
              GridMind requests only minimal standard identity scopes: your verified email address, full name, and provider account identifier.
            </li>
            <li>
              <strong>GridMind never receives, accesses, or stores your Google account password.</strong>
            </li>
            <li>
              Authentication tokens received from Google are used solely to establish an authorized application session.
            </li>
          </ul>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 8: DATA RETENTION & DISPOSAL                     */}
      {/* ========================================================= */}
      <section id="section-8" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 8
          </span>
          <h2 className="text-xl font-bold text-slate-900">Data Retention & Disposal</h2>
        </div>

        <p className="text-xs text-slate-700">
          We retain information only for as long as necessary to satisfy the commercial purposes outlined in this policy, uphold contractual commitments, maintain auditability for energy accounting, and comply with statutory legal mandates.
        </p>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
          <p className="font-bold text-slate-900">Retention Guidelines (Pending Formal Production Schedule):</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Account Records:</strong> Maintained for the duration of an active commercial subscription plus statutory limitation periods following contract termination.
            </li>
            <li>
              <strong>High-Frequency IoT Telemetry:</strong> Raw sub-second power readings may be rolled up into hourly and daily summary records after defined retention horizons (e.g., 90 days) to optimize analytical storage.
            </li>
            <li>
              <strong>Audit Trail & Approvals:</strong> Maintained for operational dispute resolution and warranty verification for equipment operating records.
            </li>
            <li>
              <strong>Deletion Handling:</strong> Upon receipt of a verified erasure request or contract termination, personal identifiers are securely purged or irreversibly anonymized within reasonable technical windows, subject to statutory retention obligations.
            </li>
          </ul>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 9: INFORMATION SECURITY POSTURE                  */}
      {/* ========================================================= */}
      <section id="section-9" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 9
          </span>
          <h2 className="text-xl font-bold text-slate-900">Information Security Posture</h2>
        </div>

        <p className="text-xs text-slate-700">
          GridMind treats industrial energy data and facility operational controls with rigorous engineering caution. While no internet-connected platform can guarantee absolute invulnerability, we implement defense-in-depth architectural principles:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
            <span className="font-bold text-slate-900">Transport Layer Security (TLS)</span>
            <p className="text-slate-600">
              Encrypted communications across all API and web console endpoints using TLS 1.3/HTTPS.
            </p>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
            <span className="font-bold text-slate-900">Role-Based Access Control</span>
            <p className="text-slate-600">
              Granular permission boundaries separating read-only telemetry viewers from authorized switching actuators.
            </p>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
            <span className="font-bold text-slate-900">Cryptographic Secret Protection</span>
            <p className="text-slate-600">
              No hardcoded secret keys or production database credentials exposed to client-side bundles.
            </p>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
            <span className="font-bold text-slate-900">Air-Gapped Safety Fallbacks</span>
            <p className="text-slate-600">
              Software logic does not override physical breaker trips, emergency stops, or manufacturer BMS protections.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 italic">
          * Security Notice: Formal independent penetration tests, SOC 2 Type II reports, and ISO 27001 certifications represent production commissioning targets that must be confirmed upon enterprise deployment.
        </p>
      </section>

      {/* ========================================================= */}
      {/* SECTION 10: INTERNATIONAL DATA TRANSFERS                 */}
      {/* ========================================================= */}
      <section id="section-10" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 10
          </span>
          <h2 className="text-xl font-bold text-slate-900">International Data Transfers</h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          While GridMind is focused primarily on Nigerian commercial operations, enterprise cloud infrastructure, hosting providers, and software dependencies may process and store data in secure data centers located internationally (such as in the European Union, United States, or regional cloud nodes).
        </p>

        <p className="text-xs text-slate-700 leading-relaxed">
          Where personal data originating in Nigeria is transferred internationally, such transfers will comply with Sections 41 to 43 of the Nigeria Data Protection Act 2023, utilizing appropriate contractual safeguards, standard contractual clauses, or transfers to jurisdictions recognized by the Nigeria Data Protection Commission (NDPC) as providing adequate data protection.
        </p>
      </section>

      {/* ========================================================= */}
      {/* SECTION 11: YOUR PRIVACY RIGHTS                          */}
      {/* ========================================================= */}
      <section id="section-11" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 11
          </span>
          <h2 className="text-xl font-bold text-slate-900">Your Privacy Rights</h2>
        </div>

        <p className="text-xs text-slate-700">
          Under applicable data protection laws, including the Nigeria Data Protection Act 2023, data subjects possess enforceable rights regarding their personal data:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <strong>Right to Access:</strong> Request confirmation of whether your data is processed and obtain copies of stored records.
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <strong>Right to Rectification:</strong> Request correction of inaccurate, incomplete, or misleading personal information.
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request deletion of personal records where no overriding legal obligation exists.
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <strong>Right to Restrict Processing:</strong> Request suspension of processing while accuracy or lawful basis is investigated.
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <strong>Right to Data Portability:</strong> Receive your provided data in a structured, commonly used, machine-readable format.
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <strong>Right to Lodge a Complaint:</strong> Lodge formal grievances with the Nigeria Data Protection Commission (NDPC) if you believe your rights have been infringed.
          </div>
        </div>

        <p className="text-xs text-slate-600">
          To exercise any of these rights, authorized representatives may submit a written request using the contact channels specified in Section 15. We respond to verified requests within statutory timeframes.
        </p>
      </section>

      {/* ========================================================= */}
      {/* SECTION 12: NIGERIAN DATA PROTECTION (NDPA 2023)         */}
      {/* ========================================================= */}
      <section id="section-12" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 12
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Nigerian Data Protection (NDPA 2023)
          </h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          The <strong>Nigeria Data Protection Act 2023 (NDPA)</strong> establishes the comprehensive legal framework for data privacy in Nigeria, administered by the <strong>Nigeria Data Protection Commission (NDPC)</strong>. GridMind acknowledges the statutory principles mandated by the NDPA:
        </p>

        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
          <li>
            <strong>Fairness and Transparency:</strong> Processing personal data in a transparent manner that respects data subjects&apos; reasonable expectations.
          </li>
          <li>
            <strong>Purpose Limitation:</strong> Collecting operational data solely for specified, explicit, and legitimate energy continuity and management purposes.
          </li>
          <li>
            <strong>Data Minimization:</strong> Limiting personal data collection to what is strictly necessary for operational functionality.
          </li>
          <li>
            <strong>Integrity and Confidentiality:</strong> Maintaining technical and organizational safeguards against unauthorized access, loss, or destruction.
          </li>
        </ul>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600">
          <strong>Production Compliance Notice:</strong> Prior to full-scale commercial deployment in Nigeria, the operating entity will register with the NDPC where required by data threshold regulations, appoint a qualified Data Protection Officer (DPO), and execute formal Data Processing Agreements (DPAs) with facility enterprise customers.
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 13: CHILDREN'S PRIVACY                           */}
      {/* ========================================================= */}
      <section id="section-13" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 13
          </span>
          <h2 className="text-xl font-bold text-slate-900">Children&apos;s Privacy</h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          GridMind is an enterprise commercial and industrial SaaS platform intended exclusively for adult business owners, facility managers, electrical engineers, and operational personnel (aged 18 and older). We do not knowingly solicit, collect, or process information from children or minors. If we discover that personal data of a minor has been inadvertently collected, we will take immediate steps to delete such information from our records.
        </p>
      </section>

      {/* ========================================================= */}
      {/* SECTION 14: CHANGES TO THIS PRIVACY POLICY               */}
      {/* ========================================================= */}
      <section id="section-14" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 14
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Changes to This Privacy Policy
          </h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          As GridMind develops from an evaluation prototype into a commercial SaaS offering, we may update this Privacy Policy to reflect modifications in our data practices, system architecture, or legal requirements. Material changes will be communicated via prominent notices within the web console, email alerts to registered administrators, or updated publication dates at the top of this document. Continued use of GridMind after the effective date of an amended policy constitutes acknowledgment of the revised practices.
        </p>
      </section>

      {/* ========================================================= */}
      {/* SECTION 15: CONTACT & CONFIGURATION PLACEHOLDERS         */}
      {/* ========================================================= */}
      <section id="section-15" className="scroll-mt-24 space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 15
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Contact Information & Legal Entity Placeholders
          </h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          For legal inquiries, privacy requests, or data protection questions, please consult the official channels below. (Operational details are explicitly marked with configuration placeholders until corporate registration is completed for commercial production):
        </p>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500 block font-semibold uppercase text-[10px]">
                Operating Legal Entity
              </span>
              <strong className="text-slate-900 font-mono">
                [LEGAL_ENTITY_NAME_PENDING_REGISTRATION]
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold uppercase text-[10px]">
                Corporate Registration / RC Number
              </span>
              <strong className="text-slate-900 font-mono">
                [RC_NUMBER_PENDING_CAC_CONFIRMATION]
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold uppercase text-[10px]">
                Data Protection Officer (DPO) Contact
              </span>
              <strong className="text-slate-900 font-mono">
                [OFFICIAL_PRIVACY_EMAIL_PENDING]
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold uppercase text-[10px]">
                Registered Physical Address
              </span>
              <strong className="text-slate-900 font-mono">
                [OFFICIAL_REGISTERED_ADDRESS_LAGOS_NIGERIA]
              </strong>
            </div>
          </div>
        </div>

        <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
          <span>End of Privacy Policy (v1.0-DRAFT)</span>
          <Link
            href="/terms"
            className="text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-1"
          >
            Review Terms of Service →
          </Link>
        </div>
      </section>
    </LegalPageLayout>
  );
}
