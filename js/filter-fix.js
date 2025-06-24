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
        products: []
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
            
            fixProductDisplay();
        } catch (err) {
            error('Error loading products:', err);
        }
    };

    // Get selected filters
    const getSelectedFilters = () => ({
        brands: Array.from(document.querySelectorAll('input[name="brand"]:checked'))
            .map(cb => normalizeBrandName(cb.value)),
        categories: Array.from(document.querySelectorAll('input[name="category"]:checked'))
            .map(cb => cb.value),
        sizes: Array.from(document.querySelectorAll('input[name="size"]:checked'))
            .map(cb => cb.value.replace('uk-', '')),
        minPrice: parseInt(document.getElementById('min-price-input')?.value || 0),
        maxPrice: parseInt(document.getElementById('max-price-input')?.value || 10000)
    });

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

    // Fix product display
    const fixProductDisplay = () => {
        const grid = document.querySelector('.products-grid');
        if (!grid) {
            error('Products grid not found');
            return;
        }

        const cards = grid.querySelectorAll('.product-card');
        if (!cards.length) {
            warn('No product cards found in grid');
            return;
        }

        const filters = getSelectedFilters();
        log('Selected filters', filters);

        if (filters.brands.length) {
            log(`Brand filter applied for: ${filters.brands.join(', ')}`);

            filters.brands.forEach(brand => {
                const brandCards = Array.from(cards).filter(card => 
                    normalizeBrandName(card.getAttribute('data-brand')) === brand
                );

                const visibleCards = brandCards.filter(card => 
                    window.getComputedStyle(card).display !== 'none'
                );

                log(`Brand ${brand} - Total: ${brandCards.length}, Visible: ${visibleCards.length}`);

                if (state.brandData[brand]?.length) {
                    const expectedCount = state.brandData[brand].filter(product => 
                        productMatchesFilters(product, { ...filters, brands: [] })
                    ).length;

                    log(`Brand ${brand} - Expected visible: ${expectedCount}`);

                    if (visibleCards.length < expectedCount || visibleCards.length <= 1) {
                        warn(`Fixing display for brand ${brand}`);
                        
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
                    }
                }
            });
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
            } else {
                loadAllProducts();
            }

            // Set up event listeners
            const applyBtn = document.querySelector('.apply-filter');
            const clearBtn = document.querySelector('.clear-filter');
            
            applyBtn?.addEventListener('click', () => {
                log('Apply filter clicked');
                setTimeout(fixProductDisplay, 100);
            });

            clearBtn?.addEventListener('click', () => {
                log('Clear filter clicked');
                setTimeout(fixProductDisplay, 100);
            });

            document.querySelectorAll('input[name="brand"]').forEach(cb => {
                cb.addEventListener('change', () => {
                    log(`Brand checkbox ${cb.value} changed to ${cb.checked}`);
                    setTimeout(fixProductDisplay, 100);
                });
            });

            // Initial fixes
            fixProductDisplay();
            fixGridLayout();
            
            // Set up periodic checks
            setInterval(fixProductDisplay, 1000);
            window.addEventListener('resize', fixGridLayout);
        }, 1000);
    });
})(); 