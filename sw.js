const CACHE = 'rg-timer-v0-3';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './routines.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => self.clients.claim());

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  if (url.pathname.endsWith('/routines.json')) {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
