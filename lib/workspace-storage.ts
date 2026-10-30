import {
  UserProfile,
  Workspace,
  ConnectedDevice,
  WorkspaceState,
} from "@/types/energy";
import { getKrystalDemoDevices } from "./device-catalogue";
import { MOCK_SITE_PROFILE } from "@/mocks/demo-business";

export const WORKSPACE_STORAGE_KEY = "gridmind_workspace_state_v1";

export const DEMO_PROFILE: UserProfile = {
  id: "usr_demo_facility_lead",
  firstName: "Tunde",
  lastName: "Adeyemi",
  displayName: "Tunde Adeyemi",
  email: "operator@krystalice.ng",
  role: "facility_manager",
  createdAt: "2024-01-15T08:00:00Z",
};

export const DEMO_WORKSPACE: Workspace = {
  id: "ws_krystal_ice",
  name: MOCK_SITE_PROFILE.name,
  handle: "krystal-ice-cold-storage",
  businessType: "cold_storage",
  businessTypeLabel: "Cold storage or frozen food",
  location: "Ikeja, Lagos State",
  createdAt: "2024-01-15T08:00:00Z",
};

export const DEFAULT_WORKSPACE_STATE: WorkspaceState = {
  profile: DEMO_PROFILE,
  workspace: DEMO_WORKSPACE,
  devices: getKrystalDemoDevices(),
  invitedMembers: [],
  welcomeDismissed: false,
  version: 1,
};

/**
 * Safe client-side storage adapter.
 * Uses try/catch to protect against corrupt JSON, disabled cookies, or private browsing.
 * Passwords and secret credentials are never stored.
 */
export function loadStoredWorkspaceState(): WorkspaceState {
  if (typeof window === "undefined") {
    return DEFAULT_WORKSPACE_STATE;
  }

  try {
    const raw = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_WORKSPACE_STATE;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || parsed.version !== 1) {
      return DEFAULT_WORKSPACE_STATE;
    }
    return {
      profile: parsed.profile ?? null,
      workspace: parsed.workspace ?? null,
      devices: Array.isArray(parsed.devices) ? parsed.devices : [],
      invitedMembers: Array.isArray(parsed.invitedMembers) ? parsed.invitedMembers : [],
      welcomeDismissed: Boolean(parsed.welcomeDismissed),
      version: 1,
    };
  } catch {
    return DEFAULT_WORKSPACE_STATE;
  }
}

export function saveStoredWorkspaceState(state: WorkspaceState): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const serialized = JSON.stringify({
      profile: state.profile,
      workspace: state.workspace,
      devices: state.devices,
      invitedMembers: state.invitedMembers ?? [],
      welcomeDismissed: state.welcomeDismissed,
      version: 1,
    });
    window.localStorage.setItem(WORKSPACE_STORAGE_KEY, serialized);
    return true;
  } catch {
    return false;
  }
}

export function clearStoredWorkspaceState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(WORKSPACE_STORAGE_KEY);
  } catch {
    // Ignore errors during clearing
  }
}
