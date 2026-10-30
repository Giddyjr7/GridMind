import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In | GridMind",
  description: "Sign in to your GridMind workspace to monitor energy continuity and manage simulated devices.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      heading="Welcome back"
      supportingText="Sign in to your workspace to monitor energy continuity."
    >
      <LoginForm />
    </AuthLayout>
  );
}
