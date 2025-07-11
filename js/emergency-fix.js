// EMERGENCY FILTER FIX - COMPLETE OVERHAUL
(() => {
    const log = (msg, ...args) => console.log(`EMERGENCY FILTER FIX: ${msg}`, ...args);
    const error = (msg, ...args) => console.error(`EMERGENCY FILTER FIX: ${msg}`, ...args);

    // Brand name normalization map
    const BRAND_MAP = {
        'new-balance': 'newbalance',
        'newbalance': 'newbalance',
        'onitsuka-tiger': 'onitsuka tiger',
        'onitsuka tiger': 'onitsuka tiger',
        'air-jordan': 'jordan'
    };

    // Normalize brand names for consistent matching
    const normalizeBrandName = brand => BRAND_MAP[brand?.toLowerCase().trim()] || brand?.toLowerCase().trim() || '';

    // Remove any "no products" message
    const removeNoProductsMessage = () => {
        const msg = document.querySelector('.no-products-message');
        msg?.remove();
        log('Removed existing no-products message');
    };

    // Fetch JSON with error handling
    const fetchWithErrorHandling = async url => {
        try {
            log(`Fetching ${url}`);
                        const response = await fetch(url);
                        if (!response.ok) {
                error(`Failed to fetch ${url}, status: ${response.status}`);
                            return [];
                        }
                        
                        const data = await response.json();
                        if (!Array.isArray(data)) {
                error(`Invalid data format in ${url}, expected array`);
                            return [];
                        }
                        
            // Validate products
            const validProducts = data.filter(p => (
                p && typeof p === 'object' && p.name && p.brand && 
                p.price && p.category && Array.isArray(p.sizes)
            ));

            log(`${validProducts.length} valid products from ${url}`);
                        return validProducts;
        } catch (err) {
            error(`Error fetching ${url}:`, err);
                        return [];
                    }
                };
                
    // Load all products from JSON files
    const loadAllProducts = async () => {
        try {
            const paths = ['man', 'women', 'unisex'].map(type => `/${type}/products.json`);
            let products = await Promise.all(paths.map(fetchWithErrorHandling));
            
            if (products.every(p => p.length === 0)) {
                log('Absolute paths failed, trying relative paths');
                products = await Promise.all(paths.map(p => fetchWithErrorHandling(p.slice(1))));
            }

            const allProducts = products.flat();
            log(`Loaded ${allProducts.length} products`);
                return allProducts;
        } catch (err) {
            error('Critical error loading products:', err);
                return [];
        }
    };

    // Create product card HTML
    const createProductCard = product => {
                    const price = typeof product.price === 'number' ? product.price : 
                     parseInt(String(product.price).replace(/[^\d]/g, '')) || 0;
                    const brand = normalizeBrandName(product.brand);
                    
        const card = document.createElement('div');
        card.className = 'product-card';
        Object.entries({
            'data-price': price,
            'data-brand': brand,
            'data-category': product.category,
            'data-collection': (product.collection || '').toLowerCase().replace(/ /g, '-'),
            'data-sizes': product.sizes.join(','),
            'data-new': product.new || null
        }).forEach(([attr, value]) => value && card.setAttribute(attr, value));

                    card.innerHTML = `
                        ${product.new ? '<div class="product-tag new">New</div>' : ''}
                        <div class="product-category-tag${product.category === 'unisex' ? ' unisex' : ''}">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <div class="price">₹${price}</div>
                        </div>
                        <div class="product-actions">
                            <button class="btn quick-view-btn">Quick View</button>
                        </div>
                    `;
                    
        return card;
    };

    // Sort products by "Newest" first
    const sortProductsByNewest = products => {
        return products.sort((a, b) => {
            const isNewA = a.new === true;
            const isNewB = b.new === true;
            // First sort by "new" flag
            if (isNewA !== isNewB) return isNewA ? -1 : 1;
            // Then by price (higher first) as secondary sort
            return (b.price || 0) - (a.price || 0);
        });
    };

    // Rebuild product grid
    const rebuildProductGrid = products => {
        const grid = document.querySelector('.products-grid');
        if (!grid) {
            error('Products grid not found');
                return;
        }

        log(`Rebuilding product grid with ${products.length} products`);
        
        // Always sort products by "Newest" first before rendering
        const sortedProducts = sortProductsByNewest(products);
        log('Products sorted by "Newest" first');
        
        grid.innerHTML = '';
        
        sortedProducts.forEach((product, i) => {
            try {
                grid.appendChild(createProductCard(product));
                i % 20 === 0 && log(`Added ${i + 1}/${products.length} products`);
            } catch (err) {
                error('Error creating product card:', err);
            }
        });

        log(`Finished rebuilding grid with ${grid.children.length} products`);
        setupQuickView();
        
        // Set the sort dropdown to "Newest" to match the actual sort order
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.value = 'new';
            log('Sort dropdown set to "Newest"');
        }
    };

    // Set up quick view functionality
    const setupQuickView = () => {
        const modal = document.querySelector('.quick-view-modal');
        const closeBtn = document.querySelector('.close-modal');
        const quickViewBtns = document.querySelectorAll('.quick-view-btn');
        
        if (!modal || !closeBtn || !quickViewBtns.length) {
            error('Quick view elements not found');
                return;
            }
            
        log(`Setting up quick view for ${quickViewBtns.length} buttons`);

        const closeModal = () => {
            modal.classList.remove('active');
            document.querySelector('.filter-overlay')?.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeModal);

        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.product-card');
                if (!card) return;

                const name = card.querySelector('h3').textContent;
                const price = card.getAttribute('data-price');
                const image = card.querySelector('img').src;
                const sizes = card.getAttribute('data-sizes').split(',');

                // Update modal content
                modal.querySelector('.modal-title').textContent = name;
                modal.querySelector('.modal-price').textContent = `₹${price}`;
                modal.querySelector('.modal-image img').src = image;
                modal.querySelector('.modal-description').textContent = 
                    `Experience premium quality with our 1:1 replica of the ${name}. Perfect craftsmanship, premium materials, and unbeatable comfort.`;
                modal.querySelector('.size-options').innerHTML = 
                    sizes.map(size => `<button class="size-btn">UK ${size}</button>`).join('');

                // Show modal
                modal.classList.add('active');
                document.querySelector('.filter-overlay')?.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    };

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', async () => {
        log('Starting emergency fix');
        removeNoProductsMessage();
        
        const products = await loadAllProducts();
        if (products.length) {
            rebuildProductGrid(products);
            window.ALL_PRODUCTS = products; // Keep global reference for other scripts
        } else {
            error('No products loaded');
        }
    });
})();
