/**
 * MediCare HMS - Resilient Offline Service Worker
 * Provides zero-latency caching, offline resilience, and emergency mesh support.
 */

const CACHE_NAME = 'medicare-hms-core-v2.1';
const STATIC_ASSETS = [
    './',
    './index.html',
    './dashboard.html',
    './emergency.html',
    './telemedicine.html',
    './blood-bank.html',
    './patients.html',
    './doctors.html',
    './appointments.html',
    './prescriptions.html',
    './laboratory.html',
    './pharmacy.html',
    './billing.html',
    './admin.html',
    './patient-portal.html',
    './slides.html',
    './css/style.css',
    './js/app.js',
    './js/react-components.bundle.js',
    './manifest.json'
];

// Install: Cache critical core static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch((err) => {
                console.warn('[MediCare SW] Static asset pre-caching warning:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// Activate: Prune outdated legacy caches
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

// Fetch: Stale-While-Revalidate with robust offline fallback and query param resilience
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Ignore non-GET or chrome-extension schemes
    if (request.method !== 'GET' || !request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cachedResponse = await cache.match(request, { ignoreSearch: true });

            if (cachedResponse) {
                // Background revalidation
                fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        cache.put(request, networkResponse.clone());
                    }
                }).catch(() => {});
                return cachedResponse;
            }

            try {
                const networkResponse = await fetch(request);
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    cache.put(request, networkResponse.clone());
                }
                return networkResponse;
            } catch (err) {
                // Offline HTML navigation fallback
                if (request.mode === 'navigate' || (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
                    const fallback = await cache.match('./dashboard.html', { ignoreSearch: true }) || await cache.match('./index.html', { ignoreSearch: true });
                    if (fallback) return fallback;
                }
                throw err;
            }
        })
    );
});
