import type { Metadata } from "next";
import { WorkspaceClient } from "@/components/workspace/workspace-client";

export const metadata: Metadata = {
  title: "Workspace | GridMind Energy Intelligence",
  description: "Monitor and manage connected equipment, energy sources, and continuity status.",
};

export default function WorkspacePage() {
  return <WorkspaceClient />;
}
