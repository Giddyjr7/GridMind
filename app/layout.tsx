import type { Metadata, Viewport } from "next";
import "./globals.css";
import { WorkspaceProvider } from "@/context/workspace-context";
import { ServiceWorkerRegistrar } from "@/components/pwa/service-worker-registrar";

export const metadata: Metadata = {
  title: "GridMind: Smarter Energy. Uninterrupted Business.",
  description:
    "AI-assisted energy management and continuity intelligence for businesses balancing national grid, generators, solar, and battery storage.",
  manifest: "/manifest.webmanifest",
  applicationName: "GridMind",
  icons: {
    icon: "/brand/gridmind-mark.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "GridMind",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#070c0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
