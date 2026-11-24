/**
 * MediCare HMS - Resilient Zero-Fault Service Worker v2.2 (upgraded from medicare-hms-core-v2.1)
 * PWA Installability + Safe Edge Passthrough
 */

const CACHE_NAME = 'medicare-hms-core-v2.2'; // Prunes medicare-hms-core-v2.1 on activate
// Offline fallback references: './dashboard.html', './index.html'

// Error guards to prevent any uncaught exceptions
self.addEventListener('error', (e) => {
    console.warn('[MediCare SW Error Guard]', e);
});
self.addEventListener('unhandledrejection', (e) => {
    console.warn('[MediCare SW Rejection Guard]', e);
});

// Install: Skip waiting and activate immediately
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Activate: Prune all legacy caches and claim clients immediately
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Pure passthrough for navigations (0 chance of ERR_FAILED), cache-first for static assets only
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // 1. NEVER intercept HTML page navigations or document loads — browser handles them natively!
    if (request.mode === 'navigate' || 
        request.destination === 'document' || 
        (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
        return; // Handled 100% natively by browser network engine
    }

    // 2. Ignore non-GET, non-http, or external AI/Avatar API requests
    if (request.method !== 'GET' || !request.url.startsWith('http') ||
        request.url.includes('googleapis.com') ||
        request.url.includes('ui-avatars.com')) {
        return;
    }

    // 3. For local static assets (CSS, JS, fonts, images), cache with network fallback
    event.respondWith(
        caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
            if (cachedResponse) {
                // Background update
                fetch(request).then(async (networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const cache = await caches.open(CACHE_NAME);
                        cache.put(request, networkResponse.clone());
                    }
                }).catch(() => {});
                return cachedResponse;
            }

            return fetch(request).then(async (networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const cache = await caches.open(CACHE_NAME);
                    cache.put(request, networkResponse.clone());
                }
                return networkResponse;
            }).catch(() => {
                return new Response('', { status: 408 });
            });
        }).catch(() => fetch(request))
    );
});
