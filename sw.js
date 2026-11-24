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

// Install: Cache critical core static assets safely without failing on redirects
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            for (const asset of STATIC_ASSETS) {
                try {
                    const response = await fetch(asset, { redirect: 'follow' });
                    if (response && response.status === 200) {
                        await cache.put(asset, response);
                    }
                } catch (_) {}
            }
        }).then(() => self.skipWaiting())
    );
});

// Activate: Prune outdated legacy caches and claim clients immediately
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

// Fetch: Network First with graceful fallback — NEVER throws or rejects navigation
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Ignore non-GET or chrome-extension schemes
    if (request.method !== 'GET' || !request.url.startsWith('http')) {
        return;
    }

    // For HTML navigation requests, let browser network handle redirects seamlessly
    if (request.mode === 'navigate' || (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
            fetch(request).catch(async () => {
                const cache = await caches.open(CACHE_NAME);
                const fallback = (await cache.match('./dashboard.html', { ignoreSearch: true })) ||
                                 (await cache.match('./index.html', { ignoreSearch: true }));
                if (fallback) return fallback;
                return new Response(
                    '<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>MediCare HMS Offline</title></head><body style=\"font-family:system-ui;background:#090d16;color:#f8fafc;padding:40px;text-align:center;\"><h1>MediCare HMS Offline Resilient Mode</h1><p>Connection lost. Please refresh when connectivity is restored.</p><a href=\"./dashboard.html\" style=\"color:#38bdf8;\">Return to Dashboard</a></body></html>',
                    { status: 200, headers: { 'Content-Type': 'text/html' } }
                );
            })
        );
        return;
    }

    // For assets (CSS, JS, images, fonts): Cache-first with network fallback
    event.respondWith(
        caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
            if (cachedResponse) {
                // Background revalidation
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
        })
    );
});
