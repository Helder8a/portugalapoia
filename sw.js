// Versión del caché. CAMBIAR ESTE NÚMERO FUERZA LA ACTUALIZACIÓN.
const CACHE_NAME = 'portugalapoia-cache-v10'; // Versión incrementada para forzar la actualización

// Lista de archivos esenciales para que la app funcione offline.
const assetsToCache = [
    '/',
    'index.html',
    'doacoes.html',
    'empregos.html',
    'habitacao.html',
    'servicos.html',
    'publicar.html',
    'blog.html',
    'politica-privacidade.html',
    'offline.html',
    'style.css',
    'script.js',
    'manifest.json',
    'images/favicon.ico.png',
    'images/img_portada.webp',
    'images_donacao/sillarueda.jpg',
    'images_donacao/ropabebe.webp'
];

// Evento 'install': Cachear los assets iniciales.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cacheando assets iniciales...');
                return cache.addAll(assetsToCache);
            })
    );
    self.skipWaiting();
});

// Evento 'activate': Limpiar cachés antiguos.
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Limpiando caché antiguo:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Evento 'fetch': Decidir cómo responder a las peticiones (NUEVA ESTRATEGIA).
self.addEventListener('fetch', event => {
    // Para las páginas de navegación (HTML)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                // 1. Intenta obtener la página de la red primero (Stale-While-Revalidate)
                return fetch(event.request).then(networkResponse => {
                    // Si la obtiene, la guarda en caché para la próxima vez
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                }).catch(() => {
                    // 2. Si la red falla, busca la página en el caché
                    return cache.match(event.request).then(cachedResponse => {
                        // Si está en caché, la devuelve. Si no, devuelve la página offline.
                        return cachedResponse || caches.match('offline.html');
                    });
                });
            })
        );
        return;
    }

    // Para otros recursos (CSS, JS, imágenes), mantenemos la estrategia "Cache First"
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request).then(fetchResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
    );
});