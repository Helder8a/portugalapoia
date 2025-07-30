// Define un nombre y versión para el caché
const CACHE_NAME = 'portugalapoia-cache-v1';

// Lista de URLs y recursos que se deben cachear en la instalación
// Se cachearán las páginas principales y los recursos estáticos críticos.
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
    'images/img_portada.webp'
];

// Evento 'install': se dispara cuando el Service Worker se instala.
// Aquí abrimos el caché y guardamos nuestros assets.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Cache abierto. Cacheando assets iniciales...');
            return cache.addAll(assetsToCache);
        })
        .catch(err => {
            console.error('Fallo al cachear assets:', err);
        })
    );
});

// Evento 'activate': se dispara cuando el Service Worker se activa.
// Aquí limpiamos cachés antiguos para evitar conflictos.
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
        })
    );
});

// Evento 'fetch': se dispara cada vez que la app solicita un recurso (página, imagen, etc.).
// Estrategia "Network First": intentar obtener de la red, si falla, usar el caché.
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
        .then(networkResponse => {
            // Si la petición a la red tiene éxito, la cacheamos y la devolvemos
            return caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
            });
        })
        .catch(() => {
            // Si la red falla, intentamos servir desde el caché
            console.log('Red no disponible. Sirviendo desde caché para:', event.request.url);
            return caches.match(event.request);
        })
    );
});