/**
 * Cache Buster - Prevents browser caching during development
 * 
 * This script adds a timestamp query parameter to CSS and JS resources
 * to ensure that the browser always loads the latest version during development.
 */

(function() {
    // Only run in development environments
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.includes('.local');
    
    if (!isDevelopment) return;
    
    // Function to add timestamp to resource URLs
    function addTimestampToResources() {
        const timestamp = new Date().getTime();
        
        // Update CSS links
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            if (!link.href.includes('?')) {
                link.href = `${link.href}?v=${timestamp}`;
            } else if (!link.href.includes('v=')) {
                link.href = `${link.href}&v=${timestamp}`;
            } else {
                // Replace existing timestamp
                link.href = link.href.replace(/v=\d+/, `v=${timestamp}`);
            }
        });
        
        // Update JavaScript scripts
        document.querySelectorAll('script[src]').forEach(script => {
            if (!script.src.includes('?')) {
                script.src = `${script.src}?v=${timestamp}`;
            } else if (!script.src.includes('v=')) {
                script.src = `${script.src}&v=${timestamp}`;
            } else {
                // Replace existing timestamp
                script.src = script.src.replace(/v=\d+/, `v=${timestamp}`);
            }
        });
        
        console.log('[Cache Buster] Resources refreshed with timestamp:', timestamp);
    }
    
    // Run on page load
    addTimestampToResources();
    
    // Reload resources every 5 seconds during active development
    const intervalId = setInterval(addTimestampToResources, 5000);
    
    // Clear interval when page is not visible to save resources
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(intervalId);
        } else {
            addTimestampToResources();
            setInterval(addTimestampToResources, 5000);
        }
    });
    
    // Add a development indicator
    const devIndicator = document.createElement('div');
    devIndicator.style.position = 'fixed';
    devIndicator.style.bottom = '10px';
    devIndicator.style.right = '10px';
    devIndicator.style.background = 'rgba(0, 0, 0, 0.7)';
    devIndicator.style.color = '#fff';
    devIndicator.style.padding = '5px 10px';
    devIndicator.style.borderRadius = '3px';
    devIndicator.style.fontSize = '12px';
    devIndicator.style.zIndex = '9999';
    devIndicator.style.fontFamily = 'monospace';
    devIndicator.textContent = 'DEV MODE - CACHE DISABLED';
    document.body.appendChild(devIndicator);
    
    // Expose utility function to force refresh
    window.forceCacheBust = function() {
        addTimestampToResources();
        console.log('[Cache Buster] Manual refresh triggered');
    };
})(); 