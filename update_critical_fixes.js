/**
 * Script to update all HTML files with critical fixes
 * Run this script with Node.js
 */

const fs = require('fs');
const path = require('path');

// List of HTML files to update
const htmlFiles = [
  'products.html',
  'brands/nike.html',
  'brands/adidas.html',
  'brands/asics.html',
  'brands/converse.html',
  'brands/jordan.html',
  'brands/new-balance.html',
  'brands/puma.html',
  'brands/reebok.html'
];

// Function to update a single HTML file
function updateHtmlFile(filePath) {
  // Get the relative path for script references
  const isInSubfolder = filePath.includes('/');
  const scriptPrefix = isInSubfolder ? '../' : '';
  
  // Read the file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading ${filePath}:`, err);
      return;
    }
    
    // Check if the file already has our fixes
    if (data.includes('currency-fix.js') && data.includes('filter-fix.js')) {
      console.log(`${filePath} already has the critical fixes, skipping...`);
      return;
    }
    
    // Add our critical fixes before the closing body tag
    const criticalFixes = `
    <!-- CRITICAL FIXES - DO NOT REMOVE -->
    <link rel="stylesheet" href="${scriptPrefix}css/grid-fix.css">
    <script src="${scriptPrefix}js/currency-fix.js"></script>
    <script src="${scriptPrefix}js/filter-fix.js"></script>
`;
    
    data = data.replace('</body>', `${criticalFixes}</body>`);
    
    // Write the updated file
    fs.writeFile(filePath, data, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing ${filePath}:`, err);
        return;
      }
      console.log(`Successfully updated ${filePath} with critical fixes`);
    });
  });
}

// Update all HTML files
htmlFiles.forEach(file => {
  updateHtmlFile(file);
});

console.log('Started updating all HTML files with critical fixes...'); 