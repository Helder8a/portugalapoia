// --- CÓDIGO CORREGIDO PARA sw.js ---
const CACHE_NAME = 'portugalapoia-cache-v9'; // <-- Incrementa la versión

const urlsToCache = [
    '/',
    '/index.html',
    '/style.css?v=9', // <-- AÑADE EL NÚMERO DE VERSIÓN AQUÍ
    '/avaliador-urbano-style.css',
    '/script.js',
    '/manifest.json',
    '/images_pta/logofavicon.ico', // Corregido para que coincida con tu HTML
    '/images/img_portada.webp',
    '/.html',
    '/empregos.html',
    '/servicos.html',
    '/habitacao.html',
    '/blog.html',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css', // Corregido a la versión que usas
    'offline.html'
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