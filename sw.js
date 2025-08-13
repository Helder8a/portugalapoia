const CACHE_NAME = 'portugalapoia-cache-v2'; // Incrementé la versión para forzar la actualización
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
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

// Evento de instalación: guarda los archivos en el caché
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto y archivos principales guardados');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento de activación: limpia cachés antiguos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando caché antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Evento de fetch: responde desde el caché para habilitar el modo offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});