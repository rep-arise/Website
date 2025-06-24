/**
 * CRITICAL CHECKBOX FIX
 * 
 * This script fixes the issue where only brand checkboxes are clickable in the filter sidebar.
 * It ensures all checkboxes in the filter sidebar work correctly.
 */

(function() {
    console.log('CHECKBOX FIX: Script loaded');
    
    // Initialize immediately and after a short delay
    initCheckboxFix();
    setTimeout(initCheckboxFix, 500);
    
    function initCheckboxFix() {
        console.log('CHECKBOX FIX: Initializing');
        
        // Fix all checkboxes in the filter sidebar
        fixFilterCheckboxes();
        
        // Set up event listeners for filter buttons
        setupFilterEventListeners();
    }
    
    function fixFilterCheckboxes() {
        console.log('CHECKBOX FIX: Fixing filter checkboxes');
        
        // Get all checkboxes in the filter sidebar
        const allCheckboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"]');
        console.log(`CHECKBOX FIX: Found ${allCheckboxes.length} checkboxes in filter sidebar`);
        
        // Fix each checkbox
        allCheckboxes.forEach(checkbox => {
            // Remove pointer-events: none if present
            checkbox.style.pointerEvents = 'auto';
            
            // Fix the parent label
            const label = checkbox.closest('label');
            if (label) {
                label.style.pointerEvents = 'auto';
                
                // Fix the checkmark span
                const checkmark = label.querySelector('.checkmark');
                if (checkmark) {
                    checkmark.style.pointerEvents = 'none'; // Let clicks pass through to the checkbox
                }
                
                // Fix the option text span
                const optionText = label.querySelector('.option-text');
                if (optionText) {
                    optionText.style.pointerEvents = 'none'; // Let clicks pass through to the checkbox
                }
            }
            
            // Make sure the checkbox is not disabled
            checkbox.disabled = false;
        });
        
        // Fix the filter options container
        const filterOptions = document.querySelectorAll('.filter-options');
        filterOptions.forEach(container => {
            container.style.pointerEvents = 'auto';
        });
        
        // Fix the filter groups
        const filterGroups = document.querySelectorAll('.filter-group');
        filterGroups.forEach(group => {
            group.style.pointerEvents = 'auto';
        });
    }
    
    function setupFilterEventListeners() {
        console.log('CHECKBOX FIX: Setting up event listeners');
        
        // Category checkboxes
        document.querySelectorAll('input[name="category"]').forEach(checkbox => {
            // Remove any existing event listeners by cloning
            const newCheckbox = checkbox.cloneNode(true);
            checkbox.parentNode.replaceChild(newCheckbox, checkbox);
            
            // Add new event listener
            newCheckbox.addEventListener('change', function() {
                console.log(`CHECKBOX FIX: Category checkbox ${this.value} changed to ${this.checked}`);
                
                // Trigger filter application
                const applyFilterBtn = document.querySelector('.apply-filter');
                if (applyFilterBtn) {
                    setTimeout(() => {
                        applyFilterBtn.click();
                    }, 100);
                }
            });
        });
        
        // Size checkboxes
        document.querySelectorAll('input[name="size"]').forEach(checkbox => {
            // Remove any existing event listeners by cloning
            const newCheckbox = checkbox.cloneNode(true);
            checkbox.parentNode.replaceChild(newCheckbox, checkbox);
            
            // Add new event listener
            newCheckbox.addEventListener('change', function() {
                console.log(`CHECKBOX FIX: Size checkbox ${this.value} changed to ${this.checked}`);
                
                // Trigger filter application
                const applyFilterBtn = document.querySelector('.apply-filter');
                if (applyFilterBtn) {
                    setTimeout(() => {
                        applyFilterBtn.click();
                    }, 100);
                }
            });
        });
        
        // Collection checkboxes (for brand-specific pages)
        document.querySelectorAll('input[name="collection"]').forEach(checkbox => {
            // Remove any existing event listeners by cloning
            const newCheckbox = checkbox.cloneNode(true);
            checkbox.parentNode.replaceChild(newCheckbox, checkbox);
            
            // Add new event listener
            newCheckbox.addEventListener('change', function() {
                console.log(`CHECKBOX FIX: Collection checkbox ${this.value} changed to ${this.checked}`);
                
                // Trigger filter application
                const applyFilterBtn = document.querySelector('.apply-filter');
                if (applyFilterBtn) {
                    setTimeout(() => {
                        applyFilterBtn.click();
                    }, 100);
                }
            });
        });
        
        // Make sure brand checkboxes also work
        document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
            // Remove any existing event listeners by cloning
            const newCheckbox = checkbox.cloneNode(true);
            checkbox.parentNode.replaceChild(newCheckbox, checkbox);
            
            // Add new event listener
            newCheckbox.addEventListener('change', function() {
                console.log(`CHECKBOX FIX: Brand checkbox ${this.value} changed to ${this.checked}`);
                
                // Trigger filter application
                const applyFilterBtn = document.querySelector('.apply-filter');
                if (applyFilterBtn) {
                    setTimeout(() => {
                        applyFilterBtn.click();
                    }, 100);
                }
            });
        });
    }
    
    // Fix CSS issues that might be causing the problem
    function fixCheckboxCSS() {
        // Create a style element
        const style = document.createElement('style');
        style.textContent = `
            .filter-option input[type="checkbox"] {
                opacity: 1 !important;
                pointer-events: auto !important;
                position: relative !important;
                z-index: 2 !important;
            }
            
            .filter-option .checkmark {
                pointer-events: none !important;
            }
            
            .filter-option {
                pointer-events: auto !important;
            }
            
            .filter-options {
                pointer-events: auto !important;
            }
            
            .filter-group {
                pointer-events: auto !important;
            }
        `;
        
        // Add the style to the document head
        document.head.appendChild(style);
        console.log('CHECKBOX FIX: Added CSS fixes');
    }
    
    // Run the CSS fix
    fixCheckboxCSS();
    
    // Set up a MutationObserver to detect when new checkboxes are added
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if any added nodes contain checkboxes
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        const checkboxes = node.querySelectorAll('input[type="checkbox"]');
                        if (checkboxes.length > 0) {
                            console.log('CHECKBOX FIX: Detected new checkboxes, fixing them');
                            fixFilterCheckboxes();
                            setupFilterEventListeners();
                        }
                    }
                });
            }
        });
    });
    
    // Start observing the document
    observer.observe(document.body, { childList: true, subtree: true });
})(); 