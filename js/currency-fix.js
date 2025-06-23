/**
 * CRITICAL CURRENCY FIX
 * This script ensures all price displays use the Indian Rupee (₹) symbol consistently
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('CURRENCY FIX: Script loaded');
    
    // Run immediately and then periodically to ensure currency symbols are correct
    fixCurrencySymbols();
    
    // Set an interval to continuously check and fix currency symbols
    const currencyCheckInterval = setInterval(fixCurrencySymbols, 500);
    
    // After 10 seconds, reduce the frequency of checks
    setTimeout(() => {
        clearInterval(currencyCheckInterval);
        setInterval(fixCurrencySymbols, 2000);
    }, 10000);
    
    // Function to fix all currency symbols on the page
    function fixCurrencySymbols() {
        // Fix price displays in product cards
        document.querySelectorAll('.product-card .price').forEach(priceElement => {
            const text = priceElement.textContent || priceElement.innerText;
            if (text && !text.includes('₹')) {
                // Extract the price value
                const priceValue = text.replace(/[^\d.]/g, '');
                if (priceValue) {
                    priceElement.textContent = `₹${priceValue}`;
                    console.log('CURRENCY FIX: Fixed product card price display');
                }
            }
        });
        
        // Fix price displays in modals
        document.querySelectorAll('.modal-price').forEach(priceElement => {
            const text = priceElement.textContent || priceElement.innerText;
            if (text && !text.includes('₹')) {
                // Extract the price value
                const priceValue = text.replace(/[^\d.]/g, '');
                if (priceValue) {
                    priceElement.textContent = `₹${priceValue}`;
                    console.log('CURRENCY FIX: Fixed modal price display');
                }
            }
        });
        
        // Fix price input spans
        document.querySelectorAll('.price-input span').forEach(spanElement => {
            if (spanElement.textContent !== '₹') {
                spanElement.textContent = '₹';
                console.log('CURRENCY FIX: Fixed price input span');
            }
        });
        
        // Override any script that might be changing currency symbols
        overridePriceFormatting();
    }
    
    // Function to override any script that might be changing currency symbols
    function overridePriceFormatting() {
        // Override any potential price formatter functions
        if (window.formatPrice) {
            const originalFormatPrice = window.formatPrice;
            window.formatPrice = function(price) {
                // Always ensure the result includes the rupee symbol
                const result = originalFormatPrice(price);
                if (!result.includes('₹')) {
                    return `₹${result.replace(/[^\d.]/g, '')}`;
                }
                return result;
            };
        }
        
        // Create a global price formatter if it doesn't exist
        if (!window.formatPrice) {
            window.formatPrice = function(price) {
                return `₹${price}`;
            };
        }
    }
    
    // Monitor DOM changes to catch dynamically added elements
    const observer = new MutationObserver(mutations => {
        let shouldFix = false;
        
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                // Check if any added node contains price elements
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && (
                            node.classList.contains('product-card') || 
                            node.classList.contains('price') || 
                            node.classList.contains('modal-price') ||
                            node.querySelector('.price') ||
                            node.querySelector('.modal-price')
                        )) {
                            shouldFix = true;
                        }
                    }
                });
            }
        });
        
        if (shouldFix) {
            fixCurrencySymbols();
        }
    });
    
    // Start observing the document body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });
    
    console.log('CURRENCY FIX: Setup complete');
}); 