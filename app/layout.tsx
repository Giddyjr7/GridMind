import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GridMind — Smarter Energy. Uninterrupted Business.",
  description:
    "AI-assisted energy management and continuity intelligence for businesses balancing national grid, generators, solar, and battery storage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#fcfdfc] font-sans antialiased text-slate-900 selection:bg-brand-100 selection:text-brand-950">
        {children}
      </body>
    </html>
  );
}
