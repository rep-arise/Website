/**
 * Script to update all brand pages by removing demo products
 * Run this script with Node.js
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
    
    // Replace dollar signs with rupee symbol in price inputs
    let updatedData = data.replace(
      /<span>\$<\/span>/g, 
      '<span>₹</span>'
    );
    
    // Replace dollar signs with rupee symbol in modal price
    updatedData = updatedData.replace(
      /<p class="modal-price">\$(\d+\.\d+)<\/p>/g, 
      '<p class="modal-price">₹$1</p>'
    );
    
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
console.log('Starting to update brand pages...');
brandPages.forEach(brandFile => {
  updateBrandPage(brandFile);
});

console.log('All brand pages updated successfully!'); 