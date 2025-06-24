/**
 * UPDATE BRAND PAGES - CHECKBOX CSS FIX
 * 
 * This script updates all brand-specific HTML pages to include the checkbox fix CSS.
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
    
    // Check if the checkbox-fix.css is already included
    if (data.includes('checkbox-fix.css')) {
      console.log(`${brandFile}: checkbox-fix.css already included`);
      return;
    }
    
    // Find the position to insert the checkbox fix CSS
    const insertAfter = '<link rel="stylesheet" href="../css/grid-fix.css">';
    const insertPosition = data.indexOf(insertAfter);
    
    if (insertPosition === -1) {
      console.error(`${brandFile}: Could not find insertion point`);
      return;
    }
    
    // Insert the checkbox fix CSS
    const newCssLink = `${insertAfter}
    <!-- CRITICAL: Checkbox fix CSS -->
    <link rel="stylesheet" href="../css/checkbox-fix.css">`;
    
    // Replace the old link tag with the new one (with our addition)
    const updatedData = data.replace(insertAfter, newCssLink);
    
    // Write the updated content back to the file
    fs.writeFile(filePath, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error(`Error writing to ${brandFile}:`, writeErr);
        return;
      }
      console.log(`Successfully updated ${brandFile} with CSS fix`);
    });
  });
}
    
// Update all brand pages
console.log('Starting to update brand pages with checkbox CSS fix...');
brandPages.forEach(brandFile => {
  updateBrandPage(brandFile);
}); 