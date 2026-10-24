"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/auth/google-button";
import { authService } from "@/services";

const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required.")
      .min(2, "Full name must be at least 2 characters long."),
    email: z
      .string()
      .min(1, "Work email is required.")
      .email("Please enter a valid work email address (e.g. operator@company.com)."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[0-9]/, "Password must contain at least one number."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Service and Privacy Policy to create an account.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const watchedPassword = watch("password") || "";
  const hasMinLength = watchedPassword.length >= 8;
  const hasNumber = /[0-9]/.test(watchedPassword);

  const onSubmit = async (values: SignupFormValues) => {
    try {
      setServerError(null);
      const res = await authService.signup({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        agreeToTerms: values.agreeToTerms,
      });

      if (res.success) {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setServerError(error.message || "Failed to create account. Please check your inputs.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Global Error Banner */}
      {serverError && (
        <div className="p-3.5 rounded-lg border border-red-200 bg-red-50 text-red-900 text-xs flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">Unable to create account</p>
            <p className="text-[11px] leading-relaxed text-red-800">{serverError}</p>
          </div>
        </div>
      )}

      {/* Social Provider */}
      <div className="space-y-3">
        <GoogleButton
          label="Sign up with Google"
          onSuccess={() => router.push("/dashboard")}
          disabled={isSubmitting}
        />

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-slate-50 px-3 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            Or create with work email
          </span>
          <div className="border-t border-slate-200 w-full" />
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Babatunde Adeyemi"
          autoComplete="name"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.fullName?.message}
          disabled={isSubmitting}
          {...register("fullName")}
        />

        {/* Work Email */}
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
        <div className="space-y-1.5">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            autoComplete="new-password"
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
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            {...register("password")}
          />

          {/* Password requirement badges */}
          <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
            <span className={`inline-flex items-center gap-1 ${hasMinLength ? "text-emerald-700 font-medium" : "text-slate-400"}`}>
              <Check className={`h-3 w-3 ${hasMinLength ? "text-emerald-600" : "text-slate-300"}`} />
              8+ characters
            </span>
            <span className={`inline-flex items-center gap-1 ${hasNumber ? "text-emerald-700 font-medium" : "text-slate-400"}`}>
              <Check className={`h-3 w-3 ${hasNumber ? "text-emerald-600" : "text-slate-300"}`} />
              At least 1 number
            </span>
          </div>
        </div>

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          disabled={isSubmitting}
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
              className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          {...register("confirmPassword")}
        />

        {/* Terms and Privacy Consent */}
        <div className="pt-1">
          <Checkbox
            label={
              <span>
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="text-emerald-800 hover:underline font-semibold">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" className="text-emerald-800 hover:underline font-semibold">
                  Privacy Policy
                </Link>
                .
              </span>
            }
            error={errors.agreeToTerms?.message}
            disabled={isSubmitting}
            {...register("agreeToTerms")}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="w-full bg-brand-950 hover:bg-brand-900 text-white font-semibold h-10 shadow-sm mt-2"
        >
          Create Account
          {!isSubmitting && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </form>

      {/* Switch to Login */}
      <p className="text-center text-xs text-slate-600 pt-2">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-950 hover:underline underline-offset-2"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
