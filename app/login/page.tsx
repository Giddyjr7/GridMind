"use client";

import * as React from "react";
import Link from "next/link";
import { Zap, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
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
          Sign In to Your Facility Console
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Access your microgrid telemetry and load dispatch rules
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-2 sm:p-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="warning" size="sm" className="text-[10px]">
                PROTOTYPE ACCESS
              </Badge>
              <span className="text-[11px] text-slate-400 font-mono">Phase 1 Demo</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Full authentication will integrate with FastAPI and Supabase in upcoming development phases. For this demonstration, you can bypass sign-in and jump straight into the operational console.
            </p>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
              <span className="font-semibold text-slate-800 block">Active Demo Benchmark:</span>
              <p className="text-slate-600">Krystal Ice Cold Storage Ltd. (Ikeja, Lagos)</p>
              <p className="text-slate-500 text-[11px]">75 kWp Solar · 120 kWh Battery · 160 kVA Gen</p>
            </div>

            <Link href="/dashboard" className="block w-full">
              <Button className="w-full bg-brand-950 hover:bg-brand-900 text-white justify-center">
                Enter Operational Console
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
