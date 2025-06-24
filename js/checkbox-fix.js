/**
 * CRITICAL CHECKBOX FIX
 * 
 * This script fixes the issue where checkboxes in the filter sidebar are not working correctly.
 */

(function() {
    console.log('CHECKBOX FIX: Script loaded');
    
    // Initialize once the DOM is loaded
    document.addEventListener('DOMContentLoaded', initCheckboxFix);
    
    function initCheckboxFix() {
        console.log('CHECKBOX FIX: Initializing');
        setupFilterEventListeners();
    }
    
    function setupFilterEventListeners() {
        console.log('CHECKBOX FIX: Setting up event listeners');
        
        // Get all checkboxes in the filter sidebar
        const allCheckboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"]');
        console.log(`CHECKBOX FIX: Found ${allCheckboxes.length} checkboxes`);
        
        // Set up event listeners for each checkbox
        allCheckboxes.forEach(checkbox => {
            // Remove any existing event listeners
            const newCheckbox = checkbox.cloneNode(true);
            checkbox.parentNode.replaceChild(newCheckbox, checkbox);
            
            // Add new event listener
            newCheckbox.addEventListener('change', function() {
                console.log(`CHECKBOX FIX: Checkbox ${this.name}:${this.value} changed to ${this.checked}`);
                
                // Trigger filter application
                const applyFilterBtn = document.querySelector('.apply-filter');
                if (applyFilterBtn) {
                    applyFilterBtn.click();
                }
            });
        });
        
        // Set up filter buttons
        const applyFilterBtn = document.querySelector('.apply-filter');
        const clearFilterBtn = document.querySelector('.clear-filter');
        
        if (applyFilterBtn) {
            applyFilterBtn.addEventListener('click', function() {
                console.log('CHECKBOX FIX: Apply filter clicked');
            });
        }
        
        if (clearFilterBtn) {
            clearFilterBtn.addEventListener('click', function() {
                console.log('CHECKBOX FIX: Clear filter clicked');
                allCheckboxes.forEach(checkbox => checkbox.checked = false);
            });
        }
    }
})(); 