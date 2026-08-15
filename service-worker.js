const CACHE = 'photo-slim-v1.1.0';
const SHARE_INBOX = 'photo-slim-share-inbox';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key =>
      (key !== CACHE && key !== SHARE_INBOX) ? caches.delete(key) : null
    )))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.method === 'POST' && /\/share-target\/?$/.test(url.pathname)) {
    event.respondWith((async () => {
      try {
        const formData = await event.request.formData();
        const incoming = [
          ...formData.getAll('images'),
          ...formData.getAll('image'),
          ...formData.getAll('files')
        ].filter(f => f && typeof f === 'object' && f.size);
        const inbox = await caches.open(SHARE_INBOX);
        const old = await inbox.keys();
        await Promise.all(old.map(k => inbox.delete(k)));
        for (let i = 0; i < incoming.length; i++) {
          const f = incoming[i];
          await inbox.put('item-' + i, new Response(f, {
            headers: {
              'Content-Type': f.type || 'application/octet-stream',
              'X-Filename': encodeURIComponent(f.name || ('photo-' + i + '.jpg'))
            }
          }));
        }
        await inbox.put('inbox', new Response(JSON.stringify({ count: incoming.length }), {
          headers: { 'Content-Type': 'application/json' }
        }));
      } catch (_) {}
      return Response.redirect(new URL('./?share=1', url).href, 303);
    })());
    return;
  }

  if (event.request.method !== 'GET') return;

  const isNav = event.request.mode === 'navigate' ||
    event.request.destination === 'document' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('/');

  if (isNav) {
    event.respondWith(
      fetch(event.request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => {});
        return resp;
      }).catch(() => caches.match(event.request).then(c => c || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => {});
      return resp;
    }))
  );
});
