/**
 * Cache Buster Service Worker
 * 
 * This service worker prevents browser caching during development by
 * intercepting all fetch requests and bypassing the browser cache.
 */

// Constants
const CACHE_NAME = `no-cache-${Date.now()}`;
const CACHE_HEADERS = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
};

// Cache management
const cacheManager = {
    clearAll: async () => {
        const cacheNames = await caches.keys();
        return Promise.all(cacheNames.map(name => caches.delete(name)));
    }
};

// Request handling
const requestHandler = {
    shouldCacheBust: request => {
        return request.method === 'GET' && 
               new URL(request.url).protocol !== 'chrome-extension:';
    },

    createCacheBustedRequest: request => {
        const url = new URL(request.url);
        url.searchParams.set('_sw_cache_bust', Date.now());

        return new Request(url.href, {
            method: request.method,
            headers: request.headers,
            mode: request.mode,
            credentials: request.credentials,
            redirect: request.redirect,
            referrer: request.referrer,
            integrity: request.integrity
        });
    },

    handleFetch: async request => {
        if (!requestHandler.shouldCacheBust(request)) {
            return fetch(request);
        }

        try {
            return await fetch(requestHandler.createCacheBustedRequest(request), {
                cache: 'no-store',
                headers: CACHE_HEADERS
            });
        } catch (error) {
            console.error('Service worker fetch error:', error);
            return fetch(request);
        }
    }
};

// Event listeners
self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
    event.waitUntil(Promise.all([
        self.clients.claim(),
        cacheManager.clearAll()
    ]));
});

self.addEventListener('fetch', event => {
    event.respondWith(requestHandler.handleFetch(event.request));
}); 