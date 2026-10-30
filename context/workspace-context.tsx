"use client";

import * as React from "react";
import {
  UserProfile,
  Workspace,
  ConnectedDevice,
  WorkspaceState,
} from "@/types/energy";
import {
  loadStoredWorkspaceState,
  saveStoredWorkspaceState,
  DEFAULT_WORKSPACE_STATE,
  clearStoredWorkspaceState,
} from "@/lib/workspace-storage";

export interface WorkspaceContextValue {
  profile: UserProfile | null;
  workspace: Workspace | null;
  devices: ConnectedDevice[];
  invitedMembers: { email: string; role: "member" | "admin" }[];
  welcomeDismissed: boolean;
  isHydrated: boolean;

  // Actions
  setProfile: (profile: UserProfile | null) => void;
  setWorkspace: (workspace: Workspace | null) => void;
  setDevices: (devices: ConnectedDevice[]) => void;
  addDevice: (device: Omit<ConnectedDevice, "id" | "createdAt">) => ConnectedDevice;
  updateDevice: (id: string, updates: Partial<ConnectedDevice>) => void;
  removeDevice: (id: string) => void;
  setInvitedMembers: (members: { email: string; role: "member" | "admin" }[]) => void;
  dismissWelcome: () => void;
  resetToDemo: () => void;
  signOut: () => void;
}

const WorkspaceContext = React.createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<WorkspaceState>(DEFAULT_WORKSPACE_STATE);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Hydrate from localStorage safely on mount
  React.useEffect(() => {
    const loaded = loadStoredWorkspaceState();
    setState(loaded);
    setIsHydrated(true);
  }, []);

  // Save changes to localStorage whenever state changes after hydration
  React.useEffect(() => {
    if (isHydrated) {
      saveStoredWorkspaceState(state);
    }
  }, [state, isHydrated]);

  const setProfile = React.useCallback((profile: UserProfile | null) => {
    setState((prev) => ({ ...prev, profile }));
  }, []);

  const setWorkspace = React.useCallback((workspace: Workspace | null) => {
    setState((prev) => ({ ...prev, workspace }));
  }, []);

  const setDevices = React.useCallback((devices: ConnectedDevice[]) => {
    setState((prev) => ({ ...prev, devices }));
  }, []);

  const addDevice = React.useCallback(
    (deviceInput: Omit<ConnectedDevice, "id" | "createdAt">): ConnectedDevice => {
      const newDevice: ConnectedDevice = {
        ...deviceInput,
        id: `dev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        devices: [...prev.devices, newDevice],
      }));
      return newDevice;
    },
    []
  );

  const updateDevice = React.useCallback((id: string, updates: Partial<ConnectedDevice>) => {
    setState((prev) => ({
      ...prev,
      devices: prev.devices.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  }, []);

  const removeDevice = React.useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      devices: prev.devices.filter((d) => d.id !== id),
    }));
  }, []);

  const setInvitedMembers = React.useCallback(
    (invitedMembers: { email: string; role: "member" | "admin" }[]) => {
      setState((prev) => ({ ...prev, invitedMembers }));
    },
    []
  );

  const dismissWelcome = React.useCallback(() => {
    setState((prev) => ({ ...prev, welcomeDismissed: true }));
  }, []);

  const resetToDemo = React.useCallback(() => {
    setState(DEFAULT_WORKSPACE_STATE);
    saveStoredWorkspaceState(DEFAULT_WORKSPACE_STATE);
  }, []);

  const signOut = React.useCallback(() => {
    clearStoredWorkspaceState();
    setState({
      profile: null,
      workspace: null,
      devices: [],
      invitedMembers: [],
      welcomeDismissed: false,
      version: 1,
    });
  }, []);

  const value = React.useMemo<WorkspaceContextValue>(
    () => ({
      profile: state.profile,
      workspace: state.workspace,
      devices: state.devices,
      invitedMembers: state.invitedMembers ?? [],
      welcomeDismissed: state.welcomeDismissed,
      isHydrated,
      setProfile,
      setWorkspace,
      setDevices,
      addDevice,
      updateDevice,
      removeDevice,
      setInvitedMembers,
      dismissWelcome,
      resetToDemo,
      signOut,
    }),
    [
      state,
      isHydrated,
      setProfile,
      setWorkspace,
      setDevices,
      addDevice,
      updateDevice,
      removeDevice,
      setInvitedMembers,
      dismissWelcome,
      resetToDemo,
      signOut,
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = React.useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
