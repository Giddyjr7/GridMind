import type { Metadata } from "next";
import "./globals.css";
import { WorkspaceProvider } from "@/context/workspace-context";

export const metadata: Metadata = {
  title: "GridMind: Smarter Energy. Uninterrupted Business.",
  description:
    "AI-assisted energy management and continuity intelligence for businesses balancing national grid, generators, solar, and battery storage.",
  icons: { icon: "/brand/gridmind-mark.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#fcfdfc] font-sans antialiased text-slate-900 selection:bg-brand-100 selection:text-brand-950">
        <WorkspaceProvider>
          {children}
        </WorkspaceProvider>
      </body>
    </html>
  );
}
