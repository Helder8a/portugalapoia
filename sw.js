// Define un nombre y versión para el caché
const CACHE_NAME = 'portugalapoia-cache-v3'; // Incrementamos la versión
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
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
            .catch(() => {
                return caches.open(CACHE_NAME)
                    .then(cache => {
                        return cache.match(OFFLINE_URL);
                    });
            })
        );
    } else {
        event.respondWith(
            caches.open(CACHE_NAME)
            .then(cache => {
                return cache.match(event.request)
                    .then(response => {
                        return response || fetch(event.request);
                    });
            })
        );
    }
});

// --- BASE PARA NOTIFICACIONES PUSH Y SINCRONIZACIÓN ---

// Evento 'push': se dispara cuando se recibe una notificación push desde un servidor.
self.addEventListener('push', event => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: 'images/favicon.ico.png',
        badge: 'images/favicon.ico.png'
    };
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Evento 'sync': para la Sincronización en Segundo Plano.
self.addEventListener('sync', event => {
    if (event.tag === 'sync-example') {
        console.log('Sincronización en segundo plano ejecutada!');
        // Aquí iría la lógica para sincronizar datos
    }
});