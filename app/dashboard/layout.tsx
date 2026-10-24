import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SimulationProvider } from "@/context/simulation-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SimulationProvider>
      <AppShell>{children}</AppShell>
    </SimulationProvider>
  );
}
