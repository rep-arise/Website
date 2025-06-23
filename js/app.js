/**
 * Rep Arise - Main Application Script
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Rep Arise website loaded successfully!');
    
    // Mobile filter sidebar toggle (for shop page)
    const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
    const mobileFilterClose = document.querySelector('.mobile-filter-close');
    const filterSidebar = document.querySelector('.filter-sidebar');
    const filterOverlay = document.querySelector('.filter-overlay');
    
    // Verify elements are found
    if (window.innerWidth < 992) {
        console.log('Mobile view detected');
        console.log('Filter toggle found:', !!mobileFilterToggle);
        console.log('Filter sidebar found:', !!filterSidebar);
        console.log('Filter overlay found:', !!filterOverlay);
        console.log('Filter close button found:', !!mobileFilterClose);
    }

    if (mobileFilterToggle && filterSidebar) {
        mobileFilterToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Filter toggle clicked');
            
            // Show the overlay first
            if (filterOverlay) {
                filterOverlay.classList.add('active');
            }
            
            // Add active class to show the sidebar
            filterSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (mobileFilterClose && filterSidebar) {
        mobileFilterClose.addEventListener('click', closeFilterSidebar);
    }

    if (filterOverlay) {
        filterOverlay.addEventListener('click', closeFilterSidebar);
    }

    function closeFilterSidebar() {
        console.log('Closing filter sidebar');
        
        if (filterSidebar) {
            filterSidebar.classList.remove('active');
        }
        
        if (filterOverlay) {
            filterOverlay.classList.remove('active');
        }
        
        document.body.style.overflow = '';
    }

    // Close filter sidebar when pressing escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeFilterSidebar();
        }
    });
    
    // Sort products by newest first by default
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.value = 'new';
        sortProducts('new');
    }
    
    // Make "View Collection" links work
    const brandItems = document.querySelectorAll('.brand-item');
    if (brandItems) {
        brandItems.forEach(item => {
            item.addEventListener('click', function() {
                const link = this.querySelector('.brand-name').getAttribute('href');
                if (link) {
                    window.location.href = link;
                }
            });
        });
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Product filtering functionality
    const applyFilterBtn = document.querySelector('.apply-filter');
    const clearFilterBtn = document.querySelector('.clear-filter');
    const productCards = document.querySelectorAll('.product-card');
    const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
    const sizeCheckboxes = document.querySelectorAll('input[name="size"]');
    const minPriceInput = document.getElementById('min-price-input');
    const maxPriceInput = document.getElementById('max-price-input');
    const minPriceSlider = document.getElementById('min-price');
    const maxPriceSlider = document.getElementById('max-price');
    
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
    
    // Apply filters
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            applyFilters();
            
            if (window.innerWidth < 992) {
                closeFilterSidebar();
            }
        });
    }
    
    // Clear filters
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', function() {
            // Reset brand checkboxes
            brandCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Reset size checkboxes
            sizeCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Reset price range
            if (minPriceSlider && maxPriceSlider && minPriceInput && maxPriceInput) {
                minPriceSlider.value = minPriceSlider.min;
                maxPriceSlider.value = maxPriceSlider.max;
                minPriceInput.value = minPriceSlider.min;
                maxPriceInput.value = maxPriceSlider.max;
            }
            
            // Show all products
            productCards.forEach(card => {
                card.style.display = 'flex';
            });
        });
    }
    
    // Sort products
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
    
    function applyFilters() {
        const selectedBrands = Array.from(brandCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        const selectedSizes = Array.from(sizeCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        const minPrice = parseInt(minPriceInput.value);
        const maxPrice = parseInt(maxPriceInput.value);
        let visibleCount = 0;

        // Check if any filters are actually applied
        const isAnyFilterApplied = selectedBrands.length > 0 || 
                                 selectedSizes.length > 0 || 
                                 selectedCategories.length > 0 || 
                                 minPrice > parseInt(minPriceInput.min) || 
                                 maxPrice < parseInt(maxPriceInput.max);

        productCards.forEach(card => {
            const price = parseInt(card.getAttribute('data-price'));
            const brand = card.getAttribute('data-brand');
            const category = card.getAttribute('data-category');
            const sizes = (card.getAttribute('data-sizes') || '').split(',');
            
            // Unisex logic: show unisex if men or women is selected
            let meetsCategory = false;
            if (selectedCategories.length === 0) {
                meetsCategory = true;
            } else if (selectedCategories.includes('men') && (category === 'men' || category === 'unisex')) {
                meetsCategory = true;
            } else if (selectedCategories.includes('women') && (category === 'women' || category === 'unisex')) {
                meetsCategory = true;
            }

            // Check if product meets all filter criteria
            const meetsPrice = price >= minPrice && price <= maxPrice;
            const meetsBrand = selectedBrands.length === 0 || selectedBrands.includes(brand);
            const meetsSize = selectedSizes.length === 0 || selectedSizes.some(size => sizes.includes(size));

            // Show or hide product based on filter criteria
            if (meetsPrice && meetsBrand && meetsCategory && meetsSize) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // After filtering, apply current sort
        sortProducts(sortSelect.value);

        // Show/hide no products message only if filters are actually applied
        let noProductsMsg = document.querySelector('.no-products-message');
        if (!noProductsMsg) {
            noProductsMsg = document.createElement('div');
            noProductsMsg.className = 'no-products-message';
            noProductsMsg.textContent = 'No products available under the selected filter.';
            const productsGrid = document.querySelector('.products-grid');
            if (productsGrid && productsGrid.parentNode) {
                productsGrid.parentNode.insertBefore(noProductsMsg, productsGrid);
            }
        }
        noProductsMsg.style.display = (isAnyFilterApplied && visibleCount === 0) ? 'block' : 'none';
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
    
    // Quick View Modal Functionality
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const quickViewModal = document.querySelector('.quick-view-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    
    if (quickViewBtns.length > 0 && quickViewModal) {
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productImage = productCard.querySelector('img').src;
                const productTitle = productCard.querySelector('h3').textContent;
                const productPrice = productCard.querySelector('.price').textContent;
                const productCategory = productCard.getAttribute('data-category');
                
                // Update modal content
                quickViewModal.querySelector('.modal-image img').src = productImage;
                quickViewModal.querySelector('.modal-title').textContent = productTitle;
                quickViewModal.querySelector('.modal-price').textContent = productPrice;

                // Dynamically update size options based on category
                const sizeOptionsDiv = quickViewModal.querySelector('.size-options');
                if (sizeOptionsDiv) {
                    let sizes = [];
                    if (productCategory === 'women') {
                        sizes = ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7'];
                    } else if (productCategory === 'unisex') {
                        sizes = ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'];
                    } else {
                        // fallback: show all sizes for men or other
                        sizes = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'];
                    }
                    sizeOptionsDiv.innerHTML = sizes.map(size => `<button class="size-btn">${size}</button>`).join('');
                    // Re-attach click listeners for new buttons
                    const newSizeBtns = sizeOptionsDiv.querySelectorAll('.size-btn');
                    newSizeBtns.forEach(btn => {
                        btn.addEventListener('click', function() {
                            newSizeBtns.forEach(b => b.classList.remove('active'));
                            this.classList.add('active');
                        });
                    });
                }
                
                // Open modal
                quickViewModal.classList.add('active');
                filterOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }
    
    if (closeModalBtn && quickViewModal) {
        closeModalBtn.addEventListener('click', function() {
            quickViewModal.classList.remove('active');
            filterOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Size selector in modal
    const sizeBtns = document.querySelectorAll('.size-btn');
    if (sizeBtns.length > 0) {
        sizeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                sizeBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
            });
        });
    }
    
    // Close overlay when clicked
    if (filterOverlay) {
        filterOverlay.addEventListener('click', function() {
            // Close all modals/sidebars
            if (filterSidebar && filterSidebar.classList.contains('active')) {
                closeFilterSidebar();
            }
            
            if (quickViewModal && quickViewModal.classList.contains('active')) {
                quickViewModal.classList.remove('active');
            }
            
            filterOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}); 