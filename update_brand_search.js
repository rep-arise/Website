/**
 * Script to add search.js to all brand pages
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
    
    // Check if the file already has our fixes
    if (data.includes('grid-fix.css') && data.includes('deep-debug.js') && data.includes('direct-fix.js')) {
      console.log(`${brandFile} already has the critical fixes, skipping...`);
      return;
    }
    
    // Add emergency-fix.js if it's not already there
    if (!data.includes('emergency-fix.js')) {
      data = data.replace(
        /<script src="\.\.\/js\/app\.js(\?v=[\d\.]+)?"><\/script>/,
        '<script src="../js/app.js$1"></script>\n    <script src="../js/emergency-fix.js"></script>'
      );
    }
    
    // Add our critical fixes
    if (!data.includes('</body>')) {
      console.error(`${brandFile} doesn't have a closing body tag, cannot update`);
      return;
    }
    
    // Add our critical fixes before the closing body tag
    const criticalFixes = `
    <!-- Critical fixes for product filtering -->
    <link rel="stylesheet" href="../css/grid-fix.css">
    <script src="../js/deep-debug.js"></script>
    <script src="../js/direct-fix.js"></script>
`;
    
    data = data.replace('</body>', `${criticalFixes}</body>`);
    
    // Write the updated file
    fs.writeFile(filePath, data, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing ${brandFile}:`, err);
        return;
      }
      console.log(`Successfully updated ${brandFile} with critical fixes`);
    });
  });
}

// Update all brand pages
brandPages.forEach(updateBrandPage);

console.log('Started updating all brand pages with critical fixes...'); 