/**
 * CRITICAL FILTER FIX
 * This script ensures all products matching filters are displayed
 */

(() => {
    const log = (msg, ...args) => console.log(`FILTER FIX: ${msg}`, ...args);
    const error = (msg, ...args) => console.error(`FILTER FIX: ${msg}`, ...args);
    const warn = (msg, ...args) => console.warn(`FILTER FIX: ${msg}`, ...args);

    // Brand name normalization map
    const BRAND_MAP = {
        'new-balance': 'newbalance',
        'newbalance': 'newbalance',
        'onitsuka-tiger': 'onitsuka tiger',
        'onitsuka tiger': 'onitsuka tiger',
        'air-jordan': 'jordan'
    };

    // Global state
    const state = {
        brandData: {},
        products: [],
        initialized: false,
        activeFilters: {
            brands: [],
            categories: [],
            sizes: [],
            minPrice: 0,
            maxPrice: 10000
        }
    };

    // Normalize brand names for consistent matching
    const normalizeBrandName = brand => BRAND_MAP[brand?.toLowerCase().trim()] || brand?.toLowerCase().trim() || '';

    // Load all products from JSON files
    const loadAllProducts = async () => {
        log('Loading products from JSON files');
        
        try {
            const [menProducts, womenProducts, unisexProducts] = await Promise.all([
                fetch('man/products.json').then(res => res.json()).catch(() => []),
                fetch('women/products.json').then(res => res.json()).catch(() => []),
                fetch('unisex/products.json').then(res => res.json()).catch(() => [])
            ]);

            state.products = [...menProducts, ...womenProducts, ...unisexProducts];
            log(`Loaded ${state.products.length} products from JSON files`);
            
            // Process products by brand for quick access
            state.products.forEach(product => {
                const brand = normalizeBrandName(product.brand);
                (state.brandData[brand] = state.brandData[brand] || []).push(product);
            });
            
            Object.entries(state.brandData).forEach(([brand, products]) => {
                log(`Brand ${brand} has ${products.length} products`);
            });
            
            state.initialized = true;
            applyFilters(); // Apply filters after products are loaded
        } catch (err) {
            error('Error loading products:', err);
        }
    };

    // Get selected filters
    const getSelectedFilters = () => {
        const filters = {
            brands: Array.from(document.querySelectorAll('input[name="brand"]:checked'))
                .map(cb => normalizeBrandName(cb.value)),
            categories: Array.from(document.querySelectorAll('input[name="category"]:checked'))
                .map(cb => cb.value),
            sizes: Array.from(document.querySelectorAll('input[name="size"]:checked'))
                .map(cb => cb.value.replace('uk-', '')),
            minPrice: parseInt(document.getElementById('min-price-input')?.value || 0),
            maxPrice: parseInt(document.getElementById('max-price-input')?.value || 10000)
        };
        
        // Save current filters to state
        state.activeFilters = filters;
        
        return filters;
    };

    // Check if a product matches the filters
    const productMatchesFilters = (product, filters) => {
        const meetsBrand = !filters.brands.length || filters.brands.includes(normalizeBrandName(product.brand));
        const meetsPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
        const meetsSize = !filters.sizes.length || filters.sizes.some(size => product.sizes.includes(size));
        
        let meetsCategory = !filters.categories.length;
        if (!meetsCategory) {
            const isUnisex = product.category === 'unisex';
            meetsCategory = filters.categories.includes(product.category) ||
                           (filters.categories.includes('men') && (product.category === 'men' || isUnisex)) ||
                           (filters.categories.includes('women') && (product.category === 'women' || isUnisex));
        }
        
        return meetsBrand && meetsPrice && meetsCategory && meetsSize;
    };

    // Apply filters to product grid
    const applyFilters = () => {
        if (!state.initialized) {
            log('Cannot apply filters - not initialized yet');
            return;
        }
        
        const grid = document.querySelector('.products-grid');
        if (!grid) {
            error('Products grid not found');
            return;
        }

        const filters = getSelectedFilters();
        log('Applying filters:', filters);
        
        // Get all product cards
        const allCards = Array.from(grid.querySelectorAll('.product-card'));
        if (!allCards.length) {
            warn('No product cards found in grid');
            return;
        }
        
        // Reset all cards to hidden first
        allCards.forEach(card => {
            card.style.display = 'none';
            card.classList.remove('filter-fix-forced');
        });
        
        // Handle brand filtering specifically
        if (filters.brands.length > 0) {
            log(`Brand filter applied for: ${filters.brands.join(', ')}`);
            
            // For each selected brand
            filters.brands.forEach(brand => {
                // Get all cards for this brand
                const brandCards = allCards.filter(card => 
                    normalizeBrandName(card.getAttribute('data-brand')) === brand
                );
                
                log(`Found ${brandCards.length} cards for brand ${brand}`);
                
                // Show cards that match other filters
                brandCards.forEach(card => {
                    const cardData = {
                        price: parseInt(card.getAttribute('data-price') || 0),
                        category: card.getAttribute('data-category') || '',
                        sizes: (card.getAttribute('data-sizes') || '').split(',')
                    };
                    
                    const meetsPrice = cardData.price >= filters.minPrice && cardData.price <= filters.maxPrice;
                    const meetsSize = !filters.sizes.length || filters.sizes.some(size => cardData.sizes.includes(size));
                    
                    let meetsCategory = !filters.categories.length;
                    if (!meetsCategory) {
                        const isUnisex = cardData.category === 'unisex';
                        meetsCategory = filters.categories.includes(cardData.category) ||
                                      (filters.categories.includes('men') && (cardData.category === 'men' || isUnisex)) ||
                                      (filters.categories.includes('women') && (cardData.category === 'women' || isUnisex));
                    }
                    
                    if (meetsPrice && meetsCategory && meetsSize) {
                        card.style.display = 'flex';
                        card.classList.add('filter-fix-forced');
                    }
                });
            });
        } else {
            // No brand filter, apply other filters
            allCards.forEach(card => {
                const cardData = {
                    price: parseInt(card.getAttribute('data-price') || 0),
                    category: card.getAttribute('data-category') || '',
                    sizes: (card.getAttribute('data-sizes') || '').split(',')
                };
                
                const meetsPrice = cardData.price >= filters.minPrice && cardData.price <= filters.maxPrice;
                const meetsSize = !filters.sizes.length || filters.sizes.some(size => cardData.sizes.includes(size));
                
                let meetsCategory = !filters.categories.length;
                if (!meetsCategory) {
                    const isUnisex = cardData.category === 'unisex';
                    meetsCategory = filters.categories.includes(cardData.category) ||
                                  (filters.categories.includes('men') && (cardData.category === 'men' || isUnisex)) ||
                                  (filters.categories.includes('women') && (cardData.category === 'women' || isUnisex));
                }
                
                if (meetsPrice && meetsCategory && meetsSize) {
                    card.style.display = 'flex';
                }
            });
        }
        
        // Apply sorting after filtering
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect && typeof sortProducts === 'function') {
            sortProducts(sortSelect.value);
            log(`Applied sorting: ${sortSelect.value}`);
        }
    };

    // Check if filters are empty
    const areFiltersEmpty = filters => (
        !filters.brands.length &&
        !filters.categories.length &&
        !filters.sizes.length &&
        filters.minPrice === 0 &&
        filters.maxPrice === 10000
    );

    // Reset filters
    const resetFilters = () => {
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        
        const minInput = document.getElementById('min-price-input');
        const maxInput = document.getElementById('max-price-input');
        const minSlider = document.getElementById('min-price');
        const maxSlider = document.getElementById('max-price');
        
        if (minInput && maxInput && minSlider && maxSlider) {
            minInput.value = minSlider.min;
            maxInput.value = maxSlider.max;
            minSlider.value = minSlider.min;
            maxSlider.value = maxSlider.max;
        }
        
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.display = 'flex';
            card.classList.remove('filter-fix-forced');
        });
        
        // Reset state filters
        state.activeFilters = {
            brands: [],
            categories: [],
            sizes: [],
            minPrice: 0,
            maxPrice: 10000
        };
    };

    // Fix grid layout
    const fixGridLayout = () => {
        const grid = document.querySelector('.products-grid');
        if (!grid) return;

        const cards = grid.querySelectorAll('.product-card');
        if (!cards.length) return;

        const gridGap = 20;
        const cardWidth = cards[0].offsetWidth + gridGap;
        const gridWidth = grid.offsetWidth;
        const cardsPerRow = Math.floor(gridWidth / cardWidth);
        
        if (cardsPerRow > 1) {
            grid.style.gridTemplateColumns = `repeat(${cardsPerRow}, 1fr)`;
        }
    };

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        log('Script loaded');
        
        setTimeout(() => {
            log('Starting initialization');
            
            // Store reference to original products if available
            if (window.ALL_PRODUCTS?.length) {
                state.products = window.ALL_PRODUCTS;
                log(`Found ${state.products.length} products in global variable`);
                
                // Process products by brand
                state.products.forEach(product => {
                    const brand = normalizeBrandName(product.brand);
                    (state.brandData[brand] = state.brandData[brand] || []).push(product);
                });
                
                state.initialized = true;
            } else {
                loadAllProducts();
            }

            // Set up event listeners
            const applyBtn = document.querySelector('.apply-filter');
            const clearBtn = document.querySelector('.clear-filter');
            
            applyBtn?.addEventListener('click', () => {
                log('Apply filter clicked');
                applyFilters();
            });

            clearBtn?.addEventListener('click', () => {
                log('Clear filter clicked');
                resetFilters();
                applyFilters();
            });

            document.querySelectorAll('input[name="brand"]').forEach(cb => {
                cb.addEventListener('change', () => {
                    log(`Brand checkbox ${cb.value} changed to ${cb.checked}`);
                    applyFilters();
                });
            });
            
            // Listen for sort changes
            const sortSelect = document.getElementById('sort-select');
            if (sortSelect) {
                sortSelect.addEventListener('change', () => {
                    log(`Sort changed to ${sortSelect.value}`);
                    if (typeof sortProducts === 'function') {
                        sortProducts(sortSelect.value);
                    }
                });
            }

            // Initial fixes
            applyFilters();
            fixGridLayout();
            
            // Set up periodic check for layout only
            window.addEventListener('resize', fixGridLayout);
        }, 1000);
    });
})(); 
})(); 