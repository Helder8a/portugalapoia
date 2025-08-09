// Versión del caché. CAMBIAR ESTE NÚMERO FUERZA LA ACTUALIZACIÓN.
const CACHE_NAME = 'portugalapoia-cache-v8';

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
    'images/img_portada.webp'
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

// Evento 'fetch': Decidir cómo responder a las peticiones.
self.addEventListener('fetch', event => {
    // Estrategia: Network First para las páginas HTML.
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
            .catch(() => caches.match('offline.html')) // Si falla la red, mostrar página offline.
        );
        return;
    }

    // Estrategia: Cache First para otros recursos (CSS, JS, imágenes).
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // Si está en caché, lo devuelve. Si no, va a la red.
            return response || fetch(event.request).then(fetchResponse => {
                // Y guarda la nueva respuesta en el caché para la próxima vez.
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        })
    );
});