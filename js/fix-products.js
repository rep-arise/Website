/**
 * Fix Products Script - Simple Direct Approach
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Fix Products: Simple direct approach loaded');
    
    // Direct approach to load products
    function loadProducts() {
        // Fetch all product data
        Promise.all([
            fetch('man/products.json').then(res => res.json()).catch(() => []),
            fetch('women/products.json').then(res => res.json()).catch(() => []),
            fetch('unisex/products.json').then(res => res.json()).catch(() => [])
        ])
        .then(([menProducts, womenProducts, unisexProducts]) => {
            const allProducts = [...menProducts, ...womenProducts, ...unisexProducts];
            console.log('Fix Products: Loaded total products:', allProducts.length);
            
            if (allProducts.length === 0) {
                console.error('Fix Products: No products found in JSON files');
                return;
            }
            
            // Find the products grid and clear it
            const productsGrid = document.querySelector('.products-grid');
            if (!productsGrid) {
                console.error('Fix Products: Products grid not found');
                return;
            }
            
            // Clear the grid
            productsGrid.innerHTML = '';
            
            // Render each product
            allProducts.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.setAttribute('data-price', product.price);
                card.setAttribute('data-brand', product.brand);
                card.setAttribute('data-category', product.category);
                card.setAttribute('data-collection', product.collection.toLowerCase().replace(/ /g, '-'));
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
            
            console.log('Fix Products: Rendered all products');
            
            // Sort products by newest first by default
            const sortSelect = document.getElementById('sort-select');
            if (sortSelect) {
                sortSelect.value = 'new';
                sortProducts('new');
            }

            // Setup quick view functionality
            setupQuickView();
        })
        .catch(error => {
            console.error('Fix Products: Error loading products:', error);
        });
    }
    
    // Sort products function
    function sortProducts(sortType) {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;
        
        // Get only visible products
        const products = Array.from(productsGrid.children).filter(card => 
            window.getComputedStyle(card).display !== 'none'
        );
        
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
    
    // Setup quick view functionality
    function setupQuickView() {
        const quickViewBtns = document.querySelectorAll('.quick-view-btn');
        const quickViewModal = document.querySelector('.quick-view-modal');
        const closeModalBtn = document.querySelector('.close-modal');
        
        if (!quickViewBtns.length || !quickViewModal || !closeModalBtn) {
            console.error('Fix Products: Quick view elements not found');
            return;
        }
        
        // Close modal functionality
        closeModalBtn.addEventListener('click', function() {
            quickViewModal.classList.remove('active');
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
            });
        });
    }
    
    // Load products immediately
    loadProducts();
}); 