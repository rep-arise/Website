/**
 * Rep Arise - Main Application Script
 */

(() => {
    // DOM helper functions
    const $ = selector => document.querySelector(selector);
    const $$ = selector => document.querySelectorAll(selector);
    const isMobile = () => window.innerWidth < 992;

    // Filter sidebar functionality
    const filterSidebar = {
        elements: {},

        init() {
            this.cacheElements();
            if (!this.elements.sidebar) return;

            this.logMobileStatus();
            this.bindEvents();
            this.initPriceSliders();
        },

        cacheElements() {
            this.elements = {
                toggle: $('.mobile-filter-toggle'),
                close: $('.mobile-filter-close'),
                sidebar: $('.filter-sidebar'),
                overlay: $('.filter-overlay'),
                applyBtn: $('.apply-filter'),
                clearBtn: $('.clear-filter'),
                minPriceInput: $('#min-price-input'),
                maxPriceInput: $('#max-price-input'),
                minPriceSlider: $('#min-price'),
                maxPriceSlider: $('#max-price')
            };
        },

        logMobileStatus() {
            if (isMobile()) {
                const { toggle, sidebar, overlay, close } = this.elements;
                console.log('Mobile view detected', {
                    filterToggleFound: !!toggle,
                    filterSidebarFound: !!sidebar,
                    filterOverlayFound: !!overlay,
                    filterCloseFound: !!close
                });
    }
        },

        bindEvents() {
            const { toggle, close, overlay, sidebar } = this.elements;

            if (toggle) {
                toggle.addEventListener('click', e => {
            e.preventDefault();
            console.log('Filter toggle clicked');
                    this.openSidebar();
                });
            }

            if (close) close.addEventListener('click', () => this.closeSidebar());
            if (overlay) overlay.addEventListener('click', () => this.closeSidebar());
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape') this.closeSidebar();
            });
        },

        openSidebar() {
            const { overlay, sidebar } = this.elements;
            if (overlay) overlay.classList.add('active');
            if (sidebar) sidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        },

        closeSidebar() {
        console.log('Closing filter sidebar');
            const { overlay, sidebar } = this.elements;
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
        },

        initPriceSliders() {
            const { minPriceInput, maxPriceInput, minPriceSlider, maxPriceSlider } = this.elements;

            const syncInputs = (slider, input) => {
                if (slider && input) {
                    slider.addEventListener('input', () => input.value = slider.value);
                    input.addEventListener('input', () => slider.value = input.value);
                }
            };

            syncInputs(minPriceSlider, minPriceInput);
            syncInputs(maxPriceSlider, maxPriceInput);
        }
    };
    
    // Product sorting and filtering
    const products = {
        init() {
            this.ensureDefaultSort();
            this.initBrandLinks();
            this.initSmoothScroll();
        },

        ensureDefaultSort() {
            const sortSelect = $('#sort-select');
    if (sortSelect) {
                console.log('Setting default sort to "Newest"');
        sortSelect.value = 'new';
                
                // Apply the sort if the function is available
                if (typeof window.sortProducts === 'function') {
                    window.sortProducts('new');
                    console.log('Applied default "Newest" sort');
                } else if (typeof sortProducts === 'function') {
                    sortProducts('new');
                    console.log('Applied default "Newest" sort using local function');
                } else {
                    console.log('Sort function not available yet');
                    
                    // Set up a small delay to try again
                    setTimeout(() => {
                        if (typeof window.sortProducts === 'function') {
                            window.sortProducts('new');
                            console.log('Applied delayed default "Newest" sort');
                        }
                    }, 500);
            }
            }
        },

        initBrandLinks() {
            $$('.brand-item').forEach(item => {
                item.addEventListener('click', () => {
                    const link = item.querySelector('.brand-name')?.getAttribute('href');
                    if (link) window.location.href = link;
                });
        });
        },

        initSmoothScroll() {
            $$('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', e => {
                    const href = anchor.getAttribute('href');
                    if (href === '#') return;

                    e.preventDefault();
                    const target = $(href);
                    if (target) {
                        window.scrollTo({
                            top: target.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
            });
        });
    }
    };

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Rep Arise website loaded successfully!');
        filterSidebar.init();
        products.init();
    });
})(); 