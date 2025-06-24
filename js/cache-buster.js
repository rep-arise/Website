/**
 * CRITICAL CACHE BUSTER - Prevents browser caching during development
 * 
 * This script implements an aggressive cache-busting strategy to ensure
 * that all resources (CSS, JS, images) are always loaded fresh during development.
 */

(function() {
    // Force immediate execution before anything else loads
    document.addEventListener('DOMContentLoaded', initCacheBuster, { once: true });
    
    // Also run immediately in case DOM is already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCacheBuster, { once: true });
    } else {
        initCacheBuster();
    }
    
    function initCacheBuster() {
        // Only run in development environments
        const isDevelopment = window.location.hostname === 'localhost' || 
                             window.location.hostname === '127.0.0.1' ||
                             window.location.hostname.includes('.local') ||
                             window.location.hostname === '';
        
        if (!isDevelopment) return;
        
        console.log('[CACHE BUSTER] Initializing aggressive cache prevention');
        
        // Disable browser cache completely via meta tags
        const metaCache = document.createElement('meta');
        metaCache.setAttribute('http-equiv', 'Cache-Control');
        metaCache.setAttribute('content', 'no-cache, no-store, must-revalidate');
        document.head.appendChild(metaCache);
        
        const metaExpires = document.createElement('meta');
        metaExpires.setAttribute('http-equiv', 'Expires');
        metaExpires.setAttribute('content', '0');
        document.head.appendChild(metaExpires);
        
        const metaPragma = document.createElement('meta');
        metaPragma.setAttribute('http-equiv', 'Pragma');
        metaPragma.setAttribute('content', 'no-cache');
        document.head.appendChild(metaPragma);
        
        // Register service worker for aggressive cache busting
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/js/cache-buster-sw.js', { scope: '/' })
                .then(registration => {
                    console.log('[CACHE BUSTER] Service Worker registered with scope:', registration.scope);
                    
                    // Force update the service worker
                    registration.update();
                    
                    // Check for updates every 5 seconds
                    setInterval(() => registration.update(), 5000);
                })
                .catch(error => {
                    console.error('[CACHE BUSTER] Service Worker registration failed:', error);
                });
        }
        
        // Add timestamp to all resources
        function addTimestampToAllResources() {
            const timestamp = new Date().getTime();
            
            // Process all CSS links
            document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                const originalHref = link.getAttribute('href').split('?')[0];
                link.setAttribute('href', `${originalHref}?v=${timestamp}`);
            });
            
            // Process all script tags
            document.querySelectorAll('script[src]').forEach(script => {
                const originalSrc = script.getAttribute('src').split('?')[0];
                script.setAttribute('src', `${originalSrc}?v=${timestamp}`);
            });
            
            // Process all images
            document.querySelectorAll('img[src]').forEach(img => {
                const originalSrc = img.getAttribute('src').split('?')[0];
                img.setAttribute('src', `${originalSrc}?v=${timestamp}`);
            });
            
            console.log('[CACHE BUSTER] All resources refreshed with timestamp:', timestamp);
        }
        
        // Create a style element to force CSS reloads
        const forceCssReload = document.createElement('style');
        forceCssReload.id = 'cache-buster-style';
        forceCssReload.textContent = `
            /* Force CSS reload by changing this comment on each refresh */
            /* Timestamp: ${new Date().getTime()} */
        `;
        document.head.appendChild(forceCssReload);
        
        // Initial run
        addTimestampToAllResources();
        
        // Set up periodic refresh (every 2 seconds)
        const intervalId = setInterval(() => {
            addTimestampToAllResources();
            
            // Update the style element to force CSS reload
            forceCssReload.textContent = `
                /* Force CSS reload by changing this comment on each refresh */
                /* Timestamp: ${new Date().getTime()} */
            `;
        }, 2000);
        
        // Clear interval when page is not visible
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                clearInterval(intervalId);
            } else {
                addTimestampToAllResources();
                setInterval(addTimestampToAllResources, 2000);
            }
        });
        
        // Add development mode indicator
        const devIndicator = document.createElement('div');
        devIndicator.style.position = 'fixed';
        devIndicator.style.bottom = '10px';
        devIndicator.style.right = '10px';
        devIndicator.style.background = 'rgba(255, 0, 0, 0.8)';
        devIndicator.style.color = '#fff';
        devIndicator.style.padding = '5px 10px';
        devIndicator.style.borderRadius = '3px';
        devIndicator.style.fontSize = '12px';
        devIndicator.style.fontWeight = 'bold';
        devIndicator.style.zIndex = '9999';
        devIndicator.style.fontFamily = 'monospace';
        devIndicator.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        devIndicator.textContent = 'DEV MODE - CACHE DISABLED';
        document.body.appendChild(devIndicator);
        
        // Add manual refresh button
        const refreshButton = document.createElement('button');
        refreshButton.style.position = 'fixed';
        refreshButton.style.bottom = '10px';
        refreshButton.style.right = '170px';
        refreshButton.style.background = 'rgba(0, 0, 255, 0.8)';
        refreshButton.style.color = '#fff';
        refreshButton.style.padding = '5px 10px';
        refreshButton.style.border = 'none';
        refreshButton.style.borderRadius = '3px';
        refreshButton.style.fontSize = '12px';
        refreshButton.style.fontWeight = 'bold';
        refreshButton.style.zIndex = '9999';
        refreshButton.style.fontFamily = 'monospace';
        refreshButton.style.cursor = 'pointer';
        refreshButton.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        refreshButton.textContent = 'FORCE REFRESH';
        refreshButton.addEventListener('click', function() {
            addTimestampToAllResources();
            alert('Resources refreshed! If changes are still not visible, try a hard refresh (Ctrl+F5)');
        });
        document.body.appendChild(refreshButton);
        
        // Override fetch and XMLHttpRequest to prevent caching
        const originalFetch = window.fetch;
        window.fetch = function() {
            const url = arguments[0];
            const options = arguments[1] || {};
            
            if (typeof url === 'string') {
                const separator = url.includes('?') ? '&' : '?';
                arguments[0] = `${url}${separator}_=${new Date().getTime()}`;
            }
            
            if (!options.headers) {
                options.headers = {};
            }
            
            options.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
            options.headers['Pragma'] = 'no-cache';
            options.headers['Expires'] = '0';
            
            return originalFetch.apply(this, arguments);
        };
        
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            const url = arguments[1];
            if (typeof url === 'string') {
                const separator = url.includes('?') ? '&' : '?';
                arguments[1] = `${url}${separator}_=${new Date().getTime()}`;
            }
            return originalOpen.apply(this, arguments);
        };
        
        // Expose global utility for manual refresh
        window.forceCacheBust = function() {
            addTimestampToAllResources();
            console.log('[CACHE BUSTER] Manual refresh triggered');
            return 'Resources refreshed! If changes are still not visible, try a hard refresh (Ctrl+F5)';
        };
        
        console.log('[CACHE BUSTER] Initialization complete - all caching disabled');
    }
})(); 