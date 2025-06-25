/**
 * Rep Arise - Products Page Script
 */

(() => {
    // DOM helper functions
    const $ = selector => document.querySelector(selector);
    const $$ = selector => document.querySelectorAll(selector);
    const createElement = (tag, className) => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        return el;
    };

    // Product management
    const products = {
        async fetchProducts(url) {
            try {
                console.log(`Fetching products from: ${url}`);
            const res = await fetch(url);
            if (!res.ok) {
                console.error(`Error fetching products from ${url}: Status ${res.status}`);
                return [];
            }
            const data = await res.json();
                console.log(`Loaded ${data.length} products from ${url}`);
            return data;
        } catch (error) {
            console.error(`Error fetching products from ${url}:`, error);
            return [];
        }
        },

        async loadAllProducts() {
            const jsonBasePath = '';
            const [manProducts, womenProducts, unisexProducts] = await Promise.all([
                this.fetchProducts(`/${jsonBasePath}man/products.json`),
                this.fetchProducts(`/${jsonBasePath}women/products.json`),
                this.fetchProducts(`/${jsonBasePath}unisex/products.json`)
            ]);

            console.log('Products loaded:', {
        men: manProducts.length,
        women: womenProducts.length,
        unisex: unisexProducts.length,
        total: manProducts.length + womenProducts.length + unisexProducts.length
    });
    
            return [...manProducts, ...womenProducts, ...unisexProducts];
        },

        detectBrand() {
            const brandTitle = $('h1');
            if (!brandTitle) return null;

        const match = brandTitle.textContent.match(/([A-Za-z\- ]+) Collection/i);
            if (!match) return null;

            let brand = match[1].trim().toLowerCase().replace(/ /g, '-');
            return brand === 'air-jordan' ? 'jordan' : 
                   brand === 'new-balance' ? 'newbalance' : brand;
        },

        filterByBrand(products, brand) {
            return brand ? products.filter(p => 
                p.brand.toLowerCase().replace(/ /g, '-') === brand
            ) : products;
        }
    };

    // Sorting and filtering
    const productGrid = {
        sortProducts(sortType) {
            const grid = $('.products-grid');
            if (!grid) return;

            const products = Array.from(grid.children).filter(card =>
            window.getComputedStyle(card).display !== 'none'
        );
        
        products.sort((a, b) => {
            const priceA = parseInt(a.getAttribute('data-price')) || 0;
            const priceB = parseInt(b.getAttribute('data-price')) || 0;
            const isNewA = a.hasAttribute('data-new');
            const isNewB = b.hasAttribute('data-new');
            
            switch (sortType) {
                    case 'low-high': return priceA - priceB;
                    case 'high-low': return priceB - priceA;
                default:
                        return isNewA !== isNewB ? (isNewA ? -1 : 1) : priceB - priceA;
                }
            });

            // Remove all products from the grid
            while (grid.firstChild) {
                grid.removeChild(grid.firstChild);
            }

            // Add them back in the sorted order
            products.forEach(product => grid.appendChild(product));
            
            console.log(`Sorted ${products.length} products by ${sortType}`);
        },

        applyFilters() {
            const filters = {
                brands: Array.from($$('input[name="brand"]:checked')).map(cb => cb.value),
                sizes: Array.from($$('input[name="size"]:checked')).map(cb => cb.value),
                price: {
                    min: parseInt($('#min-price-input')?.value) || 0,
                    max: parseInt($('#max-price-input')?.value) || Infinity
                }
            };

            $$('.product-card').forEach(card => {
                const price = parseInt(card.getAttribute('data-price'));
                const brand = card.getAttribute('data-brand');
                const meetsPrice = price >= filters.price.min && price <= filters.price.max;
                const meetsBrand = !filters.brands.length || filters.brands.includes(brand);

                card.style.display = meetsPrice && meetsBrand ? 'flex' : 'none';
            });

            this.sortProducts($('#sort-select')?.value || 'new');
        }
    };

    // UI animations and effects
    const ui = {
        initializeAnimations() {
            $$('.product-card').forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-5px)';
                    card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0)';
                    card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
                });
            });

            $$('.btn').forEach(btn => {
                btn.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                    setTimeout(() => this.style.transform = 'scale(1)', 100);
                });
            });
        },
    
        createParticles(element) {
        const rect = element.getBoundingClientRect();
            Array.from({ length: 3 }).forEach((_, i) => {
                const particle = createElement('span', 'product-particle');
                const size = Math.random() * 8 + 4;
            const x = Math.random() * rect.width;
            const y = Math.random() * rect.height;
            
                Object.assign(particle.style, {
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${x}px`,
                    top: `${y}px`,
                    position: 'absolute',
                    borderRadius: '50%',
                    background: 'rgba(157, 78, 221, 0.6)',
                    boxShadow: '0 0 10px rgba(157, 78, 221, 0.8)',
                    pointerEvents: 'none',
                    zIndex: '1',
                    opacity: '0'
                });

            element.appendChild(particle);
            
            setTimeout(() => {
                particle.style.transition = 'all 0.8s ease-out';
                particle.style.opacity = '1';
                particle.style.transform = `translate(${(Math.random() - 0.5) * 40}px, ${(Math.random() - 0.5) * 40}px)`;
                
                    setTimeout(() => {
                        particle.style.opacity = '0';
                        setTimeout(() => particle.parentNode === element && element.removeChild(particle), 800);
                }, 400);
            }, i * 100);
            });
        },

        addRippleEffect() {
            $$('.btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
                    const ripple = createElement('span', 'ripple');
                    ripple.style.left = `${e.clientX - rect.left}px`;
                    ripple.style.top = `${e.clientY - rect.top}px`;
                    this.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                });
            });
        },

        initializeSizeSelector() {
            $$('.size-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    $$('.size-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');

                    const ripple = createElement('span', 'ripple');
            this.appendChild(ripple);
            
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    ripple.style.width = ripple.style.height = `${size}px`;
                    ripple.style.left = ripple.style.top = '0px';

                    setTimeout(() => ripple.remove(), 600);
        });
    });
        },

        initializeMobileNav() {
            const menuToggle = $('.menu-toggle');
            const navMenu = $('.nav-menu');
            let navOverlay = $('.nav-overlay');

    if (!navOverlay) {
                navOverlay = createElement('div', 'nav-overlay');
        document.body.appendChild(navOverlay);
    }

            if (menuToggle && navMenu) {
                const toggleMenu = (active) => {
                    menuToggle.classList.toggle('active', active);
                    navMenu.classList.toggle('active', active);
                    navOverlay.classList.toggle('active', active);
                    document.body.style.overflow = active ? 'hidden' : '';

                const icon = menuToggle.querySelector('i');
                if (icon) {
                        icon.className = `fas fa-${active ? 'times' : 'bars'}`;
                    }
                };

                menuToggle.addEventListener('click', () => toggleMenu(!navMenu.classList.contains('active')));
                navOverlay.addEventListener('click', () => toggleMenu(false));
                navMenu.querySelectorAll('a').forEach(item => item.addEventListener('click', () => toggleMenu(false)));
            }
        },
        
        initializeSortSelect() {
            const sortSelect = $('#sort-select');
            if (sortSelect) {
                // Set initial value to "new"
                sortSelect.value = 'new';
                
                // Apply initial sort
                if (typeof productGrid.sortProducts === 'function') {
                    productGrid.sortProducts('new');
                }
                
                // Add change event listener
                sortSelect.addEventListener('change', function() {
                    if (typeof productGrid.sortProducts === 'function') {
                        productGrid.sortProducts(this.value);
                    }
                });
                
                console.log('Sort selector initialized with "Newest" as default');
            }
        }
    };

    // Make sortProducts globally available for other scripts
    window.sortProducts = productGrid.sortProducts;

    // Initialize everything when DOM is ready
    document.addEventListener('DOMContentLoaded', async () => {
        console.log('Products page loaded successfully!');

        const allProducts = await products.loadAllProducts();
        if (!allProducts.length) {
            console.error('No products were loaded from any JSON file');
            return;
        }

        const currentBrand = products.detectBrand();
        if (currentBrand) {
            console.log('Detected brand:', currentBrand);
            const filteredProducts = products.filterByBrand(allProducts, currentBrand);
            console.log(`Filtered ${filteredProducts.length} products for brand: ${currentBrand}`);
        }

        ui.initializeAnimations();
        ui.addRippleEffect();
        ui.initializeSizeSelector();
        ui.initializeMobileNav();
        ui.initializeSortSelect();
    });
})(); 