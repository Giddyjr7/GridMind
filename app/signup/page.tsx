"use client";

import * as React from "react";
import Link from "next/link";
import { Zap, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-brand-950 flex items-center justify-center text-white shadow-sm ring-1 ring-brand-800">
              <Zap className="h-5 w-5 text-emerald-400 fill-emerald-400/20" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">GridMind</span>
          </Link>
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
          Create Your GridMind Account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Start configuring your commercial microgrid & critical loads
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-2 sm:p-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="healthy" size="sm" className="text-[10px]">
                EARLY ACCESS PREVIEW
              </Badge>
              <span className="text-[11px] text-slate-400 font-mono">Hackathon Edition</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              New account registration and site onboarding will connect to the live backend in Phase 2. To test the intelligence engine immediately, explore the preconfigured industrial cold storage workspace.
            </p>

            <div className="space-y-2 text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Zero hardware integration required for simulation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Deterministic Nigerian utility tariff modeling (Band A)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Pre-loaded blast freezer and solar array telemetry</span>
              </div>
            </div>

            <Link href="/dashboard" className="block w-full">
              <Button className="w-full bg-brand-950 hover:bg-brand-900 text-white justify-center">
                Launch Interactive Demo Workspace
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-100 pt-4 mt-2">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Back to Homepage
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
