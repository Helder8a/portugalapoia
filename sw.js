// Define un nombre y versión para el caché
const CACHE_NAME = 'portugalapoia-cache-v6'; // <-- VERSIÓN ACTUALIZADA

// Lista de URLs y recursos que se deben cachear en la instalación.
const assetsToCache = [
    '/',
    'index.html',
    'doacoes.html',
    'empregos.html',
    'habitacao.html',
    'servicos.html',
    'publicar.html',
    'blog.html',
    'painel_de_controlo.html',
    'offline.html',
    'style.css',
    'script.js',
    'manifest.json',
    'images/favicon.ico.png',
    'images/img_portada.webp'
];

// Evento 'install': se dispara cuando el Service Worker se instala.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Cache abierto. Cacheando assets iniciales...');
            // addAll() es atómico: si un archivo falla, toda la operación falla.
            return cache.addAll(assetsToCache);
        })
        .catch(err => {
            console.error('Fallo al cachear assets:', err);
        })
    );
    self.skipWaiting();
});

// Evento 'activate': se dispara cuando el Service Worker se activa.
// Limpia cachés antiguos.
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

// Evento 'fetch': Intercepta las peticiones de red.
self.addEventListener('fetch', event => {
    // Solo aplicar la estrategia para peticiones de navegación
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                // Si la red falla, devuelve la página offline desde la caché
                return caches.match('offline.html');
            })
        );
    } else {
        // Para otros recursos (CSS, JS, imágenes), usar estrategia "Cache First"
        event.respondWith(
            caches.match(event.request).then(response => {
                return response || fetch(event.request).then(fetchResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            }).catch(() => {
                // Opcional: Si una imagen falla, puedes devolver una de reemplazo
            })
        );
    }
});