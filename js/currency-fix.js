/**
 * CRITICAL CURRENCY FIX
 * This script ensures all price displays use the Indian Rupee (₹) symbol consistently
 */

(() => {
    // Constants
    const CONFIG = {
        initialCheckInterval: 500,
        regularCheckInterval: 2000,
        switchToRegularAfter: 10000,
        rupeeSymbol: '₹',
        selectors: {
            prices: '.product-card .price, .modal-price',
            priceInputs: '.price-input span',
            priceElements: [
                'product-card',
                'price',
                'modal-price'
            ]
        }
    };

    // DOM helper functions
    const $ = selector => document.querySelector(selector);
    const $$ = selector => document.querySelectorAll(selector);

    // Currency functionality
    const currencyFix = {
        init() {
            console.log('CURRENCY FIX: Script loaded');
            this.setupIntervals();
            this.setupMutationObserver();
            this.overridePriceFormatting();
            console.log('CURRENCY FIX: Setup complete');
        },

        setupIntervals() {
            // Initial frequent checks
            this.fixCurrencySymbols();
            const initialInterval = setInterval(() => this.fixCurrencySymbols(), CONFIG.initialCheckInterval);

            // Switch to less frequent checks after delay
            setTimeout(() => {
                clearInterval(initialInterval);
                setInterval(() => this.fixCurrencySymbols(), CONFIG.regularCheckInterval);
            }, CONFIG.switchToRegularAfter);
        },

        fixCurrencySymbols() {
            const fixPrice = (element) => {
                const text = element.textContent || element.innerText;
                if (!text || text.includes(CONFIG.rupeeSymbol)) return;

                const priceValue = text.replace(/[^\d.]/g, '');
                if (priceValue) {
                    element.textContent = `${CONFIG.rupeeSymbol}${priceValue}`;
                    console.log(`CURRENCY FIX: Fixed price display in ${element.className}`);
                }
            };

            // Fix all price displays
            $$(CONFIG.selectors.prices).forEach(fixPrice);

            // Fix price input spans
            $$(CONFIG.selectors.priceInputs).forEach(span => {
                if (span.textContent !== CONFIG.rupeeSymbol) {
                    span.textContent = CONFIG.rupeeSymbol;
                    console.log('CURRENCY FIX: Fixed price input span');
                }
            });
        },

        overridePriceFormatting() {
            const formatPrice = price => `${CONFIG.rupeeSymbol}${price}`;

            // Override existing formatter if present
            if (window.formatPrice) {
                const originalFormatPrice = window.formatPrice;
                window.formatPrice = price => {
                    const result = originalFormatPrice(price);
                    return result.includes(CONFIG.rupeeSymbol) ? 
                           result : 
                           `${CONFIG.rupeeSymbol}${result.replace(/[^\d.]/g, '')}`;
                };
            } else {
                // Create new formatter if none exists
                window.formatPrice = formatPrice;
            }
        },

        setupMutationObserver() {
            const observer = new MutationObserver(mutations => {
                const shouldFix = mutations.some(mutation =>
                    Array.from(mutation.addedNodes).some(node => {
                        if (node.nodeType !== 1) return false; // Not an element node

                        return node.classList && (
                            CONFIG.selectors.priceElements.some(cls => 
                                node.classList.contains(cls) || node.querySelector(`.${cls}`)
                            )
                        );
                    })
                );

                if (shouldFix) this.fixCurrencySymbols();
            });

            // Start observing the document body
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => currencyFix.init());
    } else {
        currencyFix.init();
    }
})(); 