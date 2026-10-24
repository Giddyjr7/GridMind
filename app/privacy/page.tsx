import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-slate-800">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="flex items-center gap-2 mb-3">
        <Badge variant="warning" size="sm">
          DEVELOPMENT PLACEHOLDER
        </Badge>
        <span className="text-xs text-slate-400 font-mono">Requires Legal Completion</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-4">Privacy Policy (Hackathon Prototype Notice)</h1>

      <div className="prose prose-slate text-xs space-y-4 text-slate-600 leading-relaxed">
        <p>
          This document is a placeholder notice for the GridMind demonstration build. GridMind is currently running in a hackathon evaluation environment using simulated data.
        </p>
        <p>
          In a production deployment, this policy will formally detail data collection concerning facility telemetry, power sensor metrics, equipment metadata, and operator action logs in compliance with relevant data privacy regulations.
        </p>
        <p>
          No real personal identifying information or live customer telemetry is stored or collected by this demonstration application.
        </p>
      </div>
    </div>
  );
}
