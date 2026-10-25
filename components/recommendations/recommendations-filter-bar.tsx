"use client";

import * as React from "react";
import { Search, Filter } from "lucide-react";
import { EnergyRecommendation } from "@/types/energy";

interface RecommendationsFilterBarProps {
  statusFilter: "all" | "pending" | "approved" | "rejected";
  onStatusFilterChange: (status: "all" | "pending" | "approved" | "rejected") => void;
  priorityFilter: string;
  onPriorityFilterChange: (priority: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  counts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export function RecommendationsFilterBar({
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  searchQuery,
  onSearchQueryChange,
  counts,
}: RecommendationsFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => onStatusFilterChange("all")}
          className={`px-3 py-1.5 rounded-md font-bold transition-colors shrink-0 ${
            statusFilter === "all"
              ? "bg-white text-slate-900 shadow-xs border border-slate-300"
              : "text-slate-700 hover:text-slate-950 hover:bg-white/60"
          }`}
        >
          All ({counts.all})
        </button>
        <button
          type="button"
          onClick={() => onStatusFilterChange("pending")}
          className={`px-3 py-1.5 rounded-md font-bold transition-colors shrink-0 ${
            statusFilter === "pending"
              ? "bg-emerald-100 text-emerald-950 shadow-xs border border-emerald-300"
              : "text-slate-700 hover:text-slate-950 hover:bg-white/60"
          }`}
        >
          Pending Authorization ({counts.pending})
        </button>
        <button
          type="button"
          onClick={() => onStatusFilterChange("approved")}
          className={`px-3 py-1.5 rounded-md font-bold transition-colors shrink-0 ${
            statusFilter === "approved"
              ? "bg-white text-slate-900 shadow-xs border border-slate-300"
              : "text-slate-700 hover:text-slate-950 hover:bg-white/60"
          }`}
        >
          Approved & Active ({counts.approved})
        </button>
        <button
          type="button"
          onClick={() => onStatusFilterChange("rejected")}
          className={`px-3 py-1.5 rounded-md font-bold transition-colors shrink-0 ${
            statusFilter === "rejected"
              ? "bg-white text-slate-900 shadow-xs border border-slate-300"
              : "text-slate-700 hover:text-slate-950 hover:bg-white/60"
          }`}
        >
          Declined ({counts.rejected})
        </button>
      </div>

      {/* Search & Priority Controls */}
      <div className="flex items-center gap-2">
        {/* Priority Filter */}
        <div className="relative">
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            className="text-xs h-9 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Filter by priority tier"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical Priority</option>
            <option value="warning">High Leverage</option>
            <option value="advisory">Advisory</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search actions or equipment..."
            className="w-full text-xs h-9 pl-8 pr-3 rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
