import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset Password | GridMind Energy Intelligence",
  description: "Reset your GridMind account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      heading="Reset your password."
      supportingText="Enter your work email address and we'll send you instructions to reset your password."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
