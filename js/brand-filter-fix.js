/**
 * CRITICAL BRAND FILTER FIX
 * 
 * This script fixes the issue where selecting a brand filter still shows products from other brands.
 * It ensures that when a brand filter is selected, ONLY products of that brand are displayed.
 */

(function() {
    console.log('BRAND FILTER FIX: Script loaded');
    
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Wait a bit for other scripts to initialize
        setTimeout(initBrandFilterFix, 500);
    });
    
    function initBrandFilterFix() {
        console.log('BRAND FILTER FIX: Initializing');
        
        // Override the original applyFilters function if it exists
        if (typeof window.applyFilters === 'function') {
            console.log('BRAND FILTER FIX: Overriding applyFilters function');
            
            // Store the original function
            const originalApplyFilters = window.applyFilters;
            
            // Replace with our fixed version
            window.applyFilters = function() {
                console.log('BRAND FILTER FIX: Running fixed applyFilters');
                
                // Call the original function first
                originalApplyFilters.apply(this, arguments);
                
                // Then apply our additional fix
                fixBrandFiltering();
            };
        } else {
            console.warn('BRAND FILTER FIX: Could not find applyFilters function to override');
        }
        
        // Set up event listeners for filter buttons
        setupFilterEventListeners();
    }
    
    function setupFilterEventListeners() {
        // Apply filter button
        const applyFilterBtn = document.querySelector('.apply-filter');
        if (applyFilterBtn) {
            applyFilterBtn.addEventListener('click', function() {
                console.log('BRAND FILTER FIX: Apply filter button clicked');
                setTimeout(fixBrandFiltering, 100);
            });
        }
        
        // Brand checkboxes
        document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                console.log(`BRAND FILTER FIX: Brand checkbox ${checkbox.value} changed to ${checkbox.checked}`);
                // If this is checked, uncheck other brand checkboxes for exclusive filtering
                if (checkbox.checked) {
                    document.querySelectorAll('input[name="brand"]').forEach(otherCheckbox => {
                        if (otherCheckbox !== checkbox) {
                            otherCheckbox.checked = false;
                        }
                    });
                }
                setTimeout(fixBrandFiltering, 100);
            });
        });
    }
    
    function fixBrandFiltering() {
        console.log('BRAND FILTER FIX: Running brand filter fix');
        
        // Get all product cards
        const productCards = document.querySelectorAll('.product-card');
        if (productCards.length === 0) {
            console.warn('BRAND FILTER FIX: No product cards found');
            return;
        }
        
        // Get selected brand filters
        const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
            .map(checkbox => normalizeBrandName(checkbox.value));
        
        console.log(`BRAND FILTER FIX: Selected brands: ${selectedBrands.join(', ')}`);
        
        // If no brand filter is selected, don't do anything
        if (selectedBrands.length === 0) {
            console.log('BRAND FILTER FIX: No brand filter selected, skipping fix');
            return;
        }
        
        // Get other filter selections
        const selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked'))
            .map(checkbox => checkbox.value);
        
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
            .map(checkbox => checkbox.value);
        
        const minPrice = parseInt(document.getElementById('min-price-input')?.value || 0);
        const maxPrice = parseInt(document.getElementById('max-price-input')?.value || 10000);
        
        // Force hide products that don't match the selected brand
        productCards.forEach(card => {
            const cardBrand = normalizeBrandName(card.getAttribute('data-brand') || '');
            const price = parseInt(card.getAttribute('data-price') || 0);
            const category = card.getAttribute('data-category') || '';
            const sizes = (card.getAttribute('data-sizes') || '').split(',');
            
            // Check if this product matches the selected brand
            const meetsBrand = selectedBrands.includes(cardBrand);
            
            // Only check other filters if the brand matches
            if (meetsBrand) {
                // Price filter
                const meetsPrice = price >= minPrice && price <= maxPrice;
                
                // Category filter with unisex handling
                let meetsCategory = false;
                if (selectedCategories.length === 0) {
                    meetsCategory = true;
                } else if (selectedCategories.includes('men') && (category === 'men' || category === 'unisex')) {
                    meetsCategory = true;
                } else if (selectedCategories.includes('women') && (category === 'women' || category === 'unisex')) {
                    meetsCategory = true;
                } else if (selectedCategories.includes(category)) {
                    meetsCategory = true;
                }
                
                // Size filter
                const meetsSize = selectedSizes.length === 0 || 
                    selectedSizes.some(size => sizes.includes(size));
                
                // Show product only if it meets ALL criteria
                if (meetsPrice && meetsCategory && meetsSize) {
                    card.style.display = 'flex';
                    card.setAttribute('data-filter-fixed', 'true');
                } else {
                    card.style.display = 'none';
                }
            } else {
                // Hide products that don't match the selected brand
                card.style.display = 'none';
            }
        });
        
        // Log results
        const visibleCount = Array.from(productCards).filter(
            card => window.getComputedStyle(card).display !== 'none'
        ).length;
        
        console.log(`BRAND FILTER FIX: ${visibleCount} products visible after fix`);
    }
    
    // Function to normalize brand names for consistent comparison
    function normalizeBrandName(brand) {
        if (!brand) return '';
        
        brand = brand.toLowerCase().trim();
        
        // Handle special cases
        if (brand === 'new-balance' || brand === 'newbalance') return 'newbalance';
        if (brand === 'onitsuka-tiger' || brand === 'onitsuka tiger') return 'onitsuka tiger';
        if (brand === 'air-jordan' || brand === 'air jordan') return 'jordan';
        
        return brand;
    }
})(); 