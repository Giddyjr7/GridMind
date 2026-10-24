import * as React from "react";
import { Metadata } from "next";
import { Sparkles, CheckCircle2, XCircle, Clock, Coins, ShieldAlert } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { recommendationService } from "@/services";
import { formatCurrency } from "@/lib/formatters";

export const metadata: Metadata = {
  title: "AI Recommendations — GridMind Console",
  description: "AI-assisted dispatch recommendations and human approval queue.",
};

export default async function RecommendationsPage() {
  const recommendations = await recommendationService.getRecommendations();

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

            <CardContent className="space-y-4">
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {rec.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Recommended Action</span>
                  <span className="font-semibold text-slate-800">{rec.suggestedAction}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Algorithmic Rationale</span>
                  <span className="font-medium text-slate-700">{rec.reasoning}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Projected Financial Savings</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">
                    {formatCurrency(rec.estimatedSavingsNgn)}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center text-xs text-slate-400 pt-3">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Expires in {new Date(rec.expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>

              {rec.status === "pending" ? (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-red-700 hover:bg-red-50 border-red-200">
                    Reject
                  </Button>
                  <Button size="sm" className="bg-brand-950 hover:bg-brand-900 text-white">
                    Approve Plan
                  </Button>
                </div>
              ) : (
                <span className="text-emerald-700 font-medium font-mono text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Policy Enacted by Operations Lead
                </span>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
