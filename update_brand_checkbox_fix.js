/**
 * UPDATE BRAND PAGES - CHECKBOX FIX
 * 
 * This script updates all brand-specific HTML pages to include the checkbox fix script.
 */

const fs = require('fs');
const path = require('path');

// List of brand pages
const brandPages = [
  'adidas.html',
  'asics.html',
  'converse.html',
  'jordan.html',
  'new-balance.html',
  'nike.html',
  'puma.html',
  'reebok.html'
];

// Function to update a single brand page
function updateBrandPage(brandFile) {
  const filePath = path.join(__dirname, 'brands', brandFile);
  
  // Read the file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading ${brandFile}:`, err);
      return;
    }
    
    // Check if the checkbox-fix.js script is already included
    if (data.includes('checkbox-fix.js')) {
      console.log(`${brandFile}: checkbox-fix.js already included`);
      return;
    }
    
    // Find the position to insert the checkbox fix script
    const insertAfter = '<script src="../js/filter-fix.js"></script>';
    const insertPosition = data.indexOf(insertAfter);
    
    if (insertPosition === -1) {
      console.error(`${brandFile}: Could not find insertion point`);
      return;
    }
    
    // Insert the checkbox fix script
    const newScriptTag = `${insertAfter}
    <!-- CRITICAL CHECKBOX FIX - Must be loaded after filter-fix.js -->
    <script src="../js/checkbox-fix.js"></script>`;
    
    // Replace the old script tag with the new one (with our addition)
    const updatedData = data.replace(insertAfter, newScriptTag);
    
    // Write the updated content back to the file
    fs.writeFile(filePath, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error(`Error writing to ${brandFile}:`, writeErr);
        return;
      }
      console.log(`Successfully updated ${brandFile}`);
    });
  });
}
    
// Update all brand pages
console.log('Starting to update brand pages with checkbox fix...');
brandPages.forEach(brandFile => {
  updateBrandPage(brandFile);
}); 