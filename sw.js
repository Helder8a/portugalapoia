const CACHE_NAME = 'portugalapoia-cache-v5'; // Nueva versión para forzar actualización
const OFFLINE_URL = 'offline.html';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/avaliador-urbano-style.css',
    '/script.js',
    '/manifest.json',
    '/images/favicon.ico.png',
    '/images/img_portada.webp',
    '/doacoes.html',
    '/empregos.html',
    '/servicos.html',
    '/habitacao.html',
    '/blog.html',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
    OFFLINE_URL // Asegúrate de que la página offline también esté en caché
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto y archivos principales guardados');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    // Solo manejamos peticiones GET (navegación)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    // Primero, intenta ir a la red
                    const networkResponse = await fetch(event.request);
                    return networkResponse;
                } catch (error) {
                    // Si falla, busca en el caché
                    console.log('Fetch fallido; devolviendo del caché o página offline.');
                    const cache = await caches.open(CACHE_NAME);
                    const cachedResponse = await cache.match(event.request);
                    // Si está en caché, la devuelve. Si no, devuelve la página offline.
                    return cachedResponse || await cache.match(OFFLINE_URL);
                }
            })()
        );
    } else {
        // Para otros recursos (CSS, JS, imágenes), usa la estrategia "cache-first"
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request);
                })
        );
    }
});