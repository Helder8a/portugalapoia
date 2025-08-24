// sw.js

const STATIC_CACHE_NAME = 'site-static-v1'; // Para el App Shell (CSS, JS, HTML base)
const DYNAMIC_CACHE_NAME = 'site-dynamic-v1'; // Para datos y imágenes cargados por el usuario

// Lista de archivos del "App Shell" que siempre se guardarán
const APP_SHELL_ASSETS = [
    '/',
    '/index.html',
    '/empregos.html',
    '/habitacao.html',
    '/blog.html',
    '/sobre-nos.html',
    '/style.css',
    '/js/main.js', // ¡Importante! Usa la nueva ruta de tu JS modularizado
    '/js/api.js',
    '/js/ui.js',
    '/images_pta/logocuadrado.jpg',
    '/offline.html' // La página de fallback
];

// Evento 'install': Se dispara cuando el Service Worker se instala
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(STATIC_CACHE_NAME).then(cache => {
            console.log('Precargando el App Shell en caché');
            return cache.addAll(APP_SHELL_ASSETS);
        })
    );
});

// Evento 'activate': Limpia cachés antiguas
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME)
                .map(key => caches.delete(key))
            );
        })
    );
});

// sw.js (continuación)

// Evento 'fetch': Se dispara cada vez que la app pide un recurso
self.addEventListener('fetch', evt => {
    // Para los archivos JSON de datos (estrategia: Network First)
    if (evt.request.url.includes('/_dados/')) {
        evt.respondWith(
            caches.open(DYNAMIC_CACHE_NAME).then(cache => {
                // 1. Intenta obtener la versión más nueva de la red
                return fetch(evt.request).then(fetchRes => {
                    // Si funciona, guarda una copia en la caché dinámica y la devuelve
                    cache.put(evt.request.url, fetchRes.clone());
                    return fetchRes;
                }).catch(() => {
                    // 2. Si la red falla, busca en la caché
                    return cache.match(evt.request);
                });
            })
        );
        return; // Detiene la ejecución aquí para las peticiones de datos
    }

    // Estrategia: Cache First (para todo lo demás)
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            // 1. Devuelve desde la caché si existe
            return cacheRes || fetch(evt.request).then(fetchRes => {
                // 2. Si no está en caché, ve a la red
                return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
                    // Guarda la nueva respuesta en la caché dinámica para la próxima vez
                    cache.put(evt.request.url, fetchRes.clone());
                    return fetchRes;
                });
            });
        }).catch(() => {
            // Si todo falla (offline y no está en caché), muestra la página offline
            // Solo para peticiones de navegación HTML
            if (evt.request.mode === 'navigate') {
                return caches.match('/offline.html');
            }
        })
    );
});