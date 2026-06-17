const CACHE = 'sport-tv-v1';
const PRECACHE = [
  'rivestream-sport.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'https://cdn.jsdelivr.net/npm/hls.js@latest'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', e => {
  // Network-first for streams, cache-first for static assets
  if (e.request.url.includes('.m3u8') || e.request.url.includes('.ts') || e.request.url.includes('proxy.valhallastream')) {
    return; // Don't cache video streams
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
