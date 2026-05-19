const CACHE_NAME = 'admin-pwa-v1';
const ASSETS = [
  'admin.html',
  'admin.webmanifest',
  'admin-icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          if(event.request.method === 'GET') cache.put(event.request, fetchRes.clone());
          return fetchRes;
        });
      });
    }).catch(() => caches.match('admin.html'))
  );
});
