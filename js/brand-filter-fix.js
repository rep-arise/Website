/**
 * CRITICAL BRAND FILTER FIX - AGGRESSIVE VERSION
 * 
 * This script ensures that when a brand filter is selected, ONLY products of that brand are displayed.
 * It uses direct DOM manipulation and aggressive filtering to guarantee correct results.
 */

(function() {
    console.log('%c BRAND FILTER FIX: Script loaded (AGGRESSIVE VERSION)', 'background: #ff0000; color: white; padding: 5px; font-weight: bold;');
    
    // Global state to track selected brand
    let CURRENT_SELECTED_BRAND = null;
    
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('BRAND FILTER FIX: DOM loaded, initializing...');
        // Initialize immediately and also after a delay to catch late-loading elements
        initBrandFilterFix();
        setTimeout(initBrandFilterFix, 500);
        setTimeout(initBrandFilterFix, 1000);
        setTimeout(initBrandFilterFix, 2000);
    });
    
    // Ensure our fix runs even if the page is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log('BRAND FILTER FIX: Page already loaded, initializing immediately...');
        initBrandFilterFix();
    }
    
    function initBrandFilterFix() {
        console.log('%c BRAND FILTER FIX: Initializing aggressive fix', 'background: #ff0000; color: white; padding: 3px;');
        
        // Override the original applyFilters function if it exists
        if (typeof window.applyFilters === 'function') {
            console.log('BRAND FILTER FIX: Overriding applyFilters function');
            
            // Store the original function
            const originalApplyFilters = window.applyFilters;
            
            // Replace with our fixed version
            window.applyFilters = function() {
                console.log('%c BRAND FILTER FIX: Running fixed applyFilters', 'background: #ff0000; color: white;');
                
                // Call the original function first
                originalApplyFilters.apply(this, arguments);
                
                // Then apply our aggressive fix
                setTimeout(enforceStrictBrandFiltering, 0);
                setTimeout(enforceStrictBrandFiltering, 100); // Run again to catch any race conditions
            };
        } else {
            console.warn('BRAND FILTER FIX: Could not find applyFilters function to override');
        }
        
        // Set up event listeners for filter buttons and checkboxes
        setupFilterEventListeners();
        
        // Check if we're on a brand-specific page and apply initial filtering
        checkAndApplyBrandPageFiltering();
        
        // Run the fix now in case filters are already applied
        enforceStrictBrandFiltering();
    }
    
    function checkAndApplyBrandPageFiltering() {
        // Check if we're on a brand-specific page
        const path = window.location.pathname;
        const brandMatch = path.match(/\/brands\/([a-z-]+)\.html/i);
        
        if (brandMatch) {
            const brandFromUrl = brandMatch[1];
            console.log(`BRAND FILTER FIX: Detected brand page for: ${brandFromUrl}`);
            
            // Find and check the corresponding brand checkbox
            document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
                const checkboxBrand = normalizeBrandName(checkbox.value);
                const urlBrand = normalizeBrandName(brandFromUrl);
                
                if (checkboxBrand === urlBrand) {
                    console.log(`BRAND FILTER FIX: Auto-selecting brand checkbox for ${checkboxBrand}`);
                    checkbox.checked = true;
                    CURRENT_SELECTED_BRAND = checkboxBrand;
                } else {
                    checkbox.checked = false;
                }
            });
            
            // Run filtering
            setTimeout(enforceStrictBrandFiltering, 500);
        }
    }
    
    function setupFilterEventListeners() {
        // Apply filter button
        const applyFilterBtn = document.querySelector('.apply-filter');
        if (applyFilterBtn) {
            // Remove any existing event listeners first
            const newApplyBtn = applyFilterBtn.cloneNode(true);
            applyFilterBtn.parentNode.replaceChild(newApplyBtn, applyFilterBtn);
            
            newApplyBtn.addEventListener('click', function() {
                console.log('%c BRAND FILTER FIX: Apply filter button clicked', 'background: #ff0000; color: white;');
                updateSelectedBrandState();
                setTimeout(enforceStrictBrandFiltering, 0);
                setTimeout(enforceStrictBrandFiltering, 100);
            });
        }
        
        // Clear filter button
        const clearFilterBtn = document.querySelector('.clear-filter');
        if (clearFilterBtn) {
            // Remove any existing event listeners first
            const newClearBtn = clearFilterBtn.cloneNode(true);
            clearFilterBtn.parentNode.replaceChild(newClearBtn, clearFilterBtn);
            
            newClearBtn.addEventListener('click', function() {
                console.log('BRAND FILTER FIX: Clear filter button clicked');
                CURRENT_SELECTED_BRAND = null;
                setTimeout(function() {
                    // Ensure all products are visible after clearing
                    document.querySelectorAll('.product-card').forEach(card => {
                        card.style.removeProperty('display');
                    });
                }, 100);
            });
        }
        
        // Brand checkboxes
        document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
            // Remove any existing event listeners first
            const newCheckbox = checkbox.cloneNode(true);
            checkbox.parentNode.replaceChild(newCheckbox, checkbox);
            
            newCheckbox.addEventListener('change', function() {
                const brandValue = this.value;
                const isChecked = this.checked;
                
                console.log(`%c BRAND FILTER FIX: Brand checkbox ${brandValue} changed to ${isChecked}`, 'background: #ff0000; color: white;');
                
                if (isChecked) {
                    // Uncheck all other brand checkboxes
                    document.querySelectorAll('input[name="brand"]').forEach(otherCheckbox => {
                        if (otherCheckbox !== this) {
                            otherCheckbox.checked = false;
                        }
                    });
                    
                    // Update global state
                    CURRENT_SELECTED_BRAND = normalizeBrandName(brandValue);
                    console.log(`BRAND FILTER FIX: Selected brand set to: ${CURRENT_SELECTED_BRAND}`);
                } else if (!document.querySelector('input[name="brand"]:checked')) {
                    // If no brand is checked, clear the global state
                    CURRENT_SELECTED_BRAND = null;
                    console.log('BRAND FILTER FIX: No brand selected');
                }
                
                // Run filtering immediately
                setTimeout(enforceStrictBrandFiltering, 0);
                setTimeout(enforceStrictBrandFiltering, 100);
            });
        });
        
        console.log('BRAND FILTER FIX: Event listeners set up');
    }
    
    function updateSelectedBrandState() {
        // Get selected brand filters
        const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
            .map(checkbox => normalizeBrandName(checkbox.value));
        
        if (selectedBrands.length > 0) {
            CURRENT_SELECTED_BRAND = selectedBrands[0];
            console.log(`BRAND FILTER FIX: Updated selected brand to: ${CURRENT_SELECTED_BRAND}`);
        } else {
            CURRENT_SELECTED_BRAND = null;
            console.log('BRAND FILTER FIX: No brand selected');
        }
    }
    
    function enforceStrictBrandFiltering() {
        console.log('%c BRAND FILTER FIX: Running AGGRESSIVE brand filter enforcement', 'background: #ff0000; color: white; font-weight: bold;');
        
        // Double-check selected brand state
        updateSelectedBrandState();
        
        // Get all product cards
        const productCards = document.querySelectorAll('.product-card');
        if (productCards.length === 0) {
            console.warn('BRAND FILTER FIX: No product cards found');
            return;
        }
        
        console.log(`BRAND FILTER FIX: Found ${productCards.length} product cards`);
        console.log(`BRAND FILTER FIX: Current selected brand: ${CURRENT_SELECTED_BRAND || 'NONE'}`);
        
        // If no brand filter is selected, don't do anything
        if (!CURRENT_SELECTED_BRAND) {
            console.log('BRAND FILTER FIX: No brand filter selected, skipping enforcement');
            return;
        }
        
        // Get other filter selections for combined filtering
        const selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked'))
            .map(checkbox => checkbox.value);
        
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
            .map(checkbox => checkbox.value);
        
        const minPrice = parseInt(document.getElementById('min-price-input')?.value || 0);
        const maxPrice = parseInt(document.getElementById('max-price-input')?.value || 10000);
        
        console.log(`BRAND FILTER FIX: Other filters - Sizes: ${selectedSizes.join(', ') || 'none'}, Categories: ${selectedCategories.join(', ') || 'none'}, Price: ${minPrice}-${maxPrice}`);
        
        // Debug array to track products
        const debugProducts = [];
        
        // Process each product card
        productCards.forEach(card => {
            // Get product data
            const cardBrand = normalizeBrandName(card.getAttribute('data-brand') || '');
            const price = parseInt(card.getAttribute('data-price') || 0);
            const category = card.getAttribute('data-category') || '';
            const sizes = (card.getAttribute('data-sizes') || '').split(',');
            
            // Debug info
            debugProducts.push({
                brand: cardBrand,
                originalBrand: card.getAttribute('data-brand'),
                price: price,
                category: category,
                sizes: sizes
            });
            
            // Check if this product matches the selected brand
            const meetsBrand = cardBrand === CURRENT_SELECTED_BRAND;
            
            // Log the comparison for debugging
            console.log(`BRAND FILTER FIX: Card brand "${cardBrand}" ${meetsBrand ? 'MATCHES' : 'DOES NOT MATCH'} selected brand "${CURRENT_SELECTED_BRAND}"`);
            
            // Only check other filters if the brand matches
            if (meetsBrand) {
                // Price filter
                const meetsPrice = price >= minPrice && price <= maxPrice;
                
                // Category filter with unisex handling
                let meetsCategory = false;
                if (selectedCategories.length === 0) {
                    meetsCategory = true;
                } else if (selectedCategories.includes('men') && (category === 'men' || category === 'unisex')) {
                    meetsCategory = true;
                } else if (selectedCategories.includes('women') && (category === 'women' || category === 'unisex')) {
                    meetsCategory = true;
                } else if (selectedCategories.includes(category)) {
                    meetsCategory = true;
                }
                
                // Size filter
                const meetsSize = selectedSizes.length === 0 || 
                    selectedSizes.some(size => sizes.includes(size));
                
                // Show product only if it meets ALL criteria
                if (meetsPrice && meetsCategory && meetsSize) {
                    card.style.display = 'flex';
                    card.setAttribute('data-filter-fixed', 'true');
                    card.setAttribute('data-filter-reason', 'MATCHES_ALL');
                } else {
                    card.style.display = 'none';
                    card.setAttribute('data-filter-reason', `BRAND_OK_BUT_FAILS_OTHER_FILTERS:Price:${meetsPrice},Category:${meetsCategory},Size:${meetsSize}`);
                }
            } else {
                // Hide products that don't match the selected brand
                card.style.display = 'none';
                card.setAttribute('data-filter-reason', 'BRAND_MISMATCH');
            }
        });
        
        // Log debug information
        console.log('BRAND FILTER FIX: Product data for debugging:', debugProducts);
        
        // Log results
        const visibleCards = Array.from(productCards).filter(
            card => window.getComputedStyle(card).display !== 'none'
        );
        
        console.log(`%c BRAND FILTER FIX: ${visibleCards.length} products visible after enforcement`, 'background: #ff0000; color: white; font-weight: bold;');
        
        // Log visible products for debugging
        if (visibleCards.length > 0) {
            console.log('BRAND FILTER FIX: Visible products:');
            visibleCards.forEach(card => {
                console.log(`- ${card.querySelector('h3')?.textContent || 'Unknown'} (Brand: ${card.getAttribute('data-brand')})`);
            });
        }
        
        // FINAL VERIFICATION - Double check that all visible products match the selected brand
        const wrongBrandCards = visibleCards.filter(
            card => normalizeBrandName(card.getAttribute('data-brand')) !== CURRENT_SELECTED_BRAND
        );
        
        if (wrongBrandCards.length > 0) {
            console.error('%c BRAND FILTER FIX: CRITICAL ERROR - Found visible products that don\'t match the selected brand!', 'background: red; color: white; font-size: 16px; font-weight: bold;');
            console.error('BRAND FILTER FIX: Forcing these products to be hidden:', wrongBrandCards);
            
            // Force hide these products
            wrongBrandCards.forEach(card => {
                card.style.display = 'none';
                card.setAttribute('data-filter-reason', 'EMERGENCY_HIDE_WRONG_BRAND');
            });
        } else {
            console.log('%c BRAND FILTER FIX: VERIFICATION PASSED - All visible products match the selected brand', 'background: green; color: white;');
        }
    }
    
    // Function to normalize brand names for consistent comparison
    function normalizeBrandName(brand) {
        if (!brand) return '';
        
        // Convert to lowercase and trim whitespace
        brand = String(brand).toLowerCase().trim();
        
        // Handle special cases and variations
        if (brand === 'new-balance' || brand === 'newbalance' || brand === 'new balance') return 'newbalance';
        if (brand === 'onitsuka-tiger' || brand === 'onitsuka tiger' || brand === 'onitsuka') return 'onitsuka tiger';
        if (brand === 'air-jordan' || brand === 'air jordan' || brand === 'jordan') return 'jordan';
        if (brand === 'nike') return 'nike';
        if (brand === 'adidas') return 'adidas';
        if (brand === 'puma') return 'puma';
        if (brand === 'reebok') return 'reebok';
        if (brand === 'asics') return 'asics';
        if (brand === 'converse') return 'converse';
        
        // Return the normalized brand name
        return brand;
    }
    
    // Add a global helper function for debugging
    window.debugBrandFilter = function() {
        console.log('%c BRAND FILTER DEBUG', 'background: blue; color: white; padding: 5px; font-weight: bold;');
        
        // Get all product cards
        const productCards = document.querySelectorAll('.product-card');
        console.log(`Total product cards: ${productCards.length}`);
        
        // Get selected brand
        const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
            .map(checkbox => normalizeBrandName(checkbox.value));
        console.log(`Selected brands: ${selectedBrands.join(', ') || 'NONE'}`);
        
        // Count products by brand
        const brandCounts = {};
        productCards.forEach(card => {
            const brand = normalizeBrandName(card.getAttribute('data-brand') || '');
            brandCounts[brand] = (brandCounts[brand] || 0) + 1;
        });
        console.log('Products by brand:', brandCounts);
        
        // Count visible products by brand
        const visibleBrandCounts = {};
        productCards.forEach(card => {
            if (window.getComputedStyle(card).display !== 'none') {
                const brand = normalizeBrandName(card.getAttribute('data-brand') || '');
                visibleBrandCounts[brand] = (visibleBrandCounts[brand] || 0) + 1;
            }
        });
        console.log('VISIBLE products by brand:', visibleBrandCounts);
        
        // Force run the filter enforcement
        enforceStrictBrandFiltering();
        
        return 'Brand filter debugging complete. Check console for details.';
    };
    
    // Run the fix immediately and periodically
    enforceStrictBrandFiltering();
    setInterval(enforceStrictBrandFiltering, 2000); // Run every 2 seconds as a safety measure
})(); 