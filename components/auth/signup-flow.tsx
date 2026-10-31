"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout, StepItem } from "@/components/auth/auth-layout";
import { Step1Account, Step1FormValues } from "@/components/auth/step-1-account";
import { Step2Business } from "@/components/auth/step-2-business";
import { Step3Devices } from "@/components/auth/step-3-devices";
import { Step4Team, TeamMemberInvite } from "@/components/auth/step-4-team";
import { FullScreenTransition } from "@/components/auth/full-screen-transition";
import { useWorkspace } from "@/context/workspace-context";
import { siteService } from "@/services/site-service";
import { authService } from "@/services";
import {
  UserProfile,
  Workspace,
  ConnectedDevice,
} from "@/types/energy";
import {
  getKrystalDemoDevices,
} from "@/lib/device-catalogue";
import {
  MOCK_SITE_PROFILE,
} from "@/mocks/demo-business";

const SIGNUP_STEPS: StepItem[] = [
  { id: "account", label: "Create account" },
  { id: "business", label: "Your business" },
  { id: "devices", label: "Connect devices" },
  { id: "team", label: "Invite team" },
];

export function SignupFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setProfile, setWorkspace, setDevices, setInvitedMembers } = useWorkspace();

  // Read current step from URL query (?step=account|business|devices|team)
  const currentStepQuery = searchParams.get("step") || "account";
  const stepIndex = Math.max(
    0,
    SIGNUP_STEPS.findIndex((s) => s.id === currentStepQuery)
  );

  // Flow State
  const [accountData, setAccountData] = React.useState<
    Partial<Step1FormValues> & { avatarDataUrl?: string }
  >({});
  const [workspaceData, setWorkspaceData] = React.useState<Workspace | null>(null);
  const [devicesData, setDevicesData] = React.useState<ConnectedDevice[]>([]);
  const [teamData, setTeamData] = React.useState<TeamMemberInvite[]>([]);

  // Finish Transitions: null | "setting_up" | "hi_user"
  const [finishStage, setFinishStage] = React.useState<
    null | "setting_up" | "hi_user"
  >(null);

  // Navigate between steps updating the URL query so back button works seamlessly
  const goToStep = (stepId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", stepId);
    router.push(`/signup?${params.toString()}`);
  };

  const handleStep1Next = async (
    data: Step1FormValues & { avatarDataUrl?: string }
  ) => {
    setAccountData(data);

    await authService.signup({
      fullName: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      password: data.password,
      confirmPassword: data.password,
      agreeToTerms: data.agreeToTerms,
    });

    goToStep("business");
  };

  const handleStep2Next = (workspace: Workspace) => {
    setWorkspaceData(workspace);
    goToStep("devices");
  };

  const handleUseDemoBusiness = () => {
    const demoWs: Workspace = {
      id: "ws_krystal_ice",
      name: MOCK_SITE_PROFILE.name,
      handle: "krystal-ice-cold-storage",
      businessType: "cold_storage",
      businessTypeLabel: "Cold storage or frozen food",
      location: "Uyo, Akwa Ibom State",
      createdAt: new Date().toISOString(),
    };
    setWorkspaceData(demoWs);

    // Pre-select Krystal demo devices for step 3
    setDevicesData(getKrystalDemoDevices());

    goToStep("devices");
  };

  const handleStep3Next = (devices: ConnectedDevice[]) => {
    setDevicesData(devices);
    goToStep("team");
  };

  const handleStep3Skip = () => {
    setDevicesData([]);
    goToStep("team");
  };

  const finalizeOnboarding = (invited: TeamMemberInvite[]) => {
    setTeamData(invited);

    // Save profile to context and persistence
    const userProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      firstName: accountData.firstName || "Engineer",
      lastName: accountData.lastName || "",
      displayName: `${accountData.firstName || "Engineer"} ${
        accountData.lastName || ""
      }`.trim(),
      email: accountData.email || "user@example.com",
      avatarDataUrl: accountData.avatarDataUrl,
      createdAt: new Date().toISOString(),
    };

    const finalWorkspace: Workspace = workspaceData || {
      id: `ws_${Date.now()}`,
      name: "My Energy Workspace",
      handle: "my-workspace",
      businessType: "cold_storage",
      location: "Uyo, Nigeria",
      createdAt: new Date().toISOString(),
    };

    setProfile(userProfile);
    setWorkspace(finalWorkspace);
    setDevices(devicesData);
    setInvitedMembers(invited);

    // Register the business and its equipment with the API. Until this
    // existed, signup lived only in localStorage, so the backend, the MQTT
    // twin and both risk models never saw the equipment a site declared.
    void siteService
      .provision({
        name: finalWorkspace.name,
        industry: finalWorkspace.businessType,
        location: finalWorkspace.location,
        appliances: devicesData
          .filter((device) => device.category !== "power_sources")
          .map((device) => ({
            name: device.name,
            category: device.category,
            priority: device.priority === "nonessential" ? ("deferrable" as const) : device.priority,
            ratedPowerKw: device.ratedPowerKw,
            notes: device.notes,
          })),
        sources: sourcesFromDevices(devicesData),
      })
      .catch(() => {
        // Onboarding must still complete if the API is unreachable; the
        // dashboard falls back to the locally stored workspace.
      });

    // Stage 1: Setting up your account, please wait...
    setFinishStage("setting_up");

    setTimeout(() => {
      // Stage 2: Hi 👋, {firstName}
      setFinishStage("hi_user");

      setTimeout(() => {
        router.push("/workspace");
      }, 1200);
    }, 1100);
  };

  const handleBack = () => {
    if (stepIndex === 1) goToStep("account");
    if (stepIndex === 2) goToStep("business");
    if (stepIndex === 3) goToStep("devices");
  };

  const skipFinishTransition = () => {
    router.push("/workspace");
  };

  // Render full screen transitions
  if (finishStage === "setting_up") {
    return (
      <FullScreenTransition
        heading="Setting up your account, please wait..."
        subheading="Provisioning private workspace and registering equipment monitors"
        onSkip={skipFinishTransition}
      />
    );
  }

  if (finishStage === "hi_user") {
    return (
      <FullScreenTransition
        heading="Hi 👋,"
        name={accountData.firstName || "there"}
        isGreeting
        onSkip={skipFinishTransition}
      />
    );
  }

  // Heading & subtitle config per step
  const stepHeadings = [
    {
      heading: "Create your account",
      subheading: "Start managing your facility with GridMind.",
    },
    {
      heading: "Tell us about your business",
      subheading: "Define your workspace for microgrid tracking.",
    },
    {
      heading: "Choose what to monitor",
      subheading:
        "Select the equipment and energy sources you want GridMind to track. You can change this any time.",
    },
    {
      heading: "Invite your team",
      subheading: "Collaborate with facility managers and electrical engineers.",
    },
  ];

  const currentHeading = stepHeadings[stepIndex] || stepHeadings[0];

  return (
    <AuthLayout
      heading={currentHeading.heading}
      supportingText={currentHeading.subheading}
      steps={SIGNUP_STEPS}
      currentStepIndex={stepIndex}
      onBack={stepIndex > 0 ? handleBack : undefined}
      backHref={stepIndex === 0 ? "/" : undefined}
      contentClassName={stepIndex === 2 ? "max-w-3xl" : undefined}
    >
      {stepIndex === 0 && (
        <Step1Account initialValues={accountData} onNext={handleStep1Next} />
      )}

      {stepIndex === 1 && (
        <Step2Business
          initialValues={workspaceData || {}}
          onNext={handleStep2Next}
          onUseDemoBusiness={handleUseDemoBusiness}
        />
      )}

      {stepIndex === 2 && (
        <Step3Devices
          initialDevices={devicesData}
          onNext={handleStep3Next}
          onSkip={handleStep3Skip}
        />
      )}

      {stepIndex === 3 && (
        <Step4Team
          initialMembers={teamData}
          onFinish={finalizeOnboarding}
          onSkip={() => finalizeOnboarding([])}
        />
      )}
    </AuthLayout>
  );
}

/**
 * Pulls source ratings out of the devices chosen during onboarding. Solar,
 * battery and generator arrive as catalogue items, but the backend stores them
 * as site configuration rather than as loads.
 */
function sourcesFromDevices(devices: ConnectedDevice[]) {
  const find = (fragment: string) =>
    devices.find(
      (device) =>
        device.category === "power_sources" &&
        device.deviceTypeId.toLowerCase().includes(fragment),
    );

  const solar = find("solar");
  const battery = find("batter");
  const generator = find("gen");

  return {
    ...(solar && { solarCapacityKwp: solar.ratedPowerKw }),
    ...(battery && { batteryCapacityKwh: battery.ratedPowerKw }),
    ...(generator && { generatorCapacityKva: generator.ratedPowerKw }),
  };
}
