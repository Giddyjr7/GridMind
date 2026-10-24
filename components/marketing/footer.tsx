"use client";

import * as React from "react";
import Link from "next/link";
import { Zap, ShieldCheck } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Description */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Zap className="h-4 w-4 fill-emerald-400/20" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">GridMind</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-assisted energy management and continuity intelligence for businesses balancing national grid, generators, solar, and battery storage.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Hackathon Simulation Build v0.1.0
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Product Capabilities
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#product" className="hover:text-white transition-colors">
                  Unified Energy Visibility
                </a>
              </li>
              <li>
                <a href="#simulator-preview" className="hover:text-white transition-colors">
                  Energy Crisis Simulator
                </a>
              </li>
              <li>
                <a href="#product" className="hover:text-white transition-colors">
                  Critical-Load Prioritization
                </a>
              </li>
              <li>
                <a href="#product" className="hover:text-white transition-colors">
                  AI-Assisted Dispatch
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Solutions by Industry */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Commercial Solutions
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#solutions" className="hover:text-white transition-colors">
                  Cold Rooms & Frozen Foods
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-white transition-colors">
                  Pharmacies & Biologics
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-white transition-colors">
                  Supermarkets & Grocers
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-white transition-colors">
                  Small Clinics & Diagnostic Labs
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-white transition-colors">
                  Solar Installers & EPCs
                </a>
              </li>
            </ul>
          </div>

          {/* Platform & Account */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Platform Access
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In to Console
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  Get Started (Create Account)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Interactive Live Console Demo
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors text-slate-500">
                  Privacy Policy (Prototype Notice)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors text-slate-500">
                  Terms of Service (Prototype Notice)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Dynamic Year and Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} GridMind Intelligence Platform. All rights reserved.</p>
          <p className="text-[11px] text-slate-500 text-center sm:text-right">
            Demonstration software built for AI agent hackathon evaluation. Uses synthetic industrial benchmark models.
          </p>
        </div>
      </div>
    </footer>
  );
}
