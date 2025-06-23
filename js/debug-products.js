/**
 * Debug script to diagnose product loading issues
 */

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Debug script loaded');
    
    // Test direct fetch of JSON files
    async function testFetch(url) {
        try {
            console.log(`Debug: Testing fetch from ${url}`);
            const response = await fetch(url);
            
            if (!response.ok) {
                console.error(`Debug: Fetch failed for ${url} - Status: ${response.status}`);
                return null;
            }
            
            try {
                const data = await response.json();
                console.log(`Debug: Successfully fetched from ${url}:`, data);
                return data;
            } catch (jsonError) {
                console.error(`Debug: JSON parse error for ${url}:`, jsonError);
                
                // Try to get the raw text to see what's wrong
                const text = await response.text();
                console.log(`Debug: Raw response from ${url}:`, text.substring(0, 200) + '...');
                return null;
            }
        } catch (fetchError) {
            console.error(`Debug: Network error fetching ${url}:`, fetchError);
            return null;
        }
    }
    
    // Test all JSON files with relative paths
    console.log('Debug: Starting product file tests with relative paths');
    const manProducts = await testFetch('man/products.json');
    const womenProducts = await testFetch('women/products.json');
    const unisexProducts = await testFetch('unisex/products.json');
    
    // Check if files were loaded successfully
    if (manProducts && womenProducts && unisexProducts) {
        console.log('Debug: All product files loaded successfully');
        console.log('Debug: Total products:', manProducts.length + womenProducts.length + unisexProducts.length);
        
        // Log some sample product data to verify structure
        if (manProducts.length > 0) {
            console.log('Debug: Sample men product:', manProducts[0]);
        }
        if (womenProducts.length > 0) {
            console.log('Debug: Sample women product:', womenProducts[0]);
        }
        if (unisexProducts.length > 0) {
            console.log('Debug: Sample unisex product:', unisexProducts[0]);
        }
    } else {
        console.error('Debug: Some product files failed to load');
    }
    
    // Check if products grid exists
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        console.log('Debug: Products grid found');
        console.log('Debug: Products grid contents:', productsGrid.innerHTML);
        console.log('Debug: Product cards in grid:', productsGrid.querySelectorAll('.product-card').length);
    } else {
        console.error('Debug: Products grid not found');
    }
    
    // Check if there's a no-products message
    const noProductsMessage = document.querySelector('.no-products-message');
    if (noProductsMessage) {
        console.log('Debug: No products message is displayed');
    }
    
    // Check if any filters are active
    const activeFilters = document.querySelectorAll('input[type="checkbox"]:checked');
    if (activeFilters.length > 0) {
        console.log('Debug: Active filters found:', activeFilters.length);
        activeFilters.forEach(filter => {
            console.log(`Debug: Active filter - ${filter.name}: ${filter.value}`);
        });
    } else {
        console.log('Debug: No active filters');
    }
    
    // Check price filter values
    const minPrice = document.getElementById('min-price-input');
    const maxPrice = document.getElementById('max-price-input');
    if (minPrice && maxPrice) {
        console.log(`Debug: Price filter - Min: ${minPrice.value}, Max: ${maxPrice.value}`);
    }
    
    // Force clear filters and reload products
    console.log('Debug: Attempting to force clear filters and reload products');
    const clearFilterBtn = document.querySelector('.clear-filter');
    if (clearFilterBtn) {
        console.log('Debug: Found clear filter button, clicking it');
        clearFilterBtn.click();
    }
}); 