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
            $$('.filter-option input[type="checkbox"]').forEach(cb => 
                cb.addEventListener('change', () => this.applyFilters())
            );

            $$('.price-input input').forEach(input => 
                input.addEventListener('change', () => this.applyFilters())
            );
        },

        initializeState() {
            const params = new URLSearchParams(window.location.search);
            // ... rest of initialization logic
        },

        applyFilters() {
            this.updateProductDisplay(this.getSelectedFilters());
        },

        getSelectedFilters() {
            const filters = {
                brands: [],
                categories: [],
                sizes: [],
                priceRange: {
                    min: getFloat($('#min-price-input'), 'value'),
                    max: getFloat($('#max-price-input'), 'value')
                }
            };

            $$('.filter-option input:checked').forEach(cb => {
                const type = cb.getAttribute('name');
                filters[type]?.push(cb.value);
            });

            return filters;
        },

        updateProductDisplay(filters) {
            $$('.product-card').forEach(product => {
                product.style.display = this.productMatchesFilters(product, filters) ? 'flex' : 'none';
            });
        },

        productMatchesFilters(product, filters) {
            const brand = getDataAttr(product, 'brand');
            const category = getDataAttr(product, 'category');
            const sizes = getDataAttr(product, 'sizes').split(',');
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
            currency.update();
            filter.init();
            direct.init();
        }
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', ProductFixes.init);

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductFixes;
} 