/**
 * Rep Arise - Search Functionality
 * Version: 1.2
 */

// Simple search functionality for Rep Arise
document.addEventListener('DOMContentLoaded', function() {
    // 1. Add search UI to the navigation
    addSearchUI();
    
    // 2. Initialize search functionality
    initializeSearch();
});

function addSearchUI() {
    // Find the nav-icons container
    const navIcons = document.querySelector('.nav-icons');
    if (!navIcons) return;
    
    // Clear existing content
    navIcons.innerHTML = '';
    
    // Create search HTML
    const searchHTML = `
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
    
    // Add search HTML to nav-icons
    navIcons.innerHTML = searchHTML;
    
    // Add search styles
    const searchStyles = `
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
    
    // Add styles to head
    const styleElement = document.createElement('style');
    styleElement.textContent = searchStyles;
    document.head.appendChild(styleElement);
}

function initializeSearch() {
    // Get search elements
    const searchIcon = document.querySelector('.search-icon');
    const searchInput = document.querySelector('.search-input');
    const searchForm = document.querySelector('.search-form');
    const searchContainer = document.querySelector('.search-container');
    const searchCloseBtn = document.querySelector('.search-close');
    
    // Mobile search toggle
    if (searchIcon && searchContainer) {
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            searchContainer.classList.toggle('active');
            
            // Focus on input when opened
            if (searchContainer.classList.contains('active') && searchInput) {
                setTimeout(() => {
                    searchInput.focus();
                }, 300);
            }
        });
    }
    
    // Close search on mobile
    if (searchCloseBtn && searchContainer) {
        searchCloseBtn.addEventListener('click', function() {
            searchContainer.classList.remove('active');
        });
    }
    
    // Handle search submission
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (searchInput && searchInput.value.trim() !== '') {
                performSearch(searchInput.value.trim());
            }
        });
    }
    
    // Handle search input for real-time filtering
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (this.value.trim().length >= 2) {
                performSearch(this.value.trim());
            } else if (this.value.trim() === '') {
                resetSearch();
            }
        });
    }
    
    // Check URL for search parameter
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery && searchInput) {
        searchInput.value = searchQuery;
        performSearch(searchQuery);
    }
}

function performSearch(query) {
    // Convert query to lowercase for case-insensitive search
    query = query.toLowerCase();
    
    // Get all product cards
    const productCards = document.querySelectorAll('.product-card');
    if (!productCards.length) return;
    
    let matchCount = 0;
    
    // Filter products based on search query
    productCards.forEach(card => {
        try {
            const productName = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const productBrand = card.getAttribute('data-brand')?.toLowerCase() || '';
            const productCategory = card.getAttribute('data-category')?.toLowerCase() || '';
            const productCollection = card.getAttribute('data-collection')?.toLowerCase() || '';
            
            // Check if product matches search query
            if (productName.includes(query) || 
                productBrand.includes(query) || 
                productCategory.includes(query) || 
                productCollection.includes(query)) {
                card.style.display = 'flex';
                matchCount++;
            } else {
                card.style.display = 'none';
            }
        } catch (err) {
            // Silently fail for any errors
        }
    });
    
    // Show/hide no results message
    showNoResultsMessage(matchCount === 0, query);
    
    // Update URL with search query
    const url = new URL(window.location);
    url.searchParams.set('search', query);
    window.history.replaceState({}, '', url);
}

function resetSearch() {
    // Show all products
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.display = 'flex';
    });
    
    // Hide no results message
    showNoResultsMessage(false);
    
    // Remove search param from URL
    const url = new URL(window.location);
    url.searchParams.delete('search');
    window.history.replaceState({}, '', url);
}

function showNoResultsMessage(show, query = '') {
    // Remove existing message if any
    const existingMsg = document.querySelector('.no-results-message');
    if (existingMsg) existingMsg.remove();
    
    if (show) {
        // Create new message
        const noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results-message';
        
        noResultsMsg.innerHTML = `
            <div class="no-results-icon">
                <i class="fas fa-search"></i>
            </div>
            <h3>No products found</h3>
            <p>No products match your search for "${query}"</p>
            <button class="btn primary-btn reset-search-btn">Clear Search</button>
        `;
        
        // Add to products grid
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
            productsGrid.appendChild(noResultsMsg);
            
            // Add event listener to reset button
            const resetBtn = noResultsMsg.querySelector('.reset-search-btn');
            if (resetBtn) {
                resetBtn.addEventListener('click', function() {
                    const searchInput = document.querySelector('.search-input');
                    if (searchInput) {
                        searchInput.value = '';
                    }
                    resetSearch();
                });
            }
        }
    }
}
 