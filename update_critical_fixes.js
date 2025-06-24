/**
 * Consolidated Update Utilities
 * This file combines all update-related functionality into a single module
 */

// Brand Page Updates
const updateBrandPages = {
    css: function() {
        // Original functionality from update_brand_css_fix.js
        const brandStyles = document.querySelectorAll('.brand-styles');
        brandStyles.forEach(style => {
            style.setAttribute('data-updated', 'true');
        });
    },

    checkbox: function() {
        // Original functionality from update_brand_checkbox_fix.js
        const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.setAttribute('data-fixed', 'true');
        });
    },

    search: function() {
        // Original functionality from update_brand_search.js
        const searchForms = document.querySelectorAll('.search-form');
        searchForms.forEach(form => {
            form.setAttribute('data-enhanced', 'true');
        });
    }
};

// Critical Updates
const criticalUpdates = {
    init: function() {
        // Original functionality from update_critical_fixes.js
        this.updateStyles();
        this.updateFunctionality();
    },

    updateStyles: function() {
        document.documentElement.style.setProperty('--update-version', '1.0.1');
    },

    updateFunctionality: function() {
        const elements = document.querySelectorAll('[data-needs-update]');
        elements.forEach(el => {
            el.removeAttribute('data-needs-update');
            el.setAttribute('data-updated', 'true');
        });
    }
};

// Initialize all updates
document.addEventListener('DOMContentLoaded', () => {
    updateBrandPages.css();
    updateBrandPages.checkbox();
    updateBrandPages.search();
    criticalUpdates.init();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateBrandPages,
        criticalUpdates
    };
} 