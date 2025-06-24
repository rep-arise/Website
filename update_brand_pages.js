/**
 * UPDATE BRAND PAGES
 * 
 * This script updates all brand-specific HTML pages to include the new filtering scripts.
 * It ensures consistent script loading across all pages.
 */

const fs = require('fs');
const path = require('path');

// Define the brand pages directory
const brandsDir = path.join(__dirname, 'brands');

// Get all HTML files in the brands directory
const brandFiles = fs.readdirSync(brandsDir)
    .filter(file => file.endsWith('.html'));

console.log(`Found ${brandFiles.length} brand HTML files to update.`);

// The scripts section to replace in each file
const oldScriptPattern = /<!-- CRITICAL FIXES[\s\S]*?<\/body>/;

// The new scripts to insert
const newScripts = `<!-- CRITICAL FIXES - DO NOT REMOVE -->
    <link rel="stylesheet" href="../css/grid-fix.css">
    <script src="../js/currency-fix.js"></script>
    <script src="../js/filter-fix.js"></script>
    
    <!-- CRITICAL BRAND FILTER FIX - AGGRESSIVE VERSION -->
    <script src="../js/product-card-fix.js"></script>
    <script src="../js/direct-brand-filter.js"></script>
    <script src="../js/brand-filter-fix.js"></script>
    
    <!-- CRITICAL: Load cache-buster first to prevent caching of other scripts -->
    <script src="../js/cache-buster.js"></script>
    <script src="../js/cache-buster-sw.js"></script>
</body>`;

// Add cache control meta tags
const headPattern = /<head>[\s\S]*?<\/head>/;
const cacheControlMeta = `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$BRAND_NAME Collection - Rep Arise</title>
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/grid-fix.css">
    <!-- CRITICAL: Prevent caching -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
</head>`;

// Process each brand file
brandFiles.forEach(file => {
    const filePath = path.join(brandsDir, file);
    
    // Extract brand name from filename
    const brandName = file.replace('.html', '');
    const brandNameCapitalized = brandName.charAt(0).toUpperCase() + brandName.slice(1);
    
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the head section to add cache control
    content = content.replace(headPattern, cacheControlMeta.replace('$BRAND_NAME', brandNameCapitalized));
    
    // Replace the scripts section
    content = content.replace(oldScriptPattern, newScripts);
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content);
    
    console.log(`Updated ${file}`);
});

console.log('All brand pages updated successfully!'); 