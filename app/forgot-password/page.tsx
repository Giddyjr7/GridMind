import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset Password | GridMind",
  description: "Reset your GridMind account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      heading="Reset password"
      supportingText="Enter your work email address to receive password reset instructions."
      backHref="/login"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
