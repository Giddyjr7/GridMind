import * as React from "react";
import { OverviewClient } from "./overview-client";

export const metadata = {
  title: "Energy Command Dashboard | GridMind",
  description:
    "Real-time microgrid telemetry, backup runtime forecasting, and critical load protection for commercial refrigeration facilities.",
};

export default function DashboardPage() {
  return <OverviewClient />;
}
