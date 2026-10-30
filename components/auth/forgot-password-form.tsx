"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { AuthCard, AuthCardBody, AuthCardFooter } from "@/components/auth/auth-card";
import { PremiumInput } from "@/components/auth/premium-input";
import { authService } from "@/services";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address."),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [successResponse, setSuccessResponse] = React.useState<string | null>(null);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const emailValue = watch("email");
  const isEmailValid = Boolean(emailValue && !errors.email && emailValue.includes("@"));

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      setServerError(null);
      const res = await authService.requestPasswordReset(values.email);
      setSuccessResponse(res.message);
    } catch (err: unknown) {
      const error = err as Error;
      setServerError(error.message || "Failed to process password reset request.");
    }
  };

  if (successResponse) {
    return (
      <AuthCard>
        <AuthCardBody className="text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-medium text-white">Reset instructions simulated</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              {successResponse}
            </p>
          </div>
        </AuthCardBody>

        <AuthCardFooter>
          <div className="text-center">
            <Link
              href="/login"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to sign in</span>
            </Link>
          </div>
        </AuthCardFooter>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthCardBody>
        {serverError && (
          <div
            role="alert"
            className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150"
          >
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-medium text-rose-200">Request failed</p>
              <p className="text-[11px] leading-relaxed text-rose-300/90">{serverError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-sm flex items-center justify-center gap-2 transition-all duration-150 shadow-[0_1px_15px_rgba(16,185,129,0.25)] hover:shadow-[0_1px_25px_rgba(16,185,129,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Sending instructions...</span>
            ) : (
              <>
                <span>Send reset link</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>
      </AuthCardBody>

      <AuthCardFooter>
        <div className="text-center">
          <Link
            href="/login"
            className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </AuthCardFooter>
    </AuthCard>
  );
}
