"use client";

import * as React from "react";
import {
  Lightbulb,
  CheckCircle2,
  XCircle,
  Clock,
  Coins,
  ShieldAlert,
  Info,
  Layers,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  RecommendationCard,
  DecisionDetailsModal,
  ApprovalConfirmModal,
  RejectModal,
  RecommendationsFilterBar,
} from "@/components/recommendations";
import { useSimulation } from "@/context/simulation-context";
import { EnergyRecommendation } from "@/types/energy";

export default function RecommendationsPage() {
  const {
    recommendations,
    approveRecommendation,
    rejectRecommendation,
    dismissRecommendation,
    feedbackMessage,
    clearFeedback,
    resetToDefaultScenario,
  } = useSimulation();

  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Modals state
  const [inspectingRec, setInspectingRec] =
    React.useState<EnergyRecommendation | null>(null);
  const [approvingRec, setApprovingRec] =
    React.useState<EnergyRecommendation | null>(null);
  const [rejectingRec, setRejectingRec] =
    React.useState<EnergyRecommendation | null>(null);

  // Compute filter counts
  const counts = React.useMemo(() => {
    return {
      all: recommendations.length,
      pending: recommendations.filter((r) => r.status === "pending").length,
      approved: recommendations.filter((r) => r.status === "approved").length,
      rejected: recommendations.filter((r) => r.status === "rejected").length,
    };
  }, [recommendations]);

  // Filter recommendations
  const filteredRecommendations = React.useMemo(() => {
    return recommendations.filter((rec) => {
      // 1. Status filter
      if (statusFilter !== "all" && rec.status !== statusFilter) {
        return false;
      }
      // 2. Priority filter
      if (priorityFilter !== "all" && rec.urgency !== priorityFilter) {
        return false;
      }
      // 3. Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesTitle = rec.title.toLowerCase().includes(q);
        const matchesTarget = (rec.targetApplianceName || "").toLowerCase().includes(q);
        const matchesAction = rec.suggestedAction.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTarget && !matchesAction) {
          return false;
        }
      }
      return true;
    });
  }, [recommendations, statusFilter, priorityFilter, searchQuery]);

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Section Heading */}
        <SectionHeading
          title="Recommendations"
          description="Review suggested actions before anything changes in the simulation."
          badge={
            <Badge variant="neutral" size="sm">
              Operator approval required
            </Badge>
          }
          actions={
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={resetToDefaultScenario}
                className="text-xs h-7 text-slate-600 border-slate-200 hover:bg-slate-50"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset Queue
              </Button>
            </div>
          }
        />

        {/* Global Action Confirmation Toast */}
        {feedbackMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-in fade-in duration-200 shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{feedbackMessage}</span>
            </div>
            <button
              type="button"
              onClick={clearFeedback}
              className="text-[11px] text-emerald-700 hover:underline font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <RecommendationsFilterBar
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          counts={counts}
        />

        {/* Recommendation Cards List */}
        {filteredRecommendations.length === 0 ? (
          <EmptyState
            title="No matching recommendations"
            description={
              statusFilter === "pending"
                ? "All recommendations have been evaluated and authorized by the operations team."
                : "No recommendations match your selected filters. Adjust your search or reset filters."
            }
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  setSearchQuery("");
                }}
              >
                Reset All Filters
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredRecommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                onInspect={(target) => setInspectingRec(target)}
                onRequestApprove={(target) => setApprovingRec(target)}
                onRequestReject={(target) => setRejectingRec(target)}
                onDismiss={(id) => dismissRecommendation(id)}
              />
            ))}
          </div>
        )}

        {/* Inspection Details Dialog */}
        <DecisionDetailsModal
          recommendation={inspectingRec}
          isOpen={Boolean(inspectingRec)}
          onClose={() => setInspectingRec(null)}
          onApprove={(id) => {
            const target = recommendations.find((r) => r.id === id);
            if (target) setApprovingRec(target);
          }}
          onReject={(id) => {
            const target = recommendations.find((r) => r.id === id);
            if (target) setRejectingRec(target);
          }}
        />

        {/* Approval Confirmation Dialog */}
        <ApprovalConfirmModal
          recommendation={approvingRec}
          isOpen={Boolean(approvingRec)}
          onClose={() => setApprovingRec(null)}
          onConfirm={(id, notes) => approveRecommendation(id, notes)}
        />

        {/* Rejection / Decline Dialog */}
        <RejectModal
          recommendation={rejectingRec}
          isOpen={Boolean(rejectingRec)}
          onClose={() => setRejectingRec(null)}
          onConfirm={(id, reason) => rejectRecommendation(id, reason)}
        />
      </div>
    </PageContainer>
  );
}
