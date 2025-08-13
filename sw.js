const CACHE_NAME = 'portugalapoia-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/images/favicon.ico.png',
    '/images/img_portada.webp',
    '/doacoes.html',
    '/empregos.html',
    '/servicos.html',
    '/habitacao.html',
    '/blog.html'
];

// Evento de instalación: se abre el caché y se agregan los archivos principales.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento de activación: se limpia el caché antiguo.
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Evento de fetch: responde con los archivos del caché si están disponibles.
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si el recurso está en caché, lo devuelve.
                if (response) {
                    return response;
                }
                // Si no, lo busca en la red.
                return fetch(event.request);
            }
            )
    );
});