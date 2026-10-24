"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

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
      <div className="space-y-6">
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-950 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <h3 className="text-sm font-bold">Password Reset Request Logged</h3>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed font-medium">
            {successResponse}
          </p>
        </div>

        <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-xs space-y-1">
          <p className="font-semibold text-slate-800">Production Integration Note:</p>
          <p className="text-[11px] leading-relaxed">
            When connected to the production FastAPI / Supabase backend, a signed 15-minute tokenized magic link will be dispatched to verify user identity before set-password screen access.
          </p>
        </div>

        <Link href="/login" className="block w-full">
          <Button variant="outline" className="w-full justify-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {serverError && (
        <div className="p-3.5 rounded-lg border border-red-200 bg-red-50 text-red-900 text-xs flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">Unable to process request</p>
            <p className="text-[11px] leading-relaxed text-red-800">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Registered Work Email"
          type="email"
          placeholder="name@company.com"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          helperText="We will send a secure password recovery link to this address."
          disabled={isSubmitting}
          {...register("email")}
        />

        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="w-full bg-brand-950 hover:bg-brand-900 text-white font-semibold h-10 shadow-sm"
        >
          Send Reset Instructions
          {!isSubmitting && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </form>

      <div className="text-center pt-2">
        <Link
          href="/login"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
