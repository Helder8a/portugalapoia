const CACHE_NAME = 'portugalapoia-cache-v9'; // Versión actualizada para forzar la actualización
const urlsToCache = [
  '/',
  '/index.html',
  '/empregos.html',
  '/doações.html',   // CORREGIDO
  '/serviços.html',   // CORREGIDO
  '/habitação.html',
  '/offline.html',
  '/style.css',
  '/script.js',
  '/images_pta/logocuadrado.jpg'
];

// 1. Evento de Instalación: Se guarda el "App Shell" en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto y actualizado a v9');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Evento de Activación: Limpia cachés antiguos (v1 a v8)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Limpiando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Evento Fetch: Estrategia "Network-First" (Primero la Red)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        return caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});