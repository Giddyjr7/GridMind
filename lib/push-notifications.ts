import { envConfig } from "@/config/env";

export type PushSupport =
  | "supported"
  | "unsupported_browser"
  | "insecure_context"
  | "not_configured"
  | "service_worker_blocked";

export interface PushStatus {
  support: PushSupport;
  permission: NotificationPermission;
  subscribed: boolean;
}

/**
 * Service workers and the Push API need a secure context. localhost counts as
 * secure, so development works without TLS, but a LAN IP over plain HTTP does
 * not and should say so rather than failing silently.
 */
export function detectPushSupport(): PushSupport {
  if (typeof window === "undefined") return "unsupported_browser";
  if (!window.isSecureContext) return "insecure_context";
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
    return "unsupported_browser";
  }
  if (!envConfig.vapidPublicKey) return "not_configured";
  return "supported";
}

/** The VAPID key travels as base64url; PushManager wants raw bytes. */
function decodeVapidKey(base64Url: string): Uint8Array {
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (detectPushSupport() === "unsupported_browser") return null;
  if (!("serviceWorker" in navigator)) return null;
  return navigator.serviceWorker.register("/sw.js", { scope: "/" });
}

const ACTIVATION_TIMEOUT_MS = 8000;

/**
 * Resolves the active registration, registering it on demand. Incognito windows
 * and locked-down enterprise policies can refuse a service worker, and
 * `serviceWorker.ready` simply never settles in that case, so it is raced
 * against a timeout rather than left to hang the caller forever.
 */
async function activeRegistration(): Promise<ServiceWorkerRegistration | null> {
  try {
    const existing = await navigator.serviceWorker.getRegistration();
    if (!existing) await registerServiceWorker();
  } catch {
    return null;
  }

  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<null>((resolve) => window.setTimeout(() => resolve(null), ACTIVATION_TIMEOUT_MS)),
  ]);
}

function unavailable(support: PushSupport): PushStatus {
  return {
    support,
    permission: typeof Notification === "undefined" ? "default" : Notification.permission,
    subscribed: false,
  };
}

export async function getPushStatus(): Promise<PushStatus> {
  const support = detectPushSupport();
  if (support !== "supported") return unavailable(support);

  const registration = await activeRegistration();
  if (!registration) return unavailable("service_worker_blocked");

  const subscription = await registration.pushManager.getSubscription();
  return { support, permission: Notification.permission, subscribed: Boolean(subscription) };
}

/**
 * Asks for permission, creates the push subscription and registers it with the
 * API. Returns the resulting status so the caller does not have to re-query.
 */
export async function enablePushNotifications(): Promise<PushStatus> {
  const support = detectPushSupport();
  if (support !== "supported") return unavailable(support);

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { support, permission, subscribed: false };
  }

  const registration = await activeRegistration();
  if (!registration) return unavailable("service_worker_blocked");

  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: decodeVapidKey(envConfig.vapidPublicKey) as BufferSource,
    }));

  const raw = subscription.toJSON();
  if (!raw.keys?.p256dh || !raw.keys?.auth) {
    throw new Error("The browser returned a push subscription without encryption keys.");
  }

  // Only the fields the API declares are sent: it rejects unknown properties,
  // and the browser's toJSON() also includes expirationTime.
  const response = await fetch(`${envConfig.apiBaseUrl}/notifications/subscribe`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      keys: { p256dh: raw.keys.p256dh, auth: raw.keys.auth },
      userAgent: navigator.userAgent.slice(0, 256),
    }),
  });

  if (!response.ok) {
    await subscription.unsubscribe();
    throw new Error("The API rejected this push subscription.");
  }

  return { support, permission, subscribed: true };
}

export async function disablePushNotifications(): Promise<PushStatus> {
  const support = detectPushSupport();
  if (support !== "supported") return unavailable(support);

  const registration = await activeRegistration();
  if (!registration) return unavailable("service_worker_blocked");

  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    // Tell the API first: if the browser unsubscribes and the call then fails,
    // the endpoint is orphaned server-side until a delivery prunes it.
    await fetch(`${envConfig.apiBaseUrl}/notifications/unsubscribe`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    }).catch(() => undefined);
    await subscription.unsubscribe();
  }

  return { support, permission: Notification.permission, subscribed: false };
}

export async function sendTestNotification(): Promise<{ sent: number; skipped: boolean }> {
  const response = await fetch(`${envConfig.apiBaseUrl}/notifications/test`, { method: "POST" });
  if (!response.ok) throw new Error("The API could not send a test notification.");
  return response.json();
}
