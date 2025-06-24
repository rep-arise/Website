/**
 * CRITICAL CACHE BUSTER - Prevents browser caching during development
 * 
 * This script implements an aggressive cache-busting strategy to ensure
 * that all resources (CSS, JS, images) are always loaded fresh during development.
 */

(() => {
    // Constants
    const CONFIG = {
        refreshInterval: 2000,
        swUpdateInterval: 5000,
        devHosts: ['localhost', '127.0.0.1', '.local', ''],
        swPath: '/js/cache-buster-sw.js',
        cacheHeaders: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    };

    // DOM helper functions
    const dom = {
        $: selector => document.querySelector(selector),
        $$ : selector => document.querySelectorAll(selector),
        createElement: (tag, attrs = {}) => {
            const el = document.createElement(tag);
            Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
            return el;
        },
        addStyles: (el, styles) => Object.assign(el.style, styles)
    };

    // Cache busting functionality
    const cacheBuster = {
        init() {
            if (!this.isDevelopment()) return;
            
            console.log('[CACHE BUSTER] Initializing aggressive cache prevention');
            this.addMetaTags();
            this.initServiceWorker();
            this.addTimestampToResources();
            this.initCssReloader();
            this.initDevTools();
            this.overrideNetworkRequests();
            this.initPeriodicRefresh();
            
            console.log('[CACHE BUSTER] Initialization complete - all caching disabled');
        },

        isDevelopment() {
            // GitHub Pages uses rep-arise.github.io domain, which should be treated as production
            if (window.location.hostname === 'rep-arise.github.io') {
                return false;
            }
            return CONFIG.devHosts.some(host => 
                window.location.hostname === host || 
                window.location.hostname.includes(host)
            );
        },

        addMetaTags() {
            ['Cache-Control', 'Expires', 'Pragma'].forEach(type => {
                const content = type === 'Expires' ? '0' : CONFIG.cacheHeaders[type];
                document.head.appendChild(
                    dom.createElement('meta', {
                        'http-equiv': type,
                        content: content
                    })
                );
            });
        },

        async initServiceWorker() {
            if (!('serviceWorker' in navigator)) return;

            try {
                // Get the base path for the site - important for GitHub Pages
                const basePath = window.location.pathname.replace(/\/[^\/]*$/, '/');
                
                // Adjust the service worker path and scope based on deployment environment
                const swPath = window.location.hostname === 'rep-arise.github.io' 
                    ? '/cache-buster-sw.js'  // Use root path for GitHub Pages
                    : '/cache-buster-sw.js'; // Use root path for local development too
                
                const registration = await navigator.serviceWorker.register(swPath, { 
                    scope: '/' // Always use root scope
                });
                
                console.log('[CACHE BUSTER] Service Worker registered with scope:', registration.scope);
                
                registration.update();
                setInterval(() => registration.update(), CONFIG.swUpdateInterval);
            } catch (error) {
                console.error('[CACHE BUSTER] Service Worker registration failed:', error);
            }
        },

        addTimestampToResources() {
            const timestamp = Date.now();
            const addTimestamp = (el, attr) => {
                const original = el.getAttribute(attr).split('?')[0];
                el.setAttribute(attr, `${original}?v=${timestamp}`);
            };

            dom.$$('link[rel="stylesheet"]').forEach(el => addTimestamp(el, 'href'));
            dom.$$('script[src]').forEach(el => addTimestamp(el, 'src'));
            dom.$$('img[src]').forEach(el => addTimestamp(el, 'src'));

            console.log('[CACHE BUSTER] All resources refreshed with timestamp:', timestamp);
        },

        initCssReloader() {
            const style = dom.createElement('style', { id: 'cache-buster-style' });
            this.updateCssTimestamp(style);
            document.head.appendChild(style);
        },

        updateCssTimestamp(style) {
            style.textContent = `
                /* Force CSS reload by changing this comment on each refresh */
                /* Timestamp: ${Date.now()} */
            `;
        },

        initDevTools() {
            if (!this.isDevelopment()) return; // Only show in development
            // Dev mode indicator
            const indicator = dom.createElement('div');
            dom.addStyles(indicator, {
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                background: 'rgba(255, 0, 0, 0.8)',
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '3px',
                fontSize: '12px',
                fontWeight: 'bold',
                zIndex: '9999',
                fontFamily: 'monospace',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)'
            });
            indicator.textContent = 'DEV MODE - CACHE DISABLED';
            document.body.appendChild(indicator);

            // Refresh button
            const button = dom.createElement('button');
            dom.addStyles(button, {
                position: 'fixed',
                bottom: '10px',
                right: '170px',
                background: 'rgba(0, 0, 255, 0.8)',
                color: '#fff',
                padding: '5px 10px',
                border: 'none',
                borderRadius: '3px',
                fontSize: '12px',
                fontWeight: 'bold',
                zIndex: '9999',
                fontFamily: 'monospace',
                cursor: 'pointer',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)'
            });
            button.textContent = 'FORCE REFRESH';
            button.addEventListener('click', () => {
                this.addTimestampToResources();
                alert('Resources refreshed! If changes are still not visible, try a hard refresh (Ctrl+F5)');
            });
            document.body.appendChild(button);
        },

        overrideNetworkRequests() {
            // Override fetch
            const originalFetch = window.fetch;
            window.fetch = function() {
                const [url, options = {}] = arguments;
                
                if (typeof url === 'string') {
                    const separator = url.includes('?') ? '&' : '?';
                    arguments[0] = `${url}${separator}_=${Date.now()}`;
                }
                
                options.headers = { ...options.headers, ...CONFIG.cacheHeaders };
                return originalFetch.apply(this, arguments);
            };

            // Override XMLHttpRequest
            const originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function() {
                const url = arguments[1];
                if (typeof url === 'string') {
                    const separator = url.includes('?') ? '&' : '?';
                    arguments[1] = `${url}${separator}_=${Date.now()}`;
                }
                return originalOpen.apply(this, arguments);
            };
        },

        initPeriodicRefresh() {
            let intervalId = setInterval(() => {
                this.addTimestampToResources();
                this.updateCssTimestamp(dom.$('#cache-buster-style'));
            }, CONFIG.refreshInterval);

            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    clearInterval(intervalId);
                } else {
                    this.addTimestampToResources();
                    intervalId = setInterval(() => this.addTimestampToResources(), CONFIG.refreshInterval);
                }
            });

            // Expose global utility for manual refresh
            window.forceCacheBust = () => {
                this.addTimestampToResources();
                console.log('[CACHE BUSTER] Manual refresh triggered');
                return 'Resources refreshed! If changes are still not visible, try a hard refresh (Ctrl+F5)';
            };
        }
    };

    // Initialize cache buster
    const init = () => cacheBuster.init();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})(); 