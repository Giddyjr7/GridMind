"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  Upload,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { AuthCard, AuthCardBody, AuthCardFooter } from "@/components/auth/auth-card";
import { PremiumInput } from "@/components/auth/premium-input";
import { authService } from "@/services";

const step1Schema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z
    .string()
    .min(1, "Work email is required.")
    .email("Please enter a valid work email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[0-9]/, "Password must contain at least one number."),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms of Service and Privacy Policy.",
  }),
});

export type Step1FormValues = z.infer<typeof step1Schema>;

interface Step1AccountProps {
  initialValues: Partial<Step1FormValues> & { avatarDataUrl?: string };
  onNext: (values: Step1FormValues & { avatarDataUrl?: string }) => void | Promise<void>;
}

export function Step1Account({ initialValues, onNext }: Step1AccountProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [avatarDataUrl, setAvatarDataUrl] = React.useState<string | undefined>(
    initialValues.avatarDataUrl
  );
  const [serverError, setServerError] = React.useState<string | null>(null);

  const isGoogleAvailable = authService.isGoogleConfigured();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      firstName: initialValues.firstName || "",
      lastName: initialValues.lastName || "",
      email: initialValues.email || "",
      password: initialValues.password || "",
      agreeToTerms: initialValues.agreeToTerms || false,
    },
    mode: "onChange",
  });

  const firstNameValue = watch("firstName");
  const lastNameValue = watch("lastName");
  const emailValue = watch("email");
  const passwordValue = watch("password") || "";
  const agreeToTerms = watch("agreeToTerms");

  // Live password rules
  const hasEightChars = passwordValue.length >= 8;
  const hasOneNumber = /[0-9]/.test(passwordValue);

  // Profile photo upload handler (client preview only)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Please upload an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      setAvatarDataUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: Step1FormValues) => {
    try {
      setServerError(null);
      await onNext({
        ...values,
        avatarDataUrl,
      });
    } catch (error: unknown) {
      setServerError(
        error instanceof Error ? error.message : "Unable to create your account."
      );
    }
  };

  return (
    <AuthCard>
      <AuthCardBody>
        {/* Optional Profile Photo Upload */}
        <div className="flex items-center gap-4 pb-2 border-b border-white/[0.06]">
          <div className="relative h-14 w-14 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
            {avatarDataUrl ? (
              <Image
                src={avatarDataUrl}
                alt="Profile photo preview"
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-slate-400" />
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="profile-photo-input"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-200 cursor-pointer transition-colors"
            >
              <Upload className="h-3.5 w-3.5 text-slate-400" />
              <span>{avatarDataUrl ? "Change photo" : "Upload photo"}</span>
            </label>
            <input
              id="profile-photo-input"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="sr-only"
            />
            <p className="text-[11px] text-slate-500">
              Optional avatar, stored on this device.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <PremiumInput
              label="First name"
              placeholder="e.g. Tunde"
              autoComplete="given-name"
              error={errors.firstName?.message}
              isValidated={Boolean(firstNameValue && !errors.firstName)}
              {...register("firstName")}
            />

            <PremiumInput
              label="Last name"
              placeholder="e.g. Adeyemi"
              autoComplete="family-name"
              error={errors.lastName?.message}
              isValidated={Boolean(lastNameValue && !errors.lastName)}
              {...register("lastName")}
            />
          </div>

          {/* Work Email */}
          <PremiumInput
            label="Work email"
            type="email"
            placeholder="operator@company.com"
            autoComplete="email"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            isValidated={Boolean(emailValue && !errors.email && emailValue.includes("@"))}
            {...register("email")}
          />

          {/* Password with live rules */}
          <div className="space-y-2">
            <PremiumInput
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              autoComplete="new-password"
              leftIcon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
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

            {/* Live password requirements indicators */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pl-1">
              <span
                className={`inline-flex items-center gap-1 transition-colors ${
                  hasEightChars ? "text-emerald-400 font-medium" : "text-slate-500"
                }`}
              >
                <Check
                  className={`h-3 w-3 stroke-[3] ${
                    hasEightChars ? "text-emerald-400" : "text-slate-600"
                  }`}
                />
                8+ characters
              </span>
              <span
                className={`inline-flex items-center gap-1 transition-colors ${
                  hasOneNumber ? "text-emerald-400 font-medium" : "text-slate-500"
                }`}
              >
                <Check
                  className={`h-3 w-3 stroke-[3] ${
                    hasOneNumber ? "text-emerald-400" : "text-slate-600"
                  }`}
                />
                At least 1 number
              </span>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-white/20 bg-[#080f0b] text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-[#070c0a] cursor-pointer"
                {...register("agreeToTerms")}
              />
              <span className="text-xs text-slate-400 leading-relaxed select-none">
                I agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-300 hover:text-white underline underline-offset-2"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-300 hover:text-white underline underline-offset-2"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-[12px] font-medium text-rose-400 mt-1 pl-7">
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            {serverError && (
              <div className="mb-3 flex items-start gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 p-3 text-xs text-rose-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-sm flex items-center justify-center gap-2 transition-all duration-150 shadow-[0_1px_15px_rgba(16,185,129,0.25)] hover:shadow-[0_1px_25px_rgba(16,185,129,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070c0a] disabled:opacity-50"
            >
              <span>Continue to business details</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </AuthCardBody>

      {/* Optional Google Signup if configured */}
      {isGoogleAvailable && (
        <AuthCardFooter>
          <button
            type="button"
            onClick={() => authService.loginWithGoogle()}
            className="w-full h-10 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-white text-xs font-medium flex items-center justify-center gap-2.5 transition-colors"
          >
            <span>Sign up with Google</span>
          </button>
        </AuthCardFooter>
      )}
    </AuthCard>
  );
}
