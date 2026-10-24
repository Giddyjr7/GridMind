"use client";

import * as React from "react";
import { Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services";

interface GoogleButtonProps {
  label?: string;
  onSuccess?: () => void;
  disabled?: boolean;
}

export function GoogleButton({
  label = "Continue with Google",
  onSuccess,
  disabled = false,
}: GoogleButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);

  const handleGoogleClick = async () => {
    try {
      setIsLoading(true);
      setNotice(null);

      const result = await authService.loginWithGoogle();

      if (!result.success) {
        setNotice(result.message || "Google authentication is not configured in this demo build.");
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      const error = err as Error;
      setNotice(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2.5 w-full">
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleClick}
        disabled={disabled || isLoading}
        isLoading={isLoading}
        className="w-full justify-center bg-white hover:bg-slate-50 text-slate-700 border-slate-300 font-medium shadow-[0_1px_2px_rgba(0,0,0,0.03)] h-10"
      >
        {!isLoading && (
          <svg className="h-4 w-4 mr-2.5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
        )}
        <span>{label}</span>
      </Button>

      {/* User-friendly OAuth boundary disclaimer */}
      {notice && (
        <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/90 text-amber-900 text-xs flex items-start gap-2.5 animate-in fade-in">
          <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-950">Integration Notice (Demo Build)</p>
            <p className="text-[11px] leading-relaxed text-amber-900">{notice}</p>
          </div>
        </div>
      )}
    </div>
  );
}
