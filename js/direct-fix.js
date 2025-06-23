/**
 * DIRECT FIX - STANDALONE PRODUCT LOADER & FILTER
 * This script completely bypasses all other product loading and filtering scripts
 * to ensure products from all JSON files are properly loaded and filtered.
 */

(function() {
    console.log("DIRECT FIX: Initializing standalone product loader and filter");
    
    // Execute when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Wait a bit to ensure we run after other scripts
        setTimeout(initDirectFix, 300);
    });
    
    // Main initialization function
    async function initDirectFix() {
        try {
            console.log("DIRECT FIX: Starting direct product fix");
            
            // 1. Load all products from JSON files
            const products = await loadAllProducts();
            if (!products || products.length === 0) {
                console.error("DIRECT FIX: Failed to load any products");
                return;
            }
            
            console.log(`DIRECT FIX: Successfully loaded ${products.length} products`);
            
            // 2. Replace product grid with our products
            renderProducts(products);
            
            // 3. Set up our own filter handlers
            setupFilterHandlers(products);
            
            console.log("DIRECT FIX: Initialization complete");
        } catch (error) {
            console.error("DIRECT FIX: Critical error during initialization", error);
        }
    }
    
    // Load products from all JSON files
    async function loadAllProducts() {
        try {
            console.log("DIRECT FIX: Loading products from JSON files");
            
            // Helper function to fetch with proper error handling
            const fetchJson = async (url) => {
                try {
                    console.log(`DIRECT FIX: Fetching ${url}`);
                    const response = await fetch(url);
                    
                    if (!response.ok) {
                        console.error(`DIRECT FIX: Failed to fetch ${url}, status: ${response.status}`);
                        return [];
                    }
                    
                    const text = await response.text();
                    try {
                        const data = JSON.parse(text);
                        if (!Array.isArray(data)) {
                            console.error(`DIRECT FIX: Expected array in ${url}, got:`, typeof data);
                            return [];
                        }
                        console.log(`DIRECT FIX: Successfully loaded ${data.length} products from ${url}`);
                        
                        // Log first item for debugging
                        if (data.length > 0) {
                            console.log(`DIRECT FIX: Sample product from ${url}:`, data[0]);
                        }
                        
                        return data;
                    } catch (parseError) {
                        console.error(`DIRECT FIX: JSON parse error in ${url}:`, parseError);
                        console.log(`DIRECT FIX: Raw response (first 100 chars): ${text.substring(0, 100)}`);
                        return [];
                    }
                } catch (fetchError) {
                    console.error(`DIRECT FIX: Network error fetching ${url}:`, fetchError);
                    return [];
                }
            };
            
            // Try both relative and absolute paths
            let menProducts = await fetchJson('man/products.json');
            let womenProducts = await fetchJson('women/products.json');
            let unisexProducts = await fetchJson('unisex/products.json');
            
            // If any failed, try with leading slash
            if (menProducts.length === 0) menProducts = await fetchJson('/man/products.json');
            if (womenProducts.length === 0) womenProducts = await fetchJson('/women/products.json');
            if (unisexProducts.length === 0) unisexProducts = await fetchJson('/unisex/products.json');
            
            // Combine all products
            const allProducts = [...menProducts, ...womenProducts, ...unisexProducts];
            
            // Validate and normalize products
            const validProducts = allProducts.filter(product => {
                return product && 
                       typeof product === 'object' && 
                       product.name && 
                       product.brand && 
                       (product.price !== undefined) && 
                       product.category && 
                       Array.isArray(product.sizes);
            }).map(product => {
                // Normalize product data
                return {
                    ...product,
                    brand: (product.brand || '').toLowerCase(),
                    price: typeof product.price === 'number' ? product.price : 
                           parseInt(String(product.price).replace(/[^\d]/g, '')) || 0,
                    category: (product.category || '').toLowerCase(),
                    collection: (product.collection || '').toLowerCase()
                };
            });
            
            console.log(`DIRECT FIX: Loaded ${validProducts.length} valid products`);
            
            // Store products in global variable for debugging
            window.DIRECT_FIX_PRODUCTS = validProducts;
            
            return validProducts;
        } catch (error) {
            console.error("DIRECT FIX: Error loading products:", error);
            return [];
        }
    }
    
    // Render products to the grid
    function renderProducts(products) {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) {
            console.error("DIRECT FIX: Products grid not found");
            return;
        }
        
        console.log(`DIRECT FIX: Rendering ${products.length} products`);
        
        // Clear existing content
        productsGrid.innerHTML = '';
        
        // Create product cards
        products.forEach((product, index) => {
            try {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.setAttribute('data-price', product.price);
                card.setAttribute('data-brand', product.brand);
                card.setAttribute('data-category', product.category);
                card.setAttribute('data-collection', product.collection.replace(/ /g, '-'));
                card.setAttribute('data-sizes', product.sizes.join(','));
                if (product.new) card.setAttribute('data-new', 'true');
                
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
                
                productsGrid.appendChild(card);
                
                if (index % 20 === 0 && index > 0) {
                    console.log(`DIRECT FIX: Rendered ${index}/${products.length} products`);
                }
            } catch (error) {
                console.error(`DIRECT FIX: Error rendering product:`, product, error);
            }
        });
        
        console.log(`DIRECT FIX: Rendered all ${products.length} products`);
        
        // Setup quick view functionality
        setupQuickView();
    }
    
    // Set up quick view functionality
    function setupQuickView() {
        const quickViewBtns = document.querySelectorAll('.quick-view-btn');
        const quickViewModal = document.querySelector('.quick-view-modal');
        const closeModalBtn = document.querySelector('.close-modal');
        
        if (!quickViewBtns.length || !quickViewModal || !closeModalBtn) {
            console.error("DIRECT FIX: Quick view elements not found");
            return;
        }
        
        console.log(`DIRECT FIX: Setting up quick view for ${quickViewBtns.length} buttons`);
        
        // Close modal functionality
        closeModalBtn.addEventListener('click', function() {
            quickViewModal.classList.remove('active');
            const filterOverlay = document.querySelector('.filter-overlay');
            if (filterOverlay) filterOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Quick view button functionality
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.product-card');
                if (!card) return;
                
                const productName = card.querySelector('h3').textContent;
                const productPrice = card.getAttribute('data-price');
                const productImage = card.querySelector('img').src;
                const sizes = card.getAttribute('data-sizes').split(',');
                
                // Update modal content
                quickViewModal.querySelector('.modal-title').textContent = productName;
                quickViewModal.querySelector('.modal-price').textContent = '$' + productPrice;
                quickViewModal.querySelector('.modal-image img').src = productImage;
                quickViewModal.querySelector('.modal-description').textContent = 
                    `Experience premium quality with our 1:1 replica of the ${productName}. Perfect craftsmanship, premium materials, and unbeatable comfort.`;
                
                // Update size options
                const sizeOptions = quickViewModal.querySelector('.size-options');
                sizeOptions.innerHTML = sizes.map(size => `
                    <button class="size-btn">UK ${size}</button>
                `).join('');
                
                // Show modal
                quickViewModal.classList.add('active');
                const filterOverlay = document.querySelector('.filter-overlay');
                if (filterOverlay) filterOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }
    
    // Set up filter handlers
    function setupFilterHandlers(allProducts) {
        const applyFilterBtn = document.querySelector('.apply-filter');
        const clearFilterBtn = document.querySelector('.clear-filter');
        const sortSelect = document.getElementById('sort-select');
        
        if (!applyFilterBtn) {
            console.error("DIRECT FIX: Apply filter button not found");
            return;
        }
        
        console.log("DIRECT FIX: Setting up filter handlers");
        
        // Apply filter button
        applyFilterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            applyFilters(allProducts);
        }, true);
        
        // Clear filter button
        if (clearFilterBtn) {
            clearFilterBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                clearFilters(allProducts);
            }, true);
        }
        
        // Sort select
        if (sortSelect) {
            sortSelect.addEventListener('change', function(e) {
                e.stopImmediatePropagation();
                sortProducts(sortSelect.value);
            }, true);
            
            // Apply initial sorting
            sortProducts(sortSelect.value || 'new');
        }
        
        // Mobile filter toggle
        const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
        const mobileFilterClose = document.querySelector('.mobile-filter-close');
        const filterSidebar = document.querySelector('.filter-sidebar');
        const filterOverlay = document.querySelector('.filter-overlay');
        
        if (mobileFilterToggle && filterSidebar) {
            mobileFilterToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                console.log("DIRECT FIX: Mobile filter toggle clicked");
                
                // Show the overlay first
                if (filterOverlay) {
                    filterOverlay.classList.add('active');
                }
                
                // Add active class to show the sidebar
                filterSidebar.classList.add('active');
                document.body.style.overflow = 'hidden';
            }, true);
        }
        
        if (mobileFilterClose && filterSidebar) {
            mobileFilterClose.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                
                filterSidebar.classList.remove('active');
                if (filterOverlay) filterOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }, true);
        }
        
        if (filterOverlay) {
            filterOverlay.addEventListener('click', function() {
                filterSidebar.classList.remove('active');
                filterOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }, true);
        }
    }
    
    // Apply filters
    function applyFilters(allProducts) {
        console.log("DIRECT FIX: Applying filters");
        
        // Remove any existing "no products" message
        const existingMsg = document.querySelector('.no-products-message');
        if (existingMsg) existingMsg.remove();
        
        // Get filter values
        const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
        const sizeCheckboxes = document.querySelectorAll('input[name="size"]');
        const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
        
        const selectedBrands = Array.from(brandCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value.toLowerCase());
            
        const selectedSizes = Array.from(sizeCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value.replace('uk-', ''));
            
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value.toLowerCase());
            
        const minPriceInput = document.getElementById('min-price-input');
        const maxPriceInput = document.getElementById('max-price-input');
        const minPrice = parseInt(minPriceInput?.value || 0);
        const maxPrice = parseInt(maxPriceInput?.value || 10000);
        
        console.log("DIRECT FIX: Selected filters", {
            brands: selectedBrands,
            sizes: selectedSizes,
            categories: selectedCategories,
            price: { min: minPrice, max: maxPrice }
        });
        
        // Filter products
        const filteredProducts = allProducts.filter(product => {
            // Check price
            const meetsPrice = product.price >= minPrice && product.price <= maxPrice;
            
            // Check brand
            const meetsBrand = selectedBrands.length === 0 || 
                selectedBrands.some(brand => product.brand.includes(brand));
            
            // Check category with unisex handling
            let meetsCategory = false;
            if (selectedCategories.length === 0) {
                meetsCategory = true;
            } else if (selectedCategories.includes('men') && (product.category === 'men' || product.category === 'unisex')) {
                meetsCategory = true;
            } else if (selectedCategories.includes('women') && (product.category === 'women' || product.category === 'unisex')) {
                meetsCategory = true;
            } else if (selectedCategories.includes(product.category)) {
                meetsCategory = true;
            }
            
            // Check size
            const meetsSize = selectedSizes.length === 0 || 
                selectedSizes.some(size => product.sizes.includes(size));
            
            // Debug first few products
            if (product.name.includes('Air Max') && selectedBrands.includes('nike')) {
                console.log(`DIRECT FIX: Filter check for ${product.name}:`, {
                    price: product.price,
                    meetsPrice,
                    brand: product.brand,
                    meetsBrand,
                    category: product.category,
                    meetsCategory,
                    sizes: product.sizes,
                    meetsSize,
                    visible: meetsPrice && meetsBrand && meetsCategory && meetsSize
                });
            }
            
            return meetsPrice && meetsBrand && meetsCategory && meetsSize;
        });
        
        console.log(`DIRECT FIX: Filtered to ${filteredProducts.length} products`);
        
        // Render filtered products
        renderFilteredProducts(filteredProducts);
        
        // Check if any filters are applied
        const isAnyFilterApplied = selectedBrands.length > 0 || 
                                 selectedSizes.length > 0 || 
                                 selectedCategories.length > 0 || 
                                 (minPriceInput && minPrice > parseInt(minPriceInput.min || '0')) || 
                                 (maxPriceInput && maxPrice < parseInt(maxPriceInput.max || '10000'));
        
        // Show "no products" message if needed
        if (isAnyFilterApplied && filteredProducts.length === 0) {
            const productsGrid = document.querySelector('.products-grid');
            if (productsGrid && productsGrid.parentNode) {
                const noProductsMsg = document.createElement('div');
                noProductsMsg.className = 'no-products-message';
                noProductsMsg.textContent = 'No products available under the selected filter.';
                productsGrid.parentNode.insertBefore(noProductsMsg, productsGrid);
                console.log("DIRECT FIX: Added no products message");
            }
        }
        
        // Close mobile filter sidebar if needed
        const filterSidebar = document.querySelector('.filter-sidebar');
        const filterOverlay = document.querySelector('.filter-overlay');
        if (window.innerWidth < 992 && filterSidebar) {
            filterSidebar.classList.remove('active');
            if (filterOverlay) filterOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Render filtered products
    function renderFilteredProducts(filteredProducts) {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;
        
        // Clear existing content
        productsGrid.innerHTML = '';
        
        // Create product cards
        filteredProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.setAttribute('data-price', product.price);
            card.setAttribute('data-brand', product.brand);
            card.setAttribute('data-category', product.category);
            card.setAttribute('data-collection', product.collection.replace(/ /g, '-'));
            card.setAttribute('data-sizes', product.sizes.join(','));
            if (product.new) card.setAttribute('data-new', 'true');
            
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
            
            productsGrid.appendChild(card);
        });
        
        // Apply sorting
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortProducts(sortSelect.value || 'new');
        }
        
        // Re-initialize quick view
        setupQuickView();
    }
    
    // Clear filters
    function clearFilters(allProducts) {
        console.log("DIRECT FIX: Clearing all filters");
        
        // Remove any existing "no products" message
        const existingMsg = document.querySelector('.no-products-message');
        if (existingMsg) existingMsg.remove();
        
        // Reset all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset price range
        const minPriceSlider = document.getElementById('min-price');
        const maxPriceSlider = document.getElementById('max-price');
        const minPriceInput = document.getElementById('min-price-input');
        const maxPriceInput = document.getElementById('max-price-input');
        
        if (minPriceSlider && maxPriceSlider && minPriceInput && maxPriceInput) {
            minPriceSlider.value = minPriceSlider.min;
            maxPriceSlider.value = maxPriceSlider.max;
            minPriceInput.value = minPriceSlider.min;
            maxPriceInput.value = maxPriceSlider.max;
        }
        
        // Render all products
        renderProducts(allProducts);
    }
    
    // Sort products
    function sortProducts(sortType) {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;
        
        console.log(`DIRECT FIX: Sorting products by ${sortType}`);
        
        // Get all product cards
        const products = Array.from(productsGrid.children);
        
        products.sort((a, b) => {
            const priceA = parseInt(a.getAttribute('data-price')) || 0;
            const priceB = parseInt(b.getAttribute('data-price')) || 0;
            const isNewA = a.hasAttribute('data-new');
            const isNewB = b.hasAttribute('data-new');
            
            switch (sortType) {
                case 'low-high':
                    return priceA - priceB;
                case 'high-low':
                    return priceB - priceA;
                case 'new':
                default:
                    // First sort by new/old
                    if (isNewA !== isNewB) {
                        return isNewA ? -1 : 1;
                    }
                    // Then by price (higher price first for new items)
                    return priceB - priceA;
            }
        });
        
        // Remove all sorted products and re-append them
        products.forEach(product => {
            productsGrid.appendChild(product);
        });
    }
})(); 