"use client";

import * as React from "react";
import { Bell, BellOff, Check, Loader2, ShieldAlert } from "lucide-react";
import {
  disablePushNotifications,
  enablePushNotifications,
  getPushStatus,
  sendTestNotification,
  type PushStatus,
} from "@/lib/push-notifications";

const UNSUPPORTED_COPY: Record<Exclude<PushStatus["support"], "supported">, string> = {
  unsupported_browser:
    "This browser does not support Web Push. On iPhone and iPad, add GridMind to the Home Screen first, then enable alerts from the installed app.",
  insecure_context:
    "Push notifications need HTTPS. They work on localhost during development, but a plain-HTTP address on your network cannot register a service worker.",
  not_configured:
    "No VAPID public key is configured for this build, so the browser cannot create a push subscription.",
  service_worker_blocked:
    "This browser blocked the GridMind service worker, so push cannot be registered. Private windows and managed-device policies commonly do this.",
};

export function NotificationControls() {
  const [status, setStatus] = React.useState<PushStatus | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<{ tone: "ok" | "error"; text: string } | null>(null);

  React.useEffect(() => {
    void getPushStatus().then(setStatus);
  }, []);

  const run = async (action: () => Promise<PushStatus | void>, okText?: string) => {
    setBusy(true);
    setMessage(null);
    try {
      const next = await action();
      if (next) setStatus(next);
      else setStatus(await getPushStatus());
      if (okText) setMessage({ tone: "ok", text: okText });
    } catch (error) {
      setMessage({
        tone: "error",
        text: error instanceof Error ? error.message : "The notification request failed.",
      });
    } finally {
      setBusy(false);
    }
  };

  const unsupportedCopy =
    status && status.support !== "supported" ? UNSUPPORTED_COPY[status.support] : null;
  const blocked = status?.permission === "denied";

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-emerald-400" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Operator Alerts
        </h3>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Send outage-risk escalations and approval requests to this device as system notifications.
        Alerts arrive even when the dashboard is closed, because the push service wakes the
        installed app. GridMind never acts on an alert by itself: approval stays with the operator.
      </p>

      {status === null ? (
        <div className="h-9 w-40 rounded-lg bg-white/[0.03] animate-pulse" />
      ) : unsupportedCopy ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-3 text-xs text-amber-200/90">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
          <p className="leading-relaxed">{unsupportedCopy}</p>
        </div>
      ) : blocked ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/[0.06] p-3 text-xs text-rose-200/90">
          <BellOff className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
          <p className="leading-relaxed">
            Notifications are blocked for this site. Re-allow them in your browser&apos;s site
            settings, then reload this page.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              status.subscribed
                ? void run(disablePushNotifications, "Alerts turned off for this device.")
                : void run(enablePushNotifications)
            }
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors disabled:opacity-50 ${
              status.subscribed
                ? "border border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.04]"
                : "bg-emerald-500/90 text-[#06130d] hover:bg-emerald-400"
            }`}
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : status.subscribed ? (
              <BellOff className="h-3.5 w-3.5" />
            ) : (
              <Bell className="h-3.5 w-3.5" />
            )}
            {status.subscribed ? "Turn off alerts" : "Enable alerts on this device"}
          </button>

          {status.subscribed && (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void run(async () => {
                  const result = await sendTestNotification();
                  if (result.skipped) throw new Error("The API has no VAPID keys configured.");
                  if (result.sent === 0) {
                    throw new Error("No subscribed device received the test notification.");
                  }
                }, "Test notification sent.")
              }
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors disabled:opacity-50"
            >
              Send a test
            </button>
          )}

          {status.subscribed && (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-300">
              <Check className="h-3.5 w-3.5" />
              This device is subscribed
            </span>
          )}
        </div>
      )}

      {message && (
        <p
          className={`text-[11px] ${message.tone === "ok" ? "text-emerald-300" : "text-rose-300"}`}
          role="status"
        >
          {message.text}
        </p>
      )}

      <p className="text-[11px] text-slate-500 leading-relaxed">
        Alerts fire when outage risk escalates to elevated or higher, when an outage starts, and
        when a recommendation is waiting for approval. Repeats of the same condition are held back
        for 30 minutes.
      </p>
    </div>
  );
}
