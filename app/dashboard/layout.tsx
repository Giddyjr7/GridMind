import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SimulationProvider } from "@/context/simulation-context";
import { ScenarioProvider } from "@/context/scenario-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SimulationProvider>
      <ScenarioProvider>
        <AppShell>{children}</AppShell>
      </ScenarioProvider>
    </SimulationProvider>
  );
}
