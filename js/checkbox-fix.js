/**
 * CRITICAL CHECKBOX FIX
 * 
 * This script fixes the issue where checkboxes in the filter sidebar are not working correctly.
 */

(() => {
    // DOM helper functions
    const $ = selector => document.querySelector(selector);
    const $$ = selector => document.querySelectorAll(selector);

    // Checkbox functionality
    const checkboxFix = {
        init() {
        console.log('CHECKBOX FIX: Initializing');
            this.setupFilterEventListeners();
        },

        setupFilterEventListeners() {
            console.log('CHECKBOX FIX: Setting up event listeners');
            
            const allCheckboxes = $$('.filter-sidebar input[type="checkbox"]');
            console.log(`CHECKBOX FIX: Found ${allCheckboxes.length} checkboxes`);
            
            this.initCheckboxes(allCheckboxes);
            this.initFilterButtons(allCheckboxes);
        },

        initCheckboxes(checkboxes) {
            checkboxes.forEach(checkbox => {
                // Remove any existing event listeners
            const newCheckbox = checkbox.cloneNode(true);
            checkbox.parentNode.replaceChild(newCheckbox, checkbox);
            
            // Add new event listener
                newCheckbox.addEventListener('change', () => {
                    console.log(`CHECKBOX FIX: Checkbox ${newCheckbox.name}:${newCheckbox.value} changed to ${newCheckbox.checked}`);
                
                // Trigger filter application
                    const applyFilterBtn = $('.apply-filter');
                    if (applyFilterBtn) applyFilterBtn.click();
                });
            });
        },

        initFilterButtons(checkboxes) {
            const applyFilterBtn = $('.apply-filter');
            const clearFilterBtn = $('.clear-filter');
            
                if (applyFilterBtn) {
                applyFilterBtn.addEventListener('click', () => {
                    console.log('CHECKBOX FIX: Apply filter clicked');
                });
            }
            
            if (clearFilterBtn) {
                clearFilterBtn.addEventListener('click', () => {
                    console.log('CHECKBOX FIX: Clear filter clicked');
                    checkboxes.forEach(checkbox => checkbox.checked = false);
                });
            }
        }
    };

    // Initialize when DOM is loaded
    console.log('CHECKBOX FIX: Script loaded');
    document.addEventListener('DOMContentLoaded', () => checkboxFix.init());
})(); 