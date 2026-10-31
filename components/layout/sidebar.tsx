"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  Sliders,
  BarChart3,
  X,
  Layers,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GridMindLogo } from "@/components/brand/gridmind-logo";
import { useWorkspace } from "@/context/workspace-context";
import { useRegisteredSite } from "@/hooks/use-registered-site";

export interface NavItem {
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
    title: "Decisions",
    href: "/dashboard/decisions",
    icon: ShieldCheck,
  },
  {
    title: "Devices",
    href: "/dashboard/devices",
    icon: Sliders,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
];

export interface SidebarProps {
  onClose?: () => void;
  className?: string;
}

export function Sidebar({ onClose, className }: SidebarProps) {
  const pathname = usePathname();
  const { workspace } = useWorkspace();
  const { registration } = useRegisteredSite();

  // The registered site wins over browser state: a cleared or different
  // browser would otherwise show the built-in demo business beside the real
  // one's equipment.
  const businessName = registration?.name || workspace?.name || "Krystal Ice Cold Storage Ltd.";
  const businessLocation =
    registration?.location || workspace?.location || "Uyo Industrial Layout, Akwa Ibom";
  const workspaceLetter = businessName.charAt(0).toUpperCase();

  return (
    <aside
      className={cn(
        "w-64 border-r border-white/[0.08] bg-[#0c1410] flex flex-col h-full shrink-0 select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.08]">
        <Link href="/dashboard" className="group flex items-center gap-2">
          <GridMindLogo markClassName="h-8 w-8" />
        </Link>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/[0.06] transition-colors"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Workspace Context Chip */}
      <div className="p-3 border-b border-white/[0.08]">
        <Link
          href="/workspace"
          className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-colors group"
        >
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-semibold text-xs shrink-0 group-hover:border-emerald-500/40 transition-colors">
            {workspaceLetter}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-xs font-medium text-slate-200 truncate">
              {businessName}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {businessLocation}
            </p>
          </div>
        </Link>
      </div>

      {/* Primary Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Console
          </p>
        </div>

        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-colors group",
                isActive
                  ? "bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-emerald-400"
                      : "text-slate-400 group-hover:text-slate-300"
                  )}
                />
                <span className="truncate">{item.title}</span>
              </div>
            </Link>
          );
        })}

        {/* Workspace Hub & Digital Twin links */}
        <div className="pt-4 mt-4 border-t border-white/[0.08] space-y-1">
          <div className="px-3 pb-2">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Connected Hub
            </p>
          </div>
          <Link
            href="/workspace"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] rounded-xl transition-colors"
          >
            <Layers className="h-4 w-4 text-slate-400" />
            <span>Workspace Devices</span>
          </Link>

          <Link
            href="/twin"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] rounded-xl transition-colors"
          >
            <Activity className="h-4 w-4 text-emerald-400" />
            <div className="flex items-center justify-between flex-1">
              <span>Digital Twin</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                MQTT
              </span>
            </div>
          </Link>
        </div>
      </nav>

      {/* Bottom Status */}
      <div className="p-3 border-t border-white/[0.08]">
        <div className="px-2 py-1.5 rounded-lg bg-black/40 border border-white/[0.05] text-[10px] text-slate-400 flex items-center justify-between">
          <span className="truncate">Advisory Engine</span>
          <span className="text-emerald-400 font-mono">v2.4</span>
        </div>
      </div>
    </aside>
  );
}
