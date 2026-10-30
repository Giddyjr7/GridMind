import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupFlow } from "@/components/auth/signup-flow";

export const metadata: Metadata = {
  title: "Create Account | GridMind",
  description: "Set up your GridMind account, workspace, and monitored energy devices.",
};

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070c0a] flex items-center justify-center">
          <div className="h-6 w-6 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <SignupFlow />
    </Suspense>
  );
}
