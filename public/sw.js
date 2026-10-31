/*
 * GridMind service worker.
 *
 * Two jobs: keep the app usable when the network drops, and receive Web Push so
 * an outage-risk escalation reaches an operator whose tab is closed.
 *
 * Caching is deliberately conservative. Navigations are network-first with an
 * offline fallback, and build assets are never precached, so a new deploy (or a
 * dev-server restart) can never be shadowed by a stale bundle.
 */

const VERSION = "v1";
const SHELL_CACHE = `gridmind-shell-${VERSION}`;
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll([OFFLINE_URL, "/icons/icon-192.png"]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== SHELL_CACHE).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only page navigations are handled. Everything else (API calls, HMR sockets,
  // build chunks) goes straight to the network untouched.
  if (request.method !== "GET" || request.mode !== "navigate") return;

  event.respondWith(
    fetch(request).catch(async () => {
      const cache = await caches.open(SHELL_CACHE);
      return (await cache.match(OFFLINE_URL)) ?? Response.error();
    })
  );
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { title: "GridMind", body: event.data ? event.data.text() : "" };
  }

  const title = payload.title || "GridMind";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.body || "",
      // A tag collapses repeats of the same condition instead of stacking them.
      tag: payload.tag || "gridmind",
      renotify: Boolean(payload.tag),
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: payload.url || "/dashboard" },
      requireInteraction: Boolean(payload.requireInteraction),
      timestamp: Date.now(),
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/dashboard", self.location.origin);

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      // Focus an open GridMind window and route it, rather than opening a duplicate.
      for (const client of windows) {
        if (new URL(client.url).origin === target.origin) {
          await client.focus();
          if ("navigate" in client) await client.navigate(target.href);
          return;
        }
      }
      await self.clients.openWindow(target.href);
    })()
  );
});
