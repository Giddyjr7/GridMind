"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/auth/google-button";
import { authService } from "@/services";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Work email is required.")
    .email("Please enter a valid email address (e.g. operator@company.com)."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setServerError(null);
      const res = await authService.login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      if (res.success) {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setServerError(error.message || "Failed to sign in. Please verify your credentials.");
    }
  };

  // Helper for evaluation / testing convenience
  const handleQuickFillDemo = () => {
    setValue("email", "operator@krystalice.ng", { shouldValidate: true });
    setValue("password", "ColdChain2026!#", { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      {/* Quick Demo Pre-fill Pill for Hackathon Evaluators */}
      <div className="p-3 rounded-lg border border-brand-200 bg-brand-50/70 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-brand-950 font-medium">
          <Sparkles className="h-4 w-4 text-emerald-700" />
          <span>Demo Environment Available</span>
        </div>
        <button
          type="button"
          onClick={handleQuickFillDemo}
          className="text-emerald-800 hover:text-emerald-950 underline font-semibold text-[11px]"
        >
          Fill Demo Account
        </button>
      </div>

      {/* Global Error Banner */}
      {serverError && (
        <div className="p-3.5 rounded-lg border border-red-200 bg-red-50 text-red-900 text-xs flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">Sign in failed</p>
            <p className="text-[11px] leading-relaxed text-red-800">{serverError}</p>
          </div>
        </div>
      )}

      {/* Social Provider */}
      <div className="space-y-3">
        <GoogleButton
          label="Sign in with Google"
          onSuccess={() => router.push("/dashboard")}
          disabled={isSubmitting}
        />

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-slate-50 px-3 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            Or continue with email
          </span>
          <div className="border-t border-slate-200 w-full" />
        </div>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email */}
        <Input
          label="Work Email Address"
          type="email"
          placeholder="name@company.com"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          disabled={isSubmitting}
          {...register("email")}
        />

        {/* Password */}
        <div className="space-y-1">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••••"
            autoComplete="current-password"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            disabled={isSubmitting}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            {...register("password")}
          />
        </div>

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <Checkbox
            label="Remember me for 30 days"
            disabled={isSubmitting}
            {...register("rememberMe")}
          />

          <Link
            href="/forgot-password"
            className="font-medium text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="w-full bg-brand-950 hover:bg-brand-900 text-white font-semibold h-10 shadow-sm"
        >
          Sign In
          {!isSubmitting && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </form>

      {/* Switch to Signup */}
      <p className="text-center text-xs text-slate-600 pt-2">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/signup"
          className="font-semibold text-brand-950 hover:underline underline-offset-2"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
