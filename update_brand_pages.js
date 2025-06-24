/**
 * Script to update all brand pages to include the brand-filter-fix.js script
 */

const fs = require('fs');
const path = require('path');

// List of brand HTML files to update
const brandPages = [
    'brands/adidas.html',
    'brands/asics.html',
    'brands/converse.html',
    'brands/jordan.html',
    'brands/new-balance.html',
    'brands/nike.html',
    'brands/puma.html',
    'brands/reebok.html'
];

// Function to update a single brand page
function updateBrandPage(filePath) {
    console.log(`Updating ${filePath}...`);
    
    try {
        // Read the file content
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the brand-filter-fix.js script is already included
        if (content.includes('brand-filter-fix.js')) {
            console.log(`  - brand-filter-fix.js already included in ${filePath}`);
            return;
        }
        
        // Find the position to insert the new script
        const insertAfter = '<script src="../js/filter-fix.js"></script>';
        const insertPosition = content.indexOf(insertAfter);
        
        if (insertPosition === -1) {
            console.error(`  - Could not find insertion point in ${filePath}`);
            return;
        }
        
        // Insert the new script tag
        const newScriptTag = `${insertAfter}
    <!-- CRITICAL BRAND FILTER FIX - MUST LOAD AFTER filter-fix.js -->
    <script src="../js/brand-filter-fix.js"></script>`;
        
        // Replace the old script tag with the new one (with our addition)
        content = content.replace(insertAfter, newScriptTag);
        
        // Write the updated content back to the file
        fs.writeFileSync(filePath, content, 'utf8');
        
        console.log(`  - Successfully updated ${filePath}`);
    } catch (error) {
        console.error(`  - Error updating ${filePath}:`, error.message);
    }
}

// Update all brand pages
console.log('Starting brand page updates...');
brandPages.forEach(updateBrandPage);
console.log('Brand page updates completed.'); 