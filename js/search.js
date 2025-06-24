/**
 * Rep Arise - Search Functionality
 * Version: 1.3
 */

(() => {
    // DOM helper functions with memoization
    const domCache = new Map();
    const $ = selector => {
        if (!domCache.has(selector)) {
            domCache.set(selector, document.querySelector(selector));
        }
        return domCache.get(selector);
    };
    
    const $$ = selector => document.querySelectorAll(selector);
    
    const createElement = (tag, className) => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        return el;
    };

    // Constants
    const SEARCH_STYLES = `
        .search-container {
            position: relative;
            display: flex;
            align-items: center;
            margin-left: 15px;
        }

        .search-form {
            display: flex;
            align-items: center;
        }

        .search-input {
            background-color: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50px;
            padding: 8px 15px;
            color: #ffffff;
            font-size: 14px;
            width: 200px;
            transition: all 0.3s ease-in-out;
        }

        .search-input:focus {
            outline: none;
            background-color: rgba(255, 255, 255, 0.15);
            border-color: #9d4edd;
            box-shadow: 0 0 10px rgba(157, 78, 221, 0.3);
            width: 220px;
        }

        .search-input::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }
        
        .search-icon {
            color: #ffffff;
            font-size: 18px;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            background-color: transparent;
            transition: all 0.3s ease-in-out;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .search-icon:hover {
            background-color: rgba(255, 255, 255, 0.1);
            transform: scale(1.05);
        }

        .search-submit {
            background: none;
            border: none;
            color: #ffffff;
            cursor: pointer;
            margin-left: -35px;
            z-index: 2;
            opacity: 0.7;
            transition: all 0.3s ease-in-out;
        }

        .search-submit:hover {
            opacity: 1;
        }

        .search-close {
            display: none;
            background: none;
            border: none;
            color: #ffffff;
            cursor: pointer;
            font-size: 16px;
            margin-left: 5px;
            opacity: 0.7;
            transition: all 0.3s ease-in-out;
        }

        .search-close:hover {
            opacity: 1;
        }

        .no-results-message {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            text-align: center;
            width: 100%;
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            margin: 20px 0;
        }

        .no-results-icon {
            font-size: 48px;
            color: #9d4edd;
            margin-bottom: 20px;
            opacity: 0.7;
        }

        .no-results-message h3 {
            font-size: 24px;
            color: #ffffff;
            margin-bottom: 10px;
        }

        .no-results-message p {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 20px;
        }

        .reset-search-btn {
            padding: 10px 20px;
            font-size: 14px;
        }

        @media (max-width: 768px) {
            .search-container {
                margin-left: 0;
                position: absolute;
                top: 80px;
                left: 0;
                width: 100%;
                padding: 10px 20px;
                background-color: rgba(0, 0, 0, 0.9);
                z-index: 999;
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .search-container.active {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }

            .search-form {
                width: 100%;
            }

            .search-input {
                width: 100%;
                padding: 10px 15px;
                font-size: 16px;
            }

            .search-close {
                display: block;
            }

            .search-icon {
                margin-right: 10px;
            }
        }
    `;

    const SEARCH_HTML = `
        <div class="search-icon">
            <i class="fas fa-search"></i>
        </div>
        <div class="search-container">
            <form class="search-form">
                <input type="text" class="search-input" placeholder="Search products...">
                <button type="submit" class="search-submit">
                    <i class="fas fa-search"></i>
                </button>
                <button type="button" class="search-close">
                    <i class="fas fa-times"></i>
                </button>
            </form>
        </div>
    `;

    // Search functionality with performance optimizations
    const search = {
        elements: {},
        searchTimeout: null,
        lastQuery: '',
        
        init() {
            this.addSearchUI();
            this.initializeSearch();
            
            // Check for search param in URL on load
            const urlParams = new URLSearchParams(window.location.search);
            const searchQuery = urlParams.get('search');
            if (searchQuery) {
                this.elements.searchInput.value = searchQuery;
                this.performSearch(searchQuery);
            }
        },

        addSearchUI() {
            // Add styles once
            if (!document.getElementById('search-styles')) {
                const style = createElement('style');
                style.id = 'search-styles';
                style.textContent = SEARCH_STYLES;
                document.head.appendChild(style);
            }

            // Add search HTML
            const header = $('.site-header .container');
            if (header) {
                const searchWrapper = createElement('div', 'search-wrapper');
                searchWrapper.innerHTML = SEARCH_HTML;
                header.appendChild(searchWrapper);
            }
        },

        initializeSearch() {
            // Cache DOM elements
            this.elements = {
                searchIcon: $('.search-icon'),
                searchContainer: $('.search-container'),
                searchForm: $('.search-form'),
                searchInput: $('.search-input'),
                searchClose: $('.search-close'),
                productGrid: $('.product-grid'),
                noResultsContainer: null
            };

            // Event delegation for better performance
            const { searchIcon, searchContainer, searchForm, searchInput, searchClose } = this.elements;

            // Mobile search toggle
            searchIcon?.addEventListener('click', () => {
                searchContainer?.classList.add('active');
                searchInput?.focus();
            });

            searchClose?.addEventListener('click', () => {
                searchContainer?.classList.remove('active');
                if (!searchInput.value) {
                    this.resetSearch();
                }
            });

            // Debounced search
            searchInput?.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                const query = e.target.value.trim();
                
                if (query === this.lastQuery) return;
                
                this.searchTimeout = setTimeout(() => {
                    this.performSearch(query);
                    this.lastQuery = query;
                }, 300);
            });

            // Form submission
            searchForm?.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    this.performSearch(query);
                }
            });

            // Handle escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && searchContainer?.classList.contains('active')) {
                    searchContainer.classList.remove('active');
                }
            });
        },

        async performSearch(query) {
            const { productGrid } = this.elements;
            if (!productGrid) return;

            const products = [...productGrid.children];
            const normalizedQuery = query.toLowerCase();

            if (!query) {
                this.resetSearch();
                this.updateURL('search', '');
                return;
            }

            let hasResults = false;
            const fragment = document.createDocumentFragment();

            products.forEach(product => {
                const productName = product.querySelector('.product-name')?.textContent.toLowerCase() || '';
                const productBrand = product.querySelector('.product-brand')?.textContent.toLowerCase() || '';
                
                if (productName.includes(normalizedQuery) || productBrand.includes(normalizedQuery)) {
                    product.style.display = '';
                    fragment.appendChild(product);
                    hasResults = true;
                } else {
                    product.style.display = 'none';
                }
            });

            if (hasResults) {
                productGrid.innerHTML = '';
                productGrid.appendChild(fragment);
                this.showNoResultsMessage(false);
            } else {
                this.showNoResultsMessage(true, query);
            }

            this.updateURL('search', query);
        },

        resetSearch() {
            const { searchInput, productGrid } = this.elements;
            if (searchInput) searchInput.value = '';
            if (productGrid) {
                [...productGrid.children].forEach(product => {
                    product.style.display = '';
                });
            }
            this.showNoResultsMessage(false);
            this.lastQuery = '';
        },

        showNoResultsMessage(show, query = '') {
            if (!this.elements.noResultsContainer) {
                this.elements.noResultsContainer = createElement('div', 'no-results-message');
                this.elements.noResultsContainer.innerHTML = `
                    <div class="no-results-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>No Results Found</h3>
                    <p>We couldn't find any products matching your search.</p>
                    <button class="btn reset-search-btn">Clear Search</button>
                `;

                const resetBtn = this.elements.noResultsContainer.querySelector('.reset-search-btn');
                resetBtn?.addEventListener('click', () => this.resetSearch());
            }

            const { productGrid, noResultsContainer } = this.elements;
            if (!productGrid || !noResultsContainer) return;

            if (show) {
                if (!productGrid.contains(noResultsContainer)) {
                    productGrid.appendChild(noResultsContainer);
                }
                noResultsContainer.style.display = 'flex';
            } else if (productGrid.contains(noResultsContainer)) {
                noResultsContainer.style.display = 'none';
            }
        },

        updateURL(param, value) {
            const url = new URL(window.location.href);
            if (value) {
                url.searchParams.set(param, value);
            } else {
                url.searchParams.delete(param);
            }
            window.history.replaceState({}, '', url);
        }
    };

    // Initialize search when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => search.init());
    } else {
        search.init();
    }
})();
 