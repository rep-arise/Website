/**
 * CRITICAL FILTER FIX
 * This script ensures all products matching filters are displayed
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('FILTER FIX: Script loaded');
    
    // Global variables
    const BRAND_DATA = {};
    let ALL_PRODUCTS = [];
    
    // Wait for other scripts to load
    setTimeout(function() {
        console.log('FILTER FIX: Starting initialization');
        initializeFilterFix();
    }, 1000);
    
    // Function to initialize the filter fix
    function initializeFilterFix() {
        // Store reference to original products if available
        if (window.ALL_PRODUCTS && Array.isArray(window.ALL_PRODUCTS)) {
            ALL_PRODUCTS = window.ALL_PRODUCTS;
            console.log(`FILTER FIX: Found ${ALL_PRODUCTS.length} products in global variable`);
        } else {
            // Attempt to load products from JSON files
            loadAllProducts();
        }
        
        // Set up event listeners for filter buttons
        setupFilterEventListeners();
        
        // Apply initial fix to ensure all products are visible
        fixProductDisplay();
        
        // Set up periodic checks
        setInterval(fixProductDisplay, 1000);
    }
    
    // Function to load all products from JSON files
    function loadAllProducts() {
        console.log('FILTER FIX: Loading products from JSON files');
        
        Promise.all([
            fetch('man/products.json').then(res => res.json()).catch(() => []),
            fetch('women/products.json').then(res => res.json()).catch(() => []),
            fetch('unisex/products.json').then(res => res.json()).catch(() => [])
        ])
        .then(([menProducts, womenProducts, unisexProducts]) => {
            ALL_PRODUCTS = [...menProducts, ...womenProducts, ...unisexProducts];
            console.log(`FILTER FIX: Loaded ${ALL_PRODUCTS.length} products from JSON files`);
            
            // Process products by brand for quick access
            ALL_PRODUCTS.forEach(product => {
                const brand = normalizeBrandName(product.brand);
                if (!BRAND_DATA[brand]) {
                    BRAND_DATA[brand] = [];
                }
                BRAND_DATA[brand].push(product);
            });
            
            // Log brand data
            Object.keys(BRAND_DATA).forEach(brand => {
                console.log(`FILTER FIX: Brand ${brand} has ${BRAND_DATA[brand].length} products`);
            });
            
            // Apply fix after loading
            fixProductDisplay();
        })
        .catch(error => {
            console.error('FILTER FIX: Error loading products:', error);
        });
    }
    
    // Function to normalize brand names
    function normalizeBrandName(brand) {
        brand = (brand || '').toLowerCase().trim();
        
        // Special case handling
        if (brand === 'new-balance') return 'newbalance';
        if (brand === 'newbalance') return 'newbalance';
        if (brand === 'onitsuka-tiger') return 'onitsuka tiger';
        if (brand === 'onitsuka tiger') return 'onitsuka tiger';
        if (brand === 'air-jordan') return 'jordan';
        
        return brand;
    }
    
    // Function to set up event listeners for filter buttons
    function setupFilterEventListeners() {
        // Apply filter button
        const applyFilterBtn = document.querySelector('.apply-filter');
        if (applyFilterBtn) {
            applyFilterBtn.addEventListener('click', function() {
                console.log('FILTER FIX: Apply filter button clicked');
                setTimeout(fixProductDisplay, 100);
            });
        }
        
        // Clear filter button
        const clearFilterBtn = document.querySelector('.clear-filter');
        if (clearFilterBtn) {
            clearFilterBtn.addEventListener('click', function() {
                console.log('FILTER FIX: Clear filter button clicked');
                setTimeout(fixProductDisplay, 100);
            });
        }
        
        // Brand checkboxes
        document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                console.log(`FILTER FIX: Brand checkbox ${checkbox.value} changed to ${checkbox.checked}`);
                setTimeout(fixProductDisplay, 100);
            });
        });
    }
    
    // Function to get selected filters
    function getSelectedFilters() {
        const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
            .map(checkbox => normalizeBrandName(checkbox.value));
            
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
            .map(checkbox => checkbox.value);
            
        const selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked'))
            .map(checkbox => checkbox.value.replace('uk-', ''));
            
        const minPrice = parseInt(document.getElementById('min-price-input')?.value || 0);
        const maxPrice = parseInt(document.getElementById('max-price-input')?.value || 10000);
        
        return {
            brands: selectedBrands,
            categories: selectedCategories,
            sizes: selectedSizes,
            minPrice,
            maxPrice
        };
    }
    
    // Function to check if a product matches the filters
    function productMatchesFilters(product, filters) {
        // Brand matching
        const meetsBrand = filters.brands.length === 0 || 
            filters.brands.includes(normalizeBrandName(product.brand));
            
        // Price matching
        const meetsPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
        
        // Category matching with unisex handling
        let meetsCategory = false;
        if (filters.categories.length === 0) {
            meetsCategory = true;
        } else if (filters.categories.includes('men') && (product.category === 'men' || product.category === 'unisex')) {
            meetsCategory = true;
        } else if (filters.categories.includes('women') && (product.category === 'women' || product.category === 'unisex')) {
            meetsCategory = true;
        } else if (filters.categories.includes(product.category)) {
            meetsCategory = true;
        }
        
        // Size matching
        const meetsSize = filters.sizes.length === 0 || 
            filters.sizes.some(size => product.sizes.includes(size));
            
        return meetsBrand && meetsPrice && meetsCategory && meetsSize;
    }
    
    // Function to fix product display
    function fixProductDisplay() {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) {
            console.error('FILTER FIX: Products grid not found');
            return;
        }
        
        // Get all product cards
        const productCards = productsGrid.querySelectorAll('.product-card');
        if (productCards.length === 0) {
            console.warn('FILTER FIX: No product cards found in grid');
            return;
        }
        
        // Get selected filters
        const filters = getSelectedFilters();
        console.log('FILTER FIX: Selected filters', filters);
        
        // Check if any brand filter is applied
        if (filters.brands.length > 0) {
            console.log(`FILTER FIX: Brand filter applied for: ${filters.brands.join(', ')}`);
            
            // Count visible products for each selected brand
            filters.brands.forEach(brand => {
                const brandCards = Array.from(productCards).filter(card => 
                    normalizeBrandName(card.getAttribute('data-brand')) === brand
                );
                
                const visibleBrandCards = brandCards.filter(card => 
                    window.getComputedStyle(card).display !== 'none'
                );
                
                console.log(`FILTER FIX: Brand ${brand} - Total cards: ${brandCards.length}, Visible cards: ${visibleBrandCards.length}`);
                
                // If we have brand data and there's a mismatch, fix it
                if (BRAND_DATA[brand] && BRAND_DATA[brand].length > 0) {
                    const expectedCount = BRAND_DATA[brand].filter(product => 
                        productMatchesFilters(product, {
                            ...filters,
                            brands: [] // Remove brand filter since we're already filtering by this brand
                        })
                    ).length;
                    
                    console.log(`FILTER FIX: Brand ${brand} - Expected visible cards: ${expectedCount}`);
                    
                    // If we have fewer visible cards than expected, force them all to be visible
                    if (visibleBrandCards.length < expectedCount || visibleBrandCards.length <= 1) {
                        console.warn(`FILTER FIX: Fixing display for brand ${brand} - forcing all matching cards to be visible`);
                        
                        // Force all matching cards to be visible
                        brandCards.forEach(card => {
                            // Check if this card should be visible based on other filters
                            const price = parseInt(card.getAttribute('data-price') || 0);
                            const category = card.getAttribute('data-category') || '';
                            const sizes = (card.getAttribute('data-sizes') || '').split(',');
                            
                            const meetsPrice = price >= filters.minPrice && price <= filters.maxPrice;
                            
                            let meetsCategory = false;
                            if (filters.categories.length === 0) {
                                meetsCategory = true;
                            } else if (filters.categories.includes('men') && (category === 'men' || category === 'unisex')) {
                                meetsCategory = true;
                            } else if (filters.categories.includes('women') && (category === 'women' || category === 'unisex')) {
                                meetsCategory = true;
                            } else if (filters.categories.includes(category)) {
                                meetsCategory = true;
                            }
                            
                            const meetsSize = filters.sizes.length === 0 || 
                                filters.sizes.some(size => sizes.includes(size));
                            
                            if (meetsPrice && meetsCategory && meetsSize) {
                                card.style.display = 'flex';
                                card.classList.add('filter-fix-forced');
                            }
                        });
                    }
                }
            });
        }
        
        // Check total visible products
        const visibleCards = Array.from(productCards).filter(card => 
            window.getComputedStyle(card).display !== 'none'
        );
        
        console.log(`FILTER FIX: Total visible cards: ${visibleCards.length}`);
        
        // If we have no visible products but should have some, show all products
        if (visibleCards.length === 0 && !areFiltersEmpty(filters)) {
            console.warn('FILTER FIX: No visible products but filters are applied, resetting filters');
            resetFilters();
        }
        
        // Fix grid layout
        fixGridLayout();
    }
    
    // Function to check if filters are empty
    function areFiltersEmpty(filters) {
        return filters.brands.length === 0 && 
               filters.categories.length === 0 && 
               filters.sizes.length === 0 && 
               filters.minPrice <= 50 && 
               filters.maxPrice >= 200;
    }
    
    // Function to reset filters
    function resetFilters() {
        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset price range
        const minPriceInput = document.getElementById('min-price-input');
        const maxPriceInput = document.getElementById('max-price-input');
        const minPriceSlider = document.getElementById('min-price');
        const maxPriceSlider = document.getElementById('max-price');
        
        if (minPriceInput && maxPriceInput && minPriceSlider && maxPriceSlider) {
            minPriceInput.value = minPriceSlider.min || 50;
            maxPriceInput.value = maxPriceSlider.max || 200;
            minPriceSlider.value = minPriceSlider.min || 50;
            maxPriceSlider.value = maxPriceSlider.max || 200;
        }
        
        // Show all products
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.display = 'flex';
        });
        
        console.log('FILTER FIX: Filters reset');
    }
    
    // Function to fix grid layout
    function fixGridLayout() {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;
        
        // Force grid display
        productsGrid.style.display = 'grid';
        productsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        productsGrid.style.gap = '2rem';
        productsGrid.style.maxHeight = 'none';
        productsGrid.style.overflow = 'visible';
        
        // Force all product cards to be properly displayed
        const visibleCards = Array.from(productsGrid.querySelectorAll('.product-card')).filter(card => 
            window.getComputedStyle(card).display !== 'none'
        );
        
        visibleCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'none';
            card.style.visibility = 'visible';
        });
    }
    
    // Monitor DOM changes to catch dynamically added elements
    const observer = new MutationObserver(mutations => {
        let shouldFix = false;
        
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                // Check if any added node is a product card or contains product cards
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && (
                            node.classList.contains('product-card') || 
                            node.querySelector('.product-card')
                        )) {
                            shouldFix = true;
                        }
                    }
                });
            }
        });
        
        if (shouldFix) {
            fixProductDisplay();
        }
    });
    
    // Start observing the document body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });
    
    console.log('FILTER FIX: Setup complete');
}); 