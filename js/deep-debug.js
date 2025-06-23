// Deep debugging script for product filtering issue
document.addEventListener('DOMContentLoaded', function() {
    console.log('DEEP DEBUG: Script loaded');
    
    // Wait for emergency-fix.js to initialize
    setTimeout(() => {
        console.log('DEEP DEBUG: Starting deep debugging');
        
        // STEP 1: Check if products are actually in the DOM
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) {
            console.error('DEEP DEBUG: Products grid not found!');
            return;
        }
        
        const allProductCards = productsGrid.querySelectorAll('.product-card');
        console.log(`DEEP DEBUG: Total product cards in DOM: ${allProductCards.length}`);
        
        // STEP 2: Check Nike products specifically
        const nikeProducts = Array.from(allProductCards).filter(card => 
            (card.getAttribute('data-brand') || '').toLowerCase() === 'nike'
        );
        console.log(`DEEP DEBUG: Total Nike products in DOM: ${nikeProducts.length}`);
        
        // List all Nike products
        nikeProducts.forEach((card, index) => {
            const name = card.querySelector('h3')?.textContent || 'Unknown';
            const display = window.getComputedStyle(card).display;
            console.log(`DEEP DEBUG: Nike product ${index + 1}: "${name}" - Display style: ${display}`);
        });
        
        // STEP 3: Check CSS properties of the products grid
        const gridStyle = window.getComputedStyle(productsGrid);
        console.log('DEEP DEBUG: Products grid CSS properties:', {
            display: gridStyle.display,
            gridTemplateColumns: gridStyle.gridTemplateColumns,
            gap: gridStyle.gap,
            maxHeight: gridStyle.maxHeight,
            overflow: gridStyle.overflow,
            position: gridStyle.position
        });
        
        // STEP 4: Check parent containers for any constraints
        let parent = productsGrid.parentElement;
        while (parent && parent !== document.body) {
            const parentStyle = window.getComputedStyle(parent);
            console.log(`DEEP DEBUG: Parent container (${parent.className || parent.id || 'unnamed'}) CSS:`, {
                display: parentStyle.display,
                maxHeight: parentStyle.maxHeight,
                overflow: parentStyle.overflow,
                position: parentStyle.position
            });
            parent = parent.parentElement;
        }
        
        // STEP 5: Monkey patch the applyFilters function to add more debugging
        if (window.applyFilters) {
            const originalApplyFilters = window.applyFilters;
            window.applyFilters = function() {
                console.log('DEEP DEBUG: applyFilters called');
                
                // Get selected brands before filtering
                const brandCheckboxes = document.querySelectorAll("input[name=\"brand\"]");
                const selectedBrands = Array.from(brandCheckboxes)
                    .filter(checkbox => checkbox.checked)
                    .map(checkbox => checkbox.value.toLowerCase());
                
                console.log(`DEEP DEBUG: Selected brands before filtering: ${selectedBrands.join(', ')}`);
                
                // Call original function
                const result = originalApplyFilters.apply(this, arguments);
                
                // Check results after filtering
                setTimeout(() => {
                    const visibleCards = Array.from(document.querySelectorAll('.product-card'))
                        .filter(card => window.getComputedStyle(card).display !== 'none');
                    
                    console.log(`DEEP DEBUG: After filtering - Visible cards: ${visibleCards.length}`);
                    
                    // Check specifically for Nike products
                    if (selectedBrands.includes('nike')) {
                        const visibleNikeCards = visibleCards.filter(card => 
                            (card.getAttribute('data-brand') || '').toLowerCase() === 'nike'
                        );
                        console.log(`DEEP DEBUG: After filtering - Visible Nike cards: ${visibleNikeCards.length}`);
                        
                        // List first 5 visible Nike products
                        visibleNikeCards.slice(0, 5).forEach((card, index) => {
                            const name = card.querySelector('h3')?.textContent || 'Unknown';
                            console.log(`DEEP DEBUG: Visible Nike product ${index + 1}: "${name}"`);
                        });
                    }
                }, 100);
                
                return result;
            };
            console.log('DEEP DEBUG: Successfully patched applyFilters function');
        } else {
            console.error('DEEP DEBUG: Could not find applyFilters function to patch');
        }
        
        // STEP 6: Override emergency-fix.js applyFilters function
        if (window.emergencyFixApplyFilters) {
            const originalEmergencyApplyFilters = window.emergencyFixApplyFilters;
            window.emergencyFixApplyFilters = function() {
                console.log('DEEP DEBUG: emergencyFixApplyFilters called');
                
                // Call original function
                const result = originalEmergencyApplyFilters.apply(this, arguments);
                
                // Log results
                setTimeout(() => {
                    const visibleCards = Array.from(document.querySelectorAll('.product-card'))
                        .filter(card => window.getComputedStyle(card).display !== 'none');
                    
                    console.log(`DEEP DEBUG: After emergency filtering - Visible cards: ${visibleCards.length}`);
                }, 100);
                
                return result;
            };
            console.log('DEEP DEBUG: Successfully patched emergencyFixApplyFilters function');
        }
        
        // STEP 7: Add a manual filter trigger for testing
        const applyFilterBtn = document.querySelector('.apply-filter');
        if (applyFilterBtn) {
            const originalClickHandler = applyFilterBtn.onclick;
            applyFilterBtn.addEventListener('click', function(e) {
                console.log('DEEP DEBUG: Filter button clicked');
                
                // Check selected brands
                const brandCheckboxes = document.querySelectorAll("input[name=\"brand\"]");
                const selectedBrands = Array.from(brandCheckboxes)
                    .filter(checkbox => checkbox.checked)
                    .map(checkbox => checkbox.value.toLowerCase());
                
                console.log(`DEEP DEBUG: Selected brands: ${selectedBrands.join(', ')}`);
                
                // Continue with original handler if it exists
                if (originalClickHandler) {
                    originalClickHandler.call(this, e);
                }
                
                // Check results after a delay
                setTimeout(() => {
                    const visibleCards = Array.from(document.querySelectorAll('.product-card'))
                        .filter(card => window.getComputedStyle(card).display !== 'none');
                    
                    console.log(`DEEP DEBUG: After filter button click - Visible cards: ${visibleCards.length}`);
                    
                    // Check if any cards are hidden by CSS
                    const hiddenCards = Array.from(document.querySelectorAll('.product-card'))
                        .filter(card => window.getComputedStyle(card).display === 'none');
                    
                    console.log(`DEEP DEBUG: Hidden cards: ${hiddenCards.length}`);
                    
                    // Force all Nike products to be visible
                    if (selectedBrands.includes('nike')) {
                        const nikeCards = Array.from(document.querySelectorAll('.product-card'))
                            .filter(card => (card.getAttribute('data-brand') || '').toLowerCase() === 'nike');
                        
                        console.log(`DEEP DEBUG: Total Nike cards: ${nikeCards.length}`);
                        
                        // Force display
                        nikeCards.forEach(card => {
                            card.style.display = 'flex';
                            card.style.border = '2px solid red'; // Make them obvious
                        });
                        
                        console.log(`DEEP DEBUG: Forced ${nikeCards.length} Nike cards to be visible`);
                    }
                }, 500);
            });
            console.log('DEEP DEBUG: Added click handler to filter button');
        }
        
        console.log('DEEP DEBUG: Debugging setup complete');
    }, 1000);
}); 