"use client";

import * as React from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "gridmind_install_prompt_dismissed";

/**
 * Surfaces Chrome's install prompt as an in-app banner. The browser only fires
 * `beforeinstallprompt` when the app is installable and not already installed,
 * so this renders nothing in every other case, including iOS.
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = React.useState<BeforeInstallPromptEvent | null>(null);

  React.useEffect(() => {
    if (window.localStorage.getItem(DISMISS_KEY) === "1") return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setDeferred(null);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!deferred) return null;

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setDeferred(null);
  };

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 flex items-center justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0">
        <Download className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-white">Install GridMind on this device</p>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            Opens full screen and keeps outage alerts arriving when the browser is closed.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={async () => {
            await deferred.prompt();
            await deferred.userChoice;
            setDeferred(null);
          }}
          className="rounded-lg bg-emerald-500/90 px-3 py-1.5 text-xs font-medium text-[#06130d] hover:bg-emerald-400 transition-colors"
        >
          Install
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="h-7 w-7 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
