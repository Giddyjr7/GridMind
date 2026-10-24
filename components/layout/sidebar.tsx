"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  LayoutDashboard,
  Cpu,
  Sparkles,
  BarChart3,
  Sliders,
  Building2,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { envConfig } from "@/config/env";
import { MOCK_SITE_PROFILE } from "@/mocks/demo-business";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Live Operations",
    href: "/operations",
    icon: Zap,
    badge: "Phase 1",
    disabled: true,
  },
  {
    title: "AI Recommendations",
    href: "/recommendations",
    icon: Sparkles,
    badge: "Phase 1",
    disabled: true,
  },
  {
    title: "Continuity Simulator",
    href: "/simulator",
    icon: Cpu,
    badge: "Phase 1",
    disabled: true,
  },
  {
    title: "Cost & Analytics",
    href: "/analytics",
    icon: BarChart3,
    badge: "Phase 1",
    disabled: true,
  },
  {
    title: "Site Assets & Loads",
    href: "/assets",
    icon: Sliders,
    badge: "Phase 1",
    disabled: true,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-100 gap-3">
        <div className="h-9 w-9 rounded-lg bg-brand-950 flex items-center justify-center text-white shadow-sm ring-1 ring-brand-800">
          <Zap className="h-5 w-5 text-emerald-400 fill-emerald-400/20" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-tight text-slate-900">
              GridMind
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              AI
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Energy Continuity Platform
          </p>
        </div>
      </div>

      {/* Facility / Site Selector */}
      <div className="p-3 border-b border-slate-100">
        <div className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/80 hover:bg-slate-100/80 transition-colors cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-brand-800 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {MOCK_SITE_PROFILE.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {MOCK_SITE_PROFILE.location.city}, {MOCK_SITE_PROFILE.location.state}
                </p>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Navigation
          </p>
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.disabled) {
            return (
              <div
                key={item.href}
                className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 rounded-lg cursor-not-allowed select-none opacity-80"
                title="Available in Phase 1"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-slate-400" />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <Badge variant="neutral" size="sm" className="text-[10px] py-0 px-1.5 font-normal">
                    {item.badge}
                  </Badge>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-950 font-semibold border border-brand-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-brand-800" : "text-slate-500"
                  )}
                />
                <span>{item.title}</span>
              </div>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span>← Back to Public Website</span>
          </Link>
        </div>
      </nav>

      {/* Bottom Status / Mode Panel */}
      <div className="p-3 border-t border-slate-100">
        <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/70">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Runtime Mode
            </span>
            <Badge
              variant={envConfig.isMock ? "warning" : "healthy"}
              size="sm"
              className="text-[10px] py-0 px-1.5 uppercase font-bold"
            >
              {envConfig.dataMode}
            </Badge>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            {envConfig.isMock
              ? "Running in isolated mock mode with synthetic Nigerian industrial profiles."
              : `Connected to API: ${envConfig.apiBaseUrl}`}
          </p>
        </div>
      </div>
    </aside>
  );
}
