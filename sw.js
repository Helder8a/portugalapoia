// Definimos un nombre de caché y la página offline
const CACHE_NAME = 'portugalapoia-v4-final'; // Nueva versión para forzar actualización
const OFFLINE_URL = 'offline.html';

// Lista de archivos a cachear
const assetsToCache = [
  '/',
  'index.html',
  'doacoes.html',
  'empregos.html',
  'habitacao.html',
  'servicos.html',
  'publicar.html',
  'style.css',
  'script.js',
  'images/favicon.ico.png',
  'images/img_portada.webp',
  OFFLINE_URL
];

// Evento 'install': Guarda los archivos en el caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

// Evento 'activate': Limpia los cachés antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Evento 'fetch': Responde a las peticiones
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // Si falla la conexión, muestra la página offline
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

// Evento 'sync': Para la sincronización en segundo plano (soluciona el punto de acción)
self.addEventListener('sync', (event) => {
  if (event.tag === 'content-sync') {
    console.log('Background sync para contenido ejecutada.');
  }
});