/**
 * Consolidated Product Fixes
 * This file combines all product-related fixes into a single module
 */

const ProductFixes = (() => {
    // Private utility functions
    const $ = selector => document.querySelector(selector);
    const $$ = selector => document.querySelectorAll(selector);
    const formatPrice = price => `₹${price.toLocaleString('en-IN')}`;
    const getFloat = (el, attr) => parseFloat(el.getAttribute(attr));
    const getDataAttr = (el, attr) => el.getAttribute(`data-${attr}`);
    const log = (msg, ...args) => console.log(`PRODUCT FIXES: ${msg}`, ...args);

    // Currency module
    const currency = {
        format: formatPrice,
        update() {
            $$('.price').forEach(el => {
                const price = getFloat(el, 'data-price');
                if (!isNaN(price)) el.textContent = formatPrice(price);
            });
        }
    };

    // Filter module
    const filter = {
        init() {
            this.setupEventListeners();
            this.initializeState();
        },

        setupEventListeners() {
            // Checkbox filters
            $$('.filter-option input[type="checkbox"]').forEach(cb => 
                cb.addEventListener('change', () => this.applyFilters())
            );

            // Price inputs
            $$('.price-input input').forEach(input => 
                input.addEventListener('change', () => this.applyFilters())
            );
            
            // Filter buttons
            const applyBtn = $('.apply-filter');
            const clearBtn = $('.clear-filter');
            
            if (applyBtn) {
                log('Setting up Apply Filter button');
                applyBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    log('Apply filter button clicked');
                    this.applyFilters();
                });
            }
            
            if (clearBtn) {
                log('Setting up Clear Filter button');
                clearBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    log('Clear filter button clicked');
                    this.clearFilters();
                    this.applyFilters();
                });
            }
        },

        initializeState() {
            const params = new URLSearchParams(window.location.search);
            // ... rest of initialization logic
        },
        
        clearFilters() {
            log('Clearing all filters');
            
            // Reset checkboxes
            $$('input[type="checkbox"]').forEach(cb => cb.checked = false);
            
            // Reset price inputs
            const minInput = $('#min-price-input');
            const maxInput = $('#max-price-input');
            const minSlider = $('#min-price');
            const maxSlider = $('#max-price');
            
            if (minInput && maxInput && minSlider && maxSlider) {
                minInput.value = minSlider.min || 0;
                maxInput.value = maxSlider.max || 20000;
                minSlider.value = minSlider.min || 0;
                maxSlider.value = maxSlider.max || 20000;
            }
            
            // Show all products
            $$('.product-card').forEach(card => {
                card.style.display = 'flex';
            });
        },

        applyFilters() {
            log('Applying filters');
            this.updateProductDisplay(this.getSelectedFilters());
        },

        getSelectedFilters() {
            const filters = {
                brands: [],
                categories: [],
                sizes: [],
                priceRange: {
                    min: parseInt($('#min-price-input')?.value) || 0,
                    max: parseInt($('#max-price-input')?.value) || 20000
                }
            };

            $$('.filter-option input:checked').forEach(cb => {
                const type = cb.getAttribute('name');
                if (type && filters[type]) {
                    filters[type].push(cb.value);
                }
            });
            
            log('Selected filters:', filters);
            return filters;
        },

        updateProductDisplay(filters) {
            log('Updating product display with filters');
            $$('.product-card').forEach(product => {
                product.style.display = this.productMatchesFilters(product, filters) ? 'flex' : 'none';
            });
            
            // Apply sorting after filtering
            const sortSelect = $('#sort-select');
            if (sortSelect && typeof window.sortProducts === 'function') {
                window.sortProducts(sortSelect.value);
            }
        },

        productMatchesFilters(product, filters) {
            const brand = getDataAttr(product, 'brand');
            const category = getDataAttr(product, 'category');
            const sizes = getDataAttr(product, 'sizes')?.split(',') || [];
            const price = getFloat(product, 'data-price');

            return (
                (!filters.brands.length || filters.brands.includes(brand)) &&
                (!filters.categories.length || filters.categories.includes(category)) &&
                (!filters.sizes.length || filters.sizes.some(size => sizes.includes(size))) &&
                price >= filters.priceRange.min && price <= filters.priceRange.max
            );
        }
    };

    // Direct fixes module
    const direct = {
        init() {
            this.fixProductCards();
            this.setupQuickView();
        },

        fixProductCards() {
            $$('.product-card').forEach(card => {
                const img = card.querySelector('img');
                if (img && !img.src) {
                    img.src = img.getAttribute('data-src');
                }

                const price = card.querySelector('.price');
                if (price) {
                    currency.format(getFloat(price, 'data-price'));
                }
            });
        },

        setupQuickView() {
            $$('.quick-view-btn').forEach(btn => {
                btn.addEventListener('click', e => {
                    e.preventDefault();
                    this.showQuickView(getDataAttr(btn.closest('.product-card'), 'product-id'));
                });
            });
        },

        showQuickView(productId) {
            const modal = $('.quick-view-modal');
            const product = $(`[data-product-id="${productId}"]`);
            
            if (modal && product) {
                const modalImg = modal.querySelector('.modal-image img');
                const modalTitle = modal.querySelector('.modal-title');
                const modalPrice = modal.querySelector('.modal-price');

                modalImg.src = product.querySelector('img').src;
                modalTitle.textContent = product.querySelector('h3').textContent;
                modalPrice.textContent = product.querySelector('.price').textContent;
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    };

    // Public API
    return {
        currency,
        filter,
        direct,
        init() {
            log('Initializing ProductFixes module');
            currency.update();
            filter.init();
            direct.init();
        }
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing ProductFixes');
    ProductFixes.init();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductFixes;
} 