/**
 * CRITICAL FIX: Filter Buttons
 * This script ensures the Apply Filter and Clear Filter buttons work correctly across all pages
 */

(function() {
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Filter Button Fix: Initializing');
        
        // Add IDs to buttons if they don't have them
        const applyFilterBtn = document.querySelector('.apply-filter');
        const clearFilterBtn = document.querySelector('.clear-filter');
        
        if (applyFilterBtn && !applyFilterBtn.id) {
            applyFilterBtn.id = 'apply-filter-btn';
            console.log('Filter Button Fix: Added ID to Apply Filter button');
        }
        
        if (clearFilterBtn && !clearFilterBtn.id) {
            clearFilterBtn.id = 'clear-filter-btn';
            console.log('Filter Button Fix: Added ID to Clear Filter button');
        }
        
        // Add direct event listeners to ensure buttons work
        if (applyFilterBtn) {
            console.log('Filter Button Fix: Found Apply Filter button, adding direct event listener');
            
            // Remove any existing event listeners
            const newApplyBtn = applyFilterBtn.cloneNode(true);
            applyFilterBtn.parentNode.replaceChild(newApplyBtn, applyFilterBtn);
            
            // Add new event listener
            newApplyBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Filter Button Fix: Apply Filter button clicked');
                
                // Call both filter implementations to ensure it works
                if (typeof window.applyFilters === 'function') {
                    window.applyFilters();
                    console.log('Filter Button Fix: Called global applyFilters()');
                }
                
                if (window.ProductFixes && window.ProductFixes.filter && typeof window.ProductFixes.filter.applyFilters === 'function') {
                    window.ProductFixes.filter.applyFilters();
                    console.log('Filter Button Fix: Called ProductFixes.filter.applyFilters()');
                }
            });
        }
        
        if (clearFilterBtn) {
            console.log('Filter Button Fix: Found Clear Filter button, adding direct event listener');
            
            // Remove any existing event listeners
            const newClearBtn = clearFilterBtn.cloneNode(true);
            clearFilterBtn.parentNode.replaceChild(newClearBtn, clearFilterBtn);
            
            // Add new event listener
            newClearBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Filter Button Fix: Clear Filter button clicked');
                
                // Reset all checkboxes
                document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                
                // Reset price inputs
                const minInput = document.getElementById('min-price-input');
                const maxInput = document.getElementById('max-price-input');
                const minSlider = document.getElementById('min-price');
                const maxSlider = document.getElementById('max-price');
                
                if (minInput && maxInput && minSlider && maxSlider) {
                    minInput.value = minSlider.min || 0;
                    maxInput.value = maxSlider.max || 20000;
                    minSlider.value = minSlider.min || 0;
                    maxSlider.value = maxSlider.max || 20000;
                }
                
                // Show all products
                document.querySelectorAll('.product-card').forEach(card => {
                    card.style.display = 'flex';
                });
                
                // Call both filter implementations to ensure it works
                if (typeof window.resetFilters === 'function') {
                    window.resetFilters();
                    console.log('Filter Button Fix: Called global resetFilters()');
                    
                    if (typeof window.applyFilters === 'function') {
                        window.applyFilters();
                        console.log('Filter Button Fix: Called global applyFilters() after reset');
                    }
                }
                
                if (window.ProductFixes && window.ProductFixes.filter) {
                    if (typeof window.ProductFixes.filter.clearFilters === 'function') {
                        window.ProductFixes.filter.clearFilters();
                        console.log('Filter Button Fix: Called ProductFixes.filter.clearFilters()');
                    }
                    
                    if (typeof window.ProductFixes.filter.applyFilters === 'function') {
                        window.ProductFixes.filter.applyFilters();
                        console.log('Filter Button Fix: Called ProductFixes.filter.applyFilters() after reset');
                    }
                }
                
                // Apply default sorting
                if (typeof window.sortProducts === 'function') {
                    window.sortProducts('new');
                    console.log('Filter Button Fix: Applied default sorting after reset');
                }
            });
        }
        
        // Make filter functions globally available
        if (typeof window.applyFilters !== 'function' && typeof window.ProductFixes?.filter?.applyFilters === 'function') {
            window.applyFilters = window.ProductFixes.filter.applyFilters.bind(window.ProductFixes.filter);
            console.log('Filter Button Fix: Made ProductFixes.filter.applyFilters globally available');
        }
        
        if (typeof window.resetFilters !== 'function') {
            window.resetFilters = function() {
                console.log('Filter Button Fix: Using global resetFilters function');
                
                // Reset all checkboxes
                document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                
                // Reset price inputs
                const minInput = document.getElementById('min-price-input');
                const maxInput = document.getElementById('max-price-input');
                const minSlider = document.getElementById('min-price');
                const maxSlider = document.getElementById('max-price');
                
                if (minInput && maxInput && minSlider && maxSlider) {
                    minInput.value = minSlider.min || 0;
                    maxInput.value = maxSlider.max || 20000;
                    minSlider.value = minSlider.min || 0;
                    maxSlider.value = maxSlider.max || 20000;
                }
                
                // Show all products
                document.querySelectorAll('.product-card').forEach(card => {
                    card.style.display = 'flex';
                    card.classList.remove('filter-fix-forced');
                });
                
                console.log('Filter Button Fix: All filters reset');
            };
        }
        
        console.log('Filter Button Fix: Initialization complete');
    });
})(); 