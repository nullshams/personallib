
const V = "pdflib-v3"; // bump this to force clients to update
const SHELL = ["./", "index.html", "manifest.webmanifest", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png",
  "vendor/pdf.min.js", "vendor/pdf.worker.min.js"];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(V);
    await Promise.all(SHELL.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== V) await caches.delete(k);
    await clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const url = new URL(r.url);
  const isPage = r.mode === "navigate" ||
    (url.origin === location.origin && (url.pathname.endsWith("/") || url.pathname.endsWith(".html")));

  if (isPage) { // network-first: updates show up immediately, cache only when offline
    e.respondWith((async () => {
      const c = await caches.open(V);
      try {
        const res = await fetch(r.url, { cache: "no-store" });
        if (res.ok) c.put(r, res.clone());
        return res;
      } catch (err) {
        return (await c.match(r)) || (await c.match("index.html")) || Response.error();
      }
    })());
    return;
  }

  e.respondWith((async () => { // everything else: cache-first, refresh in background
    const c = await caches.open(V);
    const hit = await c.match(r);
    const net = fetch(r).then(res => { if (res.ok || res.type === "opaque") c.put(r, res.clone()); return res; });
    if (hit) { net.catch(() => {}); return hit; }
    try { return await net; } catch (err) { return Response.error(); }
  })());
});