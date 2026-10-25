import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In | GridMind Energy Intelligence",
  description: "Sign in to manage your microgrid operations and load dispatch with GridMind.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      heading="Welcome back."
      supportingText="Sign in to manage your energy operations with GridMind."
    >
      <LoginForm />
    </AuthLayout>
  );
}
