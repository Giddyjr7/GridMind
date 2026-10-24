import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
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

      <h1 className="text-2xl font-bold text-slate-900 mb-4">Terms of Service (Hackathon Prototype Notice)</h1>

      <div className="prose prose-slate text-xs space-y-4 text-slate-600 leading-relaxed">
        <p>
          This document is a placeholder notice for the GridMind demonstration build. GridMind provides energy continuity intelligence and simulated asset management.
        </p>
        <p>
          In a production deployment, these terms will define the scope of software licenses, operational recommendations, disclaimer of warranties regarding utility grid uptime, and safety responsibilities regarding electrical load switching.
        </p>
        <p>
          All simulated recommendations and financial calculations presented within the prototype are demonstrative and intended for evaluation purposes only.
        </p>
      </div>
    </div>
  );
}
