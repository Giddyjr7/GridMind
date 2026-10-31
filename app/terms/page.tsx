"use client";

import * as React from "react";
import Link from "next/link";
import {
  Scale,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Cpu,
  FileCheck2,
  Lock,
  Building,
  CheckCircle2,
  Info,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { LegalPageLayout, TocItem } from "@/components/legal/legal-page-layout";
import { Badge } from "@/components/ui/badge";

const TERMS_TOC: TocItem[] = [
  { id: "section-1", number: "1", title: "Acceptance of Terms" },
  { id: "section-2", number: "2", title: "Eligibility & Commercial Authority" },
  { id: "section-3", number: "3", title: "Account Registration & Security" },
  { id: "section-4", number: "4", title: "Description of the Service" },
  { id: "section-5", number: "5", title: "Demonstration & Simulated Data" },
  { id: "section-6", number: "6", title: "Energy Estimates & AI Recommendations" },
  { id: "section-7", number: "7", title: "Electrical Safety & Physical Equipment" },
  { id: "section-8", number: "8", title: "User & Operator Responsibilities" },
  { id: "section-9", number: "9", title: "Acceptable Use Policy" },
  { id: "section-10", number: "10", title: "Intellectual Property Rights" },
  { id: "section-11", number: "11", title: "Third-Party Services & Integrations" },
  { id: "section-12", number: "12", title: "Service Availability & Modifications" },
  { id: "section-13", number: "13", title: "Fees & Payment Terms" },
  { id: "section-14", number: "14", title: "Suspension & Termination" },
  { id: "section-15", number: "15", title: "Disclaimers of Warranties" },
  { id: "section-16", number: "16", title: "Limitation of Liability" },
  { id: "section-17", number: "17", title: "Indemnification" },
  { id: "section-18", number: "18", title: "Privacy & Data Protection" },
  { id: "section-19", number: "19", title: "Governing Law & Dispute Resolution" },
  { id: "section-20", number: "20", title: "Changes to These Terms" },
  { id: "section-21", number: "21", title: "Contact Information & Entity Placeholders" },
];

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      documentType="terms"
      effectiveDate="October 25, 2026"
      lastUpdated="October 25, 2026"
      version="1.0-DRAFT"
      description="These Terms of Service govern access to and evaluation of the GridMind Energy Continuity Intelligence Platform, setting forth binding commercial, operational, and electrical safety standards."
      tocItems={TERMS_TOC}
    >
      {/* Preamble & Prototype Evaluation Notice */}
      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-950 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <Info className="h-4 w-4 text-amber-700 shrink-0" />
          <span>Operational & Evaluation Notice (Hackathon Demonstration Build)</span>
        </div>
        <p className="leading-relaxed">
          GridMind is currently made available for technical demonstration, architectural review, and simulation benchmark purposes. The platform models energy asset behaviors, cold-chain thermal decay, and avoided diesel expenditures using mathematical simulation formulas. Evaluating this demonstration does not create a paid commercial subscription, nor does software interaction in this build connect to live mains electricity or execute physical load switching.
        </p>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: ACCEPTANCE OF TERMS                            */}
      {/* ========================================================= */}
      <section id="section-1" className="scroll-mt-24 space-y-3 pt-2">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 1
          </span>
          <h2 className="text-xl font-bold text-slate-900">Acceptance of Terms</h2>
        </div>

        <p>
          These Terms of Service (<strong>&quot;Terms&quot;</strong>) constitute a binding agreement between the user or authorized commercial entity you represent (<strong>&quot;Customer,&quot; &quot;User,&quot;</strong> or <strong>&quot;you&quot;</strong>) and GridMind (<strong>&quot;GridMind,&quot; &quot;we,&quot; &quot;our,&quot;</strong> or <strong>&quot;us&quot;</strong>).
        </p>

        <p>
          By creating an account, registering a facility, clicking an explicit confirmation button acknowledging these Terms, or accessing authorized operational consoles, you acknowledge that you have read, understood, and agreed to be bound by these Terms and our companion <Link href="/privacy" className="text-emerald-700 hover:underline font-semibold">Privacy Policy</Link>.
        </p>

        <p className="text-xs text-slate-500 italic">
          * Clarification on Informational Browsing: Merely viewing the publicly accessible marketing landing page does not bind a casual visitor to contractual service obligations; binding acceptance occurs upon initiating account creation, facility registration, or authenticated console use.
        </p>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: ELIGIBILITY & COMMERCIAL AUTHORITY             */}
      {/* ========================================================= */}
      <section id="section-2" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 2
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Eligibility & Commercial Authority
          </h2>
        </div>

        <p>
          GridMind is an enterprise B2B platform intended for commercial businesses, industrial facilities, healthcare establishments, food cold rooms, and energy service contractors. To access or use GridMind, you represent and warrant that:
        </p>

        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
          <li>You are at least 18 years of age and possess full legal capacity to enter into binding legal agreements under Nigerian law.</li>
          <li>If you register or use GridMind on behalf of a corporate entity, limited liability partnership, or business venture, you have full legal authority to bind that entity to these Terms.</li>
          <li>You are not barred from accessing software services under applicable commercial sanctions or Nigerian law.</li>
        </ul>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: ACCOUNT REGISTRATION & SECURITY                */}
      {/* ========================================================= */}
      <section id="section-3" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 3
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Account Registration & Security
          </h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Authorized users must provide accurate, current, and complete information during registration. You are solely responsible for safeguarding your credentials and maintaining confidentiality of account session keys.
        </p>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
          <p className="font-bold text-slate-900">Account Security Standards:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You agree to promptly notify GridMind of any suspected unauthorized access, credential breach, or anomalous telemetry transmission.</li>
            <li>You are responsible for all actions taken under your authenticated account prior to such notification.</li>
            <li>GridMind reserves the right to suspend or revoke account access where reasonably required to neutralize security threats or prevent unauthorized switching of industrial assets.</li>
          </ul>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: DESCRIPTION OF THE SERVICE                     */}
      {/* ========================================================= */}
      <section id="section-4" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 4
          </span>
          <h2 className="text-xl font-bold text-slate-900">Description of the Service</h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          GridMind provides specialized energy continuity intelligence, microgrid dispatch visualization, and load shedding decision support designed for multi-source commercial facilities:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-emerald-700" />
              Unified Energy Telemetry
            </span>
            <p className="text-slate-600">
              Aggregating national grid availability, solar generation (kW), battery state of charge (%), and diesel generator status into a single operational interface.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-emerald-700" />
              Decision Support & Optimization
            </span>
            <p className="text-slate-600">
              Predictive load shedding heuristics, battery reserve protection rules, and financial calculations comparing intelligent dispatch against unmanaged baseline transfer switches.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 italic">
          * Architectural Boundary: Certain advanced capabilities (such as automatic Modbus-RTU / MQTT physical relay actuation, automated utility tariff synchronizations, and live weather radar integration) represent planned production features that require hardware commissioning and are not claimed as active in the standalone prototype.
        </p>
      </section>

      {/* ========================================================= */}
      {/* SECTION 5: DEMONSTRATION & SIMULATED DATA                 */}
      {/* ========================================================= */}
      <section id="section-5" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 5
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Demonstration & Simulated Data
          </h2>
        </div>

        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-950 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <span>Essential Evaluation Caveat</span>
          </div>
          <p className="leading-relaxed">
            You expressly acknowledge that the current build of GridMind utilizes synthetic mathematical models (such as the simulated 150 kW cold-storage facility &quot;Krystal Ice Ltd.&quot; in Uyo Industrial Layout). Simulated values, including battery runtime hours, grid Band A tariff rates of ₦206/kWh, diesel consumption figures, and avoided generator expenditures, are illustrative benchmarks.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-800">
            <li>Demonstration outputs do not guarantee verified financial savings or operational performance in real-world facilities.</li>
            <li>Simulated appliance switching (e.g., curtailing &quot;Packaging Floor HVAC&quot;) exists purely in software and does not verify electrical load disconnection.</li>
            <li>You must not rely on demonstration results as financial or engineering guarantees.</li>
          </ul>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 6: ENERGY ESTIMATES & RECOMMENDATIONS             */}
      {/* ========================================================= */}
      <section id="section-6" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 6
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Energy Estimates & AI Recommendations
          </h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          GridMind provides software-generated recommendations and mathematical energy balance models. You understand and agree that:
        </p>

        <ul className="list-disc pl-5 space-y-2 text-xs text-slate-700">
          <li>
            <strong>Mathematical Modeling Limits:</strong> Battery runtime projections depend on battery state of health (SOH), temperature-induced degradation, inverter conversion efficiency, and fluctuating load peaks. Actual discharge curves may deviate from modeled estimates.
          </li>
          <li>
            <strong>External Dependency:</strong> Grid restoration estimates and solar irradiance yield forecasts are subject to weather variability and utility distribution feeder management beyond GridMind&apos;s control.
          </li>
          <li>
            <strong>Human Verification Mandatory:</strong> AI-assisted recommendations are decision-support insights intended to advise human operators. All consequential switching actions must be reviewed and sanctioned by qualified personnel.
          </li>
          <li>
            <strong>No Guarantee of Continuous Power:</strong> GridMind does not guarantee uninterrupted electrical continuity, nor does it guarantee that generator or battery equipment will start or operate without mechanical failure.
          </li>
        </ul>
      </section>

      {/* ========================================================= */}
      {/* SECTION 7: ELECTRICAL SAFETY & EQUIPMENT CONTROL          */}
      {/* ========================================================= */}
      <section id="section-7" className="scroll-mt-24 space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
            Section 7 · Critical Safety Notice
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Electrical Safety & Physical Equipment Control
          </h2>
        </div>

        <div className="p-4 rounded-xl border border-rose-300 bg-rose-50 text-rose-950 text-xs space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-rose-950 text-sm">
            <ShieldAlert className="h-5 w-5 text-rose-700 shrink-0" />
            <span>CRITICAL ELECTRICAL DISCLAIMER & SAFETY MANDATE</span>
          </div>
          <p className="leading-relaxed">
            <strong>GRIDMIND IS A SOFTWARE DECISION-SUPPORT TOOL. IT DOES NOT REPLACE CERTIFIED ELECTRICAL ENGINEERS, LICENSED ELECTRICIANS, STATUTORY ELECTRICAL PROTECTION SYSTEMS, OR PHYSICAL INTERLOCKS.</strong>
          </p>
          <p className="leading-relaxed">
            High-voltage electricity, commercial automatic transfer switches (ATS), diesel generators, and high-capacity lithium battery energy storage systems (BESS) present inherent hazards of severe electrical shock, arc flash, fire, explosion, equipment destruction, and fatal injury.
          </p>
        </div>

        <div className="space-y-2 text-xs text-slate-700">
          <p className="font-bold text-slate-900">Customer Safety Obligations:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Qualified Professional Installation:</strong> All physical meters, current transformers (CTs), Modbus gateways, smart contactors, and automated switchgear must be specified, installed, and commissioned exclusively by certified, qualified electrical personnel in strict compliance with the <strong>Nigerian Electricity Management Services Agency (NEMSA)</strong> regulations and relevant Nigerian Electrical Codes.
            </li>
            <li>
              <strong>Physical Safety Primacy:</strong> Software instructions or UI approvals must never bypass, disable, or supersede physical hardware circuit breakers, thermal overloads, emergency stop switches, or battery management system (BMS) safety thresholds.
            </li>
            <li>
              <strong>Equipment Specification Compliance:</strong> Users must never operate motors, blast freezers, chillers, or electrical loads outside the manufacturer&apos;s rated voltage, frequency, and duty-cycle specifications.
            </li>
            <li>
              <strong>Software Approval Is Not a Safety Certificate:</strong> Approving an operational recommendation inside the GridMind web application does not certify that the physical electrical environment is safe for switching.
            </li>
          </ul>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 8: USER & OPERATOR RESPONSIBILITIES               */}
      {/* ========================================================= */}
      <section id="section-8" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 8
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            User & Operator Responsibilities
          </h2>
        </div>

        <p className="text-xs text-slate-700">
          When configuring or operating facilities within GridMind, you represent and agree that you:
        </p>

        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
          <li>Have full legal authority and permission to monitor and manage the physical equipment and electrical meters configured under your account.</li>
          <li>Will provide accurate equipment ratings (e.g., generator prime kW, battery capacity, minimum reserve floor percentages).</li>
          <li>Will independently monitor perishable cold-chain temperatures and critical loads using calibrated independent hardware thermometers and alarms.</li>
          <li>Will maintain comprehensive equipment insurance, preventative generator maintenance schedules, and valid utility service contracts.</li>
        </ul>
      </section>

      {/* ========================================================= */}
      {/* SECTION 9: ACCEPTABLE USE POLICY                          */}
      {/* ========================================================= */}
      <section id="section-9" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 9
          </span>
          <h2 className="text-xl font-bold text-slate-900">Acceptable Use Policy</h2>
        </div>

        <p className="text-xs text-slate-700">
          You agree not to misuse or facilitate unauthorized exploitation of the GridMind platform. Specifically, you shall not:
        </p>

        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
          <li>Probe, scan, or test the vulnerability of our system, or breach authentication or security boundaries.</li>
          <li>Reverse engineer, decompile, or disassemble proprietary simulation algorithms, microgrid dispatch models, or UI code.</li>
          <li>Transmit malicious code, viruses, automated spiders, or denial-of-service traffic into the API infrastructure.</li>
          <li>Inject fraudulent, spoofed, or fabricated sensor telemetry designed to mislead energy accounting or deceive other operators.</li>
          <li>Use the platform in any manner that violates applicable federal, state, or municipal laws in the Federal Republic of Nigeria.</li>
        </ul>
      </section>

      {/* ========================================================= */}
      {/* SECTION 10: INTELLECTUAL PROPERTY RIGHTS                  */}
      {/* ========================================================= */}
      <section id="section-10" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 10
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Intellectual Property Rights
          </h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          <strong>GridMind Ownership:</strong> GridMind and its licensors retain all right, title, and interest in and to the Platform, including software code, UI designs, brand marks, simulation engines, proprietary mathematical models, documentation, and all related intellectual property rights.
        </p>

        <p className="text-xs text-slate-700 leading-relaxed">
          <strong>Customer Data Ownership:</strong> You retain all ownership rights in your proprietary business information and raw telemetry generated by your physical facility assets. You grant GridMind a limited, non-exclusive license to process such data strictly to the extent necessary to deliver the energy continuity services, analytics, and optimization recommendations.
        </p>
      </section>

      {/* ========================================================= */}
      {/* SECTION 11: THIRD-PARTY SERVICES & INTEGRATIONS           */}
      {/* ========================================================= */}
      <section id="section-11" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 11
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Third-Party Services & Integrations
          </h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          GridMind may reference or interface with third-party systems, including electricity distribution companies (DisCos such as Port Harcourt Electricity Distribution, Ikeja Electric, etc.), generator controller manufacturers (e.g., Deep Sea Electronics, ComAp), solar inverter OEMs (e.g., SMA, Victron, Deye), and cloud infrastructure providers.
        </p>

        <p className="text-xs text-slate-700 leading-relaxed">
          GridMind is an independent platform and is not sponsored, endorsed by, or legally affiliated with any specific equipment manufacturer, utility company, or authentication provider unless expressly stated under formal partnership agreements. Third-party products remain subject to their respective manufacturer terms and warranties.
        </p>
      </section>

      {/* ========================================================= */}
      {/* SECTION 12: SERVICE AVAILABILITY & MODIFICATIONS          */}
      {/* ========================================================= */}
      <section id="section-12" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 12
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Service Availability & Modifications
          </h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          While we strive for high uptime and platform reliability, GridMind is provided on an <strong>&quot;as is&quot;</strong> and <strong>&quot;as available&quot;</strong> basis. Access may be temporarily interrupted for scheduled maintenance, emergency security patches, system updates, or factors beyond our reasonable control (such as telecommunication blackouts, upstream cloud outages, or regional internet transit disruptions).
        </p>

        <p className="text-xs text-slate-700 leading-relaxed">
          We reserve the right to modify, enhance, or discontinue features of the prototype platform as development progresses, with appropriate commercial notice provided for live production enterprise contracts.
        </p>
      </section>

      {/* ========================================================= */}
      {/* SECTION 13: FEES & PAYMENT TERMS                          */}
      {/* ========================================================= */}
      <section id="section-13" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 13
          </span>
          <h2 className="text-xl font-bold text-slate-900">Fees & Payment Terms</h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          <strong>Demonstration Status:</strong> Access to this hackathon evaluation build, the interactive crisis simulator, and public demonstration consoles is provided free of charge. No payment credentials or recurring subscription fees are collected by this demonstration.
        </p>

        <p className="text-xs text-slate-700 leading-relaxed">
          <strong>Future Production Services:</strong> Any subsequent commercial deployments, enterprise IoT gateway provisioning, or production monitoring subscriptions will be governed by separately executed commercial order forms, quotations, and service level agreements (SLAs) detailing applicable subscription fees, payment terms, and billing cycles in Nigerian Naira (NGN) or agreed currency.
        </p>
      </section>

      {/* ========================================================= */}
      {/* SECTION 14: SUSPENSION & TERMINATION                      */}
      {/* ========================================================= */}
      <section id="section-14" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 14
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Suspension & Termination
          </h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          GridMind may suspend or terminate your access to the platform if:
        </p>

        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
          <li>You materially breach these Terms or the Acceptable Use Policy.</li>
          <li>We detect unauthorized attempts to interfere with physical electrical switching or compromise system integrity.</li>
          <li>Compelled by lawful orders from competent courts or statutory regulatory agencies.</li>
          <li>You discontinue participation in the evaluation program.</li>
        </ul>

        <p className="text-xs text-slate-700 leading-relaxed">
          Upon termination, rights to access the online platform cease immediately. Provisions intended by their nature to survive (including Intellectual Property, Disclaimers, Limitation of Liability, and Governing Law) shall remain in full force.
        </p>
      </section>

      {/* ========================================================= */}
      {/* SECTION 15: DISCLAIMERS OF WARRANTIES                     */}
      {/* ========================================================= */}
      <section id="section-15" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 15
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Disclaimers of Warranties
          </h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed uppercase font-semibold">
          TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW:
        </p>

        <ul className="list-disc pl-5 space-y-2 text-xs text-slate-700">
          <li>
            THE PLATFORM, SIMULATION MODULES, ENERGY CALCULATIONS, AND RECOMMENDATIONS ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE,&quot; WITHOUT WARRANTY OF ANY KIND, EXPRESS, IMPLIED, OR STATUTORY.
          </li>
          <li>
            GRIDMIND EXPRESSLY DISCLAIMS ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY, AND NON-INFRINGEMENT.
          </li>
          <li>
            GRIDMIND DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR VIRUS-FREE, NOR DOES IT WARRANT THAT RECOMMENDATIONS WILL PREVENT POWER INTERRUPTIONS, FOOD OR PHARMACEUTICAL SPOILAGE, REFRIGERATION WARMING, OR PHYSICAL GENERATOR BREAKDOWNS.
          </li>
        </ul>
      </section>

      {/* ========================================================= */}
      {/* SECTION 16: LIMITATION OF LIABILITY                       */}
      {/* ========================================================= */}
      <section id="section-16" className="scroll-mt-24 space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
            Section 16 · Legal Liability Limit
          </span>
          <h2 className="text-xl font-bold text-slate-900">Limitation of Liability</h2>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs text-slate-800">
          <p className="font-bold text-slate-900 uppercase">
            Statutory Legal Qualifications under Nigerian Law:
          </p>
          <p className="leading-relaxed">
            TO THE MAXIMUM EXTENT PERMITTED BY THE LAWS OF THE FEDERAL REPUBLIC OF NIGERIA, IN NO EVENT SHALL GRIDMIND, ITS DIRECTORS, EMPLOYEES, AGENTS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES (INCLUDING DAMAGES FOR LOSS OF PROFITS, SPOILAGE OF COLD-ROOM INVENTORY, DRUG OR VACCINE DEGRADATION, EQUIPMENT REPAIR COSTS, BUSINESS INTERRUPTION, LOSS OF DATA, OR COST OF SUBSTITUTE POWER GENERATION), ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THE PLATFORM OR RELIANCE UPON ANY SIMULATED OR AI-GENERATED RECOMMENDATION.
          </p>
          <p className="leading-relaxed">
            FOR THE FREE DEMONSTRATION PROTOTYPE, GRIDMIND&apos;S TOTAL AGGREGATE LIABILITY UNDER THESE TERMS SHALL BE STRICTLY LIMITED TO DIRECT DAMAGES NOT EXCEEDING THE SUM OF <strong>TEN THOUSAND NIGERIAN NAIRA (₦10,000 NGN)</strong> OR THE MINIMUM AMOUNT ENFORCEABLE UNDER APPLICABLE STATUTES.
          </p>
          <p className="text-slate-500 italic">
            * Nothing in these Terms shall limit or exclude liability for death or personal injury caused by proven gross negligence, intentional fraud, or any liability that cannot be lawfully excluded under the <strong>Federal Competition and Consumer Protection Act 2018 (FCCPA)</strong> or other mandatory Nigerian statutes.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 17: INDEMNIFICATION                               */}
      {/* ========================================================= */}
      <section id="section-17" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 17
          </span>
          <h2 className="text-xl font-bold text-slate-900">Indemnification</h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          To the extent permitted by applicable law, you agree to defend, indemnify, and hold harmless GridMind, its founders, and technical contributors from and against any third-party claims, liabilities, damages, losses, and reasonable legal expenses arising directly out of:
        </p>

        <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
          <li>Your material violation of these Terms or the Acceptable Use Policy.</li>
          <li>Your negligent or unlawful physical electrical modification of commercial facility equipment.</li>
          <li>Operating commercial switchgear in defiance of manufacturer specifications or NEMSA electrical codes.</li>
          <li>Your infringement or violation of any third-party right, including intellectual property or privacy rights.</li>
        </ul>
      </section>

      {/* ========================================================= */}
      {/* SECTION 18: PRIVACY & DATA PROTECTION                     */}
      {/* ========================================================= */}
      <section id="section-18" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 18
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Privacy & Data Protection
          </h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Our collection, processing, and handling of information are governed by the GridMind <Link href="/privacy" className="text-emerald-700 hover:underline font-semibold">Privacy Policy</Link>, which is incorporated into and forms an integral part of these Terms. By using GridMind, you consent to data handling in accordance with our Privacy Policy and the <strong>Nigeria Data Protection Act 2023</strong>.
        </p>
      </section>

      {/* ========================================================= */}
      {/* SECTION 19: GOVERNING LAW & DISPUTE RESOLUTION            */}
      {/* ========================================================= */}
      <section id="section-19" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 19
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Governing Law & Dispute Resolution
          </h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          <strong>Governing Law:</strong> These Terms and any dispute or claim arising out of or in connection with them or their subject matter shall be governed by, and construed in accordance with, the laws of the <strong>Federal Republic of Nigeria</strong>, without giving effect to any principles of conflict of laws.
        </p>

        <p className="text-xs text-slate-700 leading-relaxed">
          <strong>Dispute Resolution:</strong> In the event of any controversy, claim, or dispute, the parties agree to first seek an amicable commercial resolution through good-faith executive negotiations within thirty (30) days of formal written notice. If amicable resolution is not achieved, the courts of competent jurisdiction located in the Federal Republic of Nigeria shall possess jurisdiction, subject to mandatory statutory consumer protections.
        </p>
      </section>

      {/* ========================================================= */}
      {/* SECTION 20: CHANGES TO THESE TERMS                        */}
      {/* ========================================================= */}
      <section id="section-20" className="scroll-mt-24 space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 20
          </span>
          <h2 className="text-xl font-bold text-slate-900">Changes to These Terms</h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          We may update or revise these Terms from time to time as GridMind evolves. Material modifications will be announced via prominent notice on the web platform, email notifications to registered administrators, or updated publication dates at the top of these Terms. Where required by applicable law, affirmative consent to amended commercial terms will be requested upon subsequent sign-in.
        </p>
      </section>

      {/* ========================================================= */}
      {/* SECTION 21: CONTACT & ENTITY PLACEHOLDERS                 */}
      {/* ========================================================= */}
      <section id="section-21" className="scroll-mt-24 space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Section 21
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Contact Information & Entity Placeholders
          </h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          For legal inquiries, contractual notices, or terms clarification, please contact our legal team through the channels below (explicitly marked with configuration placeholders pending commercial corporate incorporation):
        </p>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500 block font-semibold uppercase text-[10px]">
                Legal Operating Entity
              </span>
              <strong className="text-slate-900 font-mono">
                [LEGAL_ENTITY_NAME_PENDING_REGISTRATION]
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold uppercase text-[10px]">
                CAC Registration / RC Number
              </span>
              <strong className="text-slate-900 font-mono">
                [RC_NUMBER_PENDING_CAC_CONFIRMATION]
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold uppercase text-[10px]">
                Official Legal Department Contact
              </span>
              <strong className="text-slate-900 font-mono">
                [OFFICIAL_LEGAL_EMAIL_PENDING]
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold uppercase text-[10px]">
                Official Registered Office Address
              </span>
              <strong className="text-slate-900 font-mono">
                [OFFICIAL_REGISTERED_ADDRESS_LAGOS_NIGERIA]
              </strong>
            </div>
          </div>
        </div>

        <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
          <span>End of Terms of Service (v1.0-DRAFT)</span>
          <Link
            href="/privacy"
            className="text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-1"
          >
            Review Privacy Policy →
          </Link>
        </div>
      </section>
    </LegalPageLayout>
  );
}
