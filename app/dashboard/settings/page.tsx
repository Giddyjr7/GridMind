import * as React from "react";
import { Metadata } from "next";
import { Settings, Building2, Sliders, ShieldCheck, Database, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { envConfig } from "@/config/env";
import { MOCK_SITE_PROFILE } from "@/mocks/demo-business";

export const metadata: Metadata = {
  title: "Settings — GridMind Console",
  description: "Facility configuration, utility tariffs, and integration settings.",
};

export default function SettingsPage() {
  return (
    <PageContainer>
      <SectionHeading
        title="Facility Configuration & Preferences"
        description="Review facility site metadata, contractual utility feed parameters, and runtime mode bindings."
        badge={
          <Badge variant="healthy" size="sm" className="font-mono text-[10px]">
            ACTIVE SITE
          </Badge>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site Profile Specifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-800" />
              <CardTitle>Site Identity & Location</CardTitle>
            </div>
            <CardDescription>Industrial facility registration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Facility Name:</span>
                <span className="font-semibold text-slate-800">{MOCK_SITE_PROFILE.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Industry:</span>
                <span className="font-semibold text-slate-800 uppercase font-mono text-[10px]">
                  {MOCK_SITE_PROFILE.industry}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-800">
                  {MOCK_SITE_PROFILE.location.city}, {MOCK_SITE_PROFILE.location.state}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contracted Demand:</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {MOCK_SITE_PROFILE.contractedDemandKw} kW
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Runtime Environment & Backend Mode */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-brand-800" />
              <CardTitle>Data Layer Configuration</CardTitle>
            </div>
            <CardDescription>Decoupled mock vs FastAPI service bindings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Data Mode:</span>
                <Badge variant={envConfig.isMock ? "warning" : "healthy"} size="sm" className="font-mono text-[10px]">
                  {envConfig.dataMode.toUpperCase()}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">API Endpoint:</span>
                <span className="font-mono text-slate-700 text-[11px] truncate max-w-[200px]">
                  {envConfig.apiBaseUrl}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Telemetry Cadence:</span>
                <span className="font-mono text-slate-700 text-[11px]">
                  Every {envConfig.refreshIntervalMs / 1000}s
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950">
              To switch between mock telemetry and the FastAPI backend, set <code className="font-mono bg-white px-1 py-0.5 rounded border border-emerald-300">NEXT_PUBLIC_DATA_MODE=api</code> in your <code className="font-mono">.env.local</code>.
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
