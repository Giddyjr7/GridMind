"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Building2,
  Upload,
  ArrowRight,
  Sparkles,
  MapPin,
  AtSign,
} from "lucide-react";
import { AuthCard, AuthCardBody, AuthCardFooter } from "@/components/auth/auth-card";
import { PremiumInput } from "@/components/auth/premium-input";
import { BusinessTypeOption, Workspace } from "@/types/energy";
import { slugifyHandle } from "@/lib/device-catalogue";
import { MOCK_SITE_PROFILE } from "@/mocks/demo-business";

const step2Schema = z.object({
  name: z
    .string()
    .min(1, "Business name is required.")
    .min(2, "Business name must be at least 2 characters."),
  businessType: z.enum(
    ["cold_storage", "pharmacy", "supermarket", "clinic", "other"],
    {
      required_error: "Please select your business type.",
    }
  ),
  location: z.string().min(1, "Location is required (e.g. Ikeja, Lagos)."),
  handle: z
    .string()
    .min(2, "Workspace handle must be at least 2 characters.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Handle may only contain lowercase letters, numbers, and single hyphens."
    ),
});

export type Step2BusinessFormValues = z.infer<typeof step2Schema>;

interface Step2BusinessProps {
  initialValues: Partial<Step2BusinessFormValues> & { logoDataUrl?: string };
  onNext: (workspace: Workspace) => void;
  onUseDemoBusiness: () => void;
}

const BUSINESS_TYPE_OPTIONS: { id: BusinessTypeOption; label: string }[] = [
  { id: "cold_storage", label: "Cold storage or frozen food" },
  { id: "pharmacy", label: "Pharmacy" },
  { id: "supermarket", label: "Supermarket or retail" },
  { id: "clinic", label: "Small clinic" },
  { id: "other", label: "Other" },
];

export function Step2Business({
  initialValues,
  onNext,
  onUseDemoBusiness,
}: Step2BusinessProps) {
  const [logoDataUrl, setLogoDataUrl] = React.useState<string | undefined>(
    initialValues.logoDataUrl
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Step2BusinessFormValues>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      name: initialValues.name || "",
      businessType: initialValues.businessType || "cold_storage",
      location: initialValues.location || "",
      handle: initialValues.handle || "",
    },
    mode: "onChange",
  });

  const nameValue = watch("name");
  const handleValue = watch("handle");
  const businessTypeValue = watch("businessType");
  const locationValue = watch("location");

  // Track if handle has been manually edited by user
  const [hasManuallyEditedHandle, setHasManuallyEditedHandle] = React.useState(
    Boolean(initialValues.handle)
  );

  React.useEffect(() => {
    if (!hasManuallyEditedHandle && nameValue) {
      const generated = slugifyHandle(nameValue);
      setValue("handle", generated, { shouldValidate: true });
    }
  }, [nameValue, hasManuallyEditedHandle, setValue]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Please upload a logo smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      setLogoDataUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Letter avatar fallback
  const fallbackLetter = (nameValue || "G").trim().charAt(0).toUpperCase();

  const onSubmit = (values: Step2BusinessFormValues) => {
    const selectedOption = BUSINESS_TYPE_OPTIONS.find(
      (opt) => opt.id === values.businessType
    );

    const workspace: Workspace = {
      id: `ws_${Date.now()}`,
      name: values.name.trim(),
      handle: values.handle.trim(),
      businessType: values.businessType,
      businessTypeLabel: selectedOption?.label || "Commercial Facility",
      location: values.location.trim(),
      logoDataUrl,
      createdAt: new Date().toISOString(),
    };

    onNext(workspace);
  };

  return (
    <AuthCard>
      <AuthCardBody>
        {/* Optional Business Logo Upload with Letter-Avatar Fallback */}
        <div className="flex items-center gap-4 pb-2 border-b border-white/[0.06]">
          <div className="relative h-14 w-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 text-white font-medium text-lg">
            {logoDataUrl ? (
              <Image
                src={logoDataUrl}
                alt="Business logo preview"
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <span>{fallbackLetter}</span>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="business-logo-input"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-200 cursor-pointer transition-colors"
            >
              <Upload className="h-3.5 w-3.5 text-slate-400" />
              <span>{logoDataUrl ? "Change logo" : "Upload business logo"}</span>
            </label>
            <input
              id="business-logo-input"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="sr-only"
            />
            <p className="text-[11px] text-slate-500">
              Optional logo, stored on this device.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Business Name */}
          <PremiumInput
            label="Business name"
            placeholder="e.g. Ikeja Cold Storage Ltd"
            autoComplete="organization"
            leftIcon={<Building2 className="h-4 w-4" />}
            error={errors.name?.message}
            isValidated={Boolean(nameValue && !errors.name)}
            {...register("name")}
          />

          {/* Business Type Select */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="businessType"
              className="block text-xs font-medium text-slate-300 tracking-wide select-none"
            >
              Business type
            </label>
            <select
              id="businessType"
              className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-[#080f0b] px-3.5 py-2 text-sm text-white transition-colors hover:border-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
              {...register("businessType")}
            >
              {BUSINESS_TYPE_OPTIONS.map((opt) => (
                <option
                  key={opt.id}
                  value={opt.id}
                  className="bg-[#0c1410] text-white py-1"
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="min-h-[18px]">
              {errors.businessType && (
                <p className="text-[12px] font-medium text-rose-400">
                  {errors.businessType.message}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <PremiumInput
            label="Location"
            placeholder="City and state, e.g. Ikeja, Lagos"
            leftIcon={<MapPin className="h-4 w-4" />}
            error={errors.location?.message}
            isValidated={Boolean(locationValue && !errors.location)}
            {...register("location")}
          />

          {/* Workspace Handle */}
          <PremiumInput
            label="Workspace handle"
            placeholder="workspace-slug"
            leftIcon={<AtSign className="h-4 w-4" />}
            helperText="Used in your private workspace address."
            error={errors.handle?.message}
            isValidated={Boolean(handleValue && !errors.handle)}
            {...register("handle", {
              onChange: () => setHasManuallyEditedHandle(true),
            })}
          />

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-sm flex items-center justify-center gap-2 transition-all duration-150 shadow-[0_1px_15px_rgba(16,185,129,0.25)] hover:shadow-[0_1px_25px_rgba(16,185,129,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070c0a] disabled:opacity-50"
            >
              <span>Continue to device setup</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </AuthCardBody>

      {/* Quiet Secondary Action: Use Krystal Demo Business */}
      <AuthCardFooter>
        <div className="text-center">
          <button
            type="button"
            onClick={onUseDemoBusiness}
            className="text-xs text-slate-400 hover:text-emerald-400 underline decoration-slate-600 underline-offset-4 transition-colors"
          >
            Use the Krystal Ice Cold Storage demo business
          </button>
        </div>
      </AuthCardFooter>
    </AuthCard>
  );
}
