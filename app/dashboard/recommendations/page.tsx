"use client";

import * as React from "react";
import { Sparkles, CheckCircle2, XCircle, Clock, Coins, ShieldAlert, Check } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSimulation } from "@/context/simulation-context";
import { formatCurrency } from "@/lib/formatters";

export default function RecommendationsPage() {
  const { recommendations, applyAiRecommendation } = useSimulation();

  return (
    <PageContainer>
      <SectionHeading
        title="AI Energy Recommendations"
        description="Algorithmic dispatch recommendations generated from solar generation forecasts, grid reliability modeling, and cold chain priority rules."
        badge={
          <Badge variant="healthy" size="sm" className="font-mono text-[10px]">
            {recommendations.length} ACTIVE
          </Badge>
        }
      />

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="border-slate-200">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle>{rec.title}</CardTitle>
                    <CardDescription>Target: {rec.targetApplianceName}</CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={rec.status === "approved" ? "healthy" : "warning"}
                    size="sm"
                    className="capitalize font-mono text-[10px]"
                  >
                    {rec.status}
                  </Badge>
                  <Badge variant="outline" size="sm" className="text-[10px]">
                    {rec.confidencePct}% Confidence
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 text-xs text-slate-600">
              <p className="leading-relaxed">{rec.description}</p>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Operational Reasoning: </span>
                  <span>{rec.reasoning}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono pt-1">
                <div className="flex items-center gap-1.5">
                  <Coins className="h-4 w-4 text-amber-600" />
                  <span>
                    Est. Savings:{" "}
                    <strong className="text-emerald-700">
                      +{formatCurrency(rec.estimatedSavingsNgn, "NGN")}
                    </strong>
                  </span>
                </div>
                <div>
                  <span>
                    CO₂ Reduction:{" "}
                    <strong className="text-slate-800">{rec.co2ReductionKg} kg</strong>
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50/50 border-t border-slate-100 flex items-center justify-between py-3">
              <span className="text-[11px] text-slate-400">
                Action: {rec.suggestedAction}
              </span>

              {rec.status === "pending" ? (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => applyAiRecommendation(rec.id)}
                    className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Approve & Dispatch
                  </Button>
                </div>
              ) : (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Policy Active in Simulator
                </span>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
