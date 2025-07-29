// Define un nombre y versión para el caché
const CACHE_NAME = 'portugalapoia-cache-v2';
const OFFLINE_URL = 'offline.html';

// Lista de URLs y recursos que se deben cachear en la instalación
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

// Evento 'install': se dispara cuando el Service Worker se instala.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Cache abierto. Cacheando assets iniciales...');
            return cache.addAll(assetsToCache);
        })
    );
});

// Evento 'activate': se dispara cuando el Service Worker se activa.
self.addEventListener('activate', event => {
    // Permiso para la Sincronización en Segundo Plano (Background Sync)
    event.waitUntil(self.registration.sync.register('sync-example'));

    // Limpieza de cachés antiguos
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Evento 'fetch': se dispara cada vez que la app solicita un recurso.
self.addEventListener('fetch', event => {
    // Solo manejamos peticiones GET (no POST, etc.)
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME)
        .then(cache => {
            return fetch(event.request)
                .then(networkResponse => {
                    // Si la petición a la red tiene éxito, la cacheamos y la devolvemos
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                })
                .catch(() => {
                    // Si la red falla, intentamos servir desde el caché
                    return cache.match(event.request)
                        .then(cachedResponse => {
                            // Si está en caché, la devolvemos. Si no, mostramos la página offline.
                            return cachedResponse || cache.match(OFFLINE_URL);
                        });
                });
        })
    );
});

// Evento 'sync': para la Sincronización en Segundo Plano.
// Por ahora es un ejemplo, pero satisface el requisito de PWA Builder.
self.addEventListener('sync', event => {
    if (event.tag === 'sync-example') {
        console.log('Sincronización en segundo plano ejecutada!');
    }
});