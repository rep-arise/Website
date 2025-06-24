/**
 * CRITICAL PRODUCT CARD FIX
 * 
 * This script ensures all product cards have the correct data-brand attribute
 * and enhances the filtering mechanism to work correctly.
 */

(function() {
    console.log('%c PRODUCT CARD FIX: Script loaded', 'background: #ff5500; color: white; padding: 5px; font-weight: bold;');
    
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('PRODUCT CARD FIX: DOM loaded, initializing...');
        // Initialize immediately and also after a delay to catch late-loading elements
        initProductCardFix();
        setTimeout(initProductCardFix, 500);
        setTimeout(initProductCardFix, 1000);
        setTimeout(initProductCardFix, 2000);
    });
    
    // Ensure our fix runs even if the page is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log('PRODUCT CARD FIX: Page already loaded, initializing immediately...');
        initProductCardFix();
    }
    
    function initProductCardFix() {
        console.log('%c PRODUCT CARD FIX: Initializing', 'background: #ff5500; color: white; padding: 3px;');
        
        // Fix all product cards
        fixProductCards();
        
        // Set up a MutationObserver to watch for new product cards
        setupMutationObserver();
        
        // Set up event listeners for filter buttons
        setupFilterEventListeners();
    }
    
    function setupMutationObserver() {
        // Create a MutationObserver to watch for new product cards
        const observer = new MutationObserver(function(mutations) {
            let needsFix = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            if (node.classList && node.classList.contains('product-card')) {
                                needsFix = true;
                            } else if (node.querySelectorAll) {
                                const cards = node.querySelectorAll('.product-card');
                                if (cards.length > 0) {
                                    needsFix = true;
                                }
                            }
                        }
                    });
                }
            });
            
            if (needsFix) {
                console.log('PRODUCT CARD FIX: New product cards detected, fixing...');
                fixProductCards();
            }
        });
        
        // Start observing the document with the configured parameters
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('PRODUCT CARD FIX: MutationObserver set up');
    }
    
    function setupFilterEventListeners() {
        // Apply filter button
        const applyFilterBtn = document.querySelector('.apply-filter');
        if (applyFilterBtn) {
            applyFilterBtn.addEventListener('click', function() {
                console.log('PRODUCT CARD FIX: Apply filter button clicked');
                setTimeout(fixProductCards, 100);
                setTimeout(checkBrandFiltering, 200);
            });
        }
        
        // Clear filter button
        const clearFilterBtn = document.querySelector('.clear-filter');
        if (clearFilterBtn) {
            clearFilterBtn.addEventListener('click', function() {
                console.log('PRODUCT CARD FIX: Clear filter button clicked');
                setTimeout(fixProductCards, 100);
            });
        }
        
        // Brand checkboxes
        document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                console.log(`PRODUCT CARD FIX: Brand checkbox ${this.value} changed to ${this.checked}`);
                setTimeout(fixProductCards, 100);
                setTimeout(checkBrandFiltering, 200);
            });
        });
    }
    
    function fixProductCards() {
        console.log('PRODUCT CARD FIX: Fixing product cards...');
        
        // Get all product cards
        const productCards = document.querySelectorAll('.product-card');
        if (productCards.length === 0) {
            console.warn('PRODUCT CARD FIX: No product cards found');
            return;
        }
        
        console.log(`PRODUCT CARD FIX: Found ${productCards.length} product cards`);
        
        // Process each product card
        productCards.forEach(card => {
            // Get current brand attribute
            const currentBrand = card.getAttribute('data-brand');
            
            // Check if card has a title that might contain brand info
            const title = card.querySelector('h3')?.textContent || '';
            
            // Extract brand from title if possible and if data-brand is missing
            if (!currentBrand && title) {
                const extractedBrand = extractBrandFromTitle(title);
                if (extractedBrand) {
                    console.log(`PRODUCT CARD FIX: Adding missing data-brand "${extractedBrand}" to card with title "${title}"`);
                    card.setAttribute('data-brand', extractedBrand);
                }
            }
            
            // Normalize existing brand attribute
            if (currentBrand) {
                const normalizedBrand = normalizeBrandName(currentBrand);
                if (normalizedBrand !== currentBrand) {
                    console.log(`PRODUCT CARD FIX: Normalizing data-brand from "${currentBrand}" to "${normalizedBrand}"`);
                    card.setAttribute('data-brand', normalizedBrand);
                }
                
                // Add a data attribute for easier debugging
                card.setAttribute('data-original-brand', currentBrand);
            }
            
            // Add a special class for styling
            card.classList.add('product-card-fixed');
        });
        
        console.log('PRODUCT CARD FIX: Product cards fixed');
        
        // Check if brand filtering is active
        checkBrandFiltering();
    }
    
    function checkBrandFiltering() {
        // Get selected brand filters
        const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
            .map(checkbox => normalizeBrandName(checkbox.value));
        
        console.log(`PRODUCT CARD FIX: Selected brands: ${selectedBrands.join(', ') || 'NONE'}`);
        
        // If no brand filter is selected, don't do anything
        if (selectedBrands.length === 0) {
            console.log('PRODUCT CARD FIX: No brand filter selected, skipping check');
            return;
        }
        
        // Get all product cards
        const productCards = document.querySelectorAll('.product-card');
        
        // Check if any cards from other brands are visible
        const visibleCards = Array.from(productCards).filter(
            card => window.getComputedStyle(card).display !== 'none'
        );
        
        console.log(`PRODUCT CARD FIX: ${visibleCards.length} visible cards`);
        
        // Check if any visible cards don't match the selected brand
        const wrongBrandCards = visibleCards.filter(card => {
            const cardBrand = normalizeBrandName(card.getAttribute('data-brand') || '');
            return !selectedBrands.includes(cardBrand);
        });
        
        if (wrongBrandCards.length > 0) {
            console.error(`%c PRODUCT CARD FIX: CRITICAL ERROR - Found ${wrongBrandCards.length} visible products that don't match the selected brand!`, 'background: red; color: white; font-size: 16px; font-weight: bold;');
            console.error('PRODUCT CARD FIX: Forcing these products to be hidden:', wrongBrandCards);
            
            // Force hide these products
            wrongBrandCards.forEach(card => {
                card.style.display = 'none';
                card.setAttribute('data-filter-reason', 'EMERGENCY_HIDE_WRONG_BRAND');
            });
        } else {
            console.log('%c PRODUCT CARD FIX: All visible products match the selected brand', 'background: green; color: white;');
        }
    }
    
    function extractBrandFromTitle(title) {
        // Convert to lowercase for case-insensitive matching
        const lowerTitle = title.toLowerCase();
        
        // Check for known brand names in the title
        if (lowerTitle.includes('nike')) return 'nike';
        if (lowerTitle.includes('adidas')) return 'adidas';
        if (lowerTitle.includes('puma')) return 'puma';
        if (lowerTitle.includes('reebok')) return 'reebok';
        if (lowerTitle.includes('asics')) return 'asics';
        if (lowerTitle.includes('converse')) return 'converse';
        if (lowerTitle.includes('new balance')) return 'newbalance';
        if (lowerTitle.includes('jordan')) return 'jordan';
        if (lowerTitle.includes('onitsuka')) return 'onitsuka tiger';
        
        // No brand found
        return null;
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
    
    // Run the fix immediately
    fixProductCards();
    
    // Add a global helper function for debugging
    window.debugProductCards = function() {
        console.log('%c PRODUCT CARD DEBUG', 'background: blue; color: white; padding: 5px; font-weight: bold;');
        
        // Get all product cards
        const productCards = document.querySelectorAll('.product-card');
        console.log(`Total product cards: ${productCards.length}`);
        
        // Count products by brand
        const brandCounts = {};
        productCards.forEach(card => {
            const brand = card.getAttribute('data-brand') || 'unknown';
            brandCounts[brand] = (brandCounts[brand] || 0) + 1;
        });
        console.log('Products by brand:', brandCounts);
        
        // Count visible products by brand
        const visibleBrandCounts = {};
        productCards.forEach(card => {
            if (window.getComputedStyle(card).display !== 'none') {
                const brand = card.getAttribute('data-brand') || 'unknown';
                visibleBrandCounts[brand] = (visibleBrandCounts[brand] || 0) + 1;
            }
        });
        console.log('VISIBLE products by brand:', visibleBrandCounts);
        
        return 'Product card debugging complete. Check console for details.';
    };
})(); 