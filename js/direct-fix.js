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
        }
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

                return validProducts;
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
        },

        logProductStats(products) {
            console.log(`DIRECT FIX: Loaded ${products.length} valid products`);
            
            const brandCounts = products.reduce((counts, product) => {
                const brand = product.brand || 'Unknown';
                counts[brand] = (counts[brand] || 0) + 1;
                return counts;
            }, {});
            
            console.log("DIRECT FIX: Products by brand:", brandCounts);
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
                    <h3>${product.name}</h3>
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
            document.body.style.overflow = '';
        },

        openQuickView(btn, modal) {
            const card = btn.closest('.product-card');
            if (!card) return;

            const productName = card.querySelector('h3').textContent;
            const productPrice = card.getAttribute('data-price');
            const productImage = card.querySelector('img').src;
            const sizes = card.getAttribute('data-sizes').split(',');

            modal.querySelector('.modal-title').textContent = productName;
            modal.querySelector('.modal-price').textContent = '$' + productPrice;
            modal.querySelector('.modal-image img').src = productImage;
            modal.querySelector('.modal-description').textContent = 
                `Experience premium quality with our 1:1 replica of the ${productName}. Perfect craftsmanship, premium materials, and unbeatable comfort.`;

            modal.querySelector('.size-options').innerHTML = 
                sizes.map(size => `<button class="size-btn">UK ${size}</button>`).join('');

            modal.classList.add('active');
            $('.filter-overlay')?.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    // Filter management
    const filterManager = {
        init(products) {
            const applyBtn = $('.apply-filter');
            const clearBtn = $('.clear-filter');
            const sortSelect = $('#sort-select');

            if (!applyBtn) {
                console.error("DIRECT FIX: Apply filter button not found");
                return;
            }

            applyBtn.addEventListener('click', () => this.applyFilters(products));
            clearBtn?.addEventListener('click', () => this.clearFilters(products));
            sortSelect?.addEventListener('change', () => this.sortProducts(sortSelect.value));
        },

        applyFilters(products) {
            const getSelectedValues = selector => 
                Array.from($$(selector))
                    .filter(cb => cb.checked)
                    .map(cb => cb.value);

            const selectedBrands = getSelectedValues('input[name="brand"]');
            const selectedSizes = getSelectedValues('input[name="size"]');
            const selectedCategories = getSelectedValues('input[name="category"]');
            const minPrice = parseInt($('#min-price-input')?.value || 0);
            const maxPrice = parseInt($('#max-price-input')?.value || Infinity);

            const isAnyFilterApplied = selectedBrands.length > 0 || 
                                     selectedSizes.length > 0 || 
                                     selectedCategories.length > 0 || 
                                     minPrice > parseInt($('#min-price-input')?.min || 0) || 
                                     maxPrice < parseInt($('#max-price-input')?.max || Infinity);

            const filteredProducts = products.filter(product => {
                const price = parseInt(product.getAttribute('data-price'));
                const brand = product.getAttribute('data-brand');
                const category = product.getAttribute('data-category');
                const sizes = (product.getAttribute('data-sizes') || '').split(',');

                const meetsCategory = !selectedCategories.length || 
                                    (selectedCategories.includes('men') && (category === 'men' || category === 'unisex')) ||
                                    (selectedCategories.includes('women') && (category === 'women' || category === 'unisex'));

                return (price >= minPrice && price <= maxPrice) &&
                       (!selectedBrands.length || selectedBrands.includes(brand)) &&
                       (!selectedSizes.length || selectedSizes.some(size => sizes.includes(size))) &&
                       meetsCategory;
            });

            this.renderFilteredProducts(filteredProducts, isAnyFilterApplied);
            if (window.innerWidth < 992) {
                $('.mobile-filter-close')?.click();
            }
        },

        renderFilteredProducts(products, isAnyFilterApplied) {
            const grid = $('.products-grid');
            if (!grid) return;

            products.forEach(product => {
                product.style.display = 'flex';
            });

            let noProductsMsg = $('.no-products-message');
            if (!noProductsMsg && isAnyFilterApplied && !products.length) {
                noProductsMsg = createElement('div', 'no-products-message');
                noProductsMsg.textContent = 'No products available under the selected filter.';
                grid.parentNode?.insertBefore(noProductsMsg, grid);
            }

            if (noProductsMsg) {
                noProductsMsg.style.display = (isAnyFilterApplied && !products.length) ? 'block' : 'none';
            }

            this.sortProducts($('#sort-select')?.value || 'new');
        },

        clearFilters(products) {
            $$('input[type="checkbox"]').forEach(cb => cb.checked = false);

            const minInput = $('#min-price-input');
            const maxInput = $('#max-price-input');
            const minSlider = $('#min-price');
            const maxSlider = $('#max-price');

            if (minInput && minSlider) {
                minInput.value = minSlider.min;
                minSlider.value = minSlider.min;
            }

            if (maxInput && maxSlider) {
                maxInput.value = maxSlider.max;
                maxSlider.value = maxSlider.max;
            }

            $$('.product-card').forEach(card => card.style.display = 'flex');
            $('.no-products-message')?.style.display = 'none';
        },

        sortProducts(sortType) {
            const grid = $('.products-grid');
            if (!grid) return;

            const visibleProducts = Array.from(grid.children)
                .filter(card => window.getComputedStyle(card).display !== 'none');

            visibleProducts.sort((a, b) => {
                const priceA = parseInt(a.getAttribute('data-price')) || 0;
                const priceB = parseInt(b.getAttribute('data-price')) || 0;
                const isNewA = a.hasAttribute('data-new');
                const isNewB = b.hasAttribute('data-new');

                switch (sortType) {
                    case 'low-high': return priceA - priceB;
                    case 'high-low': return priceB - priceA;
                    case 'new':
                    default:
                        return isNewA !== isNewB ? (isNewA ? -1 : 1) : priceB - priceA;
                }
            });

            visibleProducts.forEach(product => grid.appendChild(product));
        }
    };

    // Main initialization
    const init = async () => {
        try {
            console.log("DIRECT FIX: Starting direct product fix");
            
            const products = await productManager.loadAllProducts();
            if (!products?.length) {
                console.error("DIRECT FIX: Failed to load any products");
                return;
            }
            
            uiManager.renderProducts(products);
            filterManager.init(products);
            
            console.log("DIRECT FIX: Initialization complete");
        } catch (error) {
            console.error("DIRECT FIX: Critical error during initialization", error);
        }
    };

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, CONFIG.initDelay));
    } else {
        setTimeout(init, CONFIG.initDelay);
    }
})(); 