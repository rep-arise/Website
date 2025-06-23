/**
 * Rep Arise - Products Page Script
 */

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Products page loaded successfully!');
    
    // Load products from JSON files
    async function fetchProducts(url) {
        try {
            console.log(`Attempting to fetch products from: ${url}`);
            const res = await fetch(url);
            if (!res.ok) {
                console.error(`Error fetching products from ${url}: Status ${res.status}`);
                return [];
            }
            const data = await res.json();
            console.log(`Successfully loaded ${data.length} products from ${url}`);
            return data;
        } catch (error) {
            console.error(`Error fetching products from ${url}:`, error);
            return [];
        }
    }

    // Determine if we're in a brand page and set the base path
    const path = window.location.pathname;
    const isBrandPage = path.includes('/brands/');
    
    console.log('Current path:', path);
    console.log('Is brand page:', isBrandPage);
    
    // Set correct base paths for JSON files and images
    const jsonBasePath = '';  // Default for main products page
    
    console.log('JSON base path:', jsonBasePath);

    // Fetch products with correct paths - use absolute URLs to avoid path issues
    const manProducts = await fetchProducts(`/${jsonBasePath}man/products.json`);
    const womenProducts = await fetchProducts(`/${jsonBasePath}women/products.json`);
    const unisexProducts = await fetchProducts(`/${jsonBasePath}unisex/products.json`);
    
    console.log('Loaded products summary:', {
        men: manProducts.length,
        women: womenProducts.length,
        unisex: unisexProducts.length,
        total: manProducts.length + womenProducts.length + unisexProducts.length
    });
    
    const allProducts = [...manProducts, ...womenProducts, ...unisexProducts];
    
    if (allProducts.length === 0) {
        console.error('No products were loaded from any JSON file');
    }

    // Detect brand for brand pages
    let currentBrand = null;
    const brandTitle = document.querySelector('h1');
    if (brandTitle) {
        const match = brandTitle.textContent.match(/([A-Za-z\- ]+) Collection/i);
        if (match) {
            currentBrand = match[1].trim().toLowerCase().replace(/ /g, '-');
            // Handle special cases for brand names
            if (currentBrand === 'air-jordan') currentBrand = 'jordan';
            if (currentBrand === 'new-balance') currentBrand = 'newbalance';
            console.log('Detected brand:', currentBrand);
        }
    }

    let productsToRender = allProducts;
    if (currentBrand) {
        productsToRender = allProducts.filter(p => {
            const normalizedBrand = p.brand.toLowerCase().replace(/ /g, '-');
            return normalizedBrand === currentBrand;
        });
        
        console.log(`Filtered ${productsToRender.length} products for brand: ${currentBrand}`);
        
        // Update filter sidebar to show only relevant collections for this brand
        const collectionFilters = document.querySelector('.filter-group:first-of-type');
        if (collectionFilters) {
            const collections = [...new Set(productsToRender.map(p => p.collection))];
            const filterOptions = collectionFilters.querySelector('.filter-options');
            if (filterOptions) {
                filterOptions.innerHTML = collections.map(collection => `
                    <label class="filter-option">
                        <input type="checkbox" name="collection" value="${collection.toLowerCase().replace(/ /g, '-')}">
                        <span class="checkmark"></span>
                        <span class="option-text">${collection}</span>
                    </label>
                `).join('');
            }
        }
    }

    // Render products
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        console.log('Found products grid, clearing and rendering products');
        
        // Clear the grid
        productsGrid.innerHTML = '';
        
        if (productsToRender.length === 0) {
            console.warn('No products to render');
            productsGrid.innerHTML = '<div class="no-products-message">No products available.</div>';
        } else {
            console.log(`Rendering ${productsToRender.length} products`);
            
            // Render products
            productsToRender.forEach((product, index) => {
                try {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.setAttribute('data-price', product.price);
                    card.setAttribute('data-brand', product.brand);
                    card.setAttribute('data-category', product.category);
                    card.setAttribute('data-collection', product.collection.toLowerCase().replace(/ /g, '-'));
                    card.setAttribute('data-sizes', product.sizes.join(','));
                    if (product.new) card.setAttribute('data-new', 'true');
                    
                    // Fix image path
                    let imagePath = product.image;
                    
                    // Remove "../" prefix if present on the main products page
                    if (imagePath.startsWith('../') && !isBrandPage) {
                        imagePath = imagePath.substring(3);
                    }
                    
                    console.log(`Product ${index + 1}: ${product.name}, Image path: ${imagePath}`);
                    
                    card.innerHTML = `
                        ${product.new ? '<div class="product-tag new">New</div>' : ''}
                        <div class="product-category-tag${product.category === 'unisex' ? ' unisex' : ''}">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                        <img src="${imagePath}" alt="${product.name}" loading="lazy">
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <div class="price">₹${product.price}</div>
                        </div>
                        <div class="product-actions">
                            <button class="btn quick-view-btn">Quick View</button>
                        </div>
                    `;
                    productsGrid.appendChild(card);
                } catch (error) {
                    console.error(`Error rendering product ${index}:`, error, product);
                }
            });

            console.log(`Rendered ${productsToRender.length} products`);

            // Initialize quick view functionality after all products are rendered
            setTimeout(() => {
                initializeQuickView();
                console.log('Quick view initialized after products render');
            }, 100);
        }
    } else {
        console.error('Products grid not found');
    }
    
    // Initialize quick view modal functionality
    function initializeQuickView() {
        const quickViewModal = document.querySelector('.quick-view-modal');
        const closeModalBtn = document.querySelector('.close-modal');
        
        if (!quickViewModal || !closeModalBtn) {
            console.error('Quick view modal elements not found');
            return;
        }

        // Remove existing event listeners
        const oldButtons = document.querySelectorAll('.quick-view-btn');
        oldButtons.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });

        // Close modal when clicking the close button
        closeModalBtn.addEventListener('click', function() {
            quickViewModal.classList.remove('active');
        });

        // Close modal when clicking outside
        quickViewModal.addEventListener('click', function(e) {
            if (e.target === quickViewModal) {
                quickViewModal.classList.remove('active');
            }
        });

        // Initialize quick view buttons
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Quick view button clicked');
                
                const card = this.closest('.product-card');
                if (!card) {
                    console.error('Product card not found');
                    return;
                }

                const category = card.getAttribute('data-category');
                const sizes = card.getAttribute('data-sizes').split(',');
                
                // Update modal content
                const modalImage = quickViewModal.querySelector('.modal-image img');
                const modalTitle = quickViewModal.querySelector('.modal-title');
                const modalPrice = quickViewModal.querySelector('.modal-price');
                const modalDescription = quickViewModal.querySelector('.modal-description');
                const sizeOptions = quickViewModal.querySelector('.size-options');
                
                if (!modalImage || !modalTitle || !modalPrice || !modalDescription || !sizeOptions) {
                    console.error('Modal elements not found');
                    return;
                }

                const productImage = card.querySelector('img');
                modalImage.src = productImage.src;
                modalTitle.textContent = card.querySelector('h3').textContent;
                modalPrice.textContent = '₹' + card.getAttribute('data-price');
                
                // Set description based on product type
                const productName = card.querySelector('h3').textContent;
                modalDescription.textContent = `Experience premium quality with our 1:1 replica of the ${productName}. Perfect craftsmanship, premium materials, and unbeatable comfort.`;
                
                // Update size options based on category and available sizes
                sizeOptions.innerHTML = sizes.map(size => `
                    <button class="size-btn">UK ${size}</button>
                `).join('');
                
                // Show modal with animation
                quickViewModal.classList.add('active');
                
                // Initialize size button functionality
                const sizeButtons = sizeOptions.querySelectorAll('.size-btn');
                sizeButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        sizeButtons.forEach(btn => btn.classList.remove('selected'));
                        this.classList.add('selected');
                    });
                });
                
                console.log('Quick view modal opened');
            });
        });
        
        console.log('Quick view buttons initialized:', document.querySelectorAll('.quick-view-btn').length);
    }
    
    // Initialize animations
    if (typeof initializeAnimations === 'function') {
        initializeAnimations();
    } else {
        console.warn('initializeAnimations function not found');
    }
    
    // Mobile filter sidebar toggle
    const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
    const mobileFilterClose = document.querySelector('.mobile-filter-close');
    const filterSidebar = document.querySelector('.filter-sidebar');
    const overlay = document.querySelector('.overlay');
    
    if (mobileFilterToggle && filterSidebar) {
        mobileFilterToggle.addEventListener('click', function() {
            filterSidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (mobileFilterClose && filterSidebar) {
        mobileFilterClose.addEventListener('click', function() {
            filterSidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Product filtering functionality
    const applyFilterBtn = document.querySelector('.apply-filter');
    const clearFilterBtn = document.querySelector('.clear-filter');
    const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
    const sizeCheckboxes = document.querySelectorAll('input[name="size"]');
    const minPriceInput = document.getElementById('min-price-input');
    const maxPriceInput = document.getElementById('max-price-input');
    const minPriceSlider = document.getElementById('min-price');
    const maxPriceSlider = document.getElementById('max-price');
    const sortSelect = document.getElementById('sort-select');
    
    // Initialize price sliders
    if (minPriceSlider && minPriceInput) {
        minPriceSlider.addEventListener('input', function() {
            minPriceInput.value = this.value;
        });
    }
    
    if (maxPriceSlider && maxPriceInput) {
        maxPriceSlider.addEventListener('input', function() {
            maxPriceInput.value = this.value;
        });
    }
    
    if (minPriceInput && minPriceSlider) {
        minPriceInput.addEventListener('input', function() {
            minPriceSlider.value = this.value;
        });
    }
    
    if (maxPriceInput && maxPriceSlider) {
        maxPriceInput.addEventListener('input', function() {
            maxPriceSlider.value = this.value;
        });
    }
    
    // Apply filters with animation
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            applyFiltersWithAnimation();
            
            if (window.innerWidth < 992) {
                filterSidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Clear filters
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', function() {
            resetFilters();
            resetProductsWithAnimation();
        });
    }
    
    // Reset all filters
    function resetFilters() {
        // Reset brand checkboxes
        brandCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset size checkboxes
        sizeCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset category checkboxes
        const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset price range
        if (minPriceSlider && maxPriceSlider && minPriceInput && maxPriceInput) {
            minPriceSlider.value = minPriceSlider.min;
            maxPriceSlider.value = maxPriceSlider.max;
            minPriceInput.value = minPriceSlider.min;
            maxPriceInput.value = maxPriceSlider.max;
        }
    }
    
    // Sort products with animation
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProductsWithAnimation(this.value);
        });
    }
    
    function applyFiltersWithAnimation() {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;
        
        const selectedCollections = Array.from(document.querySelectorAll('input[name="collection"]:checked'))
            .map(checkbox => checkbox.value);
            
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
            .map(checkbox => checkbox.value);
            
        const selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked'))
            .map(checkbox => checkbox.value.replace('uk-', ''));
            
        const minPrice = parseInt(minPriceInput.value);
        const maxPrice = parseInt(maxPriceInput.value);
        
        // First fade out all products
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
        });
        
        // After fade out, apply filters and fade in matching products
        setTimeout(() => {
            productCards.forEach(card => {
                const price = parseInt(card.getAttribute('data-price'));
                const category = card.getAttribute('data-category');
                const collection = card.getAttribute('data-collection');
                const sizes = card.getAttribute('data-sizes').split(',');
                
                // Check if product meets all filter criteria
                const meetsPrice = price >= minPrice && price <= maxPrice;
                const meetsCollection = selectedCollections.length === 0 || selectedCollections.includes(collection);
                const meetsCategory = selectedCategories.length === 0 || selectedCategories.includes(category);
                const meetsSizes = selectedSizes.length === 0 || selectedSizes.some(size => sizes.includes(size));
                
                // Show or hide product based on filter criteria
                if (meetsPrice && meetsCollection && meetsCategory && meetsSizes) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
            
            // After filtering, apply current sort
            sortProducts(sortSelect.value);
        }, 300);
    }
    
    function resetProductsWithAnimation() {
        // First fade out all products
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
        });
        
        // After fade out, show all products and fade them in
        setTimeout(() => {
            productCards.forEach(card => {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            });
            
            // Apply default sort
            sortProducts(sortSelect.value);
        }, 300);
    }
    
    function sortProductsWithAnimation(sortType) {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;
        
        // Fade out
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
        });
        
        // After fade out, sort and fade in
        setTimeout(() => {
            sortProducts(sortType);
            
            // Fade in with staggered delay
            Array.from(productsGrid.children).forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50 * index);
            });
        }, 300);
    }
    
    function applyFilters() {
        const selectedBrands = Array.from(brandCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
            
        const selectedSizes = Array.from(sizeCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
            
        const minPrice = parseInt(minPriceInput.value);
        const maxPrice = parseInt(maxPriceInput.value);
        
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const price = parseInt(card.getAttribute('data-price'));
            const brand = card.getAttribute('data-brand');
            
            // Check if product meets all filter criteria
            const meetsPrice = price >= minPrice && price <= maxPrice;
            const meetsBrand = selectedBrands.length === 0 || selectedBrands.includes(brand);
            
            // Show or hide product based on filter criteria
            if (meetsPrice && meetsBrand) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
        
        // After filtering, apply current sort
        sortProducts(sortSelect.value);
    }
    
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
    
    // Size selector in modal with animation
    const sizeBtns = document.querySelectorAll('.size-btn');
    if (sizeBtns.length > 0) {
        sizeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                sizeBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button with animation
                this.classList.add('active');
                
                // Add ripple effect
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                this.appendChild(ripple);
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${0}px`;
                ripple.style.top = `${0}px`;
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    // Initialize animations for the product page
    function initializeAnimations() {
        // Only proceed if we have product cards
        const cards = document.querySelectorAll('.product-card');
        if (!cards.length) return;

        // Add hover animations to product cards
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
            });
        });

        // Add click animations to buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
            });
        });
    }
    
    // Create particle effect for product cards
    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        const particleCount = 3;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('span');
            particle.classList.add('product-particle');
            
            // Random position around the card
            const x = Math.random() * rect.width;
            const y = Math.random() * rect.height;
            
            // Random size
            const size = Math.random() * 8 + 4;
            
            // Style the particle
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.position = 'absolute';
            particle.style.borderRadius = '50%';
            particle.style.background = 'rgba(157, 78, 221, 0.6)';
            particle.style.boxShadow = '0 0 10px rgba(157, 78, 221, 0.8)';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1';
            particle.style.opacity = '0';
            
            // Add to card
            element.appendChild(particle);
            
            // Animate
            setTimeout(() => {
                particle.style.transition = 'all 0.8s ease-out';
                particle.style.opacity = '1';
                particle.style.transform = `translate(${(Math.random() - 0.5) * 40}px, ${(Math.random() - 0.5) * 40}px)`;
                
                // Remove after animation
                setTimeout(() => {
                    particle.style.opacity = '0';
                    setTimeout(() => {
                        if (particle.parentNode === element) {
                            element.removeChild(particle);
                        }
                    }, 800);
                }, 400);
            }, i * 100);
        }
    }
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // --- Mobile Navigation Menu for Product Page ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenuList = document.querySelector('.nav-menu');
    let navOverlay = document.querySelector('.nav-overlay');
    const body = document.body;

    // Create nav overlay if it doesn't exist
    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.classList.add('nav-overlay');
        document.body.appendChild(navOverlay);
    }

    if (menuToggle && navMenuList) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenuList.classList.toggle('active');
            navOverlay.classList.toggle('active');
            if (navMenuList.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
            // Animate hamburger icon
            const icon = this.querySelector('i');
            if (icon) {
                if (navMenuList.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        // Close menu when clicking on a menu item
        const menuItems = navMenuList.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMenuList.classList.remove('active');
                navOverlay.classList.remove('active');
                body.style.overflow = '';
                // Reset hamburger icon
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
        // Close menu when clicking on overlay
        navOverlay.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMenuList.classList.remove('active');
            navOverlay.classList.remove('active');
            body.style.overflow = '';
            // Reset hamburger icon
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}); 