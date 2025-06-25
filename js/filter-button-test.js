/**
 * Filter Button Test Script
 * This script verifies that the Apply Filter button is working correctly
 */

(function() {
    console.log('Filter Button Test: Script loaded');
    
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Filter Button Test: DOM loaded');
        
        // Give time for other scripts to initialize
        setTimeout(() => {
            // Find the Apply Filter button
            const applyFilterBtn = document.querySelector('.apply-filter');
            
            if (applyFilterBtn) {
                console.log('Filter Button Test: Found Apply Filter button');
                
                // Add a data attribute to mark that we've found it
                applyFilterBtn.setAttribute('data-test-found', 'true');
                
                // Check if the button has event listeners
                const hasClickHandler = typeof window.getEventListeners === 'function' ? 
                    window.getEventListeners(applyFilterBtn).click?.length > 0 : 
                    'Unknown (getEventListeners not available)';
                
                console.log(`Filter Button Test: Button has click handlers: ${hasClickHandler}`);
                
                // Test click the button
                console.log('Filter Button Test: Simulating click on Apply Filter button');
                
                // Create and dispatch a click event
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                
                // Dispatch the event
                applyFilterBtn.dispatchEvent(clickEvent);
                
                // Check if any products are visible
                setTimeout(() => {
                    const visibleProducts = document.querySelectorAll('.product-card[style*="display: flex"]').length;
                    const totalProducts = document.querySelectorAll('.product-card').length;
                    
                    console.log(`Filter Button Test: After click, ${visibleProducts}/${totalProducts} products are visible`);
                    
                    if (visibleProducts === 0 && totalProducts > 0) {
                        console.error('Filter Button Test: No products visible after filter! Something is wrong.');
                    } else if (visibleProducts > 0) {
                        console.log('Filter Button Test: Filter button appears to be working correctly');
                    }
                    
                    // Verify global functions exist
                    console.log(`Filter Button Test: Global applyFilters function exists: ${typeof window.applyFilters === 'function'}`);
                    console.log(`Filter Button Test: Global resetFilters function exists: ${typeof window.resetFilters === 'function'}`);
                    console.log(`Filter Button Test: ProductFixes.filter.applyFilters exists: ${typeof window.ProductFixes?.filter?.applyFilters === 'function'}`);
                }, 500);
            } else {
                console.error('Filter Button Test: Apply Filter button not found!');
            }
        }, 2000);
    });
})(); 