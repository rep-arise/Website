/**
 * Consolidated Product Fixes
 * This file combines all product-related fixes into a single module
 */

const ProductFixes = {
    // Currency formatting and display
    currency: {
        format: function(price) {
            return `₹${price.toLocaleString('en-IN')}`;
        },
        
        update: function() {
            const priceElements = document.querySelectorAll('.price');
            priceElements.forEach(el => {
                const price = parseFloat(el.getAttribute('data-price'));
                if (!isNaN(price)) {
                    el.textContent = this.format(price);
                }
            });
        }
    },

    // Filter functionality
    filter: {
        init: function() {
            this.setupEventListeners();
            this.initializeState();
        },

        setupEventListeners: function() {
            const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => this.applyFilters());
            });

            // Price range handling
            const priceInputs = document.querySelectorAll('.price-input input');
            priceInputs.forEach(input => {
                input.addEventListener('change', () => this.applyFilters());
            });
        },

        initializeState: function() {
            // Initialize filter state from URL params if any
            const params = new URLSearchParams(window.location.search);
            // ... rest of initialization logic
        },

        applyFilters: function() {
            const selectedFilters = this.getSelectedFilters();
            this.updateProductDisplay(selectedFilters);
        },

        getSelectedFilters: function() {
            const filters = {
                brands: [],
                categories: [],
                sizes: [],
                priceRange: {
                    min: parseFloat(document.getElementById('min-price-input').value),
                    max: parseFloat(document.getElementById('max-price-input').value)
                }
            };

            // Collect selected checkboxes
            document.querySelectorAll('.filter-option input:checked').forEach(checkbox => {
                const type = checkbox.getAttribute('name');
                const value = checkbox.value;
                if (filters[type]) {
                    filters[type].push(value);
                }
            });

            return filters;
        },

        updateProductDisplay: function(filters) {
            const products = document.querySelectorAll('.product-card');
            products.forEach(product => {
                const matches = this.productMatchesFilters(product, filters);
                product.style.display = matches ? 'flex' : 'none';
            });
        },

        productMatchesFilters: function(product, filters) {
            // Check brand match
            const brand = product.getAttribute('data-brand');
            if (filters.brands.length && !filters.brands.includes(brand)) {
                return false;
            }

            // Check category match
            const category = product.getAttribute('data-category');
            if (filters.categories.length && !filters.categories.includes(category)) {
                return false;
            }

            // Check size match
            const sizes = product.getAttribute('data-sizes').split(',');
            if (filters.sizes.length && !filters.sizes.some(size => sizes.includes(size))) {
                return false;
            }

            // Check price range
            const price = parseFloat(product.getAttribute('data-price'));
            if (price < filters.priceRange.min || price > filters.priceRange.max) {
                return false;
            }

            return true;
        }
    },

    // Direct product fixes
    direct: {
        init: function() {
            this.fixProductCards();
            this.setupQuickView();
        },

        fixProductCards: function() {
            const cards = document.querySelectorAll('.product-card');
            cards.forEach(card => {
                // Fix image loading
                const img = card.querySelector('img');
                if (img && !img.src) {
                    img.src = img.getAttribute('data-src');
                }

                // Fix price display
                const price = card.querySelector('.price');
                if (price) {
                    ProductFixes.currency.format(parseFloat(price.getAttribute('data-price')));
                }
            });
        },

        setupQuickView: function() {
            const quickViewButtons = document.querySelectorAll('.quick-view-btn');
            quickViewButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const productId = btn.closest('.product-card').getAttribute('data-product-id');
                    this.showQuickView(productId);
                });
            });
        },

        showQuickView: function(productId) {
            const modal = document.querySelector('.quick-view-modal');
            const product = document.querySelector(`[data-product-id="${productId}"]`);
            
            if (modal && product) {
                // Populate modal content
                modal.querySelector('.modal-image img').src = product.querySelector('img').src;
                modal.querySelector('.modal-title').textContent = product.querySelector('h3').textContent;
                modal.querySelector('.modal-price').textContent = product.querySelector('.price').textContent;
                
                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    }
};

// Initialize all fixes
document.addEventListener('DOMContentLoaded', () => {
    ProductFixes.currency.update();
    ProductFixes.filter.init();
    ProductFixes.direct.init();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductFixes;
} 