"use client";

import * as React from "react";
import { siteService, type SiteRegistration } from "@/services/site-service";

/**
 * The registered site as the backend knows it.
 *
 * Browser state and the backend can disagree — a different browser, cleared
 * storage, or a registration made elsewhere — and when they do the backend is
 * right. Screens that name the business should prefer this and fall back to
 * local workspace state only while it is loading or unreachable.
 */
export function useRegisteredSite() {
  const [registration, setRegistration] = React.useState<SiteRegistration | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    void siteService
      .getRegistration()
      .then((result) => {
        if (!cancelled) setRegistration(result.isProvisioned ? result : null);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { registration, loading };
}
