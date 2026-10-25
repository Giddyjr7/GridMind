"use client";

import * as React from "react";
import Link from "next/link";
import { Zap, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Product", href: "#product" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Interactive Demo", href: "#simulator-preview" },
    { label: "Solutions", href: "#solutions" },
    { label: "Why GridMind", href: "#why-gridmind" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)]"
          : "bg-transparent border-b border-slate-200/40"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo / Wordmark */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-brand-950 flex items-center justify-center text-white shadow-sm ring-1 ring-brand-800 transition-transform group-hover:scale-105">
            <Zap className="h-5 w-5 text-emerald-400 fill-emerald-400/20" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-brand-950 transition-colors">
                GridMind
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-950 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                Intelligence
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Energy Continuity Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-slate-700 font-medium">
              Sign In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-800 hover:bg-slate-100 font-medium">
              Live Console
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-brand-950 hover:bg-brand-900 text-white font-medium shadow-sm">
              Get Started
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2">
          <nav className="space-y-3 mb-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full">
              <Button variant="outline" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block w-full">
              <Button variant="secondary" className="w-full justify-center">
                Explore Demo Console
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full">
              <Button className="w-full justify-center bg-brand-950 hover:bg-brand-900 text-white">
                Get Started
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
