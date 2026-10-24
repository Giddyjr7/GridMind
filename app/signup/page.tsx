import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create Account — GridMind Energy Intelligence",
  description: "Create your GridMind account to explore smarter energy management and load continuity.",
};

export default function SignupPage() {
  return (
    <AuthLayout
      heading="Take control of your energy."
      supportingText="Create your GridMind account to explore smarter energy management."
    >
      <SignupForm />
    </AuthLayout>
  );
}
