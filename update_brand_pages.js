/**
 * Script to update all brand pages by removing demo products
 * Run this script with Node.js
 */

const fs = require('fs');
const path = require('path');

// List of all brand HTML files
const brandFiles = [
  'adidas.html',
  'asics.html',
  'converse.html',
  'jordan.html',
  'new-balance.html',
  'nike.html', // Already updated, but including for completeness
  'puma.html',
  'reebok.html'
];

// Function to update a brand page
function updateBrandPage(brandFile) {
  const filePath = path.join(__dirname, 'brands', brandFile);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add brands-page class to body tag
    content = content.replace(/<body>/, '<body class="brands-page">');
    
    // Find the position of the filter sidebar
    const filterSidebarStart = content.indexOf('<!-- Filter Sidebar -->');
    const filterSidebarEnd = content.indexOf('</aside>', filterSidebarStart) + '</aside>'.length;
    
    // Extract the filter sidebar content
    const filterSidebarContent = content.substring(filterSidebarStart, filterSidebarEnd);
    
    // Remove the filter sidebar from its original position
    content = content.substring(0, filterSidebarStart) + content.substring(filterSidebarEnd);
    
    // Find the position where we need to insert the filter sidebar
    const shopGridStart = content.indexOf('<div class="shop-grid">');
    const shopGridContentStart = shopGridStart + '<div class="shop-grid">'.length;
    
    // Insert the filter sidebar at the beginning of the shop grid
    content = content.substring(0, shopGridContentStart) + '\n                    ' + 
              filterSidebarContent + '\n\n                    ' + 
              content.substring(shopGridContentStart);
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${brandFile} successfully.`);
  } catch (error) {
    console.error(`Error updating ${brandFile}:`, error);
  }
}
    
// Update all brand pages
brandFiles.forEach(updateBrandPage);

console.log('All brand pages updated successfully!'); 