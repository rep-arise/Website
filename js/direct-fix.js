/**
 * DIRECT FIX - STANDALONE PRODUCT LOADER & FILTER
 * This script completely bypasses all other product loading and filtering scripts
 * to ensure products from all JSON files are properly loaded and filtered.
 */

(() => {
    // Constants
    const CONFIG = {
        initDelay: 300,
        defaultSizes: ['7', '8', '9', '10', '11'],
        brandNames: ['Nike', 'Adidas', 'Jordan', 'New Balance', 'Puma', 'Reebok', 'Asics', 'Converse'],
        jsonPaths: {
            men: '/man/products.json',
            women: '/women/products.json',
            unisex: '/unisex/products.json'
        },
        defaultSort: 'new' // Default sort is "Newest"
    };

    // State management to fix race conditions
    const state = {
        allProducts: [],
        filteredProducts: [],
        currentFilters: {
            brands: [],
            categories: [],
            sizes: [],
            minPrice: 0,
            maxPrice: 10000
        },
        currentSort: CONFIG.defaultSort,
        isInitialized: false
    };

    // DOM helper functions
    const $ = selector => document.querySelector(selector);
    const $$ = selector => document.querySelectorAll(selector);
    const createElement = (tag, className) => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        return el;
    };

    // Product management
    const productManager = {
        async loadAllProducts() {
            console.log("DIRECT FIX: Loading products from JSON files");
            
            try {
                const fetchJson = async url => {
                try {
                    console.log(`DIRECT FIX: Fetching ${url}`);
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
                        }
                    return await response.json();
                } catch (error) {
                    console.error(`DIRECT FIX: Error fetching ${url}:`, error);
                    return { products: [] };
                }
            };
            
            const [menData, womenData, unisexData] = await Promise.all([
                    fetchJson(CONFIG.jsonPaths.men),
                    fetchJson(CONFIG.jsonPaths.women),
                    fetchJson(CONFIG.jsonPaths.unisex)
                ]);

            const allProducts = [
                ...(menData.products || []),
                ...(womenData.products || []),
                ...(unisexData.products || [])
            ];
            
                const validProducts = this.validateAndNormalizeProducts(allProducts);
                this.logProductStats(validProducts);

                // Mark all products as loaded and store in state
                state.allProducts = validProducts;
                
                // Apply default sorting immediately
                return this.sortProducts(validProducts, CONFIG.defaultSort);
            } catch (error) {
                console.error("DIRECT FIX: Failed to load products:", error);
                return [];
            }
        },

        validateAndNormalizeProducts(products) {
            return products.filter(product => {
                if (!this.isValidProduct(product)) {
                    console.error("DIRECT FIX: Invalid product found:", product);
                    return false;
                }
                
                this.normalizeProduct(product);
                return true;
            });
        },

        isValidProduct(product) {
            return product && product.name && product.price && product.image;
        },

        normalizeProduct(product) {
            // Set brand
                    if (!product.brand) {
                product.brand = CONFIG.brandNames.find(brand => 
                    product.name.includes(brand)
                ) || 'Unknown';
                }
                
                // Normalize Nike brand name
                if (product.brand.toLowerCase().includes('nike')) {
                    product.brand = 'Nike';
                    console.log(`DIRECT FIX: Normalized Nike product - ${product.name}`);
                }
                
            // Set defaults for missing fields
            product.category = product.category || 'unisex';
            product.collection = product.collection || 'General';
            product.sizes = Array.isArray(product.sizes) && product.sizes.length ? 
                           product.sizes : CONFIG.defaultSizes;
            
            // Ensure 'new' property is a boolean
            product.new = Boolean(product.new);
        },

        logProductStats(products) {
            console.log(`DIRECT FIX: Loaded ${products.length} valid products`);
            
            const brandCounts = products.reduce((counts, product) => {
                const brand = product.brand || 'Unknown';
                counts[brand] = (counts[brand] || 0) + 1;
                return counts;
            }, {});
            
            console.log("DIRECT FIX: Products by brand:", brandCounts);
        },
        
        // Move sorting logic to product manager for better organization
        sortProducts(products, sortType) {
            if (!products || !products.length) {
                console.error("DIRECT FIX: Cannot sort empty products array");
                return products;
            }
            
            console.log(`DIRECT FIX: Sorting products by ${sortType}`);
            state.currentSort = sortType;
            
            // Create a copy to avoid modifying the original array
            const sortedProducts = [...products];
            
            switch (sortType) {
                case 'new':
                    return sortedProducts.sort((a, b) => (b.new === true) - (a.new === true));
                case 'price-low':
                    return sortedProducts.sort((a, b) => a.price - b.price);
                case 'price-high':
                    return sortedProducts.sort((a, b) => b.price - a.price);
                case 'name-asc':
                    return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                case 'name-desc':
                    return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
                default:
                    console.warn(`DIRECT FIX: Unknown sort type: ${sortType}, using default (new)`);
                    return sortedProducts.sort((a, b) => (b.new === true) - (a.new === true));
            }
        },
        
        // Filter products based on criteria
        filterProducts(products, filters) {
            if (!products || !products.length) {
                console.error("DIRECT FIX: Cannot filter empty products array");
                return products;
            }
            
            console.log("DIRECT FIX: Filtering products with filters:", filters);
            
            // Store current filters in state
            state.currentFilters = {...filters};
            
            return products.filter(product => {
                // Brand filter
                if (filters.brands.length && !filters.brands.includes(product.brand)) {
                    return false;
                }
                
                // Price filter
                if (product.price < filters.minPrice || product.price > filters.maxPrice) {
                    return false;
                }
                
                // Size filter
                if (filters.sizes.length && !filters.sizes.some(size => product.sizes.includes(size))) {
                    return false;
                }
                
                // Category filter
                if (filters.categories.length) {
                    const isUnisex = product.category === 'unisex';
                    const categoryMatch = 
                        filters.categories.includes(product.category) ||
                        (filters.categories.includes('men') && (product.category === 'men' || isUnisex)) ||
                        (filters.categories.includes('women') && (product.category === 'women' || isUnisex));
                    
                    if (!categoryMatch) {
                        return false;
                    }
                }
                
                return true;
            });
        }
    };

    // UI management
    const uiManager = {
        renderProducts(products) {
            const grid = $('.products-grid');
            if (!grid) {
                console.error("DIRECT FIX: Products grid not found");
                return;
            }
            
            console.log(`DIRECT FIX: Rendering ${products.length} products`);
            
            // Store the filtered products in state
            state.filteredProducts = products;
            
            // Clear the grid before rendering
            grid.innerHTML = '';
        
            products.forEach((product, index) => {
                try {
                    grid.appendChild(this.createProductCard(product));
                    
                    if (index % 20 === 0 && index > 0) {
                        console.log(`DIRECT FIX: Rendered ${index}/${products.length} products`);
                    }
                } catch (error) {
                    console.error(`DIRECT FIX: Error rendering product:`, product, error);
                }
            });

            console.log(`DIRECT FIX: Rendered all ${products.length} products`);
            this.setupQuickView();
        },

        createProductCard(product) {
            const card = createElement('div', 'product-card');
            
            Object.entries({
                'data-price': product.price,
                'data-brand': product.brand,
                'data-category': product.category,
                'data-collection': product.collection.replace(/ /g, '-'),
                'data-sizes': product.sizes.join(','),
                'data-new': product.new ? 'true' : null
            }).forEach(([attr, value]) => {
                if (value !== null) card.setAttribute(attr, value);
            });
                
                card.innerHTML = `
                    ${product.new ? '<div class="product-tag new">New</div>' : ''}
                    <div class="product-category-tag${product.category === 'unisex' ? ' unisex' : ''}">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-brand">${product.brand}</div>
                        <div class="price">$${product.price}</div>
                    </div>
                    <div class="product-actions">
                        <button class="btn quick-view-btn">Quick View</button>
                    </div>
                `;
                
            return card;
        },

        setupQuickView() {
            const modal = $('.quick-view-modal');
            const closeBtn = $('.close-modal');
            const quickViewBtns = $$('.quick-view-btn');

            if (!modal || !closeBtn || !quickViewBtns.length) {
                console.error("DIRECT FIX: Quick view elements not found");
                return;
            }
        
            console.log(`DIRECT FIX: Setting up quick view for ${quickViewBtns.length} buttons`);
        
            closeBtn.addEventListener('click', () => this.closeQuickView(modal));

            quickViewBtns.forEach(btn => {
                btn.addEventListener('click', () => this.openQuickView(btn, modal));
            });
        },

        closeQuickView(modal) {
            modal.classList.remove('active');
            $('.filter-overlay')?.classList.remove('active');
        },

        openQuickView(btn, modal) {
            const card = btn.closest('.product-card');
            if (!card) return;

            const productName = card.querySelector('h3')?.textContent;
            const productPrice = card.querySelector('.price')?.textContent;
            const productImage = card.querySelector('img')?.src;
            const productBrand = card.getAttribute('data-brand');
            const productCategory = card.getAttribute('data-category');

            modal.querySelector('.modal-product-title').textContent = productName || 'Product Name';
            modal.querySelector('.modal-product-price').textContent = productPrice || '$0';
            modal.querySelector('.modal-product-image').src = productImage || '';
            modal.querySelector('.modal-product-brand').textContent = productBrand || 'Brand';
            modal.querySelector('.modal-product-category').textContent = productCategory || 'Category';

            modal.classList.add('active');
            $('.filter-overlay')?.classList.add('active');
        },

        init(products) {
            console.log("DIRECT FIX: Initializing UI");
            
            // Always apply default sort first
            const sortedProducts = productManager.sortProducts(products, CONFIG.defaultSort);
            
            // Set the sort select to match the default sort
            const sortSelect = $('#sort-select');
            if (sortSelect) {
                sortSelect.value = CONFIG.defaultSort;
                sortSelect.addEventListener('change', (e) => {
                    const sortValue = e.target.value;
                    console.log(`DIRECT FIX: Sort changed to ${sortValue}`);
                    
                    // Apply sorting to the current filtered products
                    const sortedProducts = productManager.sortProducts(state.filteredProducts, sortValue);
                    this.renderProducts(sortedProducts);
                });
            }
            
            // Set up filter handlers
            const applyBtn = $('.apply-filter');
            const clearBtn = $('.clear-filter');
            
            if (applyBtn) {
                applyBtn.addEventListener('click', () => {
                    this.applyFilters(state.allProducts);
                });
            }
            
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    this.clearFilters(state.allProducts);
                });
            }
            
            // Initial render with sorted products
            this.renderProducts(sortedProducts);
            
            // Mark as initialized
            state.isInitialized = true;
        },

        applyFilters(products) {
            console.log("DIRECT FIX: Applying filters");
            
            // Get filter values
            const filters = {
                brands: Array.from($$('input[name="brand"]:checked')).map(cb => cb.value),
                categories: Array.from($$('input[name="category"]:checked')).map(cb => cb.value),
                sizes: Array.from($$('input[name="size"]:checked')).map(cb => cb.value.replace('uk-', '')),
                minPrice: parseInt($('#min-price-input')?.value || 0),
                maxPrice: parseInt($('#max-price-input')?.value || 10000)
            };
            
            // Check if any filter is applied
            const isAnyFilterApplied = 
                filters.brands.length > 0 || 
                filters.categories.length > 0 || 
                filters.sizes.length > 0 || 
                filters.minPrice > 0 || 
                filters.maxPrice < 10000;
            
            console.log("DIRECT FIX: Filters applied:", filters, "Any filter applied:", isAnyFilterApplied);
            
            // Filter the products
            const filteredProducts = isAnyFilterApplied 
                ? productManager.filterProducts(products, filters) 
                : products;
            
            // Apply current sort to filtered products
            const sortedFilteredProducts = productManager.sortProducts(
                filteredProducts, 
                state.currentSort || CONFIG.defaultSort
            );
            
            // Render the filtered and sorted products
            this.renderFilteredProducts(sortedFilteredProducts, isAnyFilterApplied);
        },

        renderFilteredProducts(products, isAnyFilterApplied) {
            console.log(`DIRECT FIX: Rendering ${products.length} filtered products`);
            
            // Update the count display
            const countElement = $('.filter-count');
            if (countElement) {
                countElement.textContent = `${products.length} Products`;
            }
            
            // Show "no results" message if needed
            const noResultsElement = $('.no-results');
            if (noResultsElement) {
                if (products.length === 0 && isAnyFilterApplied) {
                    noResultsElement.style.display = 'block';
                } else {
                    noResultsElement.style.display = 'none';
                }
            }
            
            // Render the products
            this.renderProducts(products);
            
            // Close the filter sidebar on mobile
            const filterSidebar = $('.filter-sidebar');
            const filterOverlay = $('.filter-overlay');
            
            if (window.innerWidth < 768 && filterSidebar && filterOverlay) {
                filterSidebar.classList.remove('active');
                filterOverlay.classList.remove('active');
            }
        },

        clearFilters(products) {
            console.log("DIRECT FIX: Clearing all filters");
            
            // Uncheck all checkboxes
            $$('input[type="checkbox"]').forEach(cb => cb.checked = false);
            
            // Reset price range
            const minInput = $('#min-price-input');
            const maxInput = $('#max-price-input');
            const minSlider = $('#min-price');
            const maxSlider = $('#max-price');
            
            if (minInput && maxInput && minSlider && maxSlider) {
                minInput.value = minSlider.min || 0;
                maxInput.value = maxSlider.max || 10000;
                minSlider.value = minSlider.min || 0;
                maxSlider.value = maxSlider.max || 10000;
            }
            
            // Reset filter state
            state.currentFilters = {
                brands: [],
                categories: [],
                sizes: [],
                minPrice: 0,
                maxPrice: 10000
            };
            
            // Apply default sort to all products
            const sortedProducts = productManager.sortProducts(products, state.currentSort || CONFIG.defaultSort);
            
            // Render all products with current sort
            this.renderFilteredProducts(sortedProducts, false);
        },

        sortProducts(sortType) {
            console.log(`DIRECT FIX: UI sorting by ${sortType}`);
            
            // Apply sorting to current filtered products
            const sortedProducts = productManager.sortProducts(state.filteredProducts, sortType);
            
            // Update current sort in state
            state.currentSort = sortType;
            
            // Render sorted products
            this.renderProducts(sortedProducts);
        }
    };

    // Initialize
    const init = async () => {
        console.log("DIRECT FIX: Starting initialization");
        
        try {
            // Check if we're on a product page
            const productGrid = $('.products-grid');
            if (!productGrid) {
                console.log("DIRECT FIX: Not on a product page, skipping initialization");
                return;
            }
            
            // Check URL for brand filter
            const urlParams = new URLSearchParams(window.location.search);
            const brandParam = urlParams.get('brand');
            
            console.log(`DIRECT FIX: URL brand parameter: ${brandParam}`);
            
            // Load all products
            const products = await productManager.loadAllProducts();
            console.log(`DIRECT FIX: Loaded ${products.length} products`);
            
            // Initialize UI
            uiManager.init(products);
            
            // Apply brand filter from URL if present
            if (brandParam) {
                console.log(`DIRECT FIX: Applying brand filter from URL: ${brandParam}`);
                
                // Find and check the corresponding brand checkbox
                const brandCheckbox = $(`input[name="brand"][value="${brandParam}"]`);
                if (brandCheckbox) {
                    brandCheckbox.checked = true;
                    
                    // Apply filters after a short delay to ensure DOM is ready
                    setTimeout(() => {
                        uiManager.applyFilters(products);
                    }, CONFIG.initDelay);
                }
            }
            
            console.log("DIRECT FIX: Initialization complete");
        } catch (error) {
            console.error("DIRECT FIX: Initialization failed:", error);
        }
    };

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 