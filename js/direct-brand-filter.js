/**
 * DIRECT BRAND FILTER OVERRIDE
 * 
 * This script completely overrides the existing filtering system to ensure
 * only products of the selected brand are shown when a brand filter is active.
 */

(function() {
    console.log('%c DIRECT BRAND FILTER: Script loaded', 'background: #000000; color: #ff0000; padding: 5px; font-weight: bold;');
    
    // Initialize immediately and after a delay
    initDirectBrandFilter();
    setTimeout(initDirectBrandFilter, 500);
    
    function initDirectBrandFilter() {
        console.log('%c DIRECT BRAND FILTER: Initializing', 'background: #000000; color: #ff0000; padding: 3px;');
        
        // Completely override the applyFilters function
        window.applyFilters = directApplyFilters;
        
        // Set up event listeners
        setupEventListeners();
        
        // Apply initial filtering if needed
        checkAndApplyInitialFiltering();
    }
    
    function setupEventListeners() {
        // Apply filter button
        const applyFilterBtn = document.querySelector('.apply-filter');
        if (applyFilterBtn) {
            // Remove any existing event listeners
            const newApplyBtn = applyFilterBtn.cloneNode(true);
            applyFilterBtn.parentNode.replaceChild(newApplyBtn, applyFilterBtn);
            
            newApplyBtn.addEventListener('click', function() {
                console.log('%c DIRECT BRAND FILTER: Apply filter button clicked', 'background: #000000; color: #ff0000;');
                directApplyFilters();
            });
        }
        
        // Clear filter button
        const clearFilterBtn = document.querySelector('.clear-filter');
        if (clearFilterBtn) {
            // Remove any existing event listeners
            const newClearBtn = clearFilterBtn.cloneNode(true);
            clearFilterBtn.parentNode.replaceChild(newClearBtn, clearFilterBtn);
            
            newClearBtn.addEventListener('click', function() {
                console.log('%c DIRECT BRAND FILTER: Clear filter button clicked', 'background: #000000; color: #ff0000;');
                // Clear all checkboxes
                document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = false;
                });
                
                // Reset price inputs
                const minPriceInput = document.getElementById('min-price-input');
                const maxPriceInput = document.getElementById('max-price-input');
                if (minPriceInput) minPriceInput.value = minPriceInput.getAttribute('min') || 0;
                if (maxPriceInput) maxPriceInput.value = maxPriceInput.getAttribute('max') || 10000;
                
                // Show all products
                document.querySelectorAll('.product-card').forEach(card => {
                    card.style.display = 'flex';
                });
                
                // Update product count
                updateProductCount();
            });
        }
        
        // Brand checkboxes with exclusive selection
        document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
            // Remove any existing event listeners
            const newCheckbox = checkbox.cloneNode(true);
            checkbox.parentNode.replaceChild(newCheckbox, checkbox);
            
            newCheckbox.addEventListener('change', function() {
                console.log(`%c DIRECT BRAND FILTER: Brand checkbox ${this.value} changed to ${this.checked}`, 'background: #000000; color: #ff0000;');
                
                if (this.checked) {
                    // Uncheck all other brand checkboxes for exclusive filtering
                    document.querySelectorAll('input[name="brand"]').forEach(otherCheckbox => {
                        if (otherCheckbox !== this) {
                            otherCheckbox.checked = false;
                        }
                    });
                    
                    // Apply filters immediately when a brand is selected
                    directApplyFilters();
                } else {
                    // If unchecked, also apply filters (will show all products if no brand is selected)
                    directApplyFilters();
                }
            });
        });
        
        // Other filter checkboxes
        document.querySelectorAll('input[name="size"], input[name="category"]').forEach(checkbox => {
            // Remove any existing event listeners
            const newCheckbox = checkbox.cloneNode(true);
            checkbox.parentNode.replaceChild(newCheckbox, checkbox);
            
            newCheckbox.addEventListener('change', function() {
                console.log(`%c DIRECT BRAND FILTER: Filter checkbox ${this.name}:${this.value} changed to ${this.checked}`, 'background: #000000; color: #ff0000;');
                directApplyFilters();
            });
        });
        
        // Price inputs
        const minPriceInput = document.getElementById('min-price-input');
        const maxPriceInput = document.getElementById('max-price-input');
        
        if (minPriceInput) {
            minPriceInput.addEventListener('change', directApplyFilters);
            minPriceInput.addEventListener('input', directApplyFilters);
        }
        
        if (maxPriceInput) {
            maxPriceInput.addEventListener('change', directApplyFilters);
            maxPriceInput.addEventListener('input', directApplyFilters);
        }
        
        console.log('%c DIRECT BRAND FILTER: Event listeners set up', 'background: #000000; color: #ff0000;');
    }
    
    function checkAndApplyInitialFiltering() {
        // Check if we're on a brand-specific page
        const path = window.location.pathname;
        const brandMatch = path.match(/\/brands\/([a-z-]+)\.html/i);
        
        if (brandMatch) {
            const brandFromUrl = brandMatch[1];
            console.log(`%c DIRECT BRAND FILTER: Detected brand page for: ${brandFromUrl}`, 'background: #000000; color: #ff0000;');
            
            // Find and check the corresponding brand checkbox
            document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
                const checkboxBrand = normalizeBrandName(checkbox.value);
                const urlBrand = normalizeBrandName(brandFromUrl);
                
                if (checkboxBrand === urlBrand) {
                    console.log(`%c DIRECT BRAND FILTER: Auto-selecting brand checkbox for ${checkboxBrand}`, 'background: #000000; color: #ff0000;');
                    checkbox.checked = true;
                } else {
                    checkbox.checked = false;
                }
            });
            
            // Apply filtering
            setTimeout(directApplyFilters, 300);
        } else {
            // Check if any brand filter is already selected
            const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked'));
            if (selectedBrands.length > 0) {
                console.log(`%c DIRECT BRAND FILTER: Found pre-selected brand filter: ${selectedBrands[0].value}`, 'background: #000000; color: #ff0000;');
                setTimeout(directApplyFilters, 300);
            }
        }
    }
    
    function directApplyFilters() {
        console.log('%c DIRECT BRAND FILTER: Applying filters directly', 'background: #000000; color: #ff0000; font-weight: bold;');
        
        // Get all product cards
        const productCards = document.querySelectorAll('.product-card');
        if (productCards.length === 0) {
            console.warn('%c DIRECT BRAND FILTER: No product cards found', 'background: #000000; color: #ff0000;');
            return;
        }
        
        console.log(`%c DIRECT BRAND FILTER: Found ${productCards.length} product cards`, 'background: #000000; color: #ff0000;');
        
        // Get filter values
        const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
            .map(checkbox => normalizeBrandName(checkbox.value));
        
        const selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked'))
            .map(checkbox => checkbox.value);
        
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
            .map(checkbox => checkbox.value);
        
        const minPrice = parseInt(document.getElementById('min-price-input')?.value || 0);
        const maxPrice = parseInt(document.getElementById('max-price-input')?.value || 10000);
        
        console.log(`%c DIRECT BRAND FILTER: Selected brands: ${selectedBrands.join(', ') || 'NONE'}`, 'background: #000000; color: #ff0000;');
        console.log(`DIRECT BRAND FILTER: Other filters - Sizes: ${selectedSizes.join(', ') || 'none'}, Categories: ${selectedCategories.join(', ') || 'none'}, Price: ${minPrice}-${maxPrice}`);
        
        // Process each product card
        productCards.forEach(card => {
            // Get product data
            const cardBrand = normalizeBrandName(card.getAttribute('data-brand') || '');
            const price = parseInt(card.getAttribute('data-price') || 0);
            const category = card.getAttribute('data-category') || '';
            const sizes = (card.getAttribute('data-sizes') || '').split(',');
            
            // Brand filter (most important)
            let meetsBrand = true;
            if (selectedBrands.length > 0) {
                meetsBrand = selectedBrands.includes(cardBrand);
                
                // Log the brand comparison for debugging
                console.log(`DIRECT BRAND FILTER: Card brand "${cardBrand}" ${meetsBrand ? 'MATCHES' : 'DOES NOT MATCH'} selected brand "${selectedBrands[0]}"`);
            }
            
            // Only check other filters if brand matches or no brand filter is applied
            if (meetsBrand) {
                // Price filter
                const meetsPrice = price >= minPrice && price <= maxPrice;
                
                // Category filter with unisex handling
                let meetsCategory = true;
                if (selectedCategories.length > 0) {
                    meetsCategory = false;
                    if (selectedCategories.includes('men') && (category === 'men' || category === 'unisex')) {
                        meetsCategory = true;
                    } else if (selectedCategories.includes('women') && (category === 'women' || category === 'unisex')) {
                        meetsCategory = true;
                    } else if (selectedCategories.includes(category)) {
                        meetsCategory = true;
                    }
                }
                
                // Size filter
                const meetsSize = selectedSizes.length === 0 || 
                    selectedSizes.some(size => sizes.includes(size));
                
                // Show product only if it meets ALL criteria
                if (meetsPrice && meetsCategory && meetsSize) {
                    card.style.display = 'flex';
                    card.setAttribute('data-filter-status', 'visible');
                    card.setAttribute('data-filter-reason', 'MATCHES_ALL');
                } else {
                    card.style.display = 'none';
                    card.setAttribute('data-filter-status', 'hidden');
                    card.setAttribute('data-filter-reason', `FAILS_OTHER_FILTERS:Price:${meetsPrice},Category:${meetsCategory},Size:${meetsSize}`);
                }
            } else {
                // Hide products that don't match the selected brand
                card.style.display = 'none';
                card.setAttribute('data-filter-status', 'hidden');
                card.setAttribute('data-filter-reason', 'BRAND_MISMATCH');
            }
        });
        
        // Log results
        const visibleCards = Array.from(productCards).filter(
            card => window.getComputedStyle(card).display !== 'none'
        );
        
        console.log(`%c DIRECT BRAND FILTER: ${visibleCards.length} products visible after filtering`, 'background: #000000; color: #ff0000; font-weight: bold;');
        
        // VERIFICATION - Double check that all visible products match the selected brand
        if (selectedBrands.length > 0) {
            const wrongBrandCards = visibleCards.filter(
                card => normalizeBrandName(card.getAttribute('data-brand')) !== selectedBrands[0]
            );
            
            if (wrongBrandCards.length > 0) {
                console.error('%c DIRECT BRAND FILTER: CRITICAL ERROR - Found visible products that don\'t match the selected brand!', 'background: red; color: white; font-size: 16px; font-weight: bold;');
                console.error('DIRECT BRAND FILTER: Forcing these products to be hidden:', wrongBrandCards);
                
                // Force hide these products
                wrongBrandCards.forEach(card => {
                    card.style.display = 'none';
                    card.setAttribute('data-filter-status', 'hidden');
                    card.setAttribute('data-filter-reason', 'EMERGENCY_HIDE_WRONG_BRAND');
                });
            } else {
                console.log('%c DIRECT BRAND FILTER: VERIFICATION PASSED - All visible products match the selected brand', 'background: green; color: white;');
            }
        }
        
        // Update product count
        updateProductCount();
        
        return true; // Return true to indicate success
    }
    
    function updateProductCount() {
        // Update product count if element exists
        const productCountElement = document.querySelector('.product-count');
        if (productCountElement) {
            const visibleCount = document.querySelectorAll('.product-card[style*="display: flex"]').length;
            productCountElement.textContent = `${visibleCount} Products`;
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
    window.debugDirectFilter = function() {
        console.log('%c DIRECT FILTER DEBUG', 'background: blue; color: white; padding: 5px; font-weight: bold;');
        
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
        
        // Force run the filter
        directApplyFilters();
        
        return 'Direct filter debugging complete. Check console for details.';
    };
})(); 