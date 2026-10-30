"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import { AuthCard, AuthCardBody, AuthCardFooter } from "@/components/auth/auth-card";
import { PremiumInput } from "@/components/auth/premium-input";
import { FullScreenTransition } from "@/components/auth/full-screen-transition";
import { authService } from "@/services";
import { useWorkspace } from "@/context/workspace-context";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Work email is required.")
    .email("Please enter a valid work email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { setProfile, profile } = useWorkspace();

  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  // Transition stage: null | "logging_in" | "welcome_back"
  const [transitionStage, setTransitionStage] = React.useState<
    null | "logging_in" | "welcome_back"
  >(null);
  const [targetDisplayName, setTargetDisplayName] = React.useState<string>("");

  const isGoogleAvailable = authService.isGoogleConfigured();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const emailValue = watch("email");
  const isEmailValid = Boolean(emailValue && !errors.email && emailValue.includes("@"));

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setServerError(null);
      const res = await authService.login({
        email: values.email,
        password: values.password,
      });

      if (res.success && res.user) {
        // Derive display name
        const displayName =
          res.user.fullName ||
          (profile && profile.displayName) ||
          values.email.split("@")[0] ||
          "Engineer";

        setTargetDisplayName(displayName);

        // Update profile in workspace context
        setProfile({
          id: res.user.id,
          firstName: displayName.split(" ")[0] || displayName,
          lastName: displayName.split(" ").slice(1).join(" ") || "",
          displayName: displayName,
          email: values.email,
          createdAt: res.user.createdAt || new Date().toISOString(),
        });

        // Stage 1: Logging in...
        setTransitionStage("logging_in");

        setTimeout(() => {
          // Stage 2: Welcome back 👋, {displayName}
          setTransitionStage("welcome_back");

          setTimeout(() => {
            router.push("/workspace");
          }, 1100);
        }, 800);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setServerError(error.message || "Failed to sign in. Please check your credentials.");
    }
  };

  const handleUseDemoAccount = () => {
    setValue("email", "operator@krystalice.ng", { shouldValidate: true });
    setValue("password", "ColdChain2026!#", { shouldValidate: true });
    setServerError(null);
  };

  const skipTransition = () => {
    router.push("/workspace");
  };

  // Render Transition Screens when active
  if (transitionStage === "logging_in") {
    return (
      <FullScreenTransition
        heading="Logging in..."
        subheading="Verifying credentials and loading workspace"
        onSkip={skipTransition}
      />
    );
  }

  if (transitionStage === "welcome_back") {
    return (
      <FullScreenTransition
        heading="Welcome back 👋,"
        name={targetDisplayName}
        isGreeting
        onSkip={skipTransition}
      />
    );
  }

  return (
    <div className="space-y-6">
      <AuthCard>
        <AuthCardBody>
          {/* Server Error Message */}
          {serverError && (
            <div
              role="alert"
              aria-live="polite"
              className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150"
            >
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-medium text-rose-200">Unable to sign in</p>
                <p className="text-[11px] leading-relaxed text-rose-300/90">{serverError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Work Email */}
            <PremiumInput
              label="Work email"
              type="email"
              placeholder="operator@company.com"
              autoComplete="email"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              isValidated={isEmailValid}
              disabled={isSubmitting}
              {...register("email")}
            />

            {/* Password with Show/Hide toggle */}
            <div className="space-y-1">
              <PremiumInput
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                autoComplete="current-password"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                disabled={isSubmitting}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="text-slate-400 hover:text-slate-200 transition-colors p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                {...register("password")}
              />

              <div className="flex justify-end pt-0.5">
                <Link
                  href="/forgot-password"
                  className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-sm flex items-center justify-center gap-2 transition-all duration-150 shadow-[0_1px_15px_rgba(16,185,129,0.25)] hover:shadow-[0_1px_25px_rgba(16,185,129,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070c0a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        </AuthCardBody>

        {/* Separated action area with thin divider */}
        <AuthCardFooter>
          {/* Sign in with Google (ONLY if genuinely configured) */}
          {isGoogleAvailable && (
            <div className="space-y-3 pb-1">
              <button
                type="button"
                onClick={() => authService.loginWithGoogle()}
                className="w-full h-10 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-white text-xs font-medium flex items-center justify-center gap-2.5 transition-colors"
              >
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-white/[0.06] w-full" />
                <span className="bg-[#0c1410] px-3 text-[10px] text-slate-500 uppercase tracking-widest font-mono whitespace-nowrap">
                  Or
                </span>
                <div className="border-t border-white/[0.06] w-full" />
              </div>
            </div>
          )}

          {/* Quiet inline "Use demo account" helper */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleUseDemoAccount}
              className="text-xs text-slate-400 hover:text-emerald-400 underline decoration-slate-600 underline-offset-4 transition-colors"
            >
              Use demo account
            </button>
          </div>
        </AuthCardFooter>
      </AuthCard>

      {/* Navigation link to Signup */}
      <div className="text-center text-xs text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4 transition-colors"
        >
          Create one
        </Link>
      </div>
    </div>
  );
}
