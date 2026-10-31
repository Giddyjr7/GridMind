"use client";

import * as React from "react";
import { registerServiceWorker } from "@/lib/push-notifications";

/**
 * Registers the service worker once per session. Rendered from the root layout
 * so the app is installable and can receive push on every route, not only the
 * ones that happen to show notification controls.
 */
export function ServiceWorkerRegistrar() {
  React.useEffect(() => {
    void registerServiceWorker().catch(() => {
      // A failed registration costs installability and push, not the app, so it
      // must never surface as an error boundary.
    });
  }, []);

  return null;
}
