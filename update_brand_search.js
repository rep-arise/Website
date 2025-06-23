/**
 * Script to add search.js to all brand pages
 */
const fs = require('fs');
const path = require('path');

// List of brand HTML files
const brandFiles = [
  'adidas.html',
  'asics.html',
  'converse.html',
  'jordan.html',
  'new-balance.html',
  'nike.html',
  'puma.html',
  'reebok.html'
];

// Update each brand page
brandFiles.forEach(brandFile => {
  const filePath = path.join(__dirname, 'brands', brandFile);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if search.js is already included
    if (!content.includes('search.js')) {
      // Add search.js script before the closing body tag
      content = content.replace('</body>', '    <script src="../js/search.js"></script>\n</body>');
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Added search.js to ${brandFile}`);
    } else {
      console.log(`${brandFile} already has search.js`);
    }
  } catch (error) {
    console.error(`Error updating ${brandFile}:`, error);
  }
});

console.log('All brand pages updated successfully!'); 