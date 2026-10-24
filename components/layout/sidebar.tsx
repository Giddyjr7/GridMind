"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  LayoutDashboard,
  Cpu,
  Sparkles,
  Sliders,
  BarChart3,
  History,
  Settings,
  Building2,
  ShieldCheck,
  ChevronDown,
  X,
  Check,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownItem, DropdownHeader, DropdownDivider } from "@/components/ui/dropdown-menu";
import { envConfig } from "@/config/env";
import { MOCK_SITE_PROFILE } from "@/mocks/demo-business";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

export const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Energy Simulator",
    href: "/dashboard/simulator",
    icon: Cpu,
  },
  {
    title: "Recommendations",
    href: "/dashboard/recommendations",
    icon: Sparkles,
  },
  {
    title: "Equipment",
    href: "/dashboard/equipment",
    icon: Sliders,
  },
  {
    title: "Energy Sources",
    href: "/dashboard/sources",
    icon: Zap,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Decision History",
    href: "/dashboard/history",
    icon: History,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export interface SidebarProps {
  onClose?: () => void;
  className?: string;
}

export function Sidebar({ onClose, className }: SidebarProps) {
  const pathname = usePathname();
  const [selectedSiteId, setSelectedSiteId] = React.useState(MOCK_SITE_PROFILE.id);

  const demoFacilities = [
    {
      id: "site_krystal_ikeja_01",
      name: "Krystal Ice Cold Storage Ltd.",
      location: "Ikeja Industrial, Lagos",
      type: "Cold Storage & Blast Depot (150 kW)",
    },
    {
      id: "site_kano_hub_02",
      name: "Savannah Cold Chain Logistics",
      location: "Challawa Industrial, Kano",
      type: "Produce Cold Hub (200 kW)",
    },
  ];

  const currentFacility =
    demoFacilities.find((f) => f.id === selectedSiteId) || demoFacilities[0];

  return (
    <aside
      className={cn(
        "w-64 border-r border-slate-200 bg-white flex flex-col h-full shrink-0 select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-lg bg-brand-950 flex items-center justify-center text-white shadow-sm ring-1 ring-brand-800">
            <Zap className="h-5 w-5 text-emerald-400 fill-emerald-400/20" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-slate-900 group-hover:text-brand-950 transition-colors">
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
        </Link>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Business / Site Selector Dropdown */}
      <div className="p-3 border-b border-slate-100">
        <DropdownMenu
          width="w-60"
          align="left"
          trigger={
            <div className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/80 hover:bg-slate-100/80 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 className="h-4 w-4 text-brand-800 shrink-0" />
                  <div className="min-w-0 text-left">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {currentFacility.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {currentFacility.location}
                    </p>
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-1" />
              </div>
            </div>
          }
        >
          <DropdownHeader>Select Managed Facility</DropdownHeader>
          {demoFacilities.map((facility) => (
            <DropdownItem
              key={facility.id}
              onClick={() => setSelectedSiteId(facility.id)}
              className={selectedSiteId === facility.id ? "bg-brand-50/70 text-brand-950 font-semibold" : ""}
            >
              <div className="flex items-center justify-between w-full">
                <div className="truncate">
                  <p className="truncate">{facility.name}</p>
                  <p className="text-[10px] text-slate-400 font-normal">{facility.location}</p>
                </div>
                {selectedSiteId === facility.id && (
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 ml-2" />
                )}
              </div>
            </DropdownItem>
          ))}
          <DropdownDivider />
          <div className="px-3 py-2 text-[10px] text-slate-400">
            Contracted Limit: 150 kW · 11kV Feeder
          </div>
        </DropdownMenu>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Operational Modules
          </p>
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-colors group",
                isActive
                  ? "bg-brand-50 text-brand-950 font-bold border border-brand-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-brand-900" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <Badge variant="healthy" size="sm" className="text-[9px] py-0 px-1 font-mono">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}

        {/* Back to Public Marketing Website link */}
        <div className="pt-4 mt-3 border-t border-slate-100">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Public Landing Page</span>
          </Link>
        </div>
      </nav>

      {/* Bottom Status / Mode Panel */}
      <div className="p-3 border-t border-slate-100">
        <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/70 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Runtime Environment
            </span>
            <Badge
              variant="warning"
              size="sm"
              className="text-[9px] py-0 px-1.5 uppercase font-mono font-bold"
            >
              SIMULATED
            </Badge>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Operating on synthetic benchmark models for Nigerian commercial microgrid validation.
          </p>
        </div>
      </div>
    </aside>
  );
}
