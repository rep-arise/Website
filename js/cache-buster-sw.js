/**
 * Cache Buster Service Worker
 * 
 * This service worker prevents browser caching during development by
 * intercepting all fetch requests and bypassing the browser cache.
 */

// Use a unique cache name with timestamp to force updates
const CACHE_NAME = 'no-cache-' + new Date().getTime();

// Immediately activate this service worker without waiting
self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

// Claim clients immediately
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  
  // Clear any existing caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Intercept all fetch requests
self.addEventListener('fetch', event => {
  // Skip POST requests
  if (event.request.method !== 'GET') return;
  
  // Add cache busting for all GET requests
  event.respondWith(
    fetch(cacheBustRequest(event.request), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    }).catch(error => {
      console.error('Service worker fetch error:', error);
      // Fall back to original request if fetch fails
      return fetch(event.request);
    })
  );
});

// Function to add cache busting parameter to requests
function cacheBustRequest(request) {
  const url = new URL(request.url);
  
  // Don't cache bust chrome-extension:// URLs
  if (url.protocol === 'chrome-extension:') return request;
  
  // Add or update the cache busting parameter
  url.searchParams.set('_sw_cache_bust', Date.now());
  
  // Create a new request with the modified URL
  return new Request(url.href, {
    method: request.method,
    headers: request.headers,
    mode: request.mode,
    credentials: request.credentials,
    redirect: request.redirect,
    referrer: request.referrer,
    integrity: request.integrity
  });
} 