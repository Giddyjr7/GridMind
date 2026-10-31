"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { GridMindLogo } from "@/components/brand/gridmind-logo";

const navLinks = [
  { label: "Platform", href: "#product" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Live simulator", href: "#simulator-preview" },
  { label: "Solutions", href: "#solutions" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/[0.08] bg-[#070a09]/90 backdrop-blur-xl"
          : "border-transparent bg-[#070a09]/55 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" aria-label="GridMind home">
          <GridMindLogo inverse markClassName="h-9 w-9" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13px] font-medium text-slate-400 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="inline-flex h-9 items-center rounded-lg px-4 text-[13px] font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-white px-4 text-[13px] font-semibold text-[#07100c] transition hover:bg-emerald-300"
          >
            Get started
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:bg-white/[0.05] hover:text-white lg:hidden"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/[0.08] bg-[#090d0b] px-5 py-5 lg:hidden">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.08] pt-5">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-white/10 text-sm font-medium text-white"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-400 text-sm font-semibold text-[#06110c]"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
