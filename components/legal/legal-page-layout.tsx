"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, FileText, ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/marketing/footer";

export interface TocItem {
  id: string;
  title: string;
  number?: string;
}

interface LegalPageLayoutProps {
  title: string;
  documentType: "privacy" | "terms";
  effectiveDate: string;
  lastUpdated: string;
  version: string;
  description: string;
  tocItems: TocItem[];
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  documentType,
  effectiveDate,
  lastUpdated,
  version,
  description,
  tocItems,
  children,
}: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = React.useState<string>(tocItems[0]?.id || "");

  // Intersection observer to highlight current section in Table of Contents
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (let i = tocItems.length - 1; i >= 0; i--) {
        const element = document.getElementById(tocItems[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(tocItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocItems]);

  const companionLink =
    documentType === "privacy"
      ? { href: "/terms", label: "Terms of Service", icon: FileText }
      : { href: "/privacy", label: "Privacy Policy", icon: Shield };

  return (
    <div className="min-h-screen bg-[#fcfdfc] text-slate-900 flex flex-col selection:bg-brand-100 selection:text-brand-950">
      {/* Restrained Forest-Green Top Navigation & Header */}
      <header className="sticky top-0 z-40 bg-brand-950 text-white border-b border-brand-900/80 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-white transition-colors bg-brand-900/60 hover:bg-brand-900 px-3 py-1.5 rounded-lg border border-brand-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>

            <div className="h-4 w-px bg-brand-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white hidden sm:inline">GridMind</span>
              <span className="text-slate-400 text-xs hidden sm:inline">/</span>
              <span className="text-xs font-medium text-emerald-200">Legal Documentation</span>
            </div>
          </div>

          {/* Quick toggle to companion legal page */}
          <Link
            href={companionLink.href}
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors bg-slate-900/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/80 font-medium"
          >
            <companionLink.icon className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">View</span> {companionLink.label}
            <ArrowRight className="h-3 w-3 ml-0.5" />
          </Link>
        </div>
      </header>

      {/* Hero Banner with Document Metadata */}
      <section className="bg-gradient-to-b from-brand-950 to-brand-900 text-white pt-12 pb-14 border-b border-brand-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="healthy" size="sm" className="font-bold">
                {documentType === "privacy" ? "Data Protection & Privacy" : "Commercial Terms"}
              </Badge>
              <Badge variant="warning" size="sm" className="font-mono text-[10px] font-bold">
                PROTOTYPE & EVALUATION DRAFT
              </Badge>
              <span className="text-xs text-emerald-300 font-mono">v{version}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              {title}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-emerald-200/90 font-mono border-t border-brand-800/80">
              <div>
                <span className="text-slate-400">Effective Date: </span>
                <strong className="text-white">{effectiveDate}</strong>
              </div>
              <div>
                <span className="text-slate-400">Last Updated: </span>
                <strong className="text-white">{lastUpdated}</strong>
              </div>
              <div>
                <span className="text-slate-400">Target Jurisdiction: </span>
                <strong className="text-white">Federal Republic of Nigeria</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Responsive Sidebar TOC + Document Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Table of Contents - Desktop Sticky Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-3 space-y-3">
            <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Table of Contents
                </span>
                <span className="text-[10px] font-mono text-slate-400">{tocItems.length} Sections</span>
              </div>

              <nav aria-label="Table of Contents" className="space-y-1">
                {tocItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`group flex items-start gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        isActive
                          ? "bg-brand-50 text-brand-950 font-bold border-l-2 border-brand-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {item.number && (
                        <span
                          className={`font-mono text-[10px] shrink-0 mt-0.5 ${
                            isActive ? "text-brand-800 font-bold" : "text-slate-400"
                          }`}
                        >
                          {item.number}.
                        </span>
                      )}
                      <span className="leading-snug">{item.title}</span>
                    </a>
                  );
                })}
              </nav>

              <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
                <p className="font-semibold text-slate-700">Companion Agreement</p>
                <Link
                  href={companionLink.href}
                  className="flex items-center gap-1.5 text-brand-800 hover:text-brand-950 font-medium transition-colors"
                >
                  <companionLink.icon className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Read our {companionLink.label}</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Document Content */}
          <article className="lg:col-span-8 w-full max-w-4xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs leading-relaxed text-slate-700 text-sm">
            {children}
          </article>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
