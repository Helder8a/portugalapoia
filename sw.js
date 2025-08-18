const CACHE_NAME = 'portugalapoia-cache-v4'; // Versión actualizada para forzar la actualización
const urlsToCache = [
  '/',
  '/index.html',
  '/empregos.html',
  '/doacoes.html', // Corregido para que coincida con el enlace del menú
  '/servicos.html', // Corregido para que coincida con el enlace del menú
  '/habitacao.html',
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
        console.log('Cache abierto y actualizado a v4');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Evento de Activación: Limpia cachés antiguos (v1, v2, v3, etc.)
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
    // 3.1 Primero, intentar obtener el recurso de la red
    fetch(event.request)
      .then(networkResponse => {
        // Si la petición a la red tiene éxito...
        return caches.open(CACHE_NAME)
          .then(cache => {
            // ...guardamos una copia de la respuesta nueva en la caché
            cache.put(event.request, networkResponse.clone());
            // Y devolvemos la respuesta de la red (la más actualizada)
            return networkResponse;
          });
      })
      .catch(() => {
        // 3.2 Si la petición a la red falla (ej. sin conexión)...
        // ...intentamos obtener la respuesta desde la caché.
        return caches.match(event.request);
      })
  );
});